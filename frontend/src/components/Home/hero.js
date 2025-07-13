"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import {
    FileText,
    Camera,
    CheckCircle,
    Heartbeat,
    X,
    ArrowRight,
    Sparkle,
    Star,
    Shield,
    Crown,
    Heart,
    MapPin
} from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import PropTypes from "prop-types";

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

// Componente de Modal Informativo
const ModalInformativo = memo(({ isOpen, onClose, title, description }) => {
    const selectedContent = Object.values(modalContent).find(content => content.title === title);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                {/* Header com Gradiente */}
                <div className={`relative p-6 bg-gradient-to-br ${selectedContent?.color} text-white`}>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20"
                        aria-label="Fechar modal"
                    >
                        <X size={20} weight="bold" />
                    </button>

                    <div className="text-center pr-8">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                                {React.cloneElement(selectedContent?.icon || <FileText size={24} />, { 
                                    size: 28, 
                                    className: "text-white" 
                                })}
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            {title}
                        </h2>
                    </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                    <p className="text-gray-700 leading-relaxed text-base">
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

// Partículas Animadas
const FloatingParticles = memo(() => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const particleCount = window.innerWidth < 768 ? 6 : 12;
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 0.3 + 0.2,
            duration: Math.random() * 20 + 15,
            delay: Math.random() * 10
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-gradient-to-r from-pink-400 to-purple-400 opacity-20"
                    style={{
                        width: `${particle.size * 8}px`,
                        height: `${particle.size * 8}px`,
                    }}
                    initial={{
                        x: `${particle.x}vw`,
                        y: '110vh',
                        scale: 0
                    }}
                    animate={{
                        y: '-10vh',
                        x: `${(particle.x + 20) % 100}vw`,
                        scale: [0, 1, 1, 0]
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: particle.delay
                    }}
                />
            ))}
        </div>
    );
});

FloatingParticles.displayName = 'FloatingParticles';

// Componente Principal
const Hero = () => {
    const [selectedModal, setSelectedModal] = useState(null);

    const openModal = useCallback((modalKey) => {
        setSelectedModal(modalKey);
    }, []);

    const closeModal = useCallback(() => {
        setSelectedModal(null);
    }, []);

    const featuresData = [
        {
            key: "documentos",
            icon: <Shield size={24} weight="duotone" />,
            title: "Documentos Verificados",
            description: "Segurança e autenticidade garantidas",
            color: "pink",
            gradient: "from-pink-500 to-rose-500"
        },
        {
            key: "midia",
            icon: <Camera size={24} weight="duotone" />,
            title: "Mídia 360°",
            description: "Experiência visual imersiva",
            color: "purple",
            gradient: "from-purple-500 to-indigo-500"
        },
        {
            key: "verificacao",
            icon: <CheckCircle size={24} weight="duotone" />,
            title: "Verificação Fácil",
            description: "Processo rápido e eficiente",
            color: "green",
            gradient: "from-green-500 to-emerald-500"
        },
        {
            key: "cuidados",
            icon: <Heart size={24} weight="duotone" />,
            title: "Cuidados da Saúde",
            description: "Bem-estar e segurança prioritários",
            color: "red",
            gradient: "from-red-500 to-pink-500"
        }
    ];

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
            {/* Background Gradiente Sutil */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50/30 via-white to-purple-50/30"></div>
            
            {/* Elementos Decorativos */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-200/20 to-indigo-200/20 rounded-full blur-3xl"></div>
            
            {/* Partículas */}
            <FloatingParticles />

            {/* Conteúdo Principal */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center py-8 md:py-16">
                
                {/* Badge Superior */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full border border-pink-200/50 backdrop-blur-sm mb-8"
                >
                    <Crown size={16} className="text-pink-600" weight="duotone" />
                    <span className="text-sm font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        Plataforma Premium
                    </span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </motion.div>

                {/* Título Principal */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-8 md:mb-12"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-gray-900 via-pink-600 to-purple-600 bg-clip-text text-transparent block">
                            A melhor plataforma
                        </span>
                        <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent relative">
                            de acompanhantes do Interior de SP
                            <Star size={20} className="absolute -top-2 -right-2 text-yellow-400 md:w-8 md:h-8 animate-pulse" weight="fill" />
                        </span>
                    </h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-12 text-gray-700 font-medium"
                    >
                        Faixa Rosa, onde a{" "}
                        <span className="relative inline-block">
                            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent font-bold">
                                elegância
                            </span>
                            <Sparkle size={16} className="absolute -top-1 -right-1 text-pink-500 animate-bounce" weight="fill" />
                        </span>{" "}
                        encontra seu momento exclusivo.
                    </motion.div>

                    {/* CTA Section entre elegância e aviso legal */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="mb-16 md:mb-20"
                    >
                        <div className="relative max-w-4xl mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-3xl blur-2xl"></div>
                            <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 md:p-12 shadow-2xl">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="text-center md:text-left">
                                        <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-pink-600 bg-clip-text text-transparent mb-3">
                                            Pronto para começar?
                                        </h3>
                                        <p className="text-gray-600 text-lg">
                                            Descubra experiências únicas na sua cidade
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-3 group cursor-pointer">
                                            <Crown size={20} weight="bold" />
                                            Explorar Agora
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                        <div className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-colors cursor-pointer flex items-center gap-3">
                                            <Crown size={20} weight="duotone" />
                                            Deseja Anunciar?
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Features Grid Premium */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto"
                >
                    {featuresData.map((feature, index) => (
                        <motion.div
                            key={feature.key}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                            onClick={() => openModal(feature.key)}
                            className="group relative cursor-pointer"
                            whileHover={{ y: -10 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {/* Efeito de brilho */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                            
                            <div className="relative bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-gray-300/50 h-full">
                                {/* Ícone */}
                                <div className={`inline-flex p-4 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {React.cloneElement(feature.icon, { 
                                        className: "text-white",
                                        size: 24
                                    })}
                                </div>
                                
                                {/* Conteúdo */}
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Indicador de ação */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <ArrowRight size={16} className="text-gray-400" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Modal */}
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
        </div>
    );
};

export default Hero;