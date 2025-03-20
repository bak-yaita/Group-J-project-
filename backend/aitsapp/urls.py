from django.urls import path, include
from rest_framework.routers import DefaultRouter
from aitsapp.viewsets import UserViewSet, IssueViewSet, NotificationViewSet
from aitsapp.viewsets.authentication_viewset import AuthenticationViewSet
   

# Create a router and register ViewSets
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'issues', IssueViewSet, basename='issue')
router.register(r'notifications', NotificationViewSet, basename='notification')

# API Endpoints for Users, Issues, and Notifications
urlpatterns = [
    path('api/', include(router.urls)),  # Include all ViewSet routes
]