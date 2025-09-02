import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

export default function TextInput({
    className = "",
    isFocused = false,
    icon: Icon,
    onIconClick,
    ...props
}) {
    const inputRef = useRef();

    useEffect(() => {
        if (isFocused) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <div className="relative">
            <input
                {...props}
                className={`border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-primary-500 dark:focus:ring-primary-500 rounded-lg shadow-sm transition duration-300 w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-500 ${className}`}
                ref={inputRef}
            />
            {Icon && (
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-400 dark:text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                    onClick={onIconClick}
                >
                    <Icon className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}
