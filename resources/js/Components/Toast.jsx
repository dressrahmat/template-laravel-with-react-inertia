import React from "react";
import {
    FiCheckCircle,
    FiXCircle,
    FiAlertCircle,
    FiInfo,
} from "react-icons/fi";

const Toast = ({ message, type, onClose }) => {
    const config = {
        success: {
            bg: "bg-success-50 dark:bg-success-900/20",
            border: "border-success-200 dark:border-success-800",
            text: "text-success-800 dark:text-success-200",
            icon: (
                <FiCheckCircle className="h-5 w-5 text-success-500 dark:text-success-400" />
            ),
        },
        error: {
            bg: "bg-error-50 dark:bg-error-900/20",
            border: "border-error-200 dark:border-error-800",
            text: "text-error-800 dark:text-error-200",
            icon: (
                <FiXCircle className="h-5 w-5 text-error-500 dark:text-error-400" />
            ),
        },
        warning: {
            bg: "bg-warning-50 dark:bg-warning-900/20",
            border: "border-warning-200 dark:border-warning-800",
            text: "text-warning-800 dark:text-warning-200",
            icon: (
                <FiAlertCircle className="h-5 w-5 text-warning-500 dark:text-warning-400" />
            ),
        },
        info: {
            bg: "bg-accent-50 dark:bg-accent-900/20",
            border: "border-accent-200 dark:border-accent-800",
            text: "text-accent-800 dark:text-accent-200",
            icon: (
                <FiInfo className="h-5 w-5 text-accent-500 dark:text-accent-400" />
            ),
        },
    }[type];

    return (
        <div
            className={`${config.bg} ${config.border} border rounded-xl shadow-card p-4 mb-3 flex items-start justify-between max-w-md`}
        >
            <div className="flex items-start">
                <div className="mr-3 mt-0.5">{config.icon}</div>
                <div className={`text-sm font-medium ${config.text}`}>
                    {message}
                </div>
            </div>
            <button
                onClick={onClose}
                className="ml-4 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors duration-200"
            >
                <FiXCircle className="h-4 w-4" />
            </button>
        </div>
    );
};

export default Toast;
