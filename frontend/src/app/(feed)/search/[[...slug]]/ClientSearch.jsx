"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { usePlan } from "@/context/PlanContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  MapPin,
  Sparkle,
  MagnifyingGlass,
} from "phosphor-react";
import { IoIosArrowBack } from "react-icons/io";
import useStatusTracker from "@/hooks/useStatusTracker";

// Componentes necessários
import PropTypes from "prop-types";
import Navbar from "@/components/Navbar";
import Stories from "@/components/search/stories";
import Footer from "@/components/search/footer";
import CardVIP from "@/components/search/CardVIP";
import CardVIPDark from "@/components/search/CardVIPDark";
import CardPink from "@/components/search/CardPink";
import CardPinkDark from "@/components/search/CardPinkDark";
import CardSafira from "@/components/search/CardSafira";
import CardSafiraDark from "@/components/search/CardSafiraDark";
import CardRubi from "@/components/search/CardRubi";
import CardRubiDark from "@/components/search/CardRubiDark";

// Componente de Modal para Busca
const ModalBusca = ({ isOpen, onClose }) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [category, setCategory] = useState("acompanhantes");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);

  // Controla o scroll do body ao abrir/fechar modal
  useEffect(() => {
    if (isOpen) {
      setCity("");
      setSuggestions([]);
      setLoading(false);
      setCategory("acompanhantes");
      document.body.style.overflow = "hidden";

      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }

      // Adiciona listener para fechar com Esc
      const handleEsc = (event) => {
        if (event.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        window.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatCityURL = (cityName, state) => {
    const cidadeFormatada = encodeURIComponent(cityName.replace(/\s+/g, "-").toLowerCase());
    const estadoFormatado = encodeURIComponent(state.toUpperCase());

    // Redireciona para a URL correta com os parâmetros formatados
    router.push(`/search/acompanhantes-em-${cidadeFormatada}-${estadoFormatado}`);
  };

  // Normaliza o texto para busca
  const normalizeText = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  // Buscar cidades na API do IBGE
  const fetchCities = useCallback(async (query) => {
    if (query.length >= 2) {
      setLoading(true);
      try {
        const normalizedQuery = normalizeText(query);
        
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios`);
        if (!response.ok) {
          console.error("Erro ao buscar cidades:", response.statusText);
          setSuggestions([]);
          return;
        }

        const data = await response.json();
        
        // Filtra e remove duplicatas por nome da cidade
        const filteredCities = data.filter((cidade) =>
          normalizeText(cidade.nome).includes(normalizedQuery)
        );

        // Remove duplicatas mantendo apenas uma entrada por cidade + UF
        const uniqueCities = filteredCities.reduce((acc, cidade) => {
          const key = `${cidade.nome}-${cidade.microrregiao.mesorregiao.UF.sigla}`;
          if (!acc.has(key)) {
            acc.set(key, cidade);
          }
          return acc;
        }, new Map());

        // Converte de volta para array e limita resultados
        const finalResults = Array.from(uniqueCities.values()).slice(0, 10);
        
        setSuggestions(finalResults);
      } catch (error) {
        console.error("Erro ao buscar cidades", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
      setLoading(false);
    }
  }, []);

  const handleCityInput = (value) => {
    setCity(value);
    fetchCities(value);
  };

  // Quando o usuário seleciona uma cidade, busca acompanhantes e redireciona
  const handleCityClick = async (cidade) => {
    const cidadeFormatada = encodeURIComponent(cidade.nome);
    const estadoFormatado = encodeURIComponent(cidade.microrregiao.mesorregiao.UF.sigla.toUpperCase());

    router.push(`/search/acompanhantes-em-${cidadeFormatada}-${estadoFormatado}`);

    onClose();
  };

  // Exemplo de uso de Geolocalização
  const handleUseGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Aqui você poderia usar geocoding (ex. via Google Maps API) pra converter
          // lat/lng -> cidade. Neste exemplo, é fixo "Sorocaba - SP"
          const cityData = {
            nome: "Sorocaba",
            microrregiao: {
              mesorregiao: {
                UF: {
                  sigla: "SP",
                },
              },
            },
          };
          formatCityURL(cityData.nome, cityData.microrregiao.mesorregiao.UF.sigla);
          onClose();
        },
        (error) => {
          console.error("Erro ao obter localização", error);
        }
      );
    } else {
      console.error("Navegador não suporta geolocalização");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center items-center"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(147, 51, 234, 0.2) 50%, rgba(59, 130, 246, 0.2) 100%)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <motion.div
            className="relative w-11/12 sm:w-full sm:max-w-md md:max-w-lg mx-auto p-8 shadow-2xl transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.4, type: "spring", damping: 25, stiffness: 300 }}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.3)',
            }}
          >
            {/* Efeito de brilho no fundo */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-3xl opacity-50"></div>
            
            {/* Botão de Fechar */}
            <motion.button
              className="absolute top-6 right-6 text-gray-400 hover:text-pink-500 text-2xl font-bold focus:outline-none z-10 transition-all duration-300 hover:scale-110"
              onClick={onClose}
              aria-label="Fechar Modal"
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={28} weight="bold" />
            </motion.button>

            {/* Título do Modal */}
            <motion.div 
              className="relative z-10 mb-8 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <Sparkle size={32} className="text-pink-500" weight="duotone" />
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Encontre sua Cidade
                </h2>
                <Sparkle size={32} className="text-blue-500" weight="duotone" />
              </div>
              <p className="text-gray-600 text-sm">Descubra acompanhantes incríveis na sua região</p>
            </motion.div>

            {/* Campo de Busca */}
            <motion.div 
              className="relative z-10 flex flex-col gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative">
                  <MagnifyingGlass 
                    size={20} 
                    className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" 
                    weight="bold"
                  />
                  <input
                    type="text"
                    value={city}
                    ref={inputRef}
                    onChange={(e) => handleCityInput(e.target.value)}
                    placeholder="Digite o nome da cidade..."
                    className="w-full bg-white/90 backdrop-blur-sm rounded-2xl pl-14 pr-16 py-4 text-gray-700 focus:outline-none focus:ring-4 focus:ring-pink-500/30 transition-all duration-300 border border-gray-200/50 shadow-lg"
                    style={{
                      fontSize: '16px',
                      fontWeight: '500',
                    }}
                  />
                  {loading && (
                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <ArrowRight size={20} className="text-pink-500" />
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>

              {/* Botão de Geolocalização */}
              <motion.button
                onClick={handleUseGeoLocation}
                className="flex items-center justify-center gap-3 text-sm font-medium text-gray-600 hover:text-pink-500 transition-all duration-300 py-3 px-6 rounded-xl bg-gray-50/50 backdrop-blur-sm border border-gray-200/50 hover:bg-pink-50/50 hover:border-pink-200/50 hover:shadow-md group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MapPin size={18} className="group-hover:text-pink-500 transition-colors" weight="duotone" />
                Usar minha localização atual
                <motion.div
                  className="w-2 h-2 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.button>

              {/* Sugestões de Cidades */}
              <AnimatePresence>
                <motion.div 
                  className="max-h-64 overflow-y-auto rounded-2xl shadow-inner p-2"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(249, 250, 251, 0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(229, 231, 235, 0.5)',
                  }}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: loading || suggestions.length > 0 || (city && suggestions.length === 0) ? 1 : 0,
                    height: loading || suggestions.length > 0 || (city && suggestions.length === 0) ? 'auto' : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {loading ? (
                    <motion.div 
                      className="text-center py-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="inline-flex items-center gap-2 text-pink-500 font-medium"
                      >
                        <Sparkle size={20} weight="duotone" />
                        Buscando cidades...
                      </motion.div>
                    </motion.div>
                  ) : suggestions.length > 0 ? (
                    <div className="space-y-1">
                      {suggestions.map((cidade, index) => (
                        <motion.div
                          key={cidade.id}
                          onClick={() => handleCityClick(cidade)}
                          className="py-4 px-5 cursor-pointer hover:bg-white/80 rounded-xl transition-all duration-300 flex items-center gap-4 text-gray-700 hover:text-pink-600 group border border-transparent hover:border-pink-200/50 hover:shadow-md"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex-shrink-0">
                            <MapPin size={22} className="text-pink-500 group-hover:scale-110 transition-transform" weight="duotone" />
                          </div>
                          <div className="flex-1">
                            <span className="font-semibold text-gray-800 group-hover:text-pink-600">
                              {cidade.nome}
                            </span>
                            <span className="text-gray-500 ml-2 text-sm font-medium">
                              {cidade.microrregiao.mesorregiao.UF.sigla}
                            </span>
                          </div>
                          <ArrowRight 
                            size={18} 
                            className="text-gray-300 group-hover:text-pink-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" 
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    city && (
                      <motion.div 
                        className="text-center py-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="text-gray-500 font-medium">
                          <MapPin size={32} className="mx-auto mb-2 text-gray-300" />
                          Nenhuma cidade encontrada
                        </div>
                        <p className="text-sm text-gray-400">Tente uma busca diferente</p>
                      </motion.div>
                    )
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ModalBusca.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function Search() {
  const params = useParams();

  let slugString = "";
  if (params.slug) {
    slugString = Array.isArray(params.slug) ? params.slug.join("/") : params.slug;
  }

  const [city, setCity] = useState("");
  const [stateUF, setStateUF] = useState("");
  const [category, setCategory] = useState("acompanhantes");
  const [showModalBusca, setShowModalBusca] = useState(false);
  const [showModalFiltro, setShowModalFiltro] = useState(false);

  const { companions, fetchCompanions, loading } = usePlan();

  const slugify = (text) => {
    return text.replace(/\s+/g, '-'); // Apenas troca espaço por hífen
  };

  useEffect(() => {
    const regex = /(.*?)\-em\-(.*?)-(\w{2})$/;
    if (slugString) {
      const match = slugString.match(regex);
      if (match) {
        const citySlug = match[2];
        const uf = match[3];
        const cityName = decodeURIComponent(citySlug).replace(/-/g, " ");
        setCity(cityName);
        setStateUF(uf.toUpperCase());

        // Executa o fetch com a cidade e estado
        fetchCompanions({ cidade: cityName, estado: uf.toUpperCase() });
      } else {
        console.error("Formato do slug inválido:", slugString);
      }
    }
  }, [slugString, fetchCompanions]);

  useEffect(() => {
    if (slugString) {
      // Se vier da URL, e já temos cidade e estado, faz busca filtrada
      if (city && stateUF) {
        fetchCompanions({ cidade: city, estado: stateUF });
      }
    } else {
      // Se não veio da URL (ou acesso direto sem filtros), busca todas
      fetchCompanions();
    }
  }, [slugString, city, stateUF, fetchCompanions]);

  const companionIds = Array.isArray(companions) ? companions.map(c => c.userId) : [];
  const statusMap = useStatusTracker(companionIds);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background com gradiente animado */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-pink-50/30 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/5 to-transparent animate-pulse"></div>
      </div>

      {loading && (
        <motion.div 
          className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <motion.div 
            className="flex flex-col items-center gap-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/iconOficial_faixaRosa.png"
                alt="Ícone oficial Faixa Rosa"
                width={60}
                height={60}
                className="drop-shadow-lg"
              />
            </motion.div>
            <motion.p 
              className="text-pink-600 font-semibold text-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Carregando experiências incríveis...
            </motion.p>
          </motion.div>
        </motion.div>
      )}

      <Navbar bgColor="white" />

      <main className="flex-1 pb-10 min-h-screen relative z-10">
        {/* Breadcrumbs */}
        <motion.div 
          className="w-full max-w-7xl mx-auto p-4 mt-16 flex justify-start items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link href="/" className="flex items-center text-pink-500 hover:text-pink-700 transition-colors duration-300">
              <IoIosArrowBack className="text-2xl mr-2" />
            </Link>
          </motion.div>
          <nav className="text-sm text-gray-700 flex items-center">
            <Link href="/" className="text-pink-500 hover:text-pink-700 font-medium transition-colors duration-300">
              Início
            </Link>
            <span className="mx-3 text-gray-400">/</span>
            <span className="text-gray-600 font-medium">Acompanhantes</span>
          </nav>
        </motion.div>

        {/* Título */}
        <motion.div 
          className="w-full flex justify-center items-start mt-12 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="text-center px-4 max-w-4xl">
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
              style={{
                background: 'linear-gradient(135deg, #1f2937 0%, #ec4899 50%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {!city
                ? "Acompanhantes disponíveis em todo o Brasil"
                : companions.length === 0
                  ? `Acompanhantes não encontradas em ${decodeURIComponent(city)}, ${stateUF}`
                  : `Acompanhantes disponíveis em ${decodeURIComponent(city)}, ${stateUF}`}
            </motion.h1>
            <motion.p 
              className="text-gray-600 text-lg font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Encontre experiências únicas e memoráveis
            </motion.p>
          </div>
        </motion.div>

        {/* Barra de Pesquisa */}
        <motion.div 
          className="relative w-full max-w-5xl mx-auto p-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative group">
            {/* Efeito de brilho no fundo */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            
            <div 
              className="relative p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl transition-all duration-500 group-hover:shadow-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              {/* Campo de Busca - Agora com o clique para abrir o Modal */}
              <motion.div 
                className="relative flex-1 flex items-center cursor-pointer w-full group/input" 
                onClick={() => setShowModalBusca(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover/input:opacity-100 transition duration-500"></div>
                <FaSearch className="w-6 h-6 text-pink-500 mr-4 relative z-10 group-hover/input:scale-110 transition-transform duration-300" />
                <input
                  id="city"
                  type="text"
                  value={city && stateUF ? `${decodeURIComponent(city)}, ${stateUF}` : "Busque por cidade..."}
                  className="w-full bg-gray-100/80 backdrop-blur-sm rounded-2xl px-6 py-4 text-gray-800 focus:outline-none focus:ring-4 focus:ring-pink-500/30 transition-all duration-300 cursor-pointer text-lg font-medium border-2 border-transparent group-hover/input:border-pink-200/50 relative z-10"
                  readOnly
                  placeholder="Busque por cidade..."
                />
                <motion.div 
                  className="absolute right-4 text-pink-400 opacity-0 group-hover/input:opacity-100 transition-all duration-300 relative z-10"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={20} />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stories */}
        <motion.div 
          className="w-full max-w-7xl mx-auto mt-8 px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Stories />
        </motion.div>

        {/* ModalBusca */}
        {showModalBusca && (
          <ModalBusca isOpen={showModalBusca} onClose={() => setShowModalBusca(false)} />
        )}

        {/* Grid de Cartões */}
        <motion.div 
          className="mt-10 w-full max-w-7xl mx-auto px-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div 
            className="flex flex-col sm:flex-row justify-between items-center mb-8 p-6 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(249, 250, 251, 0.8) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(229, 231, 235, 0.3)',
            }}
          >
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {city && stateUF
                  ? `Resultados para ${category} em ${city}, ${stateUF}:`
                  : `Resultados para ${category} em todo o Brasil:`}
              </h2>
              <p className="text-gray-600 text-sm">
                {Array.isArray(companions) ? companions.filter(card => 
                  card.documentStatus === "APPROVED" && 
                  card.profileStatus === "ACTIVE" && 
                  card.plan
                ).length : 0} acompanhantes encontradas
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button 
                className="text-gray-700 text-sm font-medium hover:text-pink-600 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ordenar
              </motion.button>
              <motion.button
                className="px-8 py-3 font-semibold rounded-2xl shadow-lg transition-all duration-300 relative overflow-hidden group"
                onClick={() => setShowModalFiltro(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                  color: 'white',
                }}
              >
                <span className="relative z-10">Filtros</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition duration-300"></div>
              </motion.button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {Array.isArray(companions) && companions.length > 0 ? (
              companions.map((card, index) => {
                // Verifica se o status do documento e o status do perfil estão aprovados
                if (card.documentStatus !== "APPROVED" || card.profileStatus !== "ACTIVE") {
                  return null;
                }

                if (!card.plan) return null;

                let CardComponent;

                const hasDarkMode = card.subscriptions.some(subscription => subscription.extraPlan?.name === "DarkMode");

                if (card.plan?.name === "Plano Rubi" && hasDarkMode) {
                  CardComponent = CardRubiDark;
                } else if (card.plan?.name === "Plano Rubi") {
                  CardComponent = CardRubi;
                } else if (card.plan?.name === "Plano Safira" && hasDarkMode) {
                  CardComponent = CardSafiraDark;
                } else if (card.plan?.name === "Plano Safira") {
                  CardComponent = CardSafira;
                } else if (card.plan?.name === "Plano Pink" && hasDarkMode) {
                  CardComponent = CardPinkDark;
                } else if (card.plan?.name === "Plano Vip" && hasDarkMode) {
                  CardComponent = CardVIPDark;
                } else if (card.plan?.name === "Plano Vip") {
                  CardComponent = CardVIP;
                } else if (card.plan?.name === "Plano Pink") {
                  CardComponent = CardPink;
                } else {
                  CardComponent = CardVIP; // Usando o CardVIP se não tiver o plano "DarkMode"
                }

                return (
                  <motion.div 
                    key={index} 
                    className="break-inside-avoid px-2 pb-6 sm:pb-4"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Link href={`/perfil/${slugify(card.userName)}`}>
                      <CardComponent
                        userName={card.userName}
                        age={card.age}
                        location={`${card.city}, ${card.state}`}
                        description={card.description}
                        images={
                          card.profileImage
                            ? [card.profileImage]
                            : card.media?.length > 0
                              ? card.media
                              : ["/default-avatar.jpg"]
                        }
                        contact={card.contactMethods?.[0]}
                        isOnline={statusMap[card.userId] === "online"}
                        plan={card.plan}
                        planType={card.planType}
                        subscriptions={card.subscriptions}
                        isAgeHidden={card.isAgeHidden}
                        timedServiceCompanion={card.timedServiceCompanion}
                        carrouselImages={card.carrouselImages}
                        totalPosts={card.totalPosts}
                        totalReviews={card.totalReviews}
                      />
                    </Link>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                className="col-span-full text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="max-w-md mx-auto">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-6"
                  >
                    <Sparkle size={64} className="text-gray-300 mx-auto" weight="duotone" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Nenhuma acompanhante encontrada
                  </h3>
                  <p className="text-gray-500">
                    Tente ajustar seus filtros ou buscar em uma cidade diferente
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
        </motion.div>
      </main>
      <Footer />

    </div>
  );
}