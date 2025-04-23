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
import { toast } from 'react-toastify';
import Image from 'next/image';

const CardPink = ({
  userName,
  age,
  price,
  location,
  description,
  images,
  contact,
  plan,
  planType,
  subscriptions,
  isAgeHidden,
  totalReviews,
  timedServiceCompanion = [],
  carrouselImages = []
}) => {
  const [showModalNumero, setShowModalNumero] = useState(false);

  const [expandido, setExpandido] = useState(false);
  const [precisaExpandir, setPrecisaExpandir] = useState(false);
  const textoRef = useRef(null);

  useEffect(() => {
    const el = textoRef.current;
    if (el) {
      // Verifica se o conteúdo está sendo cortado
      setPrecisaExpandir(el.scrollHeight > el.clientHeight);
    }
  }, [description])


  const handleOpenModal = () => {
    setShowModalNumero(true);
  };

  const handleCloseModal = (e) => {
    if (e.target.id === 'modal-overlay') {
      setShowModalNumero(false);
    }
  };

  const hasExtraContact = subscriptions.some(subscription => subscription.extraPlan?.hasContact);

  // Verificar se o plano é o DarkMode
  const isDarkMode = plan?.name === 'DarkMode';

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


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
      <div
        className={`${isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-pink-100 text-black'
          } border rounded-lg shadow-2xl p-4 relative transition transform hover:scale-105 hover:shadow-2xl`}
      >
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

        <h3 className={`${isDarkMode ? 'text-pink-400' : 'text-pink-400'} text-xl font-extrabold mb-1`}>
          {userName}
        </h3>

        <div className="text-black mb-2" onClick={e => { e.preventDefault(); e.stopPropagation(); e.nativeEvent?.stopImmediatePropagation(); }}>
          <p ref={textoRef} className={`${expandido ? '' : 'line-clamp-3'} transition-all`}>
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

        {/* seleção de serviço */}
        {timedServiceCompanion.length > 0 && (
          <div className="relative" onClick={e => { e.preventDefault(); }} ref={dropdownRef}>
            {/* Botão do dropdown */}
            <label className="text-sm text-neutral-800 flex items-center font-semibold">
              A partir de:
            </label>
            <div
              onClick={toggleDropdown}
              className="group flex gap-2 items-center px-2 rounded-full focus:outline-none focus:ring-2 my-2 focus:ring-none hover:border hover:border-none cursor-pointer"
            >
              <span className="font-bold text-neutral-700 group-hover:text-neutral-800">
                {selectedService ? `R$ ${selectedPrice} - ${selectedService} ` : ""}
              </span>
              <FaChevronDown
                className={`text-neutral-500 group-hover:text-neutral-800 ml-2 transform transition-all duration-500 ${isOpen ? 'rotate-180' : ''}`} // Aplica a rotação quando isOpen for true
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
                              bg-pink-50 border border-gray-200 rounded-lg shadow-lg z-[9999] overflow-y-auto max-h-60
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
                      className="p-3 hover:bg-pink-100 cursor-pointer border-b border-gray-300"
                    >
                      <span className="font-bold text-neutral-700">R$ {service.price || service.TimedService.defaultPrice} <span className='font-semibold text-neutral-700'>- {service.TimedService.name}</span></span>
                    </div>
                  ) : (
                    <div
                      key={service.id}
                      className="p-3 text-gray-400 line-through border-b border-gray-300"
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

        {subscriptions.some(
          (subscription) => subscription.extraPlan?.canHideAge && subscription.extraPlan.isEnabled
        ) ? (
          isAgeHidden ? (
            <div className="flex items-center mt-2">
              <p className="text-gray-500 mb-1 flex items-center">
                <FaBirthdayCake className="mr-2 text-red-400" /> {age} anos
              </p>
            </div>
          ) : null
        ) : (
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1 flex items-center`}>
            <FaBirthdayCake className="mr-2 text-red-400" /> {age} anos
          </p>
        )}

        <p className={`${isDarkMode ? 'text-gray-400' : 'text-black-500'} mb-1 flex items-center`}>
          <FaMapMarkerAlt className="mr-2 text-pink-400" /> {location}
        </p>

        {subscriptions.some(subscription => subscription.extraPlan?.hasPublicReviews) ? (
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-400'} mb-3 flex items-center`}>
            <FaRegComments className="mr-1 text-pink-500" />
            {totalReviews > 0 ? (
              <span className="text-green-500">
                {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </span>
            ) : (
              <span className={`${isDarkMode ? 'text-gray-500' : 'text-black-400'}`}>Sem reviews</span>
            )}
          </p>
        ) : null}


        <button
          className={`mt-2 ${isDarkMode ? 'bg-pink-600' : 'bg-pink-500'} hover:${isDarkMode ? 'bg-pink-700' : 'bg-pink-600'} text-white py-2 px-4 rounded-lg flex items-center justify-center w-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg`}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent?.stopImmediatePropagation();
            handleWhatsAppClick();
          }}
        >
          <FaWhatsapp className="mr-2 text-lg" /> Ver contato
        </button>

      </div>

      {showModalNumero && (
        <div
          id="modal-overlay"
          className="fixed inset-0 flex items-center justify-center bg-pink bg-opacity-50 z-50"
          onClick={handleCloseModal}
        >
          <div className={`relative ${isDarkMode ? 'bg-gray-800' : 'bg-pink-100'} p-4 rounded-lg shadow-lg max-w-md w-full mx-4 border border-pink-500`}>
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
              <h2 className={`${isDarkMode ? 'text-gray-200' : 'text-pink-400'} text-xl font-bold mt-2`}>{userName}</h2>
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

export default CardPink;
