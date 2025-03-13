from django.urls import path, include
from rest_framework.routers import DefaultRouter
from aitsapp.viewsets import UserViewSet, IssueViewSet, NotificationViewSet
from .views import (
    login_view, logout_view,
    student_dashboard, lecturer_dashboard, registrar_dashboard, admin_dashboard,
    submit_issue, get_student_details, get_issues
)

# Create a router and register ViewSets
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'issues', IssueViewSet, basename='issue')
router.register(r'notifications', NotificationViewSet, basename='notification')

# API Endpoints for Users, Issues, and Notifications
urlpatterns = [
    path('api/', include(router.urls)),  # Include all ViewSet routes

    # Authentication Endpoints
    path("auth/login/", login_view, name="login"),
    path("auth/logout/", logout_view, name="logout"),

    # Dashboard Endpoints (Role-Based)
    path("dashboard/student/", student_dashboard, name="student_dashboard"),
    path("dashboard/lecturer/", lecturer_dashboard, name="lecturer_dashboard"),
    path("dashboard/registrar/", registrar_dashboard, name="registrar_dashboard"),
    path("dashboard/admin/", admin_dashboard, name="admin_dashboard"),

    # Issue Submission & Management
    path("issues/submit/", submit_issue, name="submit_issue"),
    path("issues/", get_issues, name="get_issues"),  # Fetch issues based on user role
    path("student/details/", get_student_details, name="get_student_details"),
]
