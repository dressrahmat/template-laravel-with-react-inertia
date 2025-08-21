// components/Toast.jsx
import React from 'react';

const Toast = ({ message, type, onClose }) => {
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }[type];

  return (
    <div className={`${bgColor} text-white px-4 py-2 rounded-md shadow-lg mb-2 flex justify-between items-center`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white">×</button>
    </div>
  );
};

export default Toast;