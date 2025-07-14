import React, { useState, useEffect, useCallback } from 'react';
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaCcMastercard,
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
  FaWallet,
  FaInfoCircle,
  FaExclamationTriangle,
  FaGift,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaToggleOn,
  FaToggleOff,
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
  FaKeyboard
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'rc-slider';
import Image from 'next/image';
import axios from 'axios';
import Cookies from 'js-cookie';
import 'rc-slider/assets/index.css';

const FinancialControl = () => {
  // Estados principais
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [pendingUpdates, setPendingUpdates] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
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
    { id: "services", label: "Serviços", icon: FaCoins },
    { id: "payments", label: "Pagamentos", icon: FaCreditCard },
  ];

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Bem-vinda ao Controle Financeiro! 💰",
      description: "Aqui você define os preços dos seus serviços e formas de pagamento aceitas. Vamos configurar tudo passo a passo!",
      icon: FaGraduationCap,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Resumo Financeiro 📊",
      description: "Veja um panorama dos seus serviços ativos, faturamento potencial e formas de pagamento configuradas",
      icon: FaChartLine,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Gerenciar Serviços 🎯",
      description: "Ative/desative serviços e ajuste preços. Use o slider para incrementos de R$ 50 ou clique no ícone ✏️ para valores personalizados!",
      icon: FaCoins,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Formas de Pagamento 💳",
      description: "Configure como você aceita receber: PIX, dinheiro, cartão, etc. Mais opções = mais facilidade para clientes",
      icon: FaCreditCard,
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Salvar Alterações 💾",
      description: "Sempre que fizer mudanças, clique em 'Salvar Alterações' para que apareça no seu perfil público!",
      icon: FaSave,
      color: "from-purple-500 to-pink-500"
    }
  ];

  // Executa ao carregar o componente
  const fetchFinancialData = useCallback(async () => {
    const token = Cookies.get("userToken");

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/finance`,
        { withCredentials: true }
      );

      // Atualizando os métodos de pagamento
      if (response.data.paymentMethods) {
        setPaymentMethods(
          response.data.paymentMethods.map(method => ({
            nome: method.nome,
            aceito: method.aceito,
            icon: getPaymentIcon(method.nome),
            displayName: getPaymentDisplayName(method.nome),
          }))
        );
      }

      // Atualizando os serviços corretamente
      if (response.data.timedServices) {
        setServices(
          response.data.timedServices.map(service => ({
            id: service.id,
            nome: service.name,
            descricao: service.description,
            preco: service.price ?? service.defaultPrice ?? 0,
            customPreco: service.price !== null,
            realizado: service.isOffered ?? false,
            isOffered: service.isOffered ?? false,
          }))
        );
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar dados financeiros:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFinancialData();
  }, [fetchFinancialData]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getPaymentIcon = (nome) => {
    switch (nome) {
      case "PIX":
        return <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-bold text-sm">PIX</div>;
      case "DINHEIRO":
        return <FaMoneyBillWave className="text-3xl text-green-600" />;
      case "CARTAO_CREDITO":
        return <FaCreditCard className="text-3xl text-blue-600" />;
      case "DEBITO":
        return <FaCcMastercard className="text-3xl text-purple-600" />;
      default:
        return <FaWallet className="text-3xl text-gray-600" />;
    }
  };

  const getPaymentDisplayName = (nome) => {
    switch (nome) {
      case "CARTAO_CREDITO":
        return "Cartão de Crédito";
      case "DEBITO":
        return "Cartão de Débito";
      case "DINHEIRO":
        return "Dinheiro";
      case "PIX":
        return "PIX";
      default:
        return nome;
    }
  };

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
  const toggleService = (index) => {
    setServices((prev) =>
      prev.map((service, i) =>
        i === index
          ? {
            ...service,
            realizado: !service.realizado,
            isOffered: !service.realizado,
          }
          : service
      )
    );
    setPendingUpdates(true);
  };

  // Atualiza o preço de um serviço
  const updatePrice = (index, value) => {
    setServices((prev) =>
      prev.map((service, i) =>
        i === index ? { ...service, preco: value } : service
      )
    );
    setPendingUpdates(true);
  };

  // Funções para preço personalizado
  const startEditingPrice = (serviceIndex, currentPrice) => {
    setEditingPrice(serviceIndex);
    setTempPrice(currentPrice.toString());
  };

  const confirmCustomPrice = (serviceIndex) => {
    const price = parseFloat(tempPrice.replace(/[^\d,]/g, '').replace(',', '.'));
    if (!isNaN(price) && price >= 0 && price <= 50000) {
      updatePrice(serviceIndex, Math.round(price * 100) / 100); // Mantém até 2 casas decimais
    }
    setEditingPrice(null);
    setTempPrice('');
  };

  const cancelEditingPrice = () => {
    setEditingPrice(null);
    setTempPrice('');
  };

  const handleCustomPriceChange = (value) => {
    // Permite apenas números, vírgulas e pontos
    const cleanValue = value.replace(/[^\d,.]/g, '');
    setTempPrice(cleanValue);
  };

  // Alternar aceitação de forma de pagamento
  const togglePaymentMethod = (index) => {
    setPaymentMethods((prev) =>
      prev.map((method, i) =>
        i === index ? { ...method, aceito: !method.aceito } : method
      )
    );
    setPendingUpdates(true);
  };

  // Aplicar todas as alterações no backend
  const applyUpdates = async () => {
    const token = Cookies.get("userToken");
    if (!token) {
      console.error("Token não encontrado");
      return;
    }

    try {
      // Gerando a estrutura correta dos serviços oferecidos
      const updatedServices = services.map(s => ({
        id: s.id,
        price: s.realizado ? s.preco : null,
        isOffered: s.realizado,
      }));

      // Gerando a estrutura correta dos métodos de pagamento
      const updatedPaymentMethods = paymentMethods.map(m => ({
        nome: m.nome,
        aceito: m.aceito,
      }));

      // Criando o payload final
      const payload = {
        paymentMethods: updatedPaymentMethods,
        timedServices: updatedServices,
      };

      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/finance/update`,
        payload,
        { withCredentials: true }
      );

      // Recarregar os dados do backend para confirmar a atualização
      fetchFinancialData();
      setPendingUpdates(false);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  // Separar serviços oferecidos e não oferecidos
  const servicosOferecidos = services.filter((service) => service.realizado);
  const servicosNaoOferecidos = services.filter((service) => !service.realizado);

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
    if (price <= 200) return "text-blue-600";
    if (price <= 500) return "text-purple-600";
    return "text-pink-600";
  };

  // Calcular estatísticas
  const totalServicos = services.length;
  const servicosAtivos = servicosOferecidos.length;
  const faturamentoPotencial = servicosOferecidos.reduce((total, service) => total + service.preco, 0);
  const metodosAceitos = paymentMethods.filter(m => m.aceito).length;

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
          <FaCoins className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-green-200" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">Serviços Ativos</h3>
          <div className="text-2xl sm:text-3xl font-bold">{servicosAtivos}/{totalServicos}</div>
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

        {/* Métodos de Pagamento */}
        <motion.div
          className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10"></div>
          <FaCreditCard className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-pink-200" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">Formas Aceitas</h3>
          <div className="text-2xl sm:text-3xl font-bold">{metodosAceitos}/4</div>
        </motion.div>

        {/* Status Geral */}
        <motion.div
          className="bg-gradient-to-br from-orange-500 to-red-500 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white relative overflow-hidden sm:col-span-2 lg:col-span-1"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10"></div>
          <FaTrophy className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-orange-200" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">Status</h3>
          <div className="text-sm sm:text-lg">
            {servicosAtivos > 0 && metodosAceitos > 0 ? "Ativo" : "Configurar"}
          </div>
        </motion.div>
      </div>

      {/* Resumo dos serviços oferecidos */}
      {servicosOferecidos.length > 0 && (
        <motion.div
          className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
            <FaCheckCircle className="text-green-500 mr-2" />
            Seus Serviços Ativos
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {servicosOferecidos.slice(0, 4).map((service, index) => (
              <div key={service.id} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 sm:p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{service.nome}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{service.descricao}</p>
                  </div>
                  <span className={`text-sm sm:text-base font-bold ${getPriceColor(service.preco)}`}>
                    {formatPrice(service.preco)}
                  </span>
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

      {/* Dicas rápidas */}
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
              💡 Dicas para maximizar seus ganhos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Ofereça variedade de serviços</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Configure múltiplas formas de pagamento</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Use valores personalizados quando necessário</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Use cortesias para fidelizar clientes</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderServicesTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Serviços Oferecidos */}
      <motion.div
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <FaCheckCircle className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Serviços Oferecidos</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {servicosOferecidos.length > 0 ? `✅ ${servicosOferecidos.length} serviços ativos` : '⚪ Nenhum serviço ativo'}
              </p>
            </div>
          </div>
        </div>

        {servicosOferecidos.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {servicosOferecidos.map((service) => {
              const serviceIndex = services.findIndex(s => s.id === service.id);
              return (
                <motion.div
                  key={service.id}
                  className="border-2 border-green-200 rounded-xl p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="flex-1 mb-3 sm:mb-0">
                      <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{service.nome}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm">{service.descricao}</p>
                    </div>
                    <button
                      onClick={() => toggleService(serviceIndex)}
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
                        {editingPrice === serviceIndex ? (
                          <div className="flex items-center space-x-2">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                              <input
                                type="text"
                                value={tempPrice}
                                onChange={(e) => handleCustomPriceChange(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && confirmCustomPrice(serviceIndex)}
                                className="w-24 sm:w-28 pl-8 pr-3 py-1.5 border border-green-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="0,00"
                                autoFocus
                              />
                            </div>
                            <button
                              onClick={() => confirmCustomPrice(serviceIndex)}
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
                              onClick={() => startEditingPrice(serviceIndex, service.preco)}
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
                        <span>Slider (incrementos de R$ 50)</span>
                        <span className="flex items-center space-x-1">
                          <FaKeyboard className="text-xs" />
                          <span>ou clique no</span>
                          <FaEdit className="text-xs" />
                          <span>para valor exato</span>
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={20000}
                        step={50}
                        value={service.preco}
                        onChange={(value) => updatePrice(serviceIndex, value)}
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
                        <span>R$ 20.000</span>
                      </div>
                    </div>

                    {service.preco === 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <FaGift className="text-yellow-600" />
                          <span className="text-yellow-800 font-medium text-xs sm:text-sm">
                            Serviço gratuito - ótima estratégia para fidelização!
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Dica sobre personalização */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <FaLightbulb className="text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-blue-800 font-medium text-xs sm:text-sm mb-1">
                            💡 Valores Personalizados
                          </p>
                          <p className="text-xs text-blue-700">
                            Use o slider para incrementos de R$ 50 ou clique no <FaEdit className="inline text-xs" /> para definir valores exatos como R$ 125,50
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <FaExclamationTriangle className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-sm sm:text-base">Nenhum serviço sendo oferecido no momento</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-2">Ative serviços abaixo para começar a faturar!</p>
          </div>
        )}
      </motion.div>

      {/* Serviços Disponíveis */}
      <motion.div
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-500 to-slate-600 rounded-xl flex items-center justify-center">
              <FaTimesCircle className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Serviços Disponíveis</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {servicosNaoOferecidos.length > 0 ? `⚪ ${servicosNaoOferecidos.length} serviços inativos` : '✅ Todos os serviços ativos'}
              </p>
            </div>
          </div>
        </div>

        {servicosNaoOferecidos.length > 0 ? (
          <div className="space-y-4">
            {servicosNaoOferecidos.map((service) => {
              const serviceIndex = services.findIndex(s => s.id === service.id);
              return (
                <motion.div
                  key={service.id}
                  className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-white hover:shadow-md transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 mb-3 sm:mb-0">
                      <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{service.nome}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm">{service.descricao}</p>
                    </div>
                    <button
                      onClick={() => toggleService(serviceIndex)}
                      className="bg-green-500 hover:bg-green-600 text-white p-2 sm:p-3 rounded-xl transition-all duration-300 flex items-center justify-center self-start sm:self-center"
                      title="Começar a oferecer este serviço"
                    >
                      <FaCheckCircle className="text-sm sm:text-base" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-4" />
            <p className="text-gray-600 text-sm sm:text-base">Todos os serviços estão sendo oferecidos!</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-2">Ótimo! Você está maximizando suas oportunidades de faturamento.</p>
          </div>
        )}
      </motion.div>
    </div>
  );

  const renderPaymentsTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Info sobre pagamentos */}
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="bg-blue-500 p-3 rounded-full">
            <FaInfoCircle className="text-white text-lg sm:text-xl" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              💳 Configure suas Formas de Pagamento
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Clique nos métodos que você aceita. Mais opções facilitam para seus clientes e podem aumentar suas vendas!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Grid de métodos de pagamento */}
      <motion.div
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Métodos de Pagamento</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {paymentMethods.map((method, index) => (
            <motion.div
              key={method.nome}
              className={`relative p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${method.aceito
                ? 'border-green-400 bg-green-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              onClick={() => togglePaymentMethod(index)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className={`transition-opacity duration-300 ${method.aceito ? 'opacity-100' : 'opacity-40'}`}>
                  {method.icon}
                </div>
                <span className={`text-xs sm:text-sm font-semibold transition-colors duration-300 ${method.aceito ? 'text-green-700' : 'text-gray-500'
                  }`}>
                  {method.displayName}
                </span>
                {method.aceito && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                    <FaCheckCircle className="text-xs" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Métodos selecionados */}
        {paymentMethods.filter(m => m.aceito).length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4 mt-6">
            <h4 className="font-semibold text-green-800 mb-3 text-sm sm:text-base flex items-center">
              <FaCheckCircle className="mr-2" />
              Métodos Aceitos:
            </h4>
            <div className="flex flex-wrap gap-2">
              {paymentMethods
                .filter(m => m.aceito)
                .map((method, index) => (
                  <span
                    key={index}
                    className="bg-white px-3 py-1 rounded-lg text-green-700 text-xs sm:text-sm font-medium border border-green-300"
                  >
                    {method.displayName}
                  </span>
                ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Dicas */}
      <motion.div
        className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl sm:rounded-2xl p-4 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaStar className="text-purple-500 mr-2" />
          Dicas para maximizar pagamentos
        </h3>
        <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-green-500 text-white p-2 rounded-full flex-shrink-0">
                <FaCheckCircle className="text-xs sm:text-sm" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">PIX</h4>
                <p className="text-xs sm:text-sm text-gray-600">Instantâneo e sem taxas para você</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-500 text-white p-2 rounded-full flex-shrink-0">
                <FaMoneyBillWave className="text-xs sm:text-sm" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Dinheiro</h4>
                <p className="text-xs sm:text-sm text-gray-600">Ainda preferido por muitos clientes</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-purple-500 text-white p-2 rounded-full flex-shrink-0">
                <FaCreditCard className="text-xs sm:text-sm" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Cartões</h4>
                <p className="text-xs sm:text-sm text-gray-600">Atrai clientes de maior poder aquisitivo</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-orange-500 text-white p-2 rounded-full flex-shrink-0">
                <FaLightbulb className="text-xs sm:text-sm" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Estratégia</h4>
                <p className="text-xs sm:text-sm text-gray-600">Aceite múltiplas formas para não perder vendas</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
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
          <p className="text-gray-600 font-medium text-sm sm:text-base">Carregando controle financeiro...</p>
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
                Controle Financeiro
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Gerencie preços dos seus serviços e formas de pagamento
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
          {activeTab === "services" && renderServicesTab()}
          {activeTab === "payments" && renderPaymentsTab()}
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

export default FinancialControl;