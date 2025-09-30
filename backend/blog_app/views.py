from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from .models import Category, Tag, Blog, Comment, Like
from .serializers import (
    CategorySerializer,
    TagSerializer,
    BlogSerializer,
    BlogPublishSerializer,
    CommentSerializer,
    LikeSerializer,
)
from accounts.permissions import IsAdminOrAuthor, IsAuthorOrAdminForObject, IsAdmin,IsOwnerOrAdminForObject

User = get_user_model()


# ---------------------------
# Category Views
# ---------------------------
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# ---------------------------
# Tag Views
# ---------------------------
class TagListCreateView(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class TagDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# ---------------------------
# Blog Views
# ---------------------------
class BlogListCreateView(generics.ListCreateAPIView):
    queryset = Blog.objects.select_related("author", "category").prefetch_related("tags")
    serializer_class = BlogSerializer

    def get_permissions(self):
        if self.request.method == "POST":  # only ADMIN or AUTHOR can create
            return [permissions.IsAuthenticated(), IsAdminOrAuthor()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.select_related("author", "category").prefetch_related("tags")
    serializer_class = BlogSerializer

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [permissions.IsAuthenticated(), IsAuthorOrAdminForObject()]
        return [permissions.AllowAny()]


class BlogPublishToggleView(generics.UpdateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogPublishSerializer
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrAdminForObject]

# ---------------------------
# Comment Views
# ---------------------------
class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Comment.objects.filter(blog_id=self.kwargs["blog_id"], parent__isnull=True)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [permissions.IsAuthenticated(), IsOwnerOrAdminForObject()]
        return [permissions.AllowAny()]


# ---------------------------
# Like Views
# ---------------------------
class LikeListCreateView(generics.ListCreateAPIView):
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Like.objects.filter(blog_id=self.kwargs["blog_id"])

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class LikeDetailView(generics.RetrieveDestroyAPIView):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer

    def get_permissions(self):
        return [permissions.IsAuthenticated(), IsOwnerOrAdminForObject()]
