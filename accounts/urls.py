from django.urls import path
from .views import current_user,change_password,list_users,assignable_users

urlpatterns = [
    path("me/", current_user),
    path("change-password/",change_password),
    path("users/",list_users),
    path("users/assignable/", assignable_users),
    

]
