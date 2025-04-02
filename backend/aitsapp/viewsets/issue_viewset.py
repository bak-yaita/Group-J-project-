from rest_framework import viewsets, status, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from ..models.issues import Issue
from ..serializers import IssueSerializer
from rest_framework.decorators import action
from aitsapp.models import Notification

class IssueViewSet(viewsets.ModelViewSet):
    """
    A viewset for submitting and managing issues with role-based access control.
    """
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['issue_type', 'description','full_name', 'registration_number', 'subject', 'course_code']
    ordering_fields = ['created_at', 'updated_at', 'status']
    filterset_fields = {
        'status': ['exact'],
        'issue_type': ['exact'],
        'assigned_to': ['exact', 'isnull'],
        'student__college': ['exact'],
    }  # Added fields for filtering by status

    def get_queryset(self):
        """
        Restrict queryset based on user role and college.
        """
        user = self.request.user

        if user.is_staff:  # Admins can view all issues
            return Issue.objects.all()
        
        if hasattr(user, 'college'):
            if user.role == 'Registrar':
                return Issue.objects.filter(student__college=user.college)
            elif user.role == 'Lecturer':
                return Issue.objects.filter(
                    student__college=user.college
                ).filter(
                    assigned_to=user
                )
            elif user.role == 'Student':
                return Issue.objects.filter(student=user)

        return Issue.objects.none()  # Default: No access if no college is assigned

    def create(self, request, *args, **kwargs):
        """
        Handle issue submission with role-based validation.
        """
        user = request.user

        if not hasattr(user, 'college'):
            return Response({"error": "You must belong to a college to submit an issue."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save(student=user)  # Assign the logged-in student to the issue
            #create Notification for registrars
            self._create_notification_for_registrars(issue, f"New issue submitted by {user.first_name} {user.last_name}")
            return Response({"message": "Issue submitted successfully!"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        """
        Assign an issue to a lecturer.
        """
        issue = self.get_object()
        
        # Check if user is authorized (registrar or admin)
        if not request.user.is_staff and request.user.role != 'Registrar':
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
        
        # Check if user is authorized (registrar, assigned lecturer, or admin)
        if not (request.user.is_staff or 
                request.user.role == 'Registrar' or 
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
        if user.is_staff:
            total_issues = Issue.objects.count()
            submitted_issues = Issue.objects.filter(status='submitted').count()
            assigned_issues = Issue.objects.filter(status='assigned').count()
            in_progress_issues = Issue.objects.filter(status='in_progress').count()
            resolved_issues = Issue.objects.filter(status='resolved').count()

        # Students see only their own issue statistics
        elif user.role == 'Student':
            total_issues = Issue.objects.filter(student=user).count()
            submitted_issues = Issue.objects.filter(student=user, status='submitted').count()
            assigned_issues = Issue.objects.filter(student=user, status='assigned').count()
            in_progress_issues = Issue.objects.filter(student=user, status='in_progress').count()
            resolved_issues = Issue.objects.filter(student=user, status='resolved').count()

        # Lecturers see statistics for issues assigned to them only
        elif user.role == 'Lecturer':
            total_issues = Issue.objects.filter(assigned_to=user).count()
            submitted_issues = 0  # Lecturers don't see submitted issues until assigned
            assigned_issues = Issue.objects.filter(assigned_to=user, status='assigned').count()
            in_progress_issues = Issue.objects.filter(assigned_to=user, status='in_progress').count()
            resolved_issues = Issue.objects.filter(assigned_to=user, status='resolved').count()

        # Registrars see statistics for the entire college
        elif user.role == 'Registrar':
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
            role='Registrar',
            college=issue.student.college
        )
        
        # Create a notification for each registrar
        for registrar in registrars:
            Notification.objects.create(
                user=registrar,
                message=message,
                is_read=False
            )