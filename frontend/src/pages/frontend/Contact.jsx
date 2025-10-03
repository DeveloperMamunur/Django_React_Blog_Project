import { Mail } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-16 px-4">
      
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Illustration or Info */}
        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            Get in Touch
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl">
            Have questions, suggestions, or just want to say hi? Fill out the form and we’ll get back to you as soon as possible.
          </p>
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>contact@yourblog.com</span>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 md:p-14 border border-white/20 dark:border-gray-700/40 backdrop-blur-sm">
          <form className="space-y-6">

            {/* Name */}
            <div className="relative">
              <input
                type="text"
                id="name"
                placeholder=" "
                className="peer block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent px-4 pt-6 pb-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="name"
                className="absolute left-4 top-2 text-gray-500 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
              >
                Name
              </label>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder=" "
                className="peer block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent px-4 pt-6 pb-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="email"
                className="absolute left-4 top-2 text-gray-500 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
              >
                Email
              </label>
            </div>

            {/* Message */}
            <div className="relative">
              <textarea
                id="message"
                placeholder=" "
                rows="5"
                className="peer block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent px-4 pt-6 pb-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
              <label
                htmlFor="message"
                className="absolute left-4 top-2 text-gray-500 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
              >
                Message
              </label>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-10 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Send Message
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
