from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            'username', 'password', 'email', 
            'role', 'user_number', 'registration_number', 'college', 'full_name','first_name', 'last_name'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

    def validate(self, attrs):
        valid_roles = ['student', 'lecturer', 'registrar']
        role = attrs.get('role', '').lower()

        if role not in valid_roles:
            raise serializers.ValidationError(
                {"role": f"Role must be one of: {', '.join(valid_roles)}"}
            )
        attrs['role'] = role

        user_number = attrs.get('user_number')
        registration_number = attrs.get('registration_number')
        college = attrs.get('college')
        
        first_name = attrs.get('first_name')
        last_name = attrs.get('last_name')
        if not attrs.get('first_name'):
            raise serializers.ValidationError({"first_name": "First name is required."})
        if not attrs.get('last_name'):
            raise serializers.ValidationError({"last_name": "Last name is required."})
        
        #  Auto-capitalize first name and last name
        attrs['first_name'] = first_name.capitalize()
        attrs['last_name'] = last_name.capitalize()

        if role == "student":
            if not user_number:
                raise serializers.ValidationError({"user_number": "Students must provide a student number."})
            if not registration_number:
                raise serializers.ValidationError({"registration_number": "Students must provide a registration number."})
        
        elif role == "lecturer":
            if not user_number:
                raise serializers.ValidationError({"user_number": "Lecturers must provide a lecturer number."})
            if registration_number:
                raise serializers.ValidationError({"registration_number": "Lecturers should not provide a registration number."})

        elif role == "registrar":
            if user_number or registration_number:
                raise serializers.ValidationError({"detail": "Registrars should not provide a student or lecturer number."})

        if not college:
            raise serializers.ValidationError({"college": "College is required."})

        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
