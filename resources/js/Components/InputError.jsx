export default function InputError({ 
    message, 
    className = '', 
    showIcon = true,
    ...props 
}) {
    return message ? (
        <div
            {...props}
            className={`
                flex items-center gap-2 mt-1 text-sm transition-all duration-200
                text-red-600 dark:text-red-400
                ${className}
            `}
            role="alert"
        >
            {showIcon && (
                <svg 
                    className="h-4 w-4 flex-shrink-0" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                >
                    <path 
                        fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 极 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                        clipRule="evenodd" 
                    />
                </svg>
            )}
            <span>{message}</span>
        </div>
    ) : null;
}