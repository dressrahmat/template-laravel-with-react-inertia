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
            bg: "bg-green-50",
            border: "border-green-200",
            text: "text-green-800",
            icon: <FiCheckCircle className="h-5 w-5 text-green-500" />,
        },
        error: {
            bg: "bg-red-50",
            border: "border-red-200",
            text: "text-red-800",
            icon: <FiXCircle className="h-5 w-5 text-red-500" />,
        },
        warning: {
            bg: "bg-yellow-50",
            border: "border-yellow-200",
            text: "text-yellow-800",
            icon: <FiAlertCircle className="h-5 w-5 text-yellow-500" />,
        },
        info: {
            bg: "bg-blue-50",
            border: "border-blue-200",
            text: "text-blue-800",
            icon: <FiInfo className="h-5 w-5 text-blue-500" />,
        },
    }[type];

    return (
        <div
            className={`${config.bg} ${config.border} border rounded-xl shadow-lg p-4 mb-3 flex items-start justify-between max-w-md`}
        >
            <div className="flex items-start">
                <div className="mr-3 mt-0.5">{config.icon}</div>
                <div className={`text-sm font-medium ${config.text}`}>
                    {message}
                </div>
            </div>
            <button
                onClick={onClose}
                className="ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
                <FiXCircle className="h-4 w-4" />
            </button>
        </div>
    );
};

export default Toast;
