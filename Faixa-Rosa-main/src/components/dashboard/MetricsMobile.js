"use client";

import React, { useState } from "react";
import {
  FaWhatsapp,
  FaTelegram,
  FaUser,
  FaSave,
  FaPhoneAlt,
} from "react-icons/fa";
import { Doughnut } from "react-chartjs-2"; // Para gráficos circulares
import "chart.js/auto";

const MetricsMobile = () => {
  const [contactConfig, setContactConfig] = useState({
    whatsapp: { number: "", message: "" },
    telegram: { username: "", message: "" },
    phone: "",
  });
  const [updated, setUpdated] = useState(false);

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

  const saveConfig = () => {
    setUpdated(true);
    setTimeout(() => setUpdated(false), 3000); // Feedback temporário
  };

  return (
    <div className="block md:hidden bg-gray-100 p-4 rounded-lg shadow-lg mx-2">
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
        <h3 className="text-lg font-semibold text-green-500 flex items-center mb-2">
          <FaWhatsapp className="mr-2" /> Configurar WhatsApp
        </h3>
        <input
          type="text"
          placeholder="Número do WhatsApp"
          value={contactConfig.whatsapp.number}
          onChange={(e) =>
            setContactConfig((prev) => ({
              ...prev,
              whatsapp: { ...prev.whatsapp, number: e.target.value },
            }))
          }
          className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <textarea
          placeholder="Mensagem personalizada"
          value={contactConfig.whatsapp.message}
          onChange={(e) =>
            setContactConfig((prev) => ({
              ...prev,
              whatsapp: { ...prev.whatsapp, message: e.target.value },
            }))
          }
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        ></textarea>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-blue-500 flex items-center mb-2">
          <FaTelegram className="mr-2" /> Configurar Telegram
        </h3>
        <input
          type="text"
          placeholder="Usuário do Telegram"
          value={contactConfig.telegram.username}
          onChange={(e) =>
            setContactConfig((prev) => ({
              ...prev,
              telegram: { ...prev.telegram, username: e.target.value },
            }))
          }
          className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Mensagem personalizada"
          value={contactConfig.telegram.message}
          onChange={(e) =>
            setContactConfig((prev) => ({
              ...prev,
              telegram: { ...prev.telegram, message: e.target.value },
            }))
          }
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
          <FaPhoneAlt className="mr-2" /> Configurar Telefone
        </h3>
        <input
          type="text"
          placeholder="Número de Telefone"
          value={contactConfig.phone}
          onChange={(e) =>
            setContactConfig((prev) => ({
              ...prev,
              phone: e.target.value,
            }))
          }
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
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
  );
};

export default MetricsMobile;
