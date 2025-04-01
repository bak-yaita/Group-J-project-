from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import UserViewSet, IssueViewSet, NotificationViewSet, UserProfileViewSet
from .viewsets.authentication_viewset import AuthenticationViewSet
   
# Create a router and register ViewSets
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'issues', IssueViewSet, basename='issue')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'auth', AuthenticationViewSet, basename='auth')
router.register(r'profile', UserProfileViewSet, basename='profile')

urlpatterns = [
    path('api/', include(router.urls)),  # Included all ViewSet routes
]