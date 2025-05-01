# aitsapp/models.py
from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    otp_verified = models.BooleanField(default=False)  # Flag to track OTP verification status

    def __str__(self):
        return self.user.username

    # You can add custom methods to interact with the profile
    def verify_otp(self):
        self.otp_verified = True
        self.save()

    def reset_otp(self):
        self.otp_verified = False
        self.save()
