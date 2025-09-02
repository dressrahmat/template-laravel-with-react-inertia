import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
} from "react";
import { Head, Link, router, usePage } from "@inertiajs/react"; // Ensure usePage is imported
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
    FiTrash2,
    FiSearch,
    FiX,
    FiChevronUp,
    FiChevronDown,
    FiDownload,
    FiMoreVertical,
    FiClock,
} from "react-icons/fi";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
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
const RowActionsDropdown = ({ auditTrail, onView, onDelete, canManage }) => {
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
                    Lihat
                </button>
                {canManage && (
                    <button
                        onClick={onDelete}
                        className="group flex items-center w-full px-4 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 hover:text-error-700 dark:hover:text-error-300"
                    >
                        <FiTrash2 className="mr-3 h-4 w-4" aria-hidden="true" />
                        Hapus
                    </button>
                )}
            </div>
        </PortalDropdown>
    );
};

// Komponen Modal untuk Cleanup
const CleanupModal = ({ isOpen, onClose, onConfirm, days, setDays }) => {
    return (
        <ConfirmationModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Konfirmasi Pembersihan Log"
            message={
                <div>
                    <p className="mb-4">
                        Masukkan jumlah hari untuk menghapus log audit trail
                        yang lebih lama dari periode tersebut. Biarkan kosong
                        untuk menghapus semua log.
                    </p>
                    <input
                        type="number"
                        value={days}
                        onChange={(e) =>
                            setDays(
                                e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
                            )
                        }
                        min="0"
                        placeholder="Jumlah hari (opsional)"
                        className="w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    />
                </div>
            }
            confirmText="Bersihkan Log"
            cancelText="Batal"
        />
    );
};

