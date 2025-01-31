"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Camera,
  CheckCircle,
  Heartbeat,
  X,
  MagnifyingGlass,
  ArrowRight,
  MapPin,
  IconContext,
} from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

// Definições de conteúdo para o Modal Informativo
const modalContent = {
  documentos: {
    title: "Documentos Verificados",
    description:
      "Todos os documentos dos nossos profissionais são rigorosamente verificados para garantir a autenticidade e segurança dos nossos usuários. Trabalhamos continuamente para manter a confiança e a integridade da nossa plataforma.",
  },
  midia: {
    title: "Mídia de Comparação 360°",
    description:
      "Oferecemos uma experiência imersiva com nossa mídia de comparação 360°, permitindo que você visualize todos os aspectos dos serviços oferecidos de maneira detalhada e transparente.",
  },
  verificacao: {
    title: "Verificação Fácil",
    description:
      "Nossa plataforma facilita o processo de verificação, tornando-o rápido e eficiente. Com apenas alguns cliques, você pode confirmar a autenticidade dos profissionais e garantir uma experiência segura.",
  },
  cuidados: {
    title: "Cuidados da Saúde",
    description:
      "Priorizamos a saúde e o bem-estar tanto dos nossos usuários quanto dos profissionais. Implementamos rigorosos protocolos de saúde para assegurar um ambiente seguro e saudável para todos.",
  },
};

