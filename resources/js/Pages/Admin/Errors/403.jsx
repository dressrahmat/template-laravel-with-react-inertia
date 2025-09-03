import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";

const Forbidden = ({ auth }) => {
    const isLoggedIn = auth.user !== null;

    const handleRedirect = () => {
        if (isLoggedIn) {
            window.location.href = "/dashboard";
        } else {
            window.location.href = "/";
        }
    };

    const buttonText = isLoggedIn
        ? "Kembali ke Dashboard"
        : "Kembali ke Halaman Utama";

    return (
        <AdminLayout title="Akses Ditolak">
            <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
                <div className="text-center">
                    <h1 className="text-9xl font-extrabold text-gray-700 dark:text-gray-300 tracking-widest">
                        403
                    </h1>
                    <div className="bg-red-500 text-white px-2 text-sm rounded rotate-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        Akses Ditolak
                    </div>

                    <div className="mt-8 max-w-md mx-auto">
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                            Maaf, Anda tidak memiliki izin untuk mengakses
                            halaman ini.
                        </p>

                        {isLoggedIn && (
                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    Informasi Akun:
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <strong>Nama:</strong> {auth.user.name}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <strong>Email:</strong> {auth.user.email}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <strong>Roles:</strong>{" "}
                                    {auth.user.roles.join(", ") ||
                                        "Tidak ada role"}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <strong>Permissions:</strong>{" "}
                                    {auth.user.permissions.join(", ") ||
                                        "Tidak ada permission"}
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleRedirect}
                        className="mt-5 relative inline-block text-sm font-medium text-red-500 group active:text-red-600 focus:outline-none focus:ring"
                    >
                        <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-red-500 group-hover:translate-y-0 group-hover:translate-x-0"></span>
                        <span className="relative block px-8 py-3 bg-white border border-current">
                            <span className="dark:text-gray-900">
                                {buttonText}
                            </span>
                        </span>
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Forbidden;
