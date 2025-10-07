import { Mail, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200 py-12 shadow-inner">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        
        {/* About Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">My Blog</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Sharing stories, tutorials, and insights on tech, lifestyle, and more. Join our community and stay inspired.
          </p>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Mail className="w-5 h-5 text-blue-500" />
            <span>contact@myblog.com</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Links</h4>
          <ul className="space-y-2">
            <li className="hover:text-blue-500 transition-colors cursor-pointer"><Link to="/">Home</Link></li>
            <li className="hover:text-blue-500 transition-colors cursor-pointer"><Link to="/about">About</Link></li>
            <li className="hover:text-blue-500 transition-colors cursor-pointer"><Link to="/posts">Posts</Link></li>
            <li className="hover:text-blue-500 transition-colors cursor-pointer"><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Follow Us</h4>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-blue-500 transition-colors"><Twitter className="w-6 h-6" /></a>
            <a href="#" className="hover:text-blue-700 transition-colors"><Facebook className="w-6 h-6" /></a>
            <a href="#" className="hover:text-pink-500 transition-colors"><Instagram className="w-6 h-6" /></a>
            <a href="#" className="hover:text-blue-600 transition-colors"><Linkedin className="w-6 h-6" /></a>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} My Blog. All rights reserved.
      </div>
    </footer>
  );
}
