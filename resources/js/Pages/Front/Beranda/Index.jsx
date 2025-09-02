import React from "react";
import { Head } from "@inertiajs/react";
import FrontLayout from "@/Layouts/FrontLayout";

export default function Beranda({ settings, metaTags }) {
    return (
        <FrontLayout settings={settings} metaTags={metaTags} title="Beranda">
            <div className="text-center py-12">
                <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                    {settings.site_name}
                </h1>
                <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8">
                    {settings.site_description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                    <div className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Fitur 1</h3>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Deskripsi fitur pertama yang menarik.
                        </p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Fitur 2</h3>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Deskripsi fitur kedua yang bermanfaat.
                        </p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Fitur 3</h3>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Deskripsi fitur ketiga yang inovatif.
                        </p>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
