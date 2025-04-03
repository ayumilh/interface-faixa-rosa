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
import Image from "next/image";

const Metrics = ({ userName, userCity, userState }) => {
  const [contactConfig, setContactConfig] = useState({
    whatsapp: { number: "", message: "", countryCode: '+55' },
    telegram: { username: "", message: "" },
    phone: { number: "", countryCode: '+55' },
  });

  const countryCodes = [
    { code: '+55', country: 'Brasil' },
    { code: '+1', country: 'EUA' },
    { code: '+44', country: 'Reino Unido' },
    { code: '+33', country: 'França' },
    { code: '+34', country: 'Espanha' },
    // Adicione mais países conforme necessário
  ];

  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const userToken = Cookies.get("userToken");

  const formatPhoneDisplay = (value, countryCode) => {
    const cleanedValue = value.replace(/\D/g, ""); // Remove tudo que não for número

    // Limpar o código do país para garantir que ele esteja apenas com números
    const formattedCountryCode = (countryCode || '+55').replace(/\D/g, "");

    // Se o código do país for o Brasil (+55), fazemos uma formatação específica
    if (formattedCountryCode === "55") {
      if (cleanedValue.length === 11) {
        // Formato para números brasileiros com 11 dígitos: (XX) XXXXX-XXXX
        return `(${cleanedValue.slice(0, 2)}) ${cleanedValue.slice(2, 7)}-${cleanedValue.slice(7)}`;
      } else if (cleanedValue.length === 10) {
        // Formato para números brasileiros com 10 dígitos: (XX) XXXX-XXXX
        return `(${cleanedValue.slice(0, 2)}) ${cleanedValue.slice(2, 6)}-${cleanedValue.slice(6)}`;
      }
    }

    // Para números internacionais com outros códigos de país
    // Exemplo genérico para países com 10 ou 11 dígitos, como EUA ou Reino Unido
    if (cleanedValue.length === 11) {
      // Para números com 11 dígitos: (XX) XXXXX-XXXX
      return `(${cleanedValue.slice(0, 2)}) ${cleanedValue.slice(2, 7)}-${cleanedValue.slice(7)}`;
    } else if (cleanedValue.length === 10) {
      // Para números com 10 dígitos: (XX) XXXX-XXXX
      return `(${cleanedValue.slice(0, 2)}) ${cleanedValue.slice(2, 6)}-${cleanedValue.slice(6)}`;
    }

    // Para números menores que 10 dígitos, retornamos o número limpo
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
        console.log("Dados de contato:", contact);

        // Remover os dois primeiros números de contact.phoneNumber
        const phoneNumberWithoutPrefix = contact.phoneNumber ? contact.phoneNumber.slice(2) : "";

        // Remover os dois primeiros números de contact.whatsappNumber
        const whatsappNumberWithoutPrefix = contact.whatsappNumber ? contact.whatsappNumber.slice(2) : "";

        setContactConfig({
          whatsapp: {
            number: whatsappNumberWithoutPrefix,
            message: contact.whatsappMessage || "",
            countryCode: contact.whatsappCountryCode || '+55',
          },
          telegram: {
            username: contact.telegramUsername || "",
            message: contact.telegramMessage || "",
          },
          phone: {
            number: phoneNumberWithoutPrefix,
            countryCode: contact.phoneCountryCode || '+55',
          },
        });
        setLoading(false);

      } catch (error) {
        setMessage("Erro ao carregar os dados de contato.");
        setLoading(false);
      }
    };

    fetchContactData();
  }, [userToken]);

  const handleConfigChange = (e, platform, field) => {
    let value = e.target.value;

    if (field === "number") {
      // Remover a formatação ao armazenar no estado
      value = value.replace(/\D/g, "");
    }

    setContactConfig((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], [field]: value },
    }));
    setUpdated(false);
  };

  // Manipula as mudanças no código do país
  const handleCountryCodeChange = (e) => {
    const newCountryCode = e.target.value;

    // Atualiza o código do país
    setContactConfig((prevConfig) => ({
      ...prevConfig,
      phone: {
        ...prevConfig.phone,
        countryCode: newCountryCode,
      },
    }));
  };

  const saveConfig = async () => {
    setLoading(true);
    setMessage("");

    // Concatenar o código do país ao número de telefone
    const phoneNumberWithCountry = `${contactConfig.phone.countryCode}${contactConfig.phone.number.replace(/\D/g, '')}`;
    const whatsappNumberWithCountry = `${contactConfig.whatsapp.countryCode}${contactConfig.whatsapp.number.replace(/\D/g, '')}`;

    const payload = {
      whatsappNumber: formatPhoneBackend(whatsappNumberWithCountry), // Limpa antes de enviar
      whatsappMessage: contactConfig.whatsapp.message,
      whatsappCountryCode: contactConfig.whatsapp.countryCode,
      telegramUsername: contactConfig.telegram.username,
      telegramMessage: contactConfig.telegram.message,
      phoneNumber: formatPhoneBackend(phoneNumberWithCountry), // Limpa antes de enviar
      phoneCountryCode: contactConfig.phone.countryCode,
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
    <div className="hidden lg:block bg-white p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
      {/* Carregamento com ícone de fogo */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center z-50">
          <Image
            src="/iconOficial_faixaRosa.png"
            alt="Ícone oficial Faixa Rosa"
            width={50}
            height={50}
            className="animate-pulse w-auto h-auto"
          />
        </div>
      )}

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
          <div className="w-full flex gap-2 items-center justify-between mb-2">
            <div className="w-full sm:w-32 lg:w-52 flex items-center justify-between space-x-2">
              {/* Select de códigos de país */}
              <select
                value={contactConfig.whatsapp.countryCode}
                onChange={(e) =>
                  setContactConfig((prevConfig) => ({
                    ...prevConfig,
                    whatsapp: {
                      ...prevConfig.whatsapp,
                      countryCode: e.target.value,
                    },
                  }))
                }
                className="p-2 border h-10 w-full sm:max-w-xs lg:max-w-md border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code} - {country.country}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full flex items-center justify-between space-x-2">
              {/* Input de número do WhatsApp */}
              <input
                type="text"
                placeholder="Número do WhatsApp (com DDD)"
                value={contactConfig.whatsapp.number ? formatPhoneDisplay(contactConfig.whatsapp.number) : ""}
                maxLength={15}
                onChange={(e) => handleConfigChange(e, "whatsapp", "number")}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
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
          <div className="flex items-center justify-between space-x-2">
            {/* Select de códigos de país */}
            <select
              value={contactConfig.phone.countryCode}
              onChange={handleCountryCodeChange}
              className="p-2 h-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.code} - {country.country}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Número de telefone (com DDD)"
              value={contactConfig.phone.number ? formatPhoneDisplay(contactConfig.phone.number) : ""}
              maxLength={15}
              onChange={(e) => handleConfigChange(e, "phone", "number")}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
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
