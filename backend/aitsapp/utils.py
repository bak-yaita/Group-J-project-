from rest_framework.views import exception_handler
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    # If it's a permission denied error, customize the response
    if isinstance(exc, PermissionDenied):
        return Response({
            'error': 'Permission denied',
            'detail': 'You do not have permission to perform this action.',
            'required_role': get_required_role(context)
        }, status=status.HTTP_403_FORBIDDEN)
    
    return response

def get_required_role(context):
    """
    Try to determine what role is required for the current action.
    """
    view = context.get('view')
    if not view:
        return None
        
    # Try to get the permission classes for the current action
    if hasattr(view, 'permission_classes_by_action') and hasattr(view, 'action'):
        action = view.action
        permission_classes = view.permission_classes_by_action.get(action)
        if permission_classes:
            for permission in permission_classes:
                if permission.__name__.startswith('Is') and permission.__name__ != 'IsAuthenticated':
                    return permission.__name__[2:].lower()  # Convert IsStudent to 'student'
    
    return None