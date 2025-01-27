"use client";
import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaStar,
  FaList,
  FaHistory,
  FaUsers,
  FaVideo,
  FaGlobe,
  FaCrown,
  FaMoneyCheckAlt,
  FaUserCog,
  FaLifeRing,
  FaInfoCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import LoginNavbar from "@/components/LoginNavbar";
import Modal from "@/components/dashboard/Modal";
import UserMetrics from "@/components/userDashboard/UserMetrics";
import UserMetricsMobile from "@/components/userDashboard/UserMetricsMobile";
import UserProfileSettings from "@/components/userDashboard/UserProfileSettings";
import UserReviewManagement from "@/components/userDashboard/UserReviewManagement";
import UserHistory from "@/components/userDashboard/UserHistory";
import UserVirtualListing from "@/components/userDashboard/UserVirtualListing";
import UserPremium from "@/components/userDashboard/UserPremium";
import UserPlanManagement from "@/components/userDashboard/UserPlanManagement";
import UserSupport from "@/components/userDashboard/UserSupport";
import UserImportantInfo from "@/components/userDashboard/UserImportantInfo";
import useMediaQuery from "@/hooks/useMediaQuery";
import Image from "next/image";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("painel");
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const menuTabs = [
    { id: "painel", label: "Seu painel", icon: FaTachometerAlt },
    { id: "reviews", label: "Seus reviews", icon: FaStar },
    { id: "historico", label: "Seu histórico", icon: FaHistory },
    { id: "listagem", label: "Listagem virtual", icon: FaGlobe },
    { id: "premium", label: "Seja Faixa Rosa premium", icon: FaCrown },
    { id: "planos", label: "Gerenciar planos", icon: FaMoneyCheckAlt },
    { id: "configuracoes", label: "Configurações do cadastro", icon: FaUserCog },
    { id: "suporte", label: "Suporte Faixa Rosa", icon: FaLifeRing },
    { id: "informacoes", label: "Informações importantes", icon: FaInfoCircle },
    // Se precisar adicionar "acompanhantes" e "videos", adicione aqui
  ];

  const handleTabClick = (tab) => {
    // Removido o tratamento de abas não presentes em menuTabs
    setActiveTab(tab);
    if (isMobile) setMobileMenuOpen(false);
  };

  const handleModalToggle = () => {
    setModalOpen((prev) => !prev);
  };

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
                  src="/images/user.jpg"
                  alt="João Ribeiro"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-100">João Ribeiro</h2>
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
                  src="/images/user.jpg"
                  alt="João Ribeiro"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <h2 className="text-lg font-semibold">João Ribeiro</h2>
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
            {activeTab === "painel" && (
              <div className="w-full">
                {isMobile ? (
                  <UserMetricsMobile className="w-full" />
                ) : (
                  <UserMetrics className="w-full" />
                )}
              </div>
            )}
            {activeTab === "reviews" && <UserReviewManagement />}
            {activeTab === "historico" && <UserHistory />}
            {activeTab === "listagem" && <UserVirtualListing />}
            {activeTab === "premium" && (
              <UserPremium onUpgrade={handleModalToggle} />
            )}
            {activeTab === "planos" && <UserPlanManagement />}
            {activeTab === "configuracoes" && <UserProfileSettings />}
            {activeTab === "suporte" && <UserSupport />}
            {activeTab === "informacoes" && <UserImportantInfo />}
          </div>
        </main>
      </div>

      {/* Modal de Upgrade para Premium */}
      {modalOpen && (
        <Modal
          onClose={handleModalToggle}
          title="Upgrade para Premium"
          description="Para se tornar um usuário Faixa Rosa Premium, você precisa adquirir o plano premium."
        >
          <div className="text-center">
            <p className="text-gray-700 mb-4">
              Custo:{" "}
              <span className="font-bold text-pink-500">R$99,90</span>
            </p>
            <button
              className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition"
              onClick={() => {
                alert("Pagamento confirmado! Agora você é Premium!");
                handleModalToggle();
              }}
            >
              Confirmar Pagamento
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserDashboard;
