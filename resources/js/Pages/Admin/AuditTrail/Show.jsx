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
        table_display_name:
            auditTrail?.table_display_name || "Tabel tidak diketahui",
        message: auditTrail?.message || "Aktivitas tidak diketahui",
        user: auditTrail?.user || null,
        old_values: auditTrail?.old_values || null,
        new_values: auditTrail?.new_values || null,
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
            auditTrailDescription: safeAuditTrail.message,
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
                route("admin.audit-trail.cleanup"),
                {
                    days: 0,
                    id: deleteModal.auditTrailId,
                },
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

    // Gunakan safeAuditTrail instead of auditTrail langsung
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
                                "manage audit trail"
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
                        <div className="flex flex-col mb-8">
                            <div className="flex items-center mb-4">
                                <div
                                    className={`w-3 h-3 rounded-full mr-3 bg-${safeAuditTrail.event_color}-500`}
                                ></div>
                                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    {availableEvents[safeAuditTrail.event] ||
                                        safeAuditTrail.event}
                                </h1>
                            </div>
                            <p className="text-lg text-neutral-600 dark:text-neutral-300">
                                {safeAuditTrail.message}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-neutral-50 dark:bg-neutral-700/50 p-3 rounded-xl">
                                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-5 border-b border-neutral-200 dark:border-neutral-600 pb-3">
                                    Informasi Audit
                                </h3>
                                <div className="space-y-4">
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
                                        <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                            {availableEvents[
                                                safeAuditTrail.event
                                            ] || safeAuditTrail.event}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                            Tabel
                                        </label>
                                        <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                            {safeAuditTrail.table_display_name}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                            Pengguna
                                        </label>
                                        <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                            {safeAuditTrail.user
                                                ? safeAuditTrail.user.name
                                                : "Sistem"}
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
                                                          month: "short",
                                                          day: "numeric",
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      }
                                                  )
                                                : "Waktu tidak tersedia"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {(safeAuditTrail.old_values ||
                                safeAuditTrail.new_values) && (
                                <div className="bg-neutral-50 dark:bg-neutral-700/50 p-3 rounded-xl">
                                    <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-5 border-b border-neutral-200 dark:border-neutral-600 pb-3">
                                        Perubahan Data
                                    </h3>
                                    <div className="space-y-4">
                                        {safeAuditTrail.old_values && (
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                    Nilai Lama
                                                </label>
                                                <pre className="text-sm text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 p-3 rounded-md overflow-auto">
                                                    {JSON.stringify(
                                                        safeAuditTrail.old_values,
                                                        null,
                                                        2
                                                    )}
                                                </pre>
                                            </div>
                                        )}
                                        {safeAuditTrail.new_values && (
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                    Nilai Baru
                                                </label>
                                                <pre className="text-sm text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 p-3 rounded-md overflow-auto">
                                                    {JSON.stringify(
                                                        safeAuditTrail.new_values,
                                                        null,
                                                        2
                                                    )}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700 flex flex-col space-y-3 md:hidden">
                            {auth.user.permissions.includes(
                                "manage audit trail"
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
