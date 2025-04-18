from django.utils.http import urlsafe_base64_decode
from rest_framework.decorators import action
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from rest_framework.permissions import AllowAny

User = get_user_model()

class PasswordResetConfirmViewSet(ViewSet):
    permission_classes = [AllowAny]
    @action(detail=False, methods=['post'], url_path='(?P<uidb64>[^/.]+)/(?P<token>[^/.]+)')

    def reset(self, request, uidb64=None, token=None):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({"error": "Invalid link."}, status=400)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Token is invalid or expired."}, status=400)

        password = request.data.get("password")
        confirm = request.data.get("confirm_password")

        if password != confirm:
            return Response({"error": "Passwords do not match."}, status=400)

        user.set_password(password)
        user.save()
        return Response({"message": "Password reset successful."}, status=200)