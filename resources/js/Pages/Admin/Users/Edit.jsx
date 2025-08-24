import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm, Link, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useToast } from '@/Contexts/ToastContext';
import TextInput from '@/Components/TextInput';
import PasswordInput from '@/Components/PasswordInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { FiUser, FiMail, FiCamera, FiX, FiTrash2 } from 'react-icons/fi';

export default function EditUser({ user }) {
    const { data, setData, errors, put, processing, reset } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        foto: null,
        remove_photo: false,
        _method: 'PUT'
    });

    const [previewUrl, setPreviewUrl] = useState(user.foto_path ? `/storage/${user.foto_path}` : null);
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

    // Clean up preview URL
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validasi file
        if (!file.type.startsWith('image/')) {
            showError('Please select an image file');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            showError('Image size must be less than 2MB');
            return;
        }

        // Upload foto secara langsung
        setPhotoUploading(true);
        
        try {
            const formData = new FormData();
            formData.append('foto', file);
            
            router.post(route('admin.users.update-photo', user.id), formData, {
                forceFormData: true,
                onSuccess: () => {
                    success('Profile photo updated successfully!');
                    
                    // Update preview
                    const url = URL.createObjectURL(file);
                    setPreviewUrl(url);
                    
                    // Reset form data untuk foto
                    setData('foto', null);
                    setData('remove_photo', false);
                    
                    // Refresh user data
                    router.reload({ only: ['user'] });
                },
                onError: (errors) => {
                    showError(errors.foto || 'Failed to upload photo');
                },
                onFinish: () => {
                    setPhotoUploading(false);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                }
            });

        } catch (error) {
            showError('Failed to upload photo');
            console.error('Upload error:', error);
            setPhotoUploading(false);
        }
    };

    const removeUploadedImage = () => {
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(user.foto_path ? `/storage/${user.foto_path}` : null);
        setData('foto', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeCurrentPhoto = () => {
        setPhotoRemoving(true);
        
        router.post(route('admin.users.remove-photo', user.id), {}, {
            onSuccess: () => {
                success('Profile photo removed successfully!');
                setPreviewUrl(null);
                setData('remove_photo', true);
                router.reload({ only: ['user'] });
            },
            onError: (errors) => {
                showError(errors.message || 'Failed to remove photo');
            },
            onFinish: () => {
                setPhotoRemoving(false);
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('password_confirmation', data.password_confirmation);
        formData.append('remove_photo', data.remove_photo);
        formData.append('_method', 'PUT');
        
        if (data.foto) {
            formData.append('foto', data.foto);
        }

        put(route('admin.users.update', user.id), formData, {
            onSuccess: () => {
                success('User updated successfully!');
                reset('password', 'password_confirmation');
            },
            onError: (errors) => {
                showError('Failed to update user. Please check the form.');
            }
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

            <div className="mx-auto px-1 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Edit User
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Update user information and permissions.
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
                                        className={`w-24 h-24 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 flex items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors ${
                                            photoUploading || photoRemoving ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                        onClick={triggerFileInput}
                                    >
                                        {photoUploading ? (
                                            <div className="text-center">
                                                <svg className="animate-spin h-8 w-8 text-gray-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    Uploading...
                                                </span>
                                            </div>
                                        ) : photoRemoving ? (
                                            <div className="text-center">
                                                <svg className="animate-spin h-8 w-8 text-gray-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                    disabled={photoUploading}
                                                >
                                                    <FiX className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : hasPhoto ? (
                                            <>
                                                <img
                                                    src={`/storage/${user.foto_path}`}
                                                    alt="Current profile"
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeCurrentPhoto();
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                    disabled={photoRemoving}
                                                >
                                                    <FiX className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="text-center">
                                                <FiCamera className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    Upload
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Upload Info */}
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {hasPhoto || hasNewPhoto ? 'Change profile photo' : 'Upload a profile photo'} (max 2MB)
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={triggerFileInput}
                                            disabled={photoUploading || photoRemoving}
                                            className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 text-sm ${
                                                photoUploading || photoRemoving
                                                    ? 'bg-gray-200 dark:bg-gray-600 cursor-not-allowed opacity-50' 
                                                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            <FiCamera className="w-4 h-4 mr-2" />
                                            {hasPhoto || hasNewPhoto ? 'Change Photo' : 'Select Photo'}
                                        </button>
                                        {hasPhoto && !hasNewPhoto && (
                                            <button
                                                type="button"
                                                onClick={removeCurrentPhoto}
                                                disabled={photoUploading || photoRemoving}
                                                className={`inline-flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-md font-medium text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 text-sm ${
                                                    photoRemoving ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                            >
                                                {photoRemoving ? (
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <FiTrash2 className="w-4 h-4 mr-2" />
                                                )}
                                                Remove
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
                                disabled={photoUploading || photoRemoving}
                            />
                            
                            <InputError message={errors.foto} />
                        </div>


                        {/* Name Field */}
                        <div>
                            <InputLabel htmlFor="name" value="Full Name" required />
                            <div className="relative">
                                <TextInput
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    error={errors.name}
                                    placeholder="Enter full name"
                                    className="pl-10"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiUser className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                            <InputError message={errors.name} />
                        </div>

                        {/* Email Field */}
                        <div>
                            <InputLabel htmlFor="email" value="Email Address" required />
                            <div className="relative">
                                <TextInput
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    error={errors.email}
                                    placeholder="Enter email address"
                                    className="pl-10"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiMail className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        {/* Password Fields */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Change Password
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                Leave these fields blank if you don't want to change the password.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="password" value="New Password" />
                                    <PasswordInput
                                        id="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        error={errors.password}
                                        placeholder="Enter new password"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                    <PasswordInput
                                        id="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Link
                                href={route('admin.users.index')}
                                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
                            >
                                Cancel
                            </Link>
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    'Update User'
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}