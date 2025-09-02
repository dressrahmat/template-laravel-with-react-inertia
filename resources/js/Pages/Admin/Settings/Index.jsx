import React, { useState, useEffect, useRef } from "react";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { useToast } from "@/Contexts/ToastContext";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import ToggleSwitch from "@/Components/ToggleSwitch";
import {
    FiGlobe,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCamera,
    FiX,
    FiCode,
    FiShield,
    FiBarChart2,
    FiFacebook,
    FiTwitter,
    FiInstagram,
    FiYoutube,
    FiLinkedin,
    FiEdit3,
} from "react-icons/fi";

export default function IndexSetting({ settings }) {
    const { data, setData, errors, put, processing, reset } = useForm({
        // Informasi Dasar Website
        site_name: settings.site_name || "",
        site_description: settings.site_description || "",
        contact_email: settings.contact_email || "",
        contact_phone: settings.contact_phone || "",
        address: settings.address || "",

        // Logo & Favicon
        site_logo: null,
        site_favicon: null,
        og_image: null,

        // Google Analytics
        google_analytics_id: settings.google_analytics_id || "",
        google_analytics_enabled: settings.google_analytics_enabled || false,

        // Google Tag Manager
        google_tag_manager_id: settings.google_tag_manager_id || "",
        google_tag_manager_enabled:
            settings.google_tag_manager_enabled || false,

        // Facebook Pixel
        facebook_pixel_id: settings.facebook_pixel_id || "",
        facebook_pixel_enabled: settings.facebook_pixel_enabled || false,

        // Google Adsense
        google_adsense_id: settings.google_adsense_id || "",
        google_adsense_code: settings.google_adsense_code || "",
        google_adsense_enabled: settings.google_adsense_enabled || false,

        // Social Media
        facebook_url: settings.facebook_url || "",
        twitter_url: settings.twitter_url || "",
        instagram_url: settings.instagram_url || "",
        youtube_url: settings.youtube_url || "",
        linkedin_url: settings.linkedin_url || "",

        // SEO Settings
        meta_keywords: settings.meta_keywords || "",
        meta_author: settings.meta_author || "",

        // Scripts
        header_scripts: settings.header_scripts || "",
        body_scripts: settings.body_scripts || "",
        footer_scripts: settings.footer_scripts || "",

        // Maintenance
        maintenance_mode: settings.maintenance_mode || false,
        maintenance_message: settings.maintenance_message || "",
    });

    const [logoPreview, setLogoPreview] = useState(
        settings.site_logo ? `/storage/${settings.site_logo}` : null
    );
    const [faviconPreview, setFaviconPreview] = useState(
        settings.site_favicon ? `/storage/${settings.site_favicon}` : null
    );
    const [ogImagePreview, setOgImagePreview] = useState(
        settings.og_image ? `/storage/${settings.og_image}` : null
    );

    const logoInputRef = useRef(null);
    const faviconInputRef = useRef(null);
    const ogImageInputRef = useRef(null);

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

    const uploadLogo = async (file) => {
        const formData = new FormData();
        formData.append("site_logo", file);

        try {
            const response = await axios.post(
                route("admin.settings.upload-logo"),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) {
                success("Logo uploaded successfully!");
                return response.data.path;
            }
        } catch (error) {
            showError("Failed to upload logo");
            throw error;
        }
    };

    const uploadFavicon = async (file) => {
        const formData = new FormData();
        formData.append("site_favicon", file);

        try {
            const response = await axios.post(
                route("admin.settings.upload-favicon"),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) {
                success("Favicon uploaded successfully!");
                return response.data.path;
            }
        } catch (error) {
            showError("Failed to upload favicon");
            throw error;
        }
    };

    const uploadOgImage = async (file) => {
        const formData = new FormData();
        formData.append("og_image", file);

        try {
            const response = await axios.post(
                route("admin.settings.upload-og-image"),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) {
                success("OG Image uploaded successfully!");
                return response.data.path;
            }
        } catch (error) {
            showError("Failed to upload OG Image");
            throw error;
        }
    };

    // Update handleImageChange untuk menggunakan fungsi upload individual
    const handleImageChange = async (file, type) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showError("Please select an image file");
            return;
        }

        // Validasi ukuran file berdasarkan tipe
        const maxSize = type === "favicon" ? 1 * 1024 * 1024 : 2 * 1024 * 1024;
        if (file.size > maxSize) {
            showError(
                `Image size must be less than ${maxSize / 1024 / 1024}MB`
            );
            return;
        }

        // Validasi format untuk favicon
        if (
            type === "favicon" &&
            !file.type.includes("ico") &&
            !file.type.includes("png")
        ) {
            showError("Favicon must be in ICO or PNG format");
            return;
        }

        try {
            let uploadedPath;
            switch (type) {
                case "logo":
                    uploadedPath = await uploadLogo(file);
                    break;
                case "favicon":
                    uploadedPath = await uploadFavicon(file);
                    break;
                case "og_image":
                    uploadedPath = await uploadOgImage(file);
                    break;
            }

            // Update preview
            const url = URL.createObjectURL(file);
            switch (type) {
                case "logo":
                    setLogoPreview(url);
                    break;
                case "favicon":
                    setFaviconPreview(url);
                    break;
                case "og_image":
                    setOgImagePreview(url);
                    break;
            }
        } catch (error) {
            console.error("Upload error:", error);
        }
    };

    const removeImage = async (type) => {
        try {
            await router.delete(route("admin.settings.removeImage", { type }));

            switch (type) {
                case "logo":
                    setLogoPreview(null);
                    setData("site_logo", null);
                    break;
                case "favicon":
                    setFaviconPreview(null);
                    setData("site_favicon", null);
                    break;
                case "og_image":
                    setOgImagePreview(null);
                    setData("og_image", null);
                    break;
            }

            success(`${type.replace("_", " ")} removed successfully!`);
        } catch (error) {
            showError(`Failed to remove ${type}`);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route("admin.settings.update"), {
            // Inertia akan otomatis menangani FormData jika ada file
            data: {
                ...data,
                // Konversi boolean ke integer untuk memastikan terkirim
                google_analytics_enabled: data.google_analytics_enabled ? 1 : 0,
                google_tag_manager_enabled: data.google_tag_manager_enabled
                    ? 1
                    : 0,
                facebook_pixel_enabled: data.facebook_pixel_enabled ? 1 : 0,
                google_adsense_enabled: data.google_adsense_enabled ? 1 : 0,
                maintenance_mode: data.maintenance_mode ? 1 : 0,
            },
            onSuccess: () => {
                success("Settings updated successfully!");
                setData("site_logo", null);
                setData("site_favicon", null);
                setData("og_image", null);
            },
            onError: (errors) => {
                showError("Failed to update settings. Please check the form.");
            },
        });
    };

    const ImageUploadField = ({
        title,
        preview,
        onFileChange,
        onRemove,
        inputRef,
        type,
        accept,
        description,
    }) => (
        <div>
            <InputLabel value={title} />
            <div className="flex items-center gap-6 mt-2">
                <div className="relative">
                    <div
                        className={`w-24 h-24 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 flex items-center justify-center cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors`}
                        onClick={() => inputRef.current?.click()}
                    >
                        {preview ? (
                            <>
                                <img
                                    src={preview}
                                    alt={title}
                                    className="w-full h-full rounded-lg object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemove();
                                    }}
                                    className="absolute -top-2 -right-2 bg-error-500 text-white rounded-full p-1 hover:bg-error-600 transition-colors"
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
                <div className="flex-1">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                        {description}
                    </p>
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="inline-flex items-center px-4 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-800 text-sm"
                    >
                        <FiCamera className="w-4 h-4 mr-2" />
                        Select {title}
                    </button>
                </div>
            </div>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={(e) => onFileChange(e.target.files[0])}
                className="hidden"
            />
        </div>
    );

    return (
        <AdminLayout title="Website Settings">
            <Head title="Website Settings" />

            <div className="mx-auto px-1 lg:px-4 lg:pt-2">
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl shadow-card p-6 sm:p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                            <FiGlobe className="w-6 h-6" />
                            Website Settings
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                            Manage your website configuration, analytics, and
                            marketing integrations.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information Section */}
                        <div className="bg-white dark:bg-neutral-700/50 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                                <FiEdit3 className="w-5 h-5" />
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel
                                        htmlFor="site_name"
                                        value="Site Name"
                                        required
                                    />
                                    <TextInput
                                        id="site_name"
                                        value={data.site_name}
                                        onChange={(e) =>
                                            setData("site_name", e.target.value)
                                        }
                                        error={errors.site_name}
                                        placeholder="Enter site name"
                                    />
                                    <InputError message={errors.site_name} />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="contact_email"
                                        value="Contact Email"
                                    />
                                    <div className="relative">
                                        <TextInput
                                            id="contact_email"
                                            type="email"
                                            value={data.contact_email}
                                            onChange={(e) =>
                                                setData(
                                                    "contact_email",
                                                    e.target.value
                                                )
                                            }
                                            error={errors.contact_email}
                                            placeholder="Enter contact email"
                                            className="pl-10"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiMail className="h-5 w-5 text-primary-400" />
                                        </div>
                                    </div>
                                    <InputError
                                        message={errors.contact_email}
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="contact_phone"
                                        value="Contact Phone"
                                    />
                                    <div className="relative">
                                        <TextInput
                                            id="contact_phone"
                                            value={data.contact_phone}
                                            onChange={(e) =>
                                                setData(
                                                    "contact_phone",
                                                    e.target.value
                                                )
                                            }
                                            error={errors.contact_phone}
                                            placeholder="Enter contact phone"
                                            className="pl-10"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiPhone className="h-5 w-5 text-primary-400" />
                                        </div>
                                    </div>
                                    <InputError
                                        message={errors.contact_phone}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <InputLabel
                                        htmlFor="site_description"
                                        value="Site Description"
                                    />
                                    <textarea
                                        id="site_description"
                                        value={data.site_description}
                                        onChange={(e) =>
                                            setData(
                                                "site_description",
                                                e.target.value
                                            )
                                        }
                                        rows={3}
                                        className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-600 dark:text-white"
                                        placeholder="Enter site description"
                                    />
                                    <InputError
                                        message={errors.site_description}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <InputLabel
                                        htmlFor="address"
                                        value="Address"
                                    />
                                    <div className="relative">
                                        <textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    "address",
                                                    e.target.value
                                                )
                                            }
                                            rows={2}
                                            className="w-full px-4 py-2 pl-10 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-600 dark:text-white"
                                            placeholder="Enter address"
                                        />
                                        <div className="absolute top-3 left-3 pointer-events-none">
                                            <FiMapPin className="h-5 w-5 text-primary-400" />
                                        </div>
                                    </div>
                                    <InputError message={errors.address} />
                                </div>
                            </div>
                        </div>

                        {/* Logo & Images Section */}
                        <div className="bg-white dark:bg-neutral-700/50 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                                Logo & Images
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <ImageUploadField
                                    title="Site Logo"
                                    preview={logoPreview}
                                    onFileChange={(file) =>
                                        handleImageChange(file, "logo")
                                    }
                                    onRemove={() => removeImage("logo")}
                                    inputRef={logoInputRef}
                                    type="logo"
                                    accept="image/*"
                                    description="Recommended: 200x200px PNG/JPG (max 2MB)"
                                />
                                <ImageUploadField
                                    title="Favicon"
                                    preview={faviconPreview}
                                    onFileChange={(file) =>
                                        handleImageChange(file, "favicon")
                                    }
                                    onRemove={() => removeImage("favicon")}
                                    inputRef={faviconInputRef}
                                    type="favicon"
                                    accept=".ico,.png"
                                    description="Recommended: 32x32px ICO/PNG (max 1MB)"
                                />
                                <ImageUploadField
                                    title="OG Image"
                                    preview={ogImagePreview}
                                    onFileChange={(file) =>
                                        handleImageChange(file, "og_image")
                                    }
                                    onRemove={() => removeImage("og_image")}
                                    inputRef={ogImageInputRef}
                                    type="og_image"
                                    accept="image/*"
                                    description="Recommended: 1200x630px PNG/JPG (max 2MB)"
                                />
                            </div>
                        </div>

                        {/* Analytics & Marketing Section */}
                        <div className="bg-white dark:bg-neutral-700/50 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                                <FiBarChart2 className="w-5 h-5" />
                                Analytics & Marketing
                            </h3>

                            {/* Google Analytics */}
                            <div className="mb-6 p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold text-neutral-900 dark:text-white">
                                            Google Analytics
                                        </h4>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            Track website traffic and user
                                            behavior
                                        </p>
                                    </div>
                                    <ToggleSwitch
                                        enabled={data.google_analytics_enabled}
                                        onChange={(enabled) =>
                                            setData(
                                                "google_analytics_enabled",
                                                enabled
                                            )
                                        }
                                    />
                                </div>
                                {data.google_analytics_enabled && (
                                    <TextInput
                                        value={data.google_analytics_id}
                                        onChange={(e) =>
                                            setData(
                                                "google_analytics_id",
                                                e.target.value
                                            )
                                        }
                                        placeholder="G-XXXXXXXXXX"
                                        error={errors.google_analytics_id}
                                    />
                                )}
                            </div>

                            {/* Google Tag Manager */}
                            <div className="mb-6 p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold text-neutral-900 dark:text-white">
                                            Google Tag Manager
                                        </h4>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            Manage marketing tags
                                        </p>
                                    </div>
                                    <ToggleSwitch
                                        enabled={
                                            data.google_tag_manager_enabled
                                        }
                                        onChange={(enabled) =>
                                            setData(
                                                "google_tag_manager_enabled",
                                                enabled
                                            )
                                        }
                                    />
                                </div>
                                {data.google_tag_manager_enabled && (
                                    <TextInput
                                        value={data.google_tag_manager_id}
                                        onChange={(e) =>
                                            setData(
                                                "google_tag_manager_id",
                                                e.target.value
                                            )
                                        }
                                        placeholder="GTM-XXXXXX"
                                        error={errors.google_tag_manager_id}
                                    />
                                )}
                            </div>

                            {/* Facebook Pixel */}
                            <div className="mb-6 p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold text-neutral-900 dark:text-white">
                                            Facebook Pixel
                                        </h4>
                                        <p className="text-sm text-native-600 dark:text-native-400">
                                            Track Facebook ad conversions
                                        </p>
                                    </div>
                                    <ToggleSwitch
                                        enabled={data.facebook_pixel_enabled}
                                        onChange={(enabled) =>
                                            setData(
                                                "facebook_pixel_enabled",
                                                enabled
                                            )
                                        }
                                    />
                                </div>
                                {data.facebook_pixel_enabled && (
                                    <TextInput
                                        value={data.facebook_pixel_id}
                                        onChange={(e) =>
                                            setData(
                                                "facebook_pixel_id",
                                                e.target.value
                                            )
                                        }
                                        placeholder="XXXXXXXXXXXXXXX"
                                        error={errors.facebook_pixel_id}
                                    />
                                )}
                            </div>

                            {/* Google Adsense */}
                            <div className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold text-neutral-900 dark:text-white">
                                            Google Adsense
                                        </h4>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            Display ads on your website
                                        </p>
                                    </div>
                                    <ToggleSwitch
                                        enabled={data.google_adsense_enabled}
                                        onChange={(enabled) =>
                                            setData(
                                                "google_adsense_enabled",
                                                enabled
                                            )
                                        }
                                    />
                                </div>
                                {data.google_adsense_enabled && (
                                    <div className="space-y-3">
                                        <TextInput
                                            value={data.google_adsense_id}
                                            onChange={(e) =>
                                                setData(
                                                    "google_adsense_id",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="pub-XXXXXXXXXXXXXXXX"
                                            error={errors.google_adsense_id}
                                        />
                                        <div>
                                            <InputLabel value="Adsense Code" />
                                            <textarea
                                                value={data.google_adsense_code}
                                                onChange={(e) =>
                                                    setData(
                                                        "google_adsense_code",
                                                        e.target.value
                                                    )
                                                }
                                                rows={4}
                                                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-600 dark:text-white"
                                                placeholder="Paste your Adsense code here"
                                            />
                                            <InputError
                                                message={
                                                    errors.google_adsense_code
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Social Media Section */}
                        <div className="bg-white dark:bg-neutral-700/50 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                                Social Media Links
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    {
                                        key: "facebook_url",
                                        icon: FiFacebook,
                                        label: "Facebook",
                                        placeholder:
                                            "https://facebook.com/yourpage",
                                    },
                                    {
                                        key: "twitter_url",
                                        icon: FiTwitter,
                                        label: "Twitter",
                                        placeholder:
                                            "https://twitter.com/yourhandle",
                                    },
                                    {
                                        key: "instagram_url",
                                        icon: FiInstagram,
                                        label: "Instagram",
                                        placeholder:
                                            "https://instagram.com/yourhandle",
                                    },
                                    {
                                        key: "youtube_url",
                                        icon: FiYoutube,
                                        label: "YouTube",
                                        placeholder:
                                            "https://youtube.com/yourchannel",
                                    },
                                    {
                                        key: "linkedin_url",
                                        icon: FiLinkedin,
                                        label: "LinkedIn",
                                        placeholder:
                                            "https://linkedin.com/company/yourcompany",
                                    },
                                ].map(
                                    ({
                                        key,
                                        icon: Icon,
                                        label,
                                        placeholder,
                                    }) => (
                                        <div key={key}>
                                            <InputLabel
                                                htmlFor={key}
                                                value={label}
                                            />
                                            <div className="relative">
                                                <TextInput
                                                    id={key}
                                                    type="url"
                                                    value={data[key]}
                                                    onChange={(e) =>
                                                        setData(
                                                            key,
                                                            e.target.value
                                                        )
                                                    }
                                                    error={errors[key]}
                                                    placeholder={placeholder}
                                                    className="pl-10"
                                                />
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Icon className="h-5 w-5 text-primary-400" />
                                                </div>
                                            </div>
                                            <InputError message={errors[key]} />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* SEO Section */}
                        <div className="bg-white dark:bg-neutral-700/50 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                                SEO Settings
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <InputLabel
                                        htmlFor="meta_keywords"
                                        value="Meta Keywords"
                                    />
                                    <TextInput
                                        id="meta_keywords"
                                        value={data.meta_keywords}
                                        onChange={(e) =>
                                            setData(
                                                "meta_keywords",
                                                e.target.value
                                            )
                                        }
                                        error={errors.meta_keywords}
                                        placeholder="keyword1, keyword2, keyword3"
                                    />
                                    <InputError
                                        message={errors.meta_keywords}
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="meta_author"
                                        value="Meta Author"
                                    />
                                    <TextInput
                                        id="meta_author"
                                        value={data.meta_author}
                                        onChange={(e) =>
                                            setData(
                                                "meta_author",
                                                e.target.value
                                            )
                                        }
                                        error={errors.meta_author}
                                        placeholder="Author name"
                                    />
                                    <InputError message={errors.meta_author} />
                                </div>
                            </div>
                        </div>

                        {/* Scripts Section */}
                        <div className="bg-white dark:bg-neutral-700/50 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                                <FiCode className="w-5 h-5" />
                                Custom Scripts
                            </h3>
                            {[
                                "header_scripts",
                                "body_scripts",
                                "footer_scripts",
                            ].map((key) => (
                                <div key={key} className="mb-4">
                                    <InputLabel
                                        htmlFor={key}
                                        value={key
                                            .replace("_", " ")
                                            .replace(/\b\w/g, (l) =>
                                                l.toUpperCase()
                                            )}
                                    />
                                    <textarea
                                        id={key}
                                        value={data[key]}
                                        onChange={(e) =>
                                            setData(key, e.target.value)
                                        }
                                        rows={4}
                                        className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-600 dark:text-white font-mono text-sm"
                                        placeholder={`Paste your ${key.replace(
                                            "_",
                                            " "
                                        )} here`}
                                    />
                                    <InputError message={errors[key]} />
                                </div>
                            ))}
                        </div>

                        {/* Maintenance Section */}
                        <div className="bg-white dark:bg-neutral-700/50 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                                <FiShield className="w-5 h-5" />
                                Maintenance Mode
                            </h3>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h4 className="font-semibold text-neutral-900 dark:text-white">
                                        Maintenance Mode
                                    </h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Put your website in maintenance mode
                                    </p>
                                </div>
                                <ToggleSwitch
                                    enabled={data.maintenance_mode}
                                    onChange={(enabled) =>
                                        setData("maintenance_mode", enabled)
                                    }
                                />
                            </div>
                            {data.maintenance_mode && (
                                <div>
                                    <InputLabel
                                        htmlFor="maintenance_message"
                                        value="Maintenance Message"
                                    />
                                    <textarea
                                        id="maintenance_message"
                                        value={data.maintenance_message}
                                        onChange={(e) =>
                                            setData(
                                                "maintenance_message",
                                                e.target.value
                                            )
                                        }
                                        rows={3}
                                        className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-600 dark:text-white"
                                        placeholder="We'll be back soon! Our website is currently under maintenance."
                                    />
                                    <InputError
                                        message={errors.maintenance_message}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end pt-6 border-t border-neutral-200 dark:border-neutral-700">
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 focus:ring-primary-500"
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
                                        Saving...
                                    </>
                                ) : (
                                    "Save Settings"
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
