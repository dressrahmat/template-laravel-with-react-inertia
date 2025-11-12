import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Login({ status, canResetPassword }) {
    const { settings } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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

    // Hanya set meta tags yang diperlukan
    const pageTitle = `Login - ${settings.site_name}`;
    const pageDescription = `Login to your account at ${settings.site_name}`;

    return (
        <GuestLayout>
            <Head>
                <title>{pageTitle}</title>
            </Head>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
                <div className="text-center mb-6">
                    <motion.h2
                        variants={itemVariants}
                        className="text-3xl font-bold text-neutral-900 dark:text-neutral-100"
                    >
                        Welcome Back
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="mt-2 text-sm text-neutral-600 dark:text-neutral-400"
                    >
                        Sign in to your account to continue
                    </motion.p>
                </div>

                {status && (
                    <motion.div
                        variants={itemVariants}
                        className="mb-4 p-3 bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-300 rounded-xl text-sm"
                    >
                        {status}
                    </motion.div>
                )}

                <form onSubmit={submit}>
                    <motion.div variants={itemVariants} className="space-y-4">
                        <div>
                            <InputLabel
                                htmlFor="email"
                                value="Email Address"
                                className="mb-1.5 text-neutral-700 dark:text-neutral-300"
                            />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full rounded-xl py-2.5 px-3.5 border-neutral-300 dark:border-neutral-600 focus:border-primary-500 focus:ring-primary-500 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.email}
                                className="mt-1.5"
                            />
                        </div>

                        <div className="relative">
                            <InputLabel
                                htmlFor="password"
                                value="Password"
                                className="mb-1.5 text-neutral-700 dark:text-neutral-300"
                            />
                            <TextInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className="block w-full rounded-xl py-2.5 px-3.5 pr-10 border-neutral-300 dark:border-neutral-600 focus:border-primary-500 focus:ring-primary-500 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                                autoComplete="current-password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />

                            {/* Eye Icon Button */}
                            <button
                                type="button"
                                className="absolute right-3 top-12 transform -translate-y-1/2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 focus:outline-none transition-colors duration-200"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? (
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                        />
                                    </svg>
                                )}
                            </button>

                            <InputError
                                message={errors.password}
                                className="mt-1.5"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                />
                                <span className="ms-2 text-sm text-neutral-600 dark:text-neutral-400">
                                    Remember me
                                </span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-200"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <PrimaryButton
                                className="w-full justify-center py-3 px-4 text-base font-medium rounded-xl shadow-card bg-primary-600 hover:bg-primary-700 focus:ring-primary-500"
                                disabled={processing}
                            >
                                {processing ? "Signing in..." : "Sign in"}
                            </PrimaryButton>
                        </motion.div>
                    </motion.div>
                </form>

                <motion.div
                    variants={itemVariants}
                    className="text-center pt-4 border-t border-neutral-100 dark:border-neutral-700 mt-6"
                >
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Don't have an account?{" "}
                        <Link
                            href={route("register")}
                            className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-200"
                        >
                            Sign up
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </GuestLayout>
    );
}
