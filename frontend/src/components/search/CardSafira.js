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
} from 'react-icons/fa';
import Image from 'next/image';

const CardSafira = ({
  userName,
  age,
  location,
  description,
  images,
  reviews,
  contact,
  plan,
  planType,
  subscriptions,
  isAgeHidden,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModalNumero, setShowModalNumero] = useState(false);

  const handlePrev = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleOpenModal = () => {
    setShowModalNumero(true);
  };

  const handleCloseModal = e => {
    if (e.target.id === 'modal-overlay') {
      setShowModalNumero(false);
    }
  };

  // Verificar se o usuário possui o plano extra com acesso ao contato
  const hasExtraContact = subscriptions.some(subscription => subscription.extraPlan?.hasContact);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 relative transition transform hover:scale-105 hover:shadow-xl">
        {/* Carrossel de Imagens */}
        <div className="relative">
          {images.length > 0 ? (
            <>
              <Image
                src={images[currentIndex]}
                alt={userName || 'Foto do anúncio'}
                layout="responsive"
                width={500}
                height={300}
                className="rounded-md mb-4"
              />
              <button
                onClick={handlePrev}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-700 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={handleNext}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-700 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition"
              >
                <FaChevronRight />
              </button>
              {/* Bolinhas de Navegação */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`w-3 h-3 rounded-full ${index === currentIndex
                      ? 'bg-gray-700'
                      : 'bg-gray-300'
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

        {/* Nome e Status */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            {userName}
          </h3>
          {/* Considerando que isOnline não foi passado, você pode usar alguma lógica para determinar se está online */}
          <div className="flex items-center">
            <span className="animate-pulse bg-green-500 w-2 h-2 rounded-full mr-2"></span>
            <span className="text-sm text-green-600">Online</span>
          </div>
        </div>

        {/* Descrição curta */}
        <p className="text-sm italic text-gray-500 mb-3">
          Agende já e se surpreenda!
        </p>

        {/* Informações */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="font-semibold text-gray-900 text-lg">{plan?.price}</p>
            {subscriptions.some(subscription => subscription.extraPlan?.hasPublicReviews) ? (
              <div className="flex items-center mt-2">
                <FaStar className="text-yellow-400 mr-1" />
                <p className="text-green-500 font-semibold">2 reviews</p>
              </div>
            ) : null}


            {subscriptions.some(
              (subscription) => subscription.extraPlan?.canHideAge && subscription.extraPlan.isEnabled
            ) ? (
              isAgeHidden ? (
                <p className="flex items-center text-black mb-2">
                  <FaBirthdayCake className="mr-2 text-red-400" /> {age} anos
                </p>
              ) : null
            ) : (
              <p className="flex items-center text-black mb-2">
                <FaBirthdayCake className="mr-2 text-red-400" /> {age} anos
              </p>
            )}

            <div className="flex items-center mt-2">
              <FaCamera className="mr-1 text-blue-500" />
              <p className="text-gray-700">{images.length} fotos ou vídeos</p>
            </div>
            
            <div className="flex items-center mt-2">
              <FaMapMarkerAlt className="mr-1 text-red-500" />
              <p className="text-gray-700">{location}</p>
            </div>
          </div>

          {/* Descrição */}
          <div className="border-l border-gray-300 pl-4">
            <p className="text-gray-700">{description}</p>
          </div>
        </div>

        {/* Botão de contato aprimorado */}
        {contact && hasExtraContact && (
          <button
            className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-6 rounded-full flex items-center justify-center font-semibold transition-all shadow-md hover:shadow-lg text-lg"
            onClick={e => {
              e.preventDefault();
              handleOpenModal();
            }}
          >
            <FaWhatsapp className="mr-2" /> Ver contato
          </button>
        )}

      </div>

      {/* Modal de contato */}
      {showModalNumero && (
        <div
          id="modal-overlay"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleCloseModal}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            {/* Carrossel de Imagens no Modal */}
            <div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg">
              {images.length > 0 ? (
                <>
                  <Image
                    src={images[currentIndex]}
                    alt={`Foto de ${userName}`}
                    layout="fill"
                    objectFit="cover"
                  />
                  <button
                    onClick={handlePrev}
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-700 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-700 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition"
                  >
                    <FaChevronRight />
                  </button>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                      <span
                        key={index}
                        className={`w-3 h-3 rounded-full ${index === currentIndex
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
              <div className="relative w-24 h-24 rounded-full border-4 border-transparent bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md overflow-hidden">
                <Image
                  src={images[0] || '/assets/default-profile.png'}
                  alt="Foto de perfil"
                  layout="fill"
                  objectFit="cover"
                />
                <FaCheckCircle className="absolute bottom-1 right-1 text-green-500 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                {userName}
              </h3>
            </div>

            {/* Espaço para anúncio */}
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <p className="text-center text-gray-700 font-semibold">
                Espaço para anúncio
              </p>
            </div>

            {/* Informações de telefone com botão de copiar */}
            <div className="bg-gray-50 p-4 rounded-md mb-4 shadow-inner flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-700">Telefone:</p>
                <p className="text-xl text-gray-900">(00) 00000-0000</p>
              </div>
              <button className="text-gray-500 hover:text-gray-700">
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
                <span>Ligar</span>
              </button>
              <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition transform hover:scale-105">
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

export default CardSafira;
