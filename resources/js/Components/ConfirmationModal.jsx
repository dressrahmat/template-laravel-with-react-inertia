import React from "react";
import SecondaryButton from "./SecondaryButton";
import DangerButton from "./DangerButton";

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                >
                    <div
                        className="absolute inset-0 bg-neutral-900 opacity-75"
                        onClick={onClose}
                    ></div>
                </div>

                <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                >
                    &#8203;
                </span>

                <div className="inline-block align-bottom bg-neutral-50 rounded-xl text-left overflow-hidden shadow-card transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-neutral-50 px-6 pt-6 pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-error-100">
                                <svg
                                    className="h-6 w-6 text-error-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-neutral-900">
                                    {title}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-neutral-600">
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-neutral-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 rounded-b-xl">
                        <SecondaryButton
                            onClick={onClose}
                            className="w-full sm:w-auto mt-3 sm:mt-0"
                        >
                            {cancelText}
                        </SecondaryButton>
                        <DangerButton
                            onClick={onConfirm}
                            className="w-full sm:w-auto"
                        >
                            {confirmText}
                        </DangerButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
