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

    class Meta:
        permissions = [
            ("can_submit_issue", "Can submit an issue"),
            ("can_assign_issue", "Can assign an issue"),
            ("can_resolve_issue", "Can resolve an issue"),
            ("can_manage_users", "Can manage users"),
        ]

    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="issues")
    user_number = models.CharField(max_length=20, default="0000000000")  
    registration_number = models.CharField(max_length=20, default="Not Assigned")  
    full_name = models.CharField(max_length=255, default="Unknown") 

    subject = models.CharField(max_length=100, default="Unknown") 
    course_code = models.CharField(max_length=255, default="Unknown") 
    course_id = models.CharField(max_length=255, default="Unknown") 
    issue_type = models.CharField(max_length=20, choices=ISSUE_TYPES)  
    category = models.CharField(max_length=255, default="General") 
    description = models.TextField()  
    year_of_study = models.IntegerField(default=1)  
    semester = models.IntegerField(default=1)   
    lecturer_name = models.CharField(max_length=255, default="Not Assigned")  

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="assigned_issues")

    resolution_notes = models.TextField(blank=True, null=True)
    assignment_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.subject} - {self.student.username}"
    
    def save(self, *args, **kwargs):
        # Update lecturer_name when assigned_to changes
        if self.assigned_to and (not self.lecturer_name or self.lecturer_name == "Not Assigned"):
            self.lecturer_name = f"{self.assigned_to.first_name} {self.assigned_to.last_name}"
        
        super().save(*args, **kwargs)
