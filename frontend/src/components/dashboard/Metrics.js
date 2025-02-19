"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaWhatsapp,
  FaTelegram,
  FaPhoneAlt,
  FaSave,
} from "react-icons/fa";
import Charts from "@/components/dashboard/Charts";
import Cookies from "js-cookie";

const Metrics = ({ userName, userCity, userState }) => {
  const [contactConfig, setContactConfig] = useState({
    whatsapp: { number: "", message: "" },
    telegram: { username: "", message: "" },
    phone: "",
  });

  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const userToken = Cookies.get("userToken");

  // Formatar número de telefone para exibição
  const formatPhoneDisplay = (value) => {
    const cleanedValue = value.replace(/\D/g, ""); // Remove tudo que não for número

    if (cleanedValue.length === 11) {
      return `(${cleanedValue.slice(0, 2)}) ${cleanedValue.slice(2, 7)}-${cleanedValue.slice(7)}`;
    } else if (cleanedValue.length === 10) {
      return `(${cleanedValue.slice(0, 2)}) ${cleanedValue.slice(2, 6)}-${cleanedValue.slice(6)}`;
    }
    return cleanedValue;
  };

  // Formatar número de telefone para envio (somente números)
  const formatPhoneBackend = (value) => {
    return value.replace(/\D/g, "");
  };

  // Buscar dados do backend
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/contact`,
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );
        const { contact } = response.data;

        setContactConfig({
          whatsapp: {
            number: formatPhoneDisplay(contact.whatsappNumber || ""),
            message: contact.whatsappMessage || "",
          },
          telegram: {
            username: contact.telegramUsername || "",
            message: contact.telegramMessage || "",
          },
          phone: formatPhoneDisplay(contact.phoneNumber || ""),
        });

      } catch (error) {
        setMessage("Erro ao carregar os dados de contato.");
      }
    };

    fetchContactData();
  }, []);

  const handleConfigChange = (e, platform, field) => {
    let value = e.target.value;

    if (field === "number") {
      value = formatPhoneDisplay(value); // Formata para exibição
    }

    setContactConfig((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], [field]: value },
    }));
    setUpdated(false);
  };

  const handlePhoneChange = (e) => {
    const value = formatPhoneDisplay(e.target.value);
    setContactConfig((prev) => ({ ...prev, phone: value }));
    setUpdated(false);
  };

  const saveConfig = async () => {
    setLoading(true);
    setMessage("");

    const payload = {
      whatsappNumber: formatPhoneBackend(contactConfig.whatsapp.number), // Limpa antes de enviar
      whatsappMessage: contactConfig.whatsapp.message,
      telegramUsername: contactConfig.telegram.username,
      telegramMessage: contactConfig.telegram.message,
      phoneNumber: formatPhoneBackend(contactConfig.phone), // Limpa antes de enviar
    };

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/contact/update`,
        payload,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      setMessage("Dados atualizados com sucesso!");
      setUpdated(true);
    } catch (error) {
      console.error("Erro ao atualizar contatos:", error);
      setMessage("Erro ao salvar os dados. Tente novamente.");
    }

    setLoading(false);
  };

  return (
    <div className="hidden md:block bg-white p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
        Configuração de Contato
      </h2>

      {/* Gráfico Responsivo para Desktop */}
      <div className="mb-8">
        <Charts className="w-full h-[450px]" />
      </div>

      {/* Inputs organizados em colunas */}
      <div className="grid grid-cols-2 gap-8">
        {/* WhatsApp */}
        <div>
          <h3 className="text-lg font-semibold flex items-center text-green-500 mb-2">
            <FaWhatsapp className="mr-2" /> WhatsApp
          </h3>
          <p className="text-sm text-gray-600 italic mb-2">
            <strong>Mensagem fixa:</strong> Olá, {userName}! Encontrei seu
            anúncio no Faixa Rosa em {userCity}-{userState}.
          </p>
          <input
            type="text"
            placeholder="Número do WhatsApp (com DDD)"
            value={contactConfig.whatsapp.number}
            maxLength={15}
            onChange={(e) => handleConfigChange(e, "whatsapp", "number")}
            className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <textarea
            placeholder="Mensagem personalizada"
            value={contactConfig.whatsapp.message}
            maxLength={200}
            onChange={(e) => handleConfigChange(e, "whatsapp", "message")}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          ></textarea>
        </div>

        {/* Telegram */}
        <div>
          <h3 className="text-lg font-semibold flex items-center text-blue-500 mb-2">
            <FaTelegram className="mr-2" /> Telegram
          </h3>
          <p className="text-sm text-gray-600 italic mb-2">
            <strong>Mensagem fixa:</strong> Olá, {userName}! Encontrei seu
            anúncio no Faixa Rosa em {userCity}-{userState}.
          </p>
          <input
            type="text"
            placeholder="Usuário do Telegram"
            maxLength={50}
            value={contactConfig.telegram.username}
            onChange={(e) => handleConfigChange(e, "telegram", "username")}
            className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Mensagem personalizada"
            value={contactConfig.telegram.message}
            maxLength={200}
            onChange={(e) => handleConfigChange(e, "telegram", "message")}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Telefone */}
        <div className="col-span-2">
          <h3 className="text-lg font-semibold flex items-center text-gray-800 mb-2">
            <FaPhoneAlt className="mr-2" /> Telefone
          </h3>
          <input
            type="text"
            placeholder="Número de telefone (com DDD)"
            value={contactConfig.phone}
            maxLength={15}
            onChange={handlePhoneChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
      </div>

      {/* Botão de Salvar */}
      <div className="mt-8">
        <button
          onClick={saveConfig}
          disabled={loading}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded shadow transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600 text-white"
            }`}
        >
          <FaSave />
          <span>{loading ? "Salvando..." : "Atualizar Contatos"}</span>
        </button>
      </div>

      {message && (
        <div className="mt-4 p-3 text-white text-center rounded-md shadow-md bg-green-500">
          {message}
        </div>
      )}
    </div>
  );
};

export default Metrics;
