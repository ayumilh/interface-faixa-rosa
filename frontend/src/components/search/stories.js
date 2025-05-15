"use client";
import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import Image from "next/image";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Stories() {
  const { userInfo, fetchUserData } = useContext(AuthContext);
  const userToken = Cookies.get("userToken");
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedStory, setSelectedStory] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();
  const storyDuration = 10000;
  const imageRef = useRef(null);

  useEffect(() => {
    if (!userInfo) fetchUserData();
  }, [userInfo, fetchUserData]);

  const groupStoriesByUser = (stories) => {
    const grouped = {};
    stories.forEach((story) => {
      const userName = story.companion.userName;
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
    if (userInfo) {
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
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/story/`);
      const grouped = groupStoriesByUser(res.data || []);
      setStories(grouped);

      // Atualiza selectedStory se o grupo ainda existir
      if (selectedStory) {
        const updatedGroup = grouped.find(
          (g) => g.companion.userName === selectedStory.companion.userName
        );
        if (updatedGroup) {
          setSelectedStory(updatedGroup);
        } else {
          setSelectedStory(null); // ou manter como estava
        }
      }
    } catch (err) {
      console.error("Erro ao buscar stories:", err);
    }
  }


  useEffect(() => {
    fetchStories();
  }, []);

  const handleStoryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !userToken) return;

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
      toast.error("Erro ao enviar story.");
    }
  };

  const handleDeleteStory = async (id) => {
    const storyId = selectedStory.stories[currentIndex]?.id;
    if (!storyId || !userToken) return;

    const confirm = window.confirm("Tem certeza que deseja deletar este story?");
    if (!confirm) return;

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
  };

  const nextStory = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent?.stopImmediatePropagation();

    const currentStories = selectedStory?.stories || [];

    if (currentIndex < currentStories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      // Ir para o próximo grupo
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

  const prevStory = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent?.stopImmediatePropagation();

    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    } else {
      // Ir para o grupo anterior
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

  useEffect(() => {
    if (selectedStory && !isPaused) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            const currentStories = selectedStory?.stories || [];
            if (currentIndex < currentStories.length - 1) {
              setCurrentIndex(currentIndex + 1);
            } else {
              const currentGroupIndex = stories.findIndex(
                (group) => group.companion.userName === selectedStory.companion.userName
              );
              if (currentGroupIndex < stories.length - 1) {
                const nextGroup = stories[currentGroupIndex + 1];
                setSelectedStory(nextGroup);
                setCurrentIndex(0);
              } else {
                closeModal();
              }
            }
            return 0;
          }

          return prev + 1;
        });
      }, storyDuration / 100);
      return () => clearInterval(interval);
    }
  }, [selectedStory, isPaused]);

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageClick = (e) => {
    e.stopPropagation();
    const { clientX } = e;
    const width = e.currentTarget.offsetWidth;
    clientX > width / 2 ? nextStory() : prevStory();
  };

  const renderMediaContent = () => {
    if (selectedStory) {
      const story = selectedStory.stories[currentIndex];
      const { url, mediaType } = story;

      if (mediaType === "video" && url)
        return <video src={url} autoPlay muted className="max-h-[80vh] w-auto object-contain" />;
      else if (mediaType === "image" && url)
        return (
          <Image
            src={url}
            alt={selectedStory.userName || "Desconhecido"}
            width={500}
            height={800}
            className="max-h-[80vh] w-auto object-contain"
          />
        );
    }
    return <div className="text-white">Carregando...</div>;
  };

  return (
    <>
      <div className="w-full py-4 px-4 bg-gray-50 shadow-md">
        <div className="flex overflow-x-auto space-x-4 items-center">
          {userInfo?.userType === "ACOMPANHANTE" && (
            <div className="w-20 flex-shrink-0 text-center">
              <label className="w-16 h-16 rounded-full p-[2px] mx-auto bg-gradient-to-r from-pink-400 via-pink-700 to-pink-300 flex items-center justify-center cursor-pointer hover:animate-spin-slow">
                <div className="w-full h-full rounded-full bg-white text-pink-500 text-3xl flex items-center justify-center">
                  +
                </div>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  ref={inputRef}
                  onChange={handleStoryUpload}
                />
              </label>
              <span className="block mt-2 text-xs text-gray-700 font-medium max-w-[4.5rem] truncate mx-auto">
                Adicionar
              </span>
            </div>
          )}

          {stories.map((storyGroup, index) => (
            <div key={index} className="w-20 flex-shrink-0 text-center">
              <div
                className="w-14 h-14 rounded-full overflow-hidden border-4 border-gradient-to-r from-pink-500 to-purple-500 cursor-pointer hover:scale-105 transform transition-transform duration-300"
                onClick={() => openStory(index)}
              >
                {storyGroup.companion?.profileImage ? (
                  <Image
                    src={storyGroup.companion.profileImage || "/default-avatar.jpg"}
                    alt={storyGroup.companion.userName || "Desconhecido"}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-pink-600 font-bold text-2xl">
                    {storyGroup.companion?.userName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
              <span className="block mt-2 text-xs text-gray-700 font-medium max-w-[4.5rem] truncate mx-auto">
                {storyGroup.companion?.userName || "Desconhecido"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm transition-opacity duration-300">
          <div
            className="bg-gray-800 w-full max-w-sm md:max-w-2xl p-6 rounded-xl shadow-lg relative flex flex-col items-center max-h-[90vh] overflow-y-auto"
            ref={modalRef}
          >
            <div
              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500"
              style={{ width: `${progress}%` }}
            ></div>

            {selectedStory?.companion?.userName === userInfo?.userName && (
              <button
                onClick={() => handleDeleteStory(selectedStory.stories[currentIndex]?.id)}
                className="absolute top-10 right-10 z-[9999] bg-red-600 hover:bg-red-700 text-white text-lg font-bold px-3 py-2 rounded-full shadow-lg transition-all"
                aria-label="Deletar story"
              >
                Deletar
              </button>
            )}
            <div
              className="absolute left-0 top-0 h-full w-1/2 cursor-pointer group z-50"
              onClick={prevStory}
              ref={imageRef}
            >
              <div className="hidden md:flex justify-center items-center h-full">
                <div className="w-10 h-10 bg-black bg-opacity-50 rounded-full group-hover:bg-opacity-70 transition flex items-center justify-center">
                  <span className="text-white text-lg font-bold">&lt;</span>
                </div>
              </div>
            </div>

            <div
              className="absolute right-0 top-0 h-full w-1/2 cursor-pointer group z-50"
              onClick={nextStory}
              ref={imageRef}
            >
              <div className="hidden md:flex justify-center items-center h-full">
                <div className="w-10 h-10 bg-black bg-opacity-50 rounded-full group-hover:bg-opacity-70 transition flex items-center justify-center">
                  <span className="text-white text-lg font-bold">&gt;</span>
                </div>
              </div>
            </div>


            <div
              className="absolute right-0 top-0 h-full w-1/2 cursor-pointer group"
              onClick={nextStory}
            >
              <div className="hidden md:flex justify-center items-center h-full">
                <div className="w-10 h-10 bg-black bg-opacity-50 rounded-full group-hover:bg-opacity-70 transition flex items-center justify-center">
                  <span className="text-white text-lg font-bold">&gt;</span>
                </div>
              </div>
            </div>

            <div
              ref={imageRef}
              className="flex-1 w-full flex items-center justify-center bg-black rounded-lg overflow-hidden cursor-pointer relative max-h-[80vh]"
              onClick={handleImageClick}
            >
              {renderMediaContent()}
            </div>

            <div
              className="mt-4 flex flex-col items-center"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/perfil/${slugify(selectedStory.companion?.userName)}`);
                closeModal();
              }}
            >
              {selectedStory.companion?.profileImage ? (
                <Image
                  src={selectedStory.companion.profileImage}
                  alt={selectedStory.companion?.userName || "Desconhecido"}
                  width={56}
                  height={56}
                  className="w-14 h-14 object-cover rounded-full cursor-pointer"
                />
              ) : (
                <div className="w-14 h-14 bg-gray-200 flex items-center justify-center text-pink-600 font-bold text-2xl rounded-full cursor-pointer">
                  {selectedStory.companion?.userName?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
              <h3 className="text-xl md:text-2xl font-semibold text-white">
                {selectedStory.companion?.userName || "Desconhecido"}
              </h3>
              <p className="text-sm md:text-base text-gray-300 mt-2 text-center">
                {selectedStory.companion?.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
