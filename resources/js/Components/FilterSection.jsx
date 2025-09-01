import React, { useState } from "react";
import { FiSearch, FiX, FiFilter, FiChevronDown } from "react-icons/fi";

const FilterSection = ({
    searchTerm,
    onSearchChange,
    onClearFilters,
    perPage,
    onPerPageChange,
}) => {
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    return (
        <div className="w-full">
            {/* Mobile Filter Toggle Button */}
            <div className="sm:hidden mb-4">
                <button
                    onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                    <div className="flex items-center">
                        <FiFilter className="mr-2 h-4 w-4" />
                        Filters
                    </div>
                    <FiChevronDown
                        className={`h-4 w-4 transform transition-transform ${
                            isMobileFiltersOpen ? "rotate-180" : ""
                        }`}
                    />
                </button>
            </div>

            {/* Main Filter Container */}
            <div
                className={`
        ${isMobileFiltersOpen ? "block" : "hidden"} 
        sm:grid sm:grid-cols-3 sm:gap-6 sm:items-center
      `}
            >
                {/* Search Input */}
                <div className="sm:col-span-2 mb-4 sm:mb-0">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search..."
                            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors duration-200"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => onSearchChange("")}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                <FiX className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Right side controls */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-end">
                    {/* Per Page Selector */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label
                            htmlFor="per_page"
                            className="text-sm font-medium text-gray-700 whitespace-nowrap"
                        >
                            Show:
                        </label>
                        <select
                            id="per_page"
                            value={perPage}
                            onChange={(e) =>
                                onPerPageChange(Number(e.target.value))
                            }
                            className="block w-full sm:w-20 pl-3 pr-8 py-2.5 text-base border border-gray-300 rounded-xl leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors duration-200"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    {/* Clear Filters Button */}
                    <button
                        onClick={() => {
                            onClearFilters();
                            setIsMobileFiltersOpen(false);
                        }}
                        className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto transition-colors duration-200"
                    >
                        <FiX className="mr-1.5 h-4 w-4" />
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterSection;
