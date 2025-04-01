from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'username', 'password', 'email', 'first_name', 'last_name', 
            'role', 'user_number', 'registration_number', 'college', 'full_name'
        ]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def validate(self, data):
        role = data.get('role','').lower()
        data['role'] = role
        user_number = data.get('user_number')
        registration_number = data.get('registration_number')
        college = data.get('college')

        if not data.get('first_name'):
            raise serializers.ValidationError("First name is required.")
        if not data.get('last_name'):
            raise serializers.ValidationError("Last name is required.")

        if role == "student":
            if not user_number:
                raise serializers.ValidationError("Students must provide a student number.")
            if not registration_number:
                raise serializers.ValidationError("Students must provide a registration number.")
        
        elif role == "lecturer":
            if not user_number:
                raise serializers.ValidationError("Lecturers must provide a lecturer number.")
            if registration_number:
                raise serializers.ValidationError("Lecturers should not provide a registration number.")

        elif role == "registrar":
            if user_number or registration_number:
                raise serializers.ValidationError("Registrars should not provide a student or lecturer number.")
        if not college:
            raise serializers.ValidationError("College is required.")
        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise AuthenticationFailed("Incorrect credentials")
        
        # Instead of returning user, return the validated data
        data["user"] = user  
        return data  

    

    
