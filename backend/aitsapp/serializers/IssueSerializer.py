from rest_framework import serializers
from ..models import Issue

class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        read_only_fields = ['student', 'user_number', 'registration_number', 'full_name']
        fields = '__all__'

    def create(self, validated_data):
        user = self.context['request'].user  
        validated_data['student'] = user
        validated_data['user_number'] = user.user_number
        validated_data['registration_number'] = user.registration_number
        validated_data['full_name'] = f"{user.first_name} {user.last_name}"
        return super().create(validated_data)
    
class IssueAssignmentSerializer(serializers.Serializer):
    assigned_to = serializers.IntegerField()
    notes = serializers.CharField(required=False, allow_blank=True)

class IssueResolutionSerializer(serializers.Serializer):
    resolution_notes = serializers.CharField(required=False, allow_blank=True)