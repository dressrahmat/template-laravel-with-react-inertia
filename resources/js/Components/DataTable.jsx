import React from 'react';
import Checkbox from '@/Components/Checkbox';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FiMoreVertical, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';

const DataTable = ({
  columns,
  data,
  selectedItems = [],
  onSelectItem,
  onSelectAll,
  selectAll = false,
  emptyState = null,
  rowActions = () => {},
  keyField = 'id'
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden mb-20">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-slate-700 sticky top-0 z-10">
            <tr>
              {/* Checkbox Column */}
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <div className="flex items-center">
                  <Checkbox
                    checked={selectAll}
                    onChange={onSelectAll}
                    className="mr-2"
                  />
                  Select
                </div>
              </th>
              
              {/* Dynamic Columns */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={column.sortable ? () => column.onSort(column.key) : undefined}
                >
                  <div className="flex items-center">
                    {column.label}
                    {column.sortable && column.sortIcon}
                  </div>
                </th>
              ))}
              
              {/* Actions Column */}
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sticky right-0 bg-gray-50 dark:bg-slate-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data && data.length > 0 ? (
              data.map((item) => (
                <tr key={item[keyField]} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-150">
                  {/* Checkbox Cell */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Checkbox
                      checked={selectedItems.includes(item[keyField])}
                      onChange={() => onSelectItem(item[keyField])}
                    />
                  </td>
                  
                  {/* Dynamic Data Cells */}
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4 whitespace-nowrap">
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                  
                  {/* Actions Cell - Sticky dengan dropdown */}
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium sticky right-0 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 z-5">
                    {rowActions(item)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 2} className="px-6 py-8 text-center">
                  {emptyState}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;