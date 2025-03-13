from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from aitsapp.models import User  
import json

class UserLoginViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]  

    def create(self, request):
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({"message": "Login successful", "username": user.username}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]  

    def create(self, request):
        """
        Logs the user out and ends the session.
        """
        logout(request)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

