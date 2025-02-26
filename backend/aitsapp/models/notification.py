from django.db import models
from .models.users import User 

class Department(models.Model):
    name = models.CharField(max_length=255,unique=True)
    code = models.CharField(max_length=10,unique=True)
    hod = models.OneToOneField(User ,on_delete=models.SET_NULL,null=True, blank=True,related_name="department_head", limit_choices_to={'role': 'lecturer'})
    lecturers = models.ManyToManyField(User, related_name="department_lecturers", blank=True,limit_choices_to={'role':'lecturer'})
    students = models.ManyToManyField(User, related_name="department_students", blank=True,limit_choices_to={'role':'student'})
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return  f"{self.code} - {self.name}"