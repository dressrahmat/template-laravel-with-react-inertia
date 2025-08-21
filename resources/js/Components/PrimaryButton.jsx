export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-xl border border-transparent 
                bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-3.5 text-sm font-semibold 
                text-white transition-all duration-250 ease-out 
                shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-900 
                focus:outline-none focus:ring-3 focus:ring-blue-400 focus:ring-offset-2 
                active:scale-[0.98] active:shadow-inner
                disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
                w-full md:w-auto ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}