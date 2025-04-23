
import React, { useState, useEffect, useRef } from 'react';
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
  FaChevronDown
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import Image from 'next/image';

const CardSafiraDark = ({
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
  isOnline = false,
  timedServiceCompanion = [],
  carrouselImages = [],
  totalPosts,
  totalReviews
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModalNumero, setShowModalNumero] = useState(false);
  const dropdownRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");

  const [expandido, setExpandido] = useState(false);
  const [precisaExpandir, setPrecisaExpandir] = useState(false);
  const textoRef = useRef(null);

  useEffect(() => {
    const el = textoRef.current;
    if (el) {
      // Verifica se o conteúdo está sendo cortado
      setPrecisaExpandir(el.scrollHeight > el.clientHeight);
    }
  }, [description]);

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

  const handleDivClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent?.stopImmediatePropagation();
  };

  const handleWhatsAppClick = () => {
    if (!contact || !contact.whatsappNumber) {
      toast.info("Número do WhatsApp não disponível.");
      return;
    }

    const numero = contact.whatsappNumber;
    const apelido = userName || "atendente";
    const mensagemExtra = contact?.whatsappMessage || "Olá, podemos conversar?";
    const mensagemBase = `Olá, ${apelido}! Encontrei seu anúncio no Faixa Rosa - https://faixarosa.com/perfil/${userName}`;
    const mensagemFinal = `${mensagemBase}\n\n${mensagemExtra}`;
    const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagemFinal)}`;

    window.open(link, "_blank");
  };


  return (
    <>
      <div className="bg-black border border-gray-800 rounded-xl shadow-lg p-6 relative transition transform hover:scale-105 hover:shadow-2xl">
        {/* Carrossel de Imagens */}
        <div className="relative" onClick={handleDivClick}>
          {Array.isArray(carrouselImages) && carrouselImages.length > 0 ? (
            <>
              <Image
                src={
                  carrouselImages[currentIndex]?.imageUrl
                    ? carrouselImages[currentIndex].imageUrl
                    : '/default-image.jpg'
                }
                alt={`Imagem ${currentIndex + 1}`}
                layout="responsive"
                width={500}
                height={200}
                loading="eager"
                priority
                className="rounded-md mb-4 max-h-64 object-cover"
              />

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent?.stopImmediatePropagation();
                  handlePrev();
                }}
                className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-700 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition"
                aria-label="Imagem anterior"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent?.stopImmediatePropagation();
                  handleNext();
                }}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-700 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition"
                aria-label="Próxima imagem"
              >
                <FaChevronRight />
              </button>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {carrouselImages.map((_, index) => (
                  <span
                    key={index}
                    className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-gray-700' : 'bg-gray-300'
                      } transition-all`}
                  ></span>
                ))}
              </div>
            </>
          ) : Array.isArray(images) && images.length > 0 && images[0].trim() !== "" ? (
            <Image
              src={images[0]}
              alt="Imagem de perfil"
              width={500}
              height={200}
              layout="responsive"
              className="rounded-md mb-4 max-h-64 object-cover"
            />
          ) : (
            <div className="w-full h-56 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-500">
              Nenhuma imagem disponível
            </div>
          )}
        </div>

        {/* Nome e Status */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-2xl font-bold text-white">{userName}</h3>
          {/* {isOnline ? (
            <div className="flex items-center">
              <span className="animate-pulse bg-green-500 w-2 h-2 rounded-full mr-2"></span>
              <span className="text-sm text-green-400">Online</span>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="bg-gray-600 w-2 h-2 rounded-full mr-2"></span>
              <span className="text-sm text-gray-500">Offline</span>
            </div>
          )} */}
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

        {/* Informações */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            {subscriptions.some(subscription => subscription.extraPlan?.hasPublicReviews) ? (
              <div className="flex items-center mt-1">
                <FaStar className="text-yellow-400 mr-1" />
                <p className="text-green-500 font-semibold">
                  {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                </p>
              </div>
            ) : null}

            {/* Exibição da idade com ícone */}
            {subscriptions.some(
              (subscription) => subscription.extraPlan?.canHideAge && subscription.extraPlan.isEnabled
            ) ? (
              isAgeHidden ? (
                <div className="flex items-center mt-2">
                  <FaBirthdayCake className="text-pink-500 mr-1" />
                  <div className="bg-gray-600 text-gray-100 px-2 py-1 rounded-full text-xs font-semibold">
                    {age} anos
                  </div>
                </div>
              ) : null
            ) : (
              <div className="flex items-center mt-2">
                <FaBirthdayCake className="text-pink-500 mr-1" />
                <div className="text-gray-100 bg-gray-600 px-2 py-1 rounded-full text-xs font-semibold">
                  {age} anos
                </div>
              </div>
            )}

            <div className="flex items-center mt-1">
              <FaCamera className="mr-1 text-blue-400" />
              <p className="text-gray-300">{totalPosts} fotos ou vídeos</p>
            </div>

            <div className="flex items-center mt-1">
              <FaMapMarkerAlt className="mr-1 text-red-500" />
              <p className="text-gray-300">{location}</p>
            </div>
          </div>

          {/* descrição */}
          <div className="text-gray-200 mb-2" onClick={e => { e.preventDefault(); e.stopPropagation(); e.nativeEvent?.stopImmediatePropagation(); }}>
            <p
              ref={textoRef}
              className={`transition-all ${!expandido ? 'line-clamp-6' : ''}`}
              style={
                expandido
                  ? {
                    display: 'block',
                    WebkitLineClamp: 'unset',
                    WebkitBoxOrient: 'unset',
                    overflow: 'visible',
                    textOverflow: 'unset'
                  }
                  : {}
              }
            >
              {description}
            </p>

            {precisaExpandir && (
              <button
                onClick={() => setExpandido(!expandido)}
                className="text-pink-500 underline text-sm mt-1"
              >
                {expandido ? "Ver menos" : "Ver mais"}
              </button>
            )}
          </div>
        </div>

        {/* Botão de contato aprimorado */}
        {contact && hasExtraContact && (
          <button
            className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-6 rounded-full flex items-center justify-center font-semibold transition-all shadow-md hover:shadow-lg text-lg"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent?.stopImmediatePropagation();
              handleWhatsAppClick();
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
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
          onClick={handleCloseModal}
        >
          <div className="bg-black p-6 rounded-lg shadow-lg max-w-md w-full">
            {/* Carrossel de Imagens no Modal */}
            <div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg">
              {images.length > 0 ? (
                <>
                  <Image
                    src={images[currentIndex]}
                    alt={`Foto de ${name}`}
                    layout="fill"
                    objectFit="cover"
                  />
                  <button
                    onClick={handlePrev}
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white bg-gray-900 hover:bg-gray-800 rounded-full p-2 shadow-md transition"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white bg-gray-900 hover:bg-gray-800 rounded-full p-2 shadow-md transition"
                  >
                    <FaChevronRight />
                  </button>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                      <span
                        key={index}
                        className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-600'
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
            <div className="flex flex-col items-center mb-4 ">
              <div className="relative w-24 h-24 rounded-full border-4 border-transparent bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md overflow-hidden">
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
                <p className="text-xl text-white">(00) 00000-0000</p>
              </div>
              <button className="text-gray-500 hover:text-white">
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

export default CardSafiraDark;
