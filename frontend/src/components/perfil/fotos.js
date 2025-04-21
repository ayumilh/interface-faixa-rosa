"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  FaHeart,
  FaComment,
  FaShare,
  FaUpload,
  FaTimes,
} from "react-icons/fa";
import Reviews from "./reviews";
import Denuncia from "./denuncia";
import Cookies from "js-cookie";
import axios from "axios";
import { usePlan } from "@/context/PlanContext";

export default function Fotos({ userName, createdAtFormatted }) {
  const [photos, setPhotos] = useState([]);
  const [visiblePhotos, setVisiblePhotos] = useState(4);
  const [showModal, setShowModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [newPhoto, setNewPhoto] = useState(null);
  const token = Cookies.get("userToken");
  const [companionData, setCompanionData] = useState(null);
  const { companions, fetchCompanions, loading, error } = usePlan();

  useEffect(() => {
    if (userName) {
      fetchCompanions({ planos: true, userName: userName });
    }
  }, [userName, fetchCompanions]);

  const fetchFeedPhotos = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/feed-posts?userName=${userName}`
      );

      const data = response.data;
      setPhotos(data);

      setCompanionData(companions[0]);
    } catch (error) {
      console.error("Erro ao carregar as fotos do feed", error);
    }
  }, [companions, userName]);

  // Chama a API quando o componente for montado
  useEffect(() => {
    fetchFeedPhotos();
  }, [fetchFeedPhotos]);

  // Função para curtir uma foto
  const handleLike = (id) => {
    setPhotos(
      photos.map((photo) =>
        photo.id === id ? { ...photo, likes: photo.likes + 1 } : photo
      )
    );
    if (selectedPhoto && selectedPhoto.id === id) {
      setSelectedPhoto({ ...selectedPhoto, likes: selectedPhoto.likes + 1 });
    }
  };

  // Função para abrir o modal de upload
  const handleUpload = () => {
    setShowUploadModal(true);
  };

  // Função para fechar o modal de upload
  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setNewPhoto(null);
    setUploadError("");
  };

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
    setVisiblePhotos((prev) => prev + 4);
  };

  // Função para lidar com a mudança no campo de comentário
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // Função para adicionar um comentário
  const addComment = () => {
    if (newComment.trim() && selectedPhoto) {
      const updatedPhotos = photos.map((photo) =>
        photo.id === selectedPhoto.id
          ? {
            ...photo,
            comments: [...photo.comments, newComment],
            commentsCount: photo.commentsCount + 1,
          }
          : photo
      );
      setPhotos(updatedPhotos);
      setSelectedPhoto({
        ...selectedPhoto,
        comments: [...selectedPhoto.comments, newComment],
        commentsCount: selectedPhoto.commentsCount + 1,
      });
      setNewComment("");
    }
  };

  // Função para compartilhar a foto via WhatsApp
  const handleShare = () => {
    if (selectedPhoto) {
      const whatsappUrl = `https://api.whatsapp.com/send?text=Confira esta foto: ${window.location.origin}${selectedPhoto.src}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  // Função para lidar com a seleção de arquivo para upload
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewPhoto(e.target.files[0]);
    }
  };

  // Função para enviar a foto
  const handleUploadSubmit = async () => {
    if (!newPhoto) {
      setUploadError("Por favor, selecione uma foto para enviar.");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      // Simulação de upload - substitua com sua lógica de upload real
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotoData = {
          id: photos.length + 1,
          src: reader.result, // Em um ambiente real, você usaria a URL retornada do servidor
          likes: 0,
          comments: [],
          commentsCount: 0,
        };
        setPhotos([newPhotoData, ...photos]);
        handleCloseUploadModal();
        setUploading(false);
      };
      reader.readAsDataURL(newPhoto);
    } catch (error) {
      setUploadError("Falha ao fazer upload. Tente novamente.");
      setUploading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-black">Galeria de Fotos</h2>

      {/* Galeria de fotos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos
          .filter((photo) => photo.mediaType === "image")
          .slice(0, visiblePhotos)
          .map((photo) => (
            <div
              key={photo.id}
              className="relative group border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => openModal(photo)}
            >
              <Image
                src={photo.mediaUrl}
                alt={`Foto ${photo.id}`}
                layout="responsive"
                width={500}
                height={500}
                className="w-full h-auto"
              />
              {/* Overlay com botões de ação */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition duration-300 flex justify-center items-center">
                <div className="flex space-x-4 text-white opacity-0 group-hover:opacity-100">
                  {/* <button
                    onClick={() => handleLike(photo.id)}
                    className="flex items-center space-x-1 focus:outline-none"
                  >
                    <FaHeart className="text-red-500" />
                    <span>{photo.likes}</span>
                  </button> */}
                  {/* <button className="flex items-center space-x-1 focus:outline-none">
                    <FaComment />
                    <span>{photo.commentsCount}</span>
                  </button> */}
                  {/* <button
                    onClick={handleShare}
                    className="flex items-center space-x-1 focus:outline-none"
                  >
                    <FaShare />
                  </button> */}
                </div>
              </div>
              {/* Ações para dispositivos móveis */}
              <div className="mt-2 flex justify-around text-black md:hidden">
                <button
                  onClick={() => handleLike(photo.id)}
                  className="flex items-center space-x-1 focus:outline-none"
                >
                  <FaHeart className="text-red-500" />
                  <span>{photo.likes}</span>
                </button>
                <button className="flex items-center space-x-1 focus:outline-none">
                  <FaComment />
                  <span>{photo.commentsCount}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-1 focus:outline-none"
                >
                  <FaShare />
                </button>
              </div>
            </div>
          ))}
      </div>

      {showModal && selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative max-w-5xl w-full mx-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão de fechar */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white bg-gray-800 bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 focus:outline-none z-50"
            >
              <FaTimes className="text-2xl" />
            </button>

            {/* Imagem centralizada */}
            <div className="flex justify-center items-center">
              <Image
                src={selectedPhoto.mediaUrl || selectedPhoto.src}
                alt={`Foto ${selectedPhoto.id}`}
                width={900}
                height={900}
                className="max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}


      {/* Carregar mais fotos */}
      <div className="mt-6 flex justify-center">
        {visiblePhotos < photos.length && (
          <button
            onClick={loadMorePhotos}
            className="px-6 py-2 bg-pink-500 text-white rounded-full shadow hover:bg-pink-600 transition duration-300 focus:outline-none"
          >
            Carregar mais fotos
          </button>
        )}
      </div>

      {/* Modal de Upload de Foto */}
      {showUploadModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={handleCloseUploadModal}
        >
          <div
            className="relative w-11/12 max-w-md bg-white rounded-lg shadow-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão de fechar do modal de upload */}
            <button
              onClick={handleCloseUploadModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl focus:outline-none"
            >
              <FaTimes />
            </button>
            {/* Título do modal de upload */}
            <h2 className="text-xl text-black font-bold mb-4">Upload de Foto</h2>
            {/* Input para seleção de arquivo */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full mb-4"
            />
            {/* Mensagem de erro, se houver */}
            {uploadError && (
              <p className="text-red-500 mb-4">{uploadError}</p>
            )}
            {/* Botão para enviar a foto */}
            <button
              onClick={handleUploadSubmit}
              disabled={uploading}
              className={`w-full p-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition duration-300 ${uploading ? "opacity-50 cursor-not-allowed" : ""
                } focus:outline-none`}
            >
              {uploading ? "Enviando..." : "Enviar Foto"}
            </button>
          </div>
        </div>
      )}

      {/* Seção de reviews */}
      {companionData && companionData.subscriptions && (
        <Reviews
          nomeAnunciante={userName}
          companionId={companionData.id}
          showReviews={
            companionData.subscriptions.some(
              (subscription) => subscription.extraPlan.name === "Reviews Públicos" && subscription.extraPlan.isEnabled
            )
          }
        />
      )}



      {/* Seção de denúncia */}
      <Denuncia dataCriacao={createdAtFormatted} />

    </div>
  );
}
