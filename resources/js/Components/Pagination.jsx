import React from "react";
import { Link } from "@inertiajs/react";

const Pagination = ({
    data,
    showingText = "Showing {from} to {to} of {total} results",
}) => {
    if (!data || !data.links || data.links.length <= 3) return null;

    const showingTextFormatted = showingText
        .replace("{from}", data.from || 0)
        .replace("{to}", data.to || 0)
        .replace("{total}", data.total || 0);

    return (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                    {showingTextFormatted}
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || "#"}
                            preserveState
                            preserveScroll
                            className={`relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                link.active
                                    ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 focus:ring-3 focus:ring-indigo-400 focus:ring-offset-2"
                                    : "bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 focus:ring-3 focus:ring-indigo-400 focus:ring-offset-2"
                            } ${
                                !link.url
                                    ? "opacity-50 cursor-not-allowed pointer-events-none"
                                    : "hover:shadow-md"
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Pagination;
