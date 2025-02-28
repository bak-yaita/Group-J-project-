from rest_framework import viewsets
from aitsapp.models import Notification
from aitsapp.seriliazers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