// Componente de Modal para Mostrar Informações
const ModalInformativo = ({ isOpen, onClose, title, description }) => {
  // Evita o scroll da página quando o modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Adiciona listener para fechar com Esc
      const handleEsc = (event) => {
        if (event.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        window.removeEventListener("keydown", handleEsc);
      };
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-br from-pink-500 via-purple-500 to-pink-400 text-white rounded-xl shadow-lg max-w-lg w-full relative p-6"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Botão de Fechar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              aria-label="Fechar Modal"
            >
              <X size={24} />
            </button>

            {/* Conteúdo do Modal */}
            <div className="mt-4">
              <h2 className="text-2xl font-bold mb-4">{title}</h2>
              <p className="text-lg">{description}</p>
            </div>

            {/* Botão de Fechar */}
            <div className="mt-6 text-right">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white text-pink-500 rounded-full hover:bg-gray-200 transition-colors"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ModalInformativo.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

// Componente de Modal para Busca
const ModalBusca = ({ isOpen, onClose }) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("mulher");

  // Controla o scroll do body ao abrir/fechar modal
  useEffect(() => {
    if (isOpen) {
      setCity("");
      setSuggestions([]);
      setCategory("mulher");
      document.body.style.overflow = "hidden";
      // Adiciona listener para fechar com Esc
      const handleEsc = (event) => {
        if (event.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        window.removeEventListener("keydown", handleEsc);
      };
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const normalizeText = (text) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // Buscar cidades na API do IBGE
  const fetchCities = useCallback(
    async (query) => {
      if (query.length >= 1) {
        setLoading(true);
        try {
          const response = await fetch(
            `https://servicodados.ibge.gov.br/api/v1/localidades/municipios`
          );
          if (!response.ok) {
            throw new Error("Falha na resposta da API");
          }
          const data = await response.json();
          const normalizedQuery = normalizeText(query);

          const filteredCities = data.filter((cidade) =>
            normalizeText(cidade.nome).includes(normalizedQuery)
          );
          setSuggestions(filteredCities);
        } catch (error) {
          console.error("Erro ao buscar cidades", error);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    },
    [normalizeText]
  );

  const handleCityInput = (value) => {
    setCity(value);
    fetchCities(value);
  };

  const handleCityClick = (cidade) => {
    formatCityURL(cidade.nome, cidade.microrregiao.mesorregiao.UF.sigla);
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
        },
        (error) => {
          console.error("Erro ao obter localização", error);
        }
      );
    } else {
      console.error("Navegador não suporta geolocalização");
    }
  };

  // Constrói a URL baseando-se na categoria e na cidade/estado
  const formatCityURL = (cityName, state) => {
    let basePath = "";
    switch (category) {
      case "mulher":
        basePath = "acompanhantes-em";
        break;
      case "homem":
        basePath = "garotos-de-programa-em";
        break;
      case "travesti":
        basePath = "travestis-transex-transgenero-em";
        break;
      default:
        basePath = "acompanhantes-em"; // Valor padrão
    }
    const formattedCity = `${basePath}-${cityName}-${state}`
      .replace(/ /g, "-")
      .toLowerCase();
    // Redireciona para a URL resultante
    window.location.href = `/${formattedCity}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-60"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl w-11/12 sm:w-full sm:max-w-md md:max-w-lg mx-auto p-6 relative shadow-xl transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Botão de Fechar */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-pink-500 text-2xl font-bold focus:outline-none"
              onClick={onClose}
              aria-label="Fechar Modal"
            >
              <X size={24} weight="bold" />
            </button>

            {/* Título do Modal */}
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2 justify-center">
              Selecionar Cidade e Categoria
            </h2>

            {/* Campo de Busca */}
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => handleCityInput(e.target.value)}
                  placeholder="Digite a cidade"
                  className="w-full bg-gray-50 rounded-full px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                />
                {loading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <ArrowRight size={20} className="animate-spin text-pink-500" />
                  </div>
                )}
              </div>

              {/* Botões de Categoria */}
              <div className="flex flex-col sm:flex-row sm:justify-between mt-4 gap-2">
                <button
                  className={`flex-1 px-4 py-3 rounded-full font-semibold transition-all ${
                    category === "mulher"
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-pink-100"
                  }`}
                  onClick={() => setCategory("mulher")}
                >
                  Mulheres
                </button>
                <button
                  className={`flex-1 px-4 py-3 rounded-full font-semibold transition-all ${
                    category === "homem"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-blue-100"
                  }`}
                  onClick={() => setCategory("homem")}
                >
                  Homens
                </button>
                <button
                  className={`flex-1 px-4 py-3 rounded-full font-semibold transition-all ${
                    category === "travesti"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-purple-100"
                  }`}
                  onClick={() => setCategory("travesti")}
                >
                  Trans
                </button>
              </div>

              {/* Botão de Geolocalização */}
              <button
                onClick={handleUseGeoLocation}
                className="flex items-center justify-center gap-2 text-sm text-gray-700 hover:text-pink-500 transition mt-4 focus:outline-none"
              >
                <ArrowRight size={16} />
                Usar localização aproximada
              </button>

              {/* Sugestões de Cidades */}
              <div className="mt-2 max-h-48 overflow-y-auto rounded-lg shadow-inner bg-gray-50 p-2">
                {loading ? (
                  <p className="text-center text-pink-500 animate-pulse">
                    Carregando...
                  </p>
                ) : suggestions.length > 0 ? (
                  suggestions.map((cidade) => (
                    <div
                      key={cidade.id}
                      onClick={() => handleCityClick(cidade)}
                      className="py-3 cursor-pointer hover:bg-pink-100 px-4 rounded-lg transition-all duration-200 ease-in-out flex items-center gap-3 text-gray-700"
                    >
                      <MapPin size={20} className="text-pink-500" />
                      <span className="font-medium">
                        {cidade.nome} - {cidade.microrregiao.mesorregiao.UF.sigla}
                      </span>
                    </div>
                  ))
                ) : (
                  city && (
                    <p className="text-center text-gray-500">
                      Nenhuma cidade encontrada.
                    </p>
                  )
                )}
              </div>
            </div>
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

// Componente "Hero" que reúne tudo
const Hero = () => {
  const [selectedModal, setSelectedModal] = useState(null);
  const [showModalBusca, setShowModalBusca] = useState(false);

  const openModal = (modalKey) => {
    setSelectedModal(modalKey);
  };

  const closeModal = () => {
    setSelectedModal(null);
  };

  const openModalBusca = () => {
    setShowModalBusca(true);
  };

  const closeModalBusca = () => {
    setShowModalBusca(false);
  };

  return (
    <IconContext.Provider value={{ className: "inline-block" }}>
      <div className="relative bg-[#ebeff1] text-gray-900 py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Imagem de Fundo Gigante com Baixa Opacidade */}
        <Image
  src="/Logofaixabranco.png"
  alt="Logo Faixa Branco"
  width={500} // Defina um tamanho adequado
  height={500}
  className="absolute inset-0 w-full h-full object-cover opacity-80 z-0 rounded-lg shadow-[0_0_10px_#ff1493] animate-[pulseGlow_2s_infinite]"
/>



        {/* Fundo com Gradientes Suaves */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-10 left-10 w-24 h-24 md:w-32 md:h-32 bg-pink-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 md:w-40 md:h-40 bg-purple-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-gradient-to-br from-pink-300 via-purple-200 to-pink-300 rounded-full blur-[100px] opacity-30"></div>
        </div>

        {/* Conteúdo Principal */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Você pode remover ou ajustar a imagem central se necessário */}
          {/* <img
            src="/Logofaixabranco.png"
            alt="Logo Faixa Branco"
            className="mx-auto mb-8 w-48 sm:w-64 md:w-80"
          /> */}

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight tracking-wide font-[Poppins] mt-8">
            A melhor plataforma de <br />
            <span className="text-pink-500 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent drop-shadow-md">
              acompanhantes do Brasil
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-xl mx-auto mb-10 font-[Roboto] text-gray-700">
            Faixa Rosa, onde a <span className="text-pink-500">elegância</span> encontra seu momento exclusivo.
          </p>

          {/* Campo de Busca */}
          <div className="max-w-md sm:max-w-lg mx-auto relative">
            <input
              type="text"
              placeholder="     Busque por cidade, exemplo: São Paulo"
              onClick={openModalBusca}
              className="w-full py-3 md:py-4 lg:py-5 text-gray-700 bg-gray-50 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition duration-300 cursor-pointer font-[Roboto]"
              readOnly
            />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-400 hover:bg-pink-500 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
              onClick={openModalBusca}
              aria-label="Buscar"
            >
              <MagnifyingGlass size={20} weight="bold" />
            </button>
          </div>

          <p className="text-xs sm:text-sm md:text-base text-gray-500 mt-6 max-w-lg mx-auto font-[Roboto]">
            A PROFISSÃO DE ACOMPANHANTE É LEGALIZADA NO BRASIL e reconhecida pelo Ministério do Trabalho desde 2002.
          </p>

          {/* Ícones com Modal Informativo */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 max-w-4xl mx-auto">
            <div
              onClick={() => openModal("documentos")}
              className="flex flex-col items-center text-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-md bg-gray-50 p-4 rounded-lg group"
            >
              <FileText
                size={48}
                weight="duotone"
                className="text-pink-400 mb-2 transition-all duration-300 group-hover:text-pink-500"
              />
              <span className="text-sm md:text-base font-medium">Documentos Verificados</span>
            </div>

            <div
              onClick={() => openModal("midia")}
              className="flex flex-col items-center text-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-md bg-gray-50 p-4 rounded-lg group"
            >
              <Camera
                size={48}
                weight="duotone"
                className="text-pink-400 mb-2 transition-all duration-300 group-hover:text-pink-500"
              />
              <span className="text-sm md:text-base font-medium">Mídia de Comparação 360°</span>
            </div>

            <div
              onClick={() => openModal("verificacao")}
              className="flex flex-col items-center text-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-md bg-gray-50 p-4 rounded-lg group"
            >
              <CheckCircle
                size={48}
                weight="duotone"
                className="text-pink-400 mb-2 transition-all duration-300 group-hover:text-pink-500"
              />
              <span className="text-sm md:text-base font-medium">Verificação Fácil</span>
            </div>

            <div
              onClick={() => openModal("cuidados")}
              className="flex flex-col items-center text-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-md bg-gray-50 p-4 rounded-lg group"
            >
              <Heartbeat
                size={48}
                weight="duotone"
                className="text-pink-400 mb-2 transition-all duration-300 group-hover:text-pink-500"
              />
              <span className="text-sm md:text-base font-medium">Cuidados da Saúde</span>
            </div>
          </div>
        </div>

        {/* Modal Informativo */}
        <ModalInformativo
          isOpen={!!selectedModal}
          onClose={closeModal}
          title={modalContent[selectedModal]?.title || ""}
          description={modalContent[selectedModal]?.description || ""}
        />

        {/* Modal de Busca */}
        <ModalBusca isOpen={showModalBusca} onClose={closeModalBusca} />
      </div>
    </IconContext.Provider>
  );
};

export default Hero;
