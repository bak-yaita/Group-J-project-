from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from ..serializers import UserProfileSerializer, PasswordChangeSerializer

User = get_user_model()

class UserProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user profiles.
    """
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """Retrieve the currently logged-in user's profile."""
        return self.request.user

    def update(self, request, *args, **kwargs):
        """
        Allow users to update their username, email, and profile picture.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Handle profile picture update
        if 'profile_picture' in request.FILES:
            if instance.profile_picture:
                instance.profile_picture.delete()  # Delete old picture before replacing
            instance.profile_picture = request.FILES['profile_picture']

        # Update other fields
        instance.username = serializer.validated_data.get('username', instance.username)
        instance.email = serializer.validated_data.get('email', instance.email)
        instance.save()
        
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """
        Custom action to change user password securely.
        Requires old password before setting a new one.
        """
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({"error": "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({"detail": "Password successfully changed."}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path="profile-picture")
    def upload_profile_picture(self, request):
        """
        Custom action to upload/update the user's profile picture.
        """
        user = self.get_object()

        if 'profile_picture' not in request.FILES:
            return Response({"error": "No image uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        # Remove old profile picture if it exists
        if user.profile_picture:
            user.profile_picture.delete()

        user.profile_picture = request.FILES['profile_picture']
        user.save()

        return Response(
            {"detail": "Profile picture updated successfully.", "profile_picture_url": user.profile_picture.url},
            status=status.HTTP_200_OK
        )
