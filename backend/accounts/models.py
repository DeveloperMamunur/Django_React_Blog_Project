from django.db import models
from django.contrib.auth.models import User, AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = (
        ("ADMIN", "Admin"),
        ("AUTHOR", "Author"),
        ("USER", "User"),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="USER")
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.username} ({self.role})"