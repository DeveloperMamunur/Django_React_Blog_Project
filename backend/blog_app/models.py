from django.db import models


from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.utils import timezone

User = get_user_model()
# Create your models here.

# ---------------------------
# Category Model
# ---------------------------
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, db_index=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    is_active = models.BooleanField(default=True)


    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


# ---------------------------
# Tag Model
# ---------------------------
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True, db_index=True)
    slug = models.SlugField(max_length=60, unique=True, blank=True)
    is_active = models.BooleanField(default=True)


    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


# ---------------------------
# Blog (Post) Model
# ---------------------------
class Blog(models.Model):
    title = models.CharField(max_length=255, unique=True, db_index=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="blogs"
    )
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="blogs"
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name="blogs")
    content = models.TextField()
    image = models.ImageField(upload_to="blog_images/", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["is_published"]),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # Generate unique slug
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Blog.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        # Auto set published date
        if self.is_published and self.published_at is None:
            self.published_at = timezone.now()

        # new blogs are always active
        if self.pk is None:
            self.is_active = True

        super().save(*args, **kwargs)


# ---------------------------
# Notification Model
# ---------------------------
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    message = models.TextField()
    link = models.URLField(max_length=2000, blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message[:50]}"

# ---------------------------
# Comment Model
# ---------------------------
class Comment(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField()

    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="replies"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Comment by {self.user} on {self.blog}"


# ---------------------------
# Like / Reaction Model
# ---------------------------
class Like(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name="likes")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="likes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("blog", "user")  # prevent duplicate likes

    def __str__(self):

        return f"{self.user} likes {self.blog}"


# ---------------------------
# ViewCount Model
# ---------------------------
class ViewCount(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name="views")
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="views"
    )
    ip_address = models.CharField(max_length=45, blank=True, null=True)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("blog", "ip_address")

    def __str__(self):

        return f"{self.blog.title} viewed by {self.user.username if self.user else self.ip_address}"


# ---------------------------
# ContactMessage Model
# ---------------------------
class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200, blank=True, null=True)
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-sent_at"]

    def __str__(self):

        return f"Message from {self.name} - {self.subject[:50]}"


# ---------------------------
# Advertisement Model
# ---------------------------
class Advertisement(models.Model):
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to="advertisements/")
    url = models.URLField(max_length=2000)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]


    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            counter = 1
            slug = base_slug
            while Advertisement.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        super().save(*args, **kwargs)