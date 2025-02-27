from django.urls import path, include
from rest_framework.routers import DefaultRouter
from aitsapp.viewsets import UserViewSet, IssueViewSet, NotificationViewSet

# Created a router and register ViewSets
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'issues', IssueViewSet, basename='issue')
router.register(r'notifications', NotificationViewSet, basename='notification')

# I Defined API URLs
urlpatterns = [
    path('api/', include(router.urls)),  # Included all API routes
]
