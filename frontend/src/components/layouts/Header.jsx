import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useDarkMode } from "../../hooks/useDarkMode";


export default function Header() {
    const { user } = useAuth();
    const { darkMode, toggleDarkMode } = useDarkMode();

    return (
        <header className="bg-blue-600 dark:bg-blue-950 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Blog</h1>
                <nav className="flex items-center">
                    <ul className="flex items-center space-x-4">
                        <Link to="/" className="">Home</Link>
                        <Link to="/about" className="">About</Link>
                        <Link to="/contact" className="">Contact</Link>
                        
                        {user ? (
                            <>
                                <Link to="/dashboard" className="">Dashboard</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="">Login</Link>
                            </>
                        )}

                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            title="Toggle Dark Mode"
                        >
                            {darkMode ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M6.05 6.05L4.636 4.636m12.728 0L18.95 6.05M6.05 17.95l-1.414 1.414M12 7a5 5 0 100 10 5 5 0 000-10z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 116.707 2.707a8.001 8.001 0 0010.586 10.586z" />
                                </svg>
                            )}
                        </button>
                    </ul>
                </nav>
            </div>
        </header>
    )
}
