from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Category, Tag, Blog, Comment, Like
from accounts.serializers import UserSerializer 
from django.utils.timesince import timesince

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
class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Like
        fields = ["id", "blog", "user", "created_at"]

    def validate(self, attrs):
        request = self.context.get("request")
        user = request.user
        blog = attrs.get("blog")
        if Like.objects.filter(user=user, blog=blog).exists():
            raise serializers.ValidationError("You already liked this blog.")
        return attrs


# ---------------------------
# Public Blog Serializer
# ---------------------------
class PublicBlogSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    likes_count = serializers.IntegerField(source="likes.count", read_only=True)
    views_count = serializers.IntegerField(source="views.count", read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    time_since_published = serializers.SerializerMethodField()

    def get_replies(self, obj):
        serializer = CommentSerializer(obj.replies.all(), many=True)
        return serializer.data

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
            "is_featured",
            "is_published",
            "likes_count",
            "views_count",
            "comments",
            "published_at",
            "time_since_published",
        ]

    def get_time_since_published(self, obj):
        if obj.published_at:
            return timesince(obj.published_at) + " ago"
        return None