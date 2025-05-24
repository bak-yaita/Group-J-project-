from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework.permissions import AllowAny
from django.conf import settings

User = get_user_model()

class ForgotPasswordViewSet(ViewSet):  # Previously PasswordResetRequestViewSet
    permission_classes = [AllowAny]
    http_method_names = ["post"]
    def create(self, request):
        email = request.data.get("email")
        user = User.objects.filter(email=email).first()
        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

            send_mail(
                subject="AITS Password Reset",
                message=f"Click the link to reset your password: {reset_link}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
        return Response(
            {"message": "If the email exists, a reset link has been sent."},
            status=status.HTTP_200_OK,
        )