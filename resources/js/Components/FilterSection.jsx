import React, { useState } from 'react';
import { FiSearch, FiX, FiFilter, FiChevronDown } from 'react-icons/fi';

const FilterSection = ({ 
  searchTerm, 
  onSearchChange, 
  onClearFilters,
  perPage,
  onPerPageChange 
}) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Mobile Filter Toggle Button */}
      <div className="sm:hidden mb-3">
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600"
        >
          <div className="flex items-center">
            <FiFilter className="mr-2 h-4 w-4" />
            Filters
          </div>
          <FiChevronDown 
            className={`h-4 w-4 transform transition-transform ${
              isMobileFiltersOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>
      </div>

      {/* Main Filter Container - Grid layout for desktop */}
      <div className={`
        ${isMobileFiltersOpen ? 'block' : 'hidden'} 
        sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center
      `}>
        {/* Search Input - Middle column (largest) on desktop */}
        <div className="sm:col-span-2 mb-3 sm:mb-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search users..."
              className="block w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-slate-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FiX className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            )}
          </div>
        </div>

        {/* Right side columns for Per Page and Clear buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-end">
          {/* Per Page Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label htmlFor="per_page" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap sm:block hidden">
              Show:
            </label>
            <label htmlFor="per_page" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap sm:hidden block">
              Items:
            </label>
            <select
              id="per_page"
              value={perPage}
              onChange={(e) => onPerPageChange(Number(e.target.value))}
              className="block w-full sm:w-20 pl-3 pr-8 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={() => {
              onClearFilters();
              setIsMobileFiltersOpen(false);
            }}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
          >
            <FiX className="mr-1 h-4 w-4 sm:block hidden" />
            <span className="sm:block hidden">Clear</span>
            <span className="sm:hidden block">Reset</span>
          </button>
        </div>
      </div>

      {/* Close mobile filters when clicking outside */}
      {isMobileFiltersOpen && (
        <div 
          className="sm:hidden fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setIsMobileFiltersOpen(false)}
          style={{ top: 'calc(100% - 1px)' }}
        />
      )}
    </div>
  );
};

export default FilterSection;