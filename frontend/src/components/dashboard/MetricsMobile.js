"use client";

import React, { useState, useEffect } from "react";
import {
  FaWhatsapp,
  FaTelegram,
  FaUser,
  FaSave,
  FaPhoneAlt,
} from "react-icons/fa";
import { Doughnut } from "react-chartjs-2"; // Para gráficos circulares
import "chart.js/auto";
import Cookies from "js-cookie";
import axios from "axios";

const MetricsMobile = ({ userName, userCity, userState }) => {
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
  const userToken = Cookies.get("userToken");
  const [updated, setUpdated] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

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

  // Mock Data para Gráficos
  const metrics = {
    whatsapp: { day: 12, week: 45, fifteenDays: 78, month: 123 },
    telegram: { day: 8, week: 32, fifteenDays: 56, month: 95 },
    profile: { day: 20, week: 78, fifteenDays: 120, month: 210 },
  };

  // Configuração de Dados para Gráficos
  const getChartData = (data) => ({
    labels: ["1 Dia", "7 Dias", "15 Dias", "30 Dias"],
    datasets: [
      {
        data: [data.day, data.week, data.fifteenDays, data.month],
        backgroundColor: ["#4CAF50", "#FFC107", "#2196F3", "#FF5722"],
        borderWidth: 1,
      },
    ],
  });

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
    <div className="block lg:hidden bg-gray-100 p-4 rounded-lg shadow-lg mx-2">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">
        Métricas e Configurações
      </h2>

      {/* Cards de Métricas */}
      <div className="space-y-6">
        {/* WhatsApp Métricas */}
        <div className="bg-white rounded-lg p-4 shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-green-500 flex items-center mb-4">
            <FaWhatsapp className="mr-2" /> WhatsApp
          </h3>
          <div className="flex justify-center mb-4">
            <Doughnut data={getChartData(metrics.whatsapp)} />
          </div>
          <div className="text-center text-gray-700">
            <p>
              <strong>1 Dia:</strong> {metrics.whatsapp.day} Chamadas
            </p>
            <p>
              <strong>7 Dias:</strong> {metrics.whatsapp.week} Chamadas
            </p>
            <p>
              <strong>15 Dias:</strong> {metrics.whatsapp.fifteenDays} Chamadas
            </p>
            <p>
              <strong>30 Dias:</strong> {metrics.whatsapp.month} Chamadas
            </p>
          </div>
        </div>

        {/* Telegram Métricas */}
        <div className="bg-white rounded-lg p-4 shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-blue-500 flex items-center mb-4">
            <FaTelegram className="mr-2" /> Telegram
          </h3>
          <div className="flex justify-center mb-4">
            <Doughnut data={getChartData(metrics.telegram)} />
          </div>
          <div className="text-center text-gray-700">
            <p>
              <strong>1 Dia:</strong> {metrics.telegram.day} Chamadas
            </p>
            <p>
              <strong>7 Dias:</strong> {metrics.telegram.week} Chamadas
            </p>
            <p>
              <strong>15 Dias:</strong> {metrics.telegram.fifteenDays} Chamadas
            </p>
            <p>
              <strong>30 Dias:</strong> {metrics.telegram.month} Chamadas
            </p>
          </div>
        </div>

        {/* Visitas no Perfil Métricas */}
        <div className="bg-white rounded-lg p-4 shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
            <FaUser className="mr-2" /> Visitas ao Perfil
          </h3>
          <div className="flex justify-center mb-4">
            <Doughnut data={getChartData(metrics.profile)} />
          </div>
          <div className="text-center text-gray-700">
            <p>
              <strong>1 Dia:</strong> {metrics.profile.day} Visitas
            </p>
            <p>
              <strong>7 Dias:</strong> {metrics.profile.week} Visitas
            </p>
            <p>
              <strong>15 Dias:</strong> {metrics.profile.fifteenDays} Visitas
            </p>
            <p>
              <strong>30 Dias:</strong> {metrics.profile.month} Visitas
            </p>
          </div>
        </div>
      </div>

      {/* Configurações de Contatos */}
      <div className="mt-6">
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

        {/* Botão de Salvar */}
        <div className="mt-8">
          <button
            onClick={saveConfig}
            className="w-full bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
          >
            Salvar Configurações
          </button>
        </div>

        {/* Feedback de Atualização */}
        {updated && (
          <div className="bg-green-100 text-green-700 mt-4 p-2 rounded text-center">
            Configurações atualizadas com sucesso!
          </div>
        )}
      </div>
    </div>
  );
};
export default MetricsMobile;
