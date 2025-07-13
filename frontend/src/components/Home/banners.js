"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CaretLeft, 
  CaretRight, 
  ArrowRight, 
  Star, 
  MapPin, 
  Clock,
  Heart,
  Eye,
  Phone,
  WhatsappLogo,
  User
} from "phosphor-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Banners = memo(() => {
  // Chama o hook sempre no topo, sem condicionais
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  // Exemplo de uso seguro do router num handler
  const handleClick = useCallback((id) => {
    try {
      router.push(`/detalhes/${id}`);
    } catch (err) {
      console.warn("Falha ao navegar:", err);
    }
  }, [router]);


  // Dados fakes para desenvolvimento
  const fakeData = [
    {
      id: 1,
      userName: "Ana Silva",
      displayName: "Ana",
      age: 25,
      city: "São Paulo",
      state: "SP",
      profileImage: "/api/placeholder/600/800",
      coverImage: "/api/placeholder/1200/600",
      description: "Elegante, carinhosa e com muito charme. Proporciono momentos únicos e inesquecíveis.",
      shortDescription: "Elegante e carinhosa",
      plan: "Premium",
      isOnline: true,
      lastOnline: "Agora",
      rating: 4.9,
      reviews: 156,
      views: 2847,
      gradient: "from-pink-500 to-purple-600",
      slug: "ana-silva-sp",
      price: "R$ 300/h",
      whatsapp: "11999999999",
      phone: "11888888888",
      availability: "24h",
      verified: true,
      vip: false
    },
    {
      id: 2,
      userName: "Mariana Costa",
      displayName: "Mari",
      age: 28,
      city: "Rio de Janeiro",
      state: "RJ",
      profileImage: "/api/placeholder/600/800",
      coverImage: "/api/placeholder/1200/600",
      description: "Sofisticada e envolvente, ofereço uma experiência única e memorável.",
      shortDescription: "Sofisticada e envolvente",
      plan: "VIP",
      isOnline: false,
      lastOnline: "2 horas atrás",
      rating: 5.0,
      reviews: 89,
      views: 3521,
      gradient: "from-purple-500 to-indigo-600",
      slug: "mariana-costa-rj",
      price: "R$ 500/h",
      whatsapp: "21999999999",
      phone: "21888888888",
      availability: "Seg-Sex 18h-02h",
      verified: true,
      vip: true
    },
    {
      id: 3,
      userName: "Beatriz Lima",
      displayName: "Bia",
      age: 24,
      city: "Brasília",
      state: "DF",
      profileImage: "/api/placeholder/600/800",
      coverImage: "/api/placeholder/1200/600",
      description: "Doce, inteligente e muito atraente. Adoro conhecer pessoas interessantes.",
      shortDescription: "Doce e inteligente",
      plan: "Gold",
      isOnline: true,
      lastOnline: "Agora",
      rating: 4.8,
      reviews: 203,
      views: 1892,
      gradient: "from-amber-500 to-orange-600",
      slug: "beatriz-lima-df",
      price: "R$ 250/h",
      whatsapp: "61999999999",
      phone: "61888888888",
      availability: "Todos os dias 20h-04h",
      verified: true,
      vip: false
    }
  ];

  // Função para carregar dados fakes
  const loadFakeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simula delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('📊 Dados fakes carregados:', {
        total: fakeData.length,
        online: fakeData.filter(b => b.isOnline).length
      });
      
      setBanners(fakeData);
    } catch (err) {
      console.error('❌ Erro ao carregar dados:', err);
      setError('Erro ao carregar acompanhantes');
      setBanners(fakeData); // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar dados ao montar
  useEffect(() => {
    loadFakeData();
  }, [loadFakeData]);

  // Auto-play do carousel
  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length]);

  // Navegação do carousel
  const nextBanner = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  }, [banners.length]);

  const prevBanner = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const goToBanner = useCallback((index) => {
    if (index >= 0 && index < banners.length) {
      setCurrentIndex(index);
    }
  }, [banners.length]);

  // Funções de interação
  const handleProfileClick = useCallback((companion) => {
    try {
      console.log('👤 Navegando para perfil:', companion.userName);
      if (router && router.push) {
        router.push(`/perfil/${companion.slug}`);
      }
    } catch (err) {
      console.warn('Erro na navegação:', err);
    }
  }, [router]);

  const handleWhatsAppClick = useCallback((companion, event) => {
    if (event) event.stopPropagation();
    try {
      const message = `Olá ${companion.displayName}! Vi seu perfil no Faixa Rosa.`;
      const url = `https://wa.me/55${companion.whatsapp}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
      console.log('💬 WhatsApp:', companion.userName);
    } catch (err) {
      console.warn('Erro ao abrir WhatsApp:', err);
    }
  }, []);

  const handleCallClick = useCallback((companion, event) => {
    if (event) event.stopPropagation();
    try {
      window.open(`tel:${companion.phone}`, '_self');
      console.log('📞 Ligação:', companion.userName);
    } catch (err) {
      console.warn('Erro ao fazer ligação:', err);
    }
  }, []);

  const handleFavoriteClick = useCallback((companion, event) => {
    if (event) event.stopPropagation();
    try {
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(companion.id)) {
          newFavorites.delete(companion.id);
        } else {
          newFavorites.add(companion.id);
        }
        return newFavorites;
      });
      console.log('❤️ Favorito:', companion.userName);
    } catch (err) {
      console.warn('Erro ao favoritar:', err);
    }
  }, []);

  const getPlanColor = useCallback((plan) => {
    const colors = {
      'VIP': 'bg-gradient-to-r from-purple-600 to-purple-800',
      'Premium': 'bg-gradient-to-r from-pink-500 to-pink-700',
      'Gold': 'bg-gradient-to-r from-yellow-500 to-yellow-700'
    };
    return colors[plan] || 'bg-gradient-to-r from-gray-500 to-gray-700';
  }, []);

  const formatLastOnline = useCallback((lastOnline) => {
    return lastOnline === "Agora" ? "Online agora" : `Última vez: ${lastOnline}`;
  }, []);

  // Estado de loading
  if (loading) {
    return (
      <div className="w-full bg-gray-100">
        <div className="h-48 sm:h-64 lg:h-80 flex items-center justify-center mt-14">
          <div className="text-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-gray-600 font-medium text-sm sm:text-base">
              Carregando acompanhantes...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className="w-full bg-gray-100">
        <div className="h-48 sm:h-64 lg:h-80 flex items-center justify-center mt-14">
          <div className="text-center text-red-500 px-4">
            <div className="text-base sm:text-lg font-bold mb-2">Ops! Algo deu errado</div>
            <div className="text-xs sm:text-sm mb-4">{error}</div>
            <button 
              onClick={loadFakeData}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 text-sm sm:text-base"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Estado vazio
  if (!banners || banners.length === 0) {
    return (
      <div className="w-full bg-gray-100">
        <div className="h-48 sm:h-64 lg:h-80 flex items-center justify-center mt-14">
          <div className="text-center text-gray-500">
            <User size={32} className="sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm sm:text-base">Nenhuma acompanhante em destaque</p>
          </div>
        </div>
      </div>
    );
  }

  const currentBanner = banners[currentIndex] || banners[0];
  
  if (!currentBanner) {
    return (
      <div className="w-full bg-gray-100">
        <div className="h-48 sm:h-64 lg:h-80 flex items-center justify-center mt-14">
          <div className="text-center text-gray-500">
            <p className="text-sm sm:text-base">Erro ao exibir banner</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-100">
      <div className="w-full">
        <div 
          className="relative h-[320px] sm:h-[400px] lg:h-[500px] w-full overflow-hidden shadow-lg mt-14 cursor-pointer"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          onClick={() => handleProfileClick(currentBanner)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 bg-gradient-to-br ${currentBanner.gradient}`}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                  <div className="max-w-7xl mx-auto">
                    
                    {/* Layout Horizontal: Informações + Foto */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 h-full items-center">
                      
                      {/* Informações - Ocupa metade do espaço em desktop */}
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-white hidden lg:block order-2 lg:order-1"
                      >
                        {/* Status e Plano */}
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
                          <div className={`${getPlanColor(currentBanner.plan)} text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full`}>
                            {currentBanner.plan}
                          </div>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${currentBanner.isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
                            <span className="text-xs sm:text-sm text-white/90">
                              {currentBanner.isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>
                          {currentBanner.verified && (
                            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              ✓ Verificada
                            </div>
                          )}
                        </div>

                        {/* Nome e Local */}
                        <div className="mb-2 sm:mb-3">
                          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1">
                            {currentBanner.displayName}
                          </h1>
                          <div className="flex items-center gap-1 text-white/90">
                            <MapPin size={14} className="sm:w-4 sm:h-4" weight="fill" />
                            <span className="text-sm sm:text-base">{currentBanner.age} anos • {currentBanner.city}/{currentBanner.state}</span>
                          </div>
                        </div>

                        {/* Descrição */}
                        <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-3 sm:mb-4 max-w-md">
                          {currentBanner.shortDescription}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                          <div className="flex items-center gap-1">
                            <Star size={14} className="sm:w-4 sm:h-4 text-yellow-400" weight="fill" />
                            <span className="font-bold text-sm sm:text-base">{currentBanner.rating}</span>
                            <span className="text-xs sm:text-sm text-white/70">({currentBanner.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye size={14} className="sm:w-4 sm:h-4 text-white/70" />
                            <span className="text-xs sm:text-sm text-white/70">{currentBanner.views} views</span>
                          </div>
                        </div>

                        {/* Preço e Ações */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                          <div className="text-xl sm:text-2xl font-bold text-white">
                            {currentBanner.price}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleWhatsAppClick(currentBanner, e)}
                              className="bg-green-500 hover:bg-green-600 text-white p-2 sm:p-2.5 rounded-full transition-colors"
                              title="WhatsApp"
                            >
                              <WhatsappLogo size={18} className="sm:w-5 sm:h-5" weight="fill" />
                            </button>
                            
                            <button
                              onClick={(e) => handleCallClick(currentBanner, e)}
                              className="bg-blue-500 hover:bg-blue-600 text-white p-2 sm:p-2.5 rounded-full transition-colors"
                              title="Ligar"
                            >
                              <Phone size={18} className="sm:w-5 sm:h-5" weight="fill" />
                            </button>
                            
                            <button
                              onClick={(e) => handleFavoriteClick(currentBanner, e)}
                              className={`p-2 sm:p-2.5 rounded-full transition-colors ${
                                favorites.has(currentBanner.id) 
                                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                                  : 'bg-white/20 hover:bg-white/30 text-white'
                              }`}
                              title="Favoritar"
                            >
                              <Heart size={18} className="sm:w-5 sm:h-5" weight={favorites.has(currentBanner.id) ? "fill" : "regular"} />
                            </button>
                          </div>
                        </div>

                        {/* Botão Ver Perfil */}
                        <button
                          onClick={() => handleProfileClick(currentBanner)}
                          className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
                        >
                          Ver Perfil Completo
                          <ArrowRight size={16} className="sm:w-4 sm:h-4" weight="bold" />
                        </button>
                      </motion.div>

                      {/* Foto - Ocupa toda largura disponível */}
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex justify-center lg:justify-end order-1 lg:order-2 w-full"
                      >
                        <div className="relative w-full h-full">
                          {/* Desktop: Imagem horizontal ocupando metade da tela */}
                          <div className="hidden lg:block w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gray-200">
                            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                              <User size={64} className="text-gray-500" />
                            </div>
                          </div>

                          {/* Mobile: Apenas imagem limpa para clique */}
                          <div className="lg:hidden w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gray-200">
                            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                              <User size={48} className="sm:w-16 sm:h-16 text-gray-500" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controles de Navegação */}
          {banners.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevBanner();
                }}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all z-20"
              >
                <CaretLeft size={16} className="sm:w-5 sm:h-5" weight="bold" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextBanner();
                }}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all z-20"
              >
                <CaretRight size={16} className="sm:w-5 sm:h-5" weight="bold" />
              </button>

              {/* Indicadores */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1 sm:gap-2 z-20">
                {banners.map((banner, index) => (
                  <button
                    key={banner.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      goToBanner(index);
                    }}
                    className={`h-1.5 sm:h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-white w-6 sm:w-8'
                        : 'bg-white/50 hover:bg-white/70 w-1.5 sm:w-2'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Badge Destaque */}
          <div className="absolute top-3 sm:top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg z-20 flex items-center gap-1 sm:gap-2 mt-8">
            <Star size={12} className="sm:w-4 sm:h-4" weight="fill" />
            <span className="hidden sm:inline">Bem-vindo ao Faixa Rosa</span>
            <span className="sm:hidden">VIPs Faixa Rosa</span>
            {currentBanner.vip && (
              <span className="bg-purple-600 text-white text-xs px-1 sm:px-2 py-0.5 rounded-full">
                VIP
              </span>
            )}
          </div>

          {/* Counter */}
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black/20 backdrop-blur-sm text-white text-xs px-2 sm:px-3 py-1 rounded-full z-20">
            {currentIndex + 1} de {banners.length}
          </div>
        </div>
      </div>
    </div>
  );
});

Banners.displayName = 'Banners';

export default Banners; 