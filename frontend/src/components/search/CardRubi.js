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
  FaPhone,
  FaChevronDown
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import Image from 'next/image';

const ImageCarousel = ({ carrouselImages, images }) => {
  const fallbackImages = Array.isArray(images) ? images : [];
  const activeImages =
    Array.isArray(carrouselImages) && carrouselImages.length > 0
      ? carrouselImages.map((img) =>
        typeof img === "string" ? { imageUrl: img } : img
      )
      : fallbackImages.map((img) =>
        typeof img === "string" ? { imageUrl: img } : img
      );

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? activeImages.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === activeImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleDivClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent?.stopImmediatePropagation();
  };

  return (
    <div className="relative" onClick={handleDivClick}>
      {activeImages.length > 0 ? (
        <>
          <Image
            src={
              activeImages[currentIndex]?.imageUrl ||
              "/default-image.jpg"
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
            {activeImages.map((_, index) => (
              <span
                key={index}
                className={`w-3 h-3 rounded-full ${index === currentIndex
                  ? "bg-gray-700"
                  : "bg-gray-300"
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
        <div className="relative w-full h-30 max-h-40 mb-4 overflow-hidden rounded-lg">
          {images.length > 0 ? (
            <>
              <Image
                src={images[currentIndexModal]}
                alt={`Foto de ${name}`}
                width={500}
                height={200}
                className='rounded-md object-cover'
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
                    className={`w-3 h-3 rounded-full ${index === currentIndexModal
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
  userName,
  age,
  location,
  description,
  images,
  contact,
  plan,
  isOnline,
  subscriptions,
  isAgeHidden,
  timedServiceCompanion = [],
  carrouselImages = [],
  totalPosts,
  totalReviews
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
  }, [description]);

  const handleOpenModal = () => {
    setShowModalNumero(true);
  };
  const [expanded, setExpanded] = useState(false);
  const descRef = useRef(null);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (expanded && descRef.current) {
      descRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [expanded]);
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
    <div className="bg-white border border-red-500 rounded-xl shadow-lg p-6 relative transition transform hover:scale-105 hover:shadow-xl">
      {/* Carrossel de Imagens */}
      <ImageCarousel carrouselImages={carrouselImages} images={images} />

      {/* Nome e Status */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold text-red-600">{userName}</h3>
        {/* {typeof isOnline !== "undefined" && (
          <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full mr-2 ${isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></span>
            <span className={`text-sm ${isOnline ? "text-green-600" : "text-gray-500"}`}>
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        )} */}

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
                bg-gray-50 border border-gray-200 rounded-lg shadow-lg z-[9999] overflow-y-auto max-h-60
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
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-300"
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

      {/* Descrição curta */}
      <div ref={descRef} className="mb-3" onClick={(e) => { e.preventDefault(); e.stopPropagation(); e.nativeEvent?.stopImmediatePropagation(); }}>
        <p
          className={`text-sm italic text-gray-600 transition-all duration-300 ${expanded ? "" : "line-clamp-3 overflow-hidden"
            }`}
        >
          {description}
        </p>

        {description?.length > 120 && (
          <button
            className="text-pink-500 text-xs mt-1 hover:underline focus:outline-none"
            onClick={toggleExpand}
          >
            {expanded ? "Ver menos" : "Ver mais"}
          </button>
        )}
      </div>

      {/* Informações */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          {subscriptions.some(subscription => subscription.extraPlan?.hasPublicReviews) ? (
            <div className="flex items-center mt-2">
              <FaStar className="text-yellow-400 mr-1" />
              <p className="text-green-500 font-semibold">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
            </div>
          ) : null}

          {/* Exibição da idade com ícone */}
          {subscriptions.some(
            (subscription) => subscription.extraPlan?.canHideAge && subscription.extraPlan.isEnabled
          ) ? (
            isAgeHidden ? (
              <div className="flex items-center mt-2">
                <FaBirthdayCake className="text-pink-500 mr-1" />
                <div className="bg-gray-100 text-black px-2 py-1 rounded-full text-xs font-medium">
                  {age} anos
                </div>
              </div>
            ) : null
          ) : (
            <div className="flex items-center mt-2">
              <FaBirthdayCake className="text-pink-500 mr-1" />
              <div className="bg-gray-100 text-black px-2 py-1 rounded-full text-xs font-medium">
                {age} anos
              </div>
            </div>
          )}


          <div className="flex items-center mt-2">
            <FaCamera className="text-red-500 mr-1" />
            <p className="text-black">{totalPosts} fotos ou vídeos</p>
          </div>

          <div className="flex items-center mt-2">
            <FaMapMarkerAlt className="text-red-500 mr-1" />
            <p className="text-black">{location}</p>
          </div>
        </div>

        {/* Descrição detalhada e Serviços */}
        {/* <div className="border-l border-gray-300 pl-4">
          <p className="text-black mb-2">{description}</p>
        </div> */}

      </div>

      {contact && hasExtraContact && (
        <button
          className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-2 px-6 rounded-full flex items-center justify-center font-semibold transition-all shadow-md hover:shadow-lg text-lg"
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

      {/* Modal de contato */}
      {showModalNumero && (
        <ModalContato
          name={userName}
          images={images}
          setShowModalNumero={setShowModalNumero}
        />
      )}
    </div>
  );
};

export default CardRubi;
