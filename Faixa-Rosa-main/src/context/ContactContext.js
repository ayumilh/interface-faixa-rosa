// src/context/ContactContext.js
"use client";

import React, { createContext, useState, useEffect } from "react";

// Criação do contexto
export const ContactContext = createContext();

// Provedor do contexto
export const ContactProvider = ({ children }) => {
  // Estado inicial, tentando recuperar do localStorage
  const [contactConfig, setContactConfig] = useState({
    city: "São Paulo", // Cidade padrão
    state: "SP",       // Estado padrão
    whatsapp: {
      number: "5511999999999",
      message: "Gostaria de mais informações sobre seus serviços.",
    },
    telegram: {
      username: "SeuTelegram",
      message: "Estou interessado nos seus serviços.",
    },
    phone: "5511999999999",
  });

  // Recuperar dados do localStorage ao montar o componente
  useEffect(() => {
    const storedConfig = localStorage.getItem("contactConfig");
    if (storedConfig) {
      setContactConfig(JSON.parse(storedConfig));
    }
  }, []);

  // Atualizar o localStorage sempre que contactConfig mudar
  useEffect(() => {
    localStorage.setItem("contactConfig", JSON.stringify(contactConfig));
  }, [contactConfig]);

  return (
    <ContactContext.Provider value={{ contactConfig, setContactConfig }}>
      {children}
    </ContactContext.Provider>
  );
};
