export default function SecondaryButton({
    type = "button",
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold 
                text-gray-700 transition-all duration-250 ease-out 
                shadow-sm hover:shadow-md hover:bg-gray-50 
                focus:outline-none focus:ring-3 focus:ring-indigo-400 focus:ring-offset-2 
                active:scale-[0.98] active:shadow-inner
                disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
                w-full ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
