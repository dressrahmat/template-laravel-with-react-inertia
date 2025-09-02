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
            className={`block font-semibold text-sm mb-1.5 text-neutral-700 dark:text-neutral-300 ${
                required
                    ? "after:content-['*'] after:ml-1 after:text-warning-600 after:dark:text-warning-400"
                    : ""
            } ${className}`}
        >
            {value ? value : children}
        </label>
    );
}
