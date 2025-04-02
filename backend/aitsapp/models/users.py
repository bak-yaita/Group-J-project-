from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.core.validators import FileExtensionValidator

class User(AbstractUser):
    ROLES = [
        ('student', 'Student'),
        ('lecturer', 'Lecturer'),
        ('registrar', 'Academic Registrar'),
        ('admin', 'Administrator'),
    ]
    
    COLLEGE_CHOICES = [
        ('COCIS', 'COCIS'),
        ('CEDAT', 'CEDAT'),
        ('CONAS', 'CONAS'),
        ('CEES', 'CEES'),
        ('CHUSS', 'CHUSS'),
        ('COBAMS', 'COBAMS'),
        ('COVAB', 'COVAB'),
        ('SOL', 'SOL'),
        ('CAES', 'CAES'),
    ]
    
    email = models.EmailField(unique=True)  
    college = models.CharField(max_length=50, choices=COLLEGE_CHOICES, default='Unkwon') 
    role = models.CharField(max_length=20, choices=ROLES)
    user_number = models.CharField(max_length=20,unique=True,blank=True,null=True)
    groups = models.ManyToManyField(Group, related_name="custom_user_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="custom_user_permissions", blank=True)
    registration_number = models.CharField(max_length=20, unique=True, blank=True, null=True)

    profile_picture = models.ImageField(
        upload_to='profile_pictures/', 
        validators=[FileExtensionValidator(['png', 'jpg', 'jpeg'])],
        blank=True, 
        null=True
    )

    def __str__(self):
        return f"{self.username} - {self.role} ({self.college})"
    