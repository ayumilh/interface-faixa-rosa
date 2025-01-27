"use client";
import { checkSession } from '@/utils/checkSession';
import React, { useState } from "react";
import {
  FaUsersCog,
  FaPhotoVideo,
  FaCogs,
  FaFileInvoiceDollar,
  FaShieldAlt,
  FaChartLine,
  FaBullhorn,
  FaPalette,
  FaLifeRing,
  FaWrench,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import LoginNavbar from "@/components/LoginNavbar";
import Modal from "@/components/AdminDashboard/Modal";
import useMediaQuery from "@/hooks/useMediaQuery";
import Anunciantes from "@/components/AdminDashboard/Anunciantes";
import Clientes from "@/components/AdminDashboard/Clientes";
import EstatisticasERelatorios from "@/components/AdminDashboard/EstatisticasERelatorios";
import Image from "next/image";

// Componente Placeholder para seções não implementadas
const Placeholder = ({ title, items = [] }) => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>
    {items.length > 0 ? (
      <ul className="list-disc ml-6 space-y-2 text-sm text-gray-700">
        {items.map((item, index) => (
          <li key={index} className="leading-snug">{item}</li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-700 text-sm">Funcionalidade em desenvolvimento...</p>
    )}
  </div>
);

const AdminDashboard = async () => {
  await checkSession();
  const [activeMainTab, setActiveMainTab] = useState("usuarios");
  const [activeSubTab, setActiveSubTab] = useState("anunciantes"); // valor padrão
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Definição do Menu Principal e Sub-itens
  const menuItems = [
    {
      id: "usuarios",
      label: "Gerenciamento de Usuários",
      icon: FaUsersCog,
      subItems: [
        { id: "anunciantes", label: "Anunciantes" },
        { id: "clientes", label: "Clientes" },
      ],
    },
    {
      id: "conteudo",
      label: "Gerenciamento de Conteúdo",
      icon: FaPhotoVideo,
      subItems: [
        { id: "fotos_videos", label: "Fotos e Vídeos" },
        { id: "stories", label: "Stories" },
        { id: "textos_perf", label: "Textos e Perfis" },
      ],
    },
    {
      id: "planos",
      label: "Planos e Assinaturas",
      icon: FaCogs,
      subItems: [],
    },
    {
      id: "pagamentos",
      label: "Pagamentos",
      icon: FaFileInvoiceDollar,
      subItems: [],
    },
    {
      id: "moderacao",
      label: "Moderação e Segurança",
      icon: FaShieldAlt,
      subItems: [
        { id: "anti_fraude", label: "Ferramentas Anti-Fraude" },
        { id: "denuncias", label: "Denúncias e Moderação" },
        { id: "logs", label: "Logs de Atividades" },
      ],
    },
    {
      id: "estatisticas",
      label: "Estatísticas e Relatórios",
      icon: FaChartLine,
      subItems: [],
    },
    {
      id: "marketing",
      label: "Marketing",
      icon: FaBullhorn,
      subItems: [],
    },
    {
      id: "personalizacao",
      label: "Personalização da Plataforma",
      icon: FaPalette,
      subItems: [],
    },
    {
      id: "suporte",
      label: "Suporte e Atendimento",
      icon: FaLifeRing,
      subItems: [],
    },
    {
      id: "ferramentas",
      label: "Ferramentas Exclusivas",
      icon: FaWrench,
      subItems: [
        { id: "seo_analytics", label: "SEO e Analytics" },
        { id: "geolocalizacao", label: "Geolocalização" },
        { id: "notificacoes", label: "Notificações" },
      ],
    },
  ];

  const handleMainTabClick = (tabId) => {
    setActiveMainTab(tabId);
    const mainItem = menuItems.find((item) => item.id === tabId);
    if (mainItem && mainItem.subItems && mainItem.subItems.length > 0) {
      setActiveSubTab(mainItem.subItems[0].id);
    } else {
      setActiveSubTab("");
    }
    if (isMobile) setMobileMenuOpen(false);
  };

  const handleSubTabClick = (subId) => {
    setActiveSubTab(subId);
    if (isMobile) setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // Lógica de logout
    alert("Logout realizado!");
    // Por exemplo: router.push("/login");
  };

  const handleModalToggle = () => {
    setModalOpen((prev) => !prev);
  };

  // Conteúdo baseado na aba selecionada
  const renderContent = () => {
    // Usuários
    if (activeMainTab === "usuarios") {
      if (activeSubTab === "anunciantes") {
        return <Anunciantes />;
      } else if (activeSubTab === "clientes") {
        return <Clientes />;
      }
    }

    // Conteúdo
    if (activeMainTab === "conteudo") {
      if (activeSubTab === "fotos_videos") {
        return (
          <Placeholder
            title="Fotos e Vídeos"
            items={[
              "Aprovação Manual/Automática",
              "Remoção de Conteúdo que Viole Regras",
              "Controle de Marca d'Água",
            ]}
          />
        );
      } else if (activeSubTab === "stories") {
        return (
          <Placeholder
            title="Stories"
            items={[
              "Análise/Remoção de Conteúdo Impróprio",
              "Gerenciamento de Tempo de Exibição (24h)",
            ]}
          />
        );
      } else if (activeSubTab === "textos_perf") {
        return (
          <Placeholder
            title="Textos e Perfis"
            items={[
              "Moderação de Descrições de Perfis",
              "Verificação de Palavras Proibidas",
            ]}
          />
        );
      }
    }

    // Planos e Assinaturas
    if (activeMainTab === "planos") {
      return (
        <Placeholder
          title="Planos e Assinaturas"
          items={[
            "Criação/Edição/Exclusão de Planos",
            "Controle de Valores e Períodos",
            "Monitoramento de Pagamentos de Assinaturas",
            "Notificações de Renovação",
            "Descontos/Cupons",
          ]}
        />
      );
    }

    // Pagamentos
    if (activeMainTab === "pagamentos") {
      return (
        <Placeholder
          title="Pagamentos"
          items={[
            "Integração com Gateways de Pagamento",
            "Visualização/Controle de Transações",
            "Aprovação Manual de Pagamentos Pendentes",
            "Gerenciamento de Saques",
            "Relatórios Financeiros",
          ]}
        />
      );
    }

    // Moderação
    if (activeMainTab === "moderacao") {
      if (activeSubTab === "anti_fraude") {
        return (
          <Placeholder
            title="Ferramentas Anti-Fraude"
            items={[
              "Validação de Documentos",
              "Monitoramento de IPs",
              "Bloqueio de Acessos Suspeitos",
            ]}
          />
        );
      } else if (activeSubTab === "denuncias") {
        return (
          <Placeholder
            title="Denúncias e Moderação"
            items={[
              "Recebimento e Análise de Denúncias",
              "Exclusão/Suspensão de Perfis Denunciados",
            ]}
          />
        );
      } else if (activeSubTab === "logs") {
        return (
          <Placeholder
            title="Logs de Atividades"
            items={[
              "Registro de Ações de Anunciantes/Clientes",
              "Logs de Acesso do Admin",
            ]}
          />
        );
      }
    }

    // Estatísticas e Relatórios
    if (activeMainTab === "estatisticas") {
      return <EstatisticasERelatorios />;
    }

    // Marketing
    if (activeMainTab === "marketing") {
      return (
        <Placeholder
          title="Marketing"
          items={[
            "Controle de Banners Promocionais",
            "Envio de Notificações Push",
            "Criação de Campanhas de Desconto",
            "E-mails Automáticos (Boas-vindas, Renovações)",
          ]}
        />
      );
    }

    // Personalização
    if (activeMainTab === "personalizacao") {
      return (
        <Placeholder
          title="Personalização da Plataforma"
          items={[
            "Edição de Configurações (logo, cores, nome)",
            "Criação de Categorias Personalizadas",
            "Configuração de Páginas de Políticas e Termos",
          ]}
        />
      );
    }

    // Suporte
    if (activeMainTab === "suporte") {
      return (
        <Placeholder
          title="Suporte e Atendimento"
          items={[
            "Respostas a Mensagens de Suporte",
            "Visualização de Tickets Abertos/Resolvidos",
            "Gerenciamento do Chat de Atendimento",
          ]}
        />
      );
    }

    // Ferramentas
    if (activeMainTab === "ferramentas") {
      if (activeSubTab === "seo_analytics") {
        return (
          <Placeholder
            title="SEO e Analytics"
            items={[
              "Integração com Google Analytics",
              "Ajuste de Metatags e Descrição",
            ]}
          />
        );
      } else if (activeSubTab === "geolocalizacao") {
        return (
          <Placeholder
            title="Geolocalização"
            items={[
              "Exibição de Anunciantes Próximos",
              "Relatórios de Localização",
            ]}
          />
        );
      } else if (activeSubTab === "notificacoes") {
        return (
          <Placeholder
            title="Notificações"
            items={[
              "Configuração de Notificações em Tempo Real",
              "Personalização de Alertas",
            ]}
          />
        );
      }
    }

    return <Placeholder title="Selecione uma opção do menu" />;
  };

  // Obter rótulos para breadcrumb
  const activeMain = menuItems.find((m) => m.id === activeMainTab);
  const activeMainLabel = activeMain ? activeMain.label : "";
  const activeSub = activeMain && activeMain.subItems.find((s) => s.id === activeSubTab);
  const activeSubLabel = activeSub ? activeSub.label : "";

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar Superior */}
      <LoginNavbar />

      <div className="flex flex-1 relative">
        {/* Barra Lateral (Desktop) */}
        {!isMobile && (
          <aside className="hidden md:block fixed top-16 left-0 h-full w-64 lg:w-72 xl:w-80 bg-gray-800 shadow-lg overflow-y-auto z-40">
            <div className="p-6">
              {/* Perfil do Administrador */}
              <div className="flex items-center mb-6">
                <Image
                  src="/images/admin.jpg"
                  alt="Administrador"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-100">Administração</h2>
                  <p className="text-gray-400 text-sm">Painel de Controle</p>
                </div>
              </div>

              {/* Menu Principal */}
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <div
                      className={`flex items-center cursor-pointer px-3 py-2 rounded-lg text-sm lg:text-base transition-colors duration-300 transform ${activeMainTab === item.id
                          ? "bg-gray-700 text-gray-300 scale-105"
                          : "text-gray-200 hover:bg-gray-700 hover:text-gray-100"
                        }`}
                      onClick={() => handleMainTabClick(item.id)}
                    >
                      <item.icon className="mr-3 text-lg" />
                      {item.label}
                    </div>

                    {/* Submenu se houver */}
                    {activeMainTab === item.id && item.subItems && item.subItems.length > 0 && (
                      <ul className="ml-8 mt-2 space-y-1">
                        {item.subItems.map((sub) => (
                          <li
                            key={sub.id}
                            onClick={() => handleSubTabClick(sub.id)}
                            className={`cursor-pointer text-sm text-gray-200 px-2 py-1 rounded transition-colors ${activeSubTab === sub.id
                                ? "bg-gray-600 text-gray-100"
                                : "hover:bg-gray-700 hover:text-gray-100"
                              }`}
                          >
                            {sub.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}

                {/* Logout */}
                <li
                  className="flex items-center cursor-pointer px-3 py-2 rounded-lg text-sm lg:text-base transition-colors duration-300 transform text-gray-200 hover:bg-gray-700 hover:text-gray-100 mt-4"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="mr-3 text-lg" />
                  Sair
                </li>
              </ul>
            </div>
          </aside>
        )}

        {/* Conteúdo Principal */}
        <main
          className={`flex-1 container mx-auto px-4 py-8 mt-16 transition-all duration-300 ${!isMobile ? "ml-64 lg:ml-72 xl:ml-80" : ""
            }`}
        >
          {/* Cabeçalho (Mobile) */}
          {isMobile && (
            <div className="flex justify-between items-center bg-white rounded-lg shadow p-4 mb-4">
              <div className="flex items-center">
                <Image
                  src="/images/admin.jpg"
                  alt="Administrador"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Administração</h2>
                  <p className="text-gray-600 text-sm">Painel de Controle</p>
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
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50"
                onClick={() => setMobileMenuOpen(false)}
              ></div>
              <div className="fixed top-16 left-0 w-64 bg-gray-800 shadow-lg p-4 z-50 h-full overflow-y-auto transition-transform">
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <li key={item.id}>
                      <div
                        className={`flex items-center cursor-pointer px-3 py-2 rounded-lg text-sm transition-colors duration-300 transform ${activeMainTab === item.id
                            ? "bg-gray-700 text-gray-300 scale-105"
                            : "text-gray-200 hover:bg-gray-700 hover:text-gray-100"
                          }`}
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
                              className={`cursor-pointer text-sm text-gray-200 px-2 py-1 rounded transition-colors ${activeSubTab === sub.id
                                  ? "bg-gray-600 text-gray-100"
                                  : "hover:bg-gray-700 hover:text-gray-100"
                                }`}
                            >
                              {sub.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                  {/* Logout */}
                  <li
                    className="flex items-center cursor-pointer px-3 py-2 rounded-lg text-sm transition-colors duration-300 transform text-gray-200 hover:bg-gray-700 hover:text-gray-100 mt-4"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="mr-3 text-lg" />
                    Sair
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* Breadcrumb */}
          <div className="mb-4">
            <nav className="text-sm text-gray-600 flex items-center space-x-2">
              <span>Painel de Controle</span>
              {activeMainLabel && <span>/ {activeMainLabel}</span>}
              {activeSubLabel && <span>/ {activeSubLabel}</span>}
            </nav>
          </div>

          {/* Área de Conteúdo Dinâmico */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Modal de exemplo (pode ser removido se não necessário) */}
      {modalOpen && (
        <Modal
          onClose={handleModalToggle}
          title="Ação de Administração"
          description="Descrição da ação que está sendo confirmada."
        >
          <div className="text-center">
            <p className="text-gray-700 mb-4 text-sm">Detalhes adicionais sobre a ação.</p>
            <button
              className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition"
              onClick={handleModalToggle}
            >
              Confirmar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
