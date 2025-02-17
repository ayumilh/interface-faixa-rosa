"use client";
import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaPhotoVideo,
  FaDollarSign,
  FaMapMarkerAlt,
  FaRegClock,
  FaCogs,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import LoginNavbar from "@/components/LoginNavbar"; // Certifique-se de que está importando o LoginNavbar correto
import Modal from "@/components/dashboard/Modal";
import Image from "next/image";
import Metrics from "@/components/dashboard/Metrics";
import MetricsMobile from "@/components/dashboard/MetricsMobile";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import FinancialControl from "@/components/dashboard/FinancialControl";
import DescriptionManagement from "@/components/dashboard/DescriptionManagement";
import ServicesManagement from "@/components/dashboard/ServicesManagement";
import WorkingHours from "@/components/dashboard/WorkingHours";
import CityManagement from "@/components/dashboard/CityManagement";
import MediaManagement from "@/components/dashboard/MediaManagement";
import useMediaQuery from "@/hooks/useMediaQuery";
import { searchUserId } from "@/utils/searchUserId";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("metrics");
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Buscar dados do usuário
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await searchUserId();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUser();
  }, []);

  // Detecta se está em mobile
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (isMobile) setMobileMenuOpen(false);
  };

  const handleModalToggle = () => {
    setModalOpen((prev) => !prev);
  };

  // Definição dos itens do menu
  const menuTabs = [
    { id: "profile", label: "Perfil", icon: FaCogs },
    { id: "description", label: "Descrição", icon: FaEdit },
    { id: "metrics", label: "Métricas", icon: FaPhotoVideo },
    { id: "services", label: "Serviços", icon: FaDollarSign },
    { id: "hours", label: "Horários", icon: FaRegClock },
    { id: "city", label: "Cidade", icon: FaMapMarkerAlt },
    { id: "finance", label: "Financeiro", icon: FaDollarSign },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar Superior */}
      <LoginNavbar />

      <div className="flex flex-1">
        {/* Barra Lateral (Desktop) - Fixa */}
        {!isMobile && (
          <aside className="hidden md:block fixed top-16 left-0 h-full w-64 lg:w-72 xl:w-80 bg-gray-800 shadow-lg overflow-y-auto transition-colors duration-300 z-50">
            <div className="p-6">
              {/* Perfil do Usuário */}
              <div className="flex items-center mb-6">
                <Image
                  src={"/images/user.jpg"}
                  alt="Usuário"
                  width={120}
                  height={48}
                  className="w-12 h-12 rounded-full mr-3 transition-all duration-300 hover:scale-110"
                />
                <div>
                  <span
                    className="text-xl font-semibold text-gray-100"
                    style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {user ? `${user.firstName} ${user.lastName}` : "Carregando..."}
                  </span>
                  <p className="text-gray-400">Bem-vindo ao seu painel!</p>
                </div>
              </div>

              {/* Menu Lateral */}
              <ul className="space-y-2">
                {menuTabs.map((tab) => (
                  <li
                    key={tab.id}
                    className={`flex items-center cursor-pointer px-3 py-2 rounded-lg text-sm lg:text-base transition-colors duration-300 transform ${activeTab === tab.id
                      ? "bg-gray-700 text-gray-300 scale-105"
                      : "text-gray-200 hover:bg-gray-700 hover:text-gray-100"
                      }`}
                    onClick={() => handleTabClick(tab.id)}
                  >
                    <tab.icon className="mr-3 text-lg transition-transform duration-300" />
                    {tab.label}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}

        {/* Conteúdo Principal */}
        <main
          className={`flex-1 container mx-auto px-4 py-8 mt-16 transition-all duration-300 ${!isMobile ? "ml-64 lg:ml-72 xl:ml-80" : ""
            }`}
        >
          {/* Cabeçalho do Usuário (Mobile) */}
          {isMobile && (
            <div className="flex justify-between items-center bg-white rounded-lg shadow p-4 mb-4">
              <div className="flex items-center">
                <Image
                  src={"/images/user.jpg"}
                  alt="Usuário"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <h2 className="text-lg font-semibold">{user ? `${user.firstName} ${user.lastName}` : "Carregando..."}</h2>
                  <p className="text-gray-600">Bem-vindo ao seu painel!</p>
                </div>
              </div>
              <button
                className="text-gray-800 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          )}

          {/* Menu Mobile Deslizante */}
          {isMobile && mobileMenuOpen && (
            <div className="mb-4 bg-gray-800 rounded-lg shadow p-4 transition-colors duration-300">
              <ul className="space-y-2">
                {menuTabs.map((tab) => (
                  <li
                    key={tab.id}
                    className={`flex items-center cursor-pointer px-3 py-2 rounded-lg text-sm lg:text-base transition-colors duration-300 transform ${activeTab === tab.id
                      ? "bg-gray-700 text-gray-300 scale-105"
                      : "text-gray-200 hover:bg-gray-700 hover:text-gray-100"
                      }`}
                    onClick={() => handleTabClick(tab.id)}
                  >
                    <tab.icon className="mr-3 text-lg transition-transform duration-300" />
                    {tab.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Área de Conteúdo da Aba Selecionada */}
          <div className="bg-white shadow rounded-lg p-6">
            {activeTab === "metrics" && (
              <div className="w-full">
                {isMobile ? (
                  <MetricsMobile className="w-full h-auto" />
                ) : (
                  <Metrics className="w-full h-auto" />
                )}
              </div>
            )}
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "description" && <DescriptionManagement />}
            {activeTab === "services" && <ServicesManagement />}
            {activeTab === "hours" && <WorkingHours />}
            {activeTab === "city" && <CityManagement onPlanUpgrade={handleModalToggle} />}
            {activeTab === "media" && <MediaManagement />}
            {activeTab === "finance" && <FinancialControl />}
          </div>
        </main>
      </div>

      {/* Modal de Pagamento para Troca de Cidade */}
      {modalOpen && (
        <Modal
          onClose={handleModalToggle}
          title="Troca de Cidade"
          description="Para realizar a troca de cidade, você precisa adquirir o plano de troca."
        >
          <div className="text-center">
            <p className="text-gray-700 mb-4">
              Custo: <span className="font-bold text-pink-500">R$49,90</span>
            </p>
            <button
              className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition"
              onClick={handleModalToggle}
            >
              Confirmar Pagamento
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
