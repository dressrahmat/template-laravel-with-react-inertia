export default function InputLabel({
    value,
    className = "",
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={`block font-semibold text-gray-700 text-sm mb-1.5 ${className}`}
        >
            {value ? value : children}
        </label>
    );
}
