"use client";

import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import {
    FileText,
    Camera,
    CheckCircle,
    Heartbeat,
    X,
    MagnifyingGlass,
    ArrowRight,
    MapPin,
    Sparkle,
    Star,
} from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Image from "next/image";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

// Definições de conteúdo para o Modal Informativo
const modalContent = {
    documentos: {
        title: "Documentos Verificados",
        description:
            "Todos os documentos dos nossos profissionais são rigorosamente verificados para garantir a autenticidade e segurança dos nossos usuários. Trabalhamos continuamente para manter a confiança e a integridade da nossa plataforma.",
        icon: <FileText size={32} weight="duotone" className="text-pink-500" />,
        color: "from-pink-500 to-rose-500"
    },
    midia: {
        title: "Mídia de Comparação 360°",
        description:
            "Oferecemos uma experiência imersiva com nossa mídia de comparação 360°, permitindo que você visualize todos os aspectos dos serviços oferecidos de maneira detalhada e transparente.",
        icon: <Camera size={32} weight="duotone" className="text-purple-500" />,
        color: "from-purple-500 to-indigo-500"
    },
    verificacao: {
        title: "Verificação Fácil",
        description:
            "Nossa plataforma facilita o processo de verificação, tornando-o rápido e eficiente. Com apenas alguns cliques, você pode confirmar a autenticidade dos profissionais e garantir uma experiência segura.",
        icon: <CheckCircle size={32} weight="duotone" className="text-green-500" />,
        color: "from-green-500 to-emerald-500"
    },
    cuidados: {
        title: "Cuidados da Saúde",
        description:
            "Priorizamos a saúde e o bem-estar tanto dos nossos usuários quanto dos profissionais. Implementamos rigorosos protocolos de saúde para assegurar um ambiente seguro e saudável para todos.",
        icon: <Heartbeat size={32} weight="duotone" className="text-red-500" />,
        color: "from-red-500 to-pink-500"
    },
};

// Componente de Modal para Mostrar Informações - Otimizado
const ModalInformativo = memo(({ isOpen, onClose, title, description }) => {
    const selectedContent = Object.values(modalContent).find(content => content.title === title);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 mx-4"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                {/* Header do Modal */}
                <div className="relative p-4 border-b border-gray-100">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-400 hover:text-pink-500 transition-colors"
                        aria-label="Fechar modal"
                    >
                        <X size={20} weight="bold" />
                    </button>

                    <div className="text-center pr-8">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="text-pink-500">
                                {React.cloneElement(selectedContent?.icon || <FileText size={24} />, { size: 24 })}
                            </div>
                            <h2 className="text-lg font-bold text-gray-800">
                                {title}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Conteúdo do Modal */}
                <div className="p-4">
                    <p className="text-gray-700 leading-relaxed text-sm">
                        {description}
                    </p>
                </div>
            </motion.div>
        </div>
    );
});

ModalInformativo.displayName = 'ModalInformativo';
ModalInformativo.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

