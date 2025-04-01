from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
<<<<<<< HEAD
from aitsapp.serializers import UserSerializer
from aitsapp.auth.authserializers import RegisterSerializer, LoginSerializer
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
=======
from ..serializers.UserSerializer import UserSerializer
from ..auth.authserializers import RegisterSerializer, LoginSerializer
>>>>>>> ff8865ff2ca955c73f9399bf10421eccb22c6ffb



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
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

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
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        if request.user and request.user.is_authenticated:
            logout(request) 
            return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        return Response({'error': 'No active session found.'}, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='details')
    def details(self, request):
        user = request.user
        full_name = f"{user.first_name} {user.last_name}"  # Concatenate first and last names to get full name
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
            'lecturer_number': getattr(user, 'lecturer_number', None),  # Corrected to 'lecturer_number'
    })

    @action(detail=False, methods=['post'])
    def password_reset_request(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "No user with this email exists."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate a token and uid for password reset
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Construct a password reset link (adjust the frontend URL as needed)
        reset_link = f"http://your-frontend-url/reset-password/?uid={uid}&token={token}"
        
        # Send the email (configure your email backend in settings.py)
        send_mail(
            subject="Password Reset Request",
            message=f"Click the link to reset your password: {reset_link}",
            from_email="no-reply@example.com",
            recipient_list=[user.email],
            fail_silently=False,
        )
        
        return Response({"message": "Password reset email sent."}, status=status.HTTP_200_OK)
    @action(detail=False, methods=['post'])
    def password_reset_confirm(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        if not all([uidb64, token, new_password]):
            return Response({"error": "uid, token, and new_password are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Invalid UID."}, status=status.HTTP_400_BAD_REQUEST)
        
        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)
