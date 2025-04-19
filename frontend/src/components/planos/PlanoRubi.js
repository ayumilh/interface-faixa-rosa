"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaTimes,
  FaBirthdayCake,
  FaCamera,
  FaMapMarkerAlt,
  FaRegCopy,
  FaChevronLeft,
  FaChevronRight,
  FaWhatsapp,
  FaPhone,
  FaTelegram,
} from "react-icons/fa";
import { GiDiamondHard } from 'react-icons/gi';
import Image from "next/image";
import BtnContratarPlano from "./BtnContratarPlano";

// Constantes
const DEFAULT_PHONE_NUMBER = "(00) 00000-0000";
const DEFAULT_PROFILE_IMAGE = "/assets/default-profile.png";
const DEFAULT_SERVICES = [
  "Massagem relaxante",
  "Atendimento VIP",
  "Acompanhamento para eventos",
  "Serviços personalizados",
];

// Dados de Benefícios
const benefits = [
  "Seu anúncio em tamanho grande",
  "Prioridade no suporte Faixa Rosa",
  "Anúncio online todos os dias da semana",
  "Acesso aos stories",
  "Acesso ao convênio",
];

// Hook personalizado para detectar a tecla Esc
const useEscKey = (handler) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handler();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handler]);
};

// Componente BenefitItem
const BenefitItem = memo(({ text, hasBenefit = true }) => (
  <li className="flex items-start space-x-2 sm:space-x-3">
    {hasBenefit ? (
      <>
        <FaCheckCircle className="text-green-500 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-black">{text}</span>
      </>
    ) : (
      <>
        <FaTimesCircle className="text-red-500 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-white">Sem convênio</span>
      </>
    )}
  </li>
));
BenefitItem.displayName = "BenefitItem";

// Componente Modal genérico
const Modal = memo(({ onClose, title, description, children, theme = "light" }) => {
  useEscKey(onClose);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modalTitle"
      aria-describedby="modalDescription"
      onClick={onClose}
    >
      <div
        className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          } rounded-2xl p-4 sm:p-6 max-w-lg w-full relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 ${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"
            }`}
          aria-label="Fechar modal"
        >
          <FaTimes className="w-5 h-5" />
        </button>
        <h3
          id="modalTitle"
          className="text-lg sm:text-xl font-semibold text-center mb-2"
        >
          {title}
        </h3>
        <p
          id="modalDescription"
          className="text-sm text-center italic mb-4"
        >
          {description}
        </p>
        {children}
      </div>
    </div>
  );
});
Modal.displayName = "Modal";

// Componente ImageCarousel
const ImageCarousel = memo(({ images, theme = "light" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div
        className={`w-full h-56 rounded-md mb-4 flex items-center justify-center ${theme === "dark"
          ? "bg-gray-700 text-gray-300"
          : "bg-gray-200 text-gray-500"
          }`}
      >
        Sem imagem disponível
      </div>
    );
  }

  return (
    <div className="relative">
      <Image
        src={images[currentIndex]}
        alt={`Imagem ${currentIndex + 1}`}
        width={500}
        height={300}
        className="rounded-md mb-4 object-cover"
      />
      <button
        onClick={handlePrev}
        className={`absolute top-1/2 left-3 transform -translate-y-1/2 ${theme === "light"
          ? "text-gray-700 bg-white hover:bg-gray-100"
          : "text-gray-300 bg-black hover:bg-gray-700"
          } rounded-full p-2 shadow-md transition`}
        aria-label="Imagem anterior"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={handleNext}
        className={`absolute top-1/2 right-3 transform -translate-y-1/2 ${theme === "light"
          ? "text-gray-700 bg-white hover:bg-gray-100"
          : "text-gray-300 bg-black hover:bg-gray-700"
          } rounded-full p-2 shadow-md transition`}
        aria-label="Próxima imagem"
      >
        <FaChevronRight />
      </button>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-gray-700" : "bg-gray-300"
              } transition-all`}
          ></span>
        ))}
      </div>
    </div>
  );
});
ImageCarousel.displayName = "ImageCarousel";

