import React from "react";
import { FiTrash2, FiDownload, FiX } from "react-icons/fi";

const BulkActions = ({
    selectedCount,
    onBulkDelete,
    onBulkExport,
    onClearSelected,
    additionalActions = [],
}) => {
    if (selectedCount === 0) return null;

    return (
        <div className="mb-6 bg-primary-50 dark:bg-neutral-900 border border-primary-200 dark:border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm text-primary-800 dark:text-neutral-200 font-medium">
                <span className="font-bold">{selectedCount}</span> item(s)
                selected
            </div>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={onClearSelected}
                    className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900 hover:bg-primary-200 dark:hover:bg-primary-800 focus:outline-none focus:ring-3 focus:ring-primary-400 dark:focus:ring-primary-300 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-all duration-200"
                >
                    <FiX className="mr-1.5 h-4 w-4" />
                    Clear Selected
                </button>
                <button
                    onClick={onBulkDelete}
                    className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-error-600 to-error-800 hover:from-error-700 hover:to-error-900 dark:from-error-500 dark:to-error-700 dark:hover:from-error-600 dark:hover:to-error-800 focus:outline-none focus:ring-3 focus:ring-error-400 dark:focus:ring-error-300 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-all duration-200"
                >
                    <FiTrash2 className="mr-1.5 h-4 w-4" />
                    Delete Selected
                </button>
                <button
                    onClick={onBulkExport}
                    className="inline-flex items-center justify-center px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 text-sm font-medium rounded-xl text-neutral-700 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-3 focus:ring-primary-400 dark:focus:ring-primary-300 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-all duration-200"
                >
                    <FiDownload className="mr-1.5 h-4 w-4" />
                    Export Selected
                </button>
                {additionalActions.map((action, index) => (
                    <button
                        key={index}
                        onClick={action.onClick}
                        className={`inline-flex items-center justify-center px-4 py-2.5 border text-sm font-medium rounded-xl transition-all duration-200 ${
                            action.className
                        } ${
                            action.darkClassName
                                ? `dark:${action.darkClassName}`
                                : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:ring-primary-400 dark:focus:ring-primary-300 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
                        }`}
                    >
                        {action.icon &&
                            React.createElement(action.icon, {
                                className: "mr-1.5 h-4 w-4",
                            })}
                        {action.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BulkActions;
