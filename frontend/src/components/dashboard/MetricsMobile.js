"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaWhatsapp,
  FaTelegram,
  FaPhoneAlt,
  FaSave,
  FaCheckCircle,
  FaSpinner,
  FaInfoCircle,
  FaLightbulb,
  FaTimes,
  FaPlay,
  FaArrowRight,
  FaGraduationCap,
  FaComments,
  FaUsers,
  FaShieldAlt,
  FaGlobe,
  FaEdit,
  FaCheck,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaBars,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import Charts from "../../components/dashboard/Charts";
import Cookies from "js-cookie";
import Image from "next/image";

const Metrics = ({ userName, userCity, userState }) => {
  const [contactConfig, setContactConfig] = useState({
    whatsapp: { number: "", message: "", countryCode: '+55' },
    telegram: { username: "" },
    phone: { number: "", countryCode: '+55' },
  });

  const [activeSection, setActiveSection] = useState("whatsapp");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Estados do tutorial
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const countryCodes = [
    { code: '+55', country: 'Brasil', flag: '🇧🇷' },
    { code: '+1', country: 'EUA', flag: '🇺🇸' },
    { code: '+44', country: 'Reino Unido', flag: '🇬🇧' },
    { code: '+33', country: 'França', flag: '🇫🇷' },
    { code: '+34', country: 'Espanha', flag: '🇪🇸' },
    { code: '+49', country: 'Alemanha', flag: '🇩🇪' },
    { code: '+39', country: 'Itália', flag: '🇮🇹' },
    { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  ];

  const sections = [
    { id: "whatsapp", label: "WhatsApp", icon: FaWhatsapp, color: "green", shortLabel: "WhatsApp" },
    { id: "telegram", label: "Telegram", icon: FaTelegram, color: "blue", shortLabel: "Telegram" },
    { id: "phone", label: "Telefone", icon: FaPhoneAlt, color: "gray", shortLabel: "Telefone" },
  ];

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Bem-vinda à Configuração de Contatos! 📞",
      description: "Vamos configurar seus meios de contato para que os clientes possam te encontrar facilmente",
      icon: FaGraduationCap,
      color: "from-purple-500 to-purple-600",
      action: "Começar configuração",
      highlight: null
    },
    {
      title: "Navegação entre Contatos 📱",
      description: "Use as abas no topo (desktop) ou o menu sanfona (mobile) para alternar entre WhatsApp, Telegram e Telefone",
      icon: FaBars,
      color: "from-blue-500 to-blue-600",
      action: "Entendi!",
      highlight: "navigation",
      tip: "💡 Você pode configurar quantos contatos quiser - quanto mais opções, melhor para seus clientes!"
    },
    {
      title: "1️⃣ Configurar WhatsApp 💚",
      description: "Selecione seu país, digite seu número com DDD e personalize a mensagem que os clientes receberão automaticamente",
      icon: FaWhatsapp,
      color: "from-green-500 to-green-600",
      action: "Próximo passo",
      highlight: "whatsapp-section",
      tip: "🎯 Dica: Uma mensagem personalizada aumenta a taxa de resposta em até 60%!"
    },
    {
      title: "2️⃣ Configurar Telegram 💙",
      description: "Digite seu nome de usuário do Telegram (sem @). Os clientes poderão te contatar diretamente pelo app",
      icon: FaTelegram,
      color: "from-blue-500 to-cyan-500",
      action: "Continue",
      highlight: "telegram-section",
      tip: "📱 Estratégia: Telegram é ótimo para clientes que preferem mais privacidade!"
    },
    {
      title: "3️⃣ Configurar Telefone 📞",
      description: "Adicione seu número de telefone para ligações diretas. Selecione o país e digite o número com DDD",
      icon: FaPhoneAlt,
      color: "from-gray-500 to-slate-600",
      action: "Finalizar",
      highlight: "phone-section",
      tip: "☎️ Importante: Telefone passa mais confiança para clientes novos!"
    },
    {
      title: "💾 Salvando suas Configurações",
      description: "Após configurar todos os contatos, clique em 'Atualizar Contatos' para salvar. Suas informações aparecerão no seu perfil público!",
      icon: FaSave,
      color: "from-green-500 to-emerald-500",
      action: "Concluir tutorial",
      highlight: "save-button",
      tip: "✅ Lembre-se: Sempre salve após fazer alterações para que apareçam no seu perfil!"
    }
  ];

  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const userToken = Cookies.get("userToken");

  const formatPhoneDisplay = (value, countryCode) => {
    const cleanedValue = value.replace(/\D/g, "");
    const formattedCountryCode = (countryCode || '+55').replace(/\D/g, "");

    if (formattedCountryCode === "55") {
      if (cleanedValue.length === 11) {
        return `(${cleanedValue.slice(0, 2)}) ${cleanedValue.slice(2, 7)}-${cleanedValue.slice(7)}`;
      } else if (cleanedValue.length === 10) {
        return `(${cleanedValue.slice(0, 2)}) ${cleanedValue.slice(2, 6)}-${cleanedValue.slice(6)}`;
      }
    }

    if (cleanedValue.length === 11) {
      return `(${cleanedValue.slice(0, 2)}) ${cleanedValue.slice(2, 7)}-${cleanedValue.slice(7)}`;
    } else if (cleanedValue.length === 10) {
      return `(${cleanedValue.slice(0, 2)}) ${cleanedValue.slice(2, 6)}-${cleanedValue.slice(6)}`;
    }

    return cleanedValue;
  };

  const formatPhoneBackend = (value) => {
    return value.replace(/\D/g, "");
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

  // Tutorial highlight effect
  const getHighlightClass = (elementId) => {
    const currentStepData = tutorialSteps[currentStep];
    if (showTutorial && currentStepData?.highlight === elementId) {
      return "relative z-50 ring-4 ring-yellow-400 ring-opacity-75 shadow-2xl rounded-2xl";
    }
    return "";
  };

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/contact`,
          { withCredentials: true }
        );
        const { contact } = response.data;

        const phoneNumberWithoutPrefix = contact.phoneNumber ? contact.phoneNumber.slice(2) : "";
        const whatsappNumberWithoutPrefix = contact.whatsappNumber ? contact.whatsappNumber.slice(2) : "";

        setContactConfig({
          whatsapp: {
            number: whatsappNumberWithoutPrefix,
            message: contact.whatsappMessage || "",
            countryCode: contact.whatsappCountryCode || '+55',
          },
          telegram: {
            username: contact.telegramUsername || "",
          },
          phone: {
            number: phoneNumberWithoutPrefix,
            countryCode: contact.phoneCountryCode || '+55',
          },
        });
        setLoading(false);

      } catch (error) {
        setMessage("Erro ao carregar os dados de contato.");
        setLoading(false);
      }
    };

    fetchContactData();
  }, [userToken]);

  const handleConfigChange = (e, platform, field) => {
    let value = e.target.value;

    if (field === "number") {
      value = value.replace(/\D/g, "");
    }

    setContactConfig((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], [field]: value },
    }));
    setUpdated(false);
  };

  const handleCountryCodeChange = (e, platform) => {
    const newCountryCode = e.target.value;

    setContactConfig((prevConfig) => ({
      ...prevConfig,
      [platform]: {
        ...prevConfig[platform],
        countryCode: newCountryCode,
      },
    }));
  };

  const saveConfig = async () => {
    setLoading(true);
    setMessage("");

    const phoneNumberWithCountry = `${contactConfig.phone.countryCode}${contactConfig.phone.number.replace(/\D/g, '')}`;
    const whatsappNumberWithCountry = `${contactConfig.whatsapp.countryCode}${contactConfig.whatsapp.number.replace(/\D/g, '')}`;

    const payload = {
      whatsappNumber: formatPhoneBackend(whatsappNumberWithCountry),
      whatsappMessage: contactConfig.whatsapp.message,
      whatsappCountryCode: contactConfig.whatsapp.countryCode,
      telegramUsername: contactConfig.telegram.username,
      phoneNumber: formatPhoneBackend(phoneNumberWithCountry),
      phoneCountryCode: contactConfig.phone.countryCode,
    };

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/contact/update`,
        payload,
        { withCredentials: true }
      );

      setMessage("✨ Dados atualizados com sucesso!");
      setUpdated(true);
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      console.error("Erro ao atualizar contatos:", error);
      setMessage("❌ Erro ao salvar os dados. Tente novamente.");
      setTimeout(() => setMessage(""), 5000);
    }

    setLoading(false);
  };

  const renderWhatsAppSection = () => (
    <motion.div
      className={`bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100 ${getHighlightClass('whatsapp-section')}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center mr-3 md:mr-4">
          <FaWhatsapp className="text-white text-lg md:text-xl" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800">WhatsApp</h3>
          <p className="text-gray-600 text-xs md:text-sm">Configure seu contato via WhatsApp</p>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        {/* Mensagem fixa info */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 md:p-4">
          <div className="flex items-start space-x-2 md:space-x-3">
            <FaInfoCircle className="text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-green-800 mb-2 text-sm md:text-base">📱 Mensagem Automática</h4>
              <p className="text-xs md:text-sm text-green-700 italic">
                <strong>Mensagem padrão:</strong> &quot;Olá, {userName}! Encontrei seu anúncio no Faixa Rosa em {userCity}-{userState}.&quot;
              </p>

            </div>
          </div>
        </div>

        {/* País e Número */}
        <div className="space-y-3 md:space-y-4">
          <label className="block text-sm md:text-base font-semibold text-gray-800">
            País e Número do WhatsApp
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={contactConfig.whatsapp.countryCode}
              onChange={(e) => handleCountryCodeChange(e, "whatsapp")}
              className="sm:max-w-[200px] p-3 md:p-3 border-2 border-gray-200 rounded-xl md:rounded-2xl focus:border-green-500 focus:outline-none transition-all duration-300 text-sm md:text-base"
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.code} - {country.country}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Número do WhatsApp (com DDD)"
              value={contactConfig.whatsapp.number ? formatPhoneDisplay(contactConfig.whatsapp.number) : ""}
              maxLength={15}
              onChange={(e) => handleConfigChange(e, "whatsapp", "number")}
              className="flex-1 p-3 md:p-3 border-2 border-gray-200 rounded-xl md:rounded-2xl focus:border-green-500 focus:outline-none transition-all duration-300 text-sm md:text-base"
            />
          </div>
        </div>

        {/* Mensagem personalizada */}
        <div className="space-y-3">
          <label className="block text-sm md:text-base font-semibold text-gray-800">
            Mensagem Personalizada (Opcional)
          </label>
          <textarea
            placeholder="Digite uma mensagem personalizada para seus clientes..."
            value={contactConfig.whatsapp.message}
            maxLength={200}
            onChange={(e) => handleConfigChange(e, "whatsapp", "message")}
            rows={3}
            className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl md:rounded-2xl focus:border-green-500 focus:outline-none transition-all duration-300 resize-none text-sm md:text-base"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Deixe vazio para usar a mensagem padrão</span>
            <span>{contactConfig.whatsapp.message.length}/200</span>
          </div>
        </div>

        {/* Dicas */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 md:p-4">
          <h4 className="font-semibold text-blue-800 mb-2 text-sm md:text-base flex items-center">
            <FaLightbulb className="mr-2" />
            💡 Dicas para WhatsApp:
          </h4>
          <ul className="text-xs md:text-sm text-blue-700 space-y-1">
            <li>• Use um número ativo que você acessa frequentemente</li>
            <li>• Personalize a mensagem para ser mais acolhedora</li>
            <li>• Responda rapidamente para manter o interesse</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );

  const renderTelegramSection = () => (
    <motion.div
      className={`bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100 ${getHighlightClass('telegram-section')}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl md:rounded-2xl flex items-center justify-center mr-3 md:mr-4">
          <FaTelegram className="text-white text-lg md:text-xl" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800">Telegram</h3>
          <p className="text-gray-600 text-xs md:text-sm">Configure seu usuário do Telegram</p>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        <div className="space-y-3">
          <label className="block text-sm md:text-base font-semibold text-gray-800">
            Nome de Usuário do Telegram
          </label>
          <div className="relative">
            <span className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm md:text-base">@</span>
            <input
              type="text"
              placeholder="seuusuario"
              maxLength={50}
              value={contactConfig.telegram.username}
              onChange={(e) => handleConfigChange(e, "telegram", "username")}
              className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-3 md:py-3 border-2 border-gray-200 rounded-xl md:rounded-2xl focus:border-blue-500 focus:outline-none transition-all duration-300 text-sm md:text-base"
            />
          </div>
          <p className="text-xs md:text-sm text-gray-500">
            Digite apenas o nome de usuário, sem o @ no início
          </p>
        </div>

        {/* Preview */}
        {contactConfig.telegram.username && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 md:p-4">
            <div className="flex items-center space-x-2">
              <FaCheckCircle className="text-blue-500" />
              <span className="text-blue-800 font-medium text-sm md:text-base">
                Link do seu Telegram:
              </span>
            </div>
            <p className="text-blue-700 text-sm md:text-base mt-1 font-mono bg-white px-2 py-1 rounded">
              t.me/{contactConfig.telegram.username}
            </p>
          </div>
        )}

        {/* Dicas */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 md:p-4">
          <h4 className="font-semibold text-purple-800 mb-2 text-sm md:text-base flex items-center">
            <FaLightbulb className="mr-2" />
            💡 Dicas para Telegram:
          </h4>
          <ul className="text-xs md:text-sm text-purple-700 space-y-1">
            <li>• Certifique-se de que seu username está ativo</li>
            <li>• Configure sua privacidade para receber mensagens</li>
            <li>• Telegram oferece mais privacidade que WhatsApp</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );

  const renderPhoneSection = () => (
    <motion.div
      className={`bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100 ${getHighlightClass('phone-section')}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-gray-500 to-slate-600 rounded-xl md:rounded-2xl flex items-center justify-center mr-3 md:mr-4">
          <FaPhoneAlt className="text-white text-lg md:text-xl" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800">Telefone</h3>
          <p className="text-gray-600 text-xs md:text-sm">Configure seu número para ligações</p>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        <div className="space-y-3">
          <label className="block text-sm md:text-base font-semibold text-gray-800">
            País e Número de Telefone
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={contactConfig.phone.countryCode}
              onChange={(e) => handleCountryCodeChange(e, "phone")}
              className="sm:max-w-[200px] p-3 md:p-3 border-2 border-gray-200 rounded-xl md:rounded-2xl focus:border-gray-500 focus:outline-none transition-all duration-300 text-sm md:text-base"
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.code} - {country.country}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Número de telefone (com DDD)"
              value={contactConfig.phone.number ? formatPhoneDisplay(contactConfig.phone.number) : ""}
              maxLength={15}
              onChange={(e) => handleConfigChange(e, "phone", "number")}
              className="flex-1 p-3 md:p-3 border-2 border-gray-200 rounded-xl md:rounded-2xl focus:border-gray-500 focus:outline-none transition-all duration-300 text-sm md:text-base"
            />
          </div>
        </div>

        {/* Preview */}
        {contactConfig.phone.number && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 md:p-4">
            <div className="flex items-center space-x-2">
              <FaCheckCircle className="text-gray-500" />
              <span className="text-gray-800 font-medium text-sm md:text-base">
                Número formatado:
              </span>
            </div>
            <p className="text-gray-700 text-sm md:text-base mt-1 font-mono bg-white px-2 py-1 rounded">
              {contactConfig.phone.countryCode} {formatPhoneDisplay(contactConfig.phone.number)}
            </p>
          </div>
        )}

        {/* Dicas */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 md:p-4">
          <h4 className="font-semibold text-orange-800 mb-2 text-sm md:text-base flex items-center">
            <FaLightbulb className="mr-2" />
            💡 Dicas para Telefone:
          </h4>
          <ul className="text-xs md:text-sm text-orange-700 space-y-1">
            <li>• Use um número que você atenda regularmente</li>
            <li>• Telefone passa mais confiança para novos clientes</li>
            <li>• Considere horários de atendimento</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );

  // Loading screen
  if (loading && !contactConfig.whatsapp.number && !contactConfig.telegram.username && !contactConfig.phone.number) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <motion.div
          className="text-center p-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4"
          >
            <Image
              src="/iconOficial_faixaRosa.png"
              alt="Loading"
              width={64}
              height={64}
              className="w-full h-full"
            />
          </motion.div>
          <p className="text-gray-600 font-medium text-sm md:text-base">Carregando configurações de contato...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto p-3 md:p-4 lg:p-8">
        {/* Header MOBILE OPTIMIZED */}
        <motion.div
          className="mb-6 md:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 md:mb-4">
              Configuração de Contatos
            </h1>
            <p className="text-gray-600 text-sm md:text-lg mb-4">
              Configure seus meios de contato para facilitar a comunicação com seus clientes
            </p>

            {/* Tutorial Button */}
            <motion.button
              onClick={() => setShowTutorial(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center space-x-2 text-sm md:text-base mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlay />
              <span>Como Configurar Contatos</span>
            </motion.button>
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden mb-4 ${getHighlightClass('navigation')}`}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between bg-white p-4 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="flex items-center space-x-3">
                {sections.find(s => s.id === activeSection)?.icon && (
                  React.createElement(sections.find(s => s.id === activeSection).icon, {
                    className: `text-${sections.find(s => s.id === activeSection).color}-500 text-lg`
                  })
                )}
                <span className="font-semibold text-gray-800">
                  {sections.find(s => s.id === activeSection)?.label}
                </span>
              </div>
              {isMobileMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  className="mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => {
                          setActiveSection(section.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 p-4 text-left transition-colors ${activeSection === section.id
                          ? `bg-${section.color}-50 text-${section.color}-600 border-r-4 border-${section.color}-500`
                          : "text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        <Icon className="text-lg" />
                        <span className="font-medium">{section.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex flex-wrap justify-center gap-2 bg-gray-100 p-2 rounded-3xl ${getHighlightClass('navigation')}`}>
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${activeSection === section.id
                    ? `bg-white text-${section.color}-600 shadow-lg`
                    : "text-gray-600 hover:text-gray-800"
                    }`}
                >
                  <Icon className="text-lg" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content based on active section */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === "whatsapp" && renderWhatsAppSection()}
          {activeSection === "telegram" && renderTelegramSection()}
          {activeSection === "phone" && renderPhoneSection()}
        </motion.div>

        {/* Status Cards - Mobile Optimized */}
        <motion.div
          className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* WhatsApp Status */}
          <div className={`bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-md border ${contactConfig.whatsapp.number ? 'border-green-200 bg-green-50' : 'border-gray-200'
            }`}>
            <div className="flex items-center space-x-2 md:space-x-3">
              <FaWhatsapp className={`text-lg md:text-xl ${contactConfig.whatsapp.number ? 'text-green-500' : 'text-gray-400'}`} />
              <div>
                <h4 className="font-semibold text-gray-800 text-xs md:text-sm">WhatsApp</h4>
                <p className={`text-xs ${contactConfig.whatsapp.number ? 'text-green-600' : 'text-gray-500'}`}>
                  {contactConfig.whatsapp.number ? 'Configurado' : 'Não configurado'}
                </p>
              </div>
            </div>
          </div>

          {/* Telegram Status */}
          <div className={`bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-md border ${contactConfig.telegram.username ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
            }`}>
            <div className="flex items-center space-x-2 md:space-x-3">
              <FaTelegram className={`text-lg md:text-xl ${contactConfig.telegram.username ? 'text-blue-500' : 'text-gray-400'}`} />
              <div>
                <h4 className="font-semibold text-gray-800 text-xs md:text-sm">Telegram</h4>
                <p className={`text-xs ${contactConfig.telegram.username ? 'text-blue-600' : 'text-gray-500'}`}>
                  {contactConfig.telegram.username ? 'Configurado' : 'Não configurado'}
                </p>
              </div>
            </div>
          </div>

          {/* Phone Status */}
          <div className={`bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-md border ${contactConfig.phone.number ? 'border-gray-300 bg-gray-50' : 'border-gray-200'
            }`}>
            <div className="flex items-center space-x-2 md:space-x-3">
              <FaPhoneAlt className={`text-lg md:text-xl ${contactConfig.phone.number ? 'text-gray-600' : 'text-gray-400'}`} />
              <div>
                <h4 className="font-semibold text-gray-800 text-xs md:text-sm">Telefone</h4>
                <p className={`text-xs ${contactConfig.phone.number ? 'text-gray-600' : 'text-gray-500'}`}>
                  {contactConfig.phone.number ? 'Configurado' : 'Não configurado'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Save button MOBILE OPTIMIZED */}
        <motion.div
          className={`mt-6 md:mt-8 ${getHighlightClass('save-button')}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={saveConfig}
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-3xl font-bold text-base md:text-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-3 shadow-2xl"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin text-lg md:text-xl" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <FaSave className="text-lg md:text-xl" />
                <span>Atualizar Contatos</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Success/Error message */}
        <AnimatePresence>
          {message && (
            <motion.div
              className={`fixed bottom-4 left-4 right-4 md:bottom-6 md:right-6 md:left-auto p-3 md:p-4 rounded-2xl shadow-2xl flex items-center space-x-3 z-50 ${message.includes('sucesso')
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
                }`}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              {message.includes('sucesso') ? (
                <FaCheckCircle className="text-lg md:text-xl flex-shrink-0" />
              ) : (
                <FaExclamationTriangle className="text-lg md:text-xl flex-shrink-0" />
              )}
              <span className="font-semibold text-sm md:text-base">{message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tutorial Modal MOBILE OPTIMIZED */}
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto relative"
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
                      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-br ${currentTutorial.color}`}>
                        <IconComponent className="text-white text-2xl md:text-3xl" />
                      </div>

                      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                        {currentTutorial.title}
                      </h3>

                      <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
                        {currentTutorial.description}
                      </p>

                      {/* Tip Section */}
                      {currentTutorial.tip && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                          <p className="text-xs md:text-sm text-yellow-800 font-medium">
                            {currentTutorial.tip}
                          </p>
                        </div>
                      )}

                      {/* Progress indicators */}
                      <div className="flex justify-center items-center space-x-2 mb-6">
                        {tutorialSteps.map((_, index) => (
                          <div
                            key={index}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentStep
                              ? "bg-pink-500 w-8 md:w-10"
                              : index < currentStep
                                ? "bg-green-500 w-2"
                                : "bg-gray-300 w-2"
                              }`}
                          />
                        ))}
                      </div>

                      {/* Navigation buttons */}
                      <div className="flex justify-between items-center">
                        <div className="text-xs md:text-sm text-gray-500 font-medium">
                          {currentStep + 1} de {tutorialSteps.length}
                        </div>

                        <div className="flex space-x-3">
                          {currentStep > 0 && (
                            <button
                              onClick={handlePrevStep}
                              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm md:text-base"
                            >
                              Anterior
                            </button>
                          )}

                          <button
                            onClick={handleNextStep}
                            className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base bg-gradient-to-r ${currentTutorial.color} text-white hover:shadow-lg`}
                          >
                            {currentStep === tutorialSteps.length - 1 ? "Finalizar" : currentTutorial.action}
                          </button>
                        </div>
                      </div>

                      {/* Close button */}
                      <button
                        onClick={closeTutorial}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <FaTimes className="text-lg md:text-xl" />
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

export default Metrics;