import { Link } from "@inertiajs/react";

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                "inline-flex items-center border-b-2 px-3 py-2 text-sm font-medium transition duration-200 ease-in-out focus:outline-none " +
                (active
                    ? "border-primary-500 text-primary-700 focus:text-primary-800 focus:border-primary-600"
                    : "border-transparent text-neutral-600 hover:text-neutral-800 hover:border-neutral-300 focus:text-neutral-800 focus:border-neutral-300") +
                className
            }
        >
            {children}
        </Link>
    );
}
