"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import {
  FaBolt,
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
import Image from "next/image";

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
  "Anúncio em posição de destaque (Por uma hora)",
  "+ todos benefícios de outros planos (Por uma hora)",
  "Opção de stories (Por uma hora)",
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
  <li className="flex items-start space-x-3">
    {hasBenefit ? (
      <>
        <FaCheckCircle className="text-green-500 flex-shrink-0 w-5 h-5" />
        <span className="text-white">{text}</span>
      </>
    ) : (
      <>
        {/* Opcional: Adicione algo caso não haja benefício */}
      </>
    )}
  </li>
));

// Componente Modal genérico
const Modal = memo(({ onClose, title, description, children }) => {
  useEscKey(onClose);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modalTitle"
      aria-describedby="modalDescription"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 text-white rounded-2xl p-6 max-w-lg w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white"
          aria-label="Fechar modal"
        >
          <FaTimes className="w-5 h-5" />
        </button>
        <h3 id="modalTitle" className="text-lg sm:text-xl font-semibold text-center mb-2">
          {title}
        </h3>
        <p id="modalDescription" className="text-sm text-center italic mb-4">
          {description}
        </p>
        {children}
      </div>
    </div>
  );
});

// Componente ImageCarousel otimizado para Tema Dark
const ImageCarousel = memo(({ images }) => {
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
      <div className="w-full h-56 rounded-md mb-4 flex items-center justify-center bg-gray-700 text-gray-300">
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
              index === currentIndex ? "bg-gray-300" : "bg-gray-700"
            } transition-all`}
          ></span>
        ))}
      </div>
    </div>
  );
});

// Componente ModalContatoDark (removendo ModalContatoLight)
const ModalContatoDark = memo(({ name, images, setShowModalNumero, phoneNumber = DEFAULT_PHONE_NUMBER }) => {
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
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
      onClick={handleCloseModal}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modalContatoDarkTitle"
    >
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
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
                        ? "bg-gray-300"
                        : "bg-gray-700"
                    } transition-all`}
                  ></span>
                ))}
              </div>
            </>
          ) : (
            <div className="w-full h-56 bg-gray-700 rounded-md flex items-center justify-center text-gray-500">
              Sem imagem disponível
            </div>
          )}
        </div>

        {/* Foto de perfil e nome */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative w-24 h-24 rounded-full border-4 border-transparent bg-gradient-to-r from-red-600 via-pink-500 to-red-600 hover:from-pink-600 hover:via-red-500 hover:to-pink-600 shadow-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105">
            <Image
              src={images[0] || DEFAULT_PROFILE_IMAGE}
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
            Espaço para anúncio premium
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
          <button
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition transform hover:scale-105"
            onClick={handleWhatsApp}
            aria-label="WhatsApp"
          >
            <FaWhatsapp />
            <span>WhatsApp</span>
          </button>
          <button
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition transform hover:scale-105"
            onClick={handleCall}
            aria-label="Ligar"
          >
            <FaPhone />
            <span>Ligar</span>
          </button>
          <button
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition transform hover:scale-105"
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

// Componente CardDark para Tema Dark
const CardDark = memo(
  ({
    name = "Nome do Anunciante",
    price = 250,
    reviews = 2,
    location = "Jardins, São Paulo",
    description = "Descrição breve sobre o anunciante, destacando seus diferenciais e o que a torna especial.",
    age = 25,
    images = [],
    hasLocation = true,
    isOnline = true,
    contact = true,
    services = [],
    phoneNumber = DEFAULT_PHONE_NUMBER,
  }) => {
    const [showModalNumero, setShowModalNumero] = useState(false);

    const formattedPrice = price
      ? price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      : "A consultar";

    const handleOpenModal = () => {
      setShowModalNumero(true);
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
          <p className="text-sm italic text-white mb-3">{description}</p>

          {/* Informações */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="font-semibold text-white">{formattedPrice}</p>
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
              className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-2 px-6 rounded-full flex items-center justify-center font-semibold transition-all shadow-md hover:shadow-lg text-lg"
              onClick={handleOpenModal}
              aria-label="Ver contato"
            >
              <FaWhatsapp className="mr-2" /> Ver contato
            </button>
          )}
        </div>

        {/* Modal de contato para Tema Dark */}
        {showModalNumero && (
          <Modal
            onClose={() => setShowModalNumero(false)}
            title="Detalhes de Contato"
            description={`Entre em contato com ${name} para mais informações.`}
          >
            <ModalContatoDark
              name={name}
              images={images}
              setShowModalNumero={setShowModalNumero}
              phoneNumber={phoneNumber}
            />
          </Modal>
        )}
      </>
    );
  }
);

