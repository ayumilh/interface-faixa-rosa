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

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${phoneNumber.replace(/\D/g, '')}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${phoneNumber.replace(/\D/g, '')}`);
  };

  const handleTelegram = () => {
    // Implementar lógica para abrir o Telegram com o número
    alert('Abrindo Telegram...');
  };

  const handleCloseModal = e => {
    if (e.currentTarget === e.target) {
      setShowModalNumero(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleCloseModal}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
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
                className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-700 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition"
                aria-label="Imagem anterior"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={handleNextModal}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-700 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition"
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
                        ? 'bg-gray-700'
                        : 'bg-gray-300'
                    } transition-all`}
                  ></span>
                ))}
              </div>
            </>
          ) : (
            <div className="w-full h-56 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
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
          <h2 className="text-2xl text-red-600 font-bold mt-2">{name}</h2>
        </div>

        {/* Espaço para anúncio */}
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <p className="text-center text-black font-semibold">
            Espaço para anúncio premium
          </p>
        </div>

        {/* Informações de telefone com botão de copiar */}
        <div className="bg-gray-50 p-4 rounded-md mb-4 shadow-inner flex items-center justify-between">
          <div>
            <p className="font-semibold text-black">Telefone:</p>
            <p className="text-xl text-black">{phoneNumber}</p>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={handleCopyNumber}
            aria-label="Copiar número"
          >
            <FaRegCopy className="text-2xl" />
          </button>
        </div>

        {/* Botões de ação */}
        <div className="flex justify-around mt-4 space-x-3">
          <button
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition transform hover:scale-105"
            onClick={handleWhatsApp}
            aria-label="WhatsApp"
          >
            <FaWhatsapp />
            <span>WhatsApp</span>
          </button>
          <button
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition transform hover:scale-105"
            onClick={handleCall}
            aria-label="Ligar"
          >
            <FaPhone />
            <span>Ligar</span>
          </button>
          <button
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition transform hover:scale-105"
            onClick={handleTelegram}
            aria-label="Telegram"
          >
            <FaTelegram />
            <span>Telegram</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const CardRubi = ({
  name = 'Nome da Modelo',
  price = 250,
  reviews = 2,
  location = 'Jardins, São Paulo',
  description = 'Descrição breve sobre a modelo, destacando seus diferenciais e o que a torna especial.',
  age = 25,
  images = [],
  hasLocation = true,
  isOnline = true,
  contact = true,
  services = [],
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

  return (
    <>
      <div className="bg-white border border-red-500 rounded-xl shadow-lg p-6 relative transition transform hover:scale-105 hover:shadow-xl">
        {/* Carrossel de Imagens */}
        <ImageCarousel images={images} />

        {/* Nome e Status */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold text-red-600">{name}</h3>
          {isOnline ? (
            <div className="flex items-center">
              <span className="animate-pulse bg-green-500 w-2 h-2 rounded-full mr-2"></span>
              <span className="text-sm text-green-600">Online</span>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="bg-gray-400 w-2 h-2 rounded-full mr-2"></span>
              <span className="text-sm text-gray-500">Offline</span>
            </div>
          )}
        </div>

        {/* Descrição curta */}
        <p className="text-sm italic text-gray-600 mb-3">{description}</p>

        {/* Informações */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="font-semibold text-red-600">{formattedPrice}</p>
            <div className="flex items-center mt-2">
              <FaStar className="text-yellow-400 mr-1" />
              <p className="text-green-500 font-semibold">
              {reviews} review{reviews !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center mt-2">
              <FaBirthdayCake className="text-pink-500 mr-1" />
              <div className="bg-gray-100 text-black px-2 py-1 rounded-full text-xs font-medium">
                {age} anos
              </div>
            </div>
            <div className="flex items-center mt-2">
              <FaCamera className="text-red-500 mr-1" />
              <p className="text-black">
                {images.length || 5} fotos ou vídeos
              </p>
            </div>
            {hasLocation && (
              <div className="flex items-center mt-2">
                <FaCheckCircle className="text-green-500 mr-1" />
                <span className="text-black">Com local</span>
              </div>
            )}
            <div className="flex items-center mt-2">
              <FaMapMarkerAlt className="text-red-500 mr-1" />
              <p className="text-black">{location}</p>
            </div>
          </div>

          {/* Descrição detalhada e Serviços */}
          <div className="border-l border-gray-300 pl-4">
            <p className="text-black mb-2">{description}</p>
            <p className="text-black font-semibold mb-1">Serviços:</p>
            <ul className="list-disc list-inside text-black space-y-1">
              {(services.length > 0 ? services : defaultServices).map(
                (service, index) => (
                  <li key={index}>{service}</li>
                )
              )}
            </ul>
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
      </div>

      {/* Modal de contato */}
      {showModalNumero && (
        <ModalContato
          name={name}
          images={images}
          setShowModalNumero={setShowModalNumero}
        />
      )}
    </>
  );
};

export default CardRubi;
