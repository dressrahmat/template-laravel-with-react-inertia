import React, { useState, useEffect } from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { useToast } from "@/Contexts/ToastContext";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { FiShield, FiCheckSquare, FiSquare } from "react-icons/fi";

export default function CreateRole() {
    const { permissions: initialPermissions } = usePage().props;
    const { data, setData, errors, post, processing } = useForm({
        name: "",
        permissions: [],
    });

    const [permissions, setPermissions] = useState(initialPermissions || {});
    const [selectedPermissions, setSelectedPermissions] = useState({});

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

    const togglePermission = (permissionName) => {
        setSelectedPermissions((prev) => {
            const newSelected = { ...prev };
            if (newSelected[permissionName]) {
                delete newSelected[permissionName];
            } else {
                newSelected[permissionName] = true;
            }
            return newSelected;
        });

        setData("permissions", Object.keys(selectedPermissions));
    };

    const toggleAllInGroup = (groupName) => {
        const groupPermissions = permissions[groupName] || [];
        const allSelected = groupPermissions.every(
            (permission) => selectedPermissions[permission.name]
        );

        setSelectedPermissions((prev) => {
            const newSelected = { ...prev };
            groupPermissions.forEach((permission) => {
                if (allSelected) {
                    delete newSelected[permission.name];
                } else {
                    newSelected[permission.name] = true;
                }
            });
            return newSelected;
        });

        setData("permissions", Object.keys(selectedPermissions));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.roles.store"), {
            onSuccess: () => {
                success("Role created successfully!");
            },
            onError: (errors) => {
                showError("Failed to create role. Please check the form.");
            },
        });
    };

    return (
        <AdminLayout title="Create Role">
            <Head title="Create Role" />
            <div className="mx-auto px-1 lg:px-4 lg:pt-2">
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl shadow-card p-6 sm:p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            Create New Role
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                            Add a new role with specific permissions for your
                            system.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                    className="pl-10"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiShield className="h-5 w-5 text-primary-400" />
                                </div>
                            </div>
                            <InputError message={errors.name} />
                        </div>
                        <div>
                            <InputLabel value="Permissions" className="mb-4" />
                            <div className="space-y-6">
                                {Object.entries(permissions).map(
                                    ([groupName, groupPermissions]) => (
                                        <div
                                            key={groupName}
                                            className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-medium text-neutral-900 dark:text-white capitalize">
                                                    {groupName} Permissions
                                                </h3>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleAllInGroup(
                                                            groupName
                                                        )
                                                    }
                                                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                                                >
                                                    Select All
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {groupPermissions.map(
                                                    (permission) => (
                                                        <label
                                                            key={permission.id}
                                                            className="flex items-center p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    !!selectedPermissions[
                                                                        permission
                                                                            .name
                                                                    ]
                                                                }
                                                                onChange={() =>
                                                                    togglePermission(
                                                                        permission.name
                                                                    )
                                                                }
                                                                className="hidden"
                                                            />
                                                            {selectedPermissions[
                                                                permission.name
                                                            ] ? (
                                                                <FiCheckSquare className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
                                                            ) : (
                                                                <FiSquare className="h-5 w-5 text-neutral-400 mr-2" />
                                                            )}
                                                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                                                {
                                                                    permission.name
                                                                }
                                                            </span>
                                                        </label>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                            <InputError message={errors.permissions} />
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                            <Link
                                href={route("admin.role-permissions.index", {
                                    type: "roles",
                                })}
                                className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors duration-200 font-medium"
                            >
                                Cancel
                            </Link>
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 focus:ring-primary-500"
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
                                        Creating...
                                    </>
                                ) : (
                                    "Create Role"
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
