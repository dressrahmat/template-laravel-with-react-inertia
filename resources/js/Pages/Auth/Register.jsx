import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
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

                        <div>
                            <InputLabel
                                htmlFor="password"
                                value="Password"
                                className="mb-1.5 text-neutral-700 dark:text-neutral-300"
                            />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block w-full rounded-xl py-2.5 px-3.5 border-neutral-300 dark:border-neutral-600 focus:border-primary-500 focus:ring-primary-500 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.password}
                                className="mt-1.5"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Confirm Password"
                                className="mb-1.5 text-neutral-700 dark:text-neutral-300"
                            />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="block w-full rounded-xl py-2.5 px-3.5 border-neutral-300 dark:border-neutral-600 focus:border-primary-500 focus:ring-primary-500 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                                required
                            />
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
