"use client";
import React, { useState, useContext, useEffect, useRef } from "react";
import {
  FaUsersCog,
  FaPhotoVideo,
  FaCogs,
  FaFileInvoiceDollar,
  FaShieldAlt,
  FaWrench,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSearch,
  FaBell,
  FaHome,
  FaChevronRight,
  FaPlus,
  FaSortAmountDown,
  FaSortAmountUp
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar";
import Modal from "../../components/adminDashboard/Modal";
import useMediaQuery from "../../hooks/useMediaQuery";
import Anunciantes from "../../components/adminDashboard/Anunciantes";
import Clientes from "../../components/adminDashboard/Clientes";
import Denuncias from "../../components/adminDashboard/Denuncias";
import { AuthContext } from "../../context/AuthContext";
import GerenciamentoDePlanos from "../../components/adminDashboard/planos/GerenciamentoDePlanos";
import GerenciamentoDeAssinaturas from "../../components/adminDashboard/planos/GerenciamentoDeAssinaturas";

// Componente Placeholder aprimorado
const Placeholder = ({ title, items = [], icon: Icon }) => (
  <motion.div
    className="p-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="text-center mb-8">
      {Icon && (
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl mb-4">
          <Icon className="text-2xl text-white" />
        </div>
      )}
      <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
        {title}
      </h2>
    </div>

    {items.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">{item}</span>
            </div>
          </motion.div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
          <FaWrench className="text-2xl text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg mb-4">Funcionalidade em desenvolvimento</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-sm font-medium">
          <FaPlus size={12} />
          Em breve disponível
        </div>
      </div>
    )}
  </motion.div>
);

