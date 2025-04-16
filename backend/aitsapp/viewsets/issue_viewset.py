from rest_framework import viewsets, status, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend

from ..models.issues import Issue
from ..serializers import IssueSerializer, IssueAssignmentSerializer, IssueResolutionSerializer
from aitsapp.models import Notification
from aitsapp.permissions import (
    IsAdmin, IsLecturer, IsRegistrar,
    IsOwnerOrStaff, IsStudent, CanResolveIssue, IsSameCollege
)
from django.contrib.auth import get_user_model

User = get_user_model()


class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['issue_type', 'description', 'full_name', 'registration_number', 'subject', 'course_code']
    ordering_fields = ['created_at', 'updated_at', 'status']
    filterset_fields = {
        'status': ['exact'],
        'issue_type': ['exact'],
        'assigned_to': ['exact', 'isnull'],
        'student__college': ['exact'],
    }

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsAuthenticated, IsStudent, IsSameCollege]
        elif self.action == 'list':
            permission_classes = [IsAuthenticated, IsSameCollege]
        elif self.action in ['retrieve', 'update', 'partial_update']:
            permission_classes = [IsAuthenticated, IsOwnerOrStaff, IsSameCollege]
        elif self.action == 'destroy':
            permission_classes = [IsAuthenticated, IsAdmin]
        elif self.action == 'assign':
            permission_classes = [IsAuthenticated, IsRegistrar, IsSameCollege]
        elif self.action == 'resolve':
            permission_classes = [IsAuthenticated, CanResolveIssue, IsSameCollege]
        elif self.action == 'statistics':
            permission_classes = [IsAuthenticated, IsSameCollege]
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Issue.objects.none()

        if user.is_staff or user.role == 'admin':
            return Issue.objects.all()
        elif user.role == 'registrar':
            return Issue.objects.filter(student__college=user.college)
        elif user.role == 'lecturer':
            return Issue.objects.filter(assigned_to=user, student__college=user.college)
        elif user.role == 'student':
            return Issue.objects.filter(student=user)
        
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
    def assign(self, request, pk=None):
        issue = self.get_object()

        if not request.user.is_staff and request.user.role != 'registrar':
            return Response({"error": "You do not have permission to assign issues."}, status=status.HTTP_403_FORBIDDEN)

        serializer = IssueAssignmentSerializer(data=request.data)
        if serializer.is_valid():
            lecturer_id = serializer.validated_data.get('assigned_to')
            notes = serializer.validated_data.get('notes', '')

            try:
                lecturer = User.objects.get(id=lecturer_id)

                if lecturer.role != 'lecturer':
                    return Response({"error": "Issues can only be assigned to lecturers."}, status=status.HTTP_400_BAD_REQUEST)

                issue.assigned_to = lecturer
                issue.status = 'assigned'
                issue.assignment_notes = notes
                issue.save()

                self._create_notification_for_user(lecturer, f"You have been assigned an issue: {issue.subject}")
                self._create_notification_for_user(issue.student, f"Your issue '{issue.subject}' has been assigned to {lecturer.get_full_name()}")

                return Response({"message": "Issue assigned successfully"})

            except User.DoesNotExist:
                return Response({"error": "Lecturer not found"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

            self._create_notification_for_user(issue.student, f"Your issue '{issue.subject}' has been resolved")

            if issue.assigned_to and issue.assigned_to != request.user:
                self._create_notification_for_user(issue.assigned_to, f"Issue '{issue.subject}' has been marked as resolved")

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
            data = count_by_status(Issue.objects.filter(student=user))
        elif user.role == 'lecturer':
            data = count_by_status(Issue.objects.filter(assigned_to=user))
            data["pending"] = 0  # lecturers don't see pending issues
        elif user.role == 'registrar':
            data = count_by_status(Issue.objects.filter(student__college=user.college))
        else:
            data = {}

        return Response(data)

    def _create_notification_for_user(self, user, message):
        Notification.objects.create(user=user, message=message, is_read=False)

    def _create_notification_for_registrars(self, issue, message):
        registrars = User.objects.filter(role='registrar', college=issue.student.college)
        for registrar in registrars:
            Notification.objects.create(user=registrar, message=message, is_read=False)
