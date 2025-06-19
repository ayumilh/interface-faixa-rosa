"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  FaTimes,
  FaExpand,
  FaImages,
  FaCamera,
  FaPlus,
  FaPlay
} from "react-icons/fa";
import { HiPhotograph, HiCollection } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import Reviews from "./reviews";
import Denuncia from "./denuncia";
import axios from "axios";
import { usePlan } from "@/context/PlanContext";

export default function Fotos({ userName, createdAtFormatted, denunciado }) {
  const [photos, setPhotos] = useState([]);
  const [visiblePhotos, setVisiblePhotos] = useState(12);
  const [showModal, setShowModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companionData, setCompanionData] = useState(null);
  const { companions, fetchCompanions, error } = usePlan();

  useEffect(() => {
    if (userName) {
      fetchCompanions({ planos: true, userName: userName });
    }
  }, [userName, fetchCompanions]);

  const fetchFeedPhotos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/feed-posts?userName=${userName}`
      );

      const data = response.data;
      setPhotos(data);
      setCompanionData(companions[0]);
    } catch (error) {
      console.error("Erro ao carregar as fotos do feed", error);
    } finally {
      setLoading(false);
    }
  }, [companions, userName]);

  useEffect(() => {
    fetchFeedPhotos();
  }, [fetchFeedPhotos]);

  // Função para abrir o modal da foto selecionada
  const openModal = (photo) => {
    setSelectedPhoto(photo);
    setShowModal(true);
  };

  // Função para fechar o modal da foto
  const closeModal = () => {
    setShowModal(false);
    setSelectedPhoto(null);
  };

  // Função para carregar mais fotos
  const loadMorePhotos = () => {
    setVisiblePhotos((prev) => prev + 12);
  };

  const filteredPhotos = photos.filter((photo) => photo.mediaType === "image");

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 flex items-center justify-center">
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
          <div className="flex items-center justify-center space-x-2 text-gray-600 font-medium text-sm sm:text-base">
            <HiPhotograph className="text-pink-500 animate-pulse" />
            <span>Carregando galeria...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-8">
        {/* Header */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-3 mr-4">
                <HiCollection className="text-white text-2xl sm:text-3xl" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Galeria de Fotos
              </h1>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600 text-sm sm:text-base">
              <HiPhotograph className="text-pink-500" />
              <span>
                {filteredPhotos.length > 0 
                  ? `${filteredPhotos.length} foto${filteredPhotos.length > 1 ? 's' : ''} disponível${filteredPhotos.length > 1 ? 'eis' : ''}`
                  : 'Nenhuma foto disponível'
                }
              </span>
            </div>
          </div>
        </motion.div>

        {/* Galeria de fotos - Formato Reels */}
        {filteredPhotos.length > 0 ? (
          <motion.div
            className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
              {filteredPhotos
                .slice(0, visiblePhotos)
                .map((photo, index) => (
                <motion.div
                  key={photo.id}
                  className="relative group border border-gray-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white/80 backdrop-blur-sm"
                  onClick={() => openModal(photo)}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -4, scale: 1.02, rotateY: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Container em formato reels 9:16 */}
                  <div className="relative w-full aspect-[9/16]">
                    <Image
                      src={photo.mediaUrl}
                      alt={`Foto ${photo.id}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
                    />

                    {/* Gradiente sutil no topo */}
                    <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/20 to-transparent" />

                    {/* Gradiente sutil na base */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

                    {/* Marca d'água fixa */}
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center space-x-1 text-xs text-white transition-all duration-300 group-hover:bg-black/80">
                      <Image
                        src="/iconOficial_faixaRosa.png"
                        alt="Logo"
                        width={12}
                        height={12}
                        className="object-contain w-3 h-3"
                      />
                      <span className="text-xs font-medium">faixarosa.com</span>
                    </div>

                    {/* Overlay hover para desktop */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-black/30 opacity-0 group-hover:opacity-100 transition-all duration-500 hidden sm:flex items-center justify-center">
                      <motion.button 
                        className="bg-white/95 backdrop-blur-sm rounded-full p-4 hover:bg-white transition-all duration-300 shadow-2xl"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaExpand className="text-gray-800 text-lg" />
                      </motion.button>
                    </div>

                    {/* Indicador de foto para mobile */}
                    <div className="absolute top-3 left-3 sm:hidden">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                        <HiPhotograph className="text-pink-500 text-sm" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Carregar mais fotos */}
            {visiblePhotos < filteredPhotos.length && (
              <motion.div
                className="flex justify-center mt-8 sm:mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  onClick={loadMorePhotos}
                  className="bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-3 text-sm sm:text-base shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlus className="text-lg" />
                  <span>Ver mais fotos</span>
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* Estado vazio */
          <motion.div
            className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-xl border border-white/20 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="max-w-md mx-auto">
              <motion.div 
                className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaCamera className="text-3xl sm:text-4xl text-pink-500" />
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Nenhuma foto disponível</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                A galeria ainda não possui fotos para exibir.
              </p>
            </div>
          </motion.div>
        )}

        {/* Modal de visualização da foto */}
        <AnimatePresence>
          {showModal && selectedPhoto && (
            <motion.div
              className="fixed inset-0 bg-black/98 backdrop-blur-md flex items-center justify-center z-50 p-4"
              onClick={closeModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative max-w-2xl w-full mx-auto"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
              >
                {/* Botão de fechar */}
                <motion.button
                  onClick={closeModal}
                  className="absolute -top-12 right-0 text-white bg-black/60 backdrop-blur-md hover:bg-black/80 rounded-full p-3 z-10 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes className="text-xl" />
                </motion.button>

                {/* Imagem centralizada - Formato reels no modal */}
                <div className="flex justify-center items-center">
                  <div className="relative w-full max-w-sm sm:max-w-md">
                    <div className="relative aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl">
                      <Image
                        src={selectedPhoto.mediaUrl || selectedPhoto.src}
                        alt={`Foto ${selectedPhoto.id}`}
                        fill
                        className="object-cover"
                        priority
                      />

                      {/* Marca d'água fixa no modal */}
                      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl flex items-center space-x-2 text-white shadow-2xl">
                        <Image
                          src="/iconOficial_faixaRosa.png"
                          alt="Logo"
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                        <span className="text-sm font-semibold">faixarosa.com</span>
                      </div>
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
          <Denuncia dataCriacao={createdAtFormatted} denunciadoId={denunciado}  />
        </motion.div>
      </div>
    </div>
  );
}