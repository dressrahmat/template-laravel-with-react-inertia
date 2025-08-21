import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export default forwardRef(function TextInput(
    { 
        type = 'text', 
        className = '', 
        isFocused = false, 
        error = false,
        disabled = false,
        icon: Icon = null,
        onIconClick = null,
        ...props 
    },
    ref,
) {
    const localRef = useRef(null);
    const [isFocusedState, setIsFocusedState] = useState(false);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
        blur: () => localRef.current?.blur(),
        value: localRef.current?.value,
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const baseClasses = `
        w-full px-4 py-3 border rounded-lg transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        dark:bg-gray-800 dark:text-white dark:border-gray-600
    `;

    const stateClasses = error
        ? `border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-400`
        : `border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-gray-600`;

    const focusClasses = isFocusedState ? 'ring-2 ring-offset-1' : '';

    return (
        <div className="relative">
            <input
                {...props}
                type={type}
                disabled={disabled}
                className={`
                    ${baseClasses}
                    ${stateClasses}
                    ${focusClasses}
                    ${Icon ? 'pr-10' : ''}
                    ${className}
                `}
                ref={localRef}
                onFocus={(e) => {
                    setIsFocusedState(true);
                    props.onFocus?.(e);
                }}
                onBlur={(e) => {
                    setIsFocusedState(false);
                    props.onBlur?.(e);
                }}
            />
            {Icon && (
                <div 
                    className={`
                        absolute inset-y-0 right-0 pr-3 flex items-center
                        ${onIconClick ? 'cursor-pointer' : 'pointer-events-none'}
                    `}
                    onClick={onIconClick}
                >
                    <Icon className={`h-5 w-5 ${error ? 'text-red-500' : 'text-gray-400'} ${onIconClick ? 'hover:text-gray-600 dark:hover:text-gray-300' : ''}`} />
                </div>
            )}
        </div>
    );
});