export default function InputError({ message, className = "", ...props }) {
    return message ? (
        <p
            {...props}
            className={`text-sm text-error-600 dark:text-error-400 mt-1.5 ${className}`}
        >
            {message}
        </p>
    ) : null;
}
