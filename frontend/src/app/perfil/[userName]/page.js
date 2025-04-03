"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from "@/components/Navbar";
import Fotos from "@/components/perfil/fotos";
import Videos from "@/components/perfil/videos";
import Sobre from "@/components/perfil/sobre";
import Servicos from "@/components/perfil/serviços";
import Localidade from "@/components/perfil/localidade";
import Valores from "@/components/perfil/valores";
import Image from 'next/image';
import Link from 'next/link';
import {
  FaDollarSign,
  FaMapMarkerAlt,
  FaRegUser,
  FaCheckCircle,
  FaShareAlt,
  FaWhatsapp,
  FaEllipsisH,
  FaTelegram,
  FaUserPlus,
  FaMale,
  FaSearch,
  FaRegCopy,
} from 'react-icons/fa';
import Final from '@/components/search/final';
import { useParams } from "next/navigation";
import axios from 'axios';
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  X,
  ArrowRight,
  MapPin,
} from "phosphor-react";
import { toast } from 'react-toastify';

// Componente de Modal para Busca
const ModalBusca = ({ isOpen, onClose }) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [category, setCategory] = useState("mulher");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);

  // Controla o scroll do body ao abrir/fechar modal
  useEffect(() => {
    if (isOpen) {
      setCity("");
      setSuggestions([]);
      setLoading(false);
      setCategory("mulher");
      document.body.style.overflow = "hidden";

      if (inputRef.current) {
        inputRef.current.focus();
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
    if (query.length >= 1) {
      setLoading(true);
      try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios`);
        if (!response.ok) {
          console.error("Erro ao buscar cidades:", response.statusText);
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
  }, []);

  const handleCityInput = (value) => {
    setCity(value);
    fetchCities(value);
  };

  // Quando o usuário seleciona uma cidade, busca acompanhantes e redireciona
  const handleCityClick = async (cidade) => {
    const cidadeFormatada = encodeURIComponent(cidade.nome);
    const estadoFormatado = encodeURIComponent(cidade.microrregiao.mesorregiao.UF.sigla.toUpperCase());

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/companion?cidade=${cidadeFormatada}&estado=${estadoFormatado}`
      );

      const data = response.data;

      if (data.length > 0) {
        // Redirecionar e enviar os dados diretamente na query
        const queryParams = new URLSearchParams({ results: JSON.stringify(data) }).toString();
        router.push(`/search/acompanhantes-em-${cidadeFormatada}-${estadoFormatado}?${queryParams}`);
      } else {
        // Redireciona para a página de busca sem resultados
        router.push(`/search?results=[]`);
      }
    } catch (error) {
      console.error("Erro ao buscar acompanhantes:", error);
    }

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
                  ref={inputRef}
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
              {/* <div className="flex flex-col sm:flex-row sm:justify-between mt-4 gap-2">
                              <button
                                  className={`flex-1 px-4 py-3 rounded-full font-semibold transition-all ${category === "mulher"
                                      ? "bg-pink-500 text-white"
                                      : "bg-gray-100 text-gray-800 hover:bg-pink-100"
                                      }`}
                                  onClick={() => setCategory("mulher")}
                              >
                                  Mulheres
                              </button>
                              <button
                                  className={`flex-1 px-4 py-3 rounded-full font-semibold transition-all ${category === "homem"
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-100 text-gray-800 hover:bg-blue-100"
                                      }`}
                                  onClick={() => setCategory("homem")}
                              >
                                  Homens
                              </button>
                              <button
                                  className={`flex-1 px-4 py-3 rounded-full font-semibold transition-all ${category === "travesti"
                                      ? "bg-purple-500 text-white"
                                      : "bg-gray-100 text-gray-800 hover:bg-purple-100"
                                      }`}
                                  onClick={() => setCategory("travesti")}
                              >
                                  Trans
                              </button>
                          </div> */}

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


export default function Perfil() {
  const { userName } = useParams();

  const [maisAcompanhantes, setMaisAcompanhantes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("fotos");
  const [status, setStatus] = useState("online"); // Status do usuário ("online", "offline")
  const [showModalBusca, setShowModalBusca] = useState(false); // Controle do modal de busca
  const [showModalNumero, setShowModalNumero] = useState(false); // Controle do modal de número
  const [companionData, setCompanionData] = useState(null); // Para armazenar os dados da acompanhante

  const [category, setCategory] = useState("mulher"); // Categoria selecionada
  // Categorias disponíveis
  const categories = [
    { label: "Mulheres", value: "mulher" },
    { label: "Homens", value: "homem" },
    { label: "Trans", value: "travesti" },
  ];
  const [city, setCity] = useState(""); // Cidade selecionada
  const [stateUF, setStateUF] = useState(""); // Estado selecionado 


  useEffect(() => {
    const fetchProfile = async () => {
      if (!userName) return;

      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/profile?userName=${userName}`
        );

        setCompanionData(response.data);
        setIsLoading(false);

        // Buscar mais acompanhantes com base na cidade e estado
        const city = response.data.city;
        const state = response.data.state;

        if (city && state) {
          const cidadeCodificada = encodeURIComponent(city);

          const moreResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/companion?cidade=${cidadeCodificada}&estado=${state}`
          );
          setMaisAcompanhantes(moreResponse.data);
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userName]);

  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(companionData.contactMethods[0].phoneNumber); // Copia o número
      setCopySuccess(true); // Atualiza o estado para exibir feedback
      toast.success("Número copiado com sucesso!")
      setTimeout(() => setCopySuccess(false), 2000); // Reseta o feedback após 2 segundos
    } catch (error) {
      console.error("Erro ao copiar número:", error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleWhatsAppClick = () => {
    const whatsappNumber = companionData.contactMethods[0]?.whatsappNumber;
    if (whatsappNumber) {
      // Formato da URL do WhatsApp
      const whatsappUrl = `https://wa.me/${whatsappNumber}`;
      window.open(whatsappUrl, "_blank"); // Abre o WhatsApp em uma nova aba
    }
  };

  const handleCall = () => {
    // Supondo que o número de telefone esteja armazenado em `companionData.phoneNumber`
    const phoneNumber = companionData?.contactMethods[0]?.phoneNumber;

    if (phoneNumber) {
      // Redireciona para o discador de telefone
      window.location.href = `tel:${phoneNumber}`;
    } else {
      alert("Número de telefone não disponível.");
    }
  };

  const handleTelegramRedirect = () => {
    // Supondo que o número do Telegram esteja armazenado em `companionData.telegramUsername`
    const telegramUsername = companionData?.contactMethods[0]?.telegramUsername;

    if (telegramUsername) {
      // Redireciona para o Telegram usando o nome de usuário
      window.open(`https://t.me/${telegramUsername}`, "_blank");
    } else {
      alert("Usuário do Telegram não disponível.");
    }
  };

  const getStatusColor = () => {
    return status === "online" ? "bg-green-500" : "bg-gray-500";
  };

  const getStatusAnimation = () => {
    return status === "online" ? "animate-pulse" : "";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Image
          src="/iconOficial_faixaRosa.png"
          alt="Ícone oficial Faixa Rosa"
          width={50}
          height={50}
          className="animate-pulse w-auto h-auto"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f7f9fc', marginTop: '80px' }}>
      <Navbar bgColor='white' />

      {/* Breadcrumbs */}
      <div className="w-full max-w-7xl mx-auto  p-4 mt-16 bg-cover flex justify-start items-center">
        <nav className="text-sm text-gray-700">
          <Link href="/" className="text-pink-500 hover:text-pink-700">Início</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-500">Acompanhantes</span>   {/* incluir o redirecionamento */}
          <span className="mx-2">/</span>
          <span className="text-gray-500">Perfil</span>
        </nav>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative w-full max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
          {/* Campo de Busca - Agora com o clique para abrir o Modal */}
          <div className="relative flex-1 flex items-center cursor-pointer" onClick={() => setShowModalBusca(true)}>
            <FaSearch className="w-5 h-5 text-gray-500 mr-2" />
            <input
              id="city"
              type="text"
              value={city && stateUF ? `${decodeURIComponent(city)}, ${stateUF}` : "Busque por cidade..."}
              className="w-full bg-gray-200 rounded-full px-6 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 transition cursor-pointer"
              readOnly
            />
          </div>
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 sm:px-6 sm:py-2 rounded-full text-sm font-medium ${category === cat.value ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-800"
                  } transition transform hover:scale-105`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ModalBusca */}
      {showModalBusca && (
        <ModalBusca isOpen={showModalBusca} onClose={() => setShowModalBusca(false)} />
      )}


      {/* Campo de busca estilizado */}
      {/* <div className="relative w-full max-w-md mb-6 mx-auto">
        <input
          type="text"
          placeholder="Buscar acompanhantes por cidade"
          onClick={() => setShowModalBusca(true)}
          className="w-full py-3 pl-4 pr-12 rounded-full bg-white border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-sm"
          readOnly
        />
        <button
          className="absolute right-4 top-2.5 bg-pink-500 p-2 rounded-full text-white transition-transform transform hover:scale-110"
          onClick={() => setShowModalBusca(true)}
        >
          <FaSearch size={16} />
        </button>
      </div> */}

      {/* Modal de busca */}
      {showModalBusca && (
        <ModalBusca
          showModalBusca={showModalBusca}
          setShowModalBusca={setShowModalBusca}
          className="text-black" // Adiciona fonte preta ao modal de busca
        />
      )}

      {/* Modal de número */}
      {showModalNumero && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black" // Fonte preta no modal de número
          onClick={(e) => {
            if (e.target.classList.contains("fixed")) {
              setShowModalNumero(false);
            }
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            {/* Botão de Fechar */}
            <button
              className="absolute top-0 right-2 mt-1 mr-1 text-4xl text-gray-500 hover:text-gray-700"
              onClick={() => setShowModalNumero(false)}
            >
              &times;
            </button>

            {/* Carrossel de fotos */}
            <div className="relative w-full h-48 mb-4 mt-4 overflow-hidden rounded-lg">
              <div className="flex transition-transform transform">
                {/* Imagens do carrossel */}
                {companionData && companionData.bannerImage && (
                  <div className="w-full h-48 bg-gray-200 flex-shrink-0 mb-4">
                    <Image
                      src={companionData.bannerImage} // Usando a URL do banner retornada da API
                      alt="Banner do perfil"
                      width={1200}
                      height={300}
                      className="object-cover w-auto h-auto"
                    />
                  </div>
                )}

                {/* {companionData.media.map((mediaItem, index) => (
                  <div key={index} className="w-full h-48 bg-gray-200 flex-shrink-0">
                    <Image
                      src={mediaItem.url} // Usando a URL da mídia retornada da API
                      alt={`Foto ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                ))} */}
              </div>

              {/* Setas para navegação */}
              <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
              >
                &lt;
              </button>
              <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
              >
                &gt;
              </button>

              {/* Bolinhas indicadoras */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {companionData.media.map((_, index) => (
                  <div key={index} className="w-2 h-2 bg-gray-400 rounded-full"></div>
                ))}
              </div>
            </div>

            {/* Imagem de perfil e nome */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative w-20 h-20 rounded-full border-4 border-pink-500 shadow-md overflow-hidden">
                {companionData && companionData.profileImage && (
                  <div className="w-full h-48 bg-gray-200 flex-shrink-0 mb-4 relative">
                    <Image
                      src={companionData.profileImage}
                      alt="Foto do perfil"
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                )}

                <FaCheckCircle className="absolute bottom-0 right-0 text-green-500 text-xl" />
              </div>
              <h2 className="text-xl text-black font-bold mt-2">{companionData.userName}</h2>
            </div>

            {/* Banner Google simulado */}
            <div className="bg-purple-200 p-2 rounded-md mb-4">
              <p className="text-center text-gray-600 font-semibold">Banner GOOGLE</p>
            </div>

            {/* Informações de telefone com ícone de copiar */}
            <div className="bg-purple-100 p-4 rounded-md mb-4 shadow-inner flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">Telefone:</p>
                <p className="text-lg text-gray-900">{companionData.phoneNumber}</p> {/* Exibindo o número */}
              </div>
              <button
                onClick={handleCopy} // Chama a função handleCopy ao clicar
                className="text-gray-700 hover:text-gray-900"
              >
                <FaRegCopy
                  className={`text-xl ${copySuccess ? "text-green-500" : ""}`} // Altera a cor do ícone após copiar
                />
              </button>
            </div>

            {/* Botões de ação */}
            <div className="flex justify-around mt-4 space-x-3">
              <button onClick={handleWhatsAppClick} className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105">
                <FaWhatsapp />
                <span>WhatsApp</span>
              </button>
              <button onClick={handleCall} className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-transform transform hover:scale-105">
                <span>Ligar</span>
              </button>
              <button onClick={handleTelegramRedirect} className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105">
                <FaTelegram />
                <span>Telegram</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seção de perfil com banner, informações e conteúdo da aba selecionada */}
      {/* Adicionando um container para centralizar no desktop */}
      <div className="flex-grow">
        <div className="container mx-auto px-4 lg:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 bg-white shadow rounded-lg overflow-hidden relative">
              {/* Banner de perfil */}
              <div className="relative h-60 bg-gray-200">
                {companionData && companionData.bannerImage ? (
                  <Image
                    src={companionData.bannerImage}
                    alt="Foto de perfil"
                    width={1200}
                    height={300}
                    className="object-cover h-60 w-[1200px]"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Sem banner</span>
                  </div>
                )}
              </div>

              {/* Foto de perfil: Usando posicionamento absoluto para sobrepor o banner */}
              <div className="absolute left-4 md:left-6 top-40 md:top-44 z-10">
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-lg overflow-hidden">
                  {companionData && companionData.profileImage ? (
                    <Image
                      src={companionData.profileImage}
                      alt="Foto do perfil"
                      fill
                      sizes="(max-width: 768px) 112px, 128px"
                      className="object-cover rounded-full"
                    />

                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Sem foto</span>
                    </div>
                  )}
                  <FaCheckCircle className="absolute bottom-0 right-0 text-green-500 text-lg" />
                </div>
              </div>


              {/* Conteúdo posicionado abaixo da foto */}
              <div className="mt-16 md:mt-20 px-4 md:px-6">
                <div className="text-center md:text-left text-gray-900 flex items-center justify-center md:justify-start space-x-2">
                  {companionData && companionData.userName ? (
                    <h2 className="text-xl md:text-2xl font-bold">{companionData.userName}</h2>
                  ) : (
                    <></>
                  )}
                  <Link href="#" className="flex items-center space-x-1">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor()} ${getStatusAnimation()}`}></span>
                    <p className={`text-sm ${status === "online" ? "text-green-500" : "text-gray-500"}`}>
                      {status === "online" ? "Online agora" : "Offline há 30 minutos"}
                    </p>
                  </Link>
                </div>

                <div className="flex flex-col space-y-1 text-gray-700 mt-2">
                  {/* <div className="flex items-center space-x-2">
                    <FaDollarSign />
                    <p>{companionData.plan ? `${companionData.plan.name} - R$${companionData.plan.price}/h` : 'Plano não disponível'}</p>
                  </div> */}
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt />
                    {companionData && companionData.city && companionData.state ? (
                      <p>Local: {companionData.city} - {companionData.state}</p>
                    ) : (
                      <p>Localização não disponível</p> // Mensagem padrão caso a localização não esteja disponível
                    )}
                  </div>


                  {companionData && !companionData.isAgeHidden && (
                    <div className="flex items-center space-x-2">
                      <FaRegUser />
                      <p>Idade: {companionData.age} anos</p>
                    </div>
                  )}


                  <div className="flex items-center space-x-2">
                    <FaMale />
                    <p>Atende:
                      {companionData?.atendimentos && companionData.atendimentos.length > 0 ? (
                        companionData.atendimentos.map((atendimento, index) => (
                          <span key={index}>
                            {atendimento === "HOMENS" && "Homens"}
                            {atendimento === "MULHERES" && "Mulheres"}
                            {atendimento === "CASAIS" && "Casais"}
                            {atendimento === "DEFICIENTES_FISICOS" && "Deficientes Físicos"}
                            {index < companionData.atendimentos.length - 1 && ", "} {/* Adiciona vírgula entre os itens */}
                          </span>
                        ))
                      ) : (
                        <span>Atendimento não especificado.</span>
                      )}
                    </p>
                  </div>

                </div>

                {/* Informações adicionais: Estatísticas Inspiradas no Instagram */}
                <div className="px-4 md:px-6 mt-4 text-gray-900">
                  <div className="flex flex-wrap justify-center md:justify-start border-t border-gray-200 pt-4">
                    {/* Cada estatística */}
                    <div className="flex flex-col items-center md:items-start mx-4 mb-4 md:mb-0">
                      <span className="text-2xl md:text-3xl font-bold text-pink-500">150</span>
                      <span className="text-sm font-semibold text-gray-700">Postagens</span>
                    </div>
                    <div className="flex flex-col items-center md:items-start mx-4 mb-4 md:mb-0">
                      <span className="text-2xl md:text-3xl font-bold text-pink-500">45</span>
                      <span className="text-sm font-semibold text-gray-700">Reviews</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botões de ação e seções adicionais */}
              <div className="mt-4 px-4 md:px-6 flex flex-wrap items-center justify-center md:justify-start space-x-2">
                {/* Botões de ação */}
                <button
                  onClick={() => setShowModalNumero(true)}
                  className="w-full md:w-auto p-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out flex items-center justify-center space-x-2 mb-2 md:mb-0"
                >
                  <FaWhatsapp className="text-lg" />
                  <span className="inline md:hidden font-semibold">Ver Contato</span>
                  <span className="hidden md:inline">Ver Contato</span>
                </button>

                {/* Outros Botões */}
                <button
                  onClick={() => setShowModalNumero(true)}
                  className="p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 mb-2 md:mb-0"
                >
                  <FaTelegram />
                </button>
                <button className="p-2 bg-pink-500 text-white rounded-full shadow-md hover:bg-pink-600 mb-2 md:mb-0">
                  <FaShareAlt />
                </button>
                <button className="p-2 bg-gray-400 text-white rounded-full shadow-md hover:bg-gray-500 mb-2 md:mb-0">
                  <FaEllipsisH />
                </button>
              </div>

              {/* Abas de navegação ajustadas para mobile */}
              <div className="mt-6 px-4 md:px-6 border-b border-gray-300">
                <div className="flex flex-wrap space-x-4 text-gray-900 font-semibold justify-center md:justify-start">
                  {['fotos', 'videos', 'sobre', 'localidade', 'serviços', 'valores'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => handleTabClick(tab)}
                      className={`pb-2 capitalize ${activeTab === tab
                        ? "text-pink-500 border-b-2 border-pink-500"
                        : "hover:text-pink-500"
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conteúdo da aba selecionada */}
              <div className="mt-4 px-4 md:px-6">
                {companionData && companionData.userName && activeTab === "fotos" && (
                  <Fotos userName={companionData.userName} />
                )}

                {activeTab === "videos" && <Videos />}
                {activeTab === "sobre" && <Sobre physicalCharacteristics={companionData.PhysicalCharacteristics} description={companionData.description} media={companionData.media} />}
                {activeTab === "localidade" && <Localidade lugares={companionData.lugares} city={companionData.city} state={companionData.state} />}
                {activeTab === "serviços" && <Servicos servicesOffered={companionData.servicesOffered} weeklySchedules={companionData.weeklySchedules} />}
                {activeTab === "valores" && <Valores timedService={companionData.timedServiceCompanion} paymentMethods={companionData.paymentMethods} />}
              </div>
            </div>

            {/* Seção lateral com outros perfis e promoções */}
            <div className="lg:col-span-1 space-y-4 mt-6">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-4 text-black">Mais acompanhantes</h3>
                <div className="space-y-4 text-black">
                  {maisAcompanhantes
                    .filter((acompanhante) => acompanhante.userName !== userName) // Filtra o perfil atual
                    .map((acompanhante, index) => (
                      <div key={index} className="flex items-center">
                        {acompanhante.profileImage ? (
                          <Image
                            src={acompanhante.profileImage}
                            alt={`Acompanhante ${acompanhante.userName}`}
                            width={40}
                            height={40}
                            className="rounded-full w-10 h-10 object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                            {acompanhante.userName ? acompanhante.userName.charAt(0).toUpperCase() : ""}
                          </div>
                        )}
                        <div className="ml-4">
                          <p className="font-semibold">{acompanhante.userName}</p>
                          <p className="text-gray-600 text-sm">
                            {acompanhante.atendimentos && Array.isArray(acompanhante.atendimentos)
                              ? acompanhante.atendimentos.map((item, index) => (
                                <span key={index}>
                                  {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
                                  {index < acompanhante.atendimentos.length - 1 && ", "}
                                </span>
                              ))
                              : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <Image
                  src="/assets/banner-publi.jpg"
                  alt="Banner promocional"
                  width={300}
                  height={250}
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Responsivo */}
      <Final />
    </div>
  );
}
