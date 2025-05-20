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
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar Superior */}
      <Navbar />

      <div className="flex flex-1">
        {/* Barra Lateral (Desktop) - Fixa */}
        {!isMobile && (
          <aside className="hidden lg:block fixed top-16 left-0 h-full w-64 lg:w-72 xl:w-80 bg-gray-800 shadow-lg overflow-y-auto transition-colors duration-300 z-50">
            <div className="p-6">
              {/* Perfil do Usuário */}
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  {/* Verifica se a imagem de perfil existe */}
                  {user?.companion?.profileImage ? (
                    <div>
                      <Image
                        src={user.companion.profileImage}
                        alt="Imagem de Perfil"
                        width={40}
                        height={40}
                        className="rounded-full w-10 h-10 object-cover"
                      />
                    </div>
                  ) : (
                    <span className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-pink-600 text-xl font-semibold">
                      {/* Exibe a inicial do nome */}
                      {user?.userName?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-xl font-semibold text-gray-100 truncate block max-w-[140px] lg:max-w-[190px] xl:max-w-[215px]">
                    {user ? `${user.userName}` : ""}
                  </span>

                  <p className="text-gray-400">Bem-vindo ao seu painel!</p>
                  {user?.companion?.points !== undefined && (
                    <span className="text-sm font-medium text-green-400">
                      Pontos: {user.companion.points}
                    </span>
                  )}
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
                {user?.companion?.profileImage ? (
                  <div>
                    <Image
                      src={user.companion.profileImage}
                      alt="Imagem de Perfil"
                      width={40}
                      height={40}
                      className="rounded-full w-10 h-10 object-cover"
                    />
                  </div>
                ) : (
                  <div className="mr-4">
                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-pink-600 text-xl font-semibold">
                      {/* Exibe a inicial do nome */}
                      {user?.userName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="ml-2">
                  <h2 className="text-lg font-semibold">
                    {user ? `${user?.userName}` : "Carregando..."}
                  </h2>
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

          {/* Sidebar Mobile */}
          <div
            ref={mobileMenuRef}
            className={`fixed top-0 left-0 h-full w-64 bg-gray-800 z-40 transform transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
          >
            {/* Perfil do Usuário */}
            <div className="flex items-center w-full p-4 mt-16">
              {userInfo?.companion?.profileImage ? (
                <div>
                  <Image
                    src={userInfo?.companion?.profileImage}
                    alt="Imagem de Perfil"
                    width={40}
                    height={40}
                    className="rounded-full w-10 h-10 mr-1 object-cover"
                  />
                </div>
              ) : (
                <div className="mr-4">
                  <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-pink-600 text-xl font-semibold">
                    {userInfo?.userName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                <div>
                  <h2 className="text-lg font-semibold text-gray-200 truncate max-w-[170px] sm:max-w-[180px]">
                    {userInfo ? `${userInfo?.userName}` : "Carregando..."}
                  </h2>

                </div>
                {user?.companion?.points !== undefined && (
                  <span className="text-sm font-medium text-green-400">
                    Pontos: {user.companion.points}
                  </span>
                )}
              </div>
            </div>

            <hr className="w-full border-gray-700 my-2" />

            <ul className="space-y-2 px-4">
              {menuTabs.map((tab) => (
                <li
                  key={tab.id}
                  className="flex text-gray-200 items-center cursor-pointer px-3 py-2 rounded-lg text-sm lg:text-base transition-colors duration-300 transform hover:bg-gray-700 hover:text-gray-100"
                  onClick={() => handleTabClick(tab.id)}
                >
                  <tab.icon className="mr-3 text-lg" />
                  {tab.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Área de Conteúdo da Aba Selecionada */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="max-w-6xl mx-auto">
              {/* Ativar perfil */}
              {showOnboarding && activeTab !== "city" && (
                <div className="bg-white border border-pink-300 rounded-xl p-4 mb-6 shadow-lg">
                  <h3 className="text-base font-bold text-pink-600 mb-3 flex items-center gap-2">
                    Ative seu perfil agora:
                  </h3>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Etapa: Cidade */}
                    {!user?.companion?.city || !user?.companion?.state ? (
                      <div className="flex items-center bg-pink-50 px-3 py-2 rounded-lg gap-3 flex-1">
                        <div className="bg-pink-500 text-white rounded-full p-2">
                          <FaMapMarkerAlt className="text-sm" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                            Adicione sua cidade
                            <span className="text-xs font-semibold text-pink-500 ml-2">+100 pontos</span>
                          </p>
                          <button
                            onClick={() => handleTabClick("city")}
                            className="mt-1 text-xs bg-pink-500 hover:bg-pink-600 text-white py-1 px-3 rounded-full"
                          >
                            Atualizar
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {/* Etapa: Plano */}
                    {!user?.companion?.planId || !user?.companion?.planTypeId ? (
                      <div className="flex items-center bg-pink-50 px-3 py-2 rounded-lg gap-3 flex-1">
                        <div className="bg-pink-500 text-white rounded-full p-2">
                          <FaDollarSign className="text-sm" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                            Escolha um plano
                            <span className="text-xs font-semibold text-pink-500 ml-2">+100 pontos</span>
                          </p>
                          <button
                            onClick={() => router.push("/planos")}
                            className="mt-1 text-xs bg-pink-500 hover:bg-pink-600 text-white py-1 px-3 rounded-full"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-pink-600">Ative seu perfil agora</h2>
              <button
                onClick={() => setShowOnboardingModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {!user?.companion?.city || !user?.companion?.state ? (
                <div className="flex items-center bg-pink-50 px-3 py-2 rounded-lg gap-3">
                  <div className="bg-pink-500 text-white rounded-full p-2">
                    <FaMapMarkerAlt className="text-sm" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                      Adicione sua cidade
                      <span className="text-xs font-semibold text-pink-500 ml-2">+100 pontos</span>
                    </p>
                    <button
                      onClick={() => {
                        setShowOnboardingModal(false);
                        handleTabClick("city");
                      }}
                      className="mt-1 text-xs bg-pink-500 hover:bg-pink-600 text-white py-1 px-3 rounded-full"
                    >
                      Atualizar
                    </button>
                  </div>
                </div>
              ) : null}

              {!user?.companion?.planId || !user?.companion?.planTypeId ? (
                <div className="flex items-center bg-pink-50 px-3 py-2 rounded-lg gap-3">
                  <div className="bg-pink-500 text-white rounded-full p-2">
                    <FaDollarSign className="text-sm" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                      Escolha um plano
                      <span className="text-xs font-semibold text-pink-500 ml-2">+100 pontos</span>
                    </p>
                    <button
                      onClick={() => {
                        setShowOnboardingModal(false);
                        router.push("/planos");
                      }}
                      className="mt-1 text-xs bg-pink-500 hover:bg-pink-600 text-white py-1 px-3 rounded-full"
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
