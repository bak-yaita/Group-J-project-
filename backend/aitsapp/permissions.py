from rest_framework.permissions import BasePermission

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'
    

class IsLecturer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'lecturer'
    

class IsRegistrar(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'registrar'
    

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'
    
class IsOwnerOrStaff(BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Staff users can edit any object.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.role in ['registrar', 'admin']:
            return True
        if hasattr(obj, 'student'):
            return obj.student == request.user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return obj == request.user

from rest_framework.permissions import BasePermission

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'
    

class IsLecturer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'lecturer'
    

class IsRegistrar(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'registrar'
    

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'
    
class IsOwnerOrStaff(BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Staff users can edit any object.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.role in ['registrar', 'admin']:
            return True
        if hasattr(obj, 'student'):
            return obj.student == request.user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return obj == request.user
    
class CanResolveIssue(BasePermission):
    """
    Permission to check if user can resolve an issue.
    Staff, registrars, or the assigned lecturer can resolve issues.
    """
    def has_object_permission(self, request, view, obj):
        return (request.user.is_staff or 
                request.user.role == 'registrar' or 
                (hasattr(obj, 'assigned_to') and obj.assigned_to == request.user)) 


class IsSameCollege(BasePermission):
    """
    Allows access only if the user's college matches the object's college.
    Admins bypass this check.
    """

    def has_object_permission(self, request, view, obj):
        # Admins can access all
        if request.user.role == 'admin' or request.user.is_superuser:
            return True

        user_college = request.user.college

        # Check college from different object structures
        if hasattr(obj, 'college'):
            return obj.college == user_college
        elif hasattr(obj, 'student') and hasattr(obj.student, 'college'):
            return obj.student.college == user_college
        elif hasattr(obj, 'assigned_to') and hasattr(obj.assigned_to, 'college'):
            return obj.assigned_to.college == user_college

        # Default deny
        return False
