import React from "react";

const TextArea = ({
    id,
    value,
    onChange,
    error,
    placeholder,
    rows = 4,
    icon: Icon,
    className = "",
    ...props
}) => {
    return (
        <div className="relative">
            {Icon && (
                <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                    <Icon className="h-5 w-5 text-primary-400 dark:text-primary-300" />
                </div>
            )}
            <textarea
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className={`
                    w-full px-4 py-3 border rounded-xl shadow-card focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                    bg-neutral-50 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400
                    transition-colors duration-200
                    ${
                        error
                            ? "border-error-500 focus:ring-error-500 focus:border-error-500"
                            : "border-neutral-300 dark:border-neutral-600"
                    }
                    ${Icon ? "pl-10" : "pl-4"}
                    ${className}
                `}
                {...props}
            />
        </div>
    );
};

export default TextArea;
