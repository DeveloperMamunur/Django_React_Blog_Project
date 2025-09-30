// components/common/FormField.jsx
export default function FormField({
    label,
    type = "text",
    name,
    value,
    onChange,
    options = [],
    multiple = false,
    disabled = false,
    rows,
    accept,
    required = false,
    error = "",
    className = "",
}) {
    return (
        <div className="w-full">
        {label && (
            <label className="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-300">
            {label}
            </label>
        )}

        {/* Input */}
        {type !== "select" && type !== "textarea" && (
            <input
            type={type}
            name={name}
            value={type === "file" ? undefined : value}
            onChange={onChange}
            disabled={disabled}
            accept={accept}
            required={required}
            className={`w-full border rounded p-2 ${
                disabled ? "bg-gray-100 dark:bg-gray-700" : ""
            } ${error ? "border-red-500" : "border-gray-300"} ${className}`}
            />
        )}

        {/* Select */}
        {type === "select" && (
            <select
            name={name}
            value={value}
            onChange={onChange}
            multiple={multiple}
            required={required}
            className={`w-full border dark:bg-gray-700 rounded p-2 ${
                error ? "border-red-500" : "border-gray-300"
            } ${className}`}
            >
            {!multiple && <option value="">Select an option</option>}
            {options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                {opt.name}
                </option>
            ))}
            </select>
        )}

        {/* Textarea */}
        {type === "textarea" && (
            <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={rows || 4}
            required={required}
            className={`w-full border rounded p-2 ${
                error ? "border-red-500" : "border-gray-300"
            } ${className}`}
            />
        )}

        {/* Error message */}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}
