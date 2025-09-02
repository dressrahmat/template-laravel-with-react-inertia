export default function InputLabel({
    value,
    className = "",
    children,
    required = false,
    ...props
}) {
    return (
        <label
            {...props}
            className={`block font-semibold text-sm mb-1.5 text-gray-700 dark:text-gray-300 ${
                required
                    ? "after:content-['*'] after:ml-1 after:text-orange-600 after:dark:text-orange-400"
                    : ""
            } ${className}`}
        >
            {value ? value : children}
        </label>
    );
}
