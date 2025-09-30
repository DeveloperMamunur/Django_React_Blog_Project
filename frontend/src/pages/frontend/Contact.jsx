export default function Contact() {
    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
                    <input type="text" className="mt-1 block w-full border-none outline-0 ring ring-gray-400 focus:ring-blue-500 focus:shadow-md rounded-md p-2 dark:focus:bg-gray-700" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                    <input type="email" className="mt-1 block w-full border-none outline-0 ring ring-gray-400 focus:ring-blue-500 focus:shadow-md rounded-md p-2 dark:focus:bg-gray-700" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Message</label>
                    <textarea className="mt-1 block w-full border-none outline-0 ring ring-gray-400 focus:ring-blue-500 focus:shadow-md rounded-md p-2 dark:focus:bg-gray-700" rows="4"></textarea>
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Send Message</button>
            </form>
        </div>
    )
}