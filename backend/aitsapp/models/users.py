from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.core.exceptions import ValidationError

class User(AbstractUser):
    ROLES = [
        ('student', 'Student'),
        ('lecturer', 'Lecturer'),
        ('registrar', 'Academic Registrar'),
    ]
    role = models.CharField(max_length=20, choices=ROLES)
    student_number = models.CharField(max_length=20,unique=True,blank=True,null=True)
    lecturer_number = models.CharField(max_length=20,unique=True,blank=True, null=True)
    groups = mgitodels.ManyToManyField(Group, related_name="custom_user_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="custom_user_permissions", blank=True)


    def save(self, *args, **kwargs):
        if self.role == 'student' and self.lecturer_number:
            raise ValidationError("Students cannot have a lecturer number.")
        if self.role == 'lecturer' and self.student_number:
            raise ValidationError("Lecturers cannot have a student number.")
        if self.role not in ('student', 'lecturer') and (self.student_number or self.lecturer_number):
            raise ValidationError("Only students and lecturers can have those respective numbers.")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} - {self.role}"