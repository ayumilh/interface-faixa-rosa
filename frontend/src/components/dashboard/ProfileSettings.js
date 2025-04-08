"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { FaUpload, FaPlusCircle, FaCrown, FaClock, FaUserCircle, FaImage, FaIdCard } from "react-icons/fa";
import ActivePlans from "./ActivePlans";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileSettings = ({ onUpdate }) => {
  const [documentFront, setDocumentFront] = useState(null);
  const [documentBack, setDocumentBack] = useState(null);
  const [documentFileFront, setDocumentFileFront] = useState(null);
  const [documentFileBack, setDocumentFileBack] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [isReadyToSend, setIsReadyToSend] = useState(false);

  const rankingPosition = 35;
  const planExpirationDate = useMemo(() => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), []);
  const [timeLeft, setTimeLeft] = useState("");
  const [timeProgress, setTimeProgress] = useState(100);

  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);

  // Estados para Modal de Upload
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [uploadType, setUploadType] = useState("");
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [documentsValidated, setDocumentsValidated] = useState(false);
  const [startDate, setStartDate] = useState(null); // Data de início do plano

  const [carouselImages, setCarouselImages] = useState([]);
  // Exemplo: defina o plano do usuário. Em uma implementação real, isso viria da API ou do contexto do usuário.
  const planType = "rubi"; // "rubi", "safira", "pink" ou "vip"
  const allowedCarouselImages =
    planType === "rubi" ? 5 : planType === "safira" ? 3 : 1;

  useEffect(() => {
    // Simula o carregamento inicial da página
    setTimeout(() => {
      setLoading(false); // Define como "false" quando a página terminar de carregar
    }, 200); // Simulando 2 segundos de carregamento
  }, []);

  // useEffect(() => {
  //   const totalDuration = planExpirationDate - Date.now();

  //   const updateTimeLeft = () => {
  //     const now = new Date();
  //     const diff = planExpirationDate - now;
  //     if (diff <= 0) {
  //       clearInterval(interval);
  //       setTimeLeft("Expirado");
  //       setTimeProgress(0);
  //     } else {
  //       const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  //       const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  //       const minutes = Math.floor((diff / 1000 / 60) % 60);
  //       setTimeLeft(`${days}d ${hours}h ${minutes}m`);

  //       const elapsed = totalDuration - diff;
  //       const progress = Math.max(
  //         0,
  //         ((elapsed / totalDuration) * 100).toFixed(2)
  //       );
  //       setTimeProgress(progress);
  //     }
  //   };

  //   updateTimeLeft();
  //   const interval = setInterval(updateTimeLeft, 60000); // Atualiza a cada minuto

  //   return () => clearInterval(interval);
  // }, [planExpirationDate]);

  useEffect(() => {
    if (startDate) {
      const totalDuration = 30 * 24 * 60 * 60 * 1000; // 30 dias em milissegundos
      const updateTimeLeft = () => {
        const now = new Date();
        const diff = startDate.getTime() + totalDuration - now.getTime();
        if (diff <= 0) {
          setTimeLeft("Expirado");
          setTimeProgress(0);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / 1000 / 60) % 60);
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);

          const elapsed = totalDuration - diff;
          const progress = Math.max(0, ((elapsed / totalDuration) * 100).toFixed(2));
          setTimeProgress(progress);
        }
      };

      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 60000); // Atualiza a cada minuto

      return () => clearInterval(interval);
    }
  }, [startDate]);


  useEffect(() => {
    if (documentFront && documentBack) {
      setIsReadyToSend(true);
    }
  }, [documentFront, documentBack]);

  // Chama a API para obter as imagens
  useEffect(() => {
    const fetchMedia = async () => {
      const userToken = Cookies.get("userToken");
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/profile-banner/`,
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );

        if (response.status === 200) {
          const { profileImage, bannerImage, documentsValidated } = response.data.media;

          // Atribuindo as variáveis de estado
          setProfileImage(profileImage);
          setBannerImage(bannerImage);
          setDocumentsValidated(documentsValidated);
          console.log("Date:", response.data);
          setStartDate(new Date(response.data.media.startDate)); // Data de início do plano
        }
      } catch (error) {
        console.error('Erro ao buscar mídia do acompanhante:', error);
      }
    };

    fetchMedia();
  }, []);

  const handleFileUpload = (e, side) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    if (side === "front") {
      setDocumentFront(imageUrl);
      setDocumentFileFront(file);
    } else {
      setDocumentBack(imageUrl);
      setDocumentFileBack(file);
    }
  };

  const handleSendDocuments = async () => {
    if (!documentFront || !documentBack) return alert("Por favor, insira ambos os documentos.");

    setUploading(true);
    try {
      const token = Cookies.get("userToken");
      const formData = new FormData();

      formData.append("fileFront", documentFileFront);  // Aqui enviamos o arquivo real, não a URL
      formData.append("fileBack", documentFileBack);    // Aqui enviamos o arquivo real, não a URL

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/documents/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploading(false);
      if (response.status === 201) {
        toast.success(response.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else if (response.status === 200) {
        toast.success(response.data.message);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error("Erro ao enviar documentos.");
      }
    } catch (error) {
      setUploading(false);
      alert("Erro ao conectar ao servidor." + error.message);
    }
  };

  const handleImageChange = async (e, type) => {
    const userToken = Cookies.get("userToken");

    const formData = new FormData();
    const file = e.target.files[0];

    if (!file) return; // Se não houver arquivo, não faz nada

    formData.append(type === "profile" ? "profileImage" : "bannerImage", file);

    try {
      // Enviar a imagem para o backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/profile-banner/update`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userToken}`
          },
        }
      );

      // Atualizar a URL da imagem após o sucesso
      if (response.status === 200) {
        if (type === "profile") {
          setProfileImage(response.data.companion.profileImage); // Atualiza o estado com a nova imagem
          toast.success("Imagem de perfil atualizada com sucesso!");
        } else {
          setBannerImage(response.data.companion.bannerImage); // Atualiza o estado com a nova imagem
          toast.success("Imagem de capa atualizada com sucesso!");
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar a imagem:', error);
      toast.error('Erro ao atualizar a imagem.');
    }
  }

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

  const handleCarouselImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (carouselImages.length >= allowedCarouselImages) {
      toast.error(`Limite de ${allowedCarouselImages} imagens atingido para o seu plano.`);
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    setCarouselImages([...carouselImages, imageUrl]);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      {/* Cabeçalho do Dashboard */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center">
          Painel de Controle
        </h1>
      </header>

      {/* Carregamento com ícone de fogo */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center z-50">
          <Image
            src="/iconOficial_faixaRosa.png"
            alt="Ícone oficial Faixa Rosa"
            width={50}
            height={50}
            className="animate-pulse w-auto h-auto"
          />
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Bloco 1: Ranking Nacional */}
        <div className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 text-center">Ranking Nacional</h2>
          <p className="text-4xl sm:text-5xl font-bold text-blue-600 mt-4">#{rankingPosition}</p>
          <span className="text-sm text-gray-500 mt-2 text-center">Sua posição no ranking</span>
        </div>

        {/* Bloco 2: Planos Ativos */}
        <ActivePlans />

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
              <span className="block text-sm text-gray-500 mt-2 text-center">Progresso do Plano</span>
            </div>
          )}
        </div>
      </div>

      {/* Cobertura e Imagem de Perfil */}
      <div className="relative mb-12">
        {/* Imagem de Capa */}
        <div className="bg-white mt-8 relative h-40 sm:h-56 w-full rounded-lg overflow-hidden shadow-md">
          {bannerImage ? (
            <Image
              src={bannerImage}
              alt="Capa do Perfil"
              width={1920}
              height={640}
              className="object-cover transform scale-100 hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <FaImage className="text-gray-400 text-6xl" />
          )}
          <label className="absolute top-2 right-2 bg-white bg-opacity-80 text-pink-500 px-3 py-1 rounded-lg cursor-pointer shadow-md flex items-center text-sm hover:bg-opacity-90 transition">
            <FaUpload className="mr-1" />
            Alterar Capa
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e, "banner")}
              aria-label="Alterar Capa"
            />
          </label>
        </div>

        {/* Imagem de Perfil */}
        <div className="absolute bottom-[-40px] left-4 sm:left-1/2 sm:transform sm:-translate-x-1/2 rounded-full overflow-hidden w-32 h-32 border-4 border-white shadow-lg">
          {profileImage ? (
            <Image
              src={profileImage}
              alt="Foto de Perfil"
              width={128}
              height={128}
              objectFit="cover"
              className="object-cover transform scale-100 hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <FaUserCircle className="text-gray-400 text-6xl" />
          )}
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


      {/* Seção de Upload de Documento */}
      <div className="mt-16">
        <h3 className="text-2xl font-semibold mb-6">Verificação de Identidade</h3>

        {/* Exibe mensagem conforme o status de 'documentsValidated' */}
        {documentsValidated === 'APPROVED' ? (
          <p className="text-green-500 mb-4 text-center text-lg sm:text-left">
            Documentos enviados e aprovados
          </p>
        ) : documentsValidated === 'IN_ANALYSIS' ? (
          <p className="text-yellow-500 mb-4 text-center text-lg sm:text-left">
            Documento em análise
          </p>
        ) : documentsValidated === 'PENDING' ? (
          <p className="text-gray-600 mb-4 text-center sm:text-left">
            Faça o upload do seu RG (Frente e Verso) para verificação
          </p>
        ) : documentsValidated === 'REJECTED' ? (
          <p className="text-red-500 mb-4 text-center sm:text-left">
            Documentos reprovados.
          </p>
        ) : null}

        {/* Se os documentos estão PENDING ou IN_ANALYSIS, exibe os inputs para upload */}
        {documentsValidated !== 'APPROVED' && documentsValidated !== 'IN_ANALYSIS' && documentsValidated !== 'REJECTED' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 justify-center">
            {/* Upload da Frente */}
            <label className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-3 text-center text-gray-700 cursor-pointer hover:border-pink-500 hover:text-pink-500 transition relative flex flex-col items-center justify-center w-full max-w-[200px] h-auto sm:max-w-[250px] sm:h-[320px] mx-auto">
              {documentFront ? (
                <Image
                  src={documentFront} // Exibe a URL do documento frente
                  alt="Documento Frente"
                  width={200}
                  height={200}
                  className="w-full h-auto object-contain rounded-md"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <FaIdCard className="text-4xl text-gray-400 mb-2" />
                  <span className="text-sm">{documentFront ? "Alterar Frente" : "Enviar Frente"}</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "front")}
                aria-label="Upload Frente do RG"
              />
            </label>

            {/* Upload do Verso */}
            <label className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-3 text-center text-gray-700 cursor-pointer hover:border-pink-500 hover:text-pink-500 transition relative flex flex-col items-center justify-center w-full max-w-[200px] h-auto sm:max-w-[250px] sm:h-[320px] mx-auto">
              {documentBack ? (
                <Image
                  src={documentBack} // Exibe a URL do documento verso
                  alt="Documento Verso"
                  width={200}
                  height={200}
                  className="w-full h-auto object-contain rounded-md"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <FaIdCard className="text-4xl text-gray-400 mb-2" />
                  <span className="text-sm">{documentBack ? "Alterar Verso" : "Enviar Verso"}</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "back")}
                aria-label="Upload Verso do RG"
              />
            </label>
          </div>
        )}

        {/* Exibe o botão para enviar os documentos, se os dois documentos forem fornecidos */}
        {documentFront && documentBack && documentsValidated !== 'APPROVED' && (
          <div className="text-center mt-6">
            <button
              className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition"
              onClick={handleSendDocuments}
            >
              Enviar Documentos
            </button>
          </div>
        )}
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

      {/* Carrossel do Card de Anúncio */}
      <div className="mt-16">
        <h3 className="text-2xl font-semibold mb-6">Carrossel do Card de Anúncio</h3>
        <p className="text-sm text-gray-500 mb-4">
          Você pode adicionar até {allowedCarouselImages} imagem
          {allowedCarouselImages > 1 ? "ns" : ""} de acordo com seu plano.
        </p>
        <label className="block bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-700 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition">
          <FaPlusCircle className="mx-auto mb-2 text-4xl" />
          Adicionar Imagem
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCarouselImageUpload}
            aria-label="Adicionar imagem para o carrossel"
          />
        </label>
        {carouselImages.length > 0 && (
          <div className="mt-6 flex space-x-4 overflow-x-auto">
            {carouselImages.map((img, index) => (
              <div
                key={index}
                className="relative w-32 h-32 rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105"
              >
                <Image
                  src={img}
                  alt={`Imagem do carrossel ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
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
                className={`px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition flex items-center ${isUploading ? "cursor-not-allowed" : ""
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
