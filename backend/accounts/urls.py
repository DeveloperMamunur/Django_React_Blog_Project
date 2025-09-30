from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

urlpatterns = [
    # User registration
    path("register/", views.RegisterView.as_view(), name="register"),

    # User list & detail
    path("users/", views.UserListView.as_view(), name="user-list"),
    path("users/<int:pk>/", views.UserDetailView.as_view(), name="user-detail"),

    # JWT Authentication
    path("login/", TokenObtainPairView.as_view(), name="login"),       # get access + refresh token
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Protected Route
    path("protected/", views.CurrentUserView.as_view(), name="current-user"),
]