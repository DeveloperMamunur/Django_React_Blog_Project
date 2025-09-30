export default function Modal({ isOpen, onClose, title, modalSize="lg", children }) {
    if (!isOpen) return null;
    const sizeClass = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl"
    }[modalSize] || "max-w-md";
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg w-full ${sizeClass} shadow-lg`}>
                
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-300"
                    >
                        ✖
                    </button>
                </div>

                {/* Body */}
                <div>{children}</div>
            </div>
        </div>
    );
}