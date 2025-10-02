from django.urls import path
from . import views

urlpatterns = [
    # Categories
    path("categories/", views.CategoryListCreateView.as_view(), name="category-list"),
    path("categories/<int:pk>/", views.CategoryDetailView.as_view(), name="category-detail"),

    # Tags
    path("tags/", views.TagListCreateView.as_view(), name="tag-list"),
    path("tags/<int:pk>/", views.TagDetailView.as_view(), name="tag-detail"),

    # Blogs
    path("blogs/", views.BlogListCreateView.as_view(), name="blog-list"),
    path("blogs/<int:pk>/", views.BlogDetailView.as_view(), name="blog-detail"),

    path("blogs/<int:pk>/publish/", views.BlogPublishToggleView.as_view(), name="blog-publish-toggle"),

    # Comments
    path("blogs/<int:blog_id>/comments/", views.CommentListCreateView.as_view(), name="comment-list"),
    path("comments/<int:pk>/", views.CommentDetailView.as_view(), name="comment-detail"),

    # Likes
    path("blogs/<int:blog_id>/likes/", views.LikeListCreateView.as_view(), name="like-list"),
    path("likes/<int:pk>/", views.LikeDetailView.as_view(), name="like-detail"),

    # public urls 
    path("blogs/featured/", views.FeaturedBlogListView.as_view(), name="featured-blogs"),
]