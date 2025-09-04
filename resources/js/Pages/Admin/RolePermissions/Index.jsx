import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
} from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import CrudLayout from "@/Components/CrudLayout";
import DataTable from "@/Components/DataTable";
import FilterSection from "@/Components/FilterSection";
import BulkActions from "@/Components/BulkActions";
import Pagination from "@/Components/Pagination";
import ConfirmationModal from "@/Components/ConfirmationModal";
import PrimaryButton from "@/Components/PrimaryButton";
import { useToast } from "@/Contexts/ToastContext";
import {
    FiEye,
    FiEdit,
    FiTrash2,
    FiSearch,
    FiPlus,
    FiX,
    FiUserPlus,
    FiChevronUp,
    FiChevronDown,
    FiDownload,
    FiMoreVertical,
    FiShield,
    FiKey,
} from "react-icons/fi";
import { createPortal } from "react-dom";

const PortalDropdown = ({ trigger, children, position = "bottom-right" }) => {
    const [positionData, setPositionData] = useState({
        top: 0,
        left: 0,
        width: 0,
    });
    const triggerRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const updatePosition = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPositionData({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    };

    const getPositionClass = () => {
        switch (position) {
            case "bottom-left":
                return "origin-top-left left-0";
            case "bottom-right":
                return "origin-top-right right-0";
            default:
                return "origin-top-right right-0";
        }
    };

    return (
        <>
            <div
                ref={triggerRef}
                onClick={() => {
                    updatePosition();
                    setIsOpen(true);
                }}
            >
                {trigger}
            </div>
            {isOpen &&
                createPortal(
                    <div
                        className="fixed inset-0 z-50"
                        onClick={() => setIsOpen(false)}
                    >
                        <div
                            className={`absolute mt-1 w-48 rounded-xl shadow-card bg-neutral-50 dark:bg-neutral-800 ring-1 ring-primary-500 ring-opacity-20 focus:outline-none ${getPositionClass()}`}
                            style={{
                                top: positionData.top,
                                left:
                                    position === "bottom-right"
                                        ? "auto"
                                        : positionData.left,
                                right:
                                    position === "bottom-right"
                                        ? window.innerWidth -
                                          positionData.left -
                                          positionData.width
                                        : "auto",
                                zIndex: 9999,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {children}
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};

const RowActionsDropdown = ({
    item,
    type,
    onEdit,
    onDelete,
    hasEditPermission,
    hasDeletePermission,
}) => {
    const trigger = (
        <button className="inline-flex justify-center w-full p-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-neutral-50 dark:bg-neutral-800 rounded-md hover:bg-primary-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <FiMoreVertical className="h-4 w-4" aria-hidden="true" />
        </button>
    );

    return (
        <PortalDropdown trigger={trigger} position="bottom-right">
            <div className="py-1">
                {hasEditPermission && (
                    <button
                        onClick={onEdit}
                        className="group flex items-center w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-neutral-700 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                        <FiEdit className="mr-3 h-4 w-4" aria-hidden="true" />
                        Edit
                    </button>
                )}
                {hasDeletePermission && (
                    <button
                        onClick={onDelete}
                        className="group flex items-center w-full px-4 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 hover:text-error-700 dark:hover:text-error-300"
                    >
                        <FiTrash2 className="mr-3 h-4 w-4" aria-hidden="true" />
                        Delete
                    </button>
                )}
            </div>
        </PortalDropdown>
    );
};

const usePersistedSelectedItems = (
    initialValue = [],
    storageKey = "selectedItems"
) => {
    const [selectedItems, setSelectedItems] = useState(() => {
        try {
            const stored = sessionStorage.getItem(storageKey);
            return stored ? JSON.parse(stored) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        sessionStorage.setItem(storageKey, JSON.stringify(selectedItems));
    }, [selectedItems, storageKey]);

    const clearSelectedItems = useCallback(() => {
        sessionStorage.removeItem(storageKey);
        setSelectedItems([]);
    }, [storageKey]);

    return [selectedItems, setSelectedItems, clearSelectedItems];
};

export default function RolePermissionsIndex({
    data,
    filters: initialFilters,
    type,
}) {
    const { props } = usePage();
    const { auth } = props;
    const flash = props.flash || {};

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        id: null,
        name: "",
        type: "",
    });
    const [bulkDeleteModal, setBulkDeleteModal] = useState({
        isOpen: false,
        count: 0,
        type: "",
    });

    const storageKey = `selectedItems_${type}`;
    const [selectedItems, setSelectedItems, clearSelectedItems] =
        usePersistedSelectedItems([], storageKey);
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState(initialFilters?.search || "");
    const [perPage, setPerPage] = useState(initialFilters?.per_page || 10);
    const [sortConfig, setSortConfig] = useState({
        key: initialFilters?.sort || "name",
        direction: initialFilters?.direction || "asc",
    });
    const { success, error } = useToast();

    // Helper function to check permissions
    const hasPermission = (permission) => {
        return (
            auth.user &&
            auth.user.permissions &&
            auth.user.permissions.includes(permission)
        );
    };

    const prevFiltersRef = useRef({
        search: initialFilters?.search || "",
        per_page: initialFilters?.per_page || 10,
        sort: initialFilters?.sort || "name",
        direction: initialFilters?.direction || "asc",
    });

    useEffect(() => {
        const currentFilters = {
            search: searchTerm,
            per_page: perPage,
            sort: sortConfig.key,
            direction: sortConfig.direction,
        };

        const hasChanged =
            currentFilters.search !== prevFiltersRef.current.search ||
            currentFilters.per_page !== prevFiltersRef.current.per_page ||
            currentFilters.sort !== prevFiltersRef.current.sort ||
            currentFilters.direction !== prevFiltersRef.current.direction;

        if (hasChanged) {
            const timer = setTimeout(() => {
                router.get(
                    route("admin.role-permissions.index"),
                    {
                        search: searchTerm,
                        sort: sortConfig.key,
                        direction: sortConfig.direction,
                        per_page: perPage,
                        type: type,
                    },
                    {
                        preserveState: true,
                        replace: true,
                        preserveScroll: true,
                        onFinish: () => {
                            prevFiltersRef.current = currentFilters;
                        },
                    }
                );
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [searchTerm, perPage, sortConfig, type]);

    useEffect(() => {
        clearSelectedItems();
        setSelectAll(false);
    }, [type, clearSelectedItems]);

    const handleSelectAll = useCallback(() => {
        if (data && data.data) {
            const currentPageIds = data.data.map((item) => item.id);
            if (!selectAll) {
                setSelectedItems((prev) => [
                    ...new Set([...prev, ...currentPageIds]),
                ]);
            } else {
                setSelectedItems((prev) =>
                    prev.filter((id) => !currentPageIds.includes(id))
                );
            }
        }
    }, [selectAll, data, setSelectedItems]);

    const handleItemSelection = useCallback(
        (itemId) => {
            setSelectedItems((prev) => {
                if (prev.includes(itemId)) {
                    return prev.filter((id) => id !== itemId);
                } else {
                    return [...prev, itemId];
                }
            });
        },
        [setSelectedItems]
    );

    const openDeleteModal = useCallback((id, name, itemType) => {
        setDeleteModal({ isOpen: true, id, name, type: itemType });
    }, []);

    const openBulkDeleteModal = useCallback(() => {
        setBulkDeleteModal({ isOpen: true, count: selectedItems.length, type });
    }, [selectedItems.length, type]);

    const closeDeleteModal = useCallback(() => {
        setDeleteModal({ isOpen: false, id: null, name: "", type: "" });
    }, []);

    const closeBulkDeleteModal = useCallback(() => {
        setBulkDeleteModal({ isOpen: false, count: 0, type: "" });
    }, []);

    const handleDelete = useCallback(() => {
        if (deleteModal.id) {
            const routeName =
                deleteModal.type === "roles"
                    ? "admin.roles.destroy"
                    : "admin.permissions.destroy";
            router.delete(route(routeName, deleteModal.id), {
                onSuccess: () => {
                    success(
                        `${
                            deleteModal.type === "roles" ? "Role" : "Permission"
                        } deleted successfully!`
                    );
                    closeDeleteModal();
                    setSelectedItems((prev) =>
                        prev.filter((id) => id !== deleteModal.id)
                    );
                },
                onError: () => {
                    error(
                        `Failed to delete ${
                            deleteModal.type === "roles" ? "role" : "permission"
                        }.`
                    );
                    closeDeleteModal();
                },
            });
        } else {
            closeDeleteModal();
        }
    }, [
        deleteModal.id,
        deleteModal.type,
        closeDeleteModal,
        success,
        error,
        setSelectedItems,
    ]);

    const handleBulkDelete = useCallback(() => {
        if (selectedItems.length > 0) {
            const routeName =
                type === "roles"
                    ? "admin.roles.bulk-destroy"
                    : "admin.permissions.bulk-destroy";
            router.post(
                route(routeName),
                { ids: selectedItems },
                {
                    onSuccess: () => {
                        success(
                            `${selectedItems.length} ${
                                type === "roles" ? "role(s)" : "permission(s)"
                            } deleted successfully!`
                        );
                        clearSelectedItems();
                        setSelectAll(false);
                        closeBulkDeleteModal();
                    },
                    onError: () => {
                        error(
                            `Failed to delete selected ${
                                type === "roles" ? "roles" : "permissions"
                            }.`
                        );
                        closeBulkDeleteModal();
                    },
                }
            );
        }
    }, [
        selectedItems,
        type,
        closeBulkDeleteModal,
        success,
        error,
        clearSelectedItems,
    ]);

    const handleSort = useCallback((key) => {
        setSortConfig((prev) => {
            let direction = "asc";
            if (prev.key === key && prev.direction === "asc") {
                direction = "desc";
            }
            return { key, direction };
        });
    }, []);

    const clearFilters = useCallback(() => {
        setSearchTerm("");
        setPerPage(10);
        setSortConfig({ key: "name", direction: "asc" });
        router.get(
            route("admin.role-permissions.index"),
            { type, search: "", per_page: 10, sort: "name", direction: "asc" },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    prevFiltersRef.current = {
                        search: "",
                        per_page: 10,
                        sort: "name",
                        direction: "asc",
                    };
                },
            }
        );
    }, [type]);

    const handlePerPageChange = useCallback((newPerPage) => {
        setPerPage(newPerPage);
    }, []);

    const getSortIcon = useCallback(
        (key) => {
            if (sortConfig.key !== key) {
                return <FiChevronUp className="ml-1 h-4 w-4 opacity-50" />;
            }
            return sortConfig.direction === "asc" ? (
                <FiChevronUp className="ml-1 h-4 w-4" />
            ) : (
                <FiChevronDown className="ml-1 h-4 w-4" />
            );
        },
        [sortConfig]
    );

    const handleTypeChange = useCallback((newType) => {
        setSearchTerm("");
        setPerPage(10);
        setSortConfig({ key: "name", direction: "asc" });
        router.get(
            route("admin.role-permissions.index"),
            {
                type: newType,
                search: "",
                per_page: 10,
                sort: "name",
                direction: "asc",
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    prevFiltersRef.current = {
                        search: "",
                        per_page: 10,
                        sort: "name",
                        direction: "asc",
                    };
                },
            }
        );
    }, []);

    const roleColumns = useMemo(
        () => [
            {
                key: "name",
                label: "Role Name",
                sortable: true,
                onSort: () => handleSort("name"),
                sortIcon: getSortIcon("name"),
                render: (role) => (
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                <FiShield className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                {role.name}
                            </div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                {role.users_count} user(s)
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                key: "permissions",
                label: "Permissions",
                sortable: false,
                render: (role) => (
                    <div className="flex flex-wrap gap-1">
                        {role.permissions?.slice(0, 3).map((permission) => (
                            <span
                                key={permission.id}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-300"
                            >
                                {permission.name}
                            </span>
                        ))}
                        {role.permissions && role.permissions.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300">
                                +{role.permissions.length - 3} more
                            </span>
                        )}
                    </div>
                ),
            },
            {
                key: "created_at",
                label: "Created At",
                sortable: true,
                onSort: () => handleSort("created_at"),
                sortIcon: getSortIcon("created_at"),
                render: (role) => (
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {new Date(role.created_at).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </div>
                ),
            },
        ],
        [handleSort, getSortIcon]
    );

    const permissionColumns = useMemo(
        () => [
            {
                key: "name",
                label: "Permission Name",
                sortable: true,
                onSort: () => handleSort("name"),
                sortIcon: getSortIcon("name"),
                render: (permission) => (
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                                <FiKey className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                {permission.name}
                            </div>
                            {permission.description && (
                                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                    {permission.description}
                                </div>
                            )}
                        </div>
                    </div>
                ),
            },
            {
                key: "roles",
                label: "Assigned Roles",
                sortable: false,
                render: (permission) => (
                    <div className="flex flex-wrap gap-1">
                        {permission.roles?.slice(0, 3).map((role) => (
                            <span
                                key={role.id}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300"
                            >
                                {role.name}
                            </span>
                        ))}
                        {permission.roles && permission.roles.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300">
                                +{permission.roles.length - 3} more
                            </span>
                        )}
                    </div>
                ),
            },
            {
                key: "created_at",
                label: "Created At",
                sortable: true,
                onSort: () => handleSort("created_at"),
                sortIcon: getSortIcon("created_at"),
                render: (permission) => (
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {new Date(permission.created_at).toLocaleDateString(
                            "id-ID",
                            {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            }
                        )}
                    </div>
                ),
            },
        ],
        [handleSort, getSortIcon]
    );

    const columns = type === "roles" ? roleColumns : permissionColumns;

    const emptyState = useMemo(
        () => (
            <div className="flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500">
                {type === "roles" ? (
                    <>
                        <FiShield className="h-12 w-12 mb-3 opacity-50" />
                        <p className="text-lg font-medium">No roles found</p>
                        <p className="mt-1 text-sm">
                            Get started by creating a new role
                        </p>
                        {hasPermission("create roles") && (
                            <div className="mt-6">
                                <Link href={route("admin.roles.create")}>
                                    <PrimaryButton className="flex items-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-500">
                                        <FiPlus className="mr-2 h-5 w-5" />
                                        Add New Role
                                    </PrimaryButton>
                                </Link>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <FiKey className="h-12 w-12 mb-3 opacity-50" />
                        <p className="text-lg font-medium">
                            No permissions found
                        </p>
                        <p className="mt-1 text-sm">
                            Get started by creating a new permission
                        </p>
                        {hasPermission("create permissions") && (
                            <div className="mt-6">
                                <Link href={route("admin.permissions.create")}>
                                    <PrimaryButton className="flex items-center bg-accent-600 hover:bg-accent-700 focus:ring-accent-500">
                                        <FiPlus className="mr-2 h-5 w-5" />
                                        Add New Permission
                                    </PrimaryButton>
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        ),
        [type]
    );

    const rowActions = useCallback(
        (item) => (
            <RowActionsDropdown
                item={item}
                type={type}
                onEdit={() =>
                    router.visit(
                        route(
                            type === "roles"
                                ? "admin.roles.edit"
                                : "admin.permissions.edit",
                            item.id
                        )
                    )
                }
                onDelete={() => openDeleteModal(item.id, item.name, type)}
                hasEditPermission={hasPermission(
                    type === "roles" ? "edit roles" : "edit permissions"
                )}
                hasDeletePermission={hasPermission(
                    type === "roles" ? "delete roles" : "delete permissions"
                )}
            />
        ),
        [type, openDeleteModal]
    );

    const createButton = useMemo(
        () =>
            type === "roles" && hasPermission("create roles") ? (
                <Link href={route("admin.roles.create")}>
                    <PrimaryButton className="flex items-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-500">
                        <FiPlus className="mr-2 h-5 w-5" />
                        Add Role
                    </PrimaryButton>
                </Link>
            ) : type === "permissions" &&
              hasPermission("create permissions") ? (
                <Link href={route("admin.permissions.create")}>
                    <PrimaryButton className="flex items-center bg-accent-600 hover:bg-accent-700 focus:ring-accent-500">
                        <FiPlus className="mr-2 h-5 w-5" />
                        Add Permission
                    </PrimaryButton>
                </Link>
            ) : null,
        [type]
    );

    return (
        <AdminLayout
            title={type === "roles" ? "Manage Roles" : "Manage Permissions"}
        >
            <Head
                title={type === "roles" ? "Manage Roles" : "Manage Permissions"}
            />
            {hasPermission(
                type === "roles" ? "delete roles" : "delete permissions"
            ) && (
                <ConfirmationModal
                    isOpen={deleteModal.isOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleDelete}
                    title={`Confirm Delete ${
                        deleteModal.type === "roles" ? "Role" : "Permission"
                    }`}
                    message={`Are you sure you want to delete ${
                        deleteModal.type === "roles" ? "role" : "permission"
                    } "${deleteModal.name}"? This action cannot be undone.`}
                    confirmText={`Delete ${
                        deleteModal.type === "roles" ? "Role" : "Permission"
                    }`}
                    cancelText="Cancel"
                />
            )}
            {hasPermission(
                type === "roles" ? "delete roles" : "delete permissions"
            ) && (
                <ConfirmationModal
                    isOpen={bulkDeleteModal.isOpen}
                    onClose={closeBulkDeleteModal}
                    onConfirm={handleBulkDelete}
                    title={`Confirm Bulk Delete ${
                        bulkDeleteModal.type === "roles"
                            ? "Roles"
                            : "Permissions"
                    }`}
                    message={`Are you sure you want to delete ${
                        bulkDeleteModal.count
                    } selected ${
                        bulkDeleteModal.type === "roles"
                            ? "role(s)"
                            : "permission(s)"
                    }? This action cannot be undone.`}
                    confirmText={`Delete ${bulkDeleteModal.count} ${
                        bulkDeleteModal.type === "roles"
                            ? "Roles"
                            : "Permissions"
                    }`}
                    cancelText="Cancel"
                />
            )}
            <CrudLayout
                title={
                    type === "roles"
                        ? "Role Management"
                        : "Permission Management"
                }
                description={
                    type === "roles"
                        ? "Manage user roles and their permissions"
                        : "Manage system permissions and assign them to roles"
                }
                createButton={createButton}
                filters={
                    <div className="mb-6">
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <div className="flex space-x-1">
                                {hasPermission("view roles") && (
                                    <button
                                        onClick={() =>
                                            handleTypeChange("roles")
                                        }
                                        className={`px-4 py-2 rounded-xl text-sm font-medium ${
                                            type === "roles"
                                                ? "bg-primary-600 text-white"
                                                : "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600"
                                        }`}
                                    >
                                        <FiShield className="inline mr-2 h-4 w-4" />
                                        Roles
                                    </button>
                                )}
                                {hasPermission("view permissions") && (
                                    <button
                                        onClick={() =>
                                            handleTypeChange("permissions")
                                        }
                                        className={`px-4 py-2 rounded-xl text-sm font-medium ${
                                            type === "permissions"
                                                ? "bg-accent-600 text-white"
                                                : "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600"
                                        }`}
                                    >
                                        <FiKey className="inline mr-2 h-4 w-4" />
                                        Permissions
                                    </button>
                                )}
                            </div>
                        </div>
                        <FilterSection
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            perPage={perPage}
                            onPerPageChange={handlePerPageChange}
                            onClearFilters={clearFilters}
                        />
                    </div>
                }
            >
                {flash.success && (
                    <div className="mb-8 bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-xl p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-success-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-success-800 dark:text-success-200">
                                    {flash.success}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {flash.error && (
                    <div className="mb-8 bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-xl p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-error-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-error-800 dark:text-error-200">
                                    {flash.error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {hasPermission(
                    type === "roles" ? "delete roles" : "delete permissions"
                ) &&
                    selectedItems.length > 0 && (
                        <div className="mb-6">
                            <BulkActions
                                selectedCount={selectedItems.length}
                                onBulkDelete={openBulkDeleteModal}
                                onClearSelected={() => {
                                    clearSelectedItems();
                                    setSelectAll(false);
                                }}
                            />
                        </div>
                    )}
                <div className="mb-6">
                    <DataTable
                        key={type}
                        columns={columns}
                        data={data?.data || []}
                        selectedItems={selectedItems}
                        onSelectItem={handleItemSelection}
                        onSelectAll={handleSelectAll}
                        selectAll={selectAll}
                        emptyState={emptyState}
                        rowActions={rowActions}
                        keyField="id"
                    />
                </div>
                {data &&
                    data.data &&
                    data.data.length > 0 &&
                    data.links &&
                    data.links.length > 3 && (
                        <Pagination data={data} filters={{ type }} />
                    )}
            </CrudLayout>
        </AdminLayout>
    );
}
