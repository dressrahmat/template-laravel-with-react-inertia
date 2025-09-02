import React, { useState, useEffect } from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { useToast } from "@/Contexts/ToastContext";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { FiKey, FiFileText } from "react-icons/fi";

export default function CreatePermission() {
    const { data, setData, errors, post, processing } = useForm({
        name: "",
        description: "",
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.permissions.store"), {
            onSuccess: () => {
                success("Permission created successfully!");
            },
            onError: (errors) => {
                showError(
                    "Failed to create permission. Please check the form."
                );
            },
        });
    };

    return (
        <AdminLayout title="Create Permission">
            <Head title="Create Permission" />
            <div className="mx-auto px-1 lg:px-4 lg:pt-2">
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl shadow-card p-6 sm:p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            Create New Permission
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                            Add a new permission that can be assigned to roles
                            in your system.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <InputLabel
                                htmlFor="name"
                                value="Permission Name"
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
                                    placeholder="Enter permission name (e.g., users.create)"
                                    className="pl-10"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiKey className="h-5 w-5 text-accent-400" />
                                </div>
                            </div>
                            <InputError message={errors.name} />
                            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                Use dot notation for better organization (e.g.,
                                users.create, users.edit, posts.delete)
                            </p>
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="description"
                                value="Description (Optional)"
                            />
                            <div className="relative">
                                <TextArea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    error={errors.description}
                                    placeholder="Enter permission description"
                                    rows={3}
                                />
                            </div>
                            <InputError message={errors.description} />
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                            <Link
                                href={route("admin.role-permissions.index", {
                                    type: "permissions",
                                })}
                                className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors duration-200 font-medium"
                            >
                                Cancel
                            </Link>
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-accent-600 hover:bg-accent-700 focus:ring-accent-500"
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
                                    "Create Permission"
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