// Componente ModalContato
const ModalContato = memo(({ name, images, setShowModalNumero, phoneNumber = DEFAULT_PHONE_NUMBER, theme }) => {
  const [currentIndexModal, setCurrentIndexModal] = useState(0);

  const handlePrevModal = () => {
    setCurrentIndexModal(
      (prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1)
    );
  };

  const handleNextModal = () => {
    setCurrentIndexModal(
      (prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1)
    );
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(phoneNumber);
    alert("Número copiado para a área de transferência!");
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${phoneNumber.replace(/\D/g, "")}`, "_blank");
  };

  const handleCall = () => {
    window.open(`tel:${phoneNumber.replace(/\D/g, "")}`);
  };

  const handleTelegram = () => {
    alert("Abrindo Telegram...");
  };

  const handleCloseModal = (e) => {
    if (e.currentTarget === e.target) {
      setShowModalNumero(false);
    }
  };

  useEscKey(() => setShowModalNumero(false));

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50"
      onClick={handleCloseModal}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modalContatoTitle"
    >
      <div className={`bg-white p-6 rounded-lg shadow-lg max-w-md w-full ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
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
                className={`absolute top-1/2 left-2 transform -translate-y-1/2 ${theme === "light"
                  ? "text-gray-700 bg-white hover:bg-gray-100"
                  : "text-gray-300 bg-black hover:bg-gray-700"
                  } rounded-full p-2 shadow-md transition`}
                aria-label="Imagem anterior"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={handleNextModal}
                className={`absolute top-1/2 right-2 transform -translate-y-1/2 ${theme === "light"
                  ? "text-gray-700 bg-white hover:bg-gray-100"
                  : "text-gray-300 bg-black hover:bg-gray-700"
                  } rounded-full p-2 shadow-md transition`}
                aria-label="Próxima imagem"
              >
                <FaChevronRight />
              </button>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`w-3 h-3 rounded-full ${index === currentIndexModal
                      ? "bg-gray-700" : "bg-gray-300"
                      } transition-all`}
                  ></span>
                ))}
              </div>
            </>
          ) : (
            <div className={`w-full h-56 rounded-md flex items-center justify-center text-gray-500 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
              Sem imagem disponível
            </div>
          )}
        </div>

        {/* Foto de perfil e nome */}
        <div className="flex flex-col items-center mb-4">
          <div className={`relative w-24 h-24 rounded-full border-4 border-transparent bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-600 hover:via-red-500 hover:to-red-600 shadow-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105`}>
            <Image
              src={images[0] || DEFAULT_PROFILE_IMAGE}
              alt="Foto de perfil"
              layout="fill"
              objectFit="cover"
            />
            <FaCheckCircle className="absolute bottom-1 right-1 text-green-500 text-2xl" />
          </div>
          <h2 className={`text-2xl font-bold mt-2 ${theme === "dark" ? "text-white" : "text-red-600"}`}>{name}</h2>
        </div>

        {/* Espaço para anúncio */}
        <div className={`p-4 rounded-md mb-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
          <p className={`text-center font-semibold ${theme === "dark" ? "text-gray-400" : "text-black"}`}>
            Espaço para anúncio premium
          </p>
        </div>

        {/* Informações de telefone com botão de copiar */}
        <div className={`p-4 rounded-md mb-4 flex items-center justify-between ${theme === "dark" ? "bg-gray-600" : "bg-gray-50"} shadow-inner`}>
          <div>
            <p className={`font-semibold ${theme === "dark" ? "text-gray-300" : "text-black"}`}>Telefone:</p>
            <p className={`text-xl ${theme === "dark" ? "text-white" : "text-black"}`}>{phoneNumber}</p>
          </div>
          <button
            className={`hover:text-${theme === "dark" ? "white" : "gray-700"}`}
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
});
ModalContato.displayName = "ModalContato";

