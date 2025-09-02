import React from "react";
import Checkbox from "@/Components/Checkbox";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FiMoreVertical, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

const DataTable = ({
    columns,
    data,
    selectedItems = [],
    onSelectItem,
    onSelectAll,
    selectAll = false,
    emptyState = null,
    rowActions = () => {},
    keyField = "id",
    onRowClick = null,
}) => {
    return (
        <div className="bg-neutral-50 dark:bg-neutral-800 shadow-card rounded-xl overflow-hidden mb-20">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                    <thead className="bg-neutral-50 dark:bg-neutral-700 sticky top-0 z-10">
                        <tr>
                            {/* Checkbox Column */}
                            <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider"
                            >
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
                                    className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider cursor-pointer"
                                    onClick={
                                        column.sortable
                                            ? () => column.onSort(column.key)
                                            : undefined
                                    }
                                >
                                    <div className="flex items-center">
                                        {column.label}
                                        {column.sortable && column.sortIcon}
                                    </div>
                                </th>
                            ))}

                            {/* Actions Column */}
                            <th
                                scope="col"
                                className="px-4 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider sticky right-0 bg-neutral-50 dark:bg-neutral-700"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-neutral-50 dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                        {data && data.length > 0 ? (
                            data.map((item) => (
                                <tr
                                    key={item[keyField]}
                                    className="hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-150 cursor-pointer"
                                    onClick={() =>
                                        onRowClick && onRowClick(item)
                                    }
                                >
                                    {/* Checkbox Cell */}
                                    <td
                                        className="px-4 py-4 whitespace-nowrap"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Checkbox
                                            checked={selectedItems.includes(
                                                item[keyField]
                                            )}
                                            onChange={() =>
                                                onSelectItem(item[keyField])
                                            }
                                        />
                                    </td>

                                    {/* Dynamic Data Cells */}
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className="px-4 py-4 whitespace-nowrap"
                                        >
                                            {column.render
                                                ? column.render(item)
                                                : item[column.key]}
                                        </td>
                                    ))}

                                    {/* Actions Cell - Sticky dengan dropdown */}
                                    <td
                                        className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium sticky right-0 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 z-5"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {rowActions(item)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length + 2}
                                    className="px-6 py-8 text-center text-neutral-600 dark:text-neutral-400"
                                >
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
