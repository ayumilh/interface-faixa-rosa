import React, { useState, useEffect } from 'react';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaPlay,
  FaGraduationCap,
  FaLightbulb,
  FaTimes,
  FaSpinner,
  FaSave,
  FaDollarSign,
  FaCoins,
  FaInfoCircle,
  FaExclamationTriangle,
  FaGift,
  FaBars,
  FaArrowRight,
  FaChartLine,
  FaTrophy,
  FaGem,
  FaClock,
  FaCamera,
  FaStar,
  FaHeart,
  FaComment,
  FaCheck,
  FaEye,
  FaEdit,
  FaKeyboard,
  FaCog,
  FaServicestack
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'rc-slider';
import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { toast } from 'react-toastify';
import 'rc-slider/assets/index.css';

const ServicesManagement = () => {
  // Estados principais
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState(null);
  const [pendingUpdates, setPendingUpdates] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Estados do tutorial
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Estados para preço personalizado
  const [editingPrice, setEditingPrice] = useState(null);
  const [tempPrice, setTempPrice] = useState('');

  // Configuração das tabs
  const tabs = [
    { id: "overview", label: "Resumo", icon: FaChartLine },
    { id: "offered", label: "Oferecidos", icon: FaCheckCircle },
    { id: "available", label: "Disponíveis", icon: FaServicestack },
  ];

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Bem-vinda ao Gerenciamento de Serviços! 🎯",
      description: "Aqui você controla quais serviços oferece e define preços estratégicos para maximizar seus ganhos",
      icon: FaGraduationCap,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Resumo dos Serviços 📊",
      description: "Veja estatísticas dos seus serviços ativos, faturamento potencial e progresso da configuração",
      icon: FaChartLine,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Serviços Oferecidos ✅",
      description: "Gerencie os serviços que você oferece, ajuste preços e desative o que não faz mais sentido",
      icon: FaCheckCircle,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Serviços Disponíveis 🎯",
      description: "Ative novos serviços para expandir seu portfólio e atrair mais tipos de clientes",
      icon: FaServicestack,
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Definindo Preços 💰",
      description: "Use o slider para valores rápidos ou clique no ✏️ para preços personalizados. Estratégia é tudo!",
      icon: FaDollarSign,
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Salvar Alterações 💾",
      description: "Sempre clique em 'Salvar Alterações' para que suas configurações apareçam no perfil público!",
      icon: FaSave,
      color: "from-purple-500 to-pink-500"
    }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      const token = Cookies.get("userToken");

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/services`,
          { withCredentials: true }
        );

        if (response.data.services) {
          setServices(
            response.data.services.map((service) => ({
              id: service.id,
              nome: service.name,
              descricao: service.description,
              oferecido: service.isOffered,
              preco: service.price ?? 20,
            }))
          );
        }
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Tutorial handlers
  const handleNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowTutorial(false);
      setCurrentStep(0);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    setCurrentStep(0);
  };

  // Alternar um serviço entre oferecido e não oferecido
  const toggleService = (id) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? {
            ...service,
            oferecido: !service.oferecido,
            preco: !service.oferecido ? 20 : service.preco,
          }
          : service
      )
    );
    setPendingUpdates(true);
  };

  // Atualizar o preço de um serviço específico
  const updatePrice = (id, price) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, preco: price } : service
      )
    );
    setPendingUpdates(true);
  };

  // Funções para preço personalizado
  const startEditingPrice = (serviceId, currentPrice) => {
    setEditingPrice(serviceId);
    setTempPrice(currentPrice.toString());
  };

  const confirmCustomPrice = (serviceId) => {
    const price = parseFloat(tempPrice.replace(/[^\d,]/g, '').replace(',', '.'));
    if (!isNaN(price) && price >= 0 && price <= 50000) {
      updatePrice(serviceId, Math.round(price * 100) / 100);
    }
    setEditingPrice(null);
    setTempPrice('');
  };

  const cancelEditingPrice = () => {
    setEditingPrice(null);
    setTempPrice('');
  };

  const handleCustomPriceChange = (value) => {
    const cleanValue = value.replace(/[^\d,.]/g, '');
    setTempPrice(cleanValue);
  };

  // Enviar as alterações para o backend
  const applyUpdates = async () => {
    const token = Cookies.get("userToken");
    if (!token) {
      console.error("Token não encontrado");
      return;
    }

    try {
      const payload = {
        services: services.map((s) => ({
          id: s.id,
          isOffered: s.oferecido,
          price: s.preco,
        })),
      };

      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/services/update`,
        payload,
        { withCredentials: true }
      );

      toast.success("✨ Serviços atualizados com sucesso!");
      setPendingUpdates(false);
    } catch (error) {
      console.error("Erro ao atualizar serviços:", error);
      toast.error("❌ Erro ao atualizar serviços. Tente novamente.");
    }
  };

  // Separar serviços oferecidos e não oferecidos
  const servicosOferecidos = services ? services.filter(service => service.oferecido) : [];
  const servicosNaoOferecidos = services ? services.filter(service => !service.oferecido) : [];

  // Função para formatar preço
  const formatPrice = (price) => {
    if (price === 0) return "Grátis";
    return `R$ ${price.toLocaleString("pt-BR", {
      minimumFractionDigits: price % 1 !== 0 ? 2 : 0,
      maximumFractionDigits: 2
    })}`;
  };

  // Função para determinar a cor do preço
  const getPriceColor = (price) => {
    if (price === 0) return "text-green-600";
    if (price <= 100) return "text-blue-600";
    if (price <= 300) return "text-purple-600";
    return "text-pink-600";
  };

  // Calcular estatísticas
  const totalServices = services ? services.length : 0;
  const offeredServices = servicosOferecidos.length;
  const faturamentoPotencial = servicosOferecidos.reduce((total, service) => total + service.preco, 0);
  const mediaPrecos = offeredServices > 0 ? faturamentoPotencial / offeredServices : 0;

  const renderOverviewTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {/* Serviços Ativos */}
        <motion.div
          className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10"></div>
          <FaServicestack className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-green-200" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">Serviços Ativos</h3>
          <div className="text-2xl sm:text-3xl font-bold">{offeredServices}/{totalServices}</div>
        </motion.div>

        {/* Faturamento Potencial */}
        <motion.div
          className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10"></div>
          <FaDollarSign className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-cyan-200" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">Faturamento Potencial</h3>
          <div className="text-lg sm:text-xl font-bold">{formatPrice(faturamentoPotencial)}</div>
        </motion.div>

        {/* Preço Médio */}
        <motion.div
          className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10"></div>
          <FaTrophy className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-purple-200" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">Preço Médio</h3>
          <div className="text-lg sm:text-xl font-bold">{formatPrice(mediaPrecos)}</div>
        </motion.div>

        {/* Status Geral */}
        <motion.div
          className="bg-gradient-to-br from-orange-500 to-red-500 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white relative overflow-hidden sm:col-span-2 lg:col-span-1"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10"></div>
          <FaGem className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-orange-200" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">Status</h3>
          <div className="text-sm sm:text-lg">
            {offeredServices > 0 ? "Ativo" : "Configurar"}
          </div>
        </motion.div>
      </div>

      {/* Resumo dos serviços mais caros */}
      {servicosOferecidos.length > 0 && (
        <motion.div
          className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
            <FaTrophy className="text-yellow-500 mr-2" />
            Seus Serviços Mais Valorizados
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {servicosOferecidos
              .sort((a, b) => b.preco - a.preco)
              .slice(0, 4)
              .map((service, index) => (
                <div key={service.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{service.nome}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{service.descricao?.replace(/<[^>]*>/g, '')}</p>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      {index === 0 && <FaTrophy className="text-yellow-500 text-sm" />}
                      <span className={`text-sm sm:text-base font-bold ${getPriceColor(service.preco)}`}>
                        {formatPrice(service.preco)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {servicosOferecidos.length > 4 && (
            <p className="text-center text-gray-500 text-sm mt-4">
              +{servicosOferecidos.length - 4} serviços adicionais
            </p>
          )}
        </motion.div>
      )}

      {/* Dicas estratégicas */}
      <motion.div
        className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl sm:rounded-2xl p-4 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="bg-yellow-500 p-3 rounded-full w-fit">
            <FaLightbulb className="text-white text-lg sm:text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-2">
              💡 Estratégias para maximizar ganhos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Diversifique seu portfólio de serviços</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Ajuste preços conforme demanda</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Ofereça serviços premium com valores altos</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Use serviços gratuitos para atrair clientes</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress de configuração */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Completude do Portfólio</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Serviços ativos</span>
            {offeredServices > 0 ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaExclamationTriangle className="text-yellow-500" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Preços configurados</span>
            {servicosOferecidos.every(s => s.preco > 0) ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaExclamationTriangle className="text-yellow-500" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Diversidade de serviços</span>
            {offeredServices >= 3 ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaExclamationTriangle className="text-yellow-500" />
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso</span>
            <span>
              {Math.round((offeredServices / totalServices) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${Math.round((offeredServices / totalServices) * 100)}%`
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOfferedTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Header da seção */}
      <motion.div
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <FaCheckCircle className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Serviços Oferecidos</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {offeredServices > 0 ? `✅ ${offeredServices} serviços ativos` : '⚪ Nenhum serviço ativo'}
              </p>
            </div>
          </div>
        </div>

        {/* Info sobre gerenciamento */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <FaInfoCircle className="text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">💰 Gerenciar Seus Serviços</h4>
              <p className="text-xs sm:text-sm text-green-700">
                Ajuste preços estrategicamente e desative serviços que não fazem mais sentido para o seu negócio.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lista de serviços oferecidos */}
      {servicosOferecidos.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {servicosOferecidos.map((service) => (
            <motion.div
              key={service.id}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border-l-4 border-green-500"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                <div className="flex-1 mb-3 sm:mb-0">
                  <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{service.nome}</h4>
                  <div
                    className="text-gray-600 text-xs sm:text-sm"
                    dangerouslySetInnerHTML={{ __html: service.descricao }}
                  />
                </div>
                <button
                  onClick={() => toggleService(service.id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 sm:p-3 rounded-xl transition-all duration-300 flex items-center justify-center self-start sm:self-center"
                  title="Parar de oferecer este serviço"
                >
                  <FaTimesCircle className="text-sm sm:text-base" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-semibold text-gray-800">Preço:</span>
                  <div className="flex items-center space-x-2">
                    {editingPrice === service.id ? (
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                          <input
                            type="text"
                            value={tempPrice}
                            onChange={(e) => handleCustomPriceChange(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && confirmCustomPrice(service.id)}
                            className="w-24 sm:w-28 pl-8 pr-3 py-1.5 border border-green-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="0,00"
                            autoFocus
                          />
                        </div>
                        <button
                          onClick={() => confirmCustomPrice(service.id)}
                          className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-lg transition-colors"
                          title="Confirmar preço"
                        >
                          <FaCheck className="text-xs" />
                        </button>
                        <button
                          onClick={cancelEditingPrice}
                          className="bg-gray-500 hover:bg-gray-600 text-white p-1.5 rounded-lg transition-colors"
                          title="Cancelar"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className={`text-lg sm:text-xl font-bold ${getPriceColor(service.preco)}`}>
                          {formatPrice(service.preco)}
                        </span>
                        <button
                          onClick={() => startEditingPrice(service.id, service.preco)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-1.5 rounded-lg transition-colors group"
                          title="Personalizar valor"
                        >
                          <FaEdit className="text-xs group-hover:scale-110 transition-transform" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
                    <span>Slider (incrementos de R$ 10)</span>
                    <span className="flex items-center space-x-1">
                      <FaKeyboard className="text-xs" />
                      <span>ou clique no</span>
                      <FaEdit className="text-xs" />
                      <span>para valor exato</span>
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={1000}
                    step={10}
                    value={service.preco}
                    onChange={(value) => updatePrice(service.id, value)}
                    railStyle={{ backgroundColor: "#e5e7eb", height: 8 }}
                    handleStyle={{
                      borderColor: "#10b981",
                      height: 24,
                      width: 24,
                      marginLeft: -12,
                      marginTop: -8,
                      backgroundColor: "#10b981",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                    trackStyle={{ backgroundColor: "#10b981", height: 8 }}
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                    <span>Grátis</span>
                    <span>R$ 1.000</span>
                  </div>
                </div>

                {service.preco === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <FaGift className="text-yellow-600" />
                      <span className="text-yellow-800 font-medium text-xs sm:text-sm">
                        Serviço gratuito - ótima estratégia para atrair novos clientes!
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-12 shadow-lg text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaExclamationTriangle className="text-4xl sm:text-5xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Nenhum serviço ativo</h3>
          <p className="text-gray-600 text-sm sm:text-base mb-4">Ative alguns serviços para começar a receber clientes!</p>
          <button
            onClick={() => setActiveTab("available")}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center space-x-2 mx-auto text-sm sm:text-base"
          >
            <FaArrowRight />
            <span>Ver Serviços Disponíveis</span>
          </button>
        </motion.div>
      )}
    </div>
  );

  const renderAvailableTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Header da seção */}
      <motion.div
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <FaServicestack className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Serviços Disponíveis</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {servicosNaoOferecidos.length > 0 ? `⚪ ${servicosNaoOferecidos.length} serviços inativos` : '✅ Todos os serviços ativos'}
              </p>
            </div>
          </div>
        </div>

        {/* Info sobre expansão */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 sm:p-4">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <FaInfoCircle className="text-orange-500 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-orange-800 mb-2 text-sm sm:text-base">🚀 Expanda Seu Portfólio</h4>
              <p className="text-xs sm:text-sm text-orange-700">
                Ative novos serviços para atrair diferentes tipos de clientes e maximizar suas oportunidades de negócio.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lista de serviços disponíveis */}
      {servicosNaoOferecidos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {servicosNaoOferecidos.map((service) => (
            <motion.div
              key={service.id}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:border-orange-300 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -2 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                <div className="flex-1 mb-3 sm:mb-0">
                  <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{service.nome}</h4>
                  <div
                    className="text-gray-600 text-xs sm:text-sm"
                    dangerouslySetInnerHTML={{ __html: service.descricao }}
                  />
                </div>
                <button
                  onClick={() => toggleService(service.id)}
                  className="bg-green-500 hover:bg-green-600 text-white p-2 sm:p-3 rounded-xl transition-all duration-300 flex items-center justify-center self-start sm:self-center group"
                  title="Começar a oferecer este serviço"
                >
                  <FaCheckCircle className="text-sm sm:text-base group-hover:scale-110 transition-transform" />
                </button>
              </div>

              {/* Preview do valor padrão */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Preço inicial sugerido:</span>
                  <span className="text-sm font-semibold text-gray-800">R$ 20</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-12 shadow-lg text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaCheckCircle className="text-4xl sm:text-5xl text-green-500 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Todos os serviços estão ativos!</h3>
          <p className="text-gray-600 text-sm sm:text-base mb-4">Parabéns! Você está oferecendo todo o seu portfólio de serviços.</p>
          <button
            onClick={() => setActiveTab("offered")}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center space-x-2 mx-auto text-sm sm:text-base"
          >
            <FaArrowRight />
            <span>Gerenciar Serviços Ativos</span>
          </button>
        </motion.div>
      )}
    </div>
  );

  // Loading screen
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <motion.div
          className="text-center px-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4"
          >
            <Image
              src="/iconOficial_faixaRosa.png"
              alt="Loading"
              width={64}
              height={64}
              className="w-full h-full"
            />
          </motion.div>
          <p className="text-gray-600 font-medium text-sm sm:text-base">Carregando serviços...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-8">
        {/* Header */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Gerenciamento de Serviços
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Controle seu portfólio de serviços e maximize seus ganhos
              </p>
            </div>

            <button
              onClick={() => setShowTutorial(true)}
              className="mt-4 lg:mt-0 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base mx-auto lg:mx-0"
            >
              <FaLightbulb />
              <span>Tutorial</span>
            </button>
          </div>

          {/* Tabs Mobile */}
          <div className="block sm:hidden">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h2>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg bg-gray-100"
              >
                <FaBars className="text-gray-600" />
              </button>
            </div>

            <AnimatePresence>
              {showMobileMenu && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden mb-4"
                >
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setShowMobileMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${activeTab === tab.id
                          ? "bg-green-50 text-green-600 border-r-4 border-green-500"
                          : "text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        <Icon className="text-lg" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tabs Desktop */}
          <div className="hidden sm:flex space-x-1 bg-gray-100 p-1 rounded-2xl overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap text-sm sm:text-base ${activeTab === tab.id
                    ? "bg-white text-green-600 shadow-lg"
                    : "text-gray-600 hover:text-gray-800"
                    }`}
                >
                  <Icon className="text-lg" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && renderOverviewTab()}
          {activeTab === "offered" && renderOfferedTab()}
          {activeTab === "available" && renderAvailableTab()}
        </motion.div>

        {/* Save Button */}
        {pendingUpdates && (
          <motion.div
            className="mt-6 sm:mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={applyUpdates}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaSave className="text-lg sm:text-xl" />
              <span>Salvar Alterações</span>
            </motion.button>
          </motion.div>
        )}

        {/* Tutorial Modal */}
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {(() => {
                  const currentTutorial = tutorialSteps[currentStep];
                  const IconComponent = currentTutorial.icon;

                  return (
                    <div className="text-center">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 bg-gradient-to-br ${currentTutorial.color}`}>
                        <IconComponent className="text-white text-lg sm:text-2xl" />
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                        {currentTutorial.title}
                      </h3>

                      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                        {currentTutorial.description}
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          {tutorialSteps.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentStep ? "bg-green-500 w-6 sm:w-8" : "bg-gray-300"
                                }`}
                            />
                          ))}
                        </div>

                        <div className="flex space-x-2 sm:space-x-3">
                          {currentStep > 0 && (
                            <button
                              onClick={handlePrevStep}
                              className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
                            >
                              Anterior
                            </button>
                          )}

                          <button
                            onClick={handleNextStep}
                            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 text-sm sm:text-base"
                          >
                            {currentStep === tutorialSteps.length - 1 ? "Finalizar" : "Próximo"}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={closeTutorial}
                        className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        <FaTimes className="text-lg sm:text-xl" />
                      </button>
                    </div>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ServicesManagement;