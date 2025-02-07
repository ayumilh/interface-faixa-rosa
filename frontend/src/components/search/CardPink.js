import React, { useState } from 'react';
import {
  FaWhatsapp,
  FaMapMarkerAlt,
  FaStar,
  FaRegComments,
  FaRegCopy,
  FaTelegram,
  FaCheckCircle,
  FaBirthdayCake,
  } from 'react-icons/fa';
import { BsCardText } from 'react-icons/bs';
import Image from 'next/image';

const CardVIP = ({
  name,
  price,
  location,
  description,
  reviews,
  contact,
  images,
  age,
}) => {
  const [showModalNumero, setShowModalNumero] = useState(false);

  const handleOpenModal = () => {
    setShowModalNumero(true);
  };

  const handleCloseModal = (e) => {
    if (e.target.id === 'modal-overlay') {
      setShowModalNumero(false);
    }
  };

  return (
    <>
      <div className="bg-pink border border-pink-600 rounded-lg shadow-2xl p-4 relative transition transform hover:scale-105 hover:shadow-2xl">
        {images && images.length > 0 ? (
          <Image
            src={images[0]}
            alt={name}
            width={320}
            height={192}
            className="w-full h-48 object-cover rounded-md mb-3"
          />
        ) : (
          <div className="w-full h-48 bg-black-800 rounded-md mb-3 flex items-center justify-center text-black-500 text-lg">
            Sem imagem disponível
          </div>
        )}
        <h3 className="text-xl font-extrabold text-pink-400 mb-1">{name}</h3>

        
    {/* Exibição da idade */}
    {age && (
          <p className="text-gray-500 mb-1 flex items-center">
            <FaBirthdayCake className="mr-2 text-red-400" /> {age} anos
          </p>
        )}

<p className="text-sm text-black italic mb-2 flex items-center">
          <BsCardText className="mr-2 text-pink-500" /> {description}
        </p>
         {/* Exibição da idade com ícone */}
      <p className="flex items-center text-black mb-2">
        <FaBirthdayCake className="mr-2 text-red-400" /> {age} anos
      </p>

        <p className="text-black-500 mb-1 flex items-center">
          <FaMapMarkerAlt className="mr-2 text-pink-400" /> {location}
        </p>
        <p className="font-semibold text-pink-400 mb-1 flex items-center">
          <FaStar className="mr-1 text-yellow-500" /> {price}
        </p>
        <p className="text-gray-400 mb-3 flex items-center">
          <FaRegComments className="mr-1 text-pink-500" />
          {reviews > 0 ? (
            <span className="text-green-500">
              {reviews} review{reviews !== 1 ? 's' : ''}
            </span>
          ) : (
            <span className="text-black-400">Sem reviews</span>
          )}
        </p>
        {contact && (
          <button
            className="mt-2 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg flex items-center justify-center w-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={handleOpenModal}
          >
            <FaWhatsapp className="mr-2 text-lg" /> Ver contato
          </button>
        )}
      </div>

      {showModalNumero && (
        <div
          id="modal-overlay"
          className="fixed inset-0 flex items-center justify-center bg-pink bg-opacity-50 z-50"
          onClick={handleCloseModal}
        >
          <div className="relative bg-pink-100 p-4 rounded-lg shadow-lg max-w-md w-full mx-4 border border-pink-500">
          {/* Carrossel de foto */}
            <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
              <div className="w-full h-48 bg-gray-800 flex-shrink-0">
                <Image
                  src={images[0]}
                  alt={`Foto de ${name}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>

            {/* Imagem de perfil e nome */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative w-20 h-20 rounded-full border-4 border-pink-500 shadow-md overflow-hidden">
                <Image
                  src="/assets/mulher.png"
                  alt="Foto de perfil"
                  layout="fill"
                  objectFit="cover"
                />
                <FaCheckCircle className="absolute bottom-0 right-0 text-green-500 text-xl" />
              </div>
              <h2 className="text-xl text-pink-400 font-bold mt-2">{name}</h2>
            </div>

            {/* Banner Google simulado */}
            <div className="bg-pink-600 p-2 rounded-md mb-4">
              <p className="text-center text-gray-200 font-semibold">
                Banner GOOGLE
              </p>
            </div>

            {/* Informações de telefone com ícone de copiar */}
            <div className="bg-pink-600 p-4 rounded-md mb-4 shadow-inner flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-200">Telefone:</p>
                <p className="text-lg text-white">(00) 00000-0000</p>
              </div>
              <button className="text-gray-300 hover:text-white">
                <FaRegCopy className="text-xl" />
              </button>
            </div>

            {/* Botões de ação */}
            <div className="flex justify-around mt-4 space-x-3">
              <button className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105">
                <FaWhatsapp />
                <span>WhatsApp</span>
              </button>
              <button className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-transform transform hover:scale-105">
                <span>Ligar</span>
              </button>
              <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105">
                <FaTelegram />
                <span>Telegram</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CardVIP;
