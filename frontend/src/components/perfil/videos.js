"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  FaTimes,
  FaPlayCircle,
  FaVideo,
  FaPlus,
  FaExpand
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Reviews from "./reviews";
import Denuncia from "./denuncia";
import axios from "axios";
import { usePlan } from "@/context/PlanContext";

// Componente simplificado para thumbnail de vídeo
const VideoThumbnail = ({ videoUrl, className, onThumbnailClick }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleVideoLoad = (e) => {
    // Define o tempo para 0.5 segundos para pegar um frame melhor
    e.target.currentTime = 0.5;
    setVideoLoaded(true);
  };

  return (
    <div className={`${className} relative overflow-hidden`}>
      <video
        src={videoUrl}
        className="w-full h-full object-cover"
        muted
        playsInline
        preload="metadata"
        onLoadedData={handleVideoLoad}
        onTimeUpdate={(e) => {
          // Pausa o vídeo após carregar o frame
          if (videoLoaded && e.target.currentTime >= 0.5) {
            e.target.pause();
          }
        }}
      />
      
      {/* Overlay clicável */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={onThumbnailClick}
      />
    </div>
  );
};

export default function Videos({ userName, createdAtFormatted }) {
  const [videos, setVideos] = useState([]);
  const [visibleVideos, setVisibleVideos] = useState(12);
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companionData, setCompanionData] = useState(null);
  const { companions, fetchCompanions } = usePlan();

  useEffect(() => {
    if (userName) {
      fetchCompanions({ planos: true, userName: userName });
    }
  }, [userName, fetchCompanions]);

  const fetchFeedVideos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/feed-posts?userName=${userName}`
      );

      const data = response.data;
      setVideos(data);
      setCompanionData(companions[0]);
    } catch (error) {
      console.error("Erro ao carregar os vídeos do feed", error);
    } finally {
      setLoading(false);
    }
  }, [companions, userName]);

  useEffect(() => {
    fetchFeedVideos();
  }, [fetchFeedVideos]);

  // Função para abrir o modal do vídeo selecionado
  const openModal = (video) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  // Função para fechar o modal do vídeo
  const closeModal = () => {
    setShowModal(false);
    setSelectedVideo(null);
  };

  // Função para carregar mais vídeos
  const loadMoreVideos = () => {
    setVisibleVideos((prev) => prev + 12);
  };

  const filteredVideos = videos.filter((video) => video.mediaType === "video");

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
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
          <p className="text-gray-600 font-medium text-sm sm:text-base">Carregando vídeos...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-8">
        {/* Header */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center justify-center">
              <FaVideo className="text-pink-500 mr-3" />
              Galeria de Vídeos
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {filteredVideos.length > 0 
                ? `🎥 ${filteredVideos.length} vídeo${filteredVideos.length > 1 ? 's' : ''} disponível${filteredVideos.length > 1 ? 'eis' : ''}`
                : 'Nenhum vídeo disponível'
              }
            </p>
          </div>
        </motion.div>

        {/* Galeria de vídeos */}
        {filteredVideos.length > 0 ? (
          <motion.div
            className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
              {filteredVideos
                .slice(0, visibleVideos)
                .map((video, index) => (
                <motion.div
                  key={video.id}
                  className="relative group border border-gray-100 rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-white"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative w-full aspect-[9/16]">
                    {video.mediaUrl ? (
                      <VideoThumbnail
                        videoUrl={video.mediaUrl}
                        className="w-full h-full"
                        onThumbnailClick={() => openModal(video)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center cursor-pointer" onClick={() => openModal(video)}>
                        <FaVideo className="text-4xl text-gray-400" />
                      </div>
                    )}

                    {/* Marca d'água fixa */}
                    <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded flex items-center space-x-1 text-xs text-white pointer-events-none">
                      <Image
                        src="/iconOficial_faixaRosa.png"
                        alt="Logo"
                        width={12}
                        height={12}
                        className="object-contain w-3 h-3"
                      />
                      <span className="text-xs font-medium">faixarosa.com</span>
                    </div>

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-black/50 backdrop-blur-sm rounded-full p-3 sm:p-4 group-hover:bg-black/70 transition-all duration-300">
                        <FaPlayCircle className="text-white text-3xl sm:text-4xl" />
                      </div>
                    </div>

                    {/* Overlay hover para desktop */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden sm:flex items-end justify-end p-3 pointer-events-none">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                        <FaExpand className="text-gray-800 text-sm" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Carregar mais vídeos */}
            {visibleVideos < filteredVideos.length && (
              <motion.div
                className="flex justify-center mt-6 sm:mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={loadMoreVideos}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2 text-sm sm:text-base shadow-lg hover:shadow-xl"
                >
                  <FaPlus />
                  <span>Ver mais vídeos</span>
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* Estado vazio */
          <motion.div
            className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-lg mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaVideo className="text-2xl sm:text-3xl text-pink-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Nenhum vídeo disponível</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                A galeria ainda não possui vídeos para exibir.
              </p>
            </div>
          </motion.div>
        )}

        {/* Modal de reprodução do vídeo */}
        <AnimatePresence>
          {showModal && selectedVideo && (
            <motion.div
              className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={closeModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative w-full max-w-6xl mx-auto"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Botão de fechar */}
                <motion.button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-white bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full p-3 z-10 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes className="text-xl" />
                </motion.button>

                {/* Player de vídeo centralizado */}
                <div className="flex justify-center items-center">
                  <div className="relative max-w-full max-h-[90vh]">
                    <video
                      src={selectedVideo.mediaUrl || selectedVideo.src}
                      controls
                      autoPlay
                      className="max-h-[90vh] w-auto h-auto object-contain rounded-2xl shadow-2xl"
                      playsInline
                    />

                    {/* Marca d'água fixa no modal */}
                    <div className="absolute bottom-16 right-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2 text-white pointer-events-none">
                      <Image
                        src="/iconOficial_faixaRosa.png"
                        alt="Logo"
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                      <span className="text-lg font-semibold">www.faixarosa.com</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Seção de reviews */}
        {companionData && companionData.subscriptions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Reviews
              nomeAnunciante={userName}
              companionId={companionData.id}
              showReviews={
                companionData.subscriptions.some(
                  (subscription) => subscription.extraPlan.name === "Reviews Públicos" && subscription.extraPlan.isEnabled
                )
              }
            />
          </motion.div>
        )}

        {/* Seção de denúncia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Denuncia dataCriacao={createdAtFormatted} />
        </motion.div>
      </div>
    </div>
  );
}