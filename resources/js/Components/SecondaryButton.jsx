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
                `inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-neutral-50 px-6 py-3.5 text-sm font-semibold 
                text-neutral-700 transition-all duration-250 ease-out 
                shadow-sm hover:shadow-md hover:bg-neutral-100 
                focus:outline-none focus:ring-3 focus:ring-primary-400 focus:ring-offset-2 
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
