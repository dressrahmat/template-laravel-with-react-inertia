import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

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

    return (
        <GuestLayout>
            <Head title="Register" />

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
                        Create Your Account
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="mt-2 text-sm text-neutral-600 dark:text-neutral-400"
                    >
                        Sign up to get started
                    </motion.p>
                </div>

                <form onSubmit={submit}>
                    <motion.div variants={itemVariants} className="space-y-4">
                        <div>
                            <InputLabel
                                htmlFor="name"
                                value="Name"
                                className="mb-1.5 text-neutral-700 dark:text-neutral-300"
                            />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="block w-full rounded-xl py-2.5 px-3.5 border-neutral-300 dark:border-neutral-600 focus:border-primary-500 focus:ring-primary-500 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.name}
                                className="mt-1.5"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="email"
                                value="Email"
                                className="mb-1.5 text-neutral-700 dark:text-neutral-300"
                            />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full rounded-xl py-2.5 px-3.5 border-neutral-300 dark:border-neutral-600 focus:border-primary-500 focus:ring-primary-500 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                                autoComplete="username"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                required
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
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                required
                            />

                            {/* Eye Icon Button untuk Password */}
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

                        <div className="relative">
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Confirm Password"
                                className="mb-1.5 text-neutral-700 dark:text-neutral-300"
                            />
                            <TextInput
                                id="password_confirmation"
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="block w-full rounded-xl py-2.5 px-3.5 pr-10 border-neutral-300 dark:border-neutral-600 focus:border-primary-500 focus:ring-primary-500 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                                required
                            />

                            {/* Eye Icon Button untuk Confirm Password */}
                            <button
                                type="button"
                                className="absolute right-3 top-12 transform -translate-y-1/2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 focus:outline-none transition-colors duration-200"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {showConfirmPassword ? (
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
                                message={errors.password_confirmation}
                                className="mt-1.5"
                            />
                        </div>

                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="flex items-center justify-end mt-6"
                        >
                            <Link
                                href={route("login")}
                                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            >
                                Already registered?
                            </Link>

                            <PrimaryButton
                                className="ms-4 py-3 px-4 text-base font-medium rounded-xl shadow-card bg-primary-600 hover:bg-primary-700 focus:ring-primary-500"
                                disabled={processing}
                            >
                                {processing ? "Registering..." : "Register"}
                            </PrimaryButton>
                        </motion.div>
                    </motion.div>
                </form>
            </motion.div>
        </GuestLayout>
    );
}
