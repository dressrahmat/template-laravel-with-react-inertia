import React from "react";
import FrontLayout from "@/Layouts/FrontLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function Beranda({
    settings,
    metaTags,
    canLogin,
    canRegister,
    laravelVersion,
    phpVersion,
}) {
    // Gunakan settings dari props (yang sudah di-share oleh middleware)
    const siteSettings = settings || {};

    // Variants untuk animasi
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
            },
        },
    };

    const user = usePage().props.auth.user;
    // Hanya set meta tags yang diperlukan
    const pageTitle = `Beranda - ${settings.site_name}`;
    const pageDescription = `Selamat datang di ${settings.site_name}`;

    return (
        <FrontLayout settings={settings} metaTags={metaTags} title="Beranda">
            <Head>
                <title>{pageTitle}</title>
            </Head>

            {/* Header */}
            <motion.header
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center justify-between mb-16"
            >
                <motion.div
                    variants={itemVariants}
                    className="flex items-center space-x-4"
                >
                    {siteSettings.site_logo ? (
                        <img
                            src={siteSettings.site_logo}
                            alt={siteSettings.site_name}
                            className="h-12 w-auto"
                        />
                    ) : (
                        <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                            {siteSettings.site_name}
                        </div>
                    )}
                </motion.div>

                <motion.nav
                    variants={itemVariants}
                    className="flex items-center space-x-6"
                >
                    {user ? (
                        <Link
                            href={route("dashboard")}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            {canLogin && (
                                <Link
                                    href={route("login")}
                                    className="px-4 py-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                                >
                                    Masuk
                                </Link>
                            )}
                            {canRegister && (
                                <Link
                                    href={route("register")}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    Daftar
                                </Link>
                            )}
                        </>
                    )}
                </motion.nav>
            </motion.header>

            {/* Hero Section */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-center mb-20"
            >
                <motion.h1
                    variants={itemVariants}
                    className="text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6"
                >
                    Selamat Datang di{" "}
                    <span className="text-primary-600 dark:text-primary-400">
                        {settings?.site_name}
                    </span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-xl text-neutral-600 dark:text-neutral-400 mb-10 max-w-3xl mx-auto"
                >
                    {settings?.site_description ||
                        "Platform terbaik untuk kebutuhan Anda."}
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="flex justify-center space-x-4"
                >
                    <Link
                        href="#"
                        className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Pelajari Lebih Lanjut
                    </Link>
                    <Link
                        href="#"
                        className="px-8 py-3 border border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    >
                        Hubungi Kami
                    </Link>
                </motion.div>
            </motion.div>

            {/* Features Section */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-3 gap-8 mb-20"
            >
                <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-lg"
                >
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6">
                        <svg
                            className="w-8 h-8 text-primary-600 dark:text-primary-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                        Cepat dan Efisien
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Platform yang dirancang untuk memberikan pengalaman
                        terbaik dengan performa optimal.
                    </p>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-lg"
                >
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6">
                        <svg
                            className="w-8 h-8 text-primary-600 dark:text-primary-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                        Aman dan Terpercaya
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Keamanan data Anda adalah prioritas utama kami dengan
                        sistem enkripsi terkini.
                    </p>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-lg"
                >
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6">
                        <svg
                            className="w-8 h-8 text-primary-600 dark:text-primary-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                        Dukungan 24/7
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Tim support kami siap membantu Anda kapan saja dengan
                        layanan profesional.
                    </p>
                </motion.div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-center"
            >
                <motion.h2
                    variants={itemVariants}
                    className="text-3xl font-bold text-neutral-900 dark:text-white mb-8"
                >
                    Hubungi Kami
                </motion.h2>

                <motion.div
                    variants={itemVariants}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                >
                    {settings?.contact_email && (
                        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg">
                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <svg
                                    className="w-6 h-6 text-primary-600 dark:text-primary-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                                Email
                            </h4>
                            <p className="text-primary-600 dark:text-primary-400">
                                {settings.contact_email}
                            </p>
                        </div>
                    )}

                    {settings?.contact_phone && (
                        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg">
                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <svg
                                    className="w-6 h-6 text-primary-600 dark:text-primary-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                                Telepon
                            </h4>
                            <p className="text-primary-600 dark:text-primary-400">
                                {settings.contact_phone}
                            </p>
                        </div>
                    )}

                    {settings?.address && (
                        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg">
                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <svg
                                    className="w-6 h-6 text-primary-600 dark:text-primary-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                                Alamat
                            </h4>
                            <p className="text-primary-600 dark:text-primary-400">
                                {settings.address}
                            </p>
                        </div>
                    )}
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Link
                        href="#"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                        Hubungi Sekarang
                        <svg
                            className="ml-2 -mr-1 h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                        </svg>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Footer */}
            <motion.footer
                variants={itemVariants}
                className="mt-20 pt-8 border-t border-neutral-200 dark:border-neutral-700 text-center"
            >
                <p className="text-neutral-600 dark:text-neutral-400">
                    © {new Date().getFullYear()} {settings?.site_name}. All
                    rights reserved.
                    <br />
                    <span className="text-sm">
                        Built with Laravel v{laravelVersion} (PHP v{phpVersion})
                    </span>
                </p>
            </motion.footer>
        </FrontLayout>
    );
}
