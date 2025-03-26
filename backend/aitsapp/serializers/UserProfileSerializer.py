from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

def validate_profile_picture(value):
    """
    Validate the uploaded profile picture.
    - Must be an image (JPEG, PNG).
    - Max file size: 2MB.
    """
    allowed_types = ["image/jpeg", "image/png"]
    max_size = 2 * 1024 * 1024  # 2MB

    if value.size > max_size:
        raise ValidationError("File size must be less than 2MB.")
    
    if value.content_type not in allowed_types:
        raise ValidationError("Only JPEG and PNG images are allowed.")

    return value

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile information.
    Allows editing of username and email, while keeping role and college read-only.
    """
    full_name = serializers.SerializerMethodField()
    role = serializers.CharField(source='get_role_display', read_only=True)
    profile_picture = serializers.ImageField(validators=[validate_profile_picture], required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'role', 'college', 'profile_picture']
        read_only_fields = ['id', 'full_name', 'role', 'college']

    def get_full_name(self, obj):
        """
        Returns the full name of the user.
        """
        return f"{obj.first_name} {obj.last_name}".strip()
    
    def to_representation(self, instance):
        """
        Hide the college field for admins.
        """
        data = super().to_representation(instance)
        if instance.role == 'admin':
            data.pop('college', None)  # Remove college for admins
        return data

class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer for password change functionality.
    """
    current_password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    new_password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    confirm_new_password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate_current_password(self, value):
        """
        Validate that the current password is correct.
        """
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect")
        return value

    def validate(self, data):
        """
        Validate new password and confirmation match.
        """
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError({'confirm_new_password': "Passwords do not match"})

        try:
            validate_password(data['new_password'], self.context['request'].user)
        except ValidationError as e:
            raise serializers.ValidationError({'new_password': list(e.messages)})

        return data