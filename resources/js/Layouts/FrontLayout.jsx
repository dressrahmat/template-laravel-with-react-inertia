import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";

export default function FrontLayout({ children }) {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-100 dark:from-neutral-900 dark:to-primary-900">
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-primary-500 selection:text-neutral-100">
                    <div className="relative w-full max-w-6xl px-6 py-12">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
