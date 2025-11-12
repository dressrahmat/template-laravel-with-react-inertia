import { Head, Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function Maintenance() {
    // Gunakan settings dari props (yang sudah di-share oleh middleware)
    const settings = usePage().props.settings || {};
    const message = usePage().props.message || "";

    return (
        <>
            <Head title="Under Maintenance" />

            <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-100 dark:from-neutral-900 dark:to-primary-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <Link href="/">
                        <ApplicationLogo className="h-24 w-24 fill-current text-primary-600 dark:text-primary-400" />
                    </Link>
                </motion.div>

                {/* Main Content Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-xl shadow-card overflow-hidden"
                >
                    <div className="px-6 py-8 sm:px-8 sm:py-10">
                        {/* Maintenance Icon */}
                        <div className="text-center mb-6">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
                                <svg
                                    className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>

                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Under Maintenance
                            </h1>

                            <div className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm space-y-2">
                                {message ? (
                                    message
                                        .split("\n")
                                        .map((line, index) => (
                                            <p key={index}>{line}</p>
                                        ))
                                ) : (
                                    <>
                                        <p>
                                            Our site is currently undergoing
                                            scheduled maintenance.
                                        </p>
                                        <p>
                                            We apologize for any inconvenience
                                            and should be back shortly.
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <motion.div
                                    className="bg-yellow-500 h-2 rounded-full"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        ease: "easeInOut",
                                    }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                                Maintenance in progress...
                            </p>
                        </div>

                        {/* Refresh Button */}
                        <div className="mt-6 text-center">
                            <motion.button
                                onClick={() => window.location.reload()}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-700 focus:bg-primary-700 active:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                Check Again
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400"
                >
                    <p>
                        © {new Date().getFullYear()} {settings.site_name}. All
                        rights reserved.
                    </p>
                </motion.div>

                {/* Auto-refresh Timer */}
                <AutoRefreshTimer />
            </div>
        </>
    );
}

// Auto Refresh Component
function AutoRefreshTimer() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-4 text-center"
        >
            <p className="text-xs text-gray-500 dark:text-gray-400">
                Auto-refreshing in <CountdownTimer />
            </p>
        </motion.div>
    );
}

// Countdown Timer Component
function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

    useEffect(() => {
        if (timeLeft === 0) {
            window.location.reload();
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <span className="font-mono font-medium">
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
        </span>
    );
}
