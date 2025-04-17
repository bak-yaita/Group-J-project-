from rest_framework import serializers
from ..models import Issue

class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        read_only_fields = ['student', 'user_number', 'registration_number', 'full_name', 'college']
        

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['student'] = user
        validated_data['user_number'] = getattr(user, 'user_number', '')
        validated_data['registration_number'] = getattr(user, 'registration_number', '')
        
        # If the user is not a student, use a default registration number
        if user.role != 'student' and not validated_data['registration_number']:
            validated_data['registration_number'] = 'N/A'
            
        validated_data['full_name'] = f"{user.first_name} {user.last_name}"

        # Ensure the issue is linked to the user's college
        validated_data['college'] = user.college  # Assuming the user model has a college field

        return super().create(validated_data)

        


class IssueAssignmentSerializer(serializers.Serializer):
    assigned_to = serializers.IntegerField()
    notes = serializers.CharField(required=False)

class IssueResolutionSerializer(serializers.Serializer):
    resolution_notes = serializers.CharField()

