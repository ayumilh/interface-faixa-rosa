import React, { useState } from 'react';
import {
  FaWhatsapp,
  FaMapMarkerAlt,
  FaStar,
  FaCamera,
  FaCheckCircle,
  FaBirthdayCake,
  FaRegCopy,
  FaTelegram,
  FaChevronLeft,
  FaChevronRight,
  FaPhone,
} from 'react-icons/fa';
import Image from 'next/image';

const defaultServices = [
  'Massagem relaxante',
  'Atendimento VIP',
  'Acompanhamento para eventos',
  'Serviços personalizados',
];

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="relative">
      {images.length > 0 ? (
        <>
          <Image
            src={images[currentIndex].url} // Usando diretamente o array de imagens
            alt={`Imagem ${currentIndex + 1}`}
            layout="responsive"
            width={500}
            height={300}
            className="rounded-md mb-4"
          />
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-700 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition"
            aria-label="Imagem anterior"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-700 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition"
            aria-label="Próxima imagem"
          >
            <FaChevronRight />
          </button>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <span
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? 'bg-gray-700' : 'bg-gray-300'
                } transition-all`}
              ></span>
            ))}
          </div>
        </>
      ) : (
        <div className="w-full h-56 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-500">
          Sem imagem disponível
        </div>
      )}
    </div>
  );
};

const CardRubi = ({
  name,
  age,
  location,
  description,
  images,
  contact,
  plan,
  planType,
}) => {
  const [showModalNumero, setShowModalNumero] = useState(false);

  console.log('CardRubi', { name, age, location, description, images, contact, plan, planType });

  const handleOpenModal = () => {
    setShowModalNumero(true);
  };

  const formattedPrice = plan ? plan.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'A consultar';

  return (
    <div className="bg-white border border-red-500 rounded-xl shadow-lg p-6 relative transition transform hover:scale-105 hover:shadow-xl">
      {/* Carrossel de Imagens */}
      <ImageCarousel images={images} />

      {/* Nome e Status */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold text-red-600">{name}</h3>
        <div className="flex items-center">
          <span className="animate-pulse bg-green-500 w-2 h-2 rounded-full mr-2"></span>
          <span className="text-sm text-green-600">Online</span>
        </div>
      </div>

      {/* Descrição curta */}
      <p className="text-sm italic text-gray-600 mb-3">{description}</p>

      {/* Informações */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <p className="font-semibold text-red-600">{formattedPrice}</p>
          <div className="flex items-center mt-2">
            <FaStar className="text-yellow-400 mr-1" />
            <p className="text-green-500 font-semibold">2 reviews</p>
          </div>
          <div className="flex items-center mt-2">
            <FaBirthdayCake className="text-pink-500 mr-1" />
            <div className="bg-gray-100 text-black px-2 py-1 rounded-full text-xs font-medium">
              {age} anos
            </div>
          </div>
          <div className="flex items-center mt-2">
            <FaCamera className="text-red-500 mr-1" />
            <p className="text-black">{images.length} fotos ou vídeos</p>
          </div>
          <div className="flex items-center mt-2">
            <FaMapMarkerAlt className="text-red-500 mr-1" />
            <p className="text-black">{location}</p>
          </div>
        </div>

        {/* Descrição detalhada e Serviços */}
        <div className="border-l border-gray-300 pl-4">
          <p className="text-black mb-2">{description}</p>
          <p className="text-black font-semibold mb-1">Plano:</p>
          <p className="text-black">Plano: {plan.name}</p>
          <p className="text-black">Tamanho: {planType.size}</p>
        </div>
      </div>

      {/* Botão de contato aprimorado */}
      {contact && (
        <button
          className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-2 px-6 rounded-full flex items-center justify-center font-semibold transition-all shadow-md hover:shadow-lg text-lg"
          onClick={handleOpenModal}
          aria-label="Ver contato"
        >
          <FaWhatsapp className="mr-2" /> Ver contato
        </button>
      )}

      {/* Modal de contato */}
      {showModalNumero && (
        <ModalContato
          name={name}
          images={images}
          setShowModalNumero={setShowModalNumero}
        />
      )}
    </div>
  );
};

export default CardRubi;
