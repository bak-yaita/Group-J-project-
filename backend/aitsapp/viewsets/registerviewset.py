from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from aitsapp.auth.authserializers import RegisterSerializer
from django.contrib.auth import get_user_model
from rest_framework.decorators import action

User = get_user_model()

class RegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()  
    serializer_class = RegisterSerializer
    http_method_names = ['post']  # Only allow POST for registration (create users)

    def create(self, request, *args, **kwargs):
        """
        Handle user registration and return the created user.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Save the new user
            return Response({
                'username': user.username,
                'email': user.email,
                'full_name': user.get_full_name(),
                'role': user.role,
                'college': user.college
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
