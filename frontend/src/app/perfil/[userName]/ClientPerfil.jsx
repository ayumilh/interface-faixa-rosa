"use client";
import { useState, useEffect, useRef, useCallback, memo, useMemo, lazy, Suspense } from 'react';
import { useParams, useRouter } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-toastify';
import {
  FaMapMarkerAlt,
  FaRegUser,
  FaCheckCircle,
  FaShareAlt,
  FaWhatsapp,
  FaTelegram,
  FaMale,
  FaSearch,
  FaTimes,
  FaImages,
  FaSpinner
} from 'react-icons/fa';
import { IoIosArrowBack } from "react-icons/io";
import { X, ArrowRight, MapPin } from "phosphor-react";

// Lazy loading de componentes pesados
const Navbar = lazy(() => import("@/components/Navbar"));
const Footer = lazy(() => import('@/components/search/footer'));
const Stories = lazy(() => import("@/components/search/stories"));
const Fotos = lazy(() => import("@/components/perfil/fotos"));
const Videos = lazy(() => import("@/components/perfil/videos"));
const Sobre = lazy(() => import("@/components/perfil/sobre"));
const Servicos = lazy(() => import("@/components/perfil/serviços"));
const Localidade = lazy(() => import("@/components/perfil/localidade"));
const Valores = lazy(() => import("@/components/perfil/valores"));

// Loading component otimizado
const LoadingSpinner = memo(() => (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
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
      <p className="text-gray-600 font-medium text-sm sm:text-base">Carregando perfil...</p>
    </motion.div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Loading skeleton para mais acompanhantes
const MoreCompanionsLoading = memo(() => (
  <div className="space-y-4">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="flex items-center p-3 rounded-xl">
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="ml-3 flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
));

MoreCompanionsLoading.displayName = 'MoreCompanionsLoading';

// Modal de busca otimizado
const ModalBusca = memo(({ isOpen, onClose }) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);

  const debouncedSearch = useCallback((query) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios`);
          const data = await response.json();

          const filtered = data
            .filter(cidade => cidade.nome.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 8);

          setSuggestions(filtered);
        } catch (error) {
          console.error("Erro ao buscar cidades", error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);
  }, []);

  const handleCityInput = useCallback((value) => {
    setCity(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  const handleCityClick = useCallback((cidade) => {
    const cidadeFormatada = encodeURIComponent(cidade.nome);
    const estadoFormatado = encodeURIComponent(cidade.microrregiao.mesorregiao.UF.sigla.toUpperCase());
    router.push(`/search/acompanhantes-em-${cidadeFormatada}-${estadoFormatado}`);
    onClose();
  }, [router, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl w-full max-w-md mx-auto p-6 relative shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-pink-500 transition-colors"
          onClick={onClose}
          aria-label="Fechar Modal"
        >
          <X size={24} weight="bold" />
        </button>

        <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">
          Selecionar Cidade
        </h2>

        <div className="relative mb-4">
          <input
            type="text"
            value={city}
            ref={inputRef}
            onChange={(e) => handleCityInput(e.target.value)}
            placeholder="Digite a cidade"
            className="w-full bg-gray-50 rounded-xl px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full"
              />
            </div>
          )}
        </div>

        <div className="max-h-48 overflow-y-auto rounded-lg bg-gray-50 p-2">
          {suggestions.length > 0 ? (
            suggestions.map((cidade) => (
              <div
                key={cidade.id}
                onClick={() => handleCityClick(cidade)}
                className="py-3 cursor-pointer hover:bg-pink-100 px-4 rounded-lg transition-all flex items-center gap-3 text-gray-700"
              >
                <MapPin size={16} className="text-pink-500" />
                <span className="font-medium">
                  {cidade.nome} - {cidade.microrregiao.mesorregiao.UF.sigla}
                </span>
              </div>
            ))
          ) : city && !loading ? (
            <p className="text-center text-gray-500 py-4">Nenhuma cidade encontrada.</p>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
});

ModalBusca.displayName = 'ModalBusca';

// Modal de imagem otimizado
const ImageModal = memo(({ isOpen, onClose, imageSrc, altText }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative max-w-4xl w-full mx-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-3 focus:outline-none z-50 transition-colors"
        >
          <FaTimes className="text-xl" />
        </button>

        <div className="flex justify-center items-center">
          <div className="relative">
            <Image
              src={imageSrc}
              alt={altText}
              width={800}
              height={600}
              className="max-h-[85vh] w-auto h-auto object-contain rounded-2xl shadow-2xl"
              priority
            />
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center space-x-2 text-white">
              <Image
                src="/iconOficial_faixaRosa.png"
                alt="Logo"
                width={16}
                height={16}
                className="object-contain"
              />
              <span className="text-sm font-medium">www.faixarosa.com</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ImageModal.displayName = 'ImageModal';

// Componente de ações otimizado
const ActionButtons = memo(({ companionData }) => {
  const handleWhatsAppClick = useCallback(() => {
    const contact = companionData?.contactMethods?.[0];
    if (!contact?.whatsappNumber) {
      toast.info("Número do WhatsApp não disponível.");
      return;
    }

    const numero = contact.whatsappNumber;
    const apelido = companionData?.firstName || companionData?.userName || "atendente";
    const username = companionData?.userName || "";
    const mensagemExtra = contact?.whatsappMessage || "Olá, podemos conversar?";
    const mensagemBase = `Olá, ${apelido}! Encontrei seu anúncio no Faixa Rosa - https://faixarosa.com/perfil/${username}`;
    const mensagemFinal = `${mensagemBase}\n\n${mensagemExtra}`;
    const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagemFinal)}`;

    window.open(link, "_blank");
  }, [companionData]);

  const handleTelegramRedirect = useCallback(() => {
    const telegramUsername = companionData?.contactMethods?.[0]?.telegramUsername;
    if (telegramUsername) {
      window.open(`https://t.me/${telegramUsername}`, "_blank");
    } else {
      toast.info("Usuário do Telegram não disponível.");
    }
  }, [companionData]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'Confira meu perfil!',
        text: 'Veja esse conteúdo no Faixa Rosa!',
        url: window.location.href,
      }).catch((error) => console.error('Erro ao compartilhar:', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado!");
    }
  }, []);

  return (
    <div className="mt-6 px-4 sm:px-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
      <motion.button
        onClick={handleWhatsAppClick}
        className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FaWhatsapp className="text-lg" />
        <span>Ver Contato</span>
      </motion.button>

      <div className="flex space-x-3">
        <motion.button
          onClick={handleTelegramRedirect}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaTelegram className="text-lg" />
        </motion.button>

        <motion.button
          onClick={handleShare}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-3 rounded-xl shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaShareAlt className="text-lg" />
        </motion.button>
      </div>
    </div>
  );
});

