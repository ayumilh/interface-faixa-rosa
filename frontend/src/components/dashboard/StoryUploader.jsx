"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import Image from "next/image";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function StoryUploader() {
  const [stories, setStories] = useState([]);
  const userToken = Cookies.get("userToken");

  // Buscar stories da usuária
  useEffect(() => {
    async function fetchUserStories() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/story`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        if (res.data && Array.isArray(res.data)) {
          setStories(res.data);
        } else {
          toast.info("Nenhum story encontrado.");
        }
      } catch (err) {
        console.error("Erro ao buscar stories:", err);
        toast.error("Erro ao buscar seus stories.");
      }
    }

    if (userToken) {
      fetchUserStories();
    }
  }, [userToken]);

  // Envio de novo story
  const handleStoryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("media", file);
    formData.append("mediaType", file.type.startsWith("video") ? "video" : "image");

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

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
        setStories((prev) => [...prev, res.data]);
        toast.success("Story enviado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao enviar o story:", error);
      toast.error("Erro ao enviar o story.");
    }
  };

  return (
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
              {story.mediaType === "video" ? (
                <video
                  src={story.url}
                  className="w-full h-full object-cover rounded-lg"
                  muted
                  controls
                />
              ) : (
                <Image
                  src={story.url}
                  alt={`Story ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              )}
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
  );
}
