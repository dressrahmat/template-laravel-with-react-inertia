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
} from "react-icons/fi";
import { createPortal } from "react-dom";

// Komponen Dropdown dengan Portal untuk merender di luar hierarchy tabel
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
                            className={`absolute mt-1 w-48 rounded-md shadow-lg bg-neutral-50 dark:bg-neutral-800 ring-1 ring-primary-500 ring-opacity-20 focus:outline-none ${getPositionClass()}`}
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

// Komponen Dropdown Actions untuk setiap baris
const RowActionsDropdown = ({
    user,
    onView,
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
                <button
                    onClick={onView}
                    className="group flex items-center w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-neutral-700 hover:text-primary-600 dark:hover:text-primary-400"
                >
                    <FiEye className="mr-3 h-4 w-4" aria-hidden="true" />
                    View
                </button>
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

// Custom hook untuk menyimpan selected items di sessionStorage
const usePersistedSelectedUsers = (initialValue = []) => {
    const [selectedUsers, setSelectedUsers] = useState(() => {
        try {
            const stored = sessionStorage.getItem("selectedUsers");
            return stored ? JSON.parse(stored) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        sessionStorage.setItem("selectedUsers", JSON.stringify(selectedUsers));
    }, [selectedUsers]);

    const clearSelectedUsers = useCallback(() => {
        sessionStorage.removeItem("selectedUsers");
        setSelectedUsers([]);
    }, []);

    return [selectedUsers, setSelectedUsers, clearSelectedUsers];
};

export default function UsersIndex({ users, filters: initialFilters }) {
    const { props } = usePage();
    const { auth } = props;
    const flash = props.flash || {};
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        userId: null,
        userName: "",
    });
    const [bulkDeleteModal, setBulkDeleteModal] = useState({
        isOpen: false,
        count: 0,
    });

    const [selectedUsers, setSelectedUsers, clearSelectedUsers] =
        usePersistedSelectedUsers([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState(initialFilters?.search || "");
    const [perPage, setPerPage] = useState(initialFilters?.per_page || 5);
    const [sortConfig, setSortConfig] = useState({
        key: initialFilters?.sort || "created_at",
        direction: initialFilters?.direction || "desc",
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
        per_page: initialFilters?.per_page || 5,
        sort: initialFilters?.sort || "created_at",
        direction: initialFilters?.direction || "desc",
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
                    route("admin.users.index"),
                    {
                        search: searchTerm,
                        sort: sortConfig.key,
                        direction: sortConfig.direction,
                        per_page: perPage,
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
    }, [searchTerm, perPage, sortConfig]);

    useEffect(() => {
        if (users && users.data && selectedUsers.length > 0) {
            const currentPageIds = users.data.map((user) => user.id);
            const allCurrentSelected = currentPageIds.every((id) =>
                selectedUsers.includes(id)
            );
            const someCurrentSelected = currentPageIds.some((id) =>
                selectedUsers.includes(id)
            );

            if (allCurrentSelected) {
                setSelectAll(true);
            } else if (someCurrentSelected) {
                setSelectAll(false);
            } else {
                setSelectAll(false);
            }
        } else {
            setSelectAll(false);
        }
    }, [users, selectedUsers]);

    const handleRowClick = useCallback((user) => {
        router.visit(route("admin.users.show", user.id));
    }, []);

    const handleSelectAll = useCallback(() => {
        if (users && users.data) {
            const currentPageIds = users.data.map((user) => user.id);

            if (!selectAll) {
                setSelectedUsers((prev) => {
                    const newSelected = [
                        ...new Set([...prev, ...currentPageIds]),
                    ];
                    return newSelected;
                });
            } else {
                setSelectedUsers((prev) =>
                    prev.filter((id) => !currentPageIds.includes(id))
                );
            }
        }
    }, [selectAll, users, setSelectedUsers]);

    const handleUserSelection = useCallback(
        (userId) => {
            setSelectedUsers((prev) => {
                if (prev.includes(userId)) {
                    return prev.filter((id) => id !== userId);
                } else {
                    return [...prev, userId];
                }
            });
        },
        [setSelectedUsers]
    );

    const openDeleteModal = useCallback((userId, userName) => {
        setDeleteModal({
            isOpen: true,
            userId,
            userName,
        });
    }, []);

    const openBulkDeleteModal = useCallback(() => {
        setBulkDeleteModal({
            isOpen: true,
            count: selectedUsers.length,
        });
    }, [selectedUsers.length]);

    const closeDeleteModal = useCallback(() => {
        setDeleteModal({
            isOpen: false,
            userId: null,
            userName: "",
        });
    }, []);

    const closeBulkDeleteModal = useCallback(() => {
        setBulkDeleteModal({
            isOpen: false,
            count: 0,
        });
    }, []);

    const handleDelete = useCallback(() => {
        if (deleteModal.userId) {
            router.delete(route("admin.users.destroy", deleteModal.userId), {
                onSuccess: () => {
                    success("User deleted successfully!");
                    closeDeleteModal();
                    setSelectedUsers((prev) =>
                        prev.filter((id) => id !== deleteModal.userId)
                    );
                },
                onError: () => {
                    error("Failed to delete user.");
                    closeDeleteModal();
                },
            });
        } else {
            closeDeleteModal();
        }
    }, [
        deleteModal.userId,
        closeDeleteModal,
        success,
        error,
        setSelectedUsers,
    ]);

    const handleBulkDelete = useCallback(() => {
        if (selectedUsers.length > 0) {
            router.post(
                route("admin.users.bulk-destroy"),
                {
                    ids: selectedUsers,
                },
                {
                    onSuccess: () => {
                        success(
                            `${selectedUsers.length} user(s) deleted successfully!`
                        );
                        clearSelectedUsers();
                        setSelectAll(false);
                        closeBulkDeleteModal();
                    },
                    onError: () => {
                        error("Failed to delete selected users.");
                        closeBulkDeleteModal();
                    },
                }
            );
        }
    }, [
        selectedUsers,
        closeBulkDeleteModal,
        success,
        error,
        clearSelectedUsers,
    ]);

    const handleExport = useCallback(() => {
        if (selectedUsers.length > 0) {
            router.post(
                route("admin.users.export"),
                {
                    ids: selectedUsers,
                },
                {
                    onSuccess: () => {
                        success("Export initiated successfully!");
                    },
                    onError: () => {
                        error("Failed to export users.");
                    },
                }
            );
        }
    }, [selectedUsers, success, error]);

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
        setPerPage(5);
        setSortConfig({ key: "created_at", direction: "desc" });
        router.get(
            route("admin.users.index"),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    prevFiltersRef.current = {
                        search: "",
                        per_page: 5,
                        sort: "created_at",
                        direction: "desc",
                    };
                },
            }
        );
    }, []);

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

    const columns = useMemo(
        () => [
            {
                key: "name",
                label: "Name",
                sortable: true,
                onSort: () => handleSort("name"),
                sortIcon: getSortIcon("name"),
                render: (user) => (
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                <span className="font-medium text-primary-800 dark:text-primary-200">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                {user.name}
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                key: "email",
                label: "Email",
                sortable: true,
                onSort: () => handleSort("email"),
                sortIcon: getSortIcon("email"),
                render: (user) => (
                    <div className="text-sm text-neutral-900 dark:text-white">
                        {user.email}
                    </div>
                ),
            },
            {
                key: "roles",
                label: "Roles",
                render: (user) => (
                    <div className="flex flex-wrap gap-1">
                        {user.roles &&
                            user.roles.map((role, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                                >
                                    {role.name}
                                </span>
                            ))}
                    </div>
                ),
            },
            {
                key: "created_at",
                label: "Joined Date",
                sortable: true,
                onSort: () => handleSort("created_at"),
                sortIcon: getSortIcon("created_at"),
                render: (user) => (
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {new Date(user.created_at).toLocaleDateString("id-ID", {
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

    const emptyState = useMemo(
        () => (
            <div className="flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500">
                <FiUserPlus className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-lg font-medium">No users found</p>
                <p className="mt-1 text-sm">
                    Get started by creating a new user
                </p>
                {hasPermission("create users") && (
                    <div className="mt-6">
                        <Link href={route("admin.users.create")}>
                            <PrimaryButton className="flex items-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-500">
                                <FiPlus className="mr-2 h-5 w-5" />
                                Add New User
                            </PrimaryButton>
                        </Link>
                    </div>
                )}
            </div>
        ),
        []
    );

    const rowActions = useCallback(
        (user) => (
            <RowActionsDropdown
                user={user}
                onView={() => router.visit(route("admin.users.show", user.id))}
                onEdit={() => router.visit(route("admin.users.edit", user.id))}
                onDelete={() => openDeleteModal(user.id, user.name)}
                hasEditPermission={hasPermission("edit users")}
                hasDeletePermission={hasPermission("delete users")}
            />
        ),
        [openDeleteModal]
    );

    const createButton = useMemo(
        () =>
            hasPermission("create users") ? (
                <Link href={route("admin.users.create")}>
                    <PrimaryButton className="flex items-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-500">
                        <FiUserPlus className="mr-2 h-5 w-5" />
                        Add User
                    </PrimaryButton>
                </Link>
            ) : null,
        []
    );

    return (
        <AdminLayout title="Manage Users">
            <Head title="Manage Users" />

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                title="Confirm Delete"
                message={`Are you sure you want to delete user "${deleteModal.userName}"? This action cannot be undone.`}
                confirmText="Delete User"
                cancelText="Cancel"
            />

            {hasPermission("delete users") && (
                <ConfirmationModal
                    isOpen={bulkDeleteModal.isOpen}
                    onClose={closeBulkDeleteModal}
                    onConfirm={handleBulkDelete}
                    title="Confirm Bulk Delete"
                    message={`Are you sure you want to delete ${bulkDeleteModal.count} selected user(s)? This action cannot be undone.`}
                    confirmText={`Delete ${bulkDeleteModal.count} Users`}
                    cancelText="Cancel"
                />
            )}

            <CrudLayout
                title="User Management"
                description="Manage all system users, their roles and permissions"
                createButton={createButton}
                filters={
                    <div className="mb-6">
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
                    <div className="mb-8 bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-md p-4">
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
                    <div className="mb-8 bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-md p-4">
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

                {hasPermission("delete users") && selectedUsers.length > 0 && (
                    <div className="mb-6">
                        <BulkActions
                            selectedCount={selectedUsers.length}
                            onBulkDelete={openBulkDeleteModal}
                            onBulkExport={handleExport}
                            onClearSelected={clearSelectedUsers}
                        />
                    </div>
                )}

                <div className="mb-6">
                    <DataTable
                        columns={columns}
                        data={users?.data || []}
                        selectedItems={selectedUsers}
                        onSelectItem={handleUserSelection}
                        onSelectAll={handleSelectAll}
                        selectAll={selectAll}
                        emptyState={emptyState}
                        rowActions={rowActions}
                        keyField="id"
                        onRowClick={handleRowClick}
                    />
                </div>

                {users &&
                    users.data &&
                    users.data.length > 0 &&
                    users.links &&
                    users.links.length > 3 && <Pagination data={users} />}
            </CrudLayout>
        </AdminLayout>
    );
}
