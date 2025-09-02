import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import ConfirmationModal from "@/Components/ConfirmationModal";
import { useToast } from "@/Contexts/ToastContext";

export default function ShowUser({ user }) {
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        userId: null,
        userName: "",
    });
    const { success, error } = useToast();

    const openDeleteModal = () => {
        setDeleteModal({
            isOpen: true,
            userId: user.id,
            userName: user.name,
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            userId: null,
            userName: "",
        });
    };

    const handleDelete = () => {
        if (deleteModal.userId) {
            router.delete(route("admin.users.destroy", deleteModal.userId), {
                onSuccess: () => {
                    success("User deleted successfully!");
                    closeDeleteModal();
                },
                onError: () => {
                    error("Failed to delete user.");
                    closeDeleteModal();
                },
            });
        } else {
            closeDeleteModal();
        }
    };

    // Fungsi untuk mendapatkan URL foto
    const getPhotoUrl = () => {
        if (user.foto_path) {
            return `/storage/${user.foto_path}`;
        }
        return null;
    };

    const photoUrl = getPhotoUrl();

    return (
        <AdminLayout title="User Details">
            <Head title="User Details" />

            {/* Confirmation Modal for delete */}
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                title="Confirm Delete"
                message={`Are you sure you want to delete user "${deleteModal.userName}"? This action cannot be undone.`}
                confirmText="Delete User"
                cancelText="Cancel"
            />

            <div className="mx-auto px-1 lg:px-4 lg:pt-2">
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl shadow-card overflow-hidden">
                    {/* Header dengan gradient dan tombol action */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5 text-white flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h2 className="text-2xl font-bold">User Details</h2>
                            <p className="text-primary-100 opacity-90 mt-1">
                                Detailed information about the user account and
                                roles
                            </p>
                        </div>

                        {/* Tombol Action di Kanan Atas (Desktop Only) */}
                        <div className="hidden md:flex items-center space-x-3">
                            {/* Tombol Back to List */}
                            <Link
                                href={route("admin.users.index")}
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
                                Back
                            </Link>

                            {/* Tombol Edit User */}
                            <Link href={route("admin.users.edit", user.id)}>
                                <PrimaryButton className="flex items-center px-4 py-2">
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
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                    Edit
                                </PrimaryButton>
                            </Link>

                            {/* Tombol Delete User */}
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
                                Delete
                            </DangerButton>
                        </div>
                    </div>

                    <div className="p-4 md:p-8">
                        <div className="flex flex-col md:flex-row gap-6 mb-8">
                            {/* Foto Profil - Sesuai dengan struktur Edit */}
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    {photoUrl ? (
                                        <img
                                            src={photoUrl}
                                            alt={user.name}
                                            className="w-32 h-32 rounded-full object-cover border-4 border-neutral-50 dark:border-neutral-700 shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-4xl border-4 border-neutral-50 dark:border-neutral-700 shadow-lg">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 right-0 bg-success-500 rounded-full p-1.5 border-2 border-neutral-50 dark:border-neutral-800">
                                        <div className="w-4 h-4 rounded-full bg-success-400"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Informasi User */}
                            <div className="flex-grow">
                                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                                    {user.name}
                                </h1>
                                <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-4">
                                    {user.email}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                                        Active User
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                                        Member since{" "}
                                        {new Date(
                                            user.created_at
                                        ).getFullYear()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Card untuk informasi user */}
                            <div className="bg-neutral-50 dark:bg-neutral-700/50 p-3 rounded-xl">
                                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-5 border-b border-neutral-200 dark:border-neutral-600 pb-3">
                                    Personal Information
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                            Full Name
                                        </label>
                                        <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                            {user.name}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                            Email Address
                                        </label>
                                        <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                            {user.email}
                                        </p>
                                    </div>

                                    {user.phone && (
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                Phone Number
                                            </label>
                                            <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                                {user.phone}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card untuk metadata user */}
                            <div className="bg-neutral-50 dark:bg-neutral-700/50 p-3 rounded-xl">
                                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-5 border-b border-neutral-200 dark:border-neutral-600 pb-3">
                                    Account Information
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                            User ID
                                        </label>
                                        <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                            #{user.id}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                            Joined Date
                                        </label>
                                        <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                            {new Date(
                                                user.created_at
                                            ).toLocaleDateString("id-ID", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                            Last Updated
                                        </label>
                                        <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                            {new Date(
                                                user.updated_at
                                            ).toLocaleDateString("id-ID", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                            Account Status
                                        </label>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200">
                                            Active
                                        </span>
                                    </div>

                                    {/* Informasi Foto */}
                                    {user.foto_path && (
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                Profile Photo
                                            </label>
                                            <p className="text-sm text-neutral-900 dark:text-white break-all">
                                                {user.foto_path}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card untuk roles */}
                            {user.roles && user.roles.length > 0 && (
                                <div className="bg-neutral-50 dark:bg-neutral-700/50 p-3 rounded-xl md:col-span-2">
                                    <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-5 border-b border-neutral-200 dark:border-neutral-600 pb-3">
                                        User Roles
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {user.roles.map((role, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                                            >
                                                {role.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tombol Back to List, Edit, dan Delete untuk mobile - di bagian bawah */}
                        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700 flex flex-col space-y-3 md:hidden">
                            <Link
                                href={route("admin.users.edit", user.id)}
                                className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
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
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                                Edit User
                            </Link>

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
                                Delete User
                            </DangerButton>

                            <Link
                                href={route("admin.users.index")}
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
                                Back to List
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
