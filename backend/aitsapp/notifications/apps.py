from django.apps import AppConfig

class NotificationsConfig(AppConfig):
    name = 'aitsapp.notifications'
    
    def ready(self):
        import aitsapp.notifications.signals