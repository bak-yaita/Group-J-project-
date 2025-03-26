from rest_framework import viewsets, status, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models.issues import Issue
from ..serializers import IssueSerializer

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
