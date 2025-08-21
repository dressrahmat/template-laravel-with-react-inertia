export default function InputLabel({
    value,
    className = '',
    children,
    required = false,
    htmlFor,
    ...props
}) {
    return (
        <label
            {...props}
            htmlFor={htmlFor}
            className={`
                block text-sm font-medium mb-2 transition-colors duration-200
                text-gray-700 dark:text-gray-300
                ${className}
            `}
        >
            {value ? value : children}
            {required && (
                <span className="text-red-500 ml-1">*</span>
            )}
        </label>
    );
}