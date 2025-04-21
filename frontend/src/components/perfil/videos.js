"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  FaHeart,
  FaComment,
  FaShare,
  FaUpload,
  FaTimes,
  FaPlayCircle,
} from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";
import { usePlan } from "@/context/PlanContext";

export default function Videos({ userName }) {
  // Lista inicial de vídeos com thumbnails e fontes
  const initialVideos = []

  const [videos, setVideos] = useState(initialVideos);
  const [visibleVideos, setVisibleVideos] = useState(4);
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [newVideo, setNewVideo] = useState(null);
  const [companionData, setCompanionData] = useState(null);
  const { companions, fetchCompanions, loading, error } = usePlan();

  useEffect(() => {
    if (userName) {
      fetchCompanions({ planos: true, userName: userName });
    }
  }, [userName, fetchCompanions]);

  const fetchFeedVideos = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/feed-posts?userName=${userName}`
      );

      const data = response.data;
      setVideos(data);

      setCompanionData(companions[0]);
    } catch (error) {
      console.error("Erro ao carregar as fotos do feed", error);
    }
  }, [companions, userName]);

  // Chama a API quando o componente for montado
  useEffect(() => {
    fetchFeedVideos();
  }, [fetchFeedVideos]);

  // Função para curtir um vídeo
  const handleLike = (id) => {
    setVideos(
      videos.map((video) =>
        video.id === id ? { ...video, likes: video.likes + 1 } : video
      )
    );
    if (selectedVideo && selectedVideo.id === id) {
      setSelectedVideo({
        ...selectedVideo,
        likes: selectedVideo.likes + 1,
      });
    }
  };

  // Função para abrir o modal de upload
  const handleUpload = () => {
    setShowUploadModal(true);
  };

  // Função para fechar o modal de upload
  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setNewVideo(null);
    setUploadError("");
  };

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
    setVisibleVideos((prev) => prev + 4);
  };

  // Função para lidar com a mudança no campo de comentário
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // Função para adicionar um comentário
  const addComment = () => {
    if (newComment.trim() && selectedVideo) {
      const updatedVideos = videos.map((video) =>
        video.id === selectedVideo.id
          ? {
            ...video,
            comments: [...video.comments, newComment],
            commentsCount: video.commentsCount + 1,
          }
          : video
      );
      setVideos(updatedVideos);
      setSelectedVideo({
        ...selectedVideo,
        comments: [...selectedVideo.comments, newComment],
        commentsCount: selectedVideo.commentsCount + 1,
      });
      setNewComment("");
    }
  };

  // Função para compartilhar o vídeo via WhatsApp
  const handleShare = () => {
    if (selectedVideo) {
      const whatsappUrl = `https://api.whatsapp.com/send?text=Confira este vídeo: ${window.location.origin}${selectedVideo.src}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  // Função para lidar com a seleção de arquivo para upload
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewVideo(e.target.files[0]);
    }
  };

  // Função para enviar o vídeo
  const handleUploadSubmit = async () => {
    if (!newVideo) {
      setUploadError("Por favor, selecione um vídeo para enviar.");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      // Simulação de upload - substitua com sua lógica de upload real
      const reader = new FileReader();
      reader.onloadend = () => {
        const newVideoData = {
          id: videos.length + 1,
          thumbnail: URL.createObjectURL(newVideo), // Simulação de thumbnail
          src: reader.result, // Em um ambiente real, você usaria a URL retornada do servidor
          likes: 0,
          comments: [],
          commentsCount: 0,
        };
        setVideos([newVideoData, ...videos]);
        handleCloseUploadModal();
        setUploading(false);
      };
      reader.readAsDataURL(newVideo);
    } catch (error) {
      setUploadError("Falha ao fazer upload. Tente novamente.");
      setUploading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-black">Galeria de Vídeos</h2>

      {/* Galeria de vídeos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos
          .filter((video) => video.mediaType === "video")
          .slice(0, visibleVideos)
          .map((video) => (
            <div
              key={video.id}
              className="relative group border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => openModal(video)}
            >
              {video.mediaUrl ? (
                <video
                  src={video.mediaUrl}
                  className="w-full h-auto"
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <div className="bg-gray-300 w-full h-[300px] flex items-center justify-center text-gray-500">
                  Sem thumbnail
                </div>
              )}

              <div className="absolute inset-0 flex justify-center items-center text-white opacity-70">
                <FaPlayCircle className="text-4xl md:text-6xl" />
              </div>
            </div>
          ))}

      </div>

      {showModal && selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-5xl mx-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão de fechar */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white bg-gray-800 bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 focus:outline-none z-50"
            >
              <FaTimes className="text-2xl" />
            </button>

            {/* Player de vídeo centralizado */}
            <div className="flex justify-center items-center">
              <video
                src={selectedVideo.mediaUrl || selectedVideo.src}
                controls
                autoPlay
                className="max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}


      {/* Carregar mais vídeos */}
      <div className="mt-6 flex justify-center">
        {visibleVideos < videos.length && (
          <button
            onClick={loadMoreVideos}
            className="px-6 py-2 bg-pink-500 text-white rounded-full shadow hover:bg-pink-600 transition duration-300 focus:outline-none"
          >
            Carregar mais vídeos
          </button>
        )}
      </div>

      {/* Modal de Upload de Vídeo */}
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
            <h2 className="text-xl text-black font-bold mb-4">Upload de Vídeo</h2>
            {/* Input para seleção de arquivo */}
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full mb-4"
            />
            {/* Mensagem de erro, se houver */}
            {uploadError && (
              <p className="text-red-500 mb-4">{uploadError}</p>
            )}
            {/* Botão para enviar o vídeo */}
            <button
              onClick={handleUploadSubmit}
              disabled={uploading}
              className={`w-full p-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition duration-300 ${uploading ? "opacity-50 cursor-not-allowed" : ""
                } focus:outline-none`}
            >
              {uploading ? "Enviando..." : "Enviar Vídeo"}
            </button>
          </div>
        </div>
      )}

      {/* Seção de validação do anúncio */}
      <div className="mt-8 p-4 md:p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg md:text-xl font-semibold text-black mb-2">
          Este anúncio é <span className="text-green-600">confiável</span>
        </h3>
        <p className="text-sm md:text-base text-gray-600">
          Saiba quais validações este anúncio possui
        </p>

        {/* Barra de progresso de validação */}
        <div className="mt-4">
          <div className="relative w-full bg-gray-300 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: "80%" }}
            ></div>
          </div>
        </div>

        {/* Detalhes das validações */}
        <div className="mt-4 flex flex-col md:flex-row justify-between text-sm text-black">
          <div className="flex flex-col items-center mb-2 md:mb-0">
            <FaHeart className="text-green-600 mb-1" />
            <span className="text-center">Acompanhante verificado</span>
          </div>
          <div className="flex flex-col items-center mb-2 md:mb-0">
            <FaComment className="text-red-600 mb-1" />
            <span className="text-center">Alterou o telefone</span>
          </div>
          <div className="flex flex-col items-center">
            <FaShare className="text-green-600 mb-1" />
            <span className="text-center">Não possui penalidades</span>
          </div>
        </div>
      </div>
    </div>
  );
}
