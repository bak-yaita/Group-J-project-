from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLES = [
        ('student', 'Student'),
        ('lecturer', 'Lecturer'),
        ('registrar', 'Academic Registrar'),
        
    ]
    role = models.CharField(max_length=20, choices=ROLES)


    def __str__(self):
        return f"{self.username} - {self.role}"