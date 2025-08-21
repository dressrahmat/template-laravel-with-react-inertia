// Components/Pagination.jsx
import React from 'react';
import { Link } from '@inertiajs/react';

const Pagination = ({ 
  data, 
  showingText = "Showing {from} to {to} of {total} results" 
}) => {
  // Pastikan data dan links ada
  if (!data || !data.links || data.links.length <= 3) return null;

  const showingTextFormatted = showingText
    .replace('{from}', data.from || 0)
    .replace('{to}', data.to || 0)
    .replace('{total}', data.total || 0);

  return (
    <div className="px-4 py-3 bg-gray-50 dark:bg-slate-700 border-t border-gray-200 dark:border-gray-600 sm:px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-4 sm:mb-0">
          {showingTextFormatted}
        </div>
        <div className="flex flex-wrap gap-1">
          {data.links.map((link, index) => (
            <Link
              key={index}
              href={link.url || '#'}
              preserveState
              preserveScroll
              className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
                link.active
                  ? 'z-10 bg-indigo-600 text-white focus:z-20 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                  : 'bg-white dark:bg-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-500 border border-gray-300 dark:border-gray-500'
              } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pagination;