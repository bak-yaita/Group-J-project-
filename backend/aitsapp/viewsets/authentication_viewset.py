from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny, IsAuthenticated
from ..serializers import UserSerializer
from ..auth.authserializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class AuthenticationViewSet(viewsets.ViewSet):
    """
    Handles user authentication: registration, login, logout, and user details.
    """
    permission_classes = [AllowAny]

    def get_permissions(self):
        if self.action in ['logout', 'details']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['post'])
    def register(self, request):
        data = request.data.copy()

        # Clean data according to role (like frontend does)
        role = data.get('role')

        if role == 'student':
            # Students must have both user_number and registration_number
            if not data.get('user_number') or not data.get('registration_number'):
                return Response({'message': 'Student number and registration number are required for students.'},
                                status=status.HTTP_400_BAD_REQUEST)
        elif role == 'lecturer':
            # Lecturers must have user_number (lecturer number), but no registration_number
            if not data.get('user_number'):
                return Response({'message': 'Lecturer number is required for lecturers.'},
                                status=status.HTTP_400_BAD_REQUEST)
            data.pop('registration_number', None)
        elif role == 'registrar':
            # Registrars don't need user_number or registration_number
            data.pop('user_number', None)
            data.pop('registration_number', None)
        else:
            return Response({'message': 'Invalid role selected.'},
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = RegisterSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            user.assign_role_and_permissions()  # assign role and college permissions automatically

            return Response(
                {
                    'message': 'Registration successful!',
                    'user': UserSerializer(user).data
                },
                status=status.HTTP_201_CREATED
            )
        else:
            # If validation fails, return the first error nicely
            errors = serializer.errors
            first_error = next(iter(errors.values()))[0]
            return Response({'message': first_error}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='details')
    def details(self, request):
        user = request.user
        full_name = f"{user.first_name} {user.last_name}"
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'full_name': full_name,
            'college': getattr(user, 'college', None),
            'role': getattr(user, 'role', None),
            'registration_number': getattr(user, 'registration_number', None),
            'user_number': getattr(user, 'user_number', None),
        })


    @action(detail=False,methods=['post'])
    def logout(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
