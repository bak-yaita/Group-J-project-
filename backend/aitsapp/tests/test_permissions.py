from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from aitsapp.models import User, Issue
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

class PermissionTests(TestCase):
    def setUp(self):
        # Create test users
        self.student = User.objects.create_user(
            username='student', 
            password='password',
            email='student@example.com',
            role='student',
            college='COCIS',
            user_number='S12345',
            registration_number='2020/HD05/1234B',
            first_name='Student',
            last_name='User'
        )
        
        self.lecturer = User.objects.create_user(
            username='lecturer', 
            password='password',
            email='lecturer@example.com',
            role='lecturer',
            college='COCIS',
            user_number='L12345',
            first_name='Lecturer',
            last_name='User'
        )
        
        self.registrar = User.objects.create_user(
            username='registrar', 
            password='password',
            email='registrar@example.com',
            role='registrar',
            college='COCIS',
            first_name='Registrar',
            last_name='User'
        )
        
        # Create permissions if they don't exist
        content_type = ContentType.objects.get_for_model(Issue)
        
        for perm_name, perm_display in [
            ('submit_issue', 'Can submit issues'),
            ('view_own_issues', 'Can view own issues'),
            ('view_assigned_issues', 'Can view assigned issues'),
            ('update_issue_status', 'Can update issue status'),
            ('view_all_issues', 'Can view all issues'),
            ('assign_issues', 'Can assign issues'),
            ('manage_users', 'Can manage users'),
            ('configure_settings', 'Can configure settings'),
        ]:
            Permission.objects.get_or_create(
                codename=perm_name,
                name=perm_display,
                content_type=content_type,
            )
        
        # Create a test issue
        self.issue = Issue.objects.create(
            student=self.student,
            subject='Test Issue',
            description='This is a test issue',
            issue_type='missing_marks',
            registration_number=self.student.registration_number,
            user_number=self.student.user_number,
            full_name=f"{self.student.first_name} {self.student.last_name}"
        )
        
        # Set up API client and URLs
        self.client = APIClient()
        self.issue_list_url = reverse('issue-list')
        self.issue_detail_url = reverse('issue-detail', args=[self.issue.id])
        
        # For custom actions, use the action name format: viewset-basename-action-name
        self.issue_assign_url = reverse('issue-assign', args=[self.issue.id])
        self.issue_resolve_url = reverse('issue-resolve', args=[self.issue.id])
        
        # Auth URLs
        self.login_url = reverse('auth-login')
        self.logout_url = reverse('auth-logout')
        self.register_url = reverse('auth-register')
        self.user_details_url = reverse('auth-details')