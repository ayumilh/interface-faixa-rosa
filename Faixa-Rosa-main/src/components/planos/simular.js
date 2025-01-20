"use client";

import React, { useState } from "react";
import {
  FaGem,
  FaCrown,
  FaCheckCircle,
  FaPhone,
  FaEyeSlash,
  FaStar,
  FaMoon,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaStar as FaStarIcon,
  FaCamera,
  FaBirthdayCake,
  FaChevronLeft,
  FaChevronRight,
  FaRegComments,
} from "react-icons/fa";
import { BsCardText } from "react-icons/bs";
import Image from "next/image";

export default function Simular() {
  const [selectedPlans, setSelectedPlans] = useState({
    rubi: true, // Ativado por padrão
    safira: false,
    pink: false,
    vip: false,
    dark: false,
    contato: false,
    oculto: false,
    review: false,
  });

  const plans = {
    rubi: {
      name: "Plano Rubi",
      points: 2000,
      icon: <FaGem className="text-red-500" />,
      component: CardRubi,
    },
    safira: {
      name: "Plano Safira",
      points: 1000,
      icon: <FaGem className="text-blue-500" />,
      component: CardSafira,
    },
    pink: {
      name: "Plano Pink",
      points: 500,
      icon: <FaCheckCircle className="text-pink-500" />,
      component: CardPink,
    },
    vip: {
      name: "Plano VIP",
      points: 300,
      icon: <FaCrown className="text-yellow-500" />,
      component: CardVIP,
    },
    dark: {
      name: "Plano Dark",
      points: 200,
      icon: <FaMoon className="text-gray-700" />,
    },
    contato: {
      name: "Plano Contato",
      points: 200,
      icon: <FaPhone className="text-green-500" />,
    },
    oculto: {
      name: "Plano Ocultar Idade",
      points: 100,
      icon: <FaEyeSlash className="text-blue-500" />,
    },
    review: {
      name: "Plano Review Público",
      points: 800,
      icon: <FaStar className="text-orange-500" />,
    },
  };

  const totalPoints = Object.keys(selectedPlans).reduce(
    (total, key) =>
      total + (selectedPlans[key] ? plans[key]?.points || 0 : 0),
    0
  );

  const activePlanKey = ["rubi", "safira", "pink", "vip"].find(
    (key) => selectedPlans[key]
  );
  let cardContent = null;
  if (activePlanKey) {
    const CardComponent = plans[activePlanKey].component;
    cardContent = <CardComponent selectedPlans={selectedPlans} />;
  } else {
    cardContent = <div>Selecione um plano</div>;
  }

  const togglePlan = (plan) => {
    setSelectedPlans((prev) => {
      // Desativar plano Rubi ativa automaticamente o próximo maior
      if (plan === "rubi" && prev.rubi) {
        const nextPlan = ["safira", "pink", "vip"].find((key) => prev[key]);
        return { ...prev, rubi: false, [nextPlan]: true };
      }

      return {
        ...prev,
        [plan]: !prev[plan],
      };
    });
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen px-4 py-4">
      <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-4">
        Simule seu anúncio com os planos{" "}
        <span className="text-pink-500">Faixa Rosa</span>
      </h1>

      <div className="flex flex-col md:flex-row gap-4 w-full max-w-5xl">
        {/* Card Principal (em cima no mobile, à esquerda no desktop) */}
        <div className="bg-white rounded-lg shadow-md p-3 flex-1">
          {cardContent}
        </div>

        {/* Lista de Planos (em baixo no mobile, à direita no desktop) */}
        <div className="bg-white rounded-lg shadow-md p-3 flex-1">
          <ul className="space-y-3">
            {Object.entries(plans).map(([key, plan]) => (
              <li
                key={key}
                className={`flex justify-between items-center p-2 rounded-lg transition-all duration-300 ${
                  selectedPlans[key] ? "bg-gray-100 shadow-lg" : ""
                }`}
              >
                <div className="flex items-center space-x-2">
                  {plan.icon}
                  <span className="text-gray-800 font-bold text-sm">
                    {plan.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    +{plan.points} pontos
                  </span>
                </div>
                <button
                  onClick={() => togglePlan(key)}
                  className={`w-8 h-4 rounded-full flex items-center ${
                    selectedPlans[key] ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                      selectedPlans[key] ? "translate-x-4" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </li>
            ))}
          </ul>

          {/* Total de Pontos */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg shadow">
            <p className="text-gray-800 font-bold text-sm">
              Total de pontos de listagem:{" "}
              <span className="text-pink-500">{totalPoints}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componentes auxiliares
const defaultServices = [
  "Descrição dos principais serviços",

];

const ImageCarousel = ({ images, isDark }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1)
    );
  };

  const handleNext = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1)
    );
  };

  return (
    <div className="relative h-40 md:h-64 w-full mb-3">
      {images.length > 0 ? (
        <>
          <Image
            src={images[currentIndex]}
            alt={`Imagem ${currentIndex + 1}`}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />

          {/* Botões e indicadores do carrossel */}
          <button
            onClick={handlePrev}
            className={`absolute top-1/2 left-2 transform -translate-y-1/2 ${
              isDark
                ? "text-gray-300 bg-black hover:bg-gray-700"
                : "text-gray-700 bg-white hover:bg-gray-100"
            } rounded-full p-1 shadow-md transition`}
            aria-label="Imagem anterior"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={handleNext}
            className={`absolute top-1/2 right-2 transform -translate-y-1/2 ${
              isDark
                ? "text-gray-300 bg-black hover:bg-gray-700"
                : "text-gray-700 bg-white hover:bg-gray-100"
            } rounded-full p-1 shadow-md transition`}
            aria-label="Próxima imagem"
          >
            <FaChevronRight />
          </button>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <span
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex
                    ? isDark
                      ? "bg-gray-300"
                      : "bg-gray-700"
                    : isDark
                    ? "bg-gray-700"
                    : "bg-gray-300"
                } transition-all`}
              ></span>
            ))}
          </div>
        </>
      ) : (
        <div
          className={`w-full h-full ${
            isDark ? "bg-gray-800" : "bg-gray-200"
          } rounded-md flex items-center justify-center text-gray-500`}
        >
          Sem imagem disponível
        </div>
      )}
    </div>
  );
};

