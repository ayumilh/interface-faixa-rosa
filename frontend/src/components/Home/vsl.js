"use client";

import { useEffect, useRef, useState } from "react";
import { PlayCircle } from "phosphor-react";

export default function VideoSection() {
  const videoRef = useRef(null); // ✅ corrigido

  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.muted = false;
      video.play()
        .then(() => setIsPlaying(true))
        .catch((error) =>
          console.error("Erro ao tentar reproduzir o vídeo:", error)
        );
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

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
    <div className="flex flex-col items-center py-12 px-4 bg-[#FFFFFF] -mt-6">
      <h2 className="text-center font-[Poppins] text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
        A{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-black via-black to-black">
          Nova Era
        </span>{" "}
        da{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
          Publicidade Digital
        </span>{" "}
        chegou ao Brasil!
      </h2>

      <div
        className="w-full max-w-md sm:max-w-lg md:max-w-xl aspect-video bg-gray-300 rounded-xl overflow-hidden shadow-xl relative cursor-pointer"
        onClick={togglePlayPause}
      >
        <video
          ref={videoRef}
          src="/vd-faixarosa-01.mp4"
          poster="/thumb-vd-faixarosa.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        >
          Seu navegador não suporta o elemento de vídeo.
        </video>

        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(0,0,0,0.6)] transition-opacity duration-300">
            <PlayCircle
              size={70}
              weight="fill"
              className="text-pink-500 play-glow drop-shadow-md"
            />
            <span className="text-white text-lg font-semibold mt-2 font-[Inter]">
              Clique para assistir
            </span>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulseGlow {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        .play-glow {
          animation: pulseGlow 1.8s infinite;
        }
      `}</style>
    </div>
  );
}
