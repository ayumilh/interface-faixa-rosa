// components/CardPlanoDinamico.jsx
import React, { useState, useEffect, useRef } from 'react';
import { tv } from 'tailwind-variants';
import Image from 'next/image';
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
  FaChevronDown,
  FaRegComments,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const card = tv({
  base: 'rounded-xl shadow-md overflow-hidden transition-all duration-300 border-2 p-4 flex flex-col text-center',
  variants: {
    plano: {
      safira: 'border-blue-400 bg-blue-100 text-blue-900',
      pink: 'border-pink-400 bg-pink-100 text-pink-900',
      rubi: 'border-red-400 bg-red-100 text-red-900',
      vip: 'border-yellow-400 bg-yellow-100 text-yellow-900',
    },
    theme: {
      light: '',
      dark: 'bg-gray-900 text-white border-gray-700',
    },
  },
  compoundVariants: [
    { plano: 'safira', theme: 'dark', class: 'bg-blue-950 text-white' },
    { plano: 'pink', theme: 'dark', class: 'bg-pink-900 text-white' },
    { plano: 'rubi', theme: 'dark', class: 'bg-red-900 text-white' },
    { plano: 'vip', theme: 'dark', class: 'bg-yellow-900 text-white' },
  ],
});

const cardAnuncio = ({
  plano = 'vip',
  theme = 'light',
  userName,
  imagem,
  location,
  description,
  age,
  reviews = 0,
  totalPosts = 0,
  showContact = true,
  carrouselImages = [],
  timedServiceCompanion = [],
  subscriptions = [],
  isAgeHidden,
  contact
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
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
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrev = () => {
    setCurrentIndex(prevIndex => prevIndex === 0 ? carrouselImages.length - 1 : prevIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => prevIndex === carrouselImages.length - 1 ? 0 : prevIndex + 1);
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
    <div className={card({ plano, theme }) + ' relative'}>
      <div className="relative" onClick={e => e.stopPropagation()}>
        {carrouselImages.length > 0 ? (
          <>
            <Image
              src={carrouselImages[currentIndex].imageUrl}
              alt={`Imagem de ${userName}`}
              width={500}
              height={300}
              className="rounded-md w-full h-48 object-cover"
            />
            <button onClick={handlePrev} className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-700 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md">
              <FaChevronLeft />
            </button>
            <button onClick={handleNext} className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-700 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md">
              <FaChevronRight />
            </button>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {carrouselImages.map((_, index) => (
                <span key={index} className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-gray-700' : 'bg-gray-300'}`}></span>
              ))}
            </div>
          </>
        ) : (
          <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-500">
            Sem imagem disponível
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold mb-1 flex justify-center items-center gap-1 mt-3">
        {userName} <FaCheckCircle className="text-green-500 text-sm" />
      </h3>

      {timedServiceCompanion.length > 0 && (
        <div className="relative z-50" onClick={e => e.preventDefault()} ref={dropdownRef}>
          <label className="text-sm text-neutral-800 font-semibold">A partir de:</label>
          <div onClick={toggleDropdown} className="group flex gap-2 items-center px-2 rounded-full cursor-pointer">
            <span className="font-bold text-neutral-700">{selectedService ? `R$ ${selectedPrice} - ${selectedService}` : ''}</span>
            <FaChevronDown className={`text-neutral-500 ml-2 transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
          {isOpen && (
            <div className={`absolute bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] overflow-y-auto max-h-60`}>
              {timedServiceCompanion.map(service => service.isOffered ? (
                <div key={service.id} onClick={() => handleSelect(service)} className="p-3 hover:bg-gray-100 cursor-pointer border-b">
                  <span className="font-bold text-neutral-700">R$ {service.price || service.TimedService.defaultPrice} - {service.TimedService.name}</span>
                </div>
              ) : (
                <div key={service.id} className="p-3 text-gray-400 line-through border-b">
                  R$ {service.price || service.TimedService.defaultPrice} - {service.TimedService.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="text-sm text-gray-600 mt-3">
        <div className="flex items-center justify-center gap-1">
          <FaBirthdayCake className="text-red-400" /> {age} anos
        </div>
        <div className="flex items-center justify-center gap-1 mt-1">
          <FaCamera className="text-blue-500" /> {totalPosts} fotos/vídeos
        </div>
        <div className="flex items-center justify-center gap-1 mt-1">
          <FaMapMarkerAlt className="text-red-500" /> {location}
        </div>
        <div className="flex items-center justify-center gap-1 mt-1">
          <FaStar className="text-yellow-500" /> {reviews} review{reviews !== 1 ? 's' : ''}
        </div>
      </div>

      <p className="text-xs italic px-2 mt-3">{description}</p>

      {contact && subscriptions.some(s => s.extraPlan?.hasContact) && (
        <button onClick={handleWhatsAppClick} className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-6 rounded-full flex items-center justify-center font-semibold transition-all shadow-md">
          <FaWhatsapp className="mr-2" /> Ver contato
        </button>
      )}
    </div>
  );
};

export default cardAnuncio;
