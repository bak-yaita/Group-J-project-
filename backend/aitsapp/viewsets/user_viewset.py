from rest_framework import viewsets
from aitsapp.models.users import User
from aitsapp.serializers.UserSerializer import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
