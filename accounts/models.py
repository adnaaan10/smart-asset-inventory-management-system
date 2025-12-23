from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = (
        ("ADMIN","Admin"),
        ("EMPLOYEE","Employee"),
        ("TECHNICIAN","Technician"),
    )

    role = models.CharField(max_length=20,choices=ROLE_CHOICES,default="EMPLOYEE")

    def __str__(self):
        return f"{self.username} ({self.role})"
