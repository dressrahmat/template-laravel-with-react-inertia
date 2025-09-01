import React from "react";

const CrudLayout = ({
    title,
    description,
    children,
    createButton = null,
    filters = null,
}) => {
    return (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-2 text-sm text-gray-600">
                            {description}
                        </p>
                    )}
                </div>
                {createButton && (
                    <div className="mt-4 flex md:mt-0 md:ml-4">
                        {createButton}
                    </div>
                )}
            </div>

            {/* Filters Section */}
            {filters && (
                <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
                    {filters}
                </div>
            )}

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {children}
            </div>
        </div>
    );
};

export default CrudLayout;
