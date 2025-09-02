import React, { useState, useEffect, useRef } from "react";
import { Head, useForm, Link, usePage, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { useToast } from "@/Contexts/ToastContext";
import TextInput from "@/Components/TextInput";
import PasswordInput from "@/Components/PasswordInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import {
    FiUser,
    FiMail,
    FiCamera,
    FiX,
    FiTrash2,
    FiShield,
} from "react-icons/fi";

export default function EditUser({ user, roles }) {
    // Pastikan user.roles adalah array dan ekstrak hanya nama roles
    const initialRoles = Array.isArray(user.roles)
        ? user.roles.map((role) =>
              typeof role === "object" ? role.name : role
          )
        : [];

    const { data, setData, errors, put, processing, reset } = useForm({
        name: user.name,
        email: user.email,
        password: "",
        password_confirmation: "",
        foto: null,
        remove_photo: false,
        roles: initialRoles,
        _method: "PUT",
    });

    // Fungsi untuk mendapatkan URL foto - SAMA DENGAN SHOW COMPONENT
    const getPhotoUrl = () => {
        if (user.foto_path && !data.remove_photo) {
            return `/storage/${user.foto_path}`;
        }
        return null;
    };

    const [previewUrl, setPreviewUrl] = useState(getPhotoUrl());
    const [photoUploading, setPhotoUploading] = useState(false);
    const [photoRemoving, setPhotoRemoving] = useState(false);
    const fileInputRef = useRef(null);
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

    // Update previewUrl ketika user.foto_path berubah atau remove_photo berubah
    useEffect(() => {
        if (!data.foto && !previewUrl?.startsWith("blob:")) {
            setPreviewUrl(getPhotoUrl());
        }
    }, [user.foto_path, data.remove_photo]);

    // Clean up preview URL
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validasi file
        if (!file.type.startsWith("image/")) {
            showError("Please select an image file");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            showError("Image size must be less than 2MB");
            return;
        }

        // Upload foto secara langsung
        setPhotoUploading(true);

        try {
            const formData = new FormData();
            formData.append("foto", file);

            router.post(route("admin.users.update-photo", user.id), formData, {
                forceFormData: true,
                onSuccess: () => {
                    success("Profile photo updated successfully!");

                    // Update preview
                    const url = URL.createObjectURL(file);
                    setPreviewUrl(url);

                    // Reset form data untuk foto
                    setData("foto", null);
                    setData("remove_photo", false);

                    // Refresh user data
                    router.reload({ only: ["user"] });
                },
                onError: (errors) => {
                    showError(errors.foto || "Failed to upload photo");
                },
                onFinish: () => {
                    setPhotoUploading(false);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                },
            });
        } catch (error) {
            showError("Failed to upload photo");
            console.error("Upload error:", error);
            setPhotoUploading(false);
        }
    };

    const removeUploadedImage = () => {
        if (previewUrl && previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }
        // Kembali ke foto yang tersimpan di database
        setPreviewUrl(getPhotoUrl());
        setData("foto", null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeCurrentPhoto = () => {
        setPhotoRemoving(true);

        router.post(
            route("admin.users.remove-photo", user.id),
            {},
            {
                onSuccess: () => {
                    success("Profile photo removed successfully!");
                    setPreviewUrl(null);
                    setData("remove_photo", true);
                    router.reload({ only: ["user"] });
                },
                onError: (errors) => {
                    showError(errors.message || "Failed to remove photo");
                },
                onFinish: () => {
                    setPhotoRemoving(false);
                },
            }
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("password_confirmation", data.password_confirmation);
        formData.append("remove_photo", data.remove_photo ? "1" : "0");
        formData.append("_method", "PUT");

        // Tambahkan roles sebagai array
        if (Array.isArray(data.roles)) {
            data.roles.forEach((role) => formData.append("roles[]", role));
        }

        if (data.foto) {
            formData.append("foto", data.foto);
        }

        put(route("admin.users.update", user.id), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                success("User updated successfully!");
                reset("password", "password_confirmation");
            },
            onError: (errors) => {
                showError("Failed to update user. Please check the form.");
            },
        });
    };

    const triggerFileInput = () => {
        if (!photoUploading && !photoRemoving) {
            fileInputRef.current?.click();
        }
    };

    const hasPhoto = user.foto_path && !data.remove_photo;
    const hasNewPhoto = data.foto;

    return (
        <AdminLayout title="Edit User">
            <Head title="Edit User" />

            <div className="mx-auto px-1 lg:px-4 lg:pt-2">
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl shadow-card p-6 sm:p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            Edit User: {user.name}
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                            Update user information, roles, and permissions.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Photo Upload */}
                        <div>
                            <InputLabel htmlFor="foto" value="Profile Photo" />
                            <div className="flex items-center gap-6">
                                {/* Preview Area */}
                                <div className="relative">
                                    <div
                                        className={`w-24 h-24 rounded-full border-2 border-dashed border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 flex items-center justify-center cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors ${
                                            photoUploading || photoRemoving
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                        onClick={triggerFileInput}
                                    >
                                        {photoUploading ? (
                                            <div className="text-center">
                                                <svg
                                                    className="animate-spin h-8 w-8 text-neutral-400 mx-auto"
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
                                                <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                                    Uploading...
                                                </span>
                                            </div>
                                        ) : photoRemoving ? (
                                            <div className="text-center">
                                                <svg
                                                    className="animate-spin h-8 w-8 text-neutral-400 mx-auto"
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
                                                <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                                    Removing...
                                                </span>
                                            </div>
                                        ) : previewUrl ? (
                                            <>
                                                <img
                                                    src={previewUrl}
                                                    alt="Profile preview"
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeUploadedImage();
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-error-500 text-white rounded-full p-1 hover:bg-error-600 transition-colors"
                                                    disabled={photoUploading}
                                                >
                                                    <FiX className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="text-center">
                                                <FiCamera className="w-8 h-8 text-neutral-400 mx-auto mb-1" />
                                                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    Upload
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Upload Info */}
                                <div className="flex-1">
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                                        {hasPhoto || hasNewPhoto
                                            ? "Change profile photo (max 2MB)"
                                            : "Upload a profile photo (max 2MB)"}
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={triggerFileInput}
                                            className="inline-flex items-center px-4 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-800 text-sm"
                                            disabled={
                                                photoUploading || photoRemoving
                                            }
                                        >
                                            <FiCamera className="w-4 h-4 mr-2" />
                                            {hasPhoto || hasNewPhoto
                                                ? "Change Photo"
                                                : "Select Photo"}
                                        </button>
                                        {(hasPhoto || hasNewPhoto) && (
                                            <button
                                                type="button"
                                                onClick={removeCurrentPhoto}
                                                className="inline-flex items-center px-4 py-2 bg-error-100 dark:bg-error-900/30 border border-error-300 dark:border-error-700 rounded-md font-medium text-error-700 dark:text-error-300 hover:bg-error-200 dark:hover:bg-error-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-800 text-sm"
                                                disabled={
                                                    photoUploading ||
                                                    photoRemoving
                                                }
                                            >
                                                <FiTrash2 className="w-4 h-4 mr-2" />
                                                Remove Photo
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="foto"
                                name="foto"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <InputError message={errors.foto} />
                        </div>

                        {/* Name Field */}
                        <div>
                            <InputLabel
                                htmlFor="name"
                                value="Full Name"
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
                                    placeholder="Enter full name"
                                    className="pl-10"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiUser className="h-5 w-5 text-primary-400" />
                                </div>
                            </div>
                            <InputError message={errors.name} />
                        </div>

                        {/* Email Field */}
                        <div>
                            <InputLabel
                                htmlFor="email"
                                value="Email Address"
                                required
                            />
                            <div className="relative">
                                <TextInput
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    error={errors.email}
                                    placeholder="Enter email address"
                                    className="pl-10"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiMail className="h-5 w-5 text-primary-400" />
                                </div>
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        {/* Roles Field */}
                        <div>
                            <InputLabel htmlFor="roles" value="User Roles" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                                {roles &&
                                    roles.map((role) => (
                                        <label
                                            key={role}
                                            className="flex items-center p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    Array.isArray(data.roles) &&
                                                    data.roles.includes(role)
                                                }
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setData("roles", [
                                                            ...(data.roles ||
                                                                []),
                                                            role,
                                                        ]);
                                                    } else {
                                                        setData(
                                                            "roles",
                                                            (
                                                                data.roles || []
                                                            ).filter(
                                                                (r) =>
                                                                    r !== role
                                                            )
                                                        );
                                                    }
                                                }}
                                                className="rounded border-neutral-300 text-primary-600 shadow-sm focus:ring-primary-500"
                                            />
                                            <span className="ml-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                {role}
                                            </span>
                                        </label>
                                    ))}
                            </div>
                            <InputError message={errors.roles} />
                        </div>

                        {/* Password Section */}
                        <div className="bg-neutral-50 dark:bg-neutral-700/50 p-2 rounded-xl">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                                Update Password
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                                Leave blank to keep the current password.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel
                                        htmlFor="password"
                                        value="New Password"
                                    />
                                    <PasswordInput
                                        id="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        error={errors.password}
                                        placeholder="Enter new password"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Confirm New Password"
                                    />
                                    <PasswordInput
                                        id="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Confirm new password"
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                            <Link
                                href={route("admin.users.index")}
                                className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors duration-200 font-medium"
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
                                        Updating...
                                    </>
                                ) : (
                                    "Update User"
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
