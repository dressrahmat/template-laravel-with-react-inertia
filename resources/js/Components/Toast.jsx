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
            bg: "bg-success-50",
            border: "border-success-200",
            text: "text-success-800",
            icon: <FiCheckCircle className="h-5 w-5 text-success-500" />,
        },
        error: {
            bg: "bg-error-50",
            border: "border-error-200",
            text: "text-error-800",
            icon: <FiXCircle className="h-5 w-5 text-error-500" />,
        },
        warning: {
            bg: "bg-warning-50",
            border: "border-warning-200",
            text: "text-warning-800",
            icon: <FiAlertCircle className="h-5 w-5 text-warning-500" />,
        },
        info: {
            bg: "bg-accent-50",
            border: "border-accent-200",
            text: "text-accent-800",
            icon: <FiInfo className="h-5 w-5 text-accent-500" />,
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
                className="ml-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-200"
            >
                <FiXCircle className="h-4 w-4" />
            </button>
        </div>
    );
};

export default Toast;
