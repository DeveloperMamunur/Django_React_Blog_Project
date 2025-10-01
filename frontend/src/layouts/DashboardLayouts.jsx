import { useState} from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layouts/Sidebar"
import { useAuth } from "../hooks/useAuth";
import { useDarkMode } from "../hooks/useDarkMode";

export default function DashboardLayouts() {
    const [isOpen, setIsOpen] = useState(true);
    const { darkMode, toggleDarkMode } = useDarkMode();
    
    const { currentUser, isAuthLoading } = useAuth();

    if (!currentUser && isAuthLoading) {
        return <div>Loading...</div>;
    }

    const BASE_URL = "http://localhost:8000"; 

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
            {/* Sidebar */}
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <header className="flex items-center justify-between bg-white dark:bg-gray-800 shadow px-6 py-4 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        {/* Hamburger button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-700 dark:text-gray-200"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                            Blog Dashboard
                        </h1>
                    </div>

                    {/* Dark Mode Toggle + Profile */}
                    <div className="flex items-center gap-4">
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
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-200">{currentUser?.username}</span>
                            {currentUser?.avatar ? (
                                <img
                                    src={`${BASE_URL}${currentUser.avatar}`}   // ✅ concatenate properly
                                    alt={currentUser.username}
                                    className="w-8 h-8 rounded-full"
                                />
                                ) : (
                                <img
                                    src="https://i.pravatar.cc/40"
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full"
                                />
                            )}
                            
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
