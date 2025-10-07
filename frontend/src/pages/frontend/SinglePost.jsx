import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Eye, Calendar, User, ArrowLeft, Share2, MessageCircle, Send } from 'lucide-react';
import { commentService } from '../../services/commentService';
import { reactionService } from '../../services/reactionService';
import { useAuth } from '../../hooks/useAuth';
import ReactionBar from '../../components/reactions/ReactionBar';
import { postService } from '../../services/postService';


export default function BlogDetails() {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { currentUser } = useAuth(); 
    const [content, setContent] = useState('');
    const [comments, setComments] = useState([]);
    const [reactions, setReactions] = useState({});
    const [userReaction, setUserReaction] = useState(null);

    // Fetch blog details - view count is automatically incremented by backend
    useEffect(() => {
        const fetchBlogDetails = async () => {
            if (!slug || slug === 'undefined') {
                console.error('Invalid slug:', slug);
                setIsLoading(false);
                return;
            }
            
            try {
                setIsLoading(true);
                const data = await postService.getBlogPost(slug);
                
                console.log('📊 Blog Detail Response:', data);
                console.log('👁️ Views count:', data.views_count);
                console.log('💬 Comments count:', data.comments_count);
                
                setBlog(data);
                
                if (data.reaction_counts) {
                    setReactions(data.reaction_counts);
                }
                if (data.user_reaction) {
                    setUserReaction(data.user_reaction);
                }
            } catch (error) {
                console.error('Error fetching blog details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogDetails();
    }, [slug]);

    // Fetch comments when blog is loaded
    useEffect(() => {
        const getComments = async () => {
            if (!blog?.id) return;
            
            try {
                const commentsData = await commentService.getComments(blog.id);
                setComments(commentsData.results || []);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        getComments();
    }, [blog?.id]);

    const handleReact = async (type) => {
        if (!blog?.id) return;
        
        try {
            const updated = await reactionService.reactToBlog(blog.id, type);
            return updated;
        } catch (error) {
            console.error('Error reacting to blog:', error);
            throw error;
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: blog?.title,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) return alert("Please enter a comment.");
        if (!currentUser) return alert("You must be logged in to comment.");

        try {
            const comment = await commentService.createComments(blog.id, content);
            setComments([comment, ...comments]);
            setContent('');
        } catch (error) {
            console.error('Error creating comment:', error);
            alert('Failed to post comment');
        }
    };

    if (isLoading) {
        return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                </div>
            </div>
            </div>
        </div>
        );
    }

    if (!blog) {
        return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
            <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Blog not found</h2>
            <button
                onClick={() => navigate('/posts')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Back to Blogs
            </button>
            </div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/posts')}
                    className="flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Blogs
                </button>

                {/* Blog Header */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                {/* Featured Image */}
                    <img
                        src={blog.image || '/fallback-image.jpg'}
                        alt={blog.title}
                        className="w-full h-96 object-cover"
                    />

                    {/* Content */}
                    <div className="p-8">
                        {/* Category and Date */}
                        <div className="flex items-center justify-between mb-6">
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-semibold px-4 py-2 rounded-full">
                                {blog.category?.name || 'Uncategorized'}
                            </span>
                            <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
                                <Calendar className="w-4 h-4 mr-2" />
                                {blog.published_at &&
                                new Date(blog.published_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6">
                            {blog.title}
                        </h1>

                        {/* Author and Stats */}
                        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-700 mb-6">
                            <div className="flex items-center text-slate-600 dark:text-slate-400">
                                <User className="w-5 h-5 mr-2" />
                                <span className="font-medium">{blog.author?.username || 'Anonymous'}</span>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center text-slate-600 dark:text-slate-400">
                                    <Eye className="w-5 h-5 mr-2" />
                                    <span>{blog.views_count ?? 0} views</span>
                                </div>
                                <ReactionBar
                                    itemId={blog.id}
                                    currentUser={currentUser}
                                    userReaction={userReaction}
                                    setUserReaction={setUserReaction}
                                    reactions={reactions}
                                    setReactions={setReactions}
                                    onReact={handleReact}
                                />
                                <button
                                    onClick={handleShare}
                                    className="flex items-center text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                    title="Share this post"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
                            <div className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                                {blog.content}
                            </div>
                        </div>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-200 dark:border-slate-700">
                                {blog.tags.map(tag => (
                                    <span
                                        key={tag.id}
                                        className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm px-3 py-1 rounded-full"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Posts Section (Optional) */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
                        You might also like
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Related posts coming soon...
                    </p>
                </div>

                {/* Comments Section */}
                <div className="mt-12 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        Comments ({comments?.length || 0})
                        </h2>
                    </div>

                    {/* Comment Form */}
                    <form onSubmit={handleCommentSubmit} className="mb-8 space-y-4">
                        <div>
                        <textarea
                            id="commentContent"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share your thoughts..."
                            rows="4"
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                        />
                        </div>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium"
                        >
                        <Send className="w-4 h-4" />
                            Post Comment
                        </button>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-6">
                        {comments?.length === 0 ? (
                            <div className="text-center py-8">
                                <MessageCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                                <p className="text-slate-500 dark:text-slate-400">
                                    No comments yet. Be the first to share your thoughts!
                                </p>
                            </div>
                            ) : (
                            comments?.map((comment) => (
                                <div key={comment.id} className="border-b border-slate-200 dark:border-slate-700 pb-6 last:border-b-0">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                            {comment.user.username?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                                                    {comment.user.username?.charAt(0).toUpperCase() + comment.user.username.slice(1) || 'Anonymous'}
                                                </h4>
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    {new Date(comment.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>  
            </div>
        </div>
    );
}