// Componente CardRubiLight
const CardRubiLight = memo(
  ({
    name = "Nome do Anunciante",
    price = 250,
    reviews = 10,
    location = "Jardins, São Paulo",
    description = "Seu anúncio será exibido em uma interface clara, atraindo mais atenção e proporcionando uma experiência visual diferenciada.",
    age = 30,
    images = [],
    hasLocation = true,
    isOnline = true,
    contact = false,
    services = [],
    phoneNumber = DEFAULT_PHONE_NUMBER,
    theme = "light",
  }) => {
    const [showModalNumero, setShowModalNumero] = useState(false);

    const formattedPrice = "R$ 250,00";

    const handleOpenModal = useCallback(() => {
      setShowModalNumero(true);
    }, []);


    return (
      <>
        <div
          className={`border border-red-500 rounded-xl shadow-lg p-6 relative transition transform hover:scale-105 hover:shadow-xl ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
        >
          {/* Carrossel de Imagens */}
          <ImageCarousel images={images} theme={theme} />

          {/* Nome e Status */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-bold text-red-600">{name}</h3>
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
          <p
            className={`text-sm italic mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
          >
            {description}
          </p>

          {/* Informações */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="font-semibold text-black">{formattedPrice}</p>
              <div className="flex items-center mt-2">
                <FaStar className="text-yellow-400 mr-1" />
                <p className="text-green-500 font-semibold">
                  {reviews} review{reviews !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center mt-2">
                <FaBirthdayCake className="text-pink-500 mr-1" />
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${theme === "dark"
                    ? "bg-white text-black"
                    : "bg-white text-black"
                    }`}
                >
                  {age} anos
                </div>
              </div>
              <div className="flex items-center mt-2">
                <FaCamera className="text-red-500 mr-1" />
                <p className={`text-black`}>
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
            <div className="border-l border-gray-500 pl-4">
              <p className="text-black mb-2">{description}</p>
              <p className="text-black font-semibold mb-1">Serviços:</p>
              <ul className="list-disc list-inside text-black space-y-1">
                {(services.length > 0 ? services : DEFAULT_SERVICES).map(
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
              className="mt-4 bg-gradient-to-r from-red-500 to-red-500 hover:from-red-600 hover:to-red-600 text-white py-2 px-6 rounded-full flex items-center justify-center font-semibold transition-all shadow-md hover:shadow-lg text-lg"
              onClick={handleOpenModal}
              aria-label="Ver contato"
            >
              <FaWhatsapp className="mr-2" /> Ver contato
            </button>
          )}
        </div>

        {/* Modal de contato */}
        {showModalNumero && (
          <Modal
            onClose={() => setShowModalNumero(false)}
            title="Detalhes de Contato"
            description={`Entre em contato com ${name} para mais informações.`}
            theme={theme}
          >
            <ModalContato
              name={name}
              images={images}
              setShowModalNumero={setShowModalNumero}
              phoneNumber={phoneNumber}
              theme={theme}
            />
          </Modal>
        )}
      </>
    );
  }
);
CardRubiLight.displayName = "CardRubiLight";

// Componente CardDark
const CardDark = memo(
  ({
    name = "Nome do Anunciante",
    price = 250,
    reviews = 10,
    location = "Jardins, São Paulo",
    description = "Seu anúncio será exibido em uma interface escura, atraindo mais atenção e proporcionando uma experiência visual diferenciada.",
    age = 30,
    images = [],
    hasLocation = true,
    isOnline = true,
    contact = false,
    services = [],
    phoneNumber = DEFAULT_PHONE_NUMBER,
    theme = "dark",
  }) => {
    return (
      <>
        <div className="bg-black border border-red-500 rounded-xl shadow-lg p-6 relative transition transform hover:scale-105 hover:shadow-xl">
          {/* Carrossel de Imagens */}
          <ImageCarousel images={images} theme="dark" />

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
          <p className="text-sm italic text-white mb-3">{description}</p>

          {/* Informações */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="font-semibold text-white">{price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
              <div className="flex items-center mt-2">
                <FaStar className="text-yellow-400 mr-1" />
                <p className="text-green-500 font-semibold">
                  {reviews} review{reviews !== 1 ? "s" : ""}
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
                {(services.length > 0 ? services : DEFAULT_SERVICES).map(
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
              className="mt-4 bg-gradient-to-r from-red-500 to-red-500 hover:from-red-600 hover:to-red-600 text-white py-2 px-6 rounded-full flex items-center justify-center font-semibold transition-all shadow-md hover:shadow-lg text-lg"
              aria-label="Ver contato"
            >
              <FaWhatsapp className="mr-2" /> Ver contato
            </button>
          )}
        </div>
      </>
    );
  }
);
CardDark.displayName = "CardDark";

// Componente PlanoRubi com suporte a temas no modal de exemplo
const PlanoRubi = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalTheme, setModalTheme] = useState("light");

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalTheme("light");
  }, []);

  const toggleTheme = useCallback((theme) => {
    setModalTheme(theme);
  }, []);

  return (
    <div className="max-w-md w-full mx-auto rounded-3xl shadow-xl bg-white overflow-hidden">
      <div className="p-6 sm:p-8 flex flex-col h-full">
        <div>
          {/* Título do Plano */}
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <GiDiamondHard className="text-red-500 text-2xl sm:text-3xl" />
            <h3 className="text-xl sm:text-2xl font-extrabold text-black">
              Plano{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                Rubi
              </span>
            </h3>
          </div>
          {/* Pontos de Listagem */}
          <p className="bg-red-50 text-red-700 font-semibold text-xs sm:text-sm px-3 py-1 rounded-full inline-block mb-6 sm:mb-8">
            +2.000
            pontos de listagem
          </p>

          {/* Benefícios */}
          <ul className="space-y-3 sm:space-y-4 text-black text-sm sm:text-base mb-6 sm:mb-8">
            {benefits.map((benefit, index) => (
              <BenefitItem key={index} text={benefit} hasBenefit={true} />
            ))}
          </ul>
        </div>

        {/* Preços */}
        <div className="flex-grow flex flex-col justify-end -mt-6">
          {/* Seção de Preço Atualizada */}
          <div className="text-center mb-8">
            {/* Texto acima do preço */}
            <p className="text-gray-400 text-sm">A partir de:</p>

            {/* Detalhe do desconto */}
            <span className="text-sm text-green-600 font-medium mt-2 block">
              Economize 10% no pagamento
            </span>
          </div>

          {/* Botão Contratar */}
          <BtnContratarPlano planId={1} />

          {/* Exemplo de Anúncio */}
          <div className="mt-4  sm:-mt-2 flex justify-center">
            <button
              onClick={() => setModalOpen(true)}
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-red-500 text-sm font-medium underline flex items-center justify-center hover:from-pink-600 hover:to-purple-600 transition duration-300 ease-in-out">

              Veja um exemplo do anúncio
            </button>
          </div>
        </div>
      </div>

      {/* Exemplo do Anúncio */}
      <div className="mt-4 sm:mt-6 text-center">
        <button
          onClick={() => setModalOpen(true)}
          className="text-red-600 text-sm font-medium underline flex items-center justify-center hover:text-red-800 transition duration-300 ease-in-out"
        >
          Veja um exemplo do anúncio
        </button>
      </div>

      {/* Modal Responsivo com tema Light e Dark */}
      {isModalOpen && (
        <Modal
          onClose={closeModal}
          title="Exemplo de Anúncio"
          description="Descubra como o plano Rubi realça seu anúncio e maximiza a visibilidade. Para aproveitar o modo escuro (Dark Mode), certifique-se de que o recurso está habilitado no seu plano."
          theme={modalTheme}
        >
          {/* Botões para alternar temas */}
          <div className="flex justify-center mb-4 space-x-4">
            {/* Botão Light */}
            <button
              onClick={() => toggleTheme("light")}
              className={`px-4 py-2 rounded transition ${modalTheme === "light"
                ? "bg-[#F0F4FF] text-[#0A0A0A]" // Fundo claro, texto escuro
                : "bg-gray-300 text-gray-700" // Fundo cinza claro, texto cinza médio
                } hover:bg-[#E0E7FF] hover:text-[#0A0A0A]`} // Efeito de hover para clarear
            >
              Light
            </button>

            {/* Botão Dark */}
            <button
              onClick={() => toggleTheme("dark")}
              className={`px-4 py-2 rounded transition ${modalTheme === "dark"
                ? "bg-[#1C1C1C] text-[#E0E7FF]" // Fundo escuro, texto claro
                : "bg-gray-400 text-gray-700" // Fundo cinza médio, texto cinza escuro
                } hover:bg-[#2A2A2A] hover:text-[#E0E7FF]`} // Efeito de hover para escurecer
            >
              Dark
            </button>
          </div>


          {/* Exibir CardRubiLight ou CardDark com tema selecionado */}
          {modalTheme === "light" ? (
            <CardRubiLight
              name="Nome do Anunciante"
              price={250}
              location="Jardins, São Paulo"
              description="Descrição breve sobre o anunciante. "
              images={[
                "/assets/banner-faixa.jpg",
                "/assets/banner-faixa.jpg",
                "/assets/banner-faixa.jpg",
              ]}
              reviews={10}
              contact={false}
              age={30}
              hasLocation={true}
              isOnline={true}
              phoneNumber="(00) 00000-0000"
              theme="light"
            />
          ) : (
            <CardDark
              name="Nome do Anunciante"
              price={250}
              location="Jardins, São Paulo"
              description="Descrição breve sobre o anunciante. "
              images={[
                "/assets/banner-faixa.jpg",
                "/assets/banner-faixa.jpg",
                "/assets/banner-faixa.jpg",
              ]}
              reviews={10}
              contact={false}
              age={30}
              hasLocation={true}
              isOnline={true}
              phoneNumber="(00) 00000-0000"
              theme="dark"
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default PlanoRubi;
