from rest_framework.permissions import BasePermission,SAFE_METHODS

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == "ADMIN"
        )
    
class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated

        return (
            request.user.is_authenticated and
            request.user.role == "ADMIN"
        )
    

class IsTechnician(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == "TECHNICIAN"
        )


class IsAdminOrTechnician(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role in ["ADMIN", "TECHNICIAN"]
        )

# Assignment permissions

class AssignmentPermission(BasePermission):
    """
    ADMIN      -> Full access
    EMPLOYEE   -> Read-only
    TECHNICIAN -> No access
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.user.role == "ADMIN":
            return True

        if request.user.role == "EMPLOYEE" and request.method in SAFE_METHODS:
            return True

        return False



# Repair Ticket permissions

class RepairTicketPermission(BasePermission):
    """
    ADMIN      -> Full access
    EMPLOYEE   -> Create + Read
    TECHNICIAN -> Update + Read
    """

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        return True

    def has_object_permission(self, request, view, obj):
        user = request.user

        # Admin → full access
        if user.role == "ADMIN":
            return True

        # Employee → only their tickets
        if user.role == "EMPLOYEE":
            return obj.reported_by == user

        # Technician → only assigned tickets
        if user.role == "TECHNICIAN":
            return obj.assigned_technician == user

        return False