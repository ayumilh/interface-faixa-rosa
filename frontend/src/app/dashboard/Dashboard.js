"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import {
  FaEdit,
  FaPhotoVideo,
  FaDollarSign,
  FaMapMarkerAlt,
  FaRegClock,
  FaCogs,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
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

const Dashboard = () => {
  const { userInfo, fetchUserData } = useContext(AuthContext);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const mobileMenuRef = useRef(null);

  // Chama fetchUserData quando o componente é carregado ou quando userInfo muda
  useEffect(() => {
    if (!userInfo) {
      fetchUserData(); // Chama a função para buscar os dados se userInfo estiver vazio
    } else {
      setUser(userInfo); // Se userInfo já estiver disponível, apenas define os dados no estado
    }
  }, [userInfo, fetchUserData]);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  useEffect(() => {
    if (userInfo?.userType === "ACOMPANHANTE") {
      const companionData = userInfo?.companion;

      const isMissingCity = !companionData?.city || !companionData?.state;
      const isMissingPlan = !companionData?.planId || !companionData?.planTypeId;

      if (isMissingCity || isMissingPlan) {
        setShowOnboarding(true);
      }
    }
  }, [userInfo]);

  useEffect(() => {
    if (showOnboarding) {
      setShowOnboardingModal(true);
    }
  }, [showOnboarding]);

  // Detecta se está em mobile
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (isMobile) setMobileMenuOpen(false);
  };

  const handleModalToggle = () => {
    setModalOpen((prev) => !prev);
  };

  // Fecha o menu mobile ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Definição dos itens do menu
  const menuTabs = [
    { id: "profile", label: "Perfil", icon: FaCogs },
    { id: "description", label: "Descrição", icon: FaEdit },
    { id: "metrics", label: "Contato", icon: FaPhotoVideo },
    { id: "services", label: "Serviços", icon: FaDollarSign },
    { id: "hours", label: "Horários", icon: FaRegClock },
    { id: "city", label: "Cidade", icon: FaMapMarkerAlt },
    { id: "finance", label: "Financeiro", icon: FaDollarSign },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      {/* Navbar Superior */}
      <Navbar />

      <div className="flex flex-1">
        {/* Barra Lateral (Desktop) - Fixa */}
        {!isMobile && (
          <aside 
            className="hidden lg:block fixed top-16 left-0 h-full w-64 lg:w-72 xl:w-80 bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl overflow-y-auto transition-all duration-300 z-50 border-r border-gray-700"
          >
            <div className="p-6">
              {/* Barra de destaque no topo */}
              <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full mb-6"></div>
              
              {/* Perfil do Usuário */}
              <div className="flex items-center mb-8 p-4 bg-gray-700/50 rounded-xl border border-gray-600/50">
                <div className="mr-4 relative">
                  {user?.companion?.profileImage ? (
                    <div className="relative">
                      <Image
                        src={user.companion.profileImage}
                        alt="Imagem de Perfil"
                        width={48}
                        height={48}
                        className="rounded-full w-12 h-12 object-cover border-2 border-pink-500"
                      />
                    </div>
                  ) : (
                    <span 
                      className="w-12 h-12 flex items-center justify-center rounded-full text-white text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500"
                    >
                      {user?.userName?.charAt(0).toUpperCase()}
                    </span>
                  )}
                  {/* Status online */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white truncate block max-w-[140px] lg:max-w-[190px] xl:max-w-[215px]">
                    {user ? `${user.userName}` : ""}
                  </h3>
                  <p className="text-gray-300 text-sm">Bem-vindo ao seu painel!</p>
                  {user?.companion?.points !== undefined && (
                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                      ✨ {user.companion.points} pontos
                    </div>
                  )}
                </div>
              </div>

              {/* Menu Lateral */}
              <ul className="space-y-2">
                {menuTabs.map((tab) => (
                  <li
                    key={tab.id}
                    className={`flex items-center cursor-pointer px-4 py-3 rounded-xl text-sm lg:text-base transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white border border-pink-500/30"
                        : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    }`}
                    onClick={() => handleTabClick(tab.id)}
                  >
                    <tab.icon className="mr-3 text-lg" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-pink-500"></div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}

        {/* Conteúdo Principal */}
        <main
          className={`flex-1 container mx-auto px-4 py-8 mt-16 transition-all duration-300 ${
            !isMobile ? "ml-64 lg:ml-72 xl:ml-80" : ""
          }`}
        >
          {/* Cabeçalho do Usuário (Mobile) */}
          {isMobile && (
            <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6 border border-gray-200/50">
              <div className="flex items-center">
                {user?.companion?.profileImage ? (
                  <div>
                    <Image
                      src={user.companion.profileImage}
                      alt="Imagem de Perfil"
                      width={40}
                      height={40}
                      className="rounded-full w-10 h-10 object-cover border-2 border-pink-500"
                    />
                  </div>
                ) : (
                  <div className="mr-4">
                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xl font-bold">
                      {user?.userName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="ml-2">
                  <h2 className="text-lg font-bold text-gray-800">
                    {user ? `${user?.userName}` : "Carregando..."}
                  </h2>
                  <p className="text-gray-600 text-sm">Bem-vindo ao seu painel!</p>
                </div>
              </div>
              
              <button
                className="text-white p-2 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          )}

          {/* Overlay para mobile menu */}
          {mobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar Mobile */}
          <div
            ref={mobileMenuRef}
            className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-800 to-gray-900 z-40 transform transition-transform duration-300 border-r border-gray-700 ${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Barra de destaque no topo */}
            <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
            
            {/* Perfil do Usuário */}
            <div className="flex items-center w-full p-4 mt-16 mb-4">
              {userInfo?.companion?.profileImage ? (
                <div>
                  <Image
                    src={userInfo?.companion?.profileImage}
                    alt="Imagem de Perfil"
                    width={40}
                    height={40}
                    className="rounded-full w-10 h-10 mr-3 object-cover border-2 border-pink-500"
                  />
                </div>
              ) : (
                <div className="mr-4">
                  <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xl font-bold">
                    {userInfo?.userName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-white truncate max-w-[170px] sm:max-w-[180px]">
                  {userInfo ? `${userInfo?.userName}` : "Carregando..."}
                </h2>
                {user?.companion?.points !== undefined && (
                  <span className="text-sm font-bold text-green-400">
                    ✨ {user.companion.points} pontos
                  </span>
                )}
              </div>
            </div>

            <div className="w-full border-t border-gray-700 my-2"></div>

            <ul className="space-y-2 px-4">
              {menuTabs.map((tab) => (
                <li
                  key={tab.id}
                  className="flex text-gray-300 items-center cursor-pointer px-3 py-3 rounded-xl text-sm transition-all duration-200 hover:bg-gray-700/50 hover:text-white border border-transparent hover:border-gray-600/50"
                  onClick={() => handleTabClick(tab.id)}
                >
                  <tab.icon className="mr-3 text-lg" />
                  {tab.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Área de Conteúdo da Aba Selecionada */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl p-6 border border-gray-200/50">
            <div className="max-w-6xl mx-auto">
              {/* Ativar perfil */}
              {showOnboarding && activeTab !== "city" && (
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-300/50 rounded-xl p-6 mb-8 shadow-lg">
                  <h3 className="text-lg font-bold text-pink-600 mb-4 flex items-center gap-2">
                    ✨ Ative seu perfil agora:
                  </h3>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Etapa: Cidade */}
                    {!user?.companion?.city || !user?.companion?.state ? (
                      <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl gap-4 flex-1 border border-pink-200/50 shadow-md">
                        <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full p-3">
                          <FaMapMarkerAlt className="text-sm" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            Adicione sua cidade
                            <span className="text-xs font-bold text-pink-500">+100 pontos</span>
                          </p>
                          <button
                            onClick={() => handleTabClick("city")}
                            className="mt-2 text-xs bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-2 px-4 rounded-full font-bold transition-all duration-200"
                          >
                            Atualizar
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {/* Etapa: Plano */}
                    {!user?.companion?.planId || !user?.companion?.planTypeId ? (
                      <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl gap-4 flex-1 border border-pink-200/50 shadow-md">
                        <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full p-3">
                          <FaDollarSign className="text-sm" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            Escolha um plano
                            <span className="text-xs font-bold text-pink-500">+100 pontos</span>
                          </p>
                          <button
                            onClick={() => router.push("/planos")}
                            className="mt-2 text-xs bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-2 px-4 rounded-full font-bold transition-all duration-200"
                          >
                            Ver planos
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            {/* Conteúdo das Abas */}
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

      {/* Modal de Onboarding */}
      {showOnboardingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-200/50">
            {/* Barra de destaque no topo */}
            <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full mb-6 -mt-2 -mx-2"></div>
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-pink-600">✨ Ative seu perfil agora</h2>
              <button
                onClick={() => setShowOnboardingModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none p-2 rounded-xl transition-colors duration-200"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {!user?.companion?.city || !user?.companion?.state ? (
                <div className="flex items-center bg-gradient-to-r from-pink-50 to-purple-50 px-4 py-3 rounded-xl gap-4 border border-pink-200/50">
                  <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full p-3">
                    <FaMapMarkerAlt className="text-sm" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      Adicione sua cidade
                      <span className="text-xs font-bold text-pink-500">+100 pontos</span>
                    </p>
                    <button
                      onClick={() => {
                        setShowOnboardingModal(false);
                        handleTabClick("city");
                      }}
                      className="mt-2 text-xs bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-2 px-4 rounded-full font-bold transition-all duration-200"
                    >
                      Atualizar
                    </button>
                  </div>
                </div>
              ) : null}

              {!user?.companion?.planId || !user?.companion?.planTypeId ? (
                <div className="flex items-center bg-gradient-to-r from-pink-50 to-purple-50 px-4 py-3 rounded-xl gap-4 border border-pink-200/50">
                  <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full p-3">
                    <FaDollarSign className="text-sm" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      Escolha um plano
                      <span className="text-xs font-bold text-pink-500">+100 pontos</span>
                    </p>
                    <button
                      onClick={() => {
                        setShowOnboardingModal(false);
                        router.push("/planos");
                      }}
                      className="mt-2 text-xs bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-2 px-4 rounded-full font-bold transition-all duration-200"
                    >
                      Ver planos
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;