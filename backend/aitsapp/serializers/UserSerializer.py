from rest_framework import serializers
from ..models import User
from aitsapp.models.department import Department

class UserSerializer(serializers.ModelSerializer):
    department = serializers.SlugRelatedField(slug_field='name',read_only=True)

    full_name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = '__all__'


        def get_full_name(self,obj):
            return f"{obj.first_name} {obj.last_name}".strip()