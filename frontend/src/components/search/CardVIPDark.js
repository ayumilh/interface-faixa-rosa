import React, { useState, useEffect, useRef } from 'react';
import {
  FaWhatsapp,
  FaMapMarkerAlt,
  FaStar,
  FaRegComments,
  FaRegCopy,
  FaTelegram,
  FaCheckCircle,
  FaBirthdayCake,
  FaChevronDown
} from 'react-icons/fa';
import { BsCardText } from 'react-icons/bs';
import Image from 'next/image';

const CardVIPDark = ({
  userName,
  age,
  location,
  description,
  images,
  contact,
  plan,
  planType,
  subscriptions,
  isAgeHidden,
  reviews = 0,
  timedServiceCompanion = [],
  carrouselImages = []
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

  // Verificar se o usuário possui o plano extra com acesso ao contato
  const hasExtraContact = subscriptions.some(subscription => subscription.extraPlan?.hasContact);

  const dropdownRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");

  useEffect(() => {
    // Definir o primeiro serviço como selecionado por padrão, se disponível
    if (timedServiceCompanion.length > 0) {
      const defaultService = timedServiceCompanion.find(service => service.isOffered);
      if (defaultService) {
        setSelectedService(defaultService.TimedService.name);
        setSelectedPrice(defaultService.price || defaultService.TimedService.defaultPrice);
      }
    }
  }, [timedServiceCompanion]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (service) => {
    setSelectedService(service.TimedService.name);
    setSelectedPrice(service.price || service.TimedService.defaultPrice);
    setIsOpen(false); // Fecha o dropdown após a seleção
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false); // Fecha o dropdown se o clique for fora
    }
  };

  useEffect(() => {
    // Adiciona o evento de clique fora quando o componente é montado
    document.addEventListener('click', handleClickOutside);

    // Limpeza do evento ao desmontar o componente
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="bg-black border border-yellow-600 rounded-lg shadow-2xl p-4 relative transition transform hover:scale-105 hover:shadow-2xl">
        {carrouselImages && carrouselImages.length > 0 ? (
          <Image
          src={carrouselImages[0].imageUrl}
            alt={userName ? `Imagem de ${userName}` : 'Imagem da acompanhante'}
            width={320}
            height={192}
            className="w-full h-48 object-cover rounded-md mb-3"
          />
        ) : (
          <div className="w-full h-48 bg-gray-800 rounded-md mb-3 flex items-center justify-center text-gray-500 text-lg">
            Sem imagem disponível
          </div>
        )}
        <h3 className="text-xl font-extrabold text-yellow-400 mb-1">{userName}</h3>


        <div className="text-sm text-white italic mb-2 flex items-start">
          <span>
            <BsCardText className="mr-2 text-yellow-500 w-4 h-4 mt-1" />
          </span>
          <span className="text-gray-200">{description}</span>
        </div>

        {/* seleção de serviço */}
        {timedServiceCompanion.length > 0 && (
          <div className="relative" onClick={e => { e.preventDefault(); }} ref={dropdownRef}>
            {/* Botão do dropdown */}
            <label className="text-sm text-gray-200 flex items-center font-semibold">
              A partir de:
            </label>
            <div
              onClick={toggleDropdown}
              className="group flex gap-2 items-center px-2 rounded-full focus:outline-none focus:ring-2 my-2 focus:ring-none hover:border hover:border-none cursor-pointer"
            >
              <span className="font-bold text-gray-300 group-hover:text-gray-200">
                {selectedService ? `R$ ${selectedPrice} - ${selectedService} ` : ""}
              </span>
              <FaChevronDown
                className={`text-gray-400 group-hover:text-gray-100 ml-2 transform transition-all duration-500 ${isOpen ? 'rotate-180' : ''}`} // Aplica a rotação quando isOpen for true
              />
            </div>

            {/* Dropdown */}
            {isOpen && (
              <div
                className={`
                             ${typeof window !== "undefined" && window.innerWidth <= 768
                    ? "fixed left-4 right-4 top-[42%]"
                    : "absolute"
                  }
                             bg-neutral-800 border border-neutral-800 rounded-lg shadow-lg z-[9999] overflow-y-auto max-h-60
                           `}
                style={{
                  ...(typeof window !== "undefined" && window.innerWidth <= 768
                    ? { maxWidth: '90%', margin: '0 auto' }
                    : {}
                  )
                }}
              >
                {timedServiceCompanion.map((service) =>
                  service.isOffered ? (
                    <div
                      key={service.id}
                      onClick={() => handleSelect(service)}
                      className="p-3 hover:bg-neutral-900 cursor-pointer border-b border-neutral-700"
                    >
                      <span className="font-bold text-gray-200">R$ {service.price || service.TimedService.defaultPrice} <span className='font-semibold text-neutral-200'>- {service.TimedService.name}</span></span>
                    </div>
                  ) : (
                    <div
                      key={service.id}
                      className="p-3 text-gray-400 line-through border-b border-neutral-700"
                    >
                      <span className="font-bold">
                        R$ {service.price || service.TimedService.defaultPrice} - {service.TimedService.name}
                      </span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* Exibição da idade com ícone */}
        {subscriptions.some(
          (subscription) => subscription.extraPlan?.canHideAge && subscription.extraPlan.isEnabled
        ) ? (
          isAgeHidden ? (
            <div className="flex items-center mt-2">
              <FaBirthdayCake className="text-yellow-400 mr-1" />
              <div className="text-gray-100 px-2 py-1 rounded-full text-xs font-semibold">
                {age} anos
              </div>
            </div>
          ) : null
        ) : (
          <div className="flex items-center mt-2">
            <FaBirthdayCake className="text-yellow-400 mr-1" />
            <div className="text-gray-100 px-2 py-1 rounded-full text-xs font-semibold">
              {age} anos
            </div>
          </div>
        )}

        <p className="text-white mb-1 flex items-center">
          <FaMapMarkerAlt className="mr-2 text-yellow-400" /> {location}
        </p>
        {subscriptions.some(subscription => subscription.extraPlan?.hasPublicReviews) ? (
          <p className="text-gray-400 mb-3 flex items-center">
            <FaRegComments className="mr-1 text-yellow-500" />
            {reviews > 0 ? (
              <span className="text-green-500">
                {reviews} review{reviews !== 1 ? 's' : ''}
              </span>
            ) : (
              <span className="text-gray-400">Sem reviews</span>
            )}
          </p>
        ) : null}


        {contact && hasExtraContact && (
          <button
            className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg flex items-center justify-center w-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={handleOpenModal}
          >
            <FaWhatsapp className="mr-2 text-lg" /> Ver contato
          </button>
        )}
      </div>

      {showModalNumero && (
        <div
          id="modal-overlay"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleCloseModal}
        >
          <div className="bg-black p-4 rounded-lg shadow-lg max-w-md w-full">
            {/* Carrossel de foto */}
            <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
              <div className="w-full h-48 bg-gray-800 flex-shrink-0">
                {carrouselImages && carrouselImages.length > 0 ? (
                  <Image
                  src={carrouselImages[0].imageUrl}
                    alt={`Foto de ${name}`}
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-lg">
                    Sem imagem disponível
                  </div>
                )}
              </div>
            </div>

            {/* Imagem de perfil e nome */}
            <div className="flex flex-col items-center mb-4">
              {images && images.length > 0 ? (
                <div className="relative w-20 h-20 rounded-full border-4 border-yellow-500 shadow-md overflow-hidden">
                  <Image
                    src={images[0]}
                    alt="Foto de perfil"
                    layout="fill"
                    objectFit="cover"
                  />
                  <FaCheckCircle className="absolute bottom-0 right-0 text-green-500 text-xl" />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-lg">
                  Sem imagem disponível
                </div>
              )}
              <h2 className="text-xl text-yellow-400 font-bold mt-2">{userName}</h2>
            </div>

            {/* Banner Google simulado */}
            <div className="bg-yellow-600 p-2 rounded-md mb-4">
              <p className="text-center text-gray-200 font-semibold">
                Banner GOOGLE
              </p>
            </div>

            {/* Informações de telefone com ícone de copiar */}
            <div className="bg-yellow-600 p-4 rounded-md mb-4 shadow-inner flex items-center justify-between">
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

export default CardVIPDark;
