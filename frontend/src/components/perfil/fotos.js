"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  FaTimes,
  FaExpand,
  FaImages,
  FaCamera,
  FaPlus
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Reviews from "./reviews";
import Denuncia from "./denuncia";
import axios from "axios";
import { usePlan } from "@/context/PlanContext";

export default function Fotos({ userName, createdAtFormatted }) {
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
          <p className="text-gray-600 font-medium text-sm sm:text-base">Carregando galeria...</p>
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
              <FaImages className="text-pink-500 mr-3" />
              Galeria de Fotos
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {filteredPhotos.length > 0 
                ? `📸 ${filteredPhotos.length} foto${filteredPhotos.length > 1 ? 's' : ''} disponível${filteredPhotos.length > 1 ? 'eis' : ''}`
                : 'Nenhuma foto disponível'
              }
            </p>
          </div>
        </motion.div>

        {/* Galeria de fotos */}
        {filteredPhotos.length > 0 ? (
          <motion.div
            className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
              {filteredPhotos
                .slice(0, visiblePhotos)
                .map((photo, index) => (
                <motion.div
                  key={photo.id}
                  className="relative group border border-gray-100 rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer bg-white"
                  onClick={() => openModal(photo)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative w-full aspect-square">
                    <Image
                      src={photo.mediaUrl}
                      alt={`Foto ${photo.id}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    />

                    {/* Marca d'água fixa */}
                    <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded flex items-center space-x-1 text-xs text-white">
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
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden sm:flex items-center justify-center">
                      <button className="bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors shadow-lg">
                        <FaExpand className="text-gray-800 text-lg" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Carregar mais fotos */}
            {visiblePhotos < filteredPhotos.length && (
              <motion.div
                className="flex justify-center mt-6 sm:mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={loadMorePhotos}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2 text-sm sm:text-base shadow-lg hover:shadow-xl"
                >
                  <FaPlus />
                  <span>Ver mais fotos</span>
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
                <FaCamera className="text-2xl sm:text-3xl text-pink-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Nenhuma foto disponível</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                A galeria ainda não possui fotos para exibir.
              </p>
            </div>
          </motion.div>
        )}

        {/* Modal de visualização da foto */}
        <AnimatePresence>
          {showModal && selectedPhoto && (
            <motion.div
              className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={closeModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative max-w-6xl w-full mx-auto"
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

                {/* Imagem centralizada */}
                <div className="flex justify-center items-center">
                  <div className="relative max-w-full max-h-[90vh]">
                    <Image
                      src={selectedPhoto.mediaUrl || selectedPhoto.src}
                      alt={`Foto ${selectedPhoto.id}`}
                      width={1200}
                      height={1200}
                      className="max-h-[90vh] w-auto h-auto object-contain rounded-2xl shadow-2xl"
                    />

                    {/* Marca d'água fixa no modal */}
                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2 text-white">
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