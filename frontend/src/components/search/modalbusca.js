"use client";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";
import PropTypes from "prop-types";

const normalizeText = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

// Cidades padrão a serem exibidas quando o modal é aberto
const defaultCities = [
  {
    id: 3550308,
    nome: "São Paulo",
    microrregiao: {
      mesorregiao: {
        UF: {
          sigla: "SP",
        },
      },
    },
  },
  {
    id: 3304557,
    nome: "Rio de Janeiro",
    microrregiao: {
      mesorregiao: {
        UF: {
          sigla: "RJ",
        },
      },
    },
  },
  {
    id: 3106200,
    nome: "Belo Horizonte",
    microrregiao: {
      mesorregiao: {
        UF: {
          sigla: "MG",
        },
      },
    },
  },
  {
    id: 4314902,
    nome: "Porto Alegre",
    microrregiao: {
      mesorregiao: {
        UF: {
          sigla: "RS",
        },
      },
    },
  },
];

export default function ModalBusca({ showModalBusca, setShowModalBusca }) {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState(defaultCities);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("mulher");

  const handleCloseModal = () => {
    setShowModalBusca(false);
  };

  const handleUseGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Aqui você pode implementar a lógica para converter as coordenadas em uma cidade.
          // Por enquanto, está hardcoded para "Sorocaba".
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
    window.location.href = `/${formattedCity}`;
  };

  const fetchCities = async (query) => {
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
      // Se a consulta estiver vazia, redefine as sugestões para as cidades padrão
      setSuggestions(defaultCities);
    }
  };

  const handleCityInput = (value) => {
    setCity(value);
    fetchCities(value);
  };

  const handleCityClick = (cidade) => {
    formatCityURL(cidade.nome, cidade.microrregiao.mesorregiao.UF.sigla);
  };

  // Redefine as sugestões para as cidades padrão quando o modal é aberto
  useEffect(() => {
    if (showModalBusca) {
      setSuggestions(defaultCities);
      setCity("");
    }
  }, [showModalBusca]);

  if (!showModalBusca) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
      onClick={handleCloseModal}
    >
      <div
        className="bg-white rounded-2xl w-11/12 sm:w-full sm:max-w-md md:max-w-lg mx-auto p-6 relative shadow-xl transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-pink-500 text-2xl font-bold focus:outline-none"
          onClick={handleCloseModal}
          aria-label="Fechar"
        >
          &times;
        </button>
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2 justify-center">
          <FaMapMarkerAlt className="text-pink-500" />
          Selecionar Cidade e Categoria
        </h2>
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
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-5 w-5"></div>
              </div>
            )}
          </div>
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
          <button
            onClick={handleUseGeoLocation}
            className="flex items-center justify-center gap-2 text-sm text-gray-700 hover:text-pink-500 transition mt-4 focus:outline-none"
          >
            <FaLocationArrow className="w-4 h-4" /> Usar localização aproximada
          </button>
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
                  <FaMapMarkerAlt className="text-pink-500" />
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
      </div>
    </div>
  );
}

ModalBusca.propTypes = {
  showModalBusca: PropTypes.bool.isRequired,
  setShowModalBusca: PropTypes.func.isRequired,
};
