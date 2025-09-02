import React from "react";

export default function ToggleSwitch({ enabled, onChange }) {
    return (
        <button
            type="button"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                enabled
                    ? "bg-primary-600"
                    : "bg-neutral-200 dark:bg-neutral-600"
            }`}
            onClick={() => onChange(!enabled)}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enabled ? "translate-x-6" : "translate-x-1"
                }`}
            />
        </button>
    );
}
