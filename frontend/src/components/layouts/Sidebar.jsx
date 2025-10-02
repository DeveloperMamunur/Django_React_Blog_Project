import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Home, Box, Tag, FileText, Users, Settings } from "lucide-react";

export default function Sidebar({ isOpen, onToggle }) {
    const location = useLocation();
    const { currentUser, logout } = useAuth();

    // ✅ fallback role if no user
    const role = currentUser?.role || "GUEST";

    const menuItems = [
        { path: "/dashboard", label: "Home", icon: <Home size={18} />, roles: ["ADMIN", "AUTHOR", "USER", "GUEST"] },
        { path: "/category", label: "Category", icon: <Box size={18} />, roles: ["ADMIN"] },
        { path: "/tags", label: "Tags", icon: <Tag size={18} />, roles: ["ADMIN"] },
        { path: "/blogs", label: "Blogs", icon: <FileText size={18} />, roles: ["ADMIN", "AUTHOR"] },
        { path: "/users", label: "Users", icon: <Users size={18} />, roles: ["ADMIN"] },
        { path: "/settings", label: "Settings", icon: <Settings size={18} />, roles: ["ADMIN", "AUTHOR", "USER"] },
    ];

    const handleLogout = () => {
        logout();
    };

    return (
        <aside
            className={`${isOpen ? "w-64" : "w-20"} dark:bg-gray-900 dark:text-white transition-all duration-300 flex flex-col`}
        >
            {/* Logo */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    <h2 className={`text-xl font-bold transition-all duration-300 ${!isOpen && "opacity-0 hidden"}`}>
                        Dashboard
                    </h2>
                </div>
                <button
                    onClick={onToggle}
                    aria-label="Toggle sidebar"
                    className="md:hidden p-2 rounded hover:bg-gray-700"
                >
                    ✖
                </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems
                    .filter(item => item.roles.includes(role)) // ✅ role-based filter
                    .map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 p-2 rounded-md transition hover:bg-gray-300 dark:hover:bg-gray-700 ${
                                location.pathname === item.path ? "bg-gray-300 dark:bg-gray-700" : ""
                            }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span className={`transition-all duration-300 ${!isOpen && "opacity-0 hidden"}`}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700">
                <Link
                    to="/profile"
                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
                >
                    <span>👤</span>
                    <span className={`${!isOpen && "opacity-0 hidden"}`}>Profile</span>
                </Link>
                <Link
                    to="/help"
                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
                >
                    <span>❓</span>
                    <span className={`${!isOpen && "opacity-0 hidden"}`}>Help</span>
                </Link>
                <button
                    onClick={handleLogout}
                    aria-label="Logout"
                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
                >
                    <span>➡️</span>
                    <span className={`${!isOpen && "opacity-0 hidden"}`}>Logout</span>
                </button>
            </div>
        </aside>
    );
}
