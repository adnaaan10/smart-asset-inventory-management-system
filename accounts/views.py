from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework import status
from django.contrib.auth import get_user_model

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user

    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    if not old_password or not new_password:
        return Response(
            {"error": "Both old and new passwords are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not user.check_password(old_password):
        return Response(
            {"error": "Old password is incorrect"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.set_password(new_password)
    user.save()

    return Response(
        {"message": "Password updated successfully"},
        status=status.HTTP_200_OK
    )


User = get_user_model()

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_users(request):
    if request.user.role != "ADMIN":
        return Response({"error": "Forbidden"}, status=403)

    users = User.objects.all().order_by("username")
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def assignable_users(request):
    if request.user.role != "ADMIN":
        return Response({"error": "Forbidden"}, status=403)

    users = User.objects.filter(role="EMPLOYEE", is_active=True).order_by("username")
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

