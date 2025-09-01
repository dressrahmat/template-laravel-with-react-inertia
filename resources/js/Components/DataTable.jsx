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
        <div className="bg-white shadow rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* Checkbox Column */}
                            <th
                                scope="col"
                                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                <div className="flex items-center">
                                    <Checkbox
                                        checked={selectAll}
                                        onChange={onSelectAll}
                                        className="mr-3"
                                    />
                                    Select
                                </div>
                            </th>

                            {/* Dynamic Columns */}
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    scope="col"
                                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
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
                                className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data && data.length > 0 ? (
                            data.map((item) => (
                                <tr
                                    key={item[keyField]}
                                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                    onClick={() =>
                                        onRowClick && onRowClick(item)
                                    }
                                >
                                    {/* Checkbox Cell */}
                                    <td
                                        className="px-6 py-4 whitespace-nowrap"
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
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                        >
                                            {column.render
                                                ? column.render(item)
                                                : item[column.key]}
                                        </td>
                                    ))}

                                    {/* Actions Cell */}
                                    <td
                                        className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium sticky right-0 bg-white hover:bg-gray-50 z-5"
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
                                    className="px-6 py-12 text-center"
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
