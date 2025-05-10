import React from 'react';
import { createPortal } from 'react-dom';

const modalRoot = document.getElementById('modal-root');

const Modal = ({ children }) => {
  if (!modalRoot) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full">
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
