from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.core.validators import FileExtensionValidator
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import AbstractUser, BaseUserManager, Group

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        # Assign user to their respective Django Group
        if user.role:
            group, _ = Group.objects.get_or_create(name=user.role)
            user.groups.add(group)

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
        ('COCIS', 'Computing & Information Sciences'),
        ('CEDAT', 'Engineering, Design, Art & Technology'),
        ('CONAS', 'Natural Sciences'),
        ('CEES', 'Education & External Studies'),
        ('CHUSS', 'Humanities & Social Sciences'),
        ('COBAMS', 'Business & Management'),
        ('COVAB', 'Veterinary Medicine'),
        ('SOL', 'School of Law'),
        ('CAES', 'Agriculture & Environmental Sciences'),
    ]

    email = models.EmailField(unique=True)  
    college = models.CharField(max_length=50, choices=COLLEGE_CHOICES, default='Unknown') 
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
    
    def save(self, *args, **kwargs):
        """"Assign permissions based on roles when user is created"""
        perms = getattr(self, 'perms', [])
        is_new = self.pk is None  # Check if this is a new user
        super().save(*args,**kwargs)

        if is_new: 
            group, created = Group.objects.get_or_create(name=self.role)
            self.groups.add(group)

            #Assign specific permissions based on roles
            if self.role == 'student':
                perms =["submit_issue", "view_own_issues"]
            elif self.role == 'lecturer':
                perms = ["view_assigned_issues", "update_issue_status"]
            elif self.role == 'registrar':
                perms = ["view_all_issues", "assign_issues", "update_issue_status"]
            elif self.role == 'admin':
                perms = ["manage_users", "configure_settings"]

            group.permissions.clear()
            for perm_codename in perms:
                try:
                    permissions = Permission.objects.get(codename=perm_codename)
                    group.permissions.add(permissions)
                except Permission.DoesNotExist:
                    print(f"Permission {perm_codename} does not exist")

            

    def __str__(self):
        return f"{self.username} - {self.role} ({self.college})"
    