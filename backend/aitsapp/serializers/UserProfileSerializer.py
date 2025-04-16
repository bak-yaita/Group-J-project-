from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from PIL import Image
import io

User = get_user_model()

def validate_profile_picture(value):
    """
    Validate the uploaded profile picture:
    - Must be an image (JPEG, PNG).
    - Max file size: 2MB.
    - Ensures the file is an actual image.
    """
    allowed_types = ["image/jpeg", "image/png", "image/jpg"]
    max_size = 2 * 1024 * 1024  # 2MB

    # Check file type
    if value.content_type not in allowed_types:
        raise ValidationError("Only JPEG,JPG and PNG images are allowed.")

    # Check file size
    if value.size > max_size:
        raise ValidationError("File size must be less than 2MB.")

    # Verify if file is an actual image
    try:
        image = Image.open(io.BytesIO(value.read()))
        image.verify()
        value.seek(0)
    except Exception:
        raise ValidationError("Invalid image file.")

    return value

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profiles.
    Allows updating username, email, and profile picture while keeping role and college read-only.
    """
    full_name = serializers.SerializerMethodField()
    role = serializers.CharField(source='get_role_display', read_only=True)
    profile_picture = serializers.ImageField(validators=[validate_profile_picture], required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'role', 'college', 'profile_picture']
        read_only_fields = ['id', 'full_name', 'role', 'college']

    def get_full_name(self, obj):
        """Returns the user's full name."""
        return f"{obj.first_name} {obj.last_name}".strip()
    
    def to_representation(self, instance):
        """
        Customize the serialized output:
        - Hide `college` for admins.
        """
        data = super().to_representation(instance)
        if instance.role == 'admin':
            data.pop('college', None)
        return data

class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer for password change functionality.
    """
    current_password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    new_password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    confirm_new_password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        """
        Validate password change:
        - Ensure the current password is correct.
        - Ensure the new passwords match.
        - Validate new password against Django's password policies.
        """
        user = self.context['request'].user

        if not user.check_password(data['current_password']):
            raise serializers.ValidationError({"current_password": "Current password is incorrect."})

        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError({"confirm_new_password": "Passwords do not match."})

        try:
            validate_password(data['new_password'], user)
        except ValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})

        return data
