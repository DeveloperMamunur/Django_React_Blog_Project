import { useEffect, useState } from 'react';
import { Heart, Eye, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactionBar from '../reactions/ReactionBar';

export default function BlogCard({ blog, isLoading, currentUser, onReact }) {
  const [userReaction, setUserReaction] = useState(blog?.user_reaction || null);
  const [reactions, setReactions] = useState(blog?.reaction_counts || {});

  const handleReact = async (type) => {
    if (!blog?.id || !onReact) return;

    try {
      const updated = await onReact(blog.id, type);
      if (updated) {
        // Update local UI with server response
        setUserReaction(updated.user_reaction);
        setReactions(updated.reaction_counts || updated.counts || {});
      }
      return updated;
    } catch (error) {
      console.error('Error reacting to blog:', error);
      throw error;
    }
  };

  // Sync with parent updates
  useEffect(() => {
    setUserReaction(blog?.user_reaction || null);
    setReactions(blog?.reaction_counts || {});
  }, [blog?.user_reaction, blog?.reaction_counts]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
        <div className="h-48 bg-slate-200 dark:bg-slate-700"></div>
        <div className="p-6 space-y-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <Link to={`/posts/${blog.slug}`}>
        <img
          src={blog.image || '/fallback-image.jpg'}
          alt={blog.title}
          className="w-full h-48 object-cover"
        />
      </Link>

      <div className="p-6">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold px-3 py-1 rounded-full">
            {blog.category?.name || 'Uncategorized'}
          </span>
          <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            {blog.published_at &&
              new Date(blog.published_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
          </div>
        </div>

        {/* Title */}
        <Link to={`/posts/${blog.slug}`}>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
            {blog.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
          {blog.content?.substring(0, 150)}...
        </p>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map(tag => (
              <span
                key={tag.id}
                className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Footer with Stats and Reactions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm">
            <User className="w-4 h-4 mr-1" />
            <span className="font-medium">{blog.author?.username || 'Anonymous'}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm">
              <Eye className="w-4 h-4 mr-1" />
              <span>{blog.views_count ?? 0}</span>
            </div>
            
            {/* Reaction Bar */}
            <ReactionBar
              itemId={blog.id}
              currentUser={currentUser}
              userReaction={userReaction}
              setUserReaction={setUserReaction}
              reactions={reactions}
              setReactions={setReactions}
              onReact={handleReact}
            />
          </div>
        </div>
      </div>
    </div>
  );
}