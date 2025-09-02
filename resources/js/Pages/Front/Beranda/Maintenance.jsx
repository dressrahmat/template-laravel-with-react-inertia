import React from "react";
import { Head } from "@inertiajs/react";
import FrontLayout from "@/Layouts/FrontLayout";

export default function Maintenance({ settings, maintenance_message }) {
    return (
        <FrontLayout settings={settings} title="Maintenance Mode">
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                            Sedang Dalam Pemeliharaan
                        </h1>
                        <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8">
                            {maintenance_message ||
                                "Situs sedang dalam pemeliharaan. Kami akan segera kembali."}
                        </p>
                    </div>

                    {settings.contact_email && (
                        <div className="mt-8">
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Untuk pertanyaan darurat, hubungi:{" "}
                                <a
                                    href={`mailto:${settings.contact_email}`}
                                    className="text-primary-600 dark:text-primary-400 hover:underline"
                                >
                                    {settings.contact_email}
                                </a>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </FrontLayout>
    );
}
