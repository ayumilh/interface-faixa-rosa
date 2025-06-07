"use client";

import React, { useState, useEffect, useMemo, useCallback, useContext, useRef } from "react";
import Image from "next/image";
import { AuthContext } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUpload,
  FaPlusCircle,
  FaTrash,
  FaCrown,
  FaClock,
  FaUserCircle,
  FaImage,
  FaIdCard,
  FaTrophy,
  FaGem,
  FaCalendarAlt,
  FaChartLine,
  FaEye,
  FaHeart,
  FaComment,
  FaShare,
  FaPlay,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaBolt,
  FaCamera,
  FaVideo,
  FaStar,
  FaLightbulb,
  FaArrowRight,
  FaTimes,
  FaCheck,
  FaSpinner,
  FaBars,
  FaCrop,
  FaSearchPlus,
  FaSearchMinus,
  FaUndo
} from "react-icons/fa";
import ActivePlans from "./ActivePlans";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Componente de Crop Modal
const ImageCropModal = ({
  isOpen,
  onClose,
  imageFile,
  onCrop,
  aspectRatio = 1,
  cropTitle = "Ajustar Imagem"
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [imageUrl, setImageUrl] = useState(null);
  const [imageSize, setImageSize] = useState({
    width: 0,
    height: 0,
    originalWidth: 0,
    originalHeight: 0,
    scale: 1
  });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });

  const [crop, setCrop] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Inicializa imagem e dimensões
  useEffect(() => {
    if (!isOpen || !imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setImageUrl(url);

    const img = document.createElement('img');
    img.onload = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const cw = Math.min(rect.width - 40, 400);
      const ch = Math.min(rect.height - 120, 400);
      setContainerSize({ width: cw, height: ch });

      const scale = Math.min(cw / img.width, ch / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      setImageSize({
        width: w,
        height: h,
        originalWidth: img.width,
        originalHeight: img.height,
        scale
      });

      setImageOffset({ x: (cw - w) / 2, y: (ch - h) / 2 });

      const cs = Math.min(w, h) * 0.7;
      setCrop({
        x: (w - cs) / 2,
        y: (h - cs) / 2,
        width: cs,
        height: aspectRatio === 1 ? cs : cs / aspectRatio
      });
    };
    img.src = url;

    return () => URL.revokeObjectURL(url);
  }, [isOpen, imageFile, aspectRatio]);

  // Handlers de mouse
  const handleMouseDown = useCallback((e, type) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left - imageOffset.x;
    const y = e.clientY - rect.top - imageOffset.y;

    if (type === "crop") {
      setIsDragging(true);
      setDragStart({ x: x - crop.x, y: y - crop.y });
    } else {
      setIsResizing(true);
      setDragStart({ x, y });
    }
  }, [crop, imageOffset]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging && !isResizing) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left - imageOffset.x;
    const y = e.clientY - rect.top - imageOffset.y;

    if (isDragging) {
      const nx = Math.max(0, Math.min(x - dragStart.x, imageSize.width - crop.width));
      const ny = Math.max(0, Math.min(y - dragStart.y, imageSize.height - crop.height));
      setCrop(c => ({ ...c, x: nx, y: ny }));
    } else {
      const dx = x - dragStart.x;
      const dy = y - dragStart.y;
      const d = Math.max(dx, dy);
      const maxSz = Math.min(imageSize.width - crop.x, imageSize.height - crop.y);
      let ns = Math.max(30, crop.width + d);
      ns = Math.min(ns, maxSz);
      setCrop(c => ({
        ...c,
        width: ns,
        height: aspectRatio === 1 ? ns : ns / aspectRatio
      }));
      setDragStart({ x, y });
    }
  }, [isDragging, isResizing, dragStart, crop, imageSize, imageOffset, aspectRatio]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  // Handlers de touch
  const handleTouchStart = useCallback((e, type) => {
    e.preventDefault();
    const t = e.touches[0];
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = t.clientX - rect.left - imageOffset.x;
    const y = t.clientY - rect.top - imageOffset.y;

    if (type === "crop") {
      setIsDragging(true);
      setDragStart({ x: x - crop.x, y: y - crop.y });
    } else {
      setIsResizing(true);
      setDragStart({ x, y });
    }
  }, [crop, imageOffset]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging && !isResizing) return;
    e.preventDefault();
    const t = e.touches[0];
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = t.clientX - rect.left - imageOffset.x;
    const y = t.clientY - rect.top - imageOffset.y;

    if (isDragging) {
      const nx = Math.max(0, Math.min(x - dragStart.x, imageSize.width - crop.width));
      const ny = Math.max(0, Math.min(y - dragStart.y, imageSize.height - crop.height));
      setCrop(c => ({ ...c, x: nx, y: ny }));
    } else {
      const dx = x - dragStart.x;
      const dy = y - dragStart.y;
      const d = Math.max(dx, dy);
      const maxSz = Math.min(imageSize.width - crop.x, imageSize.height - crop.y);
      let ns = Math.max(30, crop.width + d);
      ns = Math.min(ns, maxSz);
      setCrop(c => ({
        ...c,
        width: ns,
        height: aspectRatio === 1 ? ns : ns / aspectRatio
      }));
      setDragStart({ x, y });
    }
  }, [isDragging, isResizing, dragStart, crop, imageSize, imageOffset, aspectRatio]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  // registra eventos touch no document
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleTouchEnd);
      return () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging, isResizing, handleTouchMove, handleTouchEnd]);

  // Função de crop
  const cropImage = useCallback(() => {
    if (!imageUrl || !imageSize.originalWidth) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = document.createElement('img');
    img.onload = () => {
      const sx = crop.x * (imageSize.originalWidth / imageSize.width);
      const sy = crop.y * (imageSize.originalHeight / imageSize.height);
      const sw = crop.width * (imageSize.originalWidth / imageSize.width);
      const sh = crop.height * (imageSize.originalHeight / imageSize.height);

      canvas.width = crop.width;
      canvas.height = crop.height;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, crop.width, crop.height);

      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], imageFile.name, {
            type: imageFile.type,
            lastModified: Date.now()
          });
          onCrop(file);
        }
      }, imageFile.type, 0.9);
    };
    img.src = imageUrl;
  }, [imageUrl, imageSize, crop, imageFile, onCrop]);

  const resetCrop = () => {
    const cs = Math.min(imageSize.width, imageSize.height) * 0.7;
    setCrop({
      x: (imageSize.width - cs) / 2,
      y: (imageSize.height - cs) / 2,
      width: cs,
      height: aspectRatio === 1 ? cs : cs / aspectRatio
    });
  };

  if (!isOpen) return null;
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl sm:rounded-3xl max-w-md sm:max-w-lg w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
              <FaCrop className="text-pink-500 mr-2" />
              {cropTitle}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Arraste para mover • Canto inferior direito para redimensionar
          </p>
        </div>

        {/* Crop Area */}
                  <div className="p-4 sm:p-6">
          <div
            ref={containerRef}
            className="relative bg-gray-100 rounded-xl overflow-hidden mx-auto"
            style={{ 
              width: containerSize.width || 300, 
              height: containerSize.height || 300,
              touchAction: 'none'
            }}
          >
            {imageUrl && (
              <>
    <img
  src={imageUrl}
  alt="Crop preview"
  className="absolute pointer-events-none select-none"
  style={{
    width: imageSize.width,
    height: imageSize.height,
    left: imageOffset.x,
    top: imageOffset.y
  }}
  draggable={false}
/>

                
                {/* Overlay */}
                <div 
                  className="absolute inset-0 bg-black/50"
                  style={{
                    left: imageOffset.x,
                    top: imageOffset.y,
                    width: imageSize.width,
                    height: imageSize.height
                  }}
                />
                
                {/* Crop Box */}
                <div
                  className="absolute border-2 border-white cursor-move"
                  style={{
                    left: imageOffset.x + crop.x,
                    top: imageOffset.y + crop.y,
                    width: crop.width,
                    height: crop.height,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, 'crop')}
                  onTouchStart={(e) => handleTouchStart(e, 'crop')}
                >
                  {/* Grid Lines */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/3 left-0 right-0 h-px bg-white/50" />
                    <div className="absolute top-2/3 left-0 right-0 h-px bg-white/50" />
                    <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/50" />
                    <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/50" />
                  </div>
                  
                  {/* Resize Handle - Melhorado */}
                  <div
                    className="absolute -bottom-3 -right-3 w-8 h-8 bg-white border-2 border-pink-500 rounded-full cursor-se-resize flex items-center justify-center shadow-lg hover:bg-pink-50 transition-colors"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e, 'resize');
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handleTouchStart(e, 'resize');
                    }}
                  >
                    <div className="w-2 h-2 bg-pink-500 rounded-full" />
                  </div>
                  
                  {/* Handles de canto adicionais */}
                  <div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-white border border-pink-500 rounded-full cursor-nw-resize opacity-75 hover:opacity-100"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e, 'resize');
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handleTouchStart(e, 'resize');
                    }}
                  />
                  <div
                    className="absolute -bottom-1 -left-1 w-4 h-4 bg-white border border-pink-500 rounded-full cursor-ne-resize opacity-75 hover:opacity-100"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e, 'resize');
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handleTouchStart(e, 'resize');
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-4 sm:mt-6">
            <button
              onClick={resetCrop}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
            >
              <FaUndo className="text-sm" />
              <span className="hidden sm:inline">Resetar</span>
            </button>
            
            <div className="flex space-x-2 sm:space-x-3">
              <button
                onClick={onClose}
                className="px-4 sm:px-6 py-2 sm:py-3 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
              >
                Cancelar
              </button>
              <button
                onClick={cropImage}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 text-sm sm:text-base"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </motion.div>
  );
};

