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

  const imageRef = useRef(null); // Ref para a imagem

  useEffect(() => {
    if (!userInfo) {
      fetchUserData();
    }
  }, [userInfo, fetchUserData]);

  const groupStoriesByUser = (stories) => {
    const groupedStories = {};
    stories.forEach((story) => {
      const userName = story.companion.userName;
      if (!groupedStories[userName]) {
        groupedStories[userName] = {
          ...story.companion, 
          stories: [story], 
        };
      } else {
        groupedStories[userName].stories.push(story); 
      }
    });
    return Object.values(groupedStories);
  };

  useEffect(() => {
    async function fetchStories() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/story/`
        );
        const groupedStories = groupStoriesByUser(res.data || []);
        setStories(groupedStories);
      } catch (err) {
        console.error("Erro ao buscar stories:", err);
      }
    }
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
        const updatedStory = {
          ...res.data,
          companion: {
            ...res.data.companion,
            userName: userInfo.userName,
            profileImage: res.data.companion.profileImage || "/default-avatar.jpg", // Default fallback if no image
          }
        };
        setStories((prev) => [updatedStory, ...prev]);
        toast.success("Story enviado com sucesso!");
      }
    } catch (err) {
      console.error("Erro ao enviar story:", err);
      toast.error("Erro ao enviar story.");
    }
  };

  const slugify = (text) => text?.replace(/\s+/g, "-").toLowerCase();

  const openStory = (index) => {
    setSelectedStory(stories[index]);
    setCurrentIndex(index);
    setProgress(0);
    console.log("Story selecionado:", stories[index]);  // Verifique os dados de selectedStory aqui
  };

  const closeModal = () => {
    setSelectedStory(null);
    setProgress(0);
  };

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      openStory(currentIndex + 1);
    } else {
      closeModal();
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      openStory(currentIndex - 1);
    }
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
  }, [selectedStory, isPaused]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Função para avançar história ao clicar na imagem
  const handleImageClick = (e) => {
    e.stopPropagation(); // Impede o evento de propagação para outros elementos
    const { clientX } = e;
    const width = e.currentTarget.offsetWidth;
    clientX > width / 2 ? nextStory() : prevStory();
  };

  // Verificação se o selectedStory possui uma URL válida antes de tentar renderizar
  const renderMediaContent = () => {
    if (selectedStory) {
      const story = selectedStory.stories[currentIndex];  // Seleciona a história correta
      const { url, mediaType } = story;

      if (mediaType === "video" && url) {
        return <video src={url} autoPlay muted className="max-h-[80vh] w-auto object-contain" />;
      } else if (mediaType === "image" && url) {
        return <Image src={url} alt={selectedStory.userName || "Desconhecido"} width={500} height={800} className="max-h-[80vh] w-auto object-contain" />;
      } else {
        return <div className="text-white">Imagem ou vídeo não encontrado</div>;
      }
    }
    return <div className="text-white">Carregando...</div>;
  };

  return (
    <>
      <div className="w-full py-4 px-4 bg-gray-50 shadow-md">
        <div className="flex overflow-x-auto space-x-4">
          {userInfo?.userType === "ACOMPANHANTE" && (
            <div className="w-20 flex-shrink-0 text-center">
              <div
                className="w-16 h-16 rounded-full p-[2px] mx-auto bg-gradient-to-r from-pink-400 via-pink-700 to-pink-300 hover:animate-spin-slow"
                onClick={() => inputRef.current?.click()}
              >
                <div className="w-full h-full rounded-full bg-white text-pink-500 text-3xl flex items-center justify-center cursor-pointer">
                  +
                </div>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  ref={inputRef}
                  onChange={handleStoryUpload}
                />
              </div>
              <span className="block mt-2 text-xs text-gray-700 font-medium max-w-[4.5rem] truncate mx-auto">
                Seu Story
              </span>
            </div>
          )}

          {stories.map((storyGroup, index) => (
            <div key={index} className="w-20 flex-shrink-0 text-center">
              <div
                className="w-14 h-14 rounded-full overflow-hidden border-4 border-gradient-to-r from-pink-500 to-purple-500 cursor-pointer hover:scale-105 transform transition-transform duration-300"
                onClick={() => openStory(index)}
              >
                {storyGroup.profileImage ? (
                  <Image
                    src={storyGroup.profileImage || "/default-avatar.jpg"}  // Default fallback if no image
                    alt={storyGroup.userName || "Desconhecido"}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-pink-600 font-bold text-2xl">
                    {storyGroup.userName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
              <span className="block mt-2 text-xs text-gray-700 font-medium max-w-[4.5rem] truncate mx-auto">
                {storyGroup.userName || "Desconhecido"}
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

            <div className="absolute left-0 top-0 h-full w-1/2 cursor-pointer group" onClick={prevStory}>
              <div className="hidden md:flex justify-center items-center h-full">
                <div className="w-10 h-10 bg-black bg-opacity-50 rounded-full group-hover:bg-opacity-70 transition flex items-center justify-center">
                  <span className="text-white text-lg font-bold">&lt;</span>
                </div>
              </div>
            </div>

            <div className="absolute right-0 top-0 h-full w-1/2 cursor-pointer group" onClick={nextStory}>
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
              {renderMediaContent()} {/* Chama a função que renderiza o conteúdo */}
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