ActionButtons.displayName = 'ActionButtons';

// Componente principal
export default function Perfil() {
  const { userName } = useParams();
  const [companionData, setCompanionData] = useState(null);
  const [maisAcompanhantes, setMaisAcompanhantes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMoreCompanions, setIsLoadingMoreCompanions] = useState(false);
  const [activeTab, setActiveTab] = useState("fotos");
  const [showModalBusca, setShowModalBusca] = useState(false);
  const [showProfileImageModal, setShowProfileImageModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Função separada para buscar mais acompanhantes
  const fetchMoreCompanions = useCallback(async (city, state, currentUserName) => {
    if (!city || !state) return;

    setIsLoadingMoreCompanions(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/companion?cidade=${encodeURIComponent(city)}&estado=${state}&limit=10`
      );

      if (response.data && Array.isArray(response.data)) {
        // Filtrar o usuário atual e pegar apenas 6 acompanhantes
        const filteredCompanions = response.data
          .filter(comp => comp.userName !== currentUserName)
          .slice(0, 6);

        console.log('Acompanhantes filtrados:', filteredCompanions);
        setMaisAcompanhantes(filteredCompanions);
      } else {
        console.log('Resposta inválida ou vazia da API');
        setMaisAcompanhantes([]);
      }
    } catch (error) {
      console.error('Erro ao buscar mais acompanhantes:', error);
      setMaisAcompanhantes([]);
    } finally {
      setIsLoadingMoreCompanions(false);
    }
  }, []);

  // Fetch do perfil principal
  const fetchProfile = useCallback(async () => {
    if (!userName) return;

    try {
      setIsLoading(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/profile?userName=${userName}`
      );

      const data = response.data;

      if (!data || data.error) {
        toast.error("Acompanhante não encontrada.");
        setIsLoading(false);
        return;
      }

      setCompanionData(data);
      setIsLoading(false);

      // SEMPRE buscar mais acompanhantes, independente do cache
      if (data?.city && data?.state) {
        await fetchMoreCompanions(data.city, data.state, userName);
      } 
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      toast.error("Erro ao carregar perfil.");
      setIsLoading(false);
    }
  }, [userName, fetchMoreCompanions]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
  }, []);


  const handleAgeVisibilityChange = async () => {
    const updatedValue = !companionData.isAgeHidden;

    try {
      const userToken = Cookies.get("userToken");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/description/update`,
        { isAgeHidden: updatedValue },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.data) {
        toast.success(`Idade ${updatedValue ? "ocultada" : "exibida"} com sucesso!`);
        setCompanionData((prev) => ({
          ...prev,
          isAgeHidden: updatedValue,
        }));
      }
    } catch (error) {
      toast.error("Erro ao atualizar visibilidade da idade.");
      console.error(error);
    }
  };


  const handleProfileImageClick = useCallback(() => {
    if (companionData?.profileImage) {
      setSelectedImage(companionData.profileImage);
      setShowProfileImageModal(true);
    }
  }, [companionData?.profileImage]);

  const handleBannerClick = useCallback(() => {
    if (companionData?.bannerImage) {
      setSelectedImage(companionData.bannerImage);
      setShowBannerModal(true);
    }
  }, [companionData?.bannerImage]);

  // Tab content otimizado
  const TabContent = useMemo(() => {
    if (!companionData) return null;

    const tabComponents = {
      fotos: <Fotos userName={companionData.userName} createdAtFormatted={companionData.createdAtFormatted} />,
      videos: <Videos userName={companionData.userName} createdAtFormatted={companionData.createdAtFormatted} />,
      sobre: <Sobre physicalCharacteristics={companionData.PhysicalCharacteristics} description={companionData.description} media={companionData.media} />,
      localidade: <Localidade lugares={companionData.lugares} city={companionData.city} state={companionData.state} />,
      serviços: <Servicos servicesOffered={companionData.servicesOffered} weeklySchedules={companionData.weeklySchedules} />,
      valores: <Valores timedService={companionData.timedServiceCompanion} paymentMethods={companionData.paymentMethods} />
    };

    return (
      <Suspense fallback={<LoadingSpinner />}>
        {tabComponents[activeTab]}
      </Suspense>
    );
  }, [companionData, activeTab]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!companionData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Perfil não encontrado</h3>
          <p className="text-gray-600">O usuário que você procura não existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Suspense fallback={<div className="h-16 bg-white" />}>
        <Navbar bgColor='white' />
      </Suspense>

      {/* Breadcrumbs */}
      <motion.div
        className="w-full max-w-7xl mx-auto p-4 sm:p-6 mt-16 sm:mt-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link href="/" className="flex items-center text-pink-500 hover:text-pink-700 transition-colors duration-200">
              <IoIosArrowBack className="text-2xl mr-2" />
            </Link>
          </motion.div>
          <nav className="text-sm text-gray-700">
            <Link href="/" className="text-pink-500 hover:text-pink-700 transition-colors duration-200">Início</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 font-medium">Perfil</span>
          </nav>
        </div>
      </motion.div>

      {/* Barra de Pesquisa */}
      <motion.div
        className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="relative flex items-center cursor-pointer" onClick={() => setShowModalBusca(true)}>
            <FaSearch className="w-5 h-5 text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Busque por cidade..."
              className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none cursor-pointer"
              readOnly
            />
          </div>
        </div>
      </motion.div>

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-3">
            <motion.div
              className="bg-white shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {/* Banner */}
              <div className="relative h-48 sm:h-60 md:h-72 bg-gradient-to-br from-pink-200 to-purple-200">
                {companionData.bannerImage ? (
                  <Image
                    src={companionData.bannerImage}
                    alt="Banner"
                    fill
                    className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={handleBannerClick}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-500">Sem banner</span>
                  </div>
                )}
              </div>

              {/* Foto de perfil */}
              <div className="relative px-4 sm:px-6">
                <div className="absolute -top-12 sm:-top-16 left-4 sm:left-6">
                  <motion.div
                    className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {companionData.profileImage ? (
                      <Image
                        src={companionData.profileImage}
                        alt="Foto do perfil"
                        fill
                        className="object-cover rounded-full cursor-pointer"
                        onClick={handleProfileImageClick}
                        sizes="128px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Sem foto</span>
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 bg-green-500 rounded-full p-1">
                      <FaCheckCircle className="text-white text-sm" />
                    </div>
                  </motion.div>
                </div>

                {/* Stories integradas */}
                <div className="pt-16 sm:pt-20 pb-4">
                  <Suspense fallback={
                    <div className="flex space-x-3 py-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
                      ))}
                    </div>
                  }>
                    <Stories userName={companionData?.userName} />
                  </Suspense>
                </div>

                {/* Informações do perfil */}
                <div className="pb-6">
                  <div className="text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                      {companionData?.userName}
                    </h1>

                    <div className="space-y-3 text-gray-700 mb-6">
                      <div className="flex items-center justify-center sm:justify-start space-x-2">
                        <FaMapMarkerAlt className="text-pink-500" />
                        <span className="font-medium">Local: {companionData?.city} - {companionData?.state}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 justify-center sm:justify-start text-center sm:text-left">
                        {companionData?.isAgeHidden && (
                          <div className="flex items-center justify-center sm:justify-start space-x-2">
                            <FaRegUser className="text-pink-500" />
                            <span className="font-medium">Idade: {companionData.age} anos</span>
                          </div>
                        )}
                      </div>


                      <div className="flex items-center justify-center sm:justify-start space-x-2">
                        <FaMale className="text-pink-500" />
                        <span className="font-medium">Atende: {companionData?.atendimentos?.join(", ") || "Não especificado"}</span>
                      </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="flex justify-center sm:justify-start items-center space-x-8 border-t border-gray-200 pt-6 mb-6">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                          {companionData?.totalPosts ?? 0}
                        </div>
                        <div className="text-sm font-semibold text-gray-600">Postagens</div>
                      </div>
                    </div>

                    {/* Botões de ação */}
                    <ActionButtons companionData={companionData} />
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-t border-gray-200 px-4 sm:px-6">
                  <div className="flex flex-wrap justify-center sm:justify-start space-x-1 sm:space-x-4 py-4 overflow-x-auto">
                    {['fotos', 'videos', 'sobre', 'localidade', 'serviços', 'valores'].map((tab) => (
                      <motion.button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`px-3 py-2 font-semibold text-sm sm:text-base capitalize whitespace-nowrap transition-all duration-200 ${activeTab === tab
                          ? "text-pink-500 border-b-2 border-pink-500"
                          : "text-gray-600 hover:text-pink-500"
                          }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {tab}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Conteúdo das tabs */}
                <div className="min-h-[400px]">
                  {TabContent}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Mais acompanhantes */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <FaImages className="text-pink-500 mr-2" />
                Mais acompanhantes
                {isLoadingMoreCompanions && (
                  <FaSpinner className="ml-2 text-gray-400 animate-spin" />
                )}
              </h3>

              {isLoadingMoreCompanions ? (
                <MoreCompanionsLoading />
              ) : maisAcompanhantes.length > 0 ? (
                <div className="space-y-4">
                  {maisAcompanhantes.map((acompanhante, index) => (
                    <motion.div
                      key={`${acompanhante.userName}-${index}`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href={`/perfil/${acompanhante.userName}`}>
                        <div className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                          {acompanhante.profileImage ? (
                            <Image
                              src={acompanhante.profileImage}
                              alt={`Acompanhante ${acompanhante.userName}`}
                              width={48}
                              height={48}
                              className="rounded-full w-12 h-12 object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                              {acompanhante.userName?.charAt(0).toUpperCase() || ""}
                            </div>
                          )}
                          <div className="ml-3 flex-1">
                            <p className="font-semibold text-gray-800">{acompanhante.userName}</p>
                            <p className="text-gray-600 text-sm">
                              {acompanhante.atendimentos?.join(", ") || ""}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaImages className="text-gray-400 text-2xl" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    Nenhuma acompanhante encontrada nesta região
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modais */}
      <AnimatePresence>
        {showModalBusca && (
          <ModalBusca isOpen={showModalBusca} onClose={() => setShowModalBusca(false)} />
        )}

        {showProfileImageModal && (
          <ImageModal
            isOpen={showProfileImageModal}
            onClose={() => setShowProfileImageModal(false)}
            imageSrc={selectedImage}
            altText="Foto de perfil"
          />
        )}

        {showBannerModal && (
          <ImageModal
            isOpen={showBannerModal}
            onClose={() => setShowBannerModal(false)}
            imageSrc={selectedImage}
            altText="Banner"
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-12">
        <Suspense fallback={<div className="h-32 bg-gray-200" />}>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
}