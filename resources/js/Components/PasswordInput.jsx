import { useState } from "react";
import TextInput from "./TextInput";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function PasswordInput({
    value,
    onChange,
    error = false,
    disabled = false,
    placeholder = "Enter your password",
    className = "",
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative">
            <TextInput
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                error={error}
                disabled={disabled}
                placeholder={placeholder}
                className={`pr-10 ${className}`}
                {...props}
            />
            <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                onClick={togglePasswordVisibility}
                disabled={disabled}
            >
                {showPassword ? (
                    <FiEyeOff className="h-5 w-5" />
                ) : (
                    <FiEye className="h-5 w-5" />
                )}
            </button>
        </div>
    );
}
