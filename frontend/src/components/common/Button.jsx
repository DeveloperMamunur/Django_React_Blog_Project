// components/common/Button.jsx
export default function Button({
    children,
    type = "button",
    onClick,
    variant = "primary",
    disabled = false,
    loading = false,
    className = "",
}) {
    const baseClasses =
        "px-4 py-2 rounded font-medium transition-colors focus:outline-none";

    const variants = {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        success: "bg-green-500 text-white hover:bg-green-600",
        info: "bg-cyan-500 text-white hover:bg-cyan-600",
        secondary: "bg-gray-300 text-gray-900 hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
        danger: "bg-red-500 text-white hover:bg-red-600",
    };

    return (
        <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={`${baseClasses} ${variants[variant]} ${
            disabled || loading ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
        >
        {loading ? "Loading..." : children}
        </button>
    );
}
