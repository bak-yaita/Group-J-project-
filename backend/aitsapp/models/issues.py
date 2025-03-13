from django.db import models
from django.conf import settings

class Issue(models.Model):
    ISSUE_TYPES = [
        ('missing_marks', 'Missing Marks'),
        ('appeal', 'Appeal'),
        ('correction', 'Correction'),
    ]
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('assigned', 'Assigned'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    ]

    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="issues")
    student_number = models.CharField(max_length=20)  
    registration_number = models.CharField(max_length=50)  
    full_name = models.CharField(max_length=100)  

    subject = models.CharField(max_length=255)  
    course_code = models.CharField(max_length=20)  
    course_id = models.CharField(max_length=20)  
    issue_type = models.CharField(max_length=20, choices=ISSUE_TYPES)  
    category = models.CharField(max_length=100) 
    description = models.TextField()  
    year_of_study = models.CharField(max_length=10)  
    semester = models.CharField(max_length=10)  
    lecturer_name = models.CharField(max_length=100)  

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="assigned_issues")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.subject} - {self.student.username}"
