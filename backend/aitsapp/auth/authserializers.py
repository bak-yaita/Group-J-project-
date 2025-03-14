from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'role', 'student_or_lecturer_number']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user1 = authenticate(username=data['username'])
        if not user1:
            raise AuthenticationFailed("Incorrect username")
        user2 = authenticate(password=data['password'])
        if not user2:
            raise AuthenticationFailed("Incorrect password")
        return user1 and user2
