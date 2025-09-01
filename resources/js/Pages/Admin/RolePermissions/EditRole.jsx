import React, { useState, useEffect } from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { useToast } from "@/Contexts/ToastContext";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { FiShield, FiList } from "react-icons/fi";
import PermissionCheckboxGroup from "@/Components/PermissionCheckboxGroup";

export default function EditRole({ role, permissions: allPermissions }) {
    const { data, setData, errors, put, processing } = useForm({
        name: role.name,
        permissions: role.permissions.map((p) => p.name),
    });

    const safePermissions = Array.isArray(allPermissions) ? allPermissions : [];
    const { success, error: showError } = useToast();
    const { props: pageProps } = usePage();
    const flash = pageProps.flash || {};

    useEffect(() => {
        if (flash.success) {
            success(flash.success);
        }
        if (flash.error) {
            showError(flash.error);
        }
    }, [flash]);

    const handlePermissionChange = (permissionName, isChecked) => {
        setData((prevData) => {
            const permissions = new Set(prevData.permissions);

            if (isChecked) {
                permissions.add(permissionName);
            } else {
                permissions.delete(permissionName);
            }

            return {
                ...prevData,
                permissions: Array.from(permissions),
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.roles.update", role.id), {
            onSuccess: () => {
                success("Role updated successfully!");
            },
            onError: (errors) => {
                showError("Failed to update role. Please check the form.");
            },
        });
    };

    return (
        <AdminLayout title="Edit Role">
            <Head title="Edit Role" />

            <div className="mx-auto px-3 py-1">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Edit Role
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Update role information and permissions.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <InputLabel
                                htmlFor="name"
                                value="Role Name"
                                required
                            />
                            <div className="relative">
                                <TextInput
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    error={errors.name}
                                    placeholder="Enter role name"
                                    icon={FiShield}
                                    className="pl-10"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiShield className="h-5 w-5 text-orange-400" />
                                </div>
                            </div>
                            <InputError message={errors.name} />
                        </div>

                        {/* Permissions Section */}
                        <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Permissions
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                                Select the permissions this role should have.
                            </p>

                            <PermissionCheckboxGroup
                                permissions={safePermissions} // Gunakan safePermissions di sini
                                selectedPermissions={data.permissions}
                                onChange={handlePermissionChange}
                            />

                            <InputError message={errors.permissions} />
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Link
                                href={route("admin.role-permissions.index", {
                                    type: "roles",
                                })}
                                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
                            >
                                Cancel
                            </Link>
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
                            >
                                {processing ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    "Update Role"
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
