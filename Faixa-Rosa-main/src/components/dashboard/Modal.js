// src/components/dashboard/Modal.js

import React from "react";

const Modal = ({ onClose, title, description, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-11/12 md:w-1/2 lg:w-1/3 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          title="Fechar Modal"
        >
          &times;
        </button>
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        {description && <p className="mb-4">{description}</p>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
