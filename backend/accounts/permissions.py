from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Allow only ADMIN role"""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "ADMIN"


class IsAuthor(permissions.BasePermission):
    """Allow only AUTHOR role"""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "AUTHOR"


class IsAdminOrAuthor(permissions.BasePermission):
    """Allow ADMIN or AUTHOR"""

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in ["ADMIN", "AUTHOR"]
        )


class IsAuthorOrAdminForObject(permissions.BasePermission):
    """Object-level permission:
       - Admin can edit/delete any blog
       - Author can edit/delete only their own blog
    """

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        if request.user.role == "ADMIN":
            return True
        return obj.author == request.user

class IsOwnerOrAdminForObject(permissions.BasePermission):
    """
    Object-level permission:
      - Admin can edit/delete any object
      - Owner (user) can edit/delete their own object
    """
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        if request.user.role == "ADMIN":
            return True
        # Works for Comment, Like, or any model with 'user' field
        return getattr(obj, "user", None) == request.user
