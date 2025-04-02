from rest_framework import viewsets, permissions
from rest_framework.decorators import action 
from rest_framework.response import Response
from aitsapp.models.issues import Issue
from aitsapp.serializers import IssueSerializer
from aitsapp.permissions import IsStudent, IsLecturer, IsRegistrar, IsAdmin

class DashboardViewSet(viewsets.ViewSet):
    """Viewsets for fetching role-based dashboards"""

    def get_permissions(self):
        if self.action == "student_dashboard":
            return [permissions.IsAuthenticated(), IsStudent()]
        elif self.action == "lecturer_dashboard":
            return [permissions.IsAuthenticated(), IsLecturer()]
        elif self.action == "registrar_dashboard":
            return [permissions.IsAuthenticated(), IsRegistrar()]
        elif self.action == "admin_dashboard":
            return [permissions.IsAuthenticated(), IsAdmin()]
        return [permissions.IsAuthenticated()]
    
    @action(detail=False,methods=['get'])
    def student_dashboard(self, request):
        issues = Issue.objects.filter(student__college=request.user.college)
        serializer = IssueSerializer(issues, many=True)
        return Response(serializer.data)
