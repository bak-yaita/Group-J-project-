from rest_framework import viewsets, status, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from ..models.issues import Issue
from ..serializers import IssueSerializer, IssueAssignmentSerializer, IssueResolutionSerializer
from rest_framework.decorators import action
from aitsapp.models import Notification
from aitsapp.permissions import IsAdmin,IsLecturer, IsRegistrar,IsOwnerOrStaff,IsStudent,CanResolveIssue


class IssueViewSet(viewsets.ModelViewSet):
    """
    A viewset for submitting and managing issues with role-based access control.
    """
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['issue_type', 'description','full_name', 'registration_number', 'subject', 'course_code']
    ordering_fields = ['created_at', 'updated_at', 'status']
    filterset_fields = {
        'status': ['exact'],
        'issue_type': ['exact'],
        'assigned_to': ['exact', 'isnull'],
        'student__college': ['exact'],
    }

    def get_permissions(self):
        """
        Override to return appropriate permissions for each action.
        """
        if self.action == 'create':
            permission_classes = [IsAuthenticated, IsStudent]
        elif self.action == 'list':
            permission_classes = [IsAuthenticated]
        elif self.action == 'retrieve' or self.action == 'update' or self.action == 'partial_update':
            permission_classes = [IsAuthenticated, IsOwnerOrStaff]
        elif self.action == 'destroy':
            permission_classes = [IsAuthenticated, IsAdmin]
        elif self.action == 'assign':
            permission_classes = [IsAuthenticated, IsRegistrar]
        elif self.action == 'resolve':
            permission_classes = [IsAuthenticated, CanResolveIssue]
        elif self.action == 'statistics':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """
        Filter queryset based on user role.
        """
        user = self.request.user
        
        if not user.is_authenticated:
            return Issue.objects.none()
            
        if user.is_staff or user.role == 'admin':
            return Issue.objects.all()
            
        if user.role == 'registrar':
            return Issue.objects.filter(student__college=user.college)
            
        if user.role == 'lecturer':
            return Issue.objects.filter(assigned_to=user)
            
        if user.role == 'student':
            return Issue.objects.filter(student=user)
            
        return Issue.objects.none()
    
    def create(self, request, *args, **kwargs):
        """
        Handle issue submission with role-based validation.
        """
        user = request.user

        if not hasattr(user, 'college'):
            return Response({"error": "You must belong to a college to submit an issue."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            issue = serializer.save()  
            
            # Create notification for registrar
            self._create_notification_for_registrars(issue, f"New issue submitted by {user.first_name} {user.last_name}")
            
            return Response({"message": "Issue submitted successfully!"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['POST'])
    def assign(self, request, pk=None):
        """
        Assign an issue to a lecturer.
        """
        issue = self.get_object()
        
        # This check is now redundant due to get_permissions(), but kept for extra safety
        if not request.user.is_staff and request.user.role != 'registrar':
            return Response(
                {"error": "You do not have permission to assign issues."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = IssueAssignmentSerializer(data=request.data)
        if serializer.is_valid():
            lecturer_id = serializer.validated_data.get('assigned_to')
            notes = serializer.validated_data.get('notes', '')
            
            # Update the issue
            from django.contrib.auth import get_user_model
            User = get_user_model()
            
            try:
                lecturer = User.objects.get(id=lecturer_id)
                
                # Check if the assigned user is actually a lecturer
                if lecturer.role != 'lecturer':
                    return Response(
                        {"error": "Issues can only be assigned to lecturers."}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                issue.assigned_to = lecturer
                issue.status = 'assigned'
                issue.assignment_notes = notes
                issue.save()
                
                # Notify the lecturer
                self._create_notification_for_user(
                    lecturer, 
                    f"You have been assigned an issue: {issue.subject}"
                )
                
                # Notify the student
                self._create_notification_for_user(
                    issue.student, 
                    f"Your issue '{issue.subject}' has been assigned to {lecturer.first_name} {lecturer.last_name}"
                )
                
                return Response({"message": "Issue assigned successfully"})
            except User.DoesNotExist:
                return Response(
                    {"error": "Lecturer not found"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """
        Mark an issue as resolved.
        """
        issue = self.get_object()
        
        # Using the CanResolveIssue permission class now, but keeping this check for safety
        if not (request.user.is_staff or 
                request.user.role == 'registrar' or 
                (issue.assigned_to and issue.assigned_to == request.user)):
            return Response(
                {"error": "You do not have permission to resolve this issue."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = IssueResolutionSerializer(data=request.data)
        if serializer.is_valid():
            resolution_notes = serializer.validated_data.get('resolution_notes', '')
            
            # Update the issue
            issue.status = 'resolved'
            issue.resolution_notes = resolution_notes
            issue.save()
            
            # Notify the student
            self._create_notification_for_user(
                issue.student, 
                f"Your issue '{issue.subject}' has been resolved"
            )
            
            # Notify the assigned lecturer if there was one and they're not the one resolving
            if issue.assigned_to and issue.assigned_to != request.user:
                self._create_notification_for_user(
                    issue.assigned_to, 
                    f"Issue '{issue.subject}' has been marked as resolved"
                )
            
            return Response({"message": "Issue resolved successfully"})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Fetch key metrics: total, pending, and resolved issues.
        """
        user = request.user

        # Check if the user belongs to a college
        if not hasattr(user, 'college'):
            return Response({"error": "You must belong to a college to view statistics."}, status=status.HTTP_400_BAD_REQUEST)

        # Admins see all statistics
        if user.is_staff or user.role == 'admin':
            total_issues = Issue.objects.count()
            submitted_issues = Issue.objects.filter(status='submitted').count()
            assigned_issues = Issue.objects.filter(status='assigned').count()
            in_progress_issues = Issue.objects.filter(status='in_progress').count()
            resolved_issues = Issue.objects.filter(status='resolved').count()

        # Students see only their own issue statistics
        elif user.role == 'student':
            total_issues = Issue.objects.filter(student=user).count()
            submitted_issues = Issue.objects.filter(student=user, status='submitted').count()
            assigned_issues = Issue.objects.filter(student=user, status='assigned').count()
            in_progress_issues = Issue.objects.filter(student=user, status='in_progress').count()
            resolved_issues = Issue.objects.filter(student=user, status='resolved').count()

        # Lecturers see statistics for issues assigned to them only
        elif user.role == 'lecturer':
            total_issues = Issue.objects.filter(assigned_to=user).count()
            submitted_issues = 0  # Lecturers don't see submitted issues until assigned
            assigned_issues = Issue.objects.filter(assigned_to=user, status='assigned').count()
            in_progress_issues = Issue.objects.filter(assigned_to=user, status='in_progress').count()
            resolved_issues = Issue.objects.filter(assigned_to=user, status='resolved').count()

        # Registrars see statistics for the entire college
        elif user.role == 'registrar':
            total_issues = Issue.objects.filter(student__college=user.college).count()
            submitted_issues = Issue.objects.filter(student__college=user.college, status='submitted').count()
            assigned_issues = Issue.objects.filter(student__college=user.college, status='assigned').count()
            in_progress_issues = Issue.objects.filter(student__college=user.college, status='in_progress').count()
            resolved_issues = Issue.objects.filter(student__college=user.college, status='resolved').count()

        return Response({
            "total": total_issues,
            "pending": submitted_issues,  # Frontend expects "pending" instead of "submitted"
            "assigned": assigned_issues,
            "in_progress": in_progress_issues,
            "resolved": resolved_issues
        })
    
    def _create_notification_for_user(self, user, message):
        """Helper method to create a notification for a specific user."""
        Notification.objects.create(
            user=user,
            message=message,
            is_read=False
        )
    
    def _create_notification_for_registrars(self, issue, message):
        """Helper method to create notifications for all registrars in the college."""
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        # Get all registrars in the same college as the issue's student
        registrars = User.objects.filter(
            role='registrar',  # lowercase to match role choices
            college=issue.student.college
        )
        
        # Create a notification for each registrar
        for registrar in registrars:
            Notification.objects.create(
                user=registrar,
                message=message,
                is_read=False
            )