const ProfileSettings = ({ onUpdate }) => {
  const { userInfo, fetchUserData } = useContext(AuthContext);

  // Estados principais
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Estados do perfil
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [documentsValidated, setDocumentsValidated] = useState(false);
  const [rankingPosition, setRankingPosition] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [timeProgress, setTimeProgress] = useState(100);
  const [startDate, setStartDate] = useState(null);

  // Estados de documentos
  const [documentFront, setDocumentFront] = useState(null);
  const [documentBack, setDocumentBack] = useState(null);
  const [documentFileFront, setDocumentFileFront] = useState(null);
  const [documentFileBack, setDocumentFileBack] = useState(null);
  const [isReadyToSend, setIsReadyToSend] = useState(false);

  // Estados de posts
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");

  // Estados do carrossel
  const [allowedCarouselImages, setAllowedCarouselImages] = useState(1);
  const [carouselImages, setCarouselImages] = useState([]);
  const [carouselImagesURL, setCarouselImagesURL] = useState([]);

  // Estados do modal/tutoriais
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showProfileTips, setShowProfileTips] = useState(false);

  // Estados do crop modal
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageFile, setCropImageFile] = useState(null);
  const [cropType, setCropType] = useState(null); // 'profile', 'banner', 'carousel'
  const [cropAspectRatio, setCropAspectRatio] = useState(1);

  // Configuração das tabs
  const tabs = [
    { id: "overview", label: "Início", icon: FaChartLine },
    { id: "profile", label: "Perfil", icon: FaUserCircle },
    { id: "content", label: "Posts", icon: FaCamera },
    { id: "documents", label: "Docs", icon: FaIdCard },
  ];

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Bem-vinda ao seu Painel!",
      description: "Vamos te ajudar a configurar seu perfil em poucos passos",
      icon: FaLightbulb
    },
    {
      title: "Adicione sua Foto de Perfil",
      description: "Uma boa foto aumenta suas visualizações em até 85%",
      icon: FaCamera
    },
    {
      title: "Configure seu Banner",
      description: "O banner é a primeira impressão. Capriche!",
      icon: FaImage
    },
    {
      title: "Publique Conteúdo",
      description: "Posts regulares mantêm seu perfil ativo e atrativo",
      icon: FaBolt
    }
  ];

  // Carrega dados iniciais
  useEffect(() => {
    if (!userInfo) {
      fetchUserData();
    } else {
      if (userInfo?.ranking) {
        setRankingPosition(userInfo.ranking);
      } else {
        setRankingPosition("Não disponível");
      }
    }
  }, [userInfo, fetchUserData]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (documentFront && documentBack) {
      setIsReadyToSend(true);
    }
  }, [documentFront, documentBack]);

  // Timer do plano
  useEffect(() => {
    if (startDate) {
      const totalDuration = 30 * 24 * 60 * 60 * 1000;
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
      const interval = setInterval(updateTimeLeft, 60000);
      return () => clearInterval(interval);
    }
  }, [startDate]);

  // Fetch media
  const fetchMedia = useCallback(async () => {
    const userToken = Cookies.get("userToken");
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/profile-banner/`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      if (response.status === 200) {
        const { profileImage, bannerImage, documentsValidated, planName } = response.data.media;

        let allowedImages = 1;
        if (typeof planName === "string") {
          if (planName.includes("Plano Rubi")) {
            allowedImages = 5;
          } else if (planName.includes("Plano Safira")) {
            allowedImages = 4;
          } else if (planName.includes("Plano Vip") || planName.includes("Plano Pink")) {
            allowedImages = 1;
          } else if (planName.includes("Contato") || planName.includes("Oculto") || planName.includes("Reviews Públicos") || planName.includes("Darkmode") || planName.includes("Plano Nitro")) {
            allowedImages = 0;
          }
        }

        setProfileImage(profileImage);
        setBannerImage(bannerImage);
        setDocumentsValidated(documentsValidated);
        setStartDate(new Date(response.data.media.startDate));
        setAllowedCarouselImages(Number(allowedImages));

        const orderedImageURLs = response.data.media.carrouselImages
          .sort((a, b) => a.order - b.order)
          .map((img) => img.imageUrl);
        setCarouselImages(orderedImageURLs);
      }
    } catch (error) {
      console.error("Erro ao buscar mídia:", error);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  // Handlers para crop
  const handleImageSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validação de arquivo
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 10MB.");
      return;
    }

    setCropImageFile(file);
    setCropType(type);
    
    // Define aspect ratio baseado no tipo
    if (type === 'profile') {
      setCropAspectRatio(1); // Quadrado
    } else if (type === 'banner') {
      setCropAspectRatio(3); // Banner 3:1
    } else {
      setCropAspectRatio(1); // Carousel quadrado
    }
    
    setShowCropModal(true);
  };

  const handleCropComplete = async (croppedFile) => {
    setShowCropModal(false);
    setUploading(true);

    try {
      const userToken = Cookies.get("userToken");
      const formData = new FormData();

      if (cropType === 'profile' || cropType === 'banner') {
        formData.append(cropType === "profile" ? "profileImage" : "bannerImage", croppedFile);
        
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

        if (response.status === 200) {
          if (cropType === "profile") {
            setProfileImage(response.data.companion.profileImage);
            toast.success("✨ Foto de perfil atualizada!");
            fetchUserData();
          } else {
            setBannerImage(response.data.companion.bannerImage);
            toast.success("🎨 Banner atualizado!");
          }
        }
      } else if (cropType === 'carousel') {
        // Adiciona à lista de imagens para upload
        const totalSelected = carouselImages.length + carouselImagesURL.length;
        if (totalSelected >= allowedCarouselImages) {
          toast.error(`Limite de ${allowedCarouselImages} imagens atingido!`);
          return;
        }

        const imageUrl = URL.createObjectURL(croppedFile);
        setCarouselImagesURL([...carouselImagesURL, { file: croppedFile, url: imageUrl }]);
        toast.success("📸 Imagem adicionada! Clique em 'Enviar Fotos' para finalizar.");
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      toast.error('Erro ao atualizar imagem.');
    } finally {
      setUploading(false);
      setCropImageFile(null);
      setCropType(null);
    }
  };

  // Handlers originais (atualizados para usar crop)
  const handleImageChange = (e, type) => {
    handleImageSelect(e, type);
  };

  const handlePostUpload = async () => {
    const token = Cookies.get("userToken");

    if (!selectedFile || !title || !description) {
      toast.error("Preencha todos os campos!");
      return;
    }

    const formData = new FormData();
    formData.append("media", selectedFile);
    formData.append("title", title);
    formData.append("description", description);

    setUploading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/feed/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("🎉 Post publicado com sucesso!");
        setSelectedFile(null);
        setTitle("");
        setDescription("");
      } else {
        toast.error(data.error || "Erro ao publicar.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao publicar post.");
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async () => {
    const token = Cookies.get("userToken");

    if (!selectedVideo || !videoTitle || !videoDescription) {
      toast.error("Preencha todos os campos do vídeo!");
      return;
    }

    const formData = new FormData();
    formData.append("media", selectedVideo);
    formData.append("title", videoTitle);
    formData.append("description", videoDescription);

    setUploading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/feed/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("🎬 Vídeo publicado com sucesso!");
        setSelectedVideo(null);
        setVideoTitle("");
        setVideoDescription("");
      } else {
        toast.error(data.error || "Erro ao publicar vídeo.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao publicar vídeo.");
    } finally {
      setUploading(false);
    }
  };

  const handleCarouselImageUpload = (e) => {
    handleImageSelect(e, 'carousel');
  };

  const handleUploadCarouselImages = async () => {
    if (carouselImagesURL.length === 0) {
      toast.error("Nenhuma imagem selecionada.");
      return;
    }

    const formData = new FormData();
    carouselImagesURL.forEach((imageObj) => {
      if (imageObj.file) {
        formData.append("carrouselImages", imageObj.file);
      }
    });

    setUploading(true);

    try {
      const userToken = Cookies.get("userToken");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/carrousel/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { message, limitReached } = response.data;
      if (response.status === 200 || response.status === 201) {
        if (limitReached) {
          toast.info(message || "Limite atingido.");
        } else {
          toast.success("✨ Imagens adicionadas!");
        }
        setCarouselImages([]);
        setCarouselImagesURL([]);
        await fetchMedia();
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao enviar imagens.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveCarouselImage = async (indexToRemove, isSavedImage = false) => {
    const userToken = Cookies.get("userToken");

    if (isSavedImage) {
      const imageToDelete = carouselImages[indexToRemove];
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/carrousel/delete`,
          {
            headers: { Authorization: `Bearer ${userToken}` },
            data: { imageUrl: imageToDelete },
          }
        );

        if (response.status === 200) {
          toast.success("Imagem removida!");
          await fetchMedia();
        }
      } catch (error) {
        console.error("Erro:", error);
        toast.error("Erro ao remover.");
      }
    } else {
      setCarouselImagesURL(prevImages =>
        prevImages.filter((_, index) => index !== indexToRemove)
      );
    }
  };

  const handleSendDocuments = async () => {
    if (!documentFront || !documentBack) {
      toast.error("Envie ambos os lados do documento!");
      return;
    }

    setUploading(true);
    try {
      const token = Cookies.get("userToken");
      const formData = new FormData();
      formData.append("fileFront", documentFileFront);
      formData.append("fileBack", documentFileBack);

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

      if (response.status === 201 || response.status === 200) {
        toast.success("📋 Documentos enviados para análise!");
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao enviar documentos.");
    } finally {
      setUploading(false);
    }
  };

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

  // Renderização de componentes
  const renderOverviewTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {/* Ranking Card */}
        <motion.div
          className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10"></div>
          <FaTrophy className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-yellow-300" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">Ranking Nacional</h3>
          {rankingPosition && rankingPosition !== "Não disponível" ? (
            <div className="text-2xl sm:text-3xl font-bold">#{rankingPosition}</div>
          ) : (
            <div className="text-sm sm:text-lg">Em análise...</div>
          )}
        </motion.div>

        {/* Plano Card */}
        <motion.div
          className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10"></div>
          <FaGem className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-cyan-200" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">Plano Ativo</h3>
          <div className="text-sm sm:text-lg">Premium</div>
        </motion.div>

        {/* Tempo Card */}
        <motion.div
          className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white relative overflow-hidden sm:col-span-2 lg:col-span-1"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10"></div>
          <FaClock className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-green-200" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">Tempo Restante</h3>
          {timeLeft && timeLeft !== "Expirado" ? (
            <div className="text-sm sm:text-lg">{timeLeft}</div>
          ) : (
            <div className="text-sm sm:text-lg">Sem plano ativo</div>
          )}
        </motion.div>
      </div>

      {/* Dicas rápidas */}
      <motion.div
        className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl sm:rounded-2xl p-4 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="bg-yellow-500 p-3 rounded-full w-fit">
            <FaLightbulb className="text-white text-lg sm:text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-2">
              💡 Dicas para aumentar suas visualizações
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Atualize sua foto de perfil regularmente</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Publique conteúdo pelo menos 3x por semana</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Complete 100% do seu perfil</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Responda mensagens rapidamente</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress do perfil */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Completude do Perfil</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Foto de perfil</span>
            {profileImage ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaExclamationTriangle className="text-yellow-500" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Banner</span>
            {bannerImage ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaExclamationTriangle className="text-yellow-500" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Documentos validados</span>
            {documentsValidated ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaExclamationTriangle className="text-yellow-500" />
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso</span>
            <span>
              {Math.round(
                ((profileImage ? 1 : 0) +
                  (bannerImage ? 1 : 0) +
                  (documentsValidated ? 1 : 0)) / 3 * 100
              )}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${Math.round(
                  ((profileImage ? 1 : 0) +
                    (bannerImage ? 1 : 0) +
                    (documentsValidated ? 1 : 0)) / 3 * 100
                )}%`
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Banner e foto de perfil */}
      <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
        {/* Banner */}
        <div className="relative h-32 sm:h-48 md:h-64 bg-gradient-to-r from-pink-400 to-purple-500">
          {bannerImage ? (
            <Image
              src={bannerImage}
              alt="Banner"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white px-4">
                <FaImage className="text-2xl sm:text-4xl mx-auto mb-2 opacity-60" />
                <p className="text-sm sm:text-lg font-medium">Adicione seu banner</p>
              </div>
            </div>
          )}

          <label className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full cursor-pointer hover:bg-black/70 transition-all duration-300 flex items-center space-x-2 text-xs sm:text-sm">
            {uploading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaCrop />
            )}
            <span className="hidden sm:inline">
              {uploading ? "Enviando..." : "Alterar"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e, "banner")}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Perfil */}
        <div className="relative px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
            <div className="relative -mt-8 sm:-mt-16 mb-4 sm:mb-0 mx-auto sm:mx-0">
              <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gray-200">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="Perfil"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUserCircle className="text-gray-400 text-3xl sm:text-6xl" />
                  </div>
                )}
              </div>

              <label className="absolute bottom-0 right-0 sm:bottom-2 sm:right-2 bg-pink-500 text-white p-2 sm:p-3 rounded-full cursor-pointer hover:bg-pink-600 transition-all duration-300 shadow-lg">
                {uploading ? (
                  <FaSpinner className="animate-spin text-xs sm:text-sm" />
                ) : (
                  <FaCamera className="text-xs sm:text-sm" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "profile")}
                  disabled={uploading}
                />
              </label>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                {userInfo?.userName || "Seu Nome"}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Configure sua foto de perfil e banner para atrair mais visualizações
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dicas de perfil */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaInfoCircle className="text-blue-500 mr-2" />
          Dicas para uma foto de perfil perfeita
        </h3>
        <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="bg-green-500 text-white p-1 rounded-full mt-1 flex-shrink-0">
                <FaCheck className="text-xs" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Boa iluminação</h4>
                <p className="text-xs sm:text-sm text-gray-600">Use luz natural sempre que possível</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-green-500 text-white p-1 rounded-full mt-1 flex-shrink-0">
                <FaCheck className="text-xs" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Rosto bem visível</h4>
                <p className="text-xs sm:text-sm text-gray-600">Mostre seu rosto claramente</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="bg-green-500 text-white p-1 rounded-full mt-1 flex-shrink-0">
                <FaCheck className="text-xs" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Fundo neutro</h4>
                <p className="text-xs sm:text-sm text-gray-600">Evite fundos muito carregados</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-green-500 text-white p-1 rounded-full mt-1 flex-shrink-0">
                <FaCheck className="text-xs" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Alta qualidade</h4>
                <p className="text-xs sm:text-sm text-gray-600">Imagens nítidas e de boa resolução</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carrossel de imagens */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Galeria de Fotos</h3>

        {allowedCarouselImages > 0 ? (
          <>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              Você pode adicionar até {allowedCarouselImages} foto{allowedCarouselImages > 1 ? "s" : ""} no seu cartão de anúncio
            </p>

            {/* Upload de imagens */}
            {carouselImages.length + carouselImagesURL.length < allowedCarouselImages && (
              <label className="block border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-all duration-300 mb-4 sm:mb-6">
                <FaPlusCircle className="text-3xl sm:text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium text-sm sm:text-base">Clique para adicionar uma foto</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">JPG, PNG até 10MB • Ajuste automático</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCarouselImageUpload}
                />
              </label>
            )}

            {/* Preview das imagens */}
            {(carouselImages.length > 0 || carouselImagesURL.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {/* Imagens salvas */}
                {carouselImages.map((image, index) => (
                  <div key={`saved-${index}`} className="relative group">
                    <div className="aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-gray-200">
                      <Image
                        src={image}
                        alt={`Foto ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveCarouselImage(index, true)}
                      className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-500 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                ))}

                {/* Imagens para upload */}
                {carouselImagesURL.map((imageObj, index) => (
                  <div key={`preview-${index}`} className="relative group">
                    <div className="aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-gray-200">
                      <Image
                        src={imageObj.url}
                        alt={`Nova foto ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveCarouselImage(index, false)}
                      className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-500 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                    <div className="absolute inset-0 bg-black/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <span className="bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                        Aguardando envio
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Botão de envio */}
            {carouselImagesURL.length > 0 && (
              <button
                onClick={handleUploadCarouselImages}
                disabled={uploading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 sm:py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                {uploading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <FaUpload />
                    <span>Enviar Fotos</span>
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <FaGem className="text-3xl sm:text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium text-sm sm:text-base">Upgrade seu plano</p>
            <p className="text-xs sm:text-sm text-gray-500">Para adicionar fotos na galeria</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderContentTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Posts */}
      <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        {/* Upload de foto */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
          <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
            <FaCamera className="text-pink-500 mr-2" />
            Publicar Foto
          </h3>

          <div className="space-y-4">
            <label className="block border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-all duration-300">
              {selectedFile ? (
                <div className="space-y-2">
                  <FaCheckCircle className="text-green-500 text-xl sm:text-2xl mx-auto" />
                  <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">{selectedFile.name}</p>
                </div>
              ) : (
                <>
                  <FaPlusCircle className="text-2xl sm:text-3xl text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm sm:text-base">Selecionar foto</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </label>

            {selectedFile && (
              <>
                <input
                  type="text"
                  placeholder="Título da sua foto..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                />
                <textarea
                  placeholder="Conte uma história sobre esta foto..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-sm sm:text-base"
                />
                <button
                  onClick={handlePostUpload}
                  disabled={!title || !description || uploading}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg sm:rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  {uploading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Publicando...</span>
                    </>
                  ) : (
                    <>
                      <FaCamera />
                      <span>Publicar Foto</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Upload de vídeo */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
          <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
            <FaVideo className="text-blue-500 mr-2" />
            Publicar Vídeo
          </h3>

          <div className="space-y-4">
            <label className="block border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
              {selectedVideo ? (
                <div className="space-y-2">
                  <FaCheckCircle className="text-green-500 text-xl sm:text-2xl mx-auto" />
                  <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">{selectedVideo.name}</p>
                </div>
              ) : (
                <>
                  <FaPlay className="text-2xl sm:text-3xl text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm sm:text-base">Selecionar vídeo</p>
                </>
              )}
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => setSelectedVideo(e.target.files[0])}
              />
            </label>

            {selectedVideo && (
              <>
                <input
                  type="text"
                  placeholder="Título do seu vídeo..."
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
                <textarea
                  placeholder="Descreva seu vídeo..."
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                />
                <button
                  onClick={handleVideoUpload}
                  disabled={!videoTitle || !videoDescription || uploading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg sm:rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  {uploading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Publicando...</span>
                    </>
                  ) : (
                    <>
                      <FaVideo />
                      <span>Publicar Vídeo</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dicas de conteúdo */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaStar className="text-purple-500 mr-2" />
          Dicas para conteúdo de qualidade
        </h3>
        <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-purple-500 text-white p-2 rounded-full flex-shrink-0">
                <FaCamera className="text-xs sm:text-sm" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Qualidade da imagem</h4>
                <p className="text-xs sm:text-sm text-gray-600">Use boa iluminação e resolução alta</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-pink-500 text-white p-2 rounded-full flex-shrink-0">
                <FaHeart className="text-xs sm:text-sm" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Autenticidade</h4>
                <p className="text-xs sm:text-sm text-gray-600">Seja natural e genuína em suas fotos</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-500 text-white p-2 rounded-full flex-shrink-0">
                <FaClock className="text-xs sm:text-sm" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Regularidade</h4>
                <p className="text-xs sm:text-sm text-gray-600">Publique conteúdo regularmente</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-green-500 text-white p-2 rounded-full flex-shrink-0">
                <FaComment className="text-xs sm:text-sm" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Descrições cativantes</h4>
                <p className="text-xs sm:text-sm text-gray-600">Escreva textos interessantes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
          <FaIdCard className="text-blue-500 mr-2" />
          Validação de Documentos
        </h3>

        {documentsValidated ? (
          <div className="text-center py-6 sm:py-8">
            <div className="bg-green-100 p-3 sm:p-4 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center">
              <FaCheckCircle className="text-green-500 text-2xl sm:text-3xl" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Documentos Validados! ✅
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Seus documentos foram aprovados e seu perfil está verificado.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg sm:rounded-xl p-4 mb-4 sm:mb-6">
              <div className="flex items-start space-x-3">
                <FaExclamationTriangle className="text-yellow-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Verificação Pendente</h4>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Para ter seu perfil verificado, envie fotos nítidas de ambos os lados do seu documento de identidade.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0">
              {/* Frente do documento */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Frente do Documento</h4>
                <label className="block border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
                  {documentFront ? (
                    <div className="space-y-2">
                      <FaCheckCircle className="text-green-500 text-xl sm:text-2xl mx-auto" />
                      <p className="text-xs sm:text-sm font-medium text-gray-700">Documento carregado</p>
                    </div>
                  ) : (
                    <>
                      <FaIdCard className="text-2xl sm:text-3xl text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-xs sm:text-sm">Frente do RG/CNH</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "front")}
                  />
                </label>
              </div>

              {/* Verso do documento */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Verso do Documento</h4>
                <label className="block border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
                  {documentBack ? (
                    <div className="space-y-2">
                      <FaCheckCircle className="text-green-500 text-xl sm:text-2xl mx-auto" />
                      <p className="text-xs sm:text-sm font-medium text-gray-700">Documento carregado</p>
                    </div>
                  ) : (
                    <>
                      <FaIdCard className="text-2xl sm:text-3xl text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-xs sm:text-sm">Verso do RG/CNH</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "back")}
                  />
                </label>
              </div>
            </div>

            {/* Preview dos documentos */}
            {(documentFront || documentBack) && (
              <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 mt-4 sm:mt-6">
                {documentFront && (
                  <div className="space-y-2">
                    <h5 className="text-xs sm:text-sm font-medium text-gray-700">Preview - Frente</h5>
                    <div className="relative aspect-[3/2] bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden">
                      <Image
                        src={documentFront}
                        alt="Frente do documento"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                {documentBack && (
                  <div className="space-y-2">
                    <h5 className="text-xs sm:text-sm font-medium text-gray-700">Preview - Verso</h5>
                    <div className="relative aspect-[3/2] bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden">
                      <Image
                        src={documentBack}
                        alt="Verso do documento"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {isReadyToSend && (
              <button
                onClick={handleSendDocuments}
                disabled={uploading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 mt-4 sm:mt-6 text-sm sm:text-base"
              >
                {uploading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Enviando documentos...</span>
                  </>
                ) : (
                  <>
                    <FaIdCard />
                    <span>Enviar para Verificação</span>
                  </>
                )}
              </button>
            )}

            {/* Dicas para documentos */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 mt-4 sm:mt-6">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center text-sm sm:text-base">
                <FaInfoCircle className="text-blue-500 mr-2" />
                Dicas para uma verificação rápida
              </h4>
              <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <FaCheck className="text-green-500 flex-shrink-0" />
                  <span>Certifique-se de que o documento esteja bem iluminado</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCheck className="text-green-500 flex-shrink-0" />
                  <span>Todas as informações devem estar legíveis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCheck className="text-green-500 flex-shrink-0" />
                  <span>Evite reflexos ou sombras no documento</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCheck className="text-green-500 flex-shrink-0" />
                  <span>Use formato JPG ou PNG de boa qualidade</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
  
  // Loading screen
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
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
          <p className="text-gray-600 font-medium text-sm sm:text-base">Carregando seu painel...</p>
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Painel de Controle
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Gerencie seu perfil e conteúdo de forma profissional
              </p>
            </div>

            <button
              onClick={() => setShowTutorial(true)}
              className="mt-4 lg:mt-0 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base mx-auto lg:mx-0"
            >
              <FaLightbulb />
              <span>Tutorial</span>
            </button>
          </div>

          {/* Tabs Mobile */}
          <div className="block sm:hidden">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h2>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg bg-gray-100"
              >
                <FaBars className="text-gray-600" />
              </button>
            </div>

            <AnimatePresence>
              {showMobileMenu && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden mb-4"
                >
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setShowMobileMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${activeTab === tab.id
                            ? "bg-pink-50 text-pink-600 border-r-4 border-pink-500"
                            : "text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        <Icon className="text-lg" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tabs Desktop */}
          <div className="hidden sm:flex space-x-1 bg-gray-100 p-1 rounded-2xl overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap text-sm sm:text-base ${activeTab === tab.id
                      ? "bg-white text-pink-600 shadow-lg"
                      : "text-gray-600 hover:text-gray-800"
                    }`}
                >
                  <Icon className="text-lg" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && renderOverviewTab()}
          {activeTab === "profile" && renderProfileTab()}
          {activeTab === "content" && renderContentTab()}
          {activeTab === "documents" && renderDocumentsTab()}
        </motion.div>

        {/* Tutorial Modal */}
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {(() => {
                  const currentTutorial = tutorialSteps[currentStep];
                  const IconComponent = currentTutorial.icon;

                  return (
                    <div className="text-center">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 ${currentStep === 0 ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                          currentStep === 1 ? 'bg-gradient-to-br from-pink-500 to-pink-600' :
                            currentStep === 2 ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                              'bg-gradient-to-br from-green-500 to-green-600'
                        }`}>
                        <IconComponent className="text-white text-lg sm:text-2xl" />
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                        {currentTutorial.title}
                      </h3>

                      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                        {currentTutorial.description}
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          {tutorialSteps.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentStep ? "bg-pink-500 w-6 sm:w-8" : "bg-gray-300"
                                }`}
                            />
                          ))}
                        </div>

                        <div className="flex space-x-2 sm:space-x-3">
                          {currentStep > 0 && (
                            <button
                              onClick={() => setCurrentStep(currentStep - 1)}
                              className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
                            >
                              Anterior
                            </button>
                          )}

                          {currentStep < tutorialSteps.length - 1 ? (
                            <button
                              onClick={() => setCurrentStep(currentStep + 1)}
                              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 text-sm sm:text-base"
                            >
                              Próximo
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setShowTutorial(false);
                                setCurrentStep(0);
                              }}
                              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 text-sm sm:text-base"
                            >
                              Finalizar
                            </button>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setShowTutorial(false);
                          setCurrentStep(0);
                        }}
                        className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        <FaTimes className="text-lg sm:text-xl" />
                      </button>
                    </div>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Crop Modal */}
        <AnimatePresence>
          {showCropModal && (
            <ImageCropModal
              isOpen={showCropModal}
              onClose={() => {
                setShowCropModal(false);
                setCropImageFile(null);
                setCropType(null);
              }}
              imageFile={cropImageFile}
              onCrop={handleCropComplete}
              aspectRatio={cropAspectRatio}
              cropTitle={
                cropType === 'profile' ? 'Ajustar Foto de Perfil' :
                cropType === 'banner' ? 'Ajustar Banner' :
                'Ajustar Foto da Galeria'
              }
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileSettings;