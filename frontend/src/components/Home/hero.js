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
import axios from "axios";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

// Componente de Modal para Busca
const ModalBusca = ({ isOpen, onClose }) => {
    const [city, setCity] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [category, setCategory] = useState("mulher");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/companion-city?cidade=${cidadeFormatada}&estado=${estadoFormatado}`
            );

            const data = response.data;
            console.log("Dados da busca", data);

            if (data.length > 0) {
                // Redirecionar e enviar os dados diretamente na query
                const queryParams = new URLSearchParams({ results: JSON.stringify(data) }).toString();
                router.push(`/search/acompanhantes-em-${cidadeFormatada}-${estadoFormatado}?${queryParams}`);
            } else {
                alert("Nenhuma acompanhante encontrada nessa cidade.");
            }
        } catch (error) {
            console.error("Erro ao buscar acompanhantes:", error);
            alert("Erro ao buscar acompanhantes. Tente novamente.");
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
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-2xl w-11/12 sm:w-full sm:max-w-md md:max-w-lg mx-auto p-6 relative shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                    >
                        {/* Botão de Fechar */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-pink-500 text-2xl font-bold focus:outline-none"
                            onClick={onClose}
                            aria-label="Fechar Modal"
                        >
                            <X size={24} weight="bold" />
                        </button>

                        {/* Título */}
                        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 text-center">
                            Selecione sua cidade
                        </h2>

                        {/* Input de busca */}
                        <div className="relative">
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => handleCityInput(e.target.value)}
                                placeholder="Digite a cidade..."
                                className="w-full bg-gray-50 rounded-full px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                        </div>

                        {/* Botões de Categoria */}
                        <div className="flex flex-col sm:flex-row sm:justify-between mt-4 gap-2">
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
                        </div>

                        {/* Botão de Geolocalização */}
                        <button
                            onClick={handleUseGeoLocation}
                            className="flex items-center justify-center gap-2 text-sm text-gray-700 hover:text-pink-500 transition mt-4 focus:outline-none"
                        >
                            <ArrowRight size={16} />
                            Usar localização aproximada
                        </button>


                        {/* Sugestões */}
                        <div className="mt-4 max-h-48 overflow-y-auto rounded-lg shadow-inner bg-gray-50 p-2">
                            {loading ? (
                                <p className="text-center text-pink-500 animate-pulse">Carregando...</p>
                            ) : suggestions.length > 0 ? (
                                suggestions.map((cidade) => (
                                    <div
                                        key={cidade.id}
                                        onClick={() => handleCityClick(cidade)}
                                        className="py-3 cursor-pointer hover:bg-pink-100 px-4 rounded-lg flex items-center gap-3 text-gray-700"
                                    >
                                        <MapPin size={20} className="text-pink-500" />
                                        <span className="font-medium">{cidade.nome} - {cidade.microrregiao.mesorregiao.UF.sigla}</span>
                                    </div>
                                ))
                            ) : (
                                city && <p className="text-center text-gray-500">Nenhuma cidade encontrada.</p>
                            )}
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

// Componente Principal
const Hero = () => {
    const [showModalBusca, setShowModalBusca] = useState(false);

    return (
        <IconContext.Provider value={{ className: "inline-block" }}>
            <div className="relative bg-[#ebeff1] text-gray-900 py-16 md:py-24 lg:py-32">
                {/* Campo de Busca */}
                <div className="max-w-md sm:max-w-lg mx-auto relative">
                    <input
                        type="text"
                        placeholder="     Busque por cidade, exemplo: São Paulo"
                        onClick={() => setShowModalBusca(true)}
                        className="w-full py-3 md:py-4 lg:py-5 text-gray-700 bg-gray-50 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition cursor-pointer"
                        readOnly
                    />
                    <button
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-400 hover:bg-pink-500 text-white p-2 rounded-full shadow-lg transition-all hover:scale-105"
                        onClick={() => setShowModalBusca(true)}
                        aria-label="Buscar"
                    >
                        <MagnifyingGlass size={20} weight="bold" />
                    </button>
                </div>

                {/* Modal de Busca */}
                <ModalBusca isOpen={showModalBusca} onClose={() => setShowModalBusca(false)} />
            </div>
        </IconContext.Provider>
    );
};

export default Hero;
