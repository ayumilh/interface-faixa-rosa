"use client";

import React, { useState, useCallback, memo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CaretLeft, 
  CaretRight, 
  MapPin, 
  Clock, 
  Star, 
  ArrowRight,
  Users,
  CheckCircle
} from "phosphor-react";
import { useRouter } from "next/navigation";

const Cidades = memo(() => {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Dados das cidades - Lins ativa, outras em breve
  const cidades = [
    {
      id: 1,
      nome: "Lins",
      estado: "SP",
      slug: "acompanhantes-em-lins-sp",
      ativa: true,
      destaque: true,
      anunciantes: 145,
      imagem: "/assets/cidade-lins.jpg",
      gradiente: "from-rose-500 to-pink-600"
    },
    {
      id: 2,
      nome: "Bauru",
      estado: "SP", 
      slug: "acompanhantes-em-bauru-sp",
      ativa: false,
      destaque: false,
      anunciantes: 0,
      imagem: "/assets/cidade-bauru.jpg",
      gradiente: "from-gray-500 to-gray-600"
    },
    {
      id: 3,
      nome: "Birigui",
      estado: "SP",
      slug: "acompanhantes-em-birigui-sp", 
      ativa: false,
      destaque: false,
      anunciantes: 0,
      imagem: "/assets/cidade-birigui.jpg",
      gradiente: "from-gray-500 to-gray-600"
    },
    {
      id: 4,
      nome: "Marília",
      estado: "SP",
      slug: "acompanhantes-em-marilia-sp",
      ativa: false,
      destaque: false,
      anunciantes: 0,
      imagem: "/assets/cidade-marilia.jpg",
      gradiente: "from-gray-500 to-gray-600"
    },
    {
      id: 5,
      nome: "Sorocaba",
      estado: "SP",
      slug: "acompanhantes-em-sorocaba-sp",
      ativa: false,
      destaque: false,
      anunciantes: 0,
      imagem: "/assets/cidade-sorocaba.jpg",
      gradiente: "from-gray-500 to-gray-600"
    }
  ];

  const handleCidadeClick = useCallback((cidade) => {
    if (!isDragging && cidade.ativa) {
      router.push(`/${cidade.slug}`);
    }
  }, [router, isDragging]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(cidades.length - 2));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(cidades.length - 2)) % Math.ceil(cidades.length - 2));
  }, []);

  // Auto scroll para mobile
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.innerWidth < 768 && !isDragging) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide, isDragging]);

  // Touch/Mouse drag functionality
  useEffect(() => {
    const slider = scrollRef.current;
    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;
    let isScrolling = false;

    if (!slider) return;

    const startDragging = (e) => {
      const clientX = e.pageX || e.touches?.[0]?.clientX;
      const clientY = e.pageY || e.touches?.[0]?.clientY;
      
      setIsDragging(true);
      startX = clientX;
      startY = clientY;
      scrollLeft = slider.scrollLeft;
      isScrolling = false;
      slider.style.cursor = 'grabbing';
      slider.style.scrollBehavior = 'auto';
    };

    const stopDragging = () => {
      setIsDragging(false);
      if (slider) {
        slider.style.cursor = 'grab';
        slider.style.scrollBehavior = 'smooth';
      }
      setTimeout(() => {
        setIsDragging(false);
      }, 200);
    };

    const onDrag = (e) => {
      if (!isDragging) return;
      
      const clientX = e.pageX || e.touches?.[0]?.clientX;
      const clientY = e.pageY || e.touches?.[0]?.clientY;
      
      const deltaX = Math.abs(clientX - startX);
      const deltaY = Math.abs(clientY - startY);
      
      // Detecta se é scroll horizontal ou vertical
      if (!isScrolling) {
        if (deltaX > deltaY && deltaX > 10) {
          isScrolling = true;
          e.preventDefault();
        } else if (deltaY > deltaX && deltaY > 10) {
          return; // Permite scroll vertical
        }
      }
      
      if (isScrolling) {
        e.preventDefault();
        const walk = (clientX - startX) * 1.2;
        slider.scrollLeft = scrollLeft - walk;
      }
    };

    // Mouse events
    slider.addEventListener("mousedown", startDragging);
    document.addEventListener("mouseup", stopDragging);
    slider.addEventListener("mousemove", onDrag);
    slider.addEventListener("mouseleave", stopDragging);

    // Touch events
    slider.addEventListener("touchstart", startDragging, { passive: true });
    document.addEventListener("touchend", stopDragging, { passive: true });
    slider.addEventListener("touchmove", onDrag, { passive: false });

    return () => {
      if (slider) {
        slider.removeEventListener("mousedown", startDragging);
        slider.removeEventListener("mousemove", onDrag);
        slider.removeEventListener("mouseleave", stopDragging);
        slider.removeEventListener("touchstart", startDragging);
        slider.removeEventListener("touchmove", onDrag);
      }
      document.removeEventListener("mouseup", stopDragging);
      document.removeEventListener("touchend", stopDragging);
    };
  }, [isDragging]);

  return (
    <div className="w-full py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8 md:mb-12 px-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin size={28} className="text-rose-500" weight="duotone" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Cidades Disponíveis
            </h2>
          </div>
          
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Selecione sua cidade para encontrar acompanhantes verificadas
          </p>
        </motion.div>

        {/* Mobile View - Carousel */}
        <div className="md:hidden px-4">
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing pb-6"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {cidades.map((cidade, index) => (
                <motion.div
                  key={cidade.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => handleCidadeClick(cidade)}
                  whileHover={cidade.ativa ? { y: -4 } : {}}
                  whileTap={cidade.ativa ? { scale: 0.98 } : {}}
                  className={`relative min-w-[260px] h-40 rounded-xl overflow-hidden shadow-lg snap-start group ${
                    cidade.ativa 
                      ? 'cursor-pointer hover:shadow-xl' 
                      : 'cursor-not-allowed opacity-75'
                  } transition-all duration-300 border border-white`}
                >
                  {/* Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cidade.gradiente}`} />
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 bg-black/40" />

                  {/* Status badge */}
                  <div className="absolute top-3 right-3 z-20">
                    {cidade.ativa ? (
                      <div className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle size={10} weight="fill" />
                        Ativa
                      </div>
                    ) : (
                      <div className="bg-gray-600 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                        <Clock size={10} weight="duotone" />
                        Em Breve
                      </div>
                    )}
                  </div>

                 
                  

                  {/* City info */}
                  <div className="relative z-10 h-full flex flex-col justify-between p-4 text-white">
                    {/* Top area - deixa espaço para badges */}
                    <div className="flex-1" />
                    
                    {/* Bottom area - informações principais */}
                    <div>
                      <h3 className="text-lg font-bold mb-1 leading-tight">
                        {cidade.nome}
                      </h3>
                      <p className="text-sm text-white/90 mb-2">
                        {cidade.estado}
                      </p>
                      
                      {cidade.ativa ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Users size={14} className="text-white/80" weight="duotone" />
                            <span className="font-medium">{cidade.anunciantes} anunciantes</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm font-semibold bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg group-hover:bg-white/30 transition-colors">
                            <span>Ver perfis</span>
                            <ArrowRight size={14} weight="bold" />
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-white/80">
                          <p className="font-medium">Em preparação</p>
                          <p className="text-xs">Aguarde novidades</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop View - Grid */}
        <div className="hidden md:grid grid-cols-5 gap-5 lg:gap-6 px-4 lg:px-6">
          {cidades.map((cidade, index) => (
            <motion.div
              key={cidade.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => handleCidadeClick(cidade)}
              whileHover={cidade.ativa ? { y: -6, scale: 1.02 } : {}}
              className={`relative h-48 lg:h-52 rounded-xl overflow-hidden shadow-lg group ${
                cidade.ativa 
                  ? 'cursor-pointer hover:shadow-xl' 
                  : 'cursor-not-allowed opacity-75'
              } transition-all duration-300 border border-white`}
            >
              {/* Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cidade.gradiente}`} />
              
              {/* Content overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />

              {/* Status badge */}
              <div className="absolute top-4 right-4 z-20">
                {cidade.ativa ? (
                  <div className="bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <CheckCircle size={12} weight="fill" />
                    Ativa
                  </div>
                ) : (
                  <div className="bg-gray-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Clock size={12} weight="duotone" />
                    Em Breve
                  </div>
                )}
              </div>

              {/* Destaque badge */}
              {cidade.destaque && cidade.ativa && (
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Star size={12} weight="fill" />
                    Destaque
                  </div>
                </div>
              )}

              {/* City info */}
              <div className="relative z-10 h-full flex flex-col justify-end p-5 text-white">
                <h3 className="text-lg lg:text-xl font-bold mb-1">
                  {cidade.nome}
                </h3>
                <p className="text-sm text-white/90 mb-4">
                  São Paulo - {cidade.estado}
                </p>
                
                {cidade.ativa ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Users size={16} className="text-white/80" weight="duotone" />
                      <span className="font-medium">{cidade.anunciantes} anunciantes</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <span>Explorar agora</span>
                      <ArrowRight size={16} weight="bold" />
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-white/80">
                    <p>Cidade em preparação</p>
                    <p className="text-xs mt-1">Aguarde novidades</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
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

Cidades.displayName = 'Cidades';

export default Cidades;