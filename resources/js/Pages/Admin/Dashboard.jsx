import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout'; // Pastikan path ini benar

export default function Dashboard({ auth }) {
    return (
        <AdminLayout user={auth.user} title="Dashboard">
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                        Welcome, {auth.user.name}!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        This is your admin dashboard.
                    </p>
                    
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Contoh Card */}
                        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                            <h3 className="font-medium text-blue-800 dark:text-blue-200">Total Users</h3>
                            <p className="text-2xl font-bold mt-2">1,234</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                            <h3 className="font-medium text-green-800 dark:text-green-200">Total Revenue</h3>
                            <p className="text-2xl font-bold mt-2">$12,345</p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                            <h3 className="font-medium text-purple-800 dark:text-purple-200">Active Projects</h3>
                            <p className="text-2xl font-bold mt-2">24</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}