"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const Charts = () => {
  const [dataWhatsApp, setDataWhatsApp] = useState([]);
  const [dataTelegram, setDataTelegram] = useState([]);
  const [dataVisits, setDataVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API or database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard/metrics");
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Atualizar os estados com os dados da API
        setDataWhatsApp(data.whatsAppMetrics || []);
        setDataTelegram(data.telegramMetrics || []);
        setDataVisits(data.visitMetrics || []);

        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar métricas:", error);
        setError(error.message || "Erro desconhecido");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Exibir mensagem de carregamento ou erro
  if (loading) {
    return <p className="text-center text-gray-500">Carregando métricas...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-500">
        Erro ao carregar métricas: {error}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chamadas no WhatsApp */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Chamadas no WhatsApp
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataWhatsApp}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Chamadas" fill="#FF6B6B" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chamadas no Telegram */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Chamadas no Telegram
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataTelegram}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Chamadas" fill="#4ECDC4" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Visitas ao Perfil */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Visitas ao Perfil
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dataVisits}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Visitas"
              stroke="#1A535C"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
