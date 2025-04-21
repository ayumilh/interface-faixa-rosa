"use client";

import { useState } from "react";
import { 
  FaMapMarkerAlt, 
  FaHeart, 
  FaShareAlt, 
  FaVideo, 
  FaImage, 
  FaTransgender, 
  FaMale, 
  FaFemale 
} from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Footer from "@/components/search/footer";
import Final from "@/components/search/final"; // Componente de Final

export default function AcompanhantesBrasil() {
  const [filter, setFilter] = useState("mulheres");
  const [view, setView] = useState("videos");

  // Exemplo de dados para curtidas (pode ser movido para um banco de dados no futuro)
  const [likes, setLikes] = useState({
    video1: 120,
    video2: 85,
    video3: 95,
    photo1: 76,
    photo2: 89,
    photo3: 102,
  });

  const handleLike = (itemId) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [itemId]: prevLikes[itemId] + 1,
    }));
  };

  const handleShare = () => {
    alert("Link compartilhado com sucesso!");
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8 text-center">
        {/* Título */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mt-16 mb-8">
          Acompanhantes pelo Brasil
        </h1>

        {/* Filtros de Gênero */}
        {/* <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setFilter("mulheres")}
            className={`py-2 px-4 rounded-full flex items-center space-x-2 ${
              filter === "mulheres" ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-600"
            } focus:outline-none`}
          >
            <FaFemale /> <span>Mulheres</span>
          </button>
          <button
            onClick={() => setFilter("homens")}
            className={`py-2 px-4 rounded-full flex items-center space-x-2 ${
              filter === "homens" ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-600"
            } focus:outline-none`}
          >
            <FaMale /> <span>Homens</span>
          </button>
          <button
            onClick={() => setFilter("trans")}
            className={`py-2 px-4 rounded-full flex items-center space-x-2 ${
              filter === "trans" ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-600"
            } focus:outline-none`}
          >
            <FaTransgender /> <span>Trans</span>
          </button>
        </div> */}

        {/* Botões de Exibição */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setView("videos")}
            className={`py-2 px-4 rounded-full flex items-center space-x-2 ${
              view === "videos" ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-600"
            } focus:outline-none`}
          >
            <FaVideo /> <span>Vídeos</span>
          </button>
          <button
            onClick={() => setView("fotos")}
            className={`py-2 px-4 rounded-full flex items-center space-x-2 ${
              view === "fotos" ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-600"
            } focus:outline-none`}
          >
            <FaImage /> <span>Fotos</span>
          </button>
        </div>

        {/* Conteúdo baseado na seleção */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {view === "videos" ? (
            <>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="relative pb-56 h-0">
                  <video className="absolute top-0 left-0 w-full h-full rounded-lg" controls>
                    <source src="/path/to/video1.mp4" type="video/mp4" />
                  </video>
                </div>
                <h3 className="text-lg font-semibold mt-4">Yuna Takeuchi</h3>
                <p className="text-sm text-gray-600 flex items-center">
                  <FaMapMarkerAlt className="mr-1" /> Divinópolis - MG
                </p>
                <div className="flex items-center justify-between mt-2">
                  <button onClick={() => handleLike("video1")} className="text-gray-600 flex items-center">
                    <FaHeart className="mr-1" /> {likes.video1}
                  </button>
                  <button onClick={handleShare} className="text-pink-500 flex items-center">
                    <FaShareAlt className="mr-1" /> Compartilhar
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="relative pb-56 h-0">
                  <video className="absolute top-0 left-0 w-full h-full rounded-lg" controls>
                    <source src="/path/to/video2.mp4" type="video/mp4" />
                  </video>
                </div>
                <h3 className="text-lg font-semibold mt-4">Camila Souza</h3>
                <p className="text-sm text-gray-600 flex items-center">
                  <FaMapMarkerAlt className="mr-1" /> São Paulo - SP
                </p>
                <div className="flex items-center justify-between mt-2">
                  <button onClick={() => handleLike("video2")} className="text-gray-600 flex items-center">
                    <FaHeart className="mr-1" /> {likes.video2}
                  </button>
                  <button onClick={handleShare} className="text-pink-500 flex items-center">
                    <FaShareAlt className="mr-1" /> Compartilhar
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="relative pb-56 h-0">
                  <video className="absolute top-0 left-0 w-full h-full rounded-lg" controls>
                    <source src="/path/to/video3.mp4" type="video/mp4" />
                  </video>
                </div>
                <h3 className="text-lg font-semibold mt-4">Renata Costa</h3>
                <p className="text-sm text-gray-600 flex items-center">
                  <FaMapMarkerAlt className="mr-1" /> Rio de Janeiro - RJ
                </p>
                <div className="flex items-center justify-between mt-2">
                  <button onClick={() => handleLike("video3")} className="text-gray-600 flex items-center">
                    <FaHeart className="mr-1" /> {likes.video3}
                  </button>
                  <button onClick={handleShare} className="text-pink-500 flex items-center">
                    <FaShareAlt className="mr-1" /> Compartilhar
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <Image src="" alt="Carla Dias" width={368} height={224} className="rounded-lg w-[256px] md:w-[324px] lg:w-[368px] h-56 object-cover" />
                <h3 className="text-lg font-semibold mt-4">Carla Dias</h3>
                <p className="text-sm text-gray-600 flex items-center">
                  <FaMapMarkerAlt className="mr-1" /> Salvador - BA
                </p>
                <div className="flex items-center justify-between mt-2">
                  <button onClick={() => handleLike("photo1")} className="text-gray-600 flex items-center">
                    <FaHeart className="mr-1" /> {likes.photo1}
                  </button>
                  <button onClick={handleShare} className="text-pink-500 flex items-center">
                    <FaShareAlt className="mr-1" /> Compartilhar
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md">
                <Image src="/path/to/photo2.jpg" alt="Juliana Mendes" width={368} height={224} className="rounded-lg w-full h-56 object-cover" />
                <h3 className="text-lg font-semibold mt-4">Juliana Mendes</h3>
                <p className="text-sm text-gray-600 flex items-center">
                  <FaMapMarkerAlt className="mr-1" /> Curitiba - PR
                </p>
                <div className="flex items-center justify-between mt-2">
                  <button onClick={() => handleLike("photo2")} className="text-gray-600 flex items-center">
                    <FaHeart className="mr-1" /> {likes.photo2}
                  </button>
                  <button onClick={handleShare} className="text-pink-500 flex items-center">
                    <FaShareAlt className="mr-1" /> Compartilhar
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md">
                <Image src="/path/to/photo3.jpg" alt="Patrícia Almeida" width={368} height={224} className="rounded-lg w-full h-56 object-cover" />
                <h3 className="text-lg font-semibold mt-4">Patrícia Almeida</h3>
                <p className="text-sm text-gray-600 flex items-center">
                  <FaMapMarkerAlt className="mr-1" /> Fortaleza - CE
                </p>
                <div className="flex items-center justify-between mt-2">
                  <button onClick={() => handleLike("photo3")} className="text-gray-600 flex items-center">
                    <FaHeart className="mr-1" /> {likes.photo3}
                  </button>
                  <button onClick={handleShare} className="text-pink-500 flex items-center">
                    <FaShareAlt className="mr-1" /> Compartilhar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
      <Final />
    </div>
  );
}