// Componente de Modal para Busca - Otimizado para Mobile
const ModalBusca = memo(({ isOpen, onClose }) => {
    const [city, setCity] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const inputRef = useRef(null);

    // Controla o scroll do body ao abrir/fechar modal
    useEffect(() => {
        if (isOpen) {
            setCity("");
            setSuggestions([]);
            setLoading(false);
            document.body.style.overflow = "hidden";

            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);

            const handleEsc = (event) => {
                if (event.key === "Escape") {
                    onClose();
                }
            };
            window.addEventListener("keydown", handleEsc);
            
            return () => {
                clearTimeout(timer);
                window.removeEventListener("keydown", handleEsc);
                document.body.style.overflow = "";
            };
        } else {
            document.body.style.overflow = "";
        }
    }, [isOpen, onClose]);

    // Normaliza o texto para busca
    const normalizeText = useCallback((text) => {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }, []);

    // Buscar cidades na API do IBGE
    const fetchCities = useCallback(async (query) => {
        if (query.length >= 2) {
            setLoading(true);
            try {
                const normalizedQuery = normalizeText(query);
                
                const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios`);
                if (!response.ok) {
                    setSuggestions([]);
                    return;
                }

                const data = await response.json();
                
                const filteredCities = data.filter((cidade) =>
                    normalizeText(cidade.nome).includes(normalizedQuery)
                );

                const uniqueCities = filteredCities.reduce((acc, cidade) => {
                    const key = `${cidade.nome}-${cidade.microrregiao.mesorregiao.UF.sigla}`;
                    if (!acc.has(key)) {
                        acc.set(key, cidade);
                    }
                    return acc;
                }, new Map());

                const finalResults = Array.from(uniqueCities.values()).slice(0, 6);
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
    }, [normalizeText]);

    const handleCityInput = useCallback((value) => {
        setCity(value);
        fetchCities(value);
    }, [fetchCities]);

    const handleCityClick = useCallback(async (cidade) => {
        const cidadeSlug = cidade.nome
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

        const uf = cidade.microrregiao.mesorregiao.UF.sigla.toLowerCase();

        try {
            await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/companion?cidade=${cidade.nome}&estado=${uf.toUpperCase()}`
            );
        } catch (error) {
            console.error("Erro ao buscar acompanhantes:", error);
        }

        const destino = `/search/acompanhantes-em-${cidadeSlug}-${uf}`;
        router.push(destino);
        onClose();
    }, [router, onClose]);

    const handleUseGeoLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                () => {
                    const cityData = {
                        nome: "Sorocaba",
                        microrregiao: {
                            mesorregiao: {
                                UF: { sigla: "SP" },
                            },
                        },
                    };
                    handleCityClick(cityData);
                },
                (error) => {
                    console.error("Erro ao obter localização", error);
                }
            );
        }
    }, [handleCityClick]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                className="relative w-full max-w-sm mx-auto bg-white rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                {/* Botão de Fechar */}
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 transition-colors z-10"
                    onClick={onClose}
                    aria-label="Fechar Modal"
                >
                    <X size={24} weight="bold" />
                </button>

                {/* Título do Modal */}
                <div className="p-6 text-center border-b border-gray-100">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Sparkle size={20} className="text-pink-500" weight="duotone" />
                        <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                            Encontre sua Cidade
                        </h2>
                    </div>
                    <p className="text-gray-600 text-sm">Descubra experiências incríveis</p>
                </div>

                {/* Campo de Busca */}
                <div className="p-6">
                    <div className="relative mb-4">
                        <MagnifyingGlass
                            size={18}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            weight="bold"
                        />
                        <input
                            type="text"
                            value={city}
                            ref={inputRef}
                            onChange={(e) => handleCityInput(e.target.value)}
                            placeholder="Digite a cidade..."
                            className="w-full bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all border border-gray-200 text-sm"
                        />
                        {loading && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <ArrowRight size={16} className="text-pink-500" />
                                </motion.div>
                            </div>
                        )}
                    </div>

                    {/* Botão de Geolocalização */}
                    <button
                        onClick={handleUseGeoLocation}
                        className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-pink-500 transition-colors py-3 px-4 rounded-xl bg-gray-50 border border-gray-200 hover:bg-pink-50 mb-4"
                    >
                        <MapPin size={16} weight="duotone" />
                        Usar localização atual
                    </button>

                    {/* Sugestões de Cidades */}
                    <div className="max-h-48 overflow-y-auto">
                        {loading ? (
                            <div className="text-center py-6">
                                <div className="text-pink-500 font-medium text-sm">
                                    <Sparkle size={16} weight="duotone" className="inline mr-2" />
                                    Buscando...
                                </div>
                            </div>
                        ) : suggestions.length > 0 ? (
                            <div className="space-y-1">
                                {suggestions.map((cidade) => (
                                    <div
                                        key={cidade.id}
                                        onClick={() => handleCityClick(cidade)}
                                        className="py-3 px-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3 text-gray-700 hover:text-pink-600"
                                    >
                                        <MapPin size={16} className="text-pink-500 flex-shrink-0" weight="duotone" />
                                        <div className="flex-1 min-w-0">
                                            <span className="font-semibold text-sm">
                                                {cidade.nome}
                                            </span>
                                            <span className="text-gray-500 ml-2 text-xs">
                                                {cidade.microrregiao.mesorregiao.UF.sigla}
                                            </span>
                                        </div>
                                        <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            city && (
                                <div className="text-center py-6">
                                    <MapPin size={24} className="mx-auto mb-2 text-gray-300" />
                                    <div className="text-gray-500 font-medium text-sm">Nenhuma cidade encontrada</div>
                                    <p className="text-xs text-gray-400">Tente uma busca diferente</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
});

ModalBusca.displayName = 'ModalBusca';
ModalBusca.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

// Componente de Partículas Otimizado para Mobile
const FloatingParticles = memo(() => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // Menos partículas no mobile
        const particleCount = window.innerWidth < 768 ? 4 : 6;
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 0.2 + 0.1,
            duration: Math.random() * 15 + 10
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute w-1 h-1 bg-pink-400 rounded-full opacity-20"
                    initial={{
                        x: `${particle.x}vw`,
                        y: '100vh',
                        scale: particle.size
                    }}
                    animate={{
                        y: '-10vh',
                        x: `${(particle.x + 15) % 100}vw`
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    );
});

FloatingParticles.displayName = 'FloatingParticles';

// Componente Principal - Totalmente Responsivo
const Hero = () => {
    const [showModalBusca, setShowModalBusca] = useState(false);
    const [selectedModal, setSelectedModal] = useState(null);

    const openModal = useCallback((modalKey) => {
        setSelectedModal(modalKey);
    }, []);

    const closeModal = useCallback(() => {
        setSelectedModal(null);
    }, []);

    const openModalBusca = useCallback(() => {
        setShowModalBusca(true);
    }, []);

    const closeModalBusca = useCallback(() => {
        setShowModalBusca(false);
    }, []);

    const featuresData = [
        {
            key: "documentos",
            icon: <FileText size={20} weight="duotone" />,
            title: "Documentos Verificados",
            color: "pink"
        },
        {
            key: "midia",
            icon: <Camera size={20} weight="duotone" />,
            title: "Mídia de Comparação 360°",
            color: "purple"
        },
        {
            key: "verificacao",
            icon: <CheckCircle size={20} weight="duotone" />,
            title: "Verificação Fácil",
            color: "green"
        },
        {
            key: "cuidados",
            icon: <Heartbeat size={20} weight="duotone" />,
            title: "Cuidados da Saúde",
            color: "red"
        }
    ];

    return (
        <div className="relative min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background cor específica */}
            <div className="absolute inset-0" style={{ backgroundColor: '#EDF1F3' }}></div>

            {/* Partículas otimizadas */}
            <FloatingParticles />

            {/* Logo de fundo - menor no mobile */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 z-0">
                <Image
                    src="/Logofaixabranco.png"
                    alt="Logo Faixa Branco"
                    width={400}
                    height={400}
                    className="object-contain w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px]"
                    priority
                />
            </div>

            {/* Conteúdo Principal - Mobile First */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 text-center py-6 md:py-16">
                {/* Título Principal - Responsivo */}
                <div className="mb-6 md:mb-12">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-3 md:mb-6 leading-tight px-2">
                        <span className="bg-gradient-to-r from-gray-800 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                            A melhor plataforma<br className="hidden sm:block" />
                            <span className="sm:hidden"> </span>de{" "}
                        </span>
                        <span className="bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent relative">
                            acompanhantes do Brasil
                            <Star size={16} className="absolute -top-1 -right-1 text-yellow-400 hidden md:block md:w-5 md:h-5 lg:w-6 lg:h-6" weight="fill" />
                        </span>
                    </h1>

                    <div className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-6 md:mb-12 text-gray-700 font-medium px-4">
                        Faixa Rosa, onde a{" "}
                        <span className="text-pink-500 font-bold relative">
                            elegância
                            <Sparkle size={12} className="absolute -top-0.5 -right-0.5 text-pink-400 md:w-4 md:h-4" weight="fill" />
                        </span>{" "}
                        encontra seu momento exclusivo.
                    </div>
                </div>

                {/* Campo de Busca - Mobile Otimizado */}
                <div className="max-w-sm sm:max-w-md md:max-w-lg mx-auto mb-6 md:mb-12 px-4">
                    <div className="relative bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden">
                        <input
                            type="text"
                            placeholder="Busque por cidade, ex: São Paulo"
                            onClick={openModalBusca}
                            className="w-full py-3 md:py-4 px-4 md:px-6 text-gray-700 bg-transparent focus:outline-none cursor-pointer font-medium text-sm md:text-base"
                            readOnly
                        />
                        <button
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 md:p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                            onClick={openModalBusca}
                            aria-label="Buscar"
                        >
                            <MagnifyingGlass size={16} className="md:w-5 md:h-5 text-white" weight="bold" />
                        </button>
                    </div>
                </div>

                {/* Aviso Legal - Mobile Compacto */}
                <div className="mb-6 md:mb-16 px-4">
                    <div className="inline-block px-4 md:px-6 py-3 md:py-4 bg-green-50 border border-green-200 rounded-xl md:rounded-2xl max-w-full">
                        <div className="text-xs sm:text-sm text-gray-600 font-medium flex items-start gap-2 md:gap-3 text-left md:text-center">
                            <CheckCircle size={16} className="md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5 md:mt-0" weight="duotone" />
                            <span className="leading-relaxed">
                                A PROFISSÃO DE ACOMPANHANTE É LEGALIZADA NO BRASIL e reconhecida pelo Ministério do Trabalho desde 2002.
                            </span>
                        </div>
                    </div>
                </div>

                {/* Features Grid - Mobile Otimizado */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto px-2 pb-0 md:pb-8">
                    {featuresData.map((feature) => (
                        <motion.div
                            key={feature.key}
                            onClick={() => openModal(feature.key)}
                            className="bg-white/90 backdrop-blur-sm p-3 md:p-6 rounded-xl md:rounded-2xl border border-gray-200 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex flex-col items-center text-center h-full justify-center">
                                <div className={`text-${feature.color}-500 mb-2 md:mb-4`}>
                                    {React.cloneElement(feature.icon, { 
                                        size: 20,
                                        className: "w-5 h-5 md:w-6 md:h-6"
                                    })}
                                </div>
                                <h3 className="text-xs md:text-sm font-bold text-gray-800 leading-tight px-1">
                                    {feature.title}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modais */}
            <AnimatePresence>
                {selectedModal && (
                    <ModalInformativo
                        isOpen={!!selectedModal}
                        onClose={closeModal}
                        title={modalContent[selectedModal]?.title || ""}
                        description={modalContent[selectedModal]?.description || ""}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showModalBusca && (
                    <ModalBusca isOpen={showModalBusca} onClose={closeModalBusca} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Hero; 