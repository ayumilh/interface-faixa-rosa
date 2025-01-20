import { useEffect } from "react";

/**
 * Hook para detectar quando a tecla "Esc" é pressionada.
 * @param {Function} handler - Função a ser executada ao pressionar "Esc".
 */
export const useEscKey = (handler) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handler();
      }
    };

    // Adiciona o evento ao pressionar teclas
    window.addEventListener("keydown", handleEsc);

    // Remove o evento ao desmontar o componente
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handler]);
};
