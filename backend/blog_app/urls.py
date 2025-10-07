from django.urls import path
from . import views

urlpatterns = [
    # Categories
    path("categories/", views.CategoryListCreateView.as_view(), name="category-list"),
    path("categories/<int:pk>/", views.CategoryDetailView.as_view(), name="category-detail"),
    path("categories/all/", views.CategoryListNoPagination.as_view(), name="category-list-all"),

    # Tags
    path("tags/", views.TagListCreateView.as_view(), name="tag-list"),
    path("tags/<int:pk>/", views.TagDetailView.as_view(), name="tag-detail"),
    path("tags/all/", views.TagListNoPagination.as_view(), name="category-list-all"),

    # Blogs
    path("blogs/", views.BlogListCreateView.as_view(), name="blog-list"),
    path("blogs/<int:pk>/", views.BlogDetailView.as_view(), name="blog-detail"),

    path("blogs/<int:pk>/publish/", views.BlogPublishToggleView.as_view(), name="blog-publish-toggle"),

    # Comments
    path("blogs/<int:blog_id>/comments/", views.CommentListCreateView.as_view(), name="comment-list"),
    path("comments/<int:pk>/", views.CommentDetailView.as_view(), name="comment-detail"),

    # Likes
    path('blogs/<int:blog_pk>/reactions/', views.ReactionViewSet.as_view({'get': 'list', 'post': 'create'}), name='blog-reactions'),

    # public urls 
    path("blogs/featured/", views.FeaturedBlogListView.as_view(), name="featured-blogs"),
    path("stats/", views.StatsCountView.as_view(), name="stats-count"),
    path("posts/", views.BlogPostListView.as_view(), name="blog-list"),
    path("posts/<str:slug>/", views.BlogPostDetailView.as_view(), name="blog-detail"),
]