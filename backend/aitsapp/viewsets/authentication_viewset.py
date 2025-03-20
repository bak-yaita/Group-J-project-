from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from seriliazers import UserSerializer  
from aitsapp.auth.authserializers import RegisterSerializer, LoginSerializer

User = get_user_model()

class AuthenticationViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)  # Use RegisterSerializer
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)  # Log the user in after registration
            return Response({'message': 'User registered successfully', 'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            login(request, user)  # Django session login
            return Response({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': getattr(user, 'role', None),  # Ensure 'role' exists
                    'user_number': getattr(user, 'user_number', None),  # Ensure 'user_number' exists
                }
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        logout(request)  # Django session logout
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='details')
    def details(self, request):
        user = request.user
        full_name = f"{user.first_name} {user.last_name}"  # Concatenate first and last names to get full name
        
        # Assuming `college` is a field in the `User` model or a related model
        college = getattr(user, 'college', None)  # Adjust this if `college` is related to the user differently
        registration_number = getattr(user, 'registration_number', None)
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'full_name': full_name,  # Return the full name
            'college': college,  # Return the user's college
            'role': getattr(user, 'role', None),  # Ensure 'role' exists
            'registration_number': registration_number, 
            'user_number': getattr(user, 'user_number', None),  # Ensure 'user_number' exists
            'lecturer_number': getattr(user, 'user_number', None),  # Ensure 'lecturer_number' exists
    })

