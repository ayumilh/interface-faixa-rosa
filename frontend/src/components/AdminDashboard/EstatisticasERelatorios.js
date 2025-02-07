// src/components/AdminDashboard/EstatisticasERelatorios.js
import React, { useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import { Tooltip as ReactTooltip } from "react-tooltip";

// Registrar os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

// URL do TopoJSON do Brasil
const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/brazil/brazil-states.json";

const EstatisticasERelatorios = () => {
  const [tooltipContent, setTooltipContent] = useState("");

  // Dados de exemplo - Substitua com seus dados reais
  const dataAcessosTotal = {
    labels: [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez",
    ],
    datasets: [
      {
        label: "Total Usuários",
        data: [12000, 19000, 30000, 50000, 23000, 34000, 28000, 40000, 32000, 45000, 38000, 50000],
        borderColor: "#60A5FA",
        backgroundColor: "rgba(96, 165, 250, 0.3)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Anunciantes",
        data: [4000, 6000, 10000, 15000, 7000, 12000, 10000, 15000, 12000, 18000, 15000, 20000],
        borderColor: "#34D399",
        backgroundColor: "rgba(52, 211, 153, 0.3)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Clientes",
        data: [8000, 13000, 20000, 35000, 16000, 22000, 18000, 25000, 20000, 27000, 23000, 30000],
        borderColor: "#F87171",
        backgroundColor: "rgba(248, 113, 113, 0.3)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const dataAcessosAnunciantes = {
    labels: [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez",
    ],
    datasets: [
      {
        label: "Anunciantes",
        data: [4000, 6000, 10000, 15000, 7000, 12000, 10000, 15000, 12000, 18000, 15000, 20000],
        borderColor: "#34D399",
        backgroundColor: "rgba(52, 211, 153, 0.3)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const dataAcessosClientes = {
    labels: [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez",
    ],
    datasets: [
      {
        label: "Clientes",
        data: [8000, 13000, 20000, 35000, 16000, 22000, 18000, 25000, 20000, 27000, 23000, 30000],
        borderColor: "#F87171",
        backgroundColor: "rgba(248, 113, 113, 0.3)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const dataOnlineUsers = {
    labels: ["Usuários Online", "Anunciantes Online", "Clientes Online"],
    datasets: [
      {
        label: "Online",
        data: [120, 30, 90],
        backgroundColor: ["#60A5FA", "#34D399", "#F87171"],
        hoverOffset: 4,
      },
    ],
  };

  const dataPlans = {
    labels: ["Plano Básico", "Plano Premium", "Plano VIP"],
    datasets: [
      {
        label: "Anunciantes",
        data: [120, 80, 50],
        backgroundColor: "#10B981",
      },
      {
        label: "Clientes",
        data: [200, 150, 100],
        backgroundColor: "#059669",
      },
    ],
  };

  const dataRevenue = {
    labels: ["Plano Básico", "Plano Premium", "Plano VIP"],
    datasets: [
      {
        label: "Receita Anunciantes (R$)",
        data: [120 * 49.9, 80 * 99.9, 50 * 149.9],
        backgroundColor: "#34D399",
      },
      {
        label: "Receita Clientes (R$)",
        data: [200 * 39.9, 150 * 89.9, 100 * 129.9],
        backgroundColor: "#F87171",
      },
    ],
  };

  const dataPaymentMethodsAnunciantes = {
    labels: ["Pix", "Cartão de Crédito"],
    datasets: [
      {
        label: "Anunciantes",
        data: [80, 40],
        backgroundColor: ["#34D399", "#F87171"],
        hoverOffset: 4,
      },
    ],
  };

  const dataPaymentMethodsClientes = {
    labels: ["Pix", "Cartão de Crédito"],
    datasets: [
      {
        label: "Clientes",
        data: [150, 50],
        backgroundColor: ["#34D399", "#F87171"],
        hoverOffset: 4,
      },
    ],
  };

  // Dados de tráfego por estado
  const dataTrafegoEstado = {
    "São Paulo": 5000,
    "Rio de Janeiro": 4000,
    "Minas Gerais": 1500,
    "Bahia": 2000,
    "Ceará": 1800,
    "Paraná": 1600,
    // Adicione outros estados conforme necessário
  };

  const colorScale = scaleQuantize()
    .domain([0, 5000])
    .range([
      "#FEF0D9",
      "#FDD49E",
      "#FDBB84",
      "#FC8D59",
      "#EF6548",
      "#D7301F",
      "#B30000",
      "#7F0000",
    ]);

  return (
    <div className="p-6 bg-gray-900 text-gray-300 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-white">Estatísticas e Relatórios</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Acessos Totais */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M4 3a1 1 0 000 2h.586l2.707 2.707a1 1 0 001.414-1.414L7 4.414V5a1 1 0 102 0V3a1 1 0 00-1-1H4zM6 9a1 1 0 000 2h8a1 1 0 100-2H6zM4 13a1 1 0 000 2h.586l2.707 2.707a1 1 0 001.414-1.414L7 14.414V15a1 1 0 102 0v-2a1 1 0 00-1-1H4z" />
            </svg>
            Acessos Mensais
          </h2>
          <div className="flex-grow">
            <Line
              data={dataAcessosTotal}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: "#FFFFFF",
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: "#D1D5DB",
                    },
                    grid: {
                      color: "#4B5563",
                    },
                  },
                  y: {
                    ticks: {
                      color: "#D1D5DB",
                    },
                    grid: {
                      color: "#4B5563",
                    },
                  },
                },
              }}
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Gráfico de Usuários Online */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 3a7 7 0 100 14A7 7 0 0010 3zm0 12a5 5 0 110-10 5 5 0 010 10zm1-7a1 1 0 10-2 0v2a1 1 0 102 0V8z" />
            </svg>
            Usuários Online
          </h2>
          <div className="w-full max-w-xs">
            <Pie
              data={dataOnlineUsers}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: "#FFFFFF",
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${context.label}: ${context.parsed}`;
                      },
                    },
                  },
                },
              }}
              className="h-64 w-full"
            />
          </div>
        </div>

        {/* Gráfico de Acessos Anunciantes */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 3a7 7 0 100 14A7 7 0 0010 3zm0 12a5 5 0 110-10 5 5 0 010 10zm1-7a1 1 0 10-2 0v2a1 1 0 102 0V8z" />
            </svg>
            Acessos Mensais - Anunciantes
          </h2>
          <div className="flex-grow">
            <Line
              data={dataAcessosAnunciantes}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: "#FFFFFF",
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: "#D1D5DB",
                    },
                    grid: {
                      color: "#4B5563",
                    },
                  },
                  y: {
                    ticks: {
                      color: "#D1D5DB",
                    },
                    grid: {
                      color: "#4B5563",
                    },
                  },
                },
              }}
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Gráfico de Acessos Clientes */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 3a7 7 0 100 14A7 7 0 0010 3zm0 12a5 5 0 110-10 5 5 0 010 10zm1-7a1 1 0 10-2 0v2a1 1 0 102 0V8z" />
            </svg>
            Acessos Mensais - Clientes
          </h2>
          <div className="flex-grow">
            <Line
              data={dataAcessosClientes}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: "#FFFFFF",
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: "#D1D5DB",
                    },
                    grid: {
                      color: "#4B5563",
                    },
                  },
                  y: {
                    ticks: {
                      color: "#D1D5DB",
                    },
                    grid: {
                      color: "#4B5563",
                    },
                  },
                },
              }}
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Gráfico de Planos Ativos e Receita */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12a1 1 0 11-2 0V9a1 1 0 012 0v5zM10 6a1 1 0 100 2 1 1 0 000-2z" />
            </svg>
            Planos Ativos e Receita
          </h2>
          <div className="flex-grow">
            <Bar
              data={dataRevenue}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: "#FFFFFF",
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${context.dataset.label}: R$ ${context.parsed.y.toLocaleString()}`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: "#D1D5DB",
                    },
                    grid: {
                      color: "#4B5563",
                    },
                  },
                  y: {
                    ticks: {
                      color: "#D1D5DB",
                      callback: function (value) {
                        return `R$ ${value.toLocaleString()}`;
                      },
                    },
                    grid: {
                      color: "#4B5563",
                    },
                  },
                },
              }}
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Gráfico de Métodos de Pagamento - Anunciantes */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-purple-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm1 12a1 1 0 11-2 0V9a1 1 0 112 0v5zM10 6a1 1 0 100 2 1 1 0 000-2z" />
            </svg>
            Métodos de Pagamento - Anunciantes
          </h3>
          <div className="w-full max-w-xs">
            <Pie
              data={dataPaymentMethodsAnunciantes}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: "#FFFFFF",
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${context.label}: ${context.parsed}`;
                      },
                    },
                  },
                },
              }}
              className="h-48 w-full"
            />
          </div>
        </div>

        {/* Gráfico de Métodos de Pagamento - Clientes */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-purple-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm1 12a1 1 0 11-2 0V9a1 1 0 112 0v5zM10 6a1 1 0 100 2 1 1 0 000-2z" />
            </svg>
            Métodos de Pagamento - Clientes
          </h3>
          <div className="w-full max-w-xs">
            <Pie
              data={dataPaymentMethodsClientes}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: "#FFFFFF",
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${context.label}: ${context.parsed}`;
                      },
                    },
                  },
                },
              }}
              className="h-48 w-full"
            />
          </div>
        </div>

        {/* Mapa de Tráfego */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg col-span-1 lg:col-span-2 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5 3a2 2 0 00-2 2v2H1v2h2v8a2 2 0 002 2h12a2 2 0 002-2V9h2V7h-2V5a2 2 0 00-2-2H5z" />
            </svg>
            Tráfego por Estado
          </h2>
          <div className="flex-grow">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 600 }}
              className="w-full h-full rounded-lg"
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const stateName = geo.properties.name;
                    const trafego = dataTrafegoEstado[stateName] || 0;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={colorScale(trafego)}
                        onMouseEnter={() =>
                          setTooltipContent(`${stateName}: ${trafego.toLocaleString()} acessos`)
                        }
                        onMouseLeave={() => setTooltipContent("")}
                        style={{
                          default: { outline: "none", cursor: "pointer" },
                          hover: { fill: "#F53", outline: "none" },
                          pressed: { outline: "none" },
                        }}
                        data-tooltip-id="map-tooltip"
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </div>
          <ReactTooltip id="map-tooltip" place="top" effect="solid">
            {tooltipContent}
          </ReactTooltip>

          {/* Legenda do Mapa */}
          <div className="mt-4 flex justify-center flex-wrap space-x-2">
            {colorScale.range().map((color, index) => {
              const step = 5000 / colorScale.range().length;
              const min = step * index;
              const max = step * (index + 1);
              return (
                <span key={index} className="flex items-center m-1">
                  <div className="w-4 h-4" style={{ backgroundColor: color }}></div>
                  <span className="ml-2 text-sm">
                    {min === 0 ? `< ${max}` : `${min} - ${max}`}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstatisticasERelatorios;
