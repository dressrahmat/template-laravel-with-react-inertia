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
                    ? "border-indigo-500 text-indigo-700 focus:text-indigo-800 focus:border-indigo-600"
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 focus:text-gray-800 focus:border-gray-300") +
                className
            }
        >
            {children}
        </Link>
    );
}
