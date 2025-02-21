from django.db import models
from django.contrib.auth.models import User  # Using Django's default User model

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

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="issues")
    title = models.CharField(max_length=255)  # Title of the issue
    issue_type = models.CharField(max_length=20, choices=ISSUE_TYPES)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    assigned_to = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="assigned_issues")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  # Tracks last modification

    class Meta:
        ordering = ['-created_at']  # Orders issues by latest created

    def __str__(self):
        return self.title  # Returns issue title 