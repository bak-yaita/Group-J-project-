from django.urls import path, include
from rest_framework.routers import DefaultRouter
from aitsapp.viewsets import UserViewSet, IssueViewSet, NotificationViewSet, AuthenticationViewSet
   

# Create a router and register ViewSets
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'issues', IssueViewSet, basename='issue')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'auth', AuthenticationViewSet, basename='auth')

urlpatterns = [
    path('api/', include(router.urls)),  # Include all ViewSet routes
]