from rest_framework import serializers
from .models import User, Notification, Issue

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = '__all__'

    def create(self, validated_data):
        user = self.context['request'].user  
        validated_data['student'] = user
        validated_data['student_number'] = user.student_number
        validated_data['registration_number'] = user.registration_number
        validated_data['full_name'] = f"{user.first_name} {user.last_name}"
        return super().create(validated_data)

