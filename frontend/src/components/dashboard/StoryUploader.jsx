"use client";

import { useEffect, useState, useRef, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { AuthContext } from '../context/AuthContext';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';

export default function StoryUploader() {
  const [stories, setStories] = useState([]);
  const [canPostStory, setCanPostStory] = useState(false);
  const inputRef = useRef(null);
  const userToken = Cookies.get('userToken');

  const { userInfo, fetchUserData } = useContext(AuthContext);

  // Verifica se pode postar story com base no plano
  useEffect(() => {
    if (!userInfo) {
      fetchUserData();
      return;
    }

    const isAcompanhante = userInfo.userType === "ACOMPANHANTE";

    const planId = userInfo?.companion?.planId;
    const subscriptions = userInfo?.companion?.subscriptions || [];

    const isVip = planId === 4;

    const hasExtraPlanWithStories = subscriptions.some(
      sub => sub?.extraPlan?.hasStories === true && sub?.extraPlan?.isEnabled
    );

    const allowedToPost = isAcompanhante && (!isVip || hasExtraPlanWithStories);

    setCanPostStory(allowedToPost);
  }, [userInfo, fetchUserData]);



  // Buscar stories da usuária
  async function fetchUserStories() {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/story`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (Array.isArray(res.data)) {
        setStories(res.data);
      } else {
        toast.info('Nenhum story encontrado.');
      }
    } catch (err) {
      console.error('Erro ao buscar stories:', err);
      toast.error('Erro ao buscar seus stories.');
    }
  }

  useEffect(() => {
    if (userToken) fetchUserStories();
  }, [userToken, fetchUserStories]);

  const handleStoryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('media', file);
    formData.append('mediaType', file.type.startsWith('video') ? 'video' : 'image');

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/story/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.data) {
        toast.success('Story enviado com sucesso!');
        fetchUserStories();
      }

    } catch (error) {
      console.error('Erro ao enviar story:', error);
      toast.error('Erro ao enviar o story.');
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/story/${id}/delete`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      setStories((prev) => prev.filter((s) => s.id !== id));
      toast.success('Story removido com sucesso!');
    } catch (err) {
      console.error('Erro ao remover story:', err);
      toast.error('Erro ao remover story.');
    }
  };

  return (
    <div className="mt-12">
      {canPostStory && (
        <>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Stories</h2>

          <div className="flex space-x-4 overflow-x-auto pb-2 custom-scrollbar">
            <div
              onClick={() => inputRef.current?.click()}
              className="min-w-[8rem] h-48 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:text-blue-500 text-gray-500 cursor-pointer transition-all duration-200"
              role="button"
              aria-label="Adicionar novo story"
            >
              <FaPlus className="text-2xl mb-1" />
              <span className="text-sm font-medium">Novo Story</span>
              <input
                type="file"
                accept="image/*,video/*"
                ref={inputRef}
                onChange={handleStoryUpload}
                className="hidden"
              />
            </div>

            {stories.map((story, index) => (
              <div
                key={index}
                className="relative min-w-[8rem] h-48 rounded-xl overflow-hidden bg-gray-100 shadow hover:shadow-lg transition-transform transform hover:scale-105 group"
              >
                <button
                  onClick={() => handleRemove(story.id)}
                  className="absolute top-1 right-1 bg-black bg-opacity-60 hover:bg-red-600 text-white p-1 rounded-full z-10"
                  aria-label="Remover story"
                >
                  <FaTrashAlt size={12} />
                </button>

                {story.mediaType === 'video' ? (
                  <video
                    src={story.url}
                    className="w-full h-full object-cover rounded-xl"
                    muted
                    controls
                    aria-label="Story em vídeo"
                  />
                ) : (
                  story.url ? (
                    <Image
                      src={story.url}
                      alt={`Story imagem ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                      Imagem inválida
                    </div>
                  )
                )}

                {story.caption && (
                  <div className="absolute bottom-0 left-0 right-0 text-white bg-black bg-opacity-60 text-xs px-2 py-1 truncate">
                    {story.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
