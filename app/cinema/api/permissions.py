from rest_framework import permissions


class IsOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return request.user == obj.creator
        return True


class IsOwnerOrReadOnly(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, "creator"):
            user = obj.creator
        else:
            user = obj

        return (user == request.user
                or request.method in permissions.SAFE_METHODS)
