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
    
    