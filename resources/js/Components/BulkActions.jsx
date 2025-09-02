import React from "react";
import { FiTrash2, FiDownload } from "react-icons/fi";

const BulkActions = ({
    selectedCount,
    onBulkDelete,
    onBulkExport,
    additionalActions = [],
}) => {
    if (selectedCount === 0) return null;

    return (
        <div className="mb-6 bg-primary-50 border border-primary-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm text-primary-800 font-medium">
                <span className="font-bold">{selectedCount}</span> item(s)
                selected
            </div>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={onBulkDelete}
                    className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-error-600 to-error-800 hover:from-error-700 hover:to-error-900 focus:outline-none focus:ring-3 focus:ring-error-400 focus:ring-offset-2 transition-all duration-200"
                >
                    <FiTrash2 className="mr-1.5 h-4 w-4" />
                    Delete Selected
                </button>
                <button
                    onClick={onBulkExport}
                    className="inline-flex items-center justify-center px-4 py-2.5 border border-neutral-300 text-sm font-medium rounded-xl text-neutral-700 bg-neutral-50 hover:bg-neutral-100 focus:outline-none focus:ring-3 focus:ring-primary-400 focus:ring-offset-2 transition-all duration-200"
                >
                    <FiDownload className="mr-1.5 h-4 w-4" />
                    Export Selected
                </button>
                {additionalActions.map((action, index) => (
                    <button
                        key={index}
                        onClick={action.onClick}
                        className={`inline-flex items-center justify-center px-4 py-2.5 border text-sm font-medium rounded-xl transition-all duration-200 ${action.className}`}
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
