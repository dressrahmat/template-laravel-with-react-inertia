import React, { useState, useEffect } from "react";
import { Head, Link, usePage } from "@inertiajs/react";

export default function AdminLayout({ children, title }) {
    const { auth } = usePage().props;
    const [isDark, setIsDark] = useState(
        localStorage.getItem("darkMode") === "true" ||
            (!localStorage.getItem("darkMode") &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loadingNotifications, setLoadingNotifications] = useState(true);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    // Fungsi untuk memuat notifikasi
    const loadNotifications = async () => {
        try {
            const response = await fetch(
                route("admin.audit-trail.notifications")
            );
            const data = await response.json();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unread_count || 0);
        } catch (error) {
            console.error("Error loading notifications:", error);
            setNotifications([]);
            setUnreadCount(0);
        } finally {
            setLoadingNotifications(false);
        }
    };

    // Load notifikasi saat komponen mount
    useEffect(() => {
        loadNotifications();

        // Refresh notifikasi setiap 30 detik
        const interval = setInterval(loadNotifications, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("darkMode", "true");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("darkMode", "false");
        }
    }, [isDark]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSidebarOpen(true);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fungsi untuk mengecek apakah menu aktif
    const isActive = (routeName) => {
        return route().current(routeName);
    };

    // Helper function to check permissions
    const hasPermission = (permission) => {
        return (
            auth.user &&
            auth.user.permissions &&
            auth.user.permissions.includes(permission)
        );
    };

    // Helper function to check roles
    const hasRole = (role) => {
        return auth.user && auth.user.roles && auth.user.roles.includes(role);
    };

    // Check if user has any of the required permissions
    const hasAnyPermission = (permissions) => {
        if (!auth.user || !auth.user.permissions) return false;
        return permissions.some((permission) =>
            auth.user.permissions.includes(permission)
        );
    };

    // Check if user has any of the required roles
    const hasAnyRole = (roles) => {
        if (!auth.user || !auth.user.roles) return false;
        return roles.some((role) => auth.user.roles.includes(role));
    };

    return (
        <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
            <Head title={title} />

            {/* Sidebar Mobile Overlay */}
            <div
                className={`fixed inset-0 z-40 md:hidden bg-neutral-900 bg-opacity-50 transition-opacity duration-300 ease-in-out ${
                    sidebarOpen
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <div
                className={`fixed z-50 md:static bg-neutral-50 dark:bg-neutral-800 shadow-card transition-transform md:transition-all duration-300 ease-in-out h-screen rounded-r-xl ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } ${sidebarExpanded ? "w-64" : "w-20"} md:translate-x-0`}
            >
                <div className="p-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center">
                        {sidebarExpanded ? (
                            <h1 className="text-xl font-bold text-primary-500 dark:text-primary-400">
                                Admin
                            </h1>
                        ) : (
                            <div className="w-10 h-10 flex items-center justify-center">
                                <span className="text-2xl font-bold text-primary-500 dark:text-primary-400">
                                    A
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex space-x-1">
                        <button
                            onClick={() => setSidebarExpanded(true)}
                            className={`p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
                                sidebarExpanded ? "hidden" : ""
                            }`}
                            title="Expand sidebar"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-neutral-600 dark:text-neutral-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => setSidebarExpanded(false)}
                            className={`p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
                                sidebarExpanded ? "" : "hidden"
                            }`}
                            title="Collapse sidebar"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-neutral-600 dark:text-neutral-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <nav className="p-4">
                    <ul className="space-y-2">
                        {(hasPermission("view dashboard") ||
                            hasAnyRole(["admin", "superadmin"])) && (
                            <li>
                                <Link
                                    href={route("dashboard")}
                                    className={`flex items-center p-2 rounded-md transition-colors duration-200 ${
                                        isActive("dashboard")
                                            ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200 border-r-4 border-primary-600 dark:border-primary-400"
                                            : "hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                                    }`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001 1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                    <span
                                        className={`ml-3 ${
                                            sidebarExpanded ? "" : "hidden"
                                        }`}
                                    >
                                        Dashboard
                                    </span>
                                </Link>
                            </li>
                        )}

                        {hasPermission("view users") && (
                            <li>
                                <Link
                                    href={route("admin.users.index")}
                                    className={`flex items-center p-2 rounded-md transition-colors duration-200 ${
                                        isActive("admin.users.*")
                                            ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200 border-r-4 border-primary-600 dark:border-primary-400"
                                            : "hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                                    }`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                    </svg>
                                    <span
                                        className={`ml-3 ${
                                            sidebarExpanded ? "" : "hidden"
                                        }`}
                                    >
                                        Users
                                    </span>
                                </Link>
                            </li>
                        )}

                        {hasAnyPermission([
                            "view roles",
                            "view permissions",
                        ]) && (
                            <li>
                                <Link
                                    href={route(
                                        "admin.role-permissions.index",
                                        { type: "roles" }
                                    )}
                                    className={`flex items-center p-2 rounded-md transition-colors duration-200 ${
                                        isActive("admin.role-permissions.*") ||
                                        isActive("admin.roles.*") ||
                                        isActive("admin.permissions.*")
                                            ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200 border-r-4 border-primary-600 dark:border-primary-400"
                                            : "hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                                    }`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 2a1 1 0 00-1 1v1a1 1 0 102 0V3a1 1 0 00-1-1zM5 5a1 1 0 00-1 1v1a1 1 0 102 0V6a1 1 0 00-1-1zm10 0a1 1 0 00-1 1v1a1 1 0 102 0V6a1 1 0 00-1-1zM3 10a7 7 0 1114 0H3zm5 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span
                                        className={`ml-3 ${
                                            sidebarExpanded ? "" : "hidden"
                                        }`}
                                    >
                                        Role & Permissions
                                    </span>
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="bg-neutral-50 dark:bg-neutral-800 shadow-sm border-b border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 mr-2 md:hidden"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-neutral-600 dark:text-neutral-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                                {title}
                            </h2>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsDark(!isDark)}
                                className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                            >
                                {isDark ? (
                                    <svg
                                        className="h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
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
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                )}
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setNotificationsOpen(
                                            !notificationsOpen
                                        );
                                        if (!notificationsOpen) {
                                            loadNotifications();
                                        }
                                    }}
                                    className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 relative"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                    </svg>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 w-2 h-2 bg-error-500 rounded-full"></span>
                                    )}
                                </button>

                                {/* Notifications Panel */}
                                <div
                                    className={`absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 z-50 ${
                                        notificationsOpen ? "block" : "hidden"
                                    }`}
                                >
                                    <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                                                Notifikasi
                                            </h3>
                                            {unreadCount > 0 && (
                                                <span className="text-xs bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 px-2 py-1 rounded-full">
                                                    {unreadCount} baru
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="max-h-96 overflow-y-auto">
                                        {loadingNotifications ? (
                                            <div className="px-4 py-4 text-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                                                    Memuat notifikasi...
                                                </p>
                                            </div>
                                        ) : notifications.length === 0 ? (
                                            <div className="px-4 py-6 text-center">
                                                <svg
                                                    className="w-12 h-12 text-neutral-400 mx-auto mb-3"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                                    />
                                                </svg>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                    Belum ada notifikasi
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                                                {notifications.map(
                                                    (notification) => (
                                                        <Link
                                                            key={
                                                                notification.id
                                                            }
                                                            href={route(
                                                                "admin.audit-trail.show",
                                                                notification.id
                                                            )}
                                                            className="block px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-150"
                                                            onClick={() =>
                                                                setNotificationsOpen(
                                                                    false
                                                                )
                                                            }
                                                        >
                                                            <div className="flex items-start space-x-3">
                                                                <div
                                                                    className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 bg-${notification.event_color}-500`}
                                                                ></div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                                                        {notification.user
                                                                            ? notification
                                                                                  .user
                                                                                  .name
                                                                            : "Sistem"}
                                                                    </p>
                                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                                                        {
                                                                            notification.message
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                                                                        {
                                                                            notification.created_at_human
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700 rounded-b-xl">
                                        <Link
                                            href={route(
                                                "admin.audit-trail.index"
                                            )}
                                            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center justify-center"
                                            onClick={() =>
                                                setNotificationsOpen(false)
                                            }
                                        >
                                            Lihat semua notifikasi
                                            <svg
                                                className="w-4 h-4 ml-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center space-x-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary-500 dark:bg-primary-400 flex items-center justify-center text-white font-medium">
                                        {auth.user.name
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </div>
                                    <span className="hidden md:inline font-medium">
                                        {auth.user.name}
                                    </span>
                                </button>
                                <div
                                    className={`absolute right-0 mt-2 w-48 bg-neutral-50 dark:bg-neutral-700 rounded-xl shadow-card py-1 z-50 border border-neutral-200 dark:border-neutral-600 ${
                                        profileOpen ? "" : "hidden"
                                    }`}
                                >
                                    <Link
                                        href={route("profile.edit")}
                                        className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600"
                                    >
                                        Profil Anda
                                    </Link>
                                    <Link
                                        href={route("admin.settings.index")}
                                        className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600"
                                    >
                                        Pengaturan
                                    </Link>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="block w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600"
                                    >
                                        Keluar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-1 pt-3 bg-neutral-50 dark:bg-neutral-900">
                    {children}
                </main>
            </div>
        </div>
    );
}
