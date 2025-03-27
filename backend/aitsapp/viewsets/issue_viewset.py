from rest_framework import viewsets, status, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models.issues import Issue
from ..serializers import IssueSerializer
from rest_framework.decorators import action

class IssueViewSet(viewsets.ModelViewSet):
    """
    A viewset for submitting and managing issues with role-based access control.
    """
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['issue_type', 'description']
    ordering_fields = ['created_at']
    filterset_fields = ['status']  # Added fields for filtering by status

    def get_queryset(self):
        """
        Restrict queryset based on user role and college.
        """
        user = self.request.user

        if user.is_staff:  # Admins can view all issues
            return Issue.objects.all()
        
        if hasattr(user, 'college'):
            if user.role == 'Registrar' or user.role == 'Lecturer':
                return Issue.objects.filter(student__college=user.college)
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
            return Response({"message": "Issue submitted successfully!"}, status=status.HTTP_201_CREATED)

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
            pending_issues = Issue.objects.filter(status='submitted').count()
            resolved_issues = Issue.objects.filter(status='resolved').count()

        # Students see only their own issue statistics
        elif user.role == 'Student':
            total_issues = Issue.objects.filter(student=user).count()
            pending_issues = Issue.objects.filter(student=user, status='submitted').count()
            resolved_issues = Issue.objects.filter(student=user, status='resolved').count()

        # Lecturers see statistics for issues assigned to them only
        elif user.role == 'Lecturer':
            total_issues = Issue.objects.filter(assigned_to=user).count()
            pending_issues = Issue.objects.filter(assigned_to=user, status='assigned').count()  # Pending for lecturers should be 'assigned'
            resolved_issues = Issue.objects.filter(assigned_to=user, status='resolved').count()

        # Registrars see statistics for the entire college
        elif user.role == 'Registrar':
            total_issues = Issue.objects.filter(student__college=user.college).count()
            pending_issues = Issue.objects.filter(student__college=user.college, status='submitted').count()
            resolved_issues = Issue.objects.filter(student__college=user.college, status='resolved').count()

        return Response({
            "total": total_issues,
            "pending": pending_issues,
            "resolved": resolved_issues
        })