// Componente PlanoDarkMode ajustado para apenas tema Dark
const PlanoDarkMode = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <div className="max-w-md w-full mx-auto rounded-3xl shadow-xl bg-black overflow-hidden">
      <div className="p-6 sm:p-8 flex flex-col h-full">
        <div>
          {/* Título do Plano */}
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <FaBolt className="text-yellow-500 text-2xl sm:text-3xl" />
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Plano{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                DarkMode
              </span>
            </h3>
          </div>

          {/* Pontos de Listagem */}
          <p className="bg-yellow-50 text-yellow-700 font-semibold text-xs sm:text-sm text-center px-3 py-1 rounded-full inline-block mb-6 sm:mb-8">
            +2.000 pontos de listagem
          </p>

          {/* Benefícios */}
          <ul className="space-y-3 sm:space-y-4 text-white text-sm sm:text-base mb-6 sm:mb-8">
            {benefits.map((benefit, index) => (
              <BenefitItem key={index} text={benefit} hasBenefit={true} />
            ))}
            {/* Adicionando "Sem convênio" logo após os benefícios */}
            <BenefitItem key="no-benefit" hasBenefit={false} />
          </ul>
        </div>

        {/* Preços com 10% de Desconto */}
        <div className="text-center mb-4 sm:mb-6 -mt-8">
          <p className="text-white text-sm sm:text-base line-through">DE R$ 349,90</p>
          <p className="text-lg sm:text-xl font-bold text-white mt-2">POR A PARTIR DE R$ 314,91</p>
          <span className="bg-yellow-500 text-black text-xs sm:text-sm font-semibold px-2 py-0.5 rounded-full mt-3 inline-block">
            Popular
          </span>

          {/* Botão Contratar */}
          <button
            onClick={() => setModalOpen(true)}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-md sm:text-lg font-bold py-3 sm:py-4 rounded-full hover:opacity-90 transition duration-300 ease-in-out mt-4"
          >
            Contrate o Plano
          </button>

          {/* Exemplo do Anúncio */}
          <div className="mt-3 sm:mt-6 text-center">
            <button
              onClick={() => setModalOpen(true)}
              className="text-yellow-600 text-sm font-medium underline hover:text-yellow-800 transition duration-300 ease-in-out"
            >
              Veja um exemplo do anúncio
            </button>
          </div>
        </div>
      </div>

      {/* Modal Responsivo apenas com Tema Dark */}
      {isModalOpen && (
        <Modal
          onClose={closeModal}
          title="Exemplo de Anúncio"
          description="Descubra como o plano DarkMode realça seu anúncio e maximiza a visibilidade. Para aproveitar o modo escuro (Dark Mode), certifique-se de que o recurso está habilitado no seu plano."
        >
          {/* Exibir apenas o CardDark */}
          <CardDark
            name="Nome do Anunciante"
            price={250}
            location="Jardins, São Paulo"
            description="Descrição breve sobre o anunciante."
            images={[
              "/assets/banner-faixa.jpg",
              "/assets/banner-faixa.jpg",
              "/assets/banner-faixa.jpg",
            ]}
            reviews={2}
            contact={false} // Desativar botão de contato no modal
            age={25}
            hasLocation={true}
            isOnline={true}
            phoneNumber="(00) 00000-0000"
          />
        </Modal>
      )}
    </div>
  );
};

// Exportando o Componente PlanoDarkMode como padrão
export default PlanoDarkMode;
