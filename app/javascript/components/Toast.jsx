import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-16 left-1/2 transform -translate-x-1/2 z-50
        min-w-[240px] max-w-[90%] px-4 py-2 text-center
        rounded shadow-lg text-white
        ${type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}
    >
      {message}
    </div>
  );
};

export default Toast;
