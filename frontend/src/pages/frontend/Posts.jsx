import { useEffect, useMemo, useState } from 'react';
import { Heart, Eye, Calendar, User, Search } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import BlogCard from '../../components/card/BlogCard';
import { reactionService } from '../../services/reactionService';
import { useAuth } from '../../hooks/useAuth';
import Pagination from '../../components/common/Pagination';
import { postService } from '../../services/postService';

export default function Blogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 6;

  // Fetch all blog posts
  const getAllPosts = async (page = 1) => {
    try {
      const data = await postService.getAllBlogPosts(page);
      console.log('📊 API Response:', data);
      console.log('📝 First blog:', data.results?.[0]);
      console.log('👁️ Views count:', data.results?.[0]?.views_count);
      
      setBlogs(data.results || []);
      setTotalPages(Math.ceil(data.count / PAGE_SIZE));
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  // Fetch all blog categories
  const getAllPostCategories = async () => {
    try {
      const data = await categoryService.getCategoriesNoPagination();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Handle reaction
  const handleReact = async (blogId, type) => {
    if (!currentUser) {
      alert('Please login to react');
      return null;
    }

    try {
      const updated = await reactionService.reactToBlog(blogId, type);
      
      // Update the specific blog in state
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => 
          blog.id === blogId 
            ? {
                ...blog,
                reaction_counts: updated.reaction_counts || updated.counts || blog.reaction_counts,
                user_reaction: updated.user_reaction !== undefined ? updated.user_reaction : null
              }
            : blog
        )
      );
      
      return updated;
    } catch (error) {
      console.error('Error reacting to blog:', error);
      throw error;
    }
  };

  const handlePageChange = (page) => {
    getAllPosts(page);
  };

  // Prepare sorted categories for dropdown
  const sortedCategories = useMemo(() => {
    const activeCategories = categories.filter(c => c.is_active);
    return [{ id: 0, name: 'All' }, ...activeCategories.sort((a, b) => a.name.localeCompare(b.name))];
  }, [categories]);

  // Filter blogs based on search term and category
  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.tags?.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase())) ?? false);

      const matchesCategory =
        selectedCategory === 'All' || blog.category?.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchTerm, selectedCategory]);


  useEffect(() => {
    getAllPosts(1);
    getAllPostCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4">Our Blog</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Explore our latest articles and tutorials
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 font-medium cursor-pointer"
            >
              {sortedCategories?.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.length > 0
            ? filteredBlogs.map(blog => (
                <BlogCard 
                  key={blog.id} 
                  blog={blog} 
                  currentUser={currentUser}
                  onReact={handleReact}
                />
              ))
            : Array.from({ length: 6 }).map((_, index) => <BlogCard key={index} isLoading />)
          }
        </div>

        {/* No Blogs Found */}
        {filteredBlogs.length === 0 && blogs.length > 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              No blogs found matching your criteria.
            </p>
          </div>
        )}
        
        {blogs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}