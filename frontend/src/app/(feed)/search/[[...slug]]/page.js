"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { usePlan } from "@/context/PlanContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
import axios from "axios";

// Componentes necessários
import PropTypes from "prop-types";
import Navbar from "@/components/Navbar";
import ModalFiltro from "@/components/search/modalfiltro";
import Stories from "@/components/search/stories";
import Final from "@/components/search/final";
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

export default function Search() {
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  let slugString = "";
  if (params.slug) {
    slugString = Array.isArray(params.slug) ? params.slug.join("/") : params.slug;
  }

  const [loadingSearch, setLoadingSearch] = useState(true);
  const [city, setCity] = useState("");
  const [stateUF, setStateUF] = useState("");
  const [category, setCategory] = useState("mulher");
  const [showModalBusca, setShowModalBusca] = useState(false);
  const [showModalFiltro, setShowModalFiltro] = useState(false);
  const [cards, setCards] = useState([]);

  const { companions, fetchCompanions, loading } = usePlan();

  // Categorias disponíveis
  const categories = [
    { label: "Mulheres", value: "mulher" },
    { label: "Homens", value: "homem" },
    { label: "Trans", value: "travesti" },
  ];

  // Capturar parâmetros da URL
  useEffect(() => {
    const regex = /(.*?)\-em\-(.*?)-(\w{2})$/;
    if (slugString) {
      const match = slugString.match(regex);
      if (match) {
        const base = match[1];
        const citySlug = match[2];
        const uf = match[3];
        const cityName = decodeURIComponent(citySlug).replace(/-/g, " ");
        setCity(cityName);
        setStateUF(uf.toUpperCase());
        if (base === "acompanhantes") {
          setCategory("mulher");
        } else if (base === "garotos-de-programa") {
          setCategory("homem");
        } else if (base === "travestis-transex-transgenero") {
          setCategory("travesti");
        }
      } else {
        console.error("Formato do slug inválido:", slugString);
      }
    }
  }, [slugString]);

  // Capturar os dados de acompanhantes da API via query string
  // useEffect(() => {
  //   const resultsParam = searchParams.get("results");
  //   if (resultsParam) {
  //     try {
  //       const results = JSON.parse(resultsParam);
  //       console.log("Resultados da API:", results);
  //       setCards(results);
  //     } catch (error) {
  //       console.error("Erro ao processar os resultados da API:", error);
  //     } finally {
  //       setLoadingSearch(false);
  //     }
  //   }
  // }, [searchParams]);

  useEffect(() => {
    if (city && stateUF) {
      fetchCompanions({ cidade: city, estado: stateUF });
    }
  }, [city, stateUF, fetchCompanions]);

  useEffect(() => {
    console.log("Dados do context (companions):", companions);
  }, [companions]);

  return (
    <div className="bg-gray-100 text-gray-800">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center z-50">
          <Image
            src="/iconOficial_faixaRosa.png"
            alt="Ícone oficial Faixa Rosa"
            width={50}
            height={50}
            className="animate-pulse w-auto h-auto"
          />
        </div>
      )}

      <Navbar bgColor="white" />

      {/* Breadcrumbs */}
      <div className="w-full max-w-7xl mx-auto p-4 mt-16 bg-cover flex justify-start items-center">
        <nav className="text-sm text-gray-700">
          <Link href="/" className="text-pink-500 hover:text-pink-700">Início</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-500">Acompanhantes</span>
        </nav>
      </div>

      {/* Título */}
      <div className="w-full h-min bg-cover bg-center flex justify-center items-start mt-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black text-center px-4">
          {cards.length === 0 ? "Acompanhantes não encontradas" : `Acompanhantes disponíveis em ${decodeURIComponent(city)}, ${stateUF}`}
        </h1>
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


      {/* Grid de Cartões */}
      <div className="mt-6 w-full max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800 text-center sm:text-left">
            Resultados para {category} em {city && stateUF ? `${city}, ${stateUF}` : "sua cidade"}:
          </h2>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <button className="text-gray-700 text-sm">Ordenar</button>
            <button
              className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-full shadow-lg hover:bg-pink-600 transition-transform transform hover:scale-105"
              onClick={() => setShowModalFiltro(true)}
            >
              Filtros
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companions.length === 0 ? (
            <p className="text-center text-gray-500">Nenhuma acompanhante encontrada.</p>
          ) : (
            companions.map((card, index) => {
              // Verifica se o status do documento e o status do perfil estão aprovados
              if (card.documentStatus !== "APPROVED") {
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
                CardComponent = "CardVIP"; // Usando o CardVIP se não tiver o plano "DarkMode"
              }

              return (
                <Link href={`/perfil/${card.userName}`} key={index} className="h-auto">
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
                    contact={true}
                    plan={card.plan}
                    planType={card.planType}
                    subscriptions={card.subscriptions}
                    isAgeHidden={card.isAgeHidden}
                  />
                </Link>
              );
            })
          )}
        </div>
      </div>

      <Final />
    </div>
  );
}
