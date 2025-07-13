"use client";

import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useEscKey } from "../hooks/useEscKey"; // Caso você tenha um hook personalizado para detectar a tecla Esc

const Modal = ({ onClose, title, description, children }) => {
  useEscKey(onClose); // Fecha o modal ao pressionar a tecla Esc

  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modalTitle"
      aria-describedby="modalDescription"
    >
      <div className="bg-gray-800 text-white rounded-2xl p-6 max-w-lg w-full relative">
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white"
          aria-label="Fechar modal"
        >
          <FaTimes className="w-5 h-5" />
        </button>
        
        {/* Título do Modal */}
        {title && (
          <h3 id="modalTitle" className="text-lg sm:text-xl font-semibold text-center mb-2">
            {title}
          </h3>
        )}
        
        {/* Descrição do Modal */}
        {description && (
          <p id="modalDescription" className="text-sm text-center italic mb-4">
            {description}
          </p>
        )}
        
        {/* Conteúdo do Modal */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
