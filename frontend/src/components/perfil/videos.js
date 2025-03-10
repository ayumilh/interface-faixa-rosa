"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FaHeart,
  FaComment,
  FaShare,
  FaUpload,
  FaTimes,
  FaPlayCircle,
} from "react-icons/fa";

export default function Videos() {
  // Lista inicial de vídeos com thumbnails e fontes
  const initialVideos = [
    {
      id: 1,
      thumbnail: "/assets/video-thumb1.jpg",
      src: "/assets/video1.mp4",
      likes: 120,
      comments: [],
      commentsCount: 45,
    },
    {
      id: 2,
      thumbnail: "/assets/video-thumb2.jpg",
      src: "/assets/video2.mp4",
      likes: 95,
      comments: [],
      commentsCount: 32,
    },
    {
      id: 3,
      thumbnail: "/assets/video-thumb3.jpg",
      src: "/assets/video3.mp4",
      likes: 150,
      comments: [],
      commentsCount: 67,
    },
    {
      id: 4,
      thumbnail: "/assets/video-thumb4.jpg",
      src: "/assets/video4.mp4",
      likes: 40,
      comments: [],
      commentsCount: 12,
    },
    // Adicione mais vídeos conforme necessário para testar o botão "Carregar mais vídeos"
    {
      id: 5,
      thumbnail: "/assets/video-thumb5.jpg",
      src: "/assets/video5.mp4",
      likes: 85,
      comments: [],
      commentsCount: 29,
    },
    {
      id: 6,
      thumbnail: "/assets/video-thumb6.jpg",
      src: "/assets/video6.mp4",
      likes: 70,
      comments: [],
      commentsCount: 15,
    },
    {
      id: 7,
      thumbnail: "/assets/video-thumb7.jpg",
      src: "/assets/video7.mp4",
      likes: 130,
      comments: [],
      commentsCount: 50,
    },
    {
      id: 8,
      thumbnail: "/assets/video-thumb8.jpg",
      src: "/assets/video8.mp4",
      likes: 90,
      comments: [],
      commentsCount: 20,
    },
    {
      id: 9,
      thumbnail: "/assets/video-thumb9.jpg",
      src: "/assets/video9.mp4",
      likes: 60,
      comments: [],
      commentsCount: 10,
    },
  ];

  const [videos, setVideos] = useState(initialVideos);
  const [visibleVideos, setVisibleVideos] = useState(4);
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [newVideo, setNewVideo] = useState(null);

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
        {videos.slice(0, visibleVideos).map((video) => (
          <div
            key={video.id}
            className="relative group border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300 cursor-pointer"
            onClick={() => openModal(video)}
          >
            <Image
              src={video.thumbnail}
              alt={`Vídeo ${video.id}`}
              layout="responsive"
              width={500}
              height={500}
              className="w-full h-auto"
            />
            {/* Ícone de play no centro do vídeo */}
            <div className="absolute inset-0 flex justify-center items-center text-white opacity-70">
              <FaPlayCircle className="text-4xl md:text-6xl" />
            </div>

            {/* Overlay com botões de ação (visível apenas em hover para desktop) */}
            <div className="hidden md:flex absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition duration-300 justify-center items-center">
              <div className="flex space-x-4 text-white opacity-0 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(video.id);
                  }}
                  className="flex items-center space-x-1 focus:outline-none"
                >
                  <FaHeart className="text-red-500" />
                  <span>{video.likes}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Função para abrir modal de comentários ou similar
                    alert("Função de comentários ainda não implementada.");
                  }}
                  className="flex items-center space-x-1 focus:outline-none"
                >
                  <FaComment />
                  <span>{video.commentsCount}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                  className="flex items-center space-x-1 focus:outline-none"
                >
                  <FaShare />
                </button>
              </div>
            </div>

            {/* Ações para dispositivos móveis */}
            <div className="flex md:hidden justify-between items-center p-2 text-black">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(video.id);
                }}
                className="flex items-center space-x-1 focus:outline-none"
              >
                <FaHeart className="text-red-500" />
                <span>{video.likes}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Função para abrir modal de comentários ou similar
                  alert("Função de comentários ainda não implementada.");
                }}
                className="flex items-center space-x-1 focus:outline-none"
              >
                <FaComment />
                <span>{video.commentsCount}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
                className="flex items-center space-x-1 focus:outline-none"
              >
                <FaShare />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de visualização de vídeo */}
      {showModal && selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden md:flex"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão de fechar maior e mais visível */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 focus:outline-none"
            >
              <FaTimes className="text-2xl" />
            </button>

            {/* Player de vídeo */}
            <div className="w-full md:w-2/3 flex items-center justify-center bg-black">
              <video
                src={selectedVideo.src}
                controls
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            </div>

            {/* Informações e interações do vídeo */}
            <div className="w-full md:w-1/3 p-4 md:p-6 flex flex-col">
              {/* Informações do usuário ou do vídeo */}
              <div className="flex items-center mb-4">
                <Image
                  src="/assets/mulher.png"
                  alt="Perfil"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="ml-3">
                  <h3 className="text-black font-bold">Melissa Nascimento</h3>
                  <p className="text-gray-500 text-sm">Moema, São Paulo - SP</p>
                </div>
              </div>
              {/* Curtidas e data de postagem */}
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">{selectedVideo.likes} curtidas</span> • Postado há 1 ano
              </p>
              {/* Legenda do vídeo */}
              <p className="text-gray-600">Confira este vídeo incrível!</p>

              {/* Botões de interação */}
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleLike(selectedVideo.id)}
                  className="flex items-center space-x-1 text-pink-500 focus:outline-none"
                >
                  <FaHeart />
                  <span>{selectedVideo.likes}</span>
                </button>
                <button
                  onClick={() => {
                    // Função para abrir modal de comentários ou similar
                    alert("Função de comentários ainda não implementada.");
                  }}
                  className="flex items-center space-x-1 text-gray-600 focus:outline-none"
                >
                  <FaComment />
                  <span>{selectedVideo.commentsCount}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-1 text-gray-600 focus:outline-none"
                >
                  <FaShare />
                </button>
              </div>

              {/* Campo para adicionar comentário */}
              <div className="mt-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={handleCommentChange}
                  placeholder="Escreva um comentário..."
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none"
                />
                <button
                  onClick={addComment}
                  className="w-full mt-2 p-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition duration-300 focus:outline-none"
                >
                  Comentar
                </button>
              </div>

              {/* Lista de comentários */}
              <div className="mt-4 max-h-32 overflow-y-auto">
                {selectedVideo.comments.map((comment, index) => (
                  <p
                    key={index}
                    className="text-gray-700 text-sm mt-2 border-b border-gray-200 pb-2"
                  >
                    {comment}
                  </p>
                ))}
              </div>
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
              className={`w-full p-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition duration-300 ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
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
