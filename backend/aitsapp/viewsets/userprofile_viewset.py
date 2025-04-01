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
        """
        Retrieve the current logged-in user's profile.
        """
        return self.request.user

    def update(self, request, *args, **kwargs):
        """
        Allow users to update their username, email, and profile picture.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        if 'profile_picture' in request.FILES:
            if instance.profile_picture:
                instance.profile_picture.delete()
            instance.profile_picture = request.FILES['profile_picture']

        instance.username = serializer.validated_data.get('username', instance.username)
        instance.email = serializer.validated_data.get('email', instance.email)
        instance.save()
        
        return Response(serializer.data)

    @action(detail=False, methods=['post'], serializer_class=PasswordChangeSerializer)
    def change_password(self, request):
        """
        Custom action to change user password.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()

        return Response({"detail": "Password successfully changed."}, status=status.HTTP_200_OK)