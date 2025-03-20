from rest_framework import viewsets, permissions, filters
from aitsapp.models import Issue
from aitsapp.serializers import IssueSerializer

class IssueViewSet(viewsets.ModelViewSet):
    """API endpoint for managing issues."""
    serializer_class = IssueSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']  
    ordering_fields = ['created_at']  

    def get_queryset(self):
        """Restrict queryset based on user role."""
        return Issue.objects.all() if self.request.user.is_staff else Issue.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        """Assign the requesting user as the student when creating an issue."""
        serializer.save(student=self.request.user)
