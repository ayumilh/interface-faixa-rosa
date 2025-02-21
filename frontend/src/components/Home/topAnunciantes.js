"use client";
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, UserCircle } from "phosphor-react";

// Mock dos top anunciantes
const anunciantes = [
  { nome: "Ana Deluxe", cidade: "São Paulo" },
  { nome: "Bella VIP", cidade: "Rio de Janeiro" },
  { nome: "Gabi Star", cidade: "Belo Horizonte" },
  { nome: "Júlia Gold", cidade: "Curitiba" },
  { nome: "Mariana Lux", cidade: "Porto Alegre" },
  { nome: "Raíssa Premium", cidade: "Brasília" },
  { nome: "Camila Top", cidade: "Salvador" },
  { nome: "Lorena Queen", cidade: "Fortaleza" },
  { nome: "Tatiane Exclusive", cidade: "Recife" },
  { nome: "Fernanda VIP", cidade: "Florianópolis" },
];

export default function TopAnunciantes() {
  const scrollRef = useRef(null);
  const isDragging = useRef(false); // Usar useRef para preservar o estado

  const startDragging = (e) => {
    isDragging.current = true;  // Atualizando via .current
    startX = e.pageX || e.touches[0].pageX;
    scrollLeft = slider.scrollLeft;
  };

  const stopDragging = () => {
    isDragging.current = false;  // Atualizando via .current
  };

  // Rola automaticamente no desktop
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current && !isDragging.current) {  // Usando isDragging.current
        scrollRef.current.scrollBy({
          left: 300,
          behavior: "smooth",
        });

        if (
          scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
          scrollRef.current.scrollWidth
        ) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Adiciona funcionalidade de arrastar com o mouse/touch
  useEffect(() => {
    const slider = scrollRef.current;
    let startX;
    let scrollLeft;

    if (!slider) return;

    const startDragging = (e) => {
      isDragging.current = true;  // Usando .current
      startX = e.pageX || e.touches[0].pageX;
      scrollLeft = slider.scrollLeft;
    };

    const stopDragging = () => {
      isDragging.current = false;  // Usando .current
    };

    const onDrag = (e) => {
      if (!isDragging.current) return;  // Acessando .current
      e.preventDefault();
      const x = e.pageX || e.touches[0].pageX;
      const walk = (x - startX) * 2; // Velocidade do arrasto
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousedown", startDragging);
    slider.addEventListener("touchstart", startDragging);
    slider.addEventListener("mouseup", stopDragging);
    slider.addEventListener("mouseleave", stopDragging);
    slider.addEventListener("touchend", stopDragging);
    slider.addEventListener("mousemove", onDrag);
    slider.addEventListener("touchmove", onDrag);

    return () => {
      slider.removeEventListener("mousedown", startDragging);
      slider.removeEventListener("touchstart", startDragging);
      slider.removeEventListener("mouseup", stopDragging);
      slider.removeEventListener("mouseleave", stopDragging);
      slider.removeEventListener("touchend", stopDragging);
      slider.removeEventListener("mousemove", onDrag);
      slider.removeEventListener("touchmove", onDrag);
    };
  }, []);

  
  return (
    <div className="bg-[#ebeff1] py-16 px-4">
      {/* Título da Seção */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-10 font-[Poppins]">
        Top 10 Anunciantes do Brasil
      </h2>

      {/* Carrossel de Anunciantes */}
      <div className="relative max-w-5xl mx-auto">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 snap-x snap-mandatory px-4 scrollbar-hide cursor-grab active:cursor-grabbing select-none"
        >
          {anunciantes.map((anunciante, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:border-pink-500 transition-all duration-300 flex flex-col items-center text-center min-w-[250px] sm:min-w-[280px] snap-start"
            >
              {/* Número da Colocação */}
              <div className="absolute top-2 left-2 bg-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                #{index + 1}
              </div>

              {/* Ícone de Perfil */}
              <UserCircle size={60} weight="duotone" className="text-gray-400 mb-4" />

              {/* Nome do Anunciante */}
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                {anunciante.nome}
              </h3>

              {/* Cidade */}
              <p className="text-gray-600 flex items-center gap-2 mt-2">
                <MapPin size={16} className="text-pink-500" />
                {anunciante.cidade}
              </p>

              {/* Efeito de Destaque no Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 opacity-0 hover:opacity-20 transition-all duration-300 rounded-xl"></div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Esconde a barra de rolagem */}
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
}
