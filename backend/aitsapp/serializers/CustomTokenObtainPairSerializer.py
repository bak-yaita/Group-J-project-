from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer to include user and OTP check in the token response.
    """

    def validate(self, attrs):
        try:
            data = super().validate(attrs)
        except AuthenticationFailed:
            raise AuthenticationFailed("Invalid username or password.")

        user = self.user  # user is set after successful validation

        # Add custom claims
        data.update({
            "username": user.username,
            "email": user.email,
            "role": getattr(user, "role", None),
            "college": getattr(user, "college", None),
            "otp_verified": getattr(user.profile, "otp_verified", False),  # Ensure profile exists
        })

        self.user = user  # So the view can access it

        return data
