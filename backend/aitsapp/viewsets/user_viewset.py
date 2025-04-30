from rest_framework import viewsets
from django.contrib.auth import get_user_model
from ..serializers.UserSerializer import UserSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['get'])
    def lecturers(self, request):
        lecturers = User.objects.filter(role='lecturer', is_active=True)
        serializer = self.get_serializer(lecturers, many=True)
        return Response(serializer.data)
