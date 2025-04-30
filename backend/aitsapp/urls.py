from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import UserViewSet, IssueViewSet, NotificationViewSet
from .viewsets.authentication_viewset import AuthenticationViewSet
from .viewsets.userprofile_viewset import UserProfileViewSet 
from .viewsets.dashboard_viewset import DashboardViewSet
from .viewsets.auditlog_viewset import AuditLogViewSet
from .viewsets import ForgotPasswordViewSet, PasswordResetConfirmViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'issues', IssueViewSet, basename='issue')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'auth', AuthenticationViewSet, basename='auth')
router.register(r'dashboard', DashboardViewSet, basename='dashboard')
router.register(r'audit-logs',AuditLogViewSet, basename='auditlog')
router.register(r'forgot-password', ForgotPasswordViewSet, basename='forgot-password')
router.register(r'reset-password', PasswordResetConfirmViewSet, basename='reset-password')
from .views import CustomLoginView, verify_otp, LogoutView

urlpatterns = [
    path('api/', include(router.urls)),

    path('api/profile/', UserProfileViewSet.as_view({
        'get': 'retrieve_profile',
        'patch': 'update_profile'
    }), name='profile'),

    path('api/profile/change_password/', UserProfileViewSet.as_view({
        'post': 'change_password'
    }), name='change_password'),

    path('api/profile/profile-picture/', UserProfileViewSet.as_view({
        'post': 'profile_picture'
    }), name='profile-picture'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('verify-otp/', verify_otp, name='verify-otp'),
    path('logout/', LogoutView.as_view(), name='logout')
]
