import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import DangerButton from "@/Components/DangerButton";
import ConfirmationModal from "@/Components/ConfirmationModal";
import { useToast } from "@/Contexts/ToastContext";

export default function ShowAuditTrail({
    auditTrail,
    availableEvents = {},
    auth,
}) {
    // Tambahkan default value dan pengecekan null
    const safeAuditTrail = {
        ...auditTrail,
        created_at: auditTrail?.created_at || new Date().toISOString(),
        created_at_human:
            auditTrail?.created_at_human || "Waktu tidak tersedia",
        event_color: auditTrail?.event_color || "neutral",
        event_display_name:
            auditTrail?.event_display_name || auditTrail?.event || "Aktivitas",
        auditable_type_display_name:
            auditTrail?.auditable_type_display_name ||
            "Tipe Data tidak diketahui",
        description:
            auditTrail?.description ||
            auditTrail?.readable_description ||
            "Aktivitas tidak diketahui",
        user: auditTrail?.user || null,
        affected_user: auditTrail?.affected_user || null,
        old_values: auditTrail?.old_values || null,
        new_values: auditTrail?.new_values || null,
        ip_address: auditTrail?.ip_address || null,
        user_agent: auditTrail?.user_agent || null,
        url: auditTrail?.url || null,
        tags: auditTrail?.tags || null,
        batch_uuid: auditTrail?.batch_uuid || null,
    };

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        auditTrailId: null,
        auditTrailDescription: "",
    });
    const { success, error } = useToast();

    const openDeleteModal = () => {
        setDeleteModal({
            isOpen: true,
            auditTrailId: safeAuditTrail.id,
            auditTrailDescription: safeAuditTrail.description,
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            auditTrailId: null,
            auditTrailDescription: "",
        });
    };

    const handleDelete = () => {
        if (deleteModal.auditTrailId) {
            router.delete(
                route("admin.audit-trail.destroy", deleteModal.auditTrailId),
                {
                    onSuccess: () => {
                        success("Log audit trail berhasil dihapus!");
                        closeDeleteModal();
                        router.visit(route("admin.audit-trail.index"));
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
    };

    // Helper function untuk mendapatkan warna event
    const getEventColor = (event) => {
        const colorMap = {
            created: "success",
            login: "success",
            approved: "success",
            updated: "warning",
            restored: "warning",
            imported: "warning",
            deleted: "error",
            logout: "error",
            rejected: "error",
            viewed: "info",
            downloaded: "info",
            exported: "primary",
        };
        return colorMap[event] || "neutral";
    };

    // Helper function untuk menampilkan data JSON yang diformat
    const renderJsonData = (data) => {
        if (!data) return null;

        return (
            <pre className="text-sm text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 p-3 rounded-md overflow-auto max-h-64">
                {JSON.stringify(data, null, 2)}
            </pre>
        );
    };

    // Helper function untuk menampilkan informasi user
    const renderUserInfo = (user, label = "Pengguna") => {
        if (!user) return null;

        return (
            <div className="flex items-center space-x-3 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                    {user.name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                    <div className="font-medium text-neutral-900 dark:text-white">
                        {user.name}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        {user.email}
                    </div>
                </div>
            </div>
        );
    };

    // Helper function untuk menampilkan tags
    const renderTags = (tags) => {
        if (!tags || !Array.isArray(tags) || tags.length === 0) return null;

        return (
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        );
    };

    const eventColor = getEventColor(safeAuditTrail.event);

    return (
        <AdminLayout title="Detail Audit Trail">
            <Head title="Detail Audit Trail" />

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                title="Konfirmasi Penghapusan"
                message={`Apakah Anda yakin ingin menghapus log audit trail "${deleteModal.auditTrailDescription}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Hapus Log"
                cancelText="Batal"
            />

            <div className="mx-auto px-1 lg:px-4 lg:pt-2">
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl shadow-card overflow-hidden">
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5 text-white flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Detail Audit Trail
                            </h2>
                            <p className="text-primary-100 opacity-90 mt-1">
                                Informasi lengkap tentang aktivitas sistem
                            </p>
                        </div>

                        <div className="hidden md:flex items-center space-x-3">
                            <Link
                                href={route("admin.audit-trail.index")}
                                className="inline-flex items-center justify-center px-4 py-2 bg-neutral-50/20 hover:bg-neutral-50/30 border border-neutral-50/30 rounded-lg text-white shadow-sm transition-all duration-200"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Kembali
                            </Link>

                            {auth.user.permissions.includes(
                                "delete audit trails"
                            ) && (
                                <DangerButton
                                    onClick={openDeleteModal}
                                    className="flex items-center px-4 py-2"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                    Hapus
                                </DangerButton>
                            )}
                        </div>
                    </div>

                    <div className="p-4 md:p-8">
                        {/* Header Information */}
                        <div className="flex flex-col mb-8">
                            <div className="flex items-center mb-4">
                                <div
                                    className={`w-3 h-3 rounded-full mr-3 bg-${eventColor}-500`}
                                ></div>
                                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    {safeAuditTrail.event_display_name}
                                </h1>
                            </div>
                            <p className="text-lg text-neutral-600 dark:text-neutral-300">
                                {safeAuditTrail.description}
                            </p>
                            {safeAuditTrail.auditable_type && (
                                <div className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                                    {safeAuditTrail.auditable_type_display_name}
                                    {safeAuditTrail.auditable_id &&
                                        ` #${safeAuditTrail.auditable_id}`}
                                </div>
                            )}
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Informasi Utama */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Informasi Audit */}
                                <div className="bg-neutral-50 dark:bg-neutral-700/50 p-6 rounded-xl">
                                    <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-4 border-b border-neutral-200 dark:border-neutral-600 pb-3">
                                        Informasi Audit
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                ID Log
                                            </label>
                                            <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                                #{safeAuditTrail.id}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                Peristiwa
                                            </label>
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${eventColor}-100 dark:bg-${eventColor}-900 text-${eventColor}-800 dark:text-${eventColor}-200`}
                                            >
                                                {
                                                    safeAuditTrail.event_display_name
                                                }
                                            </span>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                Tipe Data
                                            </label>
                                            <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                                {
                                                    safeAuditTrail.auditable_type_display_name
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                ID Data
                                            </label>
                                            <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                                {safeAuditTrail.auditable_id ||
                                                    "-"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                Waktu
                                            </label>
                                            <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                                {safeAuditTrail.created_at
                                                    ? new Date(
                                                          safeAuditTrail.created_at
                                                      ).toLocaleDateString(
                                                          "id-ID",
                                                          {
                                                              year: "numeric",
                                                              month: "long",
                                                              day: "numeric",
                                                              hour: "2-digit",
                                                              minute: "2-digit",
                                                              second: "2-digit",
                                                          }
                                                      )
                                                    : "Waktu tidak tersedia"}
                                            </p>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                (
                                                {
                                                    safeAuditTrail.created_at_human
                                                }
                                                )
                                            </p>
                                        </div>
                                        {safeAuditTrail.batch_uuid && (
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                    Batch ID
                                                </label>
                                                <p className="text-sm font-mono text-neutral-900 dark:text-white break-all">
                                                    {safeAuditTrail.batch_uuid}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Informasi Pengguna */}
                                <div className="bg-neutral-50 dark:bg-neutral-700/50 p-6 rounded-xl">
                                    <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-4 border-b border-neutral-200 dark:border-neutral-600 pb-3">
                                        Informasi Pengguna
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-3">
                                                Pengguna Pelaku
                                            </label>
                                            {renderUserInfo(
                                                safeAuditTrail.user
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-3">
                                                Pengguna Terdampak
                                            </label>
                                            {safeAuditTrail.affected_user ? (
                                                renderUserInfo(
                                                    safeAuditTrail.affected_user
                                                )
                                            ) : (
                                                <p className="text-neutral-500 dark:text-neutral-400 italic p-3">
                                                    Tidak ada user terdampak
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Informasi Teknis */}
                                {(safeAuditTrail.ip_address ||
                                    safeAuditTrail.user_agent ||
                                    safeAuditTrail.url) && (
                                    <div className="bg-neutral-50 dark:bg-neutral-700/50 p-6 rounded-xl">
                                        <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-4 border-b border-neutral-200 dark:border-neutral-600 pb-3">
                                            Informasi Teknis
                                        </h3>
                                        <div className="space-y-4">
                                            {safeAuditTrail.ip_address && (
                                                <div>
                                                    <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                        Alamat IP
                                                    </label>
                                                    <p className="text-lg font-medium text-neutral-900 dark:text-white font-mono">
                                                        {
                                                            safeAuditTrail.ip_address
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                            {safeAuditTrail.url && (
                                                <div>
                                                    <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                        URL
                                                    </label>
                                                    <p className="text-lg font-medium text-neutral-900 dark:text-white break-all">
                                                        {safeAuditTrail.url}
                                                    </p>
                                                </div>
                                            )}
                                            {safeAuditTrail.user_agent && (
                                                <div>
                                                    <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                        User Agent
                                                    </label>
                                                    <p className="text-sm text-neutral-900 dark:text-white break-all">
                                                        {
                                                            safeAuditTrail.user_agent
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar - Perubahan Data & Tags */}
                            <div className="space-y-6">
                                {/* Perubahan Data */}
                                {(safeAuditTrail.old_values ||
                                    safeAuditTrail.new_values) && (
                                    <div className="bg-neutral-50 dark:bg-neutral-700/50 p-6 rounded-xl">
                                        <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-4 border-b border-neutral-200 dark:border-neutral-600 pb-3">
                                            Perubahan Data
                                        </h3>
                                        <div className="space-y-4">
                                            {safeAuditTrail.old_values && (
                                                <div>
                                                    <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                                                        Nilai Lama
                                                    </label>
                                                    {renderJsonData(
                                                        safeAuditTrail.old_values
                                                    )}
                                                </div>
                                            )}
                                            {safeAuditTrail.new_values && (
                                                <div>
                                                    <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                                                        Nilai Baru
                                                    </label>
                                                    {renderJsonData(
                                                        safeAuditTrail.new_values
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Tags */}
                                {safeAuditTrail.tags &&
                                    safeAuditTrail.tags.length > 0 && (
                                        <div className="bg-neutral-50 dark:bg-neutral-700/50 p-6 rounded-xl">
                                            <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-4 border-b border-neutral-200 dark:border-neutral-600 pb-3">
                                                Kategori
                                            </h3>
                                            {renderTags(safeAuditTrail.tags)}
                                        </div>
                                    )}
                            </div>
                        </div>

                        {/* Mobile Actions */}
                        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700 flex flex-col space-y-3 md:hidden">
                            {auth.user.permissions.includes(
                                "delete audit trails"
                            ) && (
                                <DangerButton
                                    onClick={openDeleteModal}
                                    className="inline-flex items-center justify-center w-full px-6 py-3"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                    Hapus Log
                                </DangerButton>
                            )}
                            <Link
                                href={route("admin.audit-trail.index")}
                                className="inline-flex items-center justify-center w-full px-6 py-3 bg-neutral-50 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-700 dark:text-neutral-300 shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Kembali ke Daftar
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
