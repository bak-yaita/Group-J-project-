import random
from django.core.mail import send_mail
from django.template.loader import render_to_string
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from datetime import timedelta
from django.utils import timezone
from .models.otp import EmailOTP
from .serializers.CustomTokenObtainPairSerializer import CustomTokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.user
        response_data = serializer.validated_data

        # Check if OTP verification is needed
        if not getattr(user.profile, 'otp_verified', False):
            # Generate a 6-digit OTP
            code = f"{random.randint(100000, 999999)}"

            # Save OTP in EmailOTP model
            EmailOTP.objects.create(user=user, code=code)

            # Render OTP email template
            html_message = render_to_string('otp_email.html', {
                'user': user,
                'otp': code,
            })

            # Send the OTP email
            send_mail(
                subject='Your AITS Login OTP',
                message='Your OTP is: ' + code,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
            )

            response_data.update({
                "message": "Login successful. OTP sent to email.",
                "otp_required": True,
            })
        else:
            response_data.update({
                "message": "Login successful.",
                "otp_required": False,
            })

        return Response(response_data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_otp(request):
    """
    Endpoint to verify OTP after successful login.
    """
    code = request.data.get('code')
    user = request.user

    try:
        otp_entry = EmailOTP.objects.filter(user=user, code=code).latest('created_at')

        # Check if the OTP has expired
        if otp_entry.created_at < timezone.now() - timedelta(minutes=5):
            return Response({"detail": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ OTP is valid, mark the user as verified
        user.profile.verify_otp()

        # 🔥 Generate fresh tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "role": user.role,  # Assuming you have 'role' field
                "username": user.username,
                "email": user.email,
            }
        })
    except EmailOTP.DoesNotExist:
        return Response({"detail": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

