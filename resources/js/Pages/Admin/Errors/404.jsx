import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";

const NotFound = ({ auth }) => {
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
        <AdminLayout title="Halaman Tidak Ditemukan">
            <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
                <div className="text-center">
                    <h1 className="text-9xl font-extrabold text-gray-700 dark:text-gray-300 tracking-widest">
                        404
                    </h1>
                    <div className="bg-blue-500 text-white px-2 text-sm rounded rotate-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        Halaman Tidak Ditemukan
                    </div>
                    <button
                        onClick={handleRedirect}
                        className="mt-5 relative inline-block text-sm font-medium text-blue-500 group active:text-blue-600 focus:outline-none focus:ring"
                    >
                        <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-blue-500 group-hover:translate-y-0 group-hover:translate-x-0"></span>
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

export default NotFound;