// Custom hook untuk menyimpan selected items di sessionStorage
const usePersistedSelectedAuditTrails = (initialValue = []) => {
    const [selectedAuditTrails, setSelectedAuditTrails] = useState(() => {
        try {
            const stored = sessionStorage.getItem("selectedAuditTrails");
            return stored ? JSON.parse(stored) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        sessionStorage.setItem(
            "selectedAuditTrails",
            JSON.stringify(selectedAuditTrails)
        );
    }, [selectedAuditTrails]);

    const clearSelectedAuditTrails = useCallback(() => {
        sessionStorage.removeItem("selectedAuditTrails");
        setSelectedAuditTrails([]);
    }, []);

    return [
        selectedAuditTrails,
        setSelectedAuditTrails,
        clearSelectedAuditTrails,
    ];
};

export default function AuditTrailIndex({
    auditTrails,
    filters: initialFilters,
    availableEvents,
    availableTables,
    auth,
}) {
    const { props } = usePage(); // Use usePage hook to access Inertia props
    const flash = props.flash || {};
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        auditTrailId: null,
        auditTrailDescription: "",
    });
    const [bulkDeleteModal, setBulkDeleteModal] = useState({
        isOpen: false,
        count: 0,
    });
    const [cleanupModal, setCleanupModal] = useState({
        isOpen: false,
        days: "",
    });

    const [
        selectedAuditTrails,
        setSelectedAuditTrails,
        clearSelectedAuditTrails,
    ] = usePersistedSelectedAuditTrails([]);
    const [selectAll, setSelectAll] = useState(false);
    const [filters, setFilters] = useState({
        search: initialFilters?.search || "",
        event: initialFilters?.event || "",
        table: initialFilters?.table || "",
        date: initialFilters?.date || "",
        per_page: initialFilters?.per_page || 10,
        sort: initialFilters?.sort || "created_at",
        direction: initialFilters?.direction || "desc",
    });
    const { success, error } = useToast();

    const prevFiltersRef = useRef({
        search: initialFilters?.search || "",
        event: initialFilters?.event || "",
        table: initialFilters?.table || "",
        date: initialFilters?.date || "",
        per_page: initialFilters?.per_page || 10,
        sort: initialFilters?.sort || "created_at",
        direction: initialFilters?.direction || "desc",
    });

    useEffect(() => {
        const currentFilters = {
            search: filters.search,
            event: filters.event,
            table: filters.table,
            date: filters.date,
            per_page: filters.per_page,
            sort: filters.sort,
            direction: filters.direction,
        };

        const hasChanged =
            currentFilters.search !== prevFiltersRef.current.search ||
            currentFilters.event !== prevFiltersRef.current.event ||
            currentFilters.table !== prevFiltersRef.current.table ||
            currentFilters.date !== prevFiltersRef.current.date ||
            currentFilters.per_page !== prevFiltersRef.current.per_page ||
            currentFilters.sort !== prevFiltersRef.current.sort ||
            currentFilters.direction !== prevFiltersRef.current.direction;

        if (hasChanged) {
            const timer = setTimeout(() => {
                router.get(route("admin.audit-trail.index"), currentFilters, {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                    onFinish: () => {
                        prevFiltersRef.current = currentFilters;
                    },
                });
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [filters]);

    useEffect(() => {
        if (auditTrails && auditTrails.data && selectedAuditTrails.length > 0) {
            const currentPageIds = auditTrails.data.map((audit) => audit.id);
            const allCurrentSelected = currentPageIds.every((id) =>
                selectedAuditTrails.includes(id)
            );
            const someCurrentSelected = currentPageIds.some((id) =>
                selectedAuditTrails.includes(id)
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
    }, [auditTrails, selectedAuditTrails]);

    const handleRowClick = useCallback((auditTrail) => {
        router.visit(route("admin.audit-trail.show", auditTrail.id));
    }, []);

    const handleSelectAll = useCallback(() => {
        if (auditTrails && auditTrails.data) {
            const currentPageIds = auditTrails.data.map((audit) => audit.id);

            if (!selectAll) {
                setSelectedAuditTrails((prev) => {
                    const newSelected = [
                        ...new Set([...prev, ...currentPageIds]),
                    ];
                    return newSelected;
                });
            } else {
                setSelectedAuditTrails((prev) =>
                    prev.filter((id) => !currentPageIds.includes(id))
                );
            }
        }
    }, [selectAll, auditTrails, setSelectedAuditTrails]);

    const handleAuditTrailSelection = useCallback(
        (auditTrailId) => {
            setSelectedAuditTrails((prev) => {
                if (prev.includes(auditTrailId)) {
                    return prev.filter((id) => id !== auditTrailId);
                } else {
                    return [...prev, auditTrailId];
                }
            });
        },
        [setSelectedAuditTrails]
    );

    const openDeleteModal = useCallback(
        (auditTrailId, auditTrailDescription) => {
            setDeleteModal({
                isOpen: true,
                auditTrailId,
                auditTrailDescription,
            });
        },
        []
    );

    const openBulkDeleteModal = useCallback(() => {
        setBulkDeleteModal({
            isOpen: true,
            count: selectedAuditTrails.length,
        });
    }, [selectedAuditTrails.length]);

    const openCleanupModal = useCallback(() => {
        setCleanupModal({
            isOpen: true,
            days: "",
        });
    }, []);

    const closeDeleteModal = useCallback(() => {
        setDeleteModal({
            isOpen: false,
            auditTrailId: null,
            auditTrailDescription: "",
        });
    }, []);

    const closeBulkDeleteModal = useCallback(() => {
        setBulkDeleteModal({
            isOpen: false,
            count: 0,
        });
    }, []);

    const closeCleanupModal = useCallback(() => {
        setCleanupModal({
            isOpen: false,
            days: "",
        });
    }, []);

    const handleDelete = useCallback(() => {
        if (deleteModal.auditTrailId) {
            router.delete(
                route("admin.audit-trail.cleanup"),
                {
                    days: 0,
                    id: deleteModal.auditTrailId,
                },
                {
                    onSuccess: () => {
                        success("Log audit trail berhasil dihapus!");
                        closeDeleteModal();
                        setSelectedAuditTrails((prev) =>
                            prev.filter((id) => id !== deleteModal.auditTrailId)
                        );
                    },
                    onError: () => {
                        error("Gagal menghapus log audit trail.");
                        closeDeleteModal();
                    },
                }
            );
        } else {
            closeDeleteModal();
        }
    }, [
        deleteModal.auditTrailId,
        closeDeleteModal,
        success,
        error,
        setSelectedAuditTrails,
    ]);

    const handleBulkDelete = useCallback(() => {
        if (selectedAuditTrails.length > 0) {
            router.post(
                route("admin.audit-trail.cleanup"),
                {
                    days: 0,
                    ids: selectedAuditTrails,
                },
                {
                    onSuccess: () => {
                        success(
                            `${selectedAuditTrails.length} log audit trail berhasil dihapus!`
                        );
                        clearSelectedAuditTrails();
                        setSelectAll(false);
                        closeBulkDeleteModal();
                    },
                    onError: () => {
                        error("Gagal menghapus log audit trail terpilih.");
                        closeBulkDeleteModal();
                    },
                }
            );
        }
    }, [
        selectedAuditTrails,
        closeBulkDeleteModal,
        success,
        error,
        clearSelectedAuditTrails,
    ]);

    const handleCleanup = useCallback(() => {
        router.post(
            route("admin.audit-trail.cleanup"),
            {
                days: cleanupModal.days || null,
            },
            {
                onSuccess: () => {
                    success("Pembersihan log audit trail berhasil!");
                    closeCleanupModal();
                    clearSelectedAuditTrails();
                    setSelectAll(false);
                },
                onError: () => {
                    error("Gagal melakukan pembersihan log audit trail.");
                    closeCleanupModal();
                },
            }
        );
    }, [
        cleanupModal.days,
        closeCleanupModal,
        success,
        error,
        clearSelectedAuditTrails,
    ]);

    const handleExport = useCallback(() => {
        router.post(
            route("admin.audit-trail.export"),
            {
                ids:
                    selectedAuditTrails.length > 0 ? selectedAuditTrails : null,
                start_date: filters.date || null,
                event: filters.event || null,
                table: filters.table || null,
            },
            {
                onSuccess: () => {
                    success("Ekspor data dimulai!");
                },
                onError: () => {
                    error("Gagal mengekspor data audit trail.");
                },
            }
        );
    }, [filters, selectedAuditTrails, success, error]);

    const handleSort = useCallback((key) => {
        setFilters((prev) => ({
            ...prev,
            sort: key,
            direction:
                prev.sort === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({
            search: "",
            event: "",
            table: "",
            date: "",
            per_page: 10,
            sort: "created_at",
            direction: "desc",
        });
        router.get(
            route("admin.audit-trail.index"),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    prevFiltersRef.current = {
                        search: "",
                        event: "",
                        table: "",
                        date: "",
                        per_page: 10,
                        sort: "created_at",
                        direction: "desc",
                    };
                },
            }
        );
    }, []);

    const handlePerPageChange = useCallback((newPerPage) => {
        setFilters((prev) => ({ ...prev, per_page: newPerPage }));
    }, []);

    const handleFilterChange = useCallback((key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }, []);

    const getSortIcon = useCallback(
        (key) => {
            if (filters.sort !== key) {
                return <FiChevronUp className="ml-1 h-4 w-4 opacity-50" />;
            }
            return filters.direction === "asc" ? (
                <FiChevronUp className="ml-1 h-4 w-4" />
            ) : (
                <FiChevronDown className="ml-1 h-4 w-4" />
            );
        },
        [filters.sort, filters.direction]
    );

    const columns = useMemo(
        () => [
            {
                key: "event",
                label: "Peristiwa",
                sortable: true,
                onSort: () => handleSort("event"),
                sortIcon: getSortIcon("event"),
                render: (auditTrail) => (
                    <div className="flex items-center">
                        <div
                            className={`w-2 h-2 rounded-full mr-2 bg-${auditTrail.event_color}-500`}
                        ></div>
                        <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            {availableEvents[auditTrail.event] ||
                                auditTrail.event}
                        </div>
                    </div>
                ),
            },
            {
                key: "table_name",
                label: "Tabel",
                sortable: true,
                onSort: () => handleSort("table_name"),
                sortIcon: getSortIcon("table_name"),
                render: (auditTrail) => (
                    <div className="text-sm text-neutral-900 dark:text-white">
                        {auditTrail.table_display_name}
                    </div>
                ),
            },
            {
                key: "user",
                label: "Pengguna",
                render: (auditTrail) => (
                    <div className="text-sm text-neutral-900 dark:text-white">
                        {auditTrail.user ? auditTrail.user.name : "Sistem"}
                    </div>
                ),
            },
            {
                key: "created_at",
                label: "Tanggal",
                sortable: true,
                onSort: () => handleSort("created_at"),
                sortIcon: getSortIcon("created_at"),
                render: (auditTrail) => (
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {new Date(auditTrail.created_at).toLocaleDateString(
                            "id-ID",
                            {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            }
                        )}
                    </div>
                ),
            },
        ],
        [handleSort, getSortIcon, availableEvents]
    );

    const emptyState = useMemo(
        () => (
            <div className="flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500">
                <FiSearch className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-lg font-medium">Tidak ada log audit trail</p>
                <p className="mt-1 text-sm">
                    Tidak ada aktivitas yang tercatat saat ini
                </p>
            </div>
        ),
        []
    );

    const rowActions = useCallback(
        (auditTrail) => (
            <RowActionsDropdown
                auditTrail={auditTrail}
                onView={() =>
                    router.visit(route("admin.audit-trail.show", auditTrail.id))
                }
                onDelete={() =>
                    openDeleteModal(auditTrail.id, auditTrail.message)
                }
                canManage={auth.user.permissions.includes("manage audit trail")}
            />
        ),
        [openDeleteModal, auth.user.permissions]
    );

    const filterSection = useMemo(
        () => (
            <div className="mb-6">
                <FilterSection
                    searchTerm={filters.search}
                    onSearchChange={(value) =>
                        handleFilterChange("search", value)
                    }
                    perPage={filters.per_page}
                    onPerPageChange={handlePerPageChange}
                    onClearFilters={clearFilters}
                    additionalFilters={
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Peristiwa
                                </label>
                                <select
                                    value={filters.event}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "event",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                                >
                                    <option value="">Semua Peristiwa</option>
                                    {Object.entries(availableEvents).map(
                                        ([key, value]) => (
                                            <option key={key} value={key}>
                                                {value}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Tabel
                                </label>
                                <select
                                    value={filters.table}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "table",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                                >
                                    <option value="">Semua Tabel</option>
                                    {Object.entries(availableTables).map(
                                        ([key, value]) => (
                                            <option key={key} value={key}>
                                                {value}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Tanggal
                                </label>
                                <input
                                    type="date"
                                    value={filters.date}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "date",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                                />
                            </div>
                        </div>
                    }
                />
            </div>
        ),
        [
            filters.search,
            filters.event,
            filters.table,
            filters.date,
            filters.per_page,
            availableEvents,
            availableTables,
            handleFilterChange,
            handlePerPageChange,
            clearFilters,
        ]
    );

    const createButton = useMemo(
        () =>
            auth.user.permissions.includes("manage audit trail") ? (
                <PrimaryButton
                    onClick={openCleanupModal}
                    className="flex items-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-500"
                >
                    <FiClock className="mr-2 h-5 w-5" />
                    Bersihkan Log
                </PrimaryButton>
            ) : null,
        [openCleanupModal, auth.user.permissions]
    );

    return (
        <AdminLayout title="Manajemen Audit Trail">
            <Head title="Manajemen Audit Trail" />

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                title="Konfirmasi Penghapusan"
                message={`Apakah Anda yakin ingin menghapus log audit trail "${deleteModal.auditTrailDescription}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Hapus Log"
                cancelText="Batal"
            />

            <ConfirmationModal
                isOpen={bulkDeleteModal.isOpen}
                onClose={closeBulkDeleteModal}
                onConfirm={handleBulkDelete}
                title="Konfirmasi Penghapusan Massal"
                message={`Apakah Anda yakin ingin menghapus ${bulkDeleteModal.count} log audit trail terpilih? Tindakan ini tidak dapat dibatalkan.`}
                confirmText={`Hapus ${bulkDeleteModal.count} Log`}
                cancelText="Batal"
            />

            <CleanupModal
                isOpen={cleanupModal.isOpen}
                onClose={closeCleanupModal}
                onConfirm={handleCleanup}
                days={cleanupModal.days}
                setDays={(value) =>
                    setCleanupModal((prev) => ({ ...prev, days: value }))
                }
            />

            <CrudLayout
                title="Manajemen Audit Trail"
                description="Kelola semua log aktivitas sistem"
                createButton={createButton}
                filters={filterSection}
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

                {selectedAuditTrails.length > 0 && (
                    <div className="mb-6">
                        <BulkActions
                            selectedCount={selectedAuditTrails.length}
                            onBulkDelete={
                                auth.user.permissions.includes(
                                    "manage audit trail"
                                )
                                    ? openBulkDeleteModal
                                    : null
                            }
                            onBulkExport={handleExport}
                            onClearSelected={() => {
                                clearSelectedAuditTrails();
                                setSelectAll(false);
                            }}
                        />
                    </div>
                )}

                <div className="mb-6">
                    <DataTable
                        columns={columns}
                        data={auditTrails?.data || []}
                        selectedItems={selectedAuditTrails}
                        onSelectItem={handleAuditTrailSelection}
                        onSelectAll={handleSelectAll}
                        selectAll={selectAll}
                        emptyState={emptyState}
                        rowActions={rowActions}
                        keyField="id"
                        onRowClick={handleRowClick}
                    />
                </div>

                {auditTrails &&
                    auditTrails.data &&
                    auditTrails.data.length > 0 &&
                    auditTrails.links &&
                    auditTrails.links.length > 3 && (
                        <Pagination data={auditTrails} />
                    )}
            </CrudLayout>
        </AdminLayout>
    );
}
