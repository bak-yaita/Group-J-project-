from django.apps import AppConfig

class NotificationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'aitsapp.notifications'
    
    def ready(self):
        import aitsapp.notifications.signals

class AitsappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutofield'
    name = 'aitsapp'

    def ready(self):
        import aitsapp.models.userprofile