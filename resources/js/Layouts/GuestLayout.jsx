import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-100 dark:from-neutral-900 dark:to-primary-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
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

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-full max-w-md bg-neutral-50 dark:bg-neutral-800 rounded-xl shadow-card overflow-hidden"
            >
                <div className="px-6 py-8 sm:px-8 sm:py-10">{children}</div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8 text-center text-sm text-neutral-600 dark:text-neutral-400"
            >
                <p>
                    © {new Date().getFullYear()} Your Company Name. All rights
                    reserved.
                </p>
            </motion.div>
        </div>
    );
}
