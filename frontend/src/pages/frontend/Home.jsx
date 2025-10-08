import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, BookOpen, Users, Sparkles } from 'lucide-react';
import { postService } from '../../services/postService';


export default function Home() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [stats, setStats] = useState({
        blog_count: 0,
        user_count: 0,
        new_content_count: 0,
    });


    const handleSubscribe = () => {
        if (email) {
            setSubscribed(true);
            setTimeout(() => {
                setSubscribed(false);
                setEmail('');
            }, 3000);
        }
    };

    const getStats = async () => {
        const data = await postService.getStats();
        setStats(data);
    }


    const getFeatureBlog = async ()=>{
        const data = await postService.getFeaturedPosts();
        setFeaturedPosts(data);
    }

    

    useEffect(()=>{
        getFeatureBlog();
        getStats();
    },[]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span>Welcome to Our Community</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
                        Discover Stories That
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                        {" "}Inspire
                        </span>
                    </h1>

                    <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                        Dive into a world of insightful articles, tutorials, and updates on technology, development, and innovation. Join thousands of readers who stay ahead of the curve.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/register" className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2">
                            Get Started
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/posts" className="border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-8 py-4 rounded-lg font-semibold text-lg hover:border-slate-400 dark:hover:border-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-all duration-200">
                            Browse Articles
                        </Link>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                        <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">{stats.blog_count}+</div>
                        <div className="text-slate-600 dark:text-slate-300">Articles Published</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                        <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">{stats.user_count}+</div>
                        <div className="text-slate-600 dark:text-slate-300">Active Readers</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                        <Sparkles className="w-8 h-8 text-pink-600 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">Weekly</div>
                        <div className="text-slate-600 dark:text-slate-300">{stats.new_content_count}+ New Content</div>
                    </div>
                </div>

                {/* Featured Posts */}
                <div className="max-w-6xl mx-auto mb-20">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">Featured Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredPosts.length > 0 ? (
                            featuredPosts.slice(0, 3).map((post) => (
                                <div onClick={() => navigate(`/posts/${post.slug}`)} key={post.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer group">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 px-3 py-1 rounded-full">
                                        {post.category}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                                        {post.content}
                                    </p>
                                    <Link to={`/posts/${post.slug}`} className="text-blue-600 dark:text-blue-400 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Read More
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            ))
                        ) : (
                        <p className="text-center text-slate-500 dark:text-slate-400 col-span-3">No featured posts available.</p>
                        )}
                    </div>
                </div>

                {/* Newsletter Subscription */}
                <div className="max-w-5xl mx-auto my-24 px-4 relative">

                    <div className="absolute -top-16 -left-16 w-48 h-48 bg-blue-400/30 rounded-full blur-3xl animate-blob"></div>
                    <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl animate-blob animation-delay-4000"></div>

                    <div className="relative bg-white/95 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-3xl p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
                        
                        {/* Text Section */}
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                                Subscribe to Our Newsletter
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg">
                                Get weekly updates on articles, tips, and tutorials delivered straight to your inbox. No spam, ever.
                            </p>
                        </div>

                        {/* Input Section */}
                        <div className="flex w-full md:w-auto items-center gap-3 mt-6 md:mt-0">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 px-6 py-4 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-inner"
                            />
                            <button
                                onClick={handleSubscribe}
                                className="px-6 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 
                                        transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Subscribe
                            </button>
                        </div>

                        {/* Success Message */}
                        {subscribed && (
                            <div className="absolute bottom-[-3rem] left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in">
                                ✓ Thank you for subscribing!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
