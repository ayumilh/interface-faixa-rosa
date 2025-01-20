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
    setCurrentIndex(
      prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1)
    );
  };

  const handleNext = () => {
    setCurrentIndex(
      prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1)
    );
  };

  return (
    <div className="relative">
      {images.length > 0 ? (
        <>
          <Image
            src={images[currentIndex]}
            alt={`Imagem ${currentIndex + 1}`}
            layout="responsive"
            width={500}
            height={300}
            className="rounded-md mb-4"
          />
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-300 bg-black hover:bg-gray-700 rounded-full p-2 shadow-md transition"
            aria-label="Imagem anterior"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-300 bg-black hover:bg-gray-700 rounded-full p-2 shadow-md transition"
            aria-label="Próxima imagem"
          >
            <FaChevronRight />
          </button>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <span
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? 'bg-gray-300' : 'bg-gray-700'
                } transition-all`}
              ></span>
            ))}
          </div>
        </>
      ) : (
        <div className="w-full h-56 bg-gray-800 rounded-md mb-4 flex items-center justify-center text-gray-500">
          Sem imagem disponível
        </div>
      )}
    </div>
  );
};

const ModalContato = ({
  name,
  images,
  setShowModalNumero,
  phoneNumber = '(00) 00000-0000',
}) => {
  const [currentIndexModal, setCurrentIndexModal] = useState(0);

  const handlePrevModal = () => {
    setCurrentIndexModal(
      prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1)
    );
  };

  const handleNextModal = () => {
    setCurrentIndexModal(
      prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1)
    );
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(phoneNumber);
    alert('Número copiado para a área de transferência!');
  };

  const handleCloseModal = e => {
    if (e.currentTarget === e.target) {
      setShowModalNumero(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
      onClick={handleCloseModal}
    >
      <div className="bg-black p-6 rounded-lg shadow-lg max-w-md w-full">
        {/* Carrossel de Imagens no Modal */}
        <div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg">
          {images.length > 0 ? (
            <>
              <Image
                src={images[currentIndexModal]}
                alt={`Foto de ${name}`}
                layout="fill"
                objectFit="cover"
              />
              <button
                onClick={handlePrevModal}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-300 bg-black hover:bg-gray-700 rounded-full p-2 shadow-md transition"
                aria-label="Imagem anterior"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={handleNextModal}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-300 bg-black hover:bg-gray-700 rounded-full p-2 shadow-md transition"
                aria-label="Próxima imagem"
              >
                <FaChevronRight />
              </button>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentIndexModal
                        ? 'bg-gray-300'
                        : 'bg-gray-700'
                    } transition-all`}
                  ></span>
                ))}
              </div>
            </>
          ) : (
            <div className="w-full h-56 bg-gray-800 rounded-md flex items-center justify-center text-gray-500">
              Sem imagem disponível
            </div>
          )}
        </div>

        {/* Foto de perfil e nome */}
        <div className="flex flex-col items-center mb-4">
        <div className="relative w-24 h-24 rounded-full border-4 border-transparent bg-gradient-to-r from-red-600 via-pink-500 to-red-600 hover:from-pink-600 hover:via-red-500 hover:to-pink-600 shadow-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105">
            <Image
              src={images[0] || '/assets/default-profile.png'}
              alt="Foto de perfil"
              layout="fill"
              objectFit="cover"
            />
            <FaCheckCircle className="absolute bottom-1 right-1 text-green-500 text-2xl" />
          </div>
          <h2 className="text-2xl text-white font-bold mt-2">{name}</h2>
        </div>

        {/* Espaço para anúncio */}
        <div className="bg-gray-800 p-4 rounded-md mb-4">
          <p className="text-center text-gray-400 font-semibold">
            Espaço para anúncio
          </p>
        </div>

        {/* Informações de telefone com botão de copiar */}
        <div className="bg-gray-900 p-4 rounded-md mb-4 shadow-inner flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-400">Telefone:</p>
            <p className="text-xl text-white">{phoneNumber}</p>
          </div>
          <button
            className="text-gray-500 hover:text-white"
            onClick={handleCopyNumber}
            aria-label="Copiar número"
          >
            <FaRegCopy className="text-2xl" />
          </button>
        </div>

        {/* Botões de ação */}
        <div className="flex justify-around mt-4 space-x-3">
          <button className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition transform hover:scale-105">
            <FaWhatsapp />
            <span>WhatsApp</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition transform hover:scale-105">
            <FaPhone />
            <span>Ligar</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition transform hover:scale-105">
            <FaTelegram />
            <span>Telegram</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const CardComponent = ({
  name = 'Nome da Modelo',
  price = 250,
  reviews = 2,
  location = 'Jardins, São Paulo',
  description = 'Descrição breve sobre a modelo.',
  age = 25,
  images = [],
  hasLocation = true,
  isOnline = true,
  contact = true,
  services = [],
  phoneNumber = '(00) 00000-0000',
}) => {
  const [showModalNumero, setShowModalNumero] = useState(false);

  const formattedPrice = price
    ? price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }) + ''
    : 'A consultar';

  const handleOpenModal = () => {
    setShowModalNumero(true);
  };

  // Defina a função handleCloseModal aqui
  const handleCloseModal = e => {
    if (e.currentTarget === e.target) {
      setShowModalNumero(false);
    }
  };

  return (
    <>
      <div className="bg-black border border-red-500 rounded-xl shadow-lg p-6 relative transition transform hover:scale-105 hover:shadow-xl">
        {/* Carrossel de Imagens */}
        <ImageCarousel images={images} />

        {/* Nome e Status */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          {isOnline ? (
            <div className="flex items-center">
              <span className="animate-pulse bg-green-500 w-2 h-2 rounded-full mr-2"></span>
              <span className="text-sm text-green-500">Online</span>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="bg-gray-400 w-2 h-2 rounded-full mr-2"></span>
              <span className="text-sm text-gray-500">Offline</span>
            </div>
          )}
        </div>

        {/* Descrição curta */}
        <p className="text-sm italic text-gray-400 mb-3">{description}</p>

        {/* Informações */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="font-semibold text-white">{formattedPrice}</p>
            <div className="flex items-center mt-2">
              <FaStar className="text-yellow-400 mr-1" />
              <p className="text-green-500 font-semibold">
                {reviews} review{reviews !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center mt-2">
              <FaBirthdayCake className="text-pink-500 mr-1" />
              <div className="bg-gray-800 text-white px-2 py-1 rounded-full text-xs font-medium">
                {age} anos
              </div>
            </div>
            <div className="flex items-center mt-2">
              <FaCamera className="text-red-500 mr-1" />
              <p className="text-white">
                {images.length || 5} fotos ou vídeos
              </p>
            </div>
            {hasLocation && (
              <div className="flex items-center mt-2">
                <FaCheckCircle className="text-green-500 mr-1" />
                <span className="text-white">Com local</span>
              </div>
            )}
            <div className="flex items-center mt-2">
              <FaMapMarkerAlt className="text-red-500 mr-1" />
              <p className="text-white">{location}</p>
            </div>
          </div>

          {/* Descrição detalhada e Serviços */}
          <div className="border-l border-gray-500 pl-4">
            <p className="text-white mb-2">{description}</p>
            <p className="text-white font-semibold mb-1">Serviços:</p>
            <ul className="list-disc list-inside text-white space-y-1">
              {(services.length > 0 ? services : defaultServices).map(
                (service, index) => (
                  <li key={index}>{service}</li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Botão de contato */}
        {contact && (
          <button
            className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-2 px-6 rounded-full flex items-center justify-center font-semibold transition-all shadow-md hover:shadow-lg text-lg"
            onClick={handleOpenModal}
            aria-label="Ver contato"
          >
            <FaWhatsapp className="mr-2" /> Ver contato
          </button>
        )}
      </div>

      {/* Modal de contato */}
      {showModalNumero && (
        <ModalContato
          name={name}
          images={images}
          setShowModalNumero={setShowModalNumero}
          phoneNumber={phoneNumber}
        />
      )}
    </>
  );
};

export default CardComponent;
