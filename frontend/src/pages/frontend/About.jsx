export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 md:p-16 border border-white/30 dark:border-gray-700/50 backdrop-blur-sm">
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white text-center mb-6">
            About Us
          </h2>
          
          <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl leading-relaxed mb-6">
            Welcome to our blog! We are passionate about sharing knowledge and insights on various topics including technology, lifestyle, and more. Our team of writers is dedicated to providing high-quality content to our readers.
          </p>
          
          <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl leading-relaxed">
            Our mission is to inform, inspire, and engage our audience through well-researched articles and thought-provoking discussions. Thank you for visiting our blog, and we hope you find our content valuable!
          </p>

          {/* Optional: Add a modern underline gradient */}
          <div className="mt-8 h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>

        </div>
      </div>
    </div>
  )
}
