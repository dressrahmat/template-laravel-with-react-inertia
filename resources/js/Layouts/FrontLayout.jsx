import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";

export default function FrontLayout({ children, title, metaTags, settings }) {
    const [isDark, setIsDark] = useState(
        localStorage.getItem("darkMode") === "true" ||
            (!localStorage.getItem("darkMode") &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
    );

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("darkMode", "true");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("darkMode", "false");
        }
    }, [isDark]);

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
            <Head>
                <title>{metaTags?.title || title || settings?.site_name}</title>
                <meta name="description" content={metaTags?.description} />
                <meta name="keywords" content={metaTags?.keywords} />
                <meta name="author" content={metaTags?.author} />

                {/* Open Graph */}
                <meta property="og:title" content={metaTags?.title} />
                <meta
                    property="og:description"
                    content={metaTags?.description}
                />
                <meta property="og:image" content={metaTags?.og_image} />
                <meta property="og:type" content="website" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={metaTags?.title} />
                <meta
                    name="twitter:description"
                    content={metaTags?.description}
                />
                <meta name="twitter:image" content={metaTags?.og_image} />
            </Head>

            {/* Header */}
            <header className="bg-white dark:bg-neutral-800 shadow-sm border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href={route("welcome")}
                            className="flex items-center space-x-3"
                        >
                            {settings?.site_logo ? (
                                <img
                                    src={`/storage/${settings.site_logo}`}
                                    alt={settings.site_name}
                                    className="h-10 w-auto"
                                />
                            ) : (
                                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                    {settings?.site_name || "Website"}
                                </span>
                            )}
                        </Link>

                        <nav className="hidden md:flex items-center space-x-8">
                            <Link
                                href={route("welcome")}
                                className="text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                Beranda
                            </Link>
                            <Link
                                href={route("tentang")}
                                className="text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                Tentang
                            </Link>
                            <Link
                                href={route("kontak")}
                                className="text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                Kontak
                            </Link>
                        </nav>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsDark(!isDark)}
                                className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                            >
                                {isDark ? (
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">{children}</main>

            {/* Footer */}
            <footer className="bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">
                                {settings?.site_name}
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                {settings?.site_description}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">
                                Kontak
                            </h3>
                            {settings?.contact_email && (
                                <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                                    Email: {settings.contact_email}
                                </p>
                            )}
                            {settings?.contact_phone && (
                                <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                                    Telp: {settings.contact_phone}
                                </p>
                            )}
                            {settings?.address && (
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Alamat: {settings.address}
                                </p>
                            )}
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">
                                Tautan
                            </h3>
                            <div className="space-y-2">
                                <Link
                                    href={route("welcome")}
                                    className="block text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
                                >
                                    Beranda
                                </Link>
                                <Link
                                    href={route("tentang")}
                                    className="block text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
                                >
                                    Tentang Kami
                                </Link>
                                <Link
                                    href={route("kontak")}
                                    className="block text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
                                >
                                    Kontak
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-neutral-200 dark:border-neutral-700 mt-8 pt-8 text-center">
                        <p className="text-neutral-600 dark:text-neutral-400">
                            © {new Date().getFullYear()} {settings?.site_name}.
                            All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Scripts dari settings */}
            {settings?.header_scripts && (
                <div
                    dangerouslySetInnerHTML={{
                        __html: settings.header_scripts,
                    }}
                />
            )}
            {settings?.body_scripts && (
                <div
                    dangerouslySetInnerHTML={{ __html: settings.body_scripts }}
                />
            )}
            {settings?.footer_scripts && (
                <div
                    dangerouslySetInnerHTML={{
                        __html: settings.footer_scripts,
                    }}
                />
            )}
        </div>
    );
}
