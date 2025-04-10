from django.apps import AppConfig

class AitsappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'aitsapp'
    
    def ready(self):
        import aitsapp.signals
