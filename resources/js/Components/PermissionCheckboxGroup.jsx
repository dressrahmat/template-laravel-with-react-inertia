// resources/js/Components/PermissionCheckboxGroup.jsx
import React from "react";
import { FiCheckSquare, FiSquare, FiInfo } from "react-icons/fi";

const PermissionCheckboxGroup = ({
    permissions = [],
    selectedPermissions = [],
    onChange,
}) => {
    const safePermissions = Array.isArray(permissions) ? permissions : [];

    const groupedPermissions = safePermissions.reduce((groups, permission) => {
        if (!permission || !permission.name) {
            return groups;
        }

        const parts = permission.name.split(".");
        const groupName = parts.length > 1 ? parts[0] : "general";

        if (!groups[groupName]) {
            groups[groupName] = [];
        }

        groups[groupName].push(permission);
        return groups;
    }, {});

    const handlePermissionChange = (permissionName, isChecked) => {
        onChange(permissionName, isChecked);
    };

    const isPermissionSelected = (permissionName) => {
        return (
            Array.isArray(selectedPermissions) &&
            selectedPermissions.includes(permissionName)
        );
    };

    if (safePermissions.length === 0) {
        return (
            <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">
                No permissions available
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {Object.entries(groupedPermissions).map(
                ([groupName, groupPermissions]) => (
                    <div
                        key={groupName}
                        className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 bg-white dark:bg-neutral-800 shadow-soft"
                    >
                        <h4 className="font-medium text-neutral-900 dark:text-white mb-3 capitalize text-lg">
                            {groupName === "general"
                                ? "General Permissions"
                                : `${groupName} Permissions`}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {groupPermissions.map((permission) => (
                                <label
                                    key={permission.id}
                                    className="flex items-center p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer transition-colors duration-200"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isPermissionSelected(
                                            permission.name
                                        )}
                                        onChange={(e) =>
                                            handlePermissionChange(
                                                permission.name,
                                                e.target.checked
                                            )
                                        }
                                        className="hidden"
                                    />
                                    {isPermissionSelected(permission.name) ? (
                                        <FiCheckSquare className="h-5 w-5 text-primary-500 mr-2" />
                                    ) : (
                                        <FiSquare className="h-5 w-5 text-neutral-400 mr-2" />
                                    )}
                                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                        {permission.name.split(".")[1] ||
                                            permission.name}
                                    </span>
                                    {permission.description && (
                                        <div className="group relative ml-1">
                                            <FiInfo className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 rounded-lg shadow-card opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-48 z-10 border border-neutral-200 dark:border-neutral-700">
                                                {permission.description}
                                            </div>
                                        </div>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default PermissionCheckboxGroup;
