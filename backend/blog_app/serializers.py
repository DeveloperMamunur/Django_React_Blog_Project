from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Category, Tag, Blog, Comment, Reaction
from accounts.serializers import UserSerializer 
from django.utils.timesince import timesince
from collections import Counter
from django.db.models import Count

User = get_user_model()

# ---------------------------
# Category Serializer
# ---------------------------
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "is_active"]


# ---------------------------
# Tag Serializer
# ---------------------------
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name","is_active"]


# ---------------------------
# Blog Serializer
# ---------------------------
class BlogSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", write_only=True, required=False
    )
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), source="tags", many=True, write_only=True, required=False
    )

    class Meta:
        model = Blog
        fields = [
            "id",
            "title",
            "author",
            "category",
            "tags",
            "category_id",
            "tag_ids",
            "content",
            "image",
            "is_published",
            "created_at",
            "updated_at",
            "published_at",
            "is_featured",
            "is_active",
        ]

    def create(self, validated_data):
        tags = validated_data.pop("tags", [])
        blog = Blog.objects.create(**validated_data)
        blog.tags.set(tags)
        return blog

    def update(self, instance, validated_data):
        tags = validated_data.pop("tags", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if tags is not None:
            instance.tags.set(tags)
        instance.save()
        return instance


# ---------------------------
# Blog Publish Serializer
# ---------------------------
class BlogPublishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ["is_published", "published_at"]

    def update(self, instance, validated_data):
        # Toggle publish/unpublish
        is_published = validated_data.get("is_published", instance.is_published)
        instance.is_published = is_published

        # Set published_at only when publishing
        if is_published:
            from django.utils import timezone
            instance.published_at = timezone.now()
        else:
            instance.published_at = None

        instance.save()
        return instance

# ---------------------------
# Comment Serializer
# ---------------------------
class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ["id", "blog", "user", "content", "parent", "replies", "created_at", "updated_at"]

    def get_replies(self, obj):
        replies = obj.replies.select_related("user").all()
        return CommentSerializer(replies, many=True).data
        
    def get_time_ago(self, obj):
        return timesince(obj.created_at) + " ago"

# ---------------------------
# Like Serializer
# ---------------------------
class ReactionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Reaction
        fields = ["id", "user", "type", "created_at"]

class FeaturedBlogSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(
        slug_field='name', 
        read_only=True
    )

    class Meta:
        model = Blog
        fields = [
            "id", 
            "title", 
            "content", 
            "category",
            "slug", 
            "is_published", 
            "is_featured", 
            "is_active",
        ]

# ---------------------------
# Public Blog Serializer
# ---------------------------
class PublicBlogSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    views_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    user_reaction = serializers.SerializerMethodField()
    reaction_counts = serializers.SerializerMethodField()

    def get_views_count(self, obj):
        """Get unique view count from ViewCount model"""
        return obj.views.count()
    
    def get_comments_count(self, obj):
        """Get comment count"""

        if hasattr(obj, 'comments_count'):
            return obj.comments_count
        return obj.comments.count()

    def get_user_reaction(self, obj):
        """Get current user's reaction to this blog"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            reaction = obj.reactions.filter(user=request.user).first()
            return reaction.type if reaction else None
        return None
    
    def get_reaction_counts(self, obj):
        """Get counts for each reaction type"""
        counts = obj.reactions.values('type').annotate(count=Count('type'))
        return {item['type']: item['count'] for item in counts}

    class Meta:
        model = Blog
        fields = [
            "id", 
            "title", 
            "slug", 
            "author", 
            "category", 
            "tags",
            "content", 
            "image", 
            "published_at", 
            "created_at",
            "views_count", 
            "comments_count",
            "user_reaction", 
            "reaction_counts"
        ]