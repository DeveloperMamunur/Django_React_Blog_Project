from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.db.models import Count, Prefetch
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .models import Category, Tag, Blog, Comment, Reaction, ViewCount
from .serializers import (
    CategorySerializer,
    TagSerializer,
    BlogSerializer,
    BlogPublishSerializer,
    CommentSerializer,
    ReactionSerializer,
    PublicBlogSerializer,
    FeaturedBlogSerializer
)
from accounts.permissions import IsAdminOrAuthor, IsAuthorOrAdminForObject, IsAdmin,IsOwnerOrAdminForObject
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from .pagination import CategoryPagination, TagPagination, BlogPagination, PublicBlogPagination
from django.utils import timezone
from datetime import timedelta
from django.db import IntegrityError
from django.db.models import Q


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
    
    def get_queryset(self):
        queryset = Category.objects.all()

        # Query params
        search = self.request.query_params.get("search", "").strip()

        # Filter by search
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
            ).distinct()
            
        return queryset.order_by("-id")


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

    def get_queryset(self):
        queryset = Tag.objects.all()

        # Query params
        search = self.request.query_params.get("search", "").strip()

        # Filter by search
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
            ).distinct()
            
        return queryset.order_by("-id")


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
# Blog Views for admin and author
# ---------------------------
class BlogListCreateView(generics.ListCreateAPIView):
    serializer_class = BlogSerializer
    pagination_class = BlogPagination

    def get_permissions(self):
        if self.request.method == "POST":  # only ADMIN or AUTHOR can create
            return [permissions.IsAuthenticated(), IsAdminOrAuthor()]
        return [permissions.AllowAny()]
    def get_queryset(self):
        user = self.request.user
        queryset = Blog.objects.select_related("author", "category").prefetch_related("tags", "views")

        if user.is_authenticated and hasattr(user, "role") and user.role == "AUTHOR":
            queryset = queryset.filter(author=user)
            
        # Query params
        search = self.request.query_params.get("search", "").strip()
        category_id = self.request.query_params.get("category_id")

        # Filter by search
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(content__icontains=search)
                | Q(tags__name__icontains=search)
            ).distinct()

        # Filter by category_id
        if category_id and category_id.isdigit():
            queryset = queryset.filter(category_id=category_id)

        return queryset.order_by("-id")

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.select_related("author", "category").prefetch_related("tags")
    serializer_class = BlogSerializer

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [permissions.IsAuthenticated(), IsAuthorOrAdminForObject()]
        return [permissions.AllowAny()]

# ---------------------------
# Blog publish only admin
# ---------------------------

class BlogPublishToggleView(generics.UpdateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogPublishSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


# ---------------------------
# Blog Post Views for public
# ---------------------------
class BlogPostListView(generics.ListAPIView):
    serializer_class = PublicBlogSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PublicBlogPagination

    def get_queryset(self):
        queryset = (
            Blog.objects.filter(is_active=True, is_published=True)
            .select_related("author", "category")
            .prefetch_related(
                "tags",
                "views",
                Prefetch(
                    "comments",
                    queryset=Comment.objects.select_related("user")
                ),
                "reactions"
            )
        )

        search = self.request.query_params.get("search", "").strip()
        category_id = self.request.query_params.get("category_id")

        # Filter by search
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(content__icontains=search)
                | Q(tags__name__icontains=search)
            ).distinct()

        # Filter by category_id
        if category_id and category_id.isdigit():
            queryset = queryset.filter(category_id=category_id)

        # Add annotation counts before ordering
        queryset = queryset.annotate(
            views_count_annotated=Count("views", distinct=True),
            comments_count_annotated=Count("comments", distinct=True),
        ).order_by("-published_at", "-created_at")

        return queryset

class BlogPostDetailView(generics.RetrieveAPIView):

    serializer_class = PublicBlogSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'

    def get_queryset(self):
        return (
            Blog.objects.filter(is_active=True, is_published=True)
            .select_related("author", "category")
            .prefetch_related(
                "tags",
                "views",
                Prefetch(
                    'comments',
                    queryset=Comment.objects.select_related('user').order_by('-created_at')
                ),
                "reactions"
            )
            .annotate(
                comments_count=Count('comments', distinct=True)
            )
        )

    def retrieve(self, request, *args, **kwargs):
        """
        Override retrieve to track view count by IP address.
        Uses update_or_create to prevent duplicate views from same IP.
        """
        instance = self.get_object()
        
        # Get client IP address
        ip = self.get_client_ip(request)
        user = request.user if request.user.is_authenticated else None

        # Track view (unique per IP per blog)
        try:
            ViewCount.objects.update_or_create(
                blog=instance,
                ip_address=ip,
                defaults={'user': user}
            )
        except IntegrityError:
            # Ignore duplicate view
            pass

        # Return serialized blog data
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def get_client_ip(self, request):
        """
        Extract client IP address from request.
        Handles proxy forwarding (X-Forwarded-For header).
        """
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            # Take first IP in chain
            ip = x_forwarded_for.split(",")[0].strip()
        else:
            ip = request.META.get("REMOTE_ADDR")
        return ip

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
    serializer_class = FeaturedBlogSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Blog.objects.filter(
            is_featured=True, is_published=True, is_active=True
        ).order_by("-published_at", "-created_at")[:3]

# ---------------------------
# Comment Views
# ---------------------------
class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Comment.objects.filter(blog_id=self.kwargs["blog_id"], parent__isnull=True)

    def perform_create(self, serializer):
        blog_id = self.kwargs["blog_id"]
        serializer.save(user=self.request.user, blog_id=blog_id)


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
class ReactionViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, blog_pk=None):
        """Get reaction counts for a blog"""
        try:
            blog = Blog.objects.get(pk=blog_pk)
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=404)

        # Get counts for each reaction type
        counts = blog.reactions.values('type').annotate(count=Count('type'))
        reaction_counts = {item['type']: item['count'] for item in counts}
        
        # Initialize all types with 0
        all_counts = {rtype: 0 for rtype, _ in Reaction.REACTION_CHOICES}
        all_counts.update(reaction_counts)

        # Get user's current reaction
        user_reaction = None
        if request.user.is_authenticated:
            reaction = blog.reactions.filter(user=request.user).first()
            user_reaction = reaction.type if reaction else None

        return Response({
            'counts': all_counts,
            'user_reaction': user_reaction
        })

    def create(self, request, blog_pk=None):
        """Add or toggle a reaction"""
        try:
            blog = Blog.objects.get(pk=blog_pk)
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=404)

        reaction_type = request.data.get('type')
        
        if not reaction_type or reaction_type not in dict(Reaction.REACTION_CHOICES):
            return Response(
                {"error": "Invalid reaction type"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get existing reaction
        existing_reaction = Reaction.objects.filter(
            blog=blog, 
            user=request.user
        ).first()


        if existing_reaction and existing_reaction.type == reaction_type:
            existing_reaction.delete()
            user_reaction = None

        elif existing_reaction:
            existing_reaction.type = reaction_type
            existing_reaction.save()
            user_reaction = reaction_type

        else:
            Reaction.objects.create(
                blog=blog,
                user=request.user,
                type=reaction_type
            )
            user_reaction = reaction_type


        counts = blog.reactions.values('type').annotate(count=Count('type'))
        reaction_counts = {item['type']: item['count'] for item in counts}
        

        all_counts = {rtype: 0 for rtype, _ in Reaction.REACTION_CHOICES}
        all_counts.update(reaction_counts)

        return Response({
            'counts': all_counts,
            'user_reaction': user_reaction
        })