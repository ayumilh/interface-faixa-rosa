import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function VideoSection() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Função para alternar entre play e pause
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.muted = false; // Ativar som
      video.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Erro ao tentar reproduzir o vídeo:", error);
        });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Eventos para sincronizar o estado com o vídeo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="flex flex-col items-center py-12 bg-gray-50 -mt-10 md:-mt-16 lg:-mt-72">
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-6 text-gray-800">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#000000] via-[#000000] to-[#000000]">
          A
        </span>{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff007f] via-[#ff33aa] to-[#8000ff]">
          Nova Era
        </span>{" "}
        em{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#000000] via-[#000000] to-[#000000]">
          anúncios
        </span>{" "}
        no{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00ff00] to-[#ffcd2c] font-extrabold">
          Brasil!
        </span>
      </h2>
      <div
        className="w-full max-w-lg aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-lg relative cursor-pointer"
        onClick={togglePlayPause}
      >
        {/* Elemento de Vídeo */}
        <video
          ref={videoRef}
          src="/vd-faixarosa-01.mp4" // Caminho para o vídeo na pasta public
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          Seu navegador não suporta o elemento de vídeo.
        </video>

        {/* Sobreposição (Overlay) */}
        {!isPlaying && (
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-[rgba(0,0,0,0.6)] transition-opacity duration-300">
            {/* Ícone de Play Rosa */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-pink-500 mb-4 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="rgba(255, 192, 203, 0.5)" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 8v8l6-4z" />
            </svg>
            {/* Texto Chamativo */}
            <span className="text-white text-lg font-semibold">Clique para ouvir</span>
          </div>
        )}
      </div>

      

      {/* Estilos para a animação do ícone de Play */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}
