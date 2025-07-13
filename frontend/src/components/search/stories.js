"use client";
import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { usePlan } from "../../context/PlanContext";
import axios from "axios";
import Image from "next/image";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaTimes,
  FaTrash,
  FaPlay,
  FaPause,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaComment,
  FaShare
} from "react-icons/fa";

export default function Stories({ cidade, estado }) {
  const { userInfo, fetchUserData } = useContext(AuthContext);
  const { companions } = usePlan();
  const userToken = Cookies.get("userToken");
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedStory, setSelectedStory] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();
  const storyDuration = 10000;
  const imageRef = useRef(null);

  const isAcompanhante = userInfo?.userType === "ACOMPANHANTE";

  // Correção: Verificar se companions é um array antes de usar find
  const companionData = Array.isArray(companions)
    ? companions.find(c => c.userName === userInfo?.userName)
    : null;


  useEffect(() => {
    console.log("Companion data:", companionData);
  }, [companionData]);

  // Verifica se o plano principal dá acesso aos stories
  const mainPlanAllowsStories = companionData?.plan?.description?.toLowerCase().includes("acesso aos stories");

  // Verifica se há algum plano extra com stories habilitado
  const extraPlanAllowsStories = Array.isArray(companionData?.subscriptions) &&
    companionData.subscriptions.some(
      sub => sub?.extraPlan?.hasStories === true && sub?.extraPlan?.isEnabled
    );

  // Verificação final
  const canPostStory = isAcompanhante && (mainPlanAllowsStories || extraPlanAllowsStories);

  const canUploadStory = isAcompanhante &&
    Array.isArray(companionData?.subscriptions) &&
    companionData.subscriptions.some(
      sub => sub?.extraPlan?.hasStories === true
    );

  useEffect(() => {
    if (!userInfo) fetchUserData();
  }, [userInfo, fetchUserData]);

  const groupStoriesByUser = (stories) => {
    if (!Array.isArray(stories)) return [];

    const grouped = {};
    stories.forEach((story) => {
      const userName = story.companion?.userName;
      if (!userName) return;

      if (!grouped[userName]) {
        grouped[userName] = {
          companion: story.companion,
          stories: [story],
        };
      } else {
        grouped[userName].stories.push(story);
      }
    });

    const all = Object.values(grouped);
    if (userInfo?.userName) {
      const ownIndex = all.findIndex((g) => g.companion.userName === userInfo.userName);
      if (ownIndex > -1) {
        const [own] = all.splice(ownIndex, 1);
        all.unshift(own);
      }
    }
    return all;
  };

  async function fetchStories() {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/story`, {
        params: { cidade, estado },
      });

      const grouped = groupStoriesByUser(res.data || []);
      setStories(grouped);

      if (selectedStory) {
        const updatedGroup = grouped.find(g => g.companion.userName === selectedStory.companion.userName);
        if (updatedGroup) {
          setSelectedStory(updatedGroup);
        } else {
          setSelectedStory(null);
        }
      }
    } catch (err) {
      console.error("Erro ao buscar stories:", err);
      toast.error("Erro ao carregar stories");
    }
  }

  useEffect(() => {
    fetchStories();
  }, [cidade, estado]);

  const handleStoryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !userToken) return;

    // Validação de arquivo
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error("Arquivo muito grande. Máximo 50MB.");
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de arquivo não suportado.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("media", file);
    formData.append("mediaType", file.type.startsWith("video") ? "video" : "image");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/story/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data) {
        toast.success("Story enviado com sucesso!");
        fetchStories();
      }
    } catch (err) {
      console.error("Erro ao enviar story:", err);
      toast.error(err.response?.data?.message || "Erro ao enviar story.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleDeleteStory = async (id) => {
    const storyId = selectedStory.stories[currentIndex]?.id;
    if (!storyId || !userToken) return;

    if (!window.confirm("Tem certeza que deseja deletar este story?")) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/story/${id}/delete`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      toast.success("Story deletado com sucesso!");
      closeModal();
      fetchStories();
    } catch (err) {
      console.error("Erro ao deletar story:", err);
      toast.error("Erro ao deletar story.");
    }
  };

  const slugify = (text) => text?.replace(/\s+/g, "-").toLowerCase();

  const openStory = (index) => {
    const storyGroup = stories[index];
    if (!storyGroup) return;
    setSelectedStory(storyGroup);
    setCurrentIndex(0);
    setProgress(0);
  };

  const closeModal = () => {
    setSelectedStory(null);
    setProgress(0);
    setIsPaused(false);
  };

  const nextStory = () => {
    const currentStories = selectedStory?.stories || [];
    if (currentIndex < currentStories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      const currentGroupIndex = stories.findIndex(
        (group) => group.companion.userName === selectedStory.companion.userName
      );
      if (currentGroupIndex < stories.length - 1) {
        const nextGroup = stories[currentGroupIndex + 1];
        setSelectedStory(nextGroup);
        setCurrentIndex(0);
        setProgress(0);
      } else {
        closeModal();
      }
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    } else {
      const currentGroupIndex = stories.findIndex(
        (group) => group.companion.userName === selectedStory.companion.userName
      );
      if (currentGroupIndex > 0) {
        const prevGroup = stories[currentGroupIndex - 1];
        setSelectedStory(prevGroup);
        setCurrentIndex(prevGroup.stories.length - 1);
        setProgress(0);
      } else {
        closeModal();
      }
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  useEffect(() => {
    if (selectedStory && !isPaused) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            nextStory();
            return 0;
          }
          return prev + 1;
        });
      }, storyDuration / 100);
      return () => clearInterval(interval);
    }
  }, [selectedStory, isPaused, currentIndex]);

  useEffect(() => {
    if (selectedStory?.stories) {
      setCurrentIndex(0);
      setProgress(0);
    }
  }, [selectedStory?.stories]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    const handleKeyPress = (event) => {
      if (selectedStory) {
        if (event.key === 'ArrowRight') nextStory();
        if (event.key === 'ArrowLeft') prevStory();
        if (event.key === 'Escape') closeModal();
        if (event.key === ' ') {
          event.preventDefault();
          togglePause();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [selectedStory]);

  const handleImageClick = (e) => {
    e.stopPropagation();
    const { clientX } = e;
    const width = e.currentTarget.offsetWidth;
    clientX > width / 2 ? nextStory() : prevStory();
  };

  const renderMediaContent = () => {
    if (selectedStory) {
      const story = selectedStory.stories[currentIndex];
      if (!story) return <div className="text-white">Story não encontrado</div>;

      const { url, mediaType } = story;

      const watermark = (
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
      );

      if (mediaType === "video") {
        return (
          <div className="relative">
            <video
              src={url}
              autoPlay
              muted
              playsInline
              className="max-h-[85vh] w-auto object-contain rounded-2xl"
              onLoadStart={() => setIsPaused(true)}
              onCanPlay={() => setIsPaused(false)}
            />
            {watermark}
          </div>
        );
      } else if (mediaType === "image") {
        return (
          <div className="relative">
            <Image
              src={url}
              alt="Story"
              width={500}
              height={800}
              className="max-h-[85vh] w-auto object-contain rounded-2xl"
              priority
            />
            {watermark}
          </div>
        );
      }
    }
    return <div className="text-white">Carregando...</div>;
  };


  const renderProgressBars = () => {
    if (!selectedStory?.stories) return null;

    return selectedStory.stories.map((_, index) => (
      <div key={index} className="flex-1 h-1 bg-white/30 rounded-full mx-0.5">
        <div
          className="h-full bg-white rounded-full transition-all duration-100"
          style={{
            width: index < currentIndex ? '100%' :
              index === currentIndex ? `${progress}%` : '0%'
          }}
        />
      </div>
    ));
  };


  return (<>
    {canUploadStory && stories.length === 0 && (
      <div className="flex overflow-x-auto space-x-6 items-center pb-2 scrollbar-hide">
        <motion.div
          className="flex-shrink-0 text-center group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <label className="relative cursor-pointer block">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-500 via-purple-500 to-pink-500 p-1 shadow-lg group-hover:shadow-2xl transition-all duration-300">
              <div className="w-full h-full rounded-3xl bg-white flex items-center justify-center relative overflow-hidden">
                {isUploading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FaPlus className="text-white text-lg" />
                  </div>
                )}
              </div>
            </div>
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              ref={inputRef}
              onChange={handleStoryUpload}
              disabled={isUploading}
            />
          </label>
          <span className="block mt-3 text-sm text-gray-700 font-semibold max-w-[5rem] truncate mx-auto">
            {isUploading ? "Enviando..." : "Adicionar"}
          </span>
        </motion.div>
      </div>
    )}


    {isAcompanhante &&
      Array.isArray(companionData?.subscriptions) &&
      !companionData.subscriptions.some(sub => sub.extraPlan?.hasStories) && (
        <div className="w-full mt-6 flex justify-center">
          <div className="bg-white/70 backdrop-blur-md border border-pink-200 text-pink-800 rounded-xl px-6 py-4 text-center shadow-lg max-w-md">
            <p className="text-sm sm:text-base font-medium">
              Você ainda <span className="text-pink-600 font-semibold">não tem acesso aos Stories</span>.
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Faça upgrade de plano e ative essa função exclusiva.
            </p>
            <button
              onClick={() => router.push('/planos')}
              className="mt-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm px-5 py-2 rounded-full font-semibold hover:scale-105 transition"
            >
              Ver planos disponíveis
            </button>
          </div>
        </div>
      )}

    <div className={`w-full px-4 mt-4 ${canPostStory ? 'bg-gradient-to-r from-gray-50 to-white py-6' : ''
      }`}>
      {Array.isArray(stories) && stories.length === 0 ? (
        <div className="w-full mt-6 flex justify-center">
          <div className="bg-white/70 backdrop-blur-md border border-pink-200 text-pink-800 rounded-xl px-6 py-4 text-center shadow-lg max-w-md">
            <p className="text-sm sm:text-base font-medium">
              Nenhuma acompanhante postou stories em{" "}
              <span className="text-pink-600 font-semibold">{cidade}, {estado}</span>.
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Tente buscar em outra cidade ou volte mais tarde.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex overflow-x-auto space-x-6 items-center pb-2 scrollbar-hide">
          {/* Botão de adicionar story */}
          {canUploadStory && (
            <motion.div
              className="flex-shrink-0 text-center group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <label className="relative cursor-pointer block">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-500 via-purple-500 to-pink-500 p-1 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <div className="w-full h-full rounded-3xl bg-white flex items-center justify-center relative overflow-hidden">
                    {isUploading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FaPlus className="text-white text-lg" />
                      </div>
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  ref={inputRef}
                  onChange={handleStoryUpload}
                  disabled={isUploading}
                />
              </label>
              <span className="block mt-3 text-sm text-gray-700 font-semibold max-w-[5rem] truncate mx-auto">
                {isUploading ? "Enviando..." : "Adicionar"}
              </span>
            </motion.div>
          )}

          {/* Stories existentes */}
          {stories.map((storyGroup, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 text-center group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openStory(index)}
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-500 via-purple-500 to-pink-500 p-1 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <div className="w-full h-full rounded-3xl overflow-hidden bg-gray-200 relative">
                    {storyGroup.companion?.profileImage ? (
                      <Image
                        src={storyGroup.companion.profileImage}
                        alt={storyGroup.companion.userName || "Usuário"}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-pink-600 font-bold text-2xl">
                        {storyGroup.companion?.userName?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}

                    {/* Indicador de stories */}
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                      {storyGroup.stories.length}
                    </div>
                  </div>
                </div>

                {/* Status online */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white"></div>
              </div>

              <span className="block mt-3 text-sm text-gray-700 font-semibold max-w-[5rem] truncate mx-auto">
                {storyGroup.companion?.userName || "Usuário"}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal do Story */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-black w-full max-w-md mx-4 rounded-3xl shadow-2xl relative overflow-hidden max-h-[95vh]"
              ref={modalRef}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Progress bars */}
              <div className="absolute top-4 left-4 right-4 z-20 flex space-x-1">
                {renderProgressBars()}
              </div>

              {/* Header */}
              <div className="absolute top-16 left-4 right-4 z-20 flex items-center justify-between">
                <motion.div
                  className="flex items-center space-x-3 cursor-pointer bg-black/50 backdrop-blur-sm rounded-2xl p-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/perfil/${slugify(selectedStory.companion?.userName)}`);
                    closeModal();
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  {selectedStory.companion?.profileImage ? (
                    <Image
                      src={selectedStory.companion.profileImage}
                      alt={selectedStory.companion?.userName || "Usuário"}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedStory.companion?.userName?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-semibold text-sm">
                      {selectedStory.companion?.userName || "Usuário"}
                    </h3>
                    <p className="text-white/70 text-xs">há 2h</p>
                  </div>
                </motion.div>

                <div className="flex items-center space-x-2">
                  {/* Pause/Play button */}
                  <button
                    onClick={togglePause}
                    className="p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all"
                  >
                    {isPaused ? <FaPlay className="text-sm" /> : <FaPause className="text-sm" />}
                  </button>

                  {/* Delete button para próprios stories */}
                  {selectedStory?.companion?.userName === userInfo?.userName && (
                    <button
                      onClick={() => handleDeleteStory(selectedStory.stories[currentIndex]?.id)}
                      className="p-3 bg-red-500/80 backdrop-blur-sm rounded-full text-white hover:bg-red-600 transition-all"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  )}

                  {/* Close button */}
                  <button
                    onClick={closeModal}
                    className="p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Navigation areas */}
              <div className="absolute left-0 top-0 h-full w-1/3 cursor-pointer z-10" onClick={prevStory}></div>
              <div className="absolute right-0 top-0 h-full w-1/3 cursor-pointer z-10" onClick={nextStory}></div>

              {/* Story content */}
              <div
                className="relative w-full aspect-[9/16] flex items-center justify-center bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden cursor-pointer"
                onClick={handleImageClick}
              >
                {renderMediaContent()}
              </div>

              {/* Action buttons */}
              <div className="absolute bottom-6 left-4 right-4 z-20">
                <div className="flex items-center justify-between bg-black/50 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center space-x-4">
                    <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all">
                      <FaHeart className="text-white text-lg" />
                    </button>
                    <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all">
                      <FaComment className="text-white text-lg" />
                    </button>
                    <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all">
                      <FaShare className="text-white text-lg" />
                    </button>
                  </div>

                  <div className="text-white text-sm">
                    {currentIndex + 1}/{selectedStory.stories.length}
                  </div>
                </div>
              </div>

              {/* Navigation arrows */}
              {currentIndex > 0 && (
                <button
                  onClick={prevStory}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all"
                >
                  <FaChevronLeft />
                </button>
              )}

              {currentIndex < (selectedStory.stories?.length - 1) && (
                <button
                  onClick={nextStory}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all"
                >
                  <FaChevronRight />
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  </>

  );
}