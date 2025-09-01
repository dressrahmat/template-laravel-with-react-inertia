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
                className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm transition duration-300 w-full px-3.5 py-2.5 ${className}`}
                ref={inputRef}
            />
            {Icon && (
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={onIconClick}
                >
                    <Icon className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}
