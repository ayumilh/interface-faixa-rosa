"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaUpload,
  FaPlusCircle,
  FaCrown,
  FaClock,
} from "react-icons/fa";

// Constantes de Imagens Padrão
const DEFAULT_PROFILE_IMAGE = "/assets/default-profile.png";
const DEFAULT_COVER_IMAGE = "/assets/default-cover.png";

// Componente Principal
const ProfileSettings = ({ onUpdate }) => {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [coverImage, setCoverImage] = useState(DEFAULT_COVER_IMAGE);
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(25);
  const [isAgeHidden, setIsAgeHidden] = useState(false);

  const activePlans = ["Pink", "Safira", "Rubi"];
  const rankingPosition = 35;
  const planExpirationDate = useMemo(() => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), []);
  const [timeLeft, setTimeLeft] = useState("");
  const [timeProgress, setTimeProgress] = useState(100);

  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);

  // Estados para Modal de Upload
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [uploadType, setUploadType] = useState(""); // "story" ou "post"
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const totalDuration = planExpirationDate - Date.now();

    const updateTimeLeft = () => {
      const now = new Date();
      const diff = planExpirationDate - now;
      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft("Expirado");
        setTimeProgress(0);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);

        const elapsed = totalDuration - diff;
        const progress = Math.max(
          0,
          ((elapsed / totalDuration) * 100).toFixed(2)
        );
        setTimeProgress(progress);
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Atualiza a cada minuto

    return () => clearInterval(interval);
  }, [planExpirationDate]);

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      openModal(file, type);
    }
  };

  const handleStoryUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      openModal(file, "story");
    }
  };

  const handlePostUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      openModal(file, type);
    }
  };

  const openModal = (file, type) => {
    setCurrentFile(file);
    setUploadType(type);
    setCaption("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isUploading) return; // Impede fechar durante o upload
    setIsModalOpen(false);
    setCurrentFile(null);
    setUploadType("");
    setCaption("");
  };

  const handleUpload = () => {
    setIsUploading(true);
    // Simula o upload com um timeout
    setTimeout(() => {
      const imageUrl = URL.createObjectURL(currentFile);
      if (uploadType === "story") {
        setStories((prev) => [...prev, { url: imageUrl, caption }]);
      } else if (uploadType === "post") {
        setPosts((prev) => [...prev, { url: imageUrl, type: "photo", caption }]);
      }
      setIsUploading(false);
      closeModal();
      onUpdate && onUpdate({ [uploadType]: imageUrl, caption });
    }, 2000); // Simula 2 segundos de upload
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
    {/* Cabeçalho do Dashboard */}
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 mb-8 space-y-4 sm:space-y-0">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center">
        Painel de Controle
      </h1>
      
    </header>
  
    {/* Conteúdo Principal */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Bloco 1: Ranking Nacional */}
      <div className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center">
        <h2 className="text-lg font-semibold text-gray-700 text-center">Ranking Nacional</h2>
        <p className="text-4xl sm:text-5xl font-bold text-blue-600 mt-4">#{rankingPosition}</p>
        <span className="text-sm text-gray-500 mt-2 text-center">Sua posição no ranking</span>
      </div>
  
      {/* Bloco 2: Planos Ativos */}
      <div className="p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 text-center">Planos Ativos</h2>
        <ul className="mt-4 space-y-3">
          {activePlans.length > 0 ? (
            activePlans.map((plan, index) => (
              <li
                key={index}
                className="px-4 py-2 bg-blue-50 text-blue-800 font-medium rounded-lg text-sm shadow-sm text-center"
              >
                {plan}
              </li>
            ))
          ) : (
            <li className="text-gray-500 text-sm text-center">Nenhum plano ativo</li>
          )}
        </ul>
      </div>
  
      {/* Bloco 3: Expiração do Plano */}
      <div className="p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 text-center">Expiração do Plano</h2>
        <p className="text-2xl sm:text-3xl font-bold text-red-500 mt-4 text-center">
          {timeLeft || "Indeterminado"}
        </p>
        {timeProgress > 0 && (
          <div className="mt-6">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${timeProgress}%` }}
              ></div>
            </div>
            <span className="block text-sm text-gray-500 mt-2 text-center">
              Progresso do Plano
            </span>
          </div>
        )}
      </div>
    </div>


    
      {/* Cobertura e Imagem de Perfil */}
      <div className="relative mb-12">
        {/* Imagem de Capa */}
        <div className="relative h-40 sm:h-56 w-full rounded-lg overflow-hidden shadow-md">
          <Image
            src={coverImage}
            alt="Capa do Perfil"
            layout="fill"
            objectFit="cover"
            className="transform scale-100 hover:scale-110 transition-transform duration-500"
          />
          <label className="absolute top-2 right-2 bg-white bg-opacity-80 text-pink-500 px-3 py-1 rounded-lg cursor-pointer shadow-md flex items-center text-sm hover:bg-opacity-90 transition">
            <FaUpload className="mr-1" />
            Alterar Capa
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e, "cover")}
              aria-label="Alterar Capa"
            />
          </label>
        </div>
        {/* Imagem de Perfil */}
        <div className="absolute bottom-[-40px] left-4 sm:left-1/2 sm:transform sm:-translate-x-1/2 rounded-full overflow-hidden w-32 h-32 border-4 border-white shadow-lg">
          <Image
            src={profileImage}
            alt="Foto de Perfil"
            layout="fill"
            objectFit="cover"
            className="transform scale-100 hover:scale-105 transition-transform duration-500"
          />
          <label className="absolute bottom-2 right-2 bg-white bg-opacity-80 text-pink-500 p-2 rounded-full cursor-pointer shadow-md hover:bg-opacity-90 transition">
            <FaUpload size={16} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e, "profile")}
              aria-label="Alterar Foto de Perfil"
            />
          </label>
        </div>
      </div>

      {/* Seção de Stories */}
      <div className="mt-16">
        <h3 className="text-2xl font-semibold mb-6">Postar Stories</h3>
        <label className="block bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-700 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition">
          <FaPlusCircle className="mx-auto mb-2 text-4xl" />
          Adicionar Story (duração: 24h)
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleStoryUpload}
            aria-label="Adicionar Story"
          />
        </label>
        {stories.length > 0 && (
          <div className="mt-6 flex space-x-4 overflow-x-auto">
            {stories.map((story, index) => (
              <div
                key={index}
                className="relative w-32 h-56 rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105"
              >
                <Image
                  src={story.url}
                  alt={`Story ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
                {story.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                    {story.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Seção de Posts */}
      <div className="mt-16">
        <h3 className="text-2xl font-semibold mb-6">Postar no Feed</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Adicionar Foto */}
          <label className="block bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-700 cursor-pointer hover:border-pink-500 hover:text-pink-500 transition">
            <FaPlusCircle className="mx-auto mb-2 text-4xl" />
            Adicionar Foto
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handlePostUpload(e, "post")}
              aria-label="Adicionar Foto"
            />
          </label>
          {/* Adicionar Vídeo */}
          <label className="block bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-700 cursor-pointer hover:border-green-500 hover:text-green-500 transition">
            <FaPlusCircle className="mx-auto mb-2 text-4xl" />
            Adicionar Vídeo
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => handlePostUpload(e, "post")}
              aria-label="Adicionar Vídeo"
            />
          </label>
        </div>
        {posts.length > 0 && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <div
                key={index}
                className="w-full h-40 sm:h-48 rounded-lg overflow-hidden shadow-md relative transition-transform transform hover:scale-105"
              >
                {post.type === "photo" ? (
                  <>
                    <Image
                      src={post.url}
                      alt={`Post ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                    {post.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                        {post.caption}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <video
                      src={post.url}
                      controls
                      className="w-full h-full object-cover rounded-lg"
                      aria-label={`Vídeo do post ${index + 1}`}
                    />
                    {post.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                        {post.caption}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Upload */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white rounded-lg p-6 w-11/12 sm:w-96 relative"
            onClick={(e) => e.stopPropagation()} // Impede fechar o modal ao clicar dentro dele
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
              aria-label="Fechar Modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {uploadType === "story" ? "Adicionar Story" : "Adicionar Post"}
            </h2>
            <div className="mb-4">
              {currentFile && currentFile.type.startsWith("image/") ? (
                <Image
                  src={URL.createObjectURL(currentFile)}
                  alt="Pré-visualização"
                  width={300}
                  height={300}
                  objectFit="cover"
                  className="rounded-md"
                />
              ) : currentFile && currentFile.type.startsWith("video/") ? (
                <video
                  src={URL.createObjectURL(currentFile)}
                  controls
                  className="w-full h-48 object-cover rounded-md"
                />
              ) : null}
            </div>
            <div className="mb-4">
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
                Legenda
              </label>
              <input
                type="text"
                id="caption"
                name="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Adicione uma legenda..."
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                disabled={isUploading}
              >
                Cancelar
              </button>
              <button
                onClick={handleUpload}
                className={`px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition flex items-center ${
                  isUploading ? "cursor-not-allowed" : ""
                }`}
                disabled={isUploading}
              >
                {isUploading && (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                )}
                {isUploading ? "Publicando..." : "Publicar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
