"use client";
import React, { useState, memo, use } from "react";
import { FaPlus, FaCamera, FaVideo, FaEdit, FaSpinner } from "react-icons/fa";
import Modal from "@/components/dashboard/Modal";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";


const MediaManagement = memo(({ onUpload }) => {
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState("fotos");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }, []);
  const openUploadModal = () => {
    setIsModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Carregamento com ícone de fogo */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center z-50">
          <Image
            src="/iconOficial_faixaRosa.png"
            alt="Ícone oficial Faixa Rosa"
            width={50}
            height={50}
            className="animate-pulse"
          />
        </div>
      )}
      <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
        <FaCamera className="text-pink-500 mr-2" />
        Gerenciamento de Mídia
      </h2>
      <div className="flex space-x-4 mb-4">
        {["fotos", "videos", "stories"].map((type) => (
          <button
            key={type}
            onClick={() => setActiveMedia(type)}
            className={`px-4 py-2 rounded-full transition flex items-center space-x-2 ${activeMedia === type
              ? "bg-pink-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {type === "fotos" && <FaCamera />}
            {type === "videos" && <FaVideo />}
            {type === "stories" && <FaEdit />}
            <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
          </button>
        ))}
      </div>
      <button
        onClick={openUploadModal}
        className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-full shadow hover:bg-green-600 transition"
      >
        <FaPlus />
        <span>Adicionar {activeMedia}</span>
      </button>

      {/* Modal de Upload */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal
            onClose={closeUploadModal}
            title={`Adicionar ${activeMedia.charAt(0).toUpperCase() + activeMedia.slice(1)}`}
            description={`Faça upload de novos ${activeMedia}.`}
          >
            <UploadForm mediaType={activeMedia} onUpload={onUpload} closeModal={closeUploadModal} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
});
MediaManagement.displayName = "MediaManagement";

const UploadForm = ({ mediaType, onUpload, closeModal }) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsUploading(true);
    // Simulação de upload
    setTimeout(() => {
      const uploadedFiles = Array.from(files).map((file) => URL.createObjectURL(file));
      onUpload(uploadedFiles, mediaType);
      setIsUploading(false);
      closeModal();
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="file"
        accept={mediaType === "videos" ? "video/*" : "image/*"}
        multiple
        onChange={handleFileChange}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
      <button
        type="submit"
        className="w-full flex items-center justify-center space-x-2 bg-pink-500 text-white py-2 rounded-full hover:bg-pink-600 transition"
        disabled={isUploading}
      >
        {isUploading ? (
          <div className="flex items-center space-x-2">
            <FaSpinner className="animate-spin" />
            <span>Carregando...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <FaPlus />
            <span>Upload</span>
          </div>
        )}
      </button>
    </form>
  );
};

export default MediaManagement;
