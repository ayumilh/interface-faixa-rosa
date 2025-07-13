"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaDollarSign,
  FaEdit,
  FaCheck,
  FaTimes,
  FaBuilding,
  FaWifi,
  FaHome,
  FaUtensils,
  FaPlane,
  FaGlassMartini,
  FaGlassCheers,
  FaBed,
  FaShower,
  FaCouch,
  FaParking,
  FaCheckCircle,
  FaSpinner,
  FaInfoCircle,
  FaLightbulb,
  FaPlay,
  FaGraduationCap,
  FaLocationArrow,
  FaCog,
  FaSave,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp,
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
  FaEye,
  FaTimesCircle
} from "react-icons/fa";
import Modal from "../../components/dashboard/Modal";
import ModalBusca from "../../components/search/modalbuscaconvenio";
import Cookies from "js-cookie";
import Image from "next/image";
import { toast } from "react-toastify";

const CityManagement = ({ onUpdate }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      city: "",
    },
  });

  // Estados principais
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Estados do tutorial
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Estados de dados
  const [showModalBusca, setShowModalBusca] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedUF, setSelectedUF] = useState("");
  const [intermediaries, setIntermediaries] = useState({
    localities: [],
    amenities: [],
  });

  // Estados para modais
  const [showLocalitiesModal, setShowLocalitiesModal] = useState(false);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);

  // Configuração das tabs
  const tabs = [
    { id: "overview", label: "Resumo", icon: FaChartLine },
    { id: "city", label: "Cidade", icon: FaMapMarkerAlt },
    { id: "localities", label: "Locais", icon: FaBuilding },
    { id: "amenities", label: "Comodidades", icon: FaWifi },
  ];

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Bem-vinda à Gestão de Localidade! 📍",
      description: "Vamos configurar sua cidade, locais atendidos e comodidades oferecidas para atrair mais clientes",
      icon: FaGraduationCap,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Resumo das Configurações 📊",
      description: "Veja um panorama das suas configurações de localidade e comodidades em tempo real",
      icon: FaChartLine,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Configurar Cidade 🏙️",
      description: "Clique em 'Selecionar Cidade' para escolher onde você atende. Isso define sua localização principal no mapa",
      icon: FaMapMarkerAlt,
      color: "from-pink-500 to-rose-600"
    },
    {
      title: "Locais Atendidos 🏢",
      description: "Selecione onde você oferece seus serviços: hotéis, motéis, a domicílio, etc. Quanto mais opções, melhor!",
      icon: FaBuilding,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Comodidades Oferecidas ✨",
      description: "Marque as comodidades que você disponibiliza: WiFi, ar-condicionado, estacionamento, etc.",
      icon: FaWifi,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Salvar Configurações 💾",
      description: "Após configurar tudo, sempre clique em 'Salvar' em cada seção. Suas informações aparecerão no seu perfil público!",
      icon: FaSave,
      color: "from-purple-500 to-pink-500"
    }
  ];

  const LOCATION_ENUMS = {
    "A domicílio": "A_DOMICILIO",
    "Festas e Eventos": "FESTAS_EVENTOS",
    "Hotéis": "HOTEIS",
    "Local Próprio": "LOCAL_PROPRIO",
    "Motéis": "MOTEIS",
    "Viagens": "VIAGENS",
    "Club de Swing": "CLUB_DE_SWING",
    "Jantares": "JANTARES",
    "Despedida de Solteiro": "DESPEDIDA_SOLTEIRO",
  };

  const AMENITIES_ENUMS = {
    "WiFi": "WIFI",
    "Chuveiro": "CHUVEIRO",
    "Ar_condicionado": "AR_CONDICIONADO",
    "Estacionamento": "ESTACIONAMENTO",
    "Frigobar": "FRIGOBAR",
    "Preservativos": "PRESERVATIVOS",
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

  // Função para buscar locais atendidos e comodidades
  const fetchIntermediaries = async (cityName, uf) => {
    try {
      const data = {
        localities: [],
        amenities: [],
      };

      setIntermediaries((prev) => ({
        ...prev,
        localities: prev.localities.length ? prev.localities : data.localities,
        amenities: prev.amenities.length ? prev.amenities : data.amenities,
      }));
    } catch (error) {
      console.error("Erro ao buscar intermediações", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = Cookies.get("userToken");

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/locations`,
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );

        if (response.status === 200) {
          const data = response.data;

          setSelectedCity(data.city);
          setSelectedUF(data.state);
          setValue("city", `${data.city} - ${data.state}`);

          const attendedLocations = data.attendedLocations.map((loc) => loc.name);
          const amenities = data.amenities;

          setIntermediaries((prev) => ({
            ...prev,
            localities: attendedLocations,
            amenities: amenities || [],
          }));
        } else {
          console.error("Erro ao buscar dados:", data.error);
        }
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar locais:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [setValue]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleSelectCity = (cityName, uf) => {
    setSelectedCity(cityName);
    setSelectedUF(uf);
    setValue("city", `${cityName} - ${uf}`);

    fetchIntermediaries(cityName, uf).then(() => {
      setIntermediaries((prev) => ({
        localities: prev.localities.length ? prev.localities : prev.localities,
        amenities: prev.amenities.length ? prev.amenities : prev.amenities,
      }));
    });
  };

  const confirmCityChange = () => {
    onUpdate({
      city: `${selectedCity} - ${selectedUF}`,
      localities: intermediaries.localities,
      amenities: intermediaries.amenities,
    });

    setIsConfirmModalOpen(false);
  };

  const updateLocationsAndAmenities = async () => {
    try {
      const userToken = Cookies.get("userToken");

      const formatEnum = (str) =>
        str
          .toUpperCase()
          .replace(/\sE\s/g, " ")
          .replace(/\s/g, "_")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

      // Converte os valores para os ENUMs esperados pelo backend
      const locations = intermediaries.localities.map((loc) => formatEnum(loc));
      const amenities = intermediaries.amenities.map(formatEnum);

      // Tratamento para evitar erro do backend
      const treatedLocations = locations
        .filter((loc) => loc && typeof loc === "string")
        .map((loc) => ({ name: loc, type: loc }));

      const treatedAmenities = amenities.filter((a) => typeof a === "string");

      const payload = {
        city: selectedCity || null,
        state: selectedUF || null,
        locations: treatedLocations,
        amenities: treatedAmenities,
      };

      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/locations/update`,
        payload,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      toast.success("✨ Dados de localidade atualizados com sucesso!");

      // Atualiza o estado corretamente sem sobrescrever os valores existentes
      setIntermediaries((prev) => ({
        localities: locations,
        amenities: amenities,
      }));

      setShowLocalitiesModal(false);
      setShowAmenitiesModal(false);
      setIsConfirmModalOpen(false);
    } catch (error) {
      if (error.response?.data?.details?.includes("LocationType")) {
        toast.error("❌ Erro: Localidade inválida ou não encontrada.");
      } else if (error.response?.data?.error) {
        toast.error(`❌ Erro: ${error.response.data.error}`);
      } else {
        toast.error("❌ Erro ao atualizar os dados. Tente novamente.");
      }
    }
  };

  // Atualiza corretamente os valores no estado antes de salvar
  const handleLocalityChange = (value) => {
    setIntermediaries((prev) => {
      // Verifica se o valor já é um ENUM (caso já tenha sido convertido antes)
      const enumValue = LOCATION_ENUMS[value] || value;

      if (!Object.values(LOCATION_ENUMS).includes(enumValue)) {
        console.error(`Erro: O local '${value}' não tem um ENUM correspondente.`);
        return prev;
      }

      const updatedLocalities = prev.localities.includes(enumValue)
        ? prev.localities.filter((loc) => loc !== enumValue)
        : [...prev.localities, enumValue];

      return { ...prev, localities: updatedLocalities };
    });
  };

  const handleAmenityChange = (value) => {
    setIntermediaries((prev) => {
      const enumValue = AMENITIES_ENUMS[value] || value; // Converte para ENUM se necessário

      if (!Object.values(AMENITIES_ENUMS).includes(enumValue)) {
        console.error(`Erro: A comodidade '${value}' não tem um ENUM correspondente.`);
        return prev;
      }

      const updatedAmenities = prev.amenities.includes(enumValue)
        ? prev.amenities.filter((amenity) => amenity !== enumValue)
        : [...prev.amenities, enumValue];

      return { ...prev, amenities: updatedAmenities };
    });
  };

  // Salva os valores corretamente antes de enviar ao backend
  const handleSaveLocalities = () => {
    updateLocationsAndAmenities();
  };

  const handleSaveAmenities = () => {
    updateLocationsAndAmenities();
  };

  // Função para formatar nomes das opções
  const formatOptionName = (value) => {
    return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Calcular estatísticas
  const totalLocations = Object.keys(LOCATION_ENUMS).length;
  const totalAmenities = Object.keys(AMENITIES_ENUMS).length;
  const configuredLocations = intermediaries.localities.length;
  const configuredAmenities = intermediaries.amenities.length;

  const renderOverviewTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {/* Cidade Configurada */}
        <motion.div
          className="bg-gradient-to-br from-pink-500 to-rose-500 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10"></div>
          <FaMapMarkerAlt className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-pink-200" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">Cidade</h3>
          <div className="text-sm sm:text-base">
            {selectedCity ? "Configurada" : "Não configurada"}
          </div>
        </motion.div>

        {/* Locais Atendidos */}
        <motion.div
          className="bg-gradient-to-br from-blue-500 to-indigo-500 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10"></div>
          <FaBuilding className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-blue-200" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">Locais</h3>
          <div className="text-2xl sm:text-3xl font-bold">{configuredLocations}/{totalLocations}</div>
        </motion.div>

        {/* Comodidades */}
        <motion.div
          className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10"></div>
          <FaWifi className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-green-200" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">Comodidades</h3>
          <div className="text-2xl sm:text-3xl font-bold">{configuredAmenities}/{totalAmenities}</div>
        </motion.div>

        {/* Status Geral */}
        <motion.div
          className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white relative overflow-hidden sm:col-span-2 lg:col-span-1"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10"></div>
          <FaTrophy className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-purple-200" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">Status</h3>
          <div className="text-sm sm:text-lg">
            {selectedCity && configuredLocations > 0 ? "Completo" : "Configurar"}
          </div>
        </motion.div>
      </div>

      {/* Localização atual */}
      {selectedCity && (
        <motion.div
          className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
            <FaMapMarkerAlt className="text-pink-500 mr-2" />
            Sua Localização Principal
          </h3>
          
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{selectedCity} - {selectedUF}</h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Cidade onde você aparece no mapa e buscas</p>
              </div>
              <div className="bg-pink-500 text-white p-2 rounded-full">
                <FaCheckCircle className="text-sm sm:text-base" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Resumo dos locais configurados */}
      {configuredLocations > 0 && (
        <motion.div
          className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
            <FaBuilding className="text-blue-500 mr-2" />
            Locais Onde Você Atende
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {intermediaries.localities.slice(0, 6).map((locality, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center">
                  <FaCheckCircle className="text-blue-500 mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base font-medium text-gray-800">
                    {formatOptionName(locality)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {configuredLocations > 6 && (
            <p className="text-center text-gray-500 text-sm mt-4">
              +{configuredLocations - 6} locais adicionais
            </p>
          )}
        </motion.div>
      )}

      {/* Resumo das comodidades */}
      {configuredAmenities > 0 && (
        <motion.div
          className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
            <FaWifi className="text-green-500 mr-2" />
            Comodidades Oferecidas
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {intermediaries.amenities.map((amenity, index) => (
              <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-800">
                    {formatOptionName(amenity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Dicas de otimização */}
      <motion.div
        className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl sm:rounded-2xl p-4 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="bg-yellow-500 p-3 rounded-full w-fit">
            <FaLightbulb className="text-white text-lg sm:text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-2">
              💡 Dicas para aumentar sua visibilidade
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Configure sua cidade principal corretamente</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Ofereça múltiplos locais de atendimento</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Adicione comodidades extras</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Atualize regularmente suas informações</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress de configuração */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Completude da Configuração</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Cidade configurada</span>
            {selectedCity ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaExclamationTriangle className="text-yellow-500" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Locais selecionados</span>
            {configuredLocations > 0 ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaExclamationTriangle className="text-yellow-500" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Comodidades configuradas</span>
            {configuredAmenities > 0 ? (
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
              {Math.round(
                ((selectedCity ? 1 : 0) + 
                 (configuredLocations > 0 ? 1 : 0) + 
                 (configuredAmenities > 0 ? 1 : 0)) / 3 * 100
              )}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${Math.round(
                  ((selectedCity ? 1 : 0) + 
                   (configuredLocations > 0 ? 1 : 0) + 
                   (configuredAmenities > 0 ? 1 : 0)) / 3 * 100
                )}%`
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCityTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Seção de cidade */}
      <motion.div
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
              <FaMapMarkerAlt className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Cidade de Atuação</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {selectedCity ? `📍 ${selectedCity} - ${selectedUF}` : '⚪ Nenhuma cidade selecionada'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Info sobre cidade */}
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 sm:p-4">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <FaInfoCircle className="text-pink-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-pink-800 mb-2 text-sm sm:text-base">📍 Sua Localização Principal</h4>
                <p className="text-xs sm:text-sm text-pink-700">
                  Esta será a cidade onde você aparecerá no mapa e nas buscas dos clientes. Escolha com cuidado!
                </p>
              </div>
            </div>
          </div>

          {/* Campo de cidade */}
          <div className="space-y-3">
            <label className="block text-sm sm:text-base font-semibold text-gray-800">
              Cidade Selecionada
            </label>
            <div className="flex">
              <input
                type="text"
                placeholder="Nenhuma cidade selecionada"
                value={selectedCity ? `${selectedCity} - ${selectedUF}` : ""}
                readOnly
                className="flex-1 p-3 sm:p-4 border-2 border-gray-200 rounded-l-xl bg-gray-50 text-gray-700 font-medium text-sm sm:text-base focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowModalBusca(true)}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 sm:px-6 rounded-r-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 flex items-center justify-center"
              >
                <FaEdit className="text-sm sm:text-base" />
              </button>
            </div>
          </div>

          {/* Preview da cidade */}
          {selectedCity && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500" />
                <span className="text-green-800 font-medium text-sm sm:text-base">
                  Cidade configurada: 
                </span>
              </div>
              <p className="text-green-700 text-sm sm:text-base mt-1 font-mono bg-white px-2 py-1 rounded">
                {selectedCity} - {selectedUF}
              </p>
            </div>
          )}

          {/* Dicas */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base flex items-center">
              <FaLightbulb className="mr-2" />
              💡 Dicas importantes:
            </h4>
            <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
            <li>• Escolha a cidade onde você tem mais facilidade de atender</li>
<li>• Clientes buscam por cidade, então seja estratégica na escolha</li>
<li>• Você pode atender cidades próximas marcando em &quot;Locais&quot;</li>

            </ul>
          </div>

          {/* Botão salvar */}
          <motion.button
            onClick={() => updateLocationsAndAmenities()}
            disabled={!selectedCity}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 text-sm sm:text-base"
            whileHover={{ scale: selectedCity ? 1.02 : 1 }}
            whileTap={{ scale: selectedCity ? 0.98 : 1 }}
          >
            <FaSave />
            <span>Salvar Cidade</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );

  const renderLocalitiesTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Seção de locais */}
      <motion.div
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <FaBuilding className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Locais Atendidos</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {configuredLocations > 0 ? `✅ ${configuredLocations} locais selecionados` : '⚪ Nenhum local selecionado'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Info sobre locais */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">🏢 Onde Você Atende</h4>
                <p className="text-xs sm:text-sm text-blue-700">
                  Selecione todos os tipos de locais onde você oferece seus serviços. Mais opções = mais clientes!
                </p>
              </div>
            </div>
          </div>

          {/* Botão para selecionar */}
          <div className="space-y-3">
            <label className="block text-sm sm:text-base font-semibold text-gray-800">
              Tipos de Locais
            </label>
            <div className="flex">
              <input
                type="text"
                placeholder="Clique para selecionar locais"
                value={intermediaries.localities.map(formatOptionName).join(", ")}
                readOnly
                className="flex-1 p-3 sm:p-4 border-2 border-gray-200 rounded-l-xl bg-gray-50 text-gray-700 font-medium text-sm sm:text-base focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowLocalitiesModal(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 sm:px-6 rounded-r-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center"
              >
                <FaEdit className="text-sm sm:text-base" />
              </button>
            </div>
          </div>

          {/* Preview dos locais selecionados */}
          {configuredLocations > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4">
              <h4 className="font-semibold text-green-800 mb-3 text-sm sm:text-base flex items-center">
                <FaCheckCircle className="mr-2" />
                Locais Selecionados:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {intermediaries.localities.map((locality, index) => (
                  <div key={index} className="bg-white px-3 py-2 rounded-lg text-green-700 text-xs sm:text-sm font-medium">
                    • {formatOptionName(locality)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dicas */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 sm:p-4">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm sm:text-base flex items-center">
              <FaLightbulb className="mr-2" />
              💡 Estratégias:
            </h4>
            <ul className="text-xs sm:text-sm text-purple-700 space-y-1">
            <li>• &quot;A domicílio&quot; atrai clientes que valorizam privacidade</li>
<li>• &quot;Hotéis&quot; é popular entre executivos e viajantes</li>
<li>• &quot;Eventos&quot; pode gerar contratos de maior valor</li>

            </ul>
          </div>

          {/* Botão salvar */}
          <motion.button
            onClick={handleSaveLocalities}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaSave />
            <span>Salvar Locais</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );

  const renderAmenitiesTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Seção de comodidades */}
      <motion.div
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <FaWifi className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Comodidades</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {configuredAmenities > 0 ? `✅ ${configuredAmenities} comodidades oferecidas` : '⚪ Nenhuma comodidade selecionada'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Info sobre comodidades */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <FaInfoCircle className="text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">✨ Diferenciais que Você Oferece</h4>
                <p className="text-xs sm:text-sm text-green-700">
                  Comodidades extras justificam valores mais altos e atraem clientes exigentes!
                </p>
              </div>
            </div>
          </div>

          {/* Botão para selecionar */}
          <div className="space-y-3">
            <label className="block text-sm sm:text-base font-semibold text-gray-800">
              Comodidades Oferecidas
            </label>
            <div className="flex">
              <input
                type="text"
                placeholder="Clique para selecionar comodidades"
                value={intermediaries.amenities.map(formatOptionName).join(", ")}
                readOnly
                className="flex-1 p-3 sm:p-4 border-2 border-gray-200 rounded-l-xl bg-gray-50 text-gray-700 font-medium text-sm sm:text-base focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowAmenitiesModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 sm:px-6 rounded-r-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center"
              >
                <FaEdit className="text-sm sm:text-base" />
              </button>
            </div>
          </div>

          {/* Preview das comodidades selecionadas */}
          {configuredAmenities > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
              <h4 className="font-semibold text-blue-800 mb-3 text-sm sm:text-base flex items-center">
                <FaCheckCircle className="mr-2" />
                Comodidades Oferecidas:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {intermediaries.amenities.map((amenity, index) => (
                  <div key={index} className="bg-white px-3 py-2 rounded-lg text-blue-700 text-xs sm:text-sm font-medium">
                    • {formatOptionName(amenity)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dicas */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 sm:p-4">
            <h4 className="font-semibold text-orange-800 mb-2 text-sm sm:text-base flex items-center">
              <FaLightbulb className="mr-2" />
              💡 Valor agregado:
            </h4>
            <ul className="text-xs sm:text-sm text-orange-700 space-y-1">
              <li>• WiFi: Essencial para executivos e viajantes</li>
              <li>• Estacionamento: Grande diferencial em centros urbanos</li>
              <li>• Ar-condicionado: Comfort que justifica preços premium</li>
            </ul>
          </div>

          {/* Botão salvar */}
          <motion.button
            onClick={handleSaveAmenities}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaSave />
            <span>Salvar Comodidades</span>
          </motion.button>
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
          <p className="text-gray-600 font-medium text-sm sm:text-base">Carregando configurações...</p>
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
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Gestão de Localidade
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Configure onde você atende e que comodidades oferece
              </p>
            </div>
            
            <button
              onClick={() => setShowTutorial(true)}
              className="mt-4 lg:mt-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base mx-auto lg:mx-0"
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
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                          activeTab === tab.id
                            ? "bg-pink-50 text-pink-600 border-r-4 border-pink-500"
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
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap text-sm sm:text-base ${
                    activeTab === tab.id
                      ? "bg-white text-pink-600 shadow-lg"
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
          {activeTab === "city" && renderCityTab()}
          {activeTab === "localities" && renderLocalitiesTab()}
          {activeTab === "amenities" && renderAmenitiesTab()}
        </motion.div>

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
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentStep ? "bg-pink-500 w-6 sm:w-8" : "bg-gray-300"
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
                            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 text-sm sm:text-base"
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

        {/* Modais Originais */}
        {showModalBusca && (
          <ModalBusca
            showModalBusca={showModalBusca}
            setShowModalBusca={setShowModalBusca}
            onSelectCity={handleSelectCity}
          />
        )}

        {/* Modal para Selecionar Locais Atendidos */}
        {showLocalitiesModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Selecionar Locais Atendidos</h3>
              
              <div className="space-y-3">
                {[
                  { label: "A domicílio", value: "A_DOMICILIO", icon: <FaHome className="mr-3 text-blue-500" /> },
                  { label: "Festas e Eventos", value: "FESTAS_EVENTOS", icon: <FaBuilding className="mr-3 text-blue-500" /> },
                  { label: "Hotéis", value: "HOTEIS", icon: <FaBuilding className="mr-3 text-blue-500" /> },
                  { label: "Local Próprio", value: "LOCAL_PROPRIO", icon: <FaHome className="mr-3 text-blue-500" /> },
                  { label: "Motéis", value: "MOTEIS", icon: <FaBed className="mr-3 text-blue-500" /> },
                  { label: "Viagens", value: "VIAGENS", icon: <FaPlane className="mr-3 text-blue-500" /> },
                  { label: "Club de Swing", value: "CLUB_DE_SWING", icon: <FaGlassMartini className="mr-3 text-blue-500" /> },
                  { label: "Jantares", value: "JANTARES", icon: <FaUtensils className="mr-3 text-blue-500" /> },
                  { label: "Despedida de Solteiro", value: "DESPEDIDA_SOLTEIRO", icon: <FaGlassCheers className="mr-3 text-blue-500" /> },
                ].map((item, index) => (
                  <label key={index} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      className="mr-3 w-4 h-4 text-blue-500"
                      value={item.value}
                      checked={intermediaries.localities.includes(item.value)}
                      onChange={() => handleLocalityChange(item.value)}
                    />
                    {item.icon}
                    <span className="font-medium text-gray-800">{item.label}</span>
                  </label>
                ))}
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowLocalitiesModal(false)}
                  className="bg-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-400 transition-colors flex items-center"
                >
                  <FaTimes className="mr-2" />
                  Cancelar
                </button>
                <button
                  onClick={handleSaveLocalities}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center"
                >
                  <FaCheck className="mr-2" />
                  Salvar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Modal para Selecionar Comodidades */}
        {showAmenitiesModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Selecionar Comodidades</h3>
              
              <div className="space-y-3">
                {[
                  { label: "WiFi", value: "WIFI", icon: <FaWifi className="mr-3 text-green-500" /> },
                  { label: "Chuveiro", value: "CHUVEIRO", icon: <FaShower className="mr-3 text-green-500" /> },
                  { label: "Ar Condicionado", value: "AR_CONDICIONADO", icon: <FaCouch className="mr-3 text-green-500" /> },
                  { label: "Estacionamento", value: "ESTACIONAMENTO", icon: <FaParking className="mr-3 text-green-500" /> },
                  { label: "Frigobar", value: "FRIGOBAR", icon: <FaDollarSign className="mr-3 text-green-500" /> },
                  { label: "Preservativos", value: "PRESERVATIVOS", icon: <FaBed className="mr-3 text-green-500" /> },
                ].map((item, index) => (
                  <label key={index} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      className="mr-3 w-4 h-4 text-green-500"
                      value={item.value}
                      checked={intermediaries.amenities.includes(item.value)}
                      onChange={() => handleAmenityChange(item.value)}
                    />
                    {item.icon}
                    <span className="font-medium text-gray-800">{item.label}</span>
                  </label>
                ))}
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowAmenitiesModal(false)}
                  className="bg-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-400 transition-colors flex items-center"
                >
                  <FaTimes className="mr-2" />
                  Cancelar
                </button>
                <button
                  onClick={handleSaveAmenities}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center"
                >
                  <FaCheck className="mr-2" />
                  Salvar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CityManagement;