const AdminDashboardContent = () => {
  const [activeMainTab, setActiveMainTab] = useState("usuarios");
  const [activeSubTab, setActiveSubTab] = useState("anunciantes");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState(3); // Exemplo de notificações
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" = mais novos primeiro, "asc" = mais antigos primeiro
  const mobileMenuRef = useRef(null);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const { logout } = useContext(AuthContext);

  // Fechar menu mobile ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  // Definição do Menu Principal aprimorado
  const menuItems = [
    {
      id: "usuarios",
      label: "Gerenciamento de Usuários",
      icon: FaUsersCog,
      color: "from-blue-500 to-blue-600",
      subItems: [
        { id: "anunciantes", label: "Anunciantes", badge: "12 novos" },
        { id: "clientes", label: "Clientes", badge: null },
      ],
    },
    {
      id: "conteudo",
      label: "Gerenciamento de Conteúdo",
      icon: FaPhotoVideo,
      color: "from-purple-500 to-purple-600",
      subItems: [
        { id: "fotos_videos", label: "Fotos e Vídeos", badge: "5 pendentes" },
        { id: "stories", label: "Stories", badge: null },
        { id: "textos_perf", label: "Textos e Perfis", badge: null },
      ],
    },
    {
      id: "planos",
      label: "Planos e Assinaturas",
      icon: FaCogs,
      color: "from-green-500 to-green-600",
      subItems: [
        { id: "gerPlanos", label: "Gerenciamento de Planos", badge: null },
        { id: "gerAssinaturas", label: "Gerenciamento de Assinaturas", badge: "3 expiradas" },
      ],
    },
    {
      id: "pagamentos",
      label: "Pagamentos",
      icon: FaFileInvoiceDollar,
      color: "from-yellow-500 to-yellow-600",
      subItems: [],
    },
    {
      id: "moderacao",
      label: "Segurança e Moderação",
      icon: FaShieldAlt,
      color: "from-red-500 to-pink-600",
      subItems: [
        { id: "denuncias", label: "Denúncias", badge: null },
      ],
    },
  ];

  // Animações para transições
  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  const handleMainTabClick = (tabId) => {
    if (activeMainTab === tabId) return; // Evita re-render desnecessário

    setIsLoading(true);
    setActiveMainTab(tabId);

    const mainItem = menuItems.find((item) => item.id === tabId);
    if (mainItem && mainItem.subItems && mainItem.subItems.length > 0) {
      setActiveSubTab(mainItem.subItems[0].id);
    } else {
      setActiveSubTab("");
    }

    if (isMobile) setMobileMenuOpen(false);

    // Simula loading (remover em produção se não houver carregamento real)
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleSubTabClick = (subId) => {
    if (activeSubTab === subId) return;

    setIsLoading(true);
    setActiveSubTab(subId);
    if (isMobile) setMobileMenuOpen(false);

    setTimeout(() => setIsLoading(false), 200);
  };

  const handleLogout = () => {
    logout();
  };

  // Função para alternar ordenação
  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === "desc" ? "asc" : "desc");
  };

  // Renderização do conteúdo com loading
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      );
    }

    // Usuários
    if (activeMainTab === "usuarios") {
      if (activeSubTab === "anunciantes") {
        return <Anunciantes sortOrder={sortOrder} />;
      } else if (activeSubTab === "clientes") {
        return <Clientes sortOrder={sortOrder} />;
      }
    }

    // Conteúdo
    if (activeMainTab === "conteudo") {
      if (activeSubTab === "fotos_videos") {
        return (
          <Placeholder
            title="Fotos e Vídeos"
            icon={FaPhotoVideo}
            items={[
              "Aprovação Manual/Automática de Mídias",
              "Remoção de Conteúdo que Viole Regras da Plataforma",
              "Controle de Marca d'Água Personalizada",
              "Sistema de Moderação por IA",
              "Relatórios de Conteúdo Aprovado/Rejeitado",
              "Backup Automático de Mídias Aprovadas"
            ]}
          />
        );
      } else if (activeSubTab === "stories") {
        return (
          <Placeholder
            title="Stories"
            icon={FaPhotoVideo}
            items={[
              "Análise/Remoção de Conteúdo Impróprio",
              "Gerenciamento de Tempo de Exibição (24h)",
              "Estatísticas de Visualização",
              "Moderação Automática por Palavras-chave"
            ]}
          />
        );
      } else if (activeSubTab === "textos_perf") {
        return (
          <Placeholder
            title="Textos e Perfis"
            icon={FaPhotoVideo}
            items={[
              "Moderação de Descrições de Perfis",
              "Verificação de Palavras Proibidas",
              "Editor de Perfil Administrativo",
              "Histórico de Alterações"
            ]}
          />
        );
      }
    }

    // Planos e Assinaturas
    if (activeMainTab === "planos") {
      if (activeSubTab === "gerPlanos") {
        return <GerenciamentoDePlanos />;
      } else if (activeSubTab === "gerAssinaturas") {
        return <GerenciamentoDeAssinaturas />;
      }
    }

    // Pagamentos
    if (activeMainTab === "pagamentos") {
      return (
        <Placeholder
          title="Pagamentos"
          icon={FaFileInvoiceDollar}
          items={[
            "Integração com Gateways de Pagamento (PIX, Cartão)",
            "Visualização/Controle de Transações em Tempo Real",
            "Aprovação Manual de Pagamentos Pendentes",
            "Gerenciamento de Saques e Transferências",
            "Relatórios Financeiros Detalhados",
            "Dashboard de Receitas e Comissões",
            "Sistema de Estorno e Reembolsos",
            "Configuração de Taxas e Comissões"
          ]}
        />
      );
    }

    if (activeMainTab === "moderacao") {
      if (activeSubTab === "denuncias") {
        return <Denuncias />;
      }
    }


    return <Placeholder title="Selecione uma opção do menu" icon={FaHome} />;
  };

  // Obter informações para breadcrumb
  const activeMain = menuItems.find((m) => m.id === activeMainTab);
  const activeMainLabel = activeMain ? activeMain.label : "";
  const activeSub = activeMain && activeMain.subItems.find((s) => s.id === activeSubTab);
  const activeSubLabel = activeSub ? activeSub.label : "";

  // Componente de Badge
  const Badge = ({ children, variant = "primary" }) => {
    const variants = {
      primary: "bg-pink-500 text-white",
      warning: "bg-yellow-500 text-white",
      success: "bg-green-500 text-white",
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${variants[variant]}`}>
        {children}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      {/* Navbar Superior */}
      <Navbar />

      <div className="flex flex-1 relative">
        {/* Sidebar Desktop */}
        {!isMobile && (
          <aside className="hidden md:block fixed top-16 left-0 h-full w-64 lg:w-72 xl:w-80 bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl overflow-y-auto z-40 border-r border-gray-700">
            <div className="p-6">
              {/* Barra de destaque */}
              <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full mb-6"></div>

              {/* Header do Admin */}
              <motion.div
                className="flex items-center mb-8 p-4 bg-gray-700/50 rounded-xl border border-gray-600/50"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mr-4 relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <FaShieldAlt className="text-white text-xl" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-white">Administração</h2>
                  <p className="text-gray-300 text-sm">Painel de Controle</p>
                  {notifications > 0 && (
                    <div className="mt-2 inline-flex items-center gap-2">
                      <FaBell className="text-yellow-400 text-sm" />
                      <span className="text-xs font-bold text-yellow-400">{notifications} notificações</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Barra de Busca */}
              <div className="relative mb-6">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar funcionalidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              {/* Menu Principal */}
              <ul className="space-y-2">
                {menuItems
                  .filter(item =>
                    searchTerm === "" ||
                    item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.subItems.some(sub => sub.label.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map((item, index) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div
                        className={`flex items-center cursor-pointer px-4 py-3 rounded-xl text-sm lg:text-base transition-all duration-200 ${activeMainTab === item.id
                          ? `bg-gradient-to-r ${item.color}/20 text-white border border-pink-500/30`
                          : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                          }`}
                        onClick={() => handleMainTabClick(item.id)}
                      >
                        <item.icon className="mr-3 text-lg" />
                        <span className="flex-1">{item.label}</span>
                        {activeMainTab === item.id && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-pink-500"></div>
                        )}
                      </div>

                      {/* Submenu */}
                      <AnimatePresence>
                        {activeMainTab === item.id && item.subItems && item.subItems.length > 0 && (
                          <motion.ul
                            className="ml-8 mt-2 space-y-1"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.subItems.map((sub) => (
                              <motion.li
                                key={sub.id}
                                onClick={() => handleSubTabClick(sub.id)}
                                className={`cursor-pointer text-sm px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between ${activeSubTab === sub.id
                                  ? "bg-gray-600 text-gray-100"
                                  : "text-gray-300 hover:bg-gray-700/50 hover:text-gray-100"
                                  }`}
                                whileHover={{ x: 4 }}
                              >
                                <span>{sub.label}</span>
                                {sub.badge && (
                                  <Badge variant="warning">{sub.badge}</Badge>
                                )}
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  ))}

                {/* Logout */}
                <motion.li
                  className="flex items-center cursor-pointer px-4 py-3 rounded-xl text-sm lg:text-base transition-all duration-200 text-gray-300 hover:bg-red-500/20 hover:text-red-400 mt-8 border-t border-gray-700 pt-4"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaSignOutAlt className="mr-3 text-lg" />
                  Sair
                </motion.li>
              </ul>
            </div>
          </aside>
        )}

        {/* Conteúdo Principal */}
        <main
          className={`flex-1 container mx-auto px-4 py-8 mt-16 transition-all duration-300 ${!isMobile ? "ml-64 lg:ml-72 xl:ml-80" : ""
            }`}
        >
          {/* Header Mobile */}
          {isMobile && (
            <motion.div
              className="flex justify-between items-center bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6 border border-gray-200/50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                  <FaShieldAlt className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Administração</h2>
                  <p className="text-gray-600 text-sm">Painel de Controle</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Indicador de ordenação no mobile - apenas para abas de usuários */}
                {activeMainTab === "usuarios" && (
                  <motion.button
                    onClick={toggleSortOrder}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-2 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={sortOrder === "desc" ? "Mais novos primeiro" : "Mais antigos primeiro"}
                  >
                    {sortOrder === "desc" ? (
                      <FaSortAmountDown size={16} />
                    ) : (
                      <FaSortAmountUp size={16} />
                    )}
                  </motion.button>
                )}

                {notifications > 0 && (
                  <div className="relative">
                    <FaBell className="text-gray-600 text-xl" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  </div>
                )}
                <button
                  className="text-white p-2 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
              </div>
            </motion.div>
          )}

          {/* Overlay Mobile */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar Mobile */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                ref={mobileMenuRef}
                className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-800 to-gray-900 z-40 border-r border-gray-700"
                initial={{ x: -264 }}
                animate={{ x: 0 }}
                exit={{ x: -264 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>

                <div className="p-4 mt-16">
                  {/* Busca Mobile */}
                  <div className="relative mb-4">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                    />
                  </div>

                  <ul className="space-y-2">
                    {menuItems
                      .filter(item =>
                        searchTerm === "" ||
                        item.label.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((item) => (
                        <li key={item.id}>
                          <div
                            className="flex items-center cursor-pointer px-3 py-3 rounded-xl text-sm transition-all duration-200 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                            onClick={() => handleMainTabClick(item.id)}
                          >
                            <item.icon className="mr-3 text-lg" />
                            {item.label}
                          </div>
                          {activeMainTab === item.id && item.subItems && item.subItems.length > 0 && (
                            <ul className="ml-8 mt-2 space-y-1">
                              {item.subItems.map((sub) => (
                                <li
                                  key={sub.id}
                                  onClick={() => handleSubTabClick(sub.id)}
                                  className="cursor-pointer text-sm text-gray-300 px-2 py-2 rounded transition-colors hover:bg-gray-700/50 hover:text-gray-100 flex items-center justify-between"
                                >
                                  <span>{sub.label}</span>
                                  {sub.badge && (
                                    <Badge variant="warning">{sub.badge}</Badge>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Breadcrumb Melhorado */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <nav className="bg-white/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaHome className="text-pink-500" />
                  <span className="font-medium">Painel de Controle</span>
                  {activeMainLabel && (
                    <>
                      <FaChevronRight className="text-gray-400" size={12} />
                      <span className="font-medium text-gray-800">{activeMainLabel}</span>
                    </>
                  )}
                  {activeSubLabel && (
                    <>
                      <FaChevronRight className="text-gray-400" size={12} />
                      <span className="font-semibold text-pink-600">{activeSubLabel}</span>
                    </>
                  )}
                </div>

                {/* Botão de Ordenação - Aparece apenas nas abas de usuários */}
                {activeMainTab === "usuarios" && (
                  <motion.button
                    onClick={toggleSortOrder}
                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={sortOrder === "desc" ? "Ordenado: Mais novos primeiro" : "Ordenado: Mais antigos primeiro"}
                  >
                    {sortOrder === "desc" ? (
                      <>
                        <FaSortAmountDown size={14} />
                        <span className="hidden sm:inline">Mais Novos</span>
                      </>
                    ) : (
                      <>
                        <FaSortAmountUp size={14} />
                        <span className="hidden sm:inline">Mais Antigos</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </nav>
          </motion.div>

          {/* Área de Conteúdo Dinâmico */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-gray-200/50"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key={`${activeMainTab}-${activeSubTab}`}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <Modal
            onClose={() => setModalOpen(false)}
            title="Ação de Administração"
            description="Descrição da ação que está sendo confirmada."
          >
            <div className="text-center">
              <p className="text-gray-700 mb-4 text-sm">Detalhes adicionais sobre a ação.</p>
              <button
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
                onClick={() => setModalOpen(false)}
              >
                Confirmar
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboardContent;