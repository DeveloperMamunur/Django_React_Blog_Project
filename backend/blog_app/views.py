from rest_framework import generics, permissions
from rest_framework.response import Response
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
from rest_framework.permissions import AllowAny
from .pagination import CategoryPagination, TagPagination, BlogPagination
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


# ---------------------------
# Category Views
# ---------------------------
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = CategoryPagination

    def get_permissions(self):
        if self.request.method == "POST":  # only ADMIN can create
            return [permissions.IsAuthenticated(), IsAdmin()]
        return [permissions.AllowAny()]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [permissions.IsAuthenticated(), IsAdmin()]
        return [permissions.AllowAny()]

class CategoryListNoPagination(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrAdminForObject]
    pagination_class = None

# ---------------------------
# Tag Views
# ---------------------------
class TagListCreateView(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    pagination_class = TagPagination

    def get_permissions(self):
        if self.request.method == "POST":  # only ADMIN can create
            return [permissions.IsAuthenticated(), IsAdmin()]
        return [permissions.AllowAny()]


class TagDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    
    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [permissions.IsAuthenticated(), IsAdmin()]
        return [permissions.AllowAny()]

class TagListNoPagination(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrAdminForObject]
    pagination_class = None


# ---------------------------
# Blog Views
# ---------------------------
class BlogListCreateView(generics.ListCreateAPIView):
    queryset = Blog.objects.select_related("author", "category").prefetch_related("tags")
    serializer_class = BlogSerializer
    pagination_class = BlogPagination

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
# Blog posts and user count Views
# ---------------------------
class StatsCountView(generics.GenericAPIView):
    permission_classes = [AllowAny]   # anyone can view stats

    def get(self, request, *args, **kwargs):
        blog_count = Blog.objects.filter(is_published=True, is_active=True).count()
        user_count = User.objects.filter(is_active=True).count()
        week_ago = timezone.now() - timedelta(days=7)
        new_content_count = Blog.objects.filter(created_at__gte=week_ago, is_published=True, is_active=True).count()

        return Response({
            "blog_count": blog_count,
            "user_count": user_count,
            "new_content_count": new_content_count,
        })

# ---------------------------
# Featured Blog posts Views
# ---------------------------
class FeaturedBlogListView(generics.ListAPIView):
    serializer_class = BlogSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Blog.objects.filter(
            is_featured=True, is_published=True, is_active=True
        ).order_by("-published_at", "-created_at")

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
