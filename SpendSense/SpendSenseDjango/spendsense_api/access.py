from rest_framework.permissions import BasePermission

class IsAdminOrReactWebsite(BasePermission):
    """
    Custom permission to allow access to admin users or requests from the React website.
    """
    def has_permission(self, request, view):
        # Allow access if the user is an admin
        if request.user and request.user.is_staff:
            return True

        # Allow access if the request contains the custom header from the React website
        react_header = request.headers.get('token')
        if react_header == 'icallthisarandomtoken':
            return True

        # Deny access otherwise
        return False