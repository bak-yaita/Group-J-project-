from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer to include user and OTP check in the token response.
    """

    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user  # user is set after super().validate(attrs)

        # Add custom claims
        data.update({
            "username": user.username,
            "email": user.email,
            "role": getattr(user, "role", None),
            "college": getattr(user, "college", None),
            "otp_verified": getattr(user.profile, "otp_verified", False),  # Make sure profile exists
        })

        self.user = user  # Set it so that CustomLoginView can access it

        return data
