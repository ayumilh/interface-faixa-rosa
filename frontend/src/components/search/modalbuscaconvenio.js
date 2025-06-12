// components/search/ModalBusca.js

"use client";
import { useState } from "react";
import { FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";
import PropTypes from "prop-types"; // Para validação de props

// Função para remover acentos e normalizar texto
const normalizeText = (text) => {
  return text
    .normalize("NFD") // Normaliza o texto para decompor acentos
    .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
    .toLowerCase(); // Converte para minúsculas
};

export default function ModalBusca({ showModalBusca, setShowModalBusca, onSelectCity }) {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]); // Armazena as sugestões de cidades
  const [loading, setLoading] = useState(false); // Estado de carregamento

  // Fechar modal ao clicar fora dele
  const handleCloseModal = () => {
    setShowModalBusca(false);
  };

  // Usar geolocalização
  const handleUseGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position.coords.latitude, position.coords.longitude);
          // Aqui você pode usar as coordenadas para obter a cidade através de uma API
          const cityData = {
            nome: "Lins",
            microrregiao: {
              mesorregiao: {
                UF: {
                  sigla: "SP",
                },
              },
            },
          };
          onSelectCity(cityData.nome, cityData.microrregiao.mesorregiao.UF.sigla);
          setShowModalBusca(false);
        },
        (error) => {
          console.error("Erro ao obter localização", error);
        }
      );
    } else {
      console.error("Navegador não suporta geolocalização");
    }
  };

  // Função para buscar cidades a partir da API do IBGE
  const fetchCities = async (query) => {
    if (query.length >= 3) {
      setLoading(true);
      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/municipios`
        );
        const data = await response.json();
        const normalizedQuery = normalizeText(query); // Normaliza a entrada do usuário

        const filteredCities = data.filter((cidade) =>
          normalizeText(cidade.nome).includes(normalizedQuery) // Normaliza o nome da cidade antes de comparar
        );
        setSuggestions(filteredCities);
      } catch (error) {
        console.error("Erro ao buscar cidades", error);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]); // Limpa as sugestões se menos de 3 caracteres
    }
  };

  // Manipula a entrada de texto para buscar cidades
  const handleCityInput = (value) => {
    setCity(value);
    fetchCities(value); // Chama a função de busca ao digitar
  };

  // Chamar a função de callback com a cidade selecionada
  const handleCityClick = (cidade) => {
    onSelectCity(cidade.nome, cidade.microrregiao.mesorregiao.UF.sigla);
    setShowModalBusca(false); // Fecha o modal após o clique
  };

  if (!showModalBusca) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
      onClick={handleCloseModal}
    >
      <div
        className="bg-white rounded-lg w-full max-w-lg mx-auto p-6 relative shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105"
        onClick={(e) => e.stopPropagation()} // Evitar que o modal feche ao clicar nele
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <FaMapMarkerAlt className="text-pink-500" />
          Selecionar Cidade
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center border-b-2 pb-2 border-gray-300">
            <input
              type="text"
              value={city}
              onChange={(e) => handleCityInput(e.target.value)}
              placeholder="Digite 3 ou mais caracteres"
              className="w-full bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            />
          </div>
          <button
            onClick={handleUseGeoLocation}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-pink-500 transition"
          >
            <FaLocationArrow className="w-4 h-4" /> Usar localização aproximada
          </button>
          <div className="text-gray-700 mt-2 max-h-40 overflow-y-auto rounded-lg shadow-inner bg-gray-50 p-2">
            {/* Limita a altura e adiciona scroll */}
            {loading ? (
              <p className="text-center text-pink-500 animate-pulse">
                Carregando...
              </p>
            ) : (
              suggestions.map((cidade) => (
                <div
                  key={cidade.id}
                  onClick={() => handleCityClick(cidade)}
                  className="py-2 cursor-pointer hover:bg-pink-100 px-3 rounded-lg transition-all duration-200 ease-in-out flex items-center gap-2"
                >
                  <FaMapMarkerAlt className="text-pink-500" />
                  {cidade.nome} - {cidade.microrregiao.mesorregiao.UF.sigla}
                </div>
              ))
            )}
          </div>
        </div>
        <button
          className="absolute top-3 right-3 text-gray-700 hover:text-pink-500 text-2xl font-bold"
          onClick={handleCloseModal}
        >
          &times;
        </button>
      </div>
    </div>
  );
}

ModalBusca.propTypes = {
  showModalBusca: PropTypes.bool.isRequired,
  setShowModalBusca: PropTypes.func.isRequired,
  onSelectCity: PropTypes.func.isRequired,
};
