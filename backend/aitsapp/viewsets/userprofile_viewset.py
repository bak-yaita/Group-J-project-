from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.core.mail import send_mail, BadHeaderError
from django.conf import settings
from ..serializers import UserProfileSerializer, PasswordChangeSerializer

User = get_user_model()

class UserProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user profiles.
    Supports:
    - Retrieving own profile
    - Updating username, email, profile picture
    - Changing password
    """
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """
        Override this so requests like PATCH /api/profile/
        will target the logged-in user's profile.
        """
        return self.request.user

    def update(self, request, *args, **kwargs):
        """
        Handles PUT/PATCH requests to update user profile.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Handle profile picture (optional)
        if 'profile_picture' in request.FILES:
            if instance.profile_picture:
                instance.profile_picture.delete()  # Remove old one
            instance.profile_picture = request.FILES['profile_picture']

        # Update other fields
        instance.username = serializer.validated_data.get('username', instance.username)
        instance.email = serializer.validated_data.get('email', instance.email)
        instance.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='change-password')
    def change_password(self, request):
        """
        POST /api/profile/change-password/
        Requires: current_password, new_password, confirm_new_password
        """
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.validated_data['current_password']):
            return Response({"error": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data['new_password'])
        user.save()

        # Send email notification
        subject = "Password Change Confirmation"
        recipient_email = user.email
        name = f"{user.first_name} {user.last_name}".strip() or user.username
        message = (
            f"Dear {name},\n\n"
            "We’re letting you know that your account password was successfully changed.\n\n"
            "If you did not request this change, please reset your password immediately or contact support.\n\n"
            "Regards,\n"
            "AITS System Support Team"
        )

        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [recipient_email],
                fail_silently=False,
            )
        except BadHeaderError:
            return Response(
                {"error": "Invalid header found while sending email."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({"detail": "Password successfully changed and confirmation email sent."}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='upload-profile-picture')
    def upload_profile_picture(self, request):
        """
        POST /api/profile/upload-profile-picture/
        Form-data: profile_picture
        """
        user = self.get_object()

        if 'profile_picture' not in request.FILES:
            return Response({"error": "No image uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        if user.profile_picture:
            user.profile_picture.delete()

        user.profile_picture = request.FILES['profile_picture']
        user.save()

        return Response({
            "detail": "Profile picture updated successfully.",
            "profile_picture_url": user.profile_picture.url
        }, status=status.HTTP_200_OK)
