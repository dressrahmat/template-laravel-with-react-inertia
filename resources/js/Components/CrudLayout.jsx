import React from 'react';

const CrudLayout = ({ 
  title, 
  description, 
  children, 
  createButton = null,
  filters = null 
}) => {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
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
      {filters}

      {/* Content */}
      {children}
    </div>
  );
};

export default CrudLayout;