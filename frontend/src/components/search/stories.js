"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedStory, setSelectedStory] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const modalRef = useRef(null);
  const storyDuration = 10000;
  const slugify = (text) => text?.replace(/\s+/g, "-");
  const router = useRouter();


  useEffect(() => {
    async function fetchStories() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/story/`
        );

        setStories(res.data);
      } catch (err) {
        console.error("Erro ao buscar stories:", err);
      }
    }

    fetchStories();
  }, []);

  const openStory = (index) => {
    setSelectedStory(stories[index]);
    setCurrentIndex(index);
    setProgress(0);
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

  return (
    <>
      <div className="w-full py-4 px-4 bg-gray-50 shadow-md">
        <div className="flex overflow-x-auto space-x-4">
          {stories.map((story, index) => (
            <div key={index} className="w-20 flex-shrink-0 text-center">
              <div
                className="w-14 h-14 rounded-full overflow-hidden border-4 border-gradient-to-r from-pink-500 to-purple-500 cursor-pointer hover:scale-105 transform transition-transform duration-300"
                onClick={() => openStory(index)}
              >
                {story.companion?.profileImage ? (
                  <Image
                    src={story.companion.profileImage}
                    alt={story.companion?.userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-pink-600 font-bold text-2xl">
                    {story.companion?.userName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
              <span className="block mt-2 text-xs text-gray-700 font-medium max-w-[4.5rem] truncate mx-auto">
                {story.companion?.userName}
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

            <div
              className="absolute left-0 top-0 h-full w-1/2 cursor-pointer group"
              onClick={prevStory}
            >
              <div className="hidden md:flex justify-center items-center h-full">
                <div className="w-10 h-10 bg-black bg-opacity-50 rounded-full flex justify-center items-center group-hover:bg-opacity-70 transition">
                  <span className="text-white text-lg font-bold">&lt;</span>
                </div>
              </div>
            </div>

            <div
              className="absolute right-0 top-0 h-full w-1/2 cursor-pointer group"
              onClick={nextStory}
            >
              <div className="hidden md:flex justify-center items-center h-full">
                <div className="w-10 h-10 bg-black bg-opacity-50 rounded-full flex justify-center items-center group-hover:bg-opacity-70 transition">
                  <span className="text-white text-lg font-bold">&gt;</span>
                </div>
              </div>
            </div>

            <div
              className="flex-1 w-full flex items-center justify-center bg-black rounded-lg overflow-hidden cursor-pointer relative max-h-[80vh]"
              onClick={(e) => {
                const { clientX } = e;
                const elementWidth = e.currentTarget.offsetWidth;
                if (clientX > elementWidth / 2) {
                  nextStory();
                } else {
                  prevStory();
                }
              }}
              onDoubleClick={() => setIsPaused(true)}
              onMouseDown={() => setIsPaused(true)}
              onMouseUp={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              {selectedStory.mediaType === "video" ? (
                <video
                  src={selectedStory.url}
                  autoPlay
                  muted
                  className="max-h-[80vh] w-auto object-contain"
                />
              ) : (
                <Image
                  src={selectedStory.url}
                  alt={selectedStory.companion?.userName}
                  className="max-h-[80vh] w-auto object-contain"
                />
              )}
            </div>

            <div
                className="mt-4 flex flex-col items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  router.push(`/perfil/${slugify(selectedStory.companion?.userName)}`);
                  closeModal(); 
                }}
              >
                {selectedStory.companion?.profileImage ? (
                  <Image
                    src={selectedStory.companion.profileImage}
                    alt={selectedStory.companion?.userName}
                    className="w-14 h-14 object-cover rounded-full cursor-pointer"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gray-200 flex items-center justify-center text-pink-600 font-bold text-2xl rounded-full cursor-pointer">
                    {selectedStory.companion?.userName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}

              <h3 className="text-xl md:text-2xl font-semibold text-white">
                {selectedStory.companion?.userName}
              </h3>
              <p className="text-sm md:text-base text-gray-300 mt-2 text-center">
                {selectedStory.companion?.description}
              </p>
            </div>
            {/*
            <button className="mt-6 px-6 py-2 bg-green-500 text-white text-lg rounded-lg shadow-lg hover:bg-green-600 transition duration-300 flex items-center">
              <FaWhatsapp className="mr-2" />
              Ver Contato
            </button> */}
          </div>
        </div>
      )}
    </>
  );
}