// CardRubi Component
const CardRubi = ({ selectedPlans }) => {
  const hideAge = selectedPlans.oculto;
  const showContactButton = selectedPlans.contato;
  const isDark = selectedPlans.dark;

  const name = "Nome da Anunciante";
  const price = 250;
  const reviews = selectedPlans.review ? 2 : 0;
  const location = "Jardins, São Paulo";
  const description =
    "Descrição breve sobre a modelo, destacando seus diferenciais e o que a torna especial.";
  const age = 25;
  const images = ["/assets/mulher01.jpg", "/assets/mulher02.jpg"];
  const hasLocation = true;
  const isOnline = true;
  const services = [];

  const formattedPrice = price
    ? price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : "A consultar";

  const cardClasses = isDark
    ? "bg-black border border-red-500 rounded-xl shadow-lg p-3 text-white"
    : "bg-white border border-red-500 rounded-xl shadow-lg p-3 text-black";

  return (
    <div className={`${cardClasses} relative`}>
      {/* Carrossel de Imagens */}
      <ImageCarousel images={images} isDark={isDark} />

      {/* Nome e Status */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-white">{name}</h3>
        {isOnline ? (
          <div className="flex items-center">
            <span className="animate-pulse bg-green-500 w-2 h-2 rounded-full mr-1"></span>
            <span className="text-xs text-green-600">Online</span>
          </div>
        ) : (
          <div className="flex items-center">
            <span className="bg-gray-400 w-2 h-2 rounded-full mr-1"></span>
            <span className="text-xs text-gray-500">Offline</span>
          </div>
        )}
      </div>

      {/* Descrição curta */}
      <p
        className={`text-xs italic ${
          isDark ? "text-gray-400" : "text-gray-600"
        } mb-2`}
      >
        {description}
      </p>

      {/* Informações */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
        <div>
          <p className={`font-semibold text-white`}>{formattedPrice}</p>
          {selectedPlans.review && (
            <div className="flex items-center mt-1">
              <FaStarIcon className="text-yellow-400 mr-1" />
              <p className="text-green-500 font-semibold">
                {reviews} review{reviews !== 1 ? "s" : ""}
              </p>
            </div>
          )}
          {!hideAge && (
            <div className="flex items-center mt-1">
              <FaBirthdayCake className="text-pink-500 mr-1" />
              <div
                className={`${
                  isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
                } px-1 py-0.5 rounded-full text-[10px] font-medium`}
              >
                {age} anos
              </div>
            </div>
          )}
          <div className="flex items-center mt-1">
            <FaCamera className="text-red-500 mr-1" />
            <p className={`${isDark ? "text-white" : "text-black"}`}>
              {images.length || 5} fotos ou vídeos
            </p>
          </div>
          {hasLocation && (
            <div className="flex items-center mt-1">
              <FaCheckCircle className="text-green-500 mr-1" />
              <span className={`${isDark ? "text-white" : "text-black"}`}>
                Com local
              </span>
            </div>
          )}
          <div className="flex items-center mt-1">
            <FaMapMarkerAlt className="text-red-500 mr-1" />
            <p className={`${isDark ? "text-white" : "text-black"}`}>
              {location}
            </p>
          </div>
        </div>

        {/* Descrição detalhada e Serviços */}
        <div
          className={`border-l ${
            isDark ? "border-gray-500" : "border-gray-300"
          } pl-2`}
        >
          <p className={`${isDark ? "text-white" : "text-black"} mb-1`}>
            {description}
          </p>
          <p
            className={`${
              isDark ? "text-white" : "text-black"
            } font-semibold mb-1`}
          >
            Serviços:
          </p>
          <ul
            className={`list-disc list-inside ${
              isDark ? "text-white" : "text-black"
            } space-y-0.5`}
          >
            {(services.length > 0 ? services : defaultServices).map(
              (service, index) => (
                <li key={index}>{service}</li>
              )
            )}
          </ul>
        </div>
      </div>

      {/* Botão de contato aprimorado */}
      {showContactButton && (
        <button
          className={`mt-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-1 px-4 rounded-full flex items-center justify-center font-semibold transition-all shadow-md hover:shadow-lg text-sm`}
          aria-label="Ver contato"
        >
          <FaWhatsapp className="mr-1" /> Ver contato
        </button>
      )}
    </div>
  );
};

// CardSafira Component
const CardSafira = ({ selectedPlans }) => {
  const hideAge = selectedPlans.oculto;
  const showContactButton = selectedPlans.contato;
  const isDark = selectedPlans.dark;

  const name = "Nome da Anunciante";
  const price = 200;
  const reviews = selectedPlans.review ? 5 : 0;
  const location = "Copacabana, Rio de Janeiro";
  const description =
    "Encante-se com meu charme e simpatia. Atendimento de primeira classe para momentos inesquecíveis.";
  const age = 23;
  const images = ["/assets/mulher01.jpg", "/assets/mulher02.jpg"];
  const hasLocation = true;
  const isOnline = false;

  const formattedPrice = price
    ? price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : "A consultar";

  const cardClasses = isDark
    ? "bg-black border border-gray-800 rounded-xl shadow-lg p-3 text-white"
    : "bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-black";

  return (
    <div className={`${cardClasses} relative`}>
      {/* Carrossel de Imagens */}
      <ImageCarousel images={images} isDark={isDark} />

      {/* Nome e Status */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">
          {isDark ? (
            <span className="text-white">{name}</span>
          ) : (
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              {name}
            </span>
          )}
        </h3>
        {isOnline ? (
          <div className="flex items-center">
            <span className="animate-pulse bg-green-500 w-2 h-2 rounded-full mr-1"></span>
            <span className="text-xs text-green-600">Online</span>
          </div>
        ) : (
          <div className="flex items-center">
            <span
              className={`${
                isDark ? "bg-gray-600" : "bg-gray-400"
              } w-2 h-2 rounded-full mr-1`}
            ></span>
            <span
              className={`text-xs ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Offline
            </span>
          </div>
        )}
      </div>

      {/* Descrição curta */}
      <p
        className={`text-xs italic ${
          isDark ? "text-gray-400" : "text-gray-600"
        } mb-2`}
      >
        Agende já e se surpreenda!
      </p>

      {/* Informações */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
        <div>
          <p
            className={`font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {formattedPrice}
          </p>
          {selectedPlans.review && (
            <div className="flex items-center mt-1">
              <FaStarIcon className="text-yellow-400 mr-1" />
              <p className="text-green-500 font-semibold">
                {reviews} review{reviews !== 1 ? "s" : ""}
              </p>
            </div>
          )}
          {!hideAge && (
            <div className="flex items-center mt-1">
              <FaBirthdayCake
                className="text-pink-500 mr-1"
                aria-hidden="true"
              />
              <div
                className={`${
                  isDark
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                } px-1 py-0.5 rounded-full text-[10px] font-medium`}
              >
                {age} anos
              </div>
            </div>
          )}
          <div className="flex items-center mt-1">
            <FaCamera className="mr-1 text-blue-500" />
            <p className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
              {images.length} fotos ou vídeos
            </p>
          </div>
          {hasLocation && (
            <div className="flex items-center mt-1">
              <FaCheckCircle className="text-green-500 mr-1" />
              <span
                className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Com local
              </span>
            </div>
          )}
          <div className="flex items-center mt-1">
            <FaMapMarkerAlt className="mr-1 text-red-500" />
            <p className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
              {location}
            </p>
          </div>
        </div>

        {/* Descrição */}
        <div
          className={`border-l ${
            isDark ? "border-gray-700" : "border-gray-300"
          } pl-2`}
        >
          <p className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {description}
          </p>
        </div>
      </div>

      {/* Botão de contato aprimorado */}
      {showContactButton && (
        <button
          className={`mt-2 ${
            isDark
              ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          } text-white py-1 px-4 rounded-full flex items-center justify-center font-semibold transition-all shadow-md hover:shadow-lg text-sm`}
          aria-label="Ver contato"
        >
          <FaWhatsapp className="mr-1" /> Ver contato
        </button>
      )}
    </div>
  );
};

// CardPink Component
const CardPink = ({ selectedPlans }) => {
    const hideAge = selectedPlans.oculto;
    const showContactButton = selectedPlans.contato;
    const isDark = selectedPlans.dark;
  
    const name = "Nome da Anunciante";
    const price = 150;
    const reviews = selectedPlans.review ? 3 : 0;
    const location = "Bela Vista, São Paulo";
    const description =
      "Sou a companhia perfeita para suas noites. Beleza, charme e muita diversão aguardando por você.";
    const age = 22;
    const image = "/assets/mulher01.jpg"; // Imagem especificada
  
    const formattedPrice = price
      ? price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      : "A consultar";
  
    const cardClasses = isDark
      ? "bg-black border border-pink-600 rounded-lg shadow-2xl p-3 text-white"
      : "bg-pink-100 border border-pink-600 rounded-lg shadow-2xl p-3 text-black";
  
    return (
      <div className={`${cardClasses} relative`}>
        {/* Imagem única com tamanho fixo */}
        <div className="mb-2 relative h-40 md:h-64 w-full">
          <Image
            src={image}
            alt="Imagem da Modelo"
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
  
        <h3 className="text-lg font-extrabold text-pink-400 mb-1">{name}</h3>
  
        <p
          className={`text-xs italic mb-1 flex items-center ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          <BsCardText className="mr-2 text-pink-500 text-lg" /> {description}
        </p>
        {!hideAge && (
          <p
            className={`flex items-center ${
              isDark ? "text-white" : "text-black"
            } mb-1`}
          >
            <FaBirthdayCake className="mr-2 text-red-400 text-lg" /> {age} anos
          </p>
        )}
  
        <p
          className={`${
            isDark ? "text-white" : "text-black"
          } mb-1 flex items-center`}
        >
          <FaMapMarkerAlt className="mr-2 text-pink-400 text-lg" /> {location}
        </p>
        <p className="font-semibold text-pink-400 mb-1 flex items-center">
          <FaStarIcon className="mr-2 text-yellow-500 text-lg" /> {formattedPrice}
        </p>
        {selectedPlans.review && (
          <p className="text-gray-400 mb-2 flex items-center">
            <FaRegComments className="mr-2 text-pink-500 text-lg" />
            {reviews > 0 ? (
              <span className="text-green-500 text-xs">
                {reviews} review{reviews !== 1 ? "s" : ""}
              </span>
            ) : (
              <span className="text-gray-400 text-xs">Sem reviews</span>
            )}
          </p>
        )}
  
        {/* Botão de contato */}
        {showContactButton && (
          <button
            className="mt-2 bg-pink-500 hover:bg-pink-600 text-white py-1 px-2 rounded-lg flex items-center justify-center w-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg text-sm"
            aria-label="Ver contato"
          >
            <FaWhatsapp className="mr-2 text-lg" /> Ver contato
          </button>
        )}
      </div>
    );
  };
  
  // CardVIP Component
  const CardVIP = ({ selectedPlans }) => {
    const hideAge = selectedPlans.oculto;
    const showContactButton = selectedPlans.contato;
    const isDark = selectedPlans.dark;
  
    const name = "Nome da Anunciante";
    const price = 100;
    const reviews = selectedPlans.review ? 0 : 0;
    const location = "Centro, Curitiba";
    const description =
      "Atendimento VIP para cavalheiros de bom gosto. Vamos compartilhar momentos especiais juntos?";
    const age = 24;
    const image = "/assets/mulher01.jpg"; // Imagem especificada
  
    const formattedPrice = price
      ? price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      : "A consultar";
  
    const cardClasses = isDark
      ? "bg-black border border-yellow-600 rounded-lg shadow-2xl p-3 text-white"
      : "bg-yellow-100 border border-yellow-500 rounded-lg shadow-xl p-3 text-black";
  
    return (
      <div className={`${cardClasses} relative`}>
        {/* Imagem única com tamanho fixo */}
        <div className="mb-2 relative h-40 md:h-64 w-full">
          <Image
            src={image}
            alt="Imagem da Modelo"
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
  
        <h3
          className={`text-lg font-extrabold ${
            isDark ? "text-yellow-400" : "text-yellow-700"
          } mb-1`}
        >
          {name}
        </h3>
  
        <p
          className={`text-xs italic mb-1 flex items-center ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          <BsCardText className="mr-2 text-yellow-500 text-lg" /> {description}
        </p>
        {!hideAge && (
          <p
            className={`flex items-center ${
              isDark ? "text-white" : "text-black"
            } mb-1`}
          >
            <FaBirthdayCake className="mr-2 text-red-400 text-lg" /> {age} anos
          </p>
        )}
  
        <p
          className={`${
            isDark ? "text-white" : "text-black"
          } mb-1 flex items-center`}
        >
          <FaMapMarkerAlt className="mr-2 text-yellow-700 text-lg" /> {location}
        </p>
        <p
          className={`font-semibold ${
            isDark ? "text-yellow-400" : "text-yellow-700"
          } mb-1 flex items-center`}
        >
          <FaStarIcon className="mr-2 text-yellow-500 text-lg" /> {formattedPrice}
        </p>
        {selectedPlans.review && (
          <p className="text-gray-400 mb-2 flex items-center">
            <FaRegComments className="mr-2 text-yellow-700 text-lg" />
            {reviews > 0 ? (
              <span className="text-green-500 text-xs">
                {reviews} review{reviews !== 1 ? "s" : ""}
              </span>
            ) : (
              <span className="text-gray-400 text-xs">Sem reviews</span>
            )}
          </p>
        )}
  
        {/* Botão de contato */}
        {showContactButton && (
          <button
            className="mt-2 bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded-lg flex items-center justify-center w-full font-semibold transition-colors duration-200 text-sm"
            aria-label="Ver contato"
          >
            <FaWhatsapp className="mr-2 text-lg" /> Ver contato
          </button>
        )}
      </div>
    );
  };
  