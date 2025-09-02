import { Link } from "@inertiajs/react";

export default function ResponsiveNavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-3 px-4 ${
                active
                    ? "border-primary-500 bg-primary-50 text-primary-700 focus:bg-primary-100 focus:text-primary-800"
                    : "border-transparent text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-800 focus:bg-neutral-50 focus:text-neutral-800"
            } text-base font-medium transition duration-200 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
