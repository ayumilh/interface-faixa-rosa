"use client";

import React, { useState } from "react";
import {
  FaWhatsapp,
  FaTelegram,
  FaPhoneAlt,
  FaSave,
  FaExclamationCircle,
} from "react-icons/fa";
import Charts from "@/components/dashboard/Charts";

const Metrics = ({ userName, userCity, userState }) => {
  const [contactConfig, setContactConfig] = useState({
    whatsapp: { number: "", message: "" },
    telegram: { username: "", message: "" },
    phone: "",
  });
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState("");

  const formatPhoneNumber = (value) => {
    const cleanedValue = value.replace(/\D/g, "");
    const formattedValue = cleanedValue.replace(
      /^(\d{2})(\d{5})(\d{4})$/,
      "($1) $2-$3"
    );
    return cleanedValue.length <= 10
      ? cleanedValue.replace(/^(\d{2})(\d{4})$/, "($1) $2")
      : formattedValue;
  };

  const handleConfigChange = (e, platform, field) => {
    let value = e.target.value;

    if (platform === "whatsapp" && field === "number") {
      value = formatPhoneNumber(value);
    }

    setContactConfig((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], [field]: value },
    }));
    setUpdated(false);
  };

  const handlePhoneChange = (e) => {
    const value = formatPhoneNumber(e.target.value);
    setContactConfig((prev) => ({ ...prev, phone: value }));
    setUpdated(false);
  };

  const saveConfig = () => {
    setUpdated(true);
  };

  return (
    <div className="hidden md:block bg-white p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
        Configuração de Contatos
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
            onChange={(e) => handleConfigChange(e, "whatsapp", "number")}
            className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <textarea
            placeholder="Mensagem personalizada"
            value={contactConfig.whatsapp.message}
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
            value={contactConfig.telegram.username}
            onChange={(e) => handleConfigChange(e, "telegram", "username")}
            className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Mensagem personalizada"
            value={contactConfig.telegram.message}
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
            onChange={handlePhoneChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
      </div>

      {/* Botão de Salvar */}
      <div className="mt-8">
        <button
          onClick={saveConfig}
          className="w-full flex items-center justify-center space-x-2 bg-pink-500 text-white px-4 py-2 rounded shadow hover:bg-pink-600 transition"
        >
          <FaSave />
          <span>Atualizar Contatos</span>
        </button>
      </div>

      {/* Mensagem de Confirmação */}
      {updated && (
        <div className="bg-green-100 border-l-4 border-green-500 p-4 mt-4 rounded-md text-green-700">
          Informações atualizadas com sucesso!
        </div>
      )}
    </div>
  );
};

export default Metrics;
