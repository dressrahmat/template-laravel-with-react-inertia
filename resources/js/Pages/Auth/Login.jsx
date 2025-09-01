import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
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
            <Head title="Log in" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
                <div className="text-center mb-6">
                    <motion.h2
                        variants={itemVariants}
                        className="text-3xl font-bold text-gray-900"
                    >
                        Welcome Back
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="mt-2 text-sm text-gray-600"
                    >
                        Sign in to your account to continue
                    </motion.p>
                </div>

                {status && (
                    <motion.div
                        variants={itemVariants}
                        className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm"
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
                                className="mb-1.5"
                            />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full rounded-lg py-2.5 px-3.5 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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

                        <div>
                            <InputLabel
                                htmlFor="password"
                                value="Password"
                                className="mb-1.5"
                            />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block w-full rounded-lg py-2.5 px-3.5 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                autoComplete="current-password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
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
                                <span className="ms-2 text-sm text-gray-600">
                                    Remember me
                                </span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
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
                                className="w-full justify-center py-3 px-4 text-base font-medium rounded-lg shadow-sm"
                                disabled={processing}
                            >
                                {processing ? "Signing in..." : "Sign in"}
                            </PrimaryButton>
                        </motion.div>
                    </motion.div>
                </form>

                <motion.div
                    variants={itemVariants}
                    className="text-center pt-4 border-t border-gray-100 mt-6"
                >
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            href={route("register")}
                            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                        >
                            Sign up
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </GuestLayout>
    );
}
