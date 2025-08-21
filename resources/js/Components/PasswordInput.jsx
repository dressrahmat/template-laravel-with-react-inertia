import { useState } from 'react';
import TextInput from './TextInput';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function PasswordInput({ 
    value, 
    onChange, 
    error = false, 
    disabled = false,
    placeholder = "Enter password",
    ...props 
}) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <TextInput
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={onChange}
            error={error}
            disabled={disabled}
            placeholder={placeholder}
            icon={showPassword ? FiEyeOff : FiEye}
            onIconClick={togglePasswordVisibility}
            {...props}
        />
    );
}