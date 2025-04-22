"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin } from "phosphor-react";
import axios from "axios";

export default function TopAnunciantes() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const isDragging = useRef(false);

  const [companions, setCompanions] = useState([]);

  const fetchCompanions = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/top5/listar`,
      );
      if (res.data.length === 0) {
        console.log("Nenhum anunciante encontrado.");
        return;
      }
      setCompanions(res.data);
    } catch (error) {
      console.error("Erro ao buscar top 5:", error);
    }
  };

  useEffect(() => {
    fetchCompanions();
  }, []);

  // Rolagem automática
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current && !isDragging.current) {
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });

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

  // Scroll com mouse/touch
  useEffect(() => {
    const slider = scrollRef.current;
    let startX;
    let scrollLeft;

    if (!slider) return;

    const startDragging = (e) => {
      isDragging.current = true;
      startX = e.pageX || e.touches[0].pageX;
      scrollLeft = slider.scrollLeft;
    };

    const stopDragging = () => {
      isDragging.current = false;
    };

    const onDrag = (e) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX || e.touches[0].pageX;
      const walk = (x - startX) * 2;
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
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-5 font-[Poppins]">
        Top 5 Anunciantes do Brasil
      </h2>

      <div className="relative max-w-5xl mx-auto">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 snap-x snap-mandatory px-4 scrollbar-hide cursor-grab active:cursor-grabbing select-none"
        >
          {companions.slice(0, 5).map((anunciante, index) => (
            <motion.div
              key={anunciante.userName}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => router.push(`/perfil/${anunciante.userName}`)}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:border-pink-500 transition-all duration-300 flex flex-col items-center text-center min-w-[250px] sm:min-w-[280px] snap-start"
            >
              <div className="absolute top-2 left-2 bg-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                #{index + 1}
              </div>

              <img
                src={anunciante.profileImage}
                alt={anunciante.userName}
                className="w-20 h-20 rounded-full object-cover mb-4"
              />

              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                {anunciante.userName}
              </h3>

              <p className="text-gray-600 flex items-center gap-2 mt-2">
                <MapPin size={16} className="text-pink-500" />
                {anunciante.city}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {anunciante.plan} — {anunciante.points} pts

              </p>

              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 opacity-0 hover:opacity-20 transition-all duration-300 rounded-xl"></div>
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
}
