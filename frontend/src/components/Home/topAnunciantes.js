"use client";
import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Crown, Trophy, Medal, Star } from "phosphor-react";
import axios from "axios";
import Image from "next/image";

const TopAnunciantes = memo(() => {
  const router = useRouter();
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ícones de ranking por posição
  const rankingIcons = {
    1: <Crown size={20} className="text-yellow-500" weight="fill" />,
    2: <Trophy size={20} className="text-gray-400" weight="fill" />,
    3: <Medal size={20} className="text-amber-600" weight="fill" />,
    4: <Star size={18} className="text-purple-500" weight="fill" />,
    5: <Star size={18} className="text-blue-500" weight="fill" />
  };

  // Cores de badge por posição
  const badgeColors = {
    1: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white",
    2: "bg-gradient-to-r from-gray-400 to-gray-600 text-white", 
    3: "bg-gradient-to-r from-amber-500 to-amber-700 text-white",
    4: "bg-gradient-to-r from-purple-500 to-purple-700 text-white",
    5: "bg-gradient-to-r from-blue-500 to-blue-700 text-white"
  };

  const fetchCompanions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/top10/listar`,
      );
      if (res.data.length === 0) {
        return;
      }
      setCompanions(res.data);
    } catch (error) {
      console.error("Erro ao buscar top 5:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanions();
  }, [fetchCompanions]);

  // Rolagem automática otimizada
  useEffect(() => {
    if (loading || companions.length === 0) return;

    const interval = setInterval(() => {
      if (scrollRef.current && !isDragging.current) {
        const scrollContainer = scrollRef.current;
        const cardWidth = 280; // Largura aproximada do card + gap
        
        scrollContainer.scrollBy({ left: cardWidth, behavior: "smooth" });

        // Reset ao final
        if (
          scrollContainer.scrollLeft + scrollContainer.clientWidth >=
          scrollContainer.scrollWidth - 50
        ) {
          setTimeout(() => {
            scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
          }, 500);
        }
      }
    }, 4000);
    
    return () => clearInterval(interval);
  }, [loading, companions.length]);

  // Scroll com mouse/touch otimizado
  useEffect(() => {
    const slider = scrollRef.current;
    let startX;
    let scrollLeft;

    if (!slider) return;

    const startDragging = (e) => {
      isDragging.current = true;
      startX = e.pageX || e.touches?.[0]?.pageX;
      scrollLeft = slider.scrollLeft;
      slider.style.cursor = 'grabbing';
    };

    const stopDragging = () => {
      isDragging.current = false;
      if (slider) {
        slider.style.cursor = 'grab';
      }
    };

    const onDrag = (e) => {
      if (!isDragging.current || !startX) return;
      e.preventDefault();
      const x = e.pageX || e.touches?.[0]?.pageX;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    };

    // Event listeners
    slider.addEventListener("mousedown", startDragging);
    slider.addEventListener("touchstart", startDragging, { passive: true });
    slider.addEventListener("mouseup", stopDragging);
    slider.addEventListener("mouseleave", stopDragging);
    slider.addEventListener("touchend", stopDragging);
    slider.addEventListener("mousemove", onDrag);
    slider.addEventListener("touchmove", onDrag, { passive: false });

    return () => {
      if (slider) {
        slider.removeEventListener("mousedown", startDragging);
        slider.removeEventListener("touchstart", startDragging);
        slider.removeEventListener("mouseup", stopDragging);
        slider.removeEventListener("mouseleave", stopDragging);
        slider.removeEventListener("touchend", stopDragging);
        slider.removeEventListener("mousemove", onDrag);
        slider.removeEventListener("touchmove", onDrag);
      }
    };
  }, []);

  const handleCardClick = useCallback((userName) => {
    if (!isDragging.current) {
      router.push(`/perfil/${userName}`);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="bg-[#ebeff1] py-12 md:py-16 px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <p className="mt-4 text-gray-600">Carregando top anunciantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#ebeff1] py-12 md:py-16 px-4">
      {/* Título responsivo */}
      <motion.div
        className="text-center mb-8 md:mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 md:mb-4 font-sans">
          Acompanhantes Faixa Rosa em destaque! 
        </h2>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
          Conheça os profissionais mais bem avaliados da nossa plataforma
        </p>
      </motion.div>

      {/* Container do carousel */}
      <div className="relative max-w-7xl mx-auto">
        {/* Gradiente de fade nas bordas - apenas desktop */}
        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#ebeff1] to-transparent z-10 pointer-events-none" />
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#ebeff1] to-transparent z-10 pointer-events-none" />

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 md:gap-6 snap-x snap-mandatory px-4 md:px-8 scrollbar-hide cursor-grab active:cursor-grabbing select-none pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <AnimatePresence>
            {companions.slice(0, 5).map((anunciante, index) => (
              <motion.div
                key={anunciante.userName}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.03,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCardClick(anunciante.userName)}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-white rounded-2xl shadow-lg border border-gray-200 hover:border-pink-300 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center min-w-[240px] sm:min-w-[260px] md:min-w-[280px] snap-start cursor-pointer group overflow-hidden"
              >
                {/* Background gradient hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Badge de ranking */}
                <div className={`absolute top-3 left-3 ${badgeColors[index + 1]} text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg z-10`}>
                  {rankingIcons[index + 1]}
                  #{index + 1}
                </div>

                {/* Sparkle effect no primeiro lugar */}
                {index === 0 && (
                  <motion.div
                    className="absolute top-2 right-2 text-yellow-400"
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    ✨
                  </motion.div>
                )}

                <div className="relative z-10 p-6 md:p-8 w-full">
                  {/* Avatar */}
                  <div className="relative mb-4 md:mb-6">
                    {anunciante.profileImage ? (
                      <div className="relative">
                        <Image
                          src={anunciante.profileImage}
                          alt={anunciante.userName}
                          width={80}
                          height={80}
                          className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover mx-auto shadow-lg border-2 border-white"
                        />
                        {/* Anel de destaque para top 3 */}
                        {index < 3 && (
                          <div className={`absolute inset-0 rounded-full border-2 ${
                            index === 0 ? 'border-yellow-400' : 
                            index === 1 ? 'border-gray-400' : 'border-amber-500'
                          } animate-pulse`} />
                        )}
                      </div>
                    ) : (
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-pink-500 font-bold text-lg md:text-xl mx-auto shadow-lg border-2 border-white">
                        {anunciante.userName?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                  </div>

                  {/* Nome */}
                  <h3 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900 mb-2 md:mb-3 truncate">
                    {anunciante.userName}
                  </h3>

                  {/* Localização */}
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-2 md:mb-3">
                    <MapPin size={14} className="text-pink-500 flex-shrink-0" weight="duotone" />
                    <span className="text-xs md:text-sm truncate">{anunciante.city}</span>
                  </div>

                  {/* Info do plano e pontos */}
                  <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs md:text-sm">
                    <span className="font-medium text-gray-700">{anunciante.plan}</span>
                    <span className="text-gray-500 mx-1">•</span>
                    <span className="font-bold text-pink-600">{anunciante.points} pts</span>
                  </div>

                  {/* Indicador de posição especial para top 3 */}
                  {index < 3 && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Indicadores de scroll - apenas mobile */}
        <div className="flex justify-center mt-6 md:hidden">
          <div className="flex gap-2">
            {companions.slice(0, 5).map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-pink-300 opacity-50"
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
});

TopAnunciantes.displayName = 'TopAnunciantes';

export default TopAnunciantes;