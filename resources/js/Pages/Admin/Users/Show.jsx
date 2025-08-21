import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';

export default function ShowUser({ user }) {
    return (
        <AdminLayout title="User Details">
            <Head title="User Details" />

            <div className="mx-auto px-1 lg:px-8">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
                    {/* Header dengan gradient */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white">
                        <h2 className="text-2xl font-bold">User Details</h2>
                        <p className="text-blue-100 opacity-90 mt-1">Detailed information about the user account</p>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Card untuk informasi user */}
                            <div className="bg-slate-50 dark:bg-slate-700/30 p-5 rounded-xl">
                                <div className="flex items-center mb-5">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-lg">{user.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Registered User</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
                                        <p className="text-lg font-medium text-gray-900 dark:text-white">{user.name}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email Address</label>
                                        <p className="text-lg font-medium text-gray-900 dark:text-white">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card untuk metadata user */}
                            <div className="bg-slate-50 dark:bg-slate-700/30 p-5 rounded-xl">
                                <h3 className="font-semibold text-lg mb-5 text-gray-900 dark:text-white">Account Information</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">User ID</label>
                                        <p className="text-lg font-medium text-gray-900 dark:text-white">#{user.id}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Joined Date</label>
                                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                                            {new Date(user.created_at).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Account Status</label>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            Active
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col-reverse sm:flex-row justify-end space-y-4 space-y-reverse sm:space-y-0 sm:space-x-4">
                            <Link
                                href={route('admin.users.index')}
                                className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to List
                            </Link>
                            <div className="flex space-x-3">
                                <Link href={route('admin.users.edit', user.id)}>
                                    <PrimaryButton className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit User
                                    </PrimaryButton>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}