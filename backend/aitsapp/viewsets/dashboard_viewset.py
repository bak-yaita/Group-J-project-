from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from aitsapp.models import User 

class StudentDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == "student":
            return Response({"message": "Welcome to the Student Dashboard"}, status=status.HTTP_200_OK)
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)


class LecturerDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == "lecturer":
            return Response({"message": "Welcome to the Lecturer Dashboard"}, status=status.HTTP_200_OK)
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)


class RegistrarDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == "registrar":
            return Response({"message": "Welcome to the Registrar Dashboard"}, status=status.HTTP_200_OK)
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)


class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.is_superuser:
            return Response({"message": "Welcome to the Admin Dashboard"}, status=status.HTTP_200_OK)
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)