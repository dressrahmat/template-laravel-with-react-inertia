import React from 'react';
import { FiTrash2, FiDownload } from 'react-icons/fi';

const BulkActions = ({ 
  selectedCount, 
  onBulkDelete, 
  onBulkExport,
  additionalActions = [] 
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="text-sm text-blue-800 dark:text-blue-200">
        <span className="font-medium">{selectedCount}</span> item(s) selected
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onBulkDelete}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <FiTrash2 className="mr-1.5 h-4 w-4" />
          Delete Selected
        </button>
        <button
          onClick={onBulkExport}
          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FiDownload className="mr-1.5 h-4 w-4" />
          Export Selected
        </button>
        {additionalActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={action.className}
          >
            {action.icon && React.createElement(action.icon, { className: "mr-1.5 h-4 w-4" })}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BulkActions;