from rest_framework import viewsets, status, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend

from ..models.issues import Issue
from ..serializers import IssueSerializer, IssueAssignmentSerializer, IssueResolutionSerializer
from ..models import Notification
from ..permissions import (
    IsAdmin, IsLecturer, IsRegistrar,
    IsOwnerOrStaff, IsStudent, CanResolveIssue, IsSameCollege, IsIssueViewer
)
from django.contrib.auth import get_user_model

User = get_user_model()


class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['issue_type', 'description', 'full_name', 'registration_number', 'course_unit', 'course_code']
    ordering_fields = ['created_at', 'updated_at', 'status']
    filterset_fields = {
        'status': ['exact'],
        'issue_type': ['exact'],
        'assigned_to': ['exact', 'isnull'],
        'submitted_by__college': ['exact'],
    }

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsAuthenticated, IsStudent, IsSameCollege]
        elif self.action == 'list':
            permission_classes = [IsAuthenticated, IsSameCollege]
        elif self.action in ['retrieve', 'update', 'partial_update']:
            permission_classes = [IsAuthenticated, IsOwnerOrStaff,CanResolveIssue,IsIssueViewer, IsSameCollege]
        elif self.action == 'destroy':
            permission_classes = [IsAuthenticated, IsAdmin]
        elif self.action == 'assign':
            permission_classes = [IsAuthenticated, IsRegistrar, IsSameCollege]
        elif self.action == 'resolve':
            permission_classes = [IsAuthenticated, CanResolveIssue, IsSameCollege]
        elif self.action == 'in_progress':
            permission_classes = [IsAuthenticated, CanResolveIssue, IsSameCollege]
        elif self.action == 'statistics':
            permission_classes = [IsAuthenticated, IsSameCollege]
        else:
            permission_classes = [IsAuthenticated, IsIssueViewer]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Issue.objects.none()

        if user.is_staff or user.role == 'admin':
            return Issue.objects.all()
        elif user.role == 'registrar':
            return Issue.objects.filter(submitted_by__college=user.college)
        elif user.role == 'lecturer':
            return Issue.objects.filter(assigned_to=user, submitted_by__college=user.college)
        elif user.role == 'student':
            return Issue.objects.filter(submitted_by=user)
        
        return Issue.objects.none()

    def create(self, request, *args, **kwargs):
        user = request.user

        if not hasattr(user, 'college'):
            return Response({"error": "You must belong to a college to submit an issue."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            issue = serializer.save()
            self._create_notification_for_registrars(issue, f"New issue submitted by {user.get_full_name()}")
            return Response({"message": "Issue submitted successfully!"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    @action(detail=True, methods=['post'])
    def assign_to_hod(self,request,pk=None):
        issue = self.get_objects()

        if request.user.role != 'registrar':
            return Response({"error":"Only Registrars can assign issues."},status=status.HTTP_403_FORBIDDEN)
        
        student = issue.submitted_by
        department = student.department

        try:
            hod = User.objects.get(department=department, is_hod=True)
        except User.DoesNotExist:
            return Response({"error":"No head of department found for this department."}, status=status.HTTP_400_BAD_REQUEST)
        
        issue.assign_to = hod
        issue.status = 'assigned'
        issue.assignment_notes = "Assigned to HoD by registrar."
        issue.save()

        self._create_notification_for_user(hod, f"You have been assigned an issue from your department:{issue.issue_type}")
        self._create_notification_for_user(student, f"Your issue has been forwaded to the head of department.")

        return Response({"message":"Issue assigned to HoD susccessfully."}, status=status.HTTP_200_OK)
    

    @action(detail=True, methods=['post'])
    def assign_to_lecturer(self, request, pk=None):
        issue = self.get_object()

        # Ensure only HoD can perform this assignment
        if not request.user.is_hod:
            return Response({"error": "Only the Head of Department can assign this issue."},status=status.HTTP_403_FORBIDDEN)

        # Check if the form contains the lecturer's name
        if not issue.lecturer_name:
            return Response({"error": "This issue does not have a lecturer name submitted in the form."},status=status.HTTP_400_BAD_REQUEST)

        try:
            lecturer = User.objects.get(full_name__iexact=issue.lecturer_name, role='lecturer')

            issue.assigned_to = lecturer
            issue.status = 'assigned'
            issue.save()

            
            self._create_notification_for_user(lecturer,f"You have been assigned an issue regarding '{issue.course_unit}' submitted by {issue.submitted_by.get_full_name()}.")
            self._create_notification_for_user(issue.submitted_by,f"Your issue regarding '{issue.course_unit}' has been assigned to {lecturer.get_full_name()}.")

            return Response({"message": "Issue successfully assigned to lecturer."})

        except User.DoesNotExist:
            return Response({"error": "Lecturer not found with that name."},status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        issue = self.get_object()

        if not (request.user.is_staff or request.user.role == 'registrar' or (issue.assigned_to and issue.assigned_to == request.user)):
            return Response({"error": "You do not have permission to resolve this issue."}, status=status.HTTP_403_FORBIDDEN)

        serializer = IssueResolutionSerializer(data=request.data)
        if serializer.is_valid():
            resolution_notes = serializer.validated_data.get('resolution_notes', '')
            issue.status = 'resolved'
            issue.resolution_notes = resolution_notes
            issue.save()

            self._create_notification_for_user(issue.submitted_by, f"Your issue '{issue.issue_type}' has been resolved")

            if issue.assigned_to and issue.assigned_to != request.user:
                self._create_notification_for_user(issue.assigned_to, f"Issue '{issue.issue_type}' has been marked as resolved")

            return Response({"message": "Issue resolved successfully"})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        user = request.user

        if not hasattr(user, 'college'):
            return Response({"error": "You must belong to a college to view statistics."}, status=status.HTTP_400_BAD_REQUEST)

        def count_by_status(qs):
            return {
                "total": qs.count(),
                "pending": qs.filter(status='submitted').count(),
                "assigned": qs.filter(status='assigned').count(),
                "in_progress": qs.filter(status='in_progress').count(),
                "resolved": qs.filter(status='resolved').count(),
            }

        if user.is_staff or user.role == 'admin':
            data = count_by_status(Issue.objects.all())
        elif user.role == 'student':
            data = count_by_status(Issue.objects.filter(submitted_by=user))
        elif user.role == 'lecturer':
            data = count_by_status(Issue.objects.filter(assigned_to=user))
            data["pending"] = 0  # lecturers don't see pending issues
        elif user.role == 'registrar':
            data = count_by_status(Issue.objects.filter(submitted_by__college=user.college))
        else:
            data = {}

        return Response(data)

    def _create_notification_for_user(self, user, message):
        Notification.objects.create(user=user, message=message, is_read=False)

    def _create_notification_for_registrars(self, issue, message):
        registrars = User.objects.filter(role='registrar', college=issue.submitted_by.college)
        for registrar in registrars:
            Notification.objects.create(user=registrar, message=message, is_read=False)

    
    @action(detail=False, methods=['get'], url_path='lecturer-issues')
    def lecturer_issues(self, request):
        user = request.user
        issues = Issue.objects.filter(assigned_to=user, submitted_by__college=user.college)
        serializer = IssueSerializer(issues, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def in_progress(self, request, pk=None):
        issue = self.get_object()

        # same permission check as resolve
        if not (request.user.is_staff
                or request.user.role == 'registrar'
                or (issue.assigned_to and issue.assigned_to == request.user)):
            return Response(
                {"error": "You do not have permission to update this issue."},
                status=status.HTTP_403_FORBIDDEN
            )

        issue.status = 'in_progress'
        issue.save()

        # notify the student (and maybe registrar/lecturer)
        self._create_notification_for_user(
          issue.submitted_by,
          f"Issue '{issue.issue_type}' is now in progress"
        )
        if issue.assigned_to and issue.assigned_to != request.user:
            self._create_notification_for_user(
              issue.assigned_to,
              f"Issue '{issue.issue_type}' has been picked up by {request.user.get_full_name()}"
            )

        serializer = self.get_serializer(issue)
        return Response(serializer.data)

