from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, Permission
from django.db import models
from django.core.validators import FileExtensionValidator
from auditlog.registry import auditlog

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)


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
        ('CAES', 'CAES')
    ]

    email = models.EmailField(unique=True)  
    college = models.CharField(max_length=50, choices=COLLEGE_CHOICES, default='Unknown') 
    role = models.CharField(max_length=20, choices=ROLES)
    user_number = models.CharField(max_length=20, unique=True, blank=True, null=True)
    groups = models.ManyToManyField(Group, related_name="custom_user_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="custom_user_permissions", blank=True)
    registration_number = models.CharField(max_length=20, unique=True, blank=True, null=True)
    

    profile_picture = models.ImageField(
        upload_to='profile_pictures/', 
        validators=[FileExtensionValidator(['png', 'jpg', 'jpeg'])],
        blank=True, 
        null=True
    )

    objects = CustomUserManager()

    class Meta:
        permissions = [
            ("submit_issue", "Can submit issues"),
            ("view_own_issues", "Can view own issues"),
            ("view_assigned_issues", "Can view assigned issues"),
            ("update_issue_status", "Can update issue status"),
            ("view_all_issues", "Can view all issues"),
            ("assign_issues", "Can assign issues"),
            ("manage_users", "Can manage users"),
            ("configure_settings", "Can configure settings"), 
        ]

    def assign_role_and_permissions(self):
        if self.role == 'admin':
            group_name = "Admin"
        else:
            group_name = f"{self.role.capitalize()}_{self.college.upper()}"

        group, created = Group.objects.get_or_create(name=group_name)
        self.groups.add(group)

        # Define permissions
        if self.role == 'student':
            perms = ["submit_issue", "view_own_issues"]
        elif self.role == 'lecturer':
            perms = ["view_assigned_issues", "update_issue_status"]
        elif self.role == 'registrar':
            perms = ["view_all_issues", "assign_issues", "update_issue_status"]
        elif self.role == 'admin':
            perms = ["manage_users", "configure_settings"]
        else:
            perms = []

        # Assign permissions to group
        group.permissions.clear()
        for codename in perms:
            try:
                perm = Permission.objects.get(codename=codename)
                group.permissions.add(perm)
            except Permission.DoesNotExist:
                print(f"⚠️ Permission '{codename}' does not exist.")

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            self.assign_role_and_permissions()

    def __str__(self):
        return f"{self.username} - {self.role.capitalize()} ({self.college})"


auditlog.register(User)
