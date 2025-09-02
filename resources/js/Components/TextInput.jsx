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
                className={`border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 focus:ring-orange-500 dark:focus:ring-orange-500 rounded-lg shadow-sm transition duration-300 w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 ${className}`}
                ref={inputRef}
            />
            {Icon && (
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 dark:text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
                    onClick={onIconClick}
                >
                    <Icon className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}
