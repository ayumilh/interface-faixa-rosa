"use client";

import { useState, useEffect } from "react";
import {
  FaPhoneAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaTimes,
  FaBirthdayCake, // Certifique-se de que este ícone está importado
} from "react-icons/fa";
import Image from "next/image";
import BtnContratarPlano from "./BtnContratarPlano";


// Componente Card Light
const CardLight = ({ name, price, location, contact, image, age }) => {
  return (
    <div className="flex flex-col">
      {image ? (
        <div className="relative mb-2 sm:mb-3 lg:mb-4">
          <Image
            src={image}
            alt={name}
            layout="responsive"
            className="w-full h-24 sm:h-32 lg:h-40 object-cover rounded-md filter blur-sm"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-xs sm:text-sm font-bold bg-gray-800 bg-opacity-70 py-1 px-2 sm:px-3 rounded">
              Imagem Desfocada
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full h-24 sm:h-32 lg:h-40 bg-gray-200 rounded-md mb-2 sm:mb-3 lg:mb-4 flex items-center justify-center text-gray-500 text-xs sm:text-sm">
          Sem imagem disponível
        </div>
      )}

      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 mb-1">{name}</h3>
      <p className="flex items-center text-gray-800 text-xs sm:text-sm mb-1">
        <FaBirthdayCake className="mr-1 sm:mr-2 text-red-400 w-4 h-4 sm:w-5 sm:h-5" /> {age} anos
      </p>
      <p className="text-gray-600 text-xs sm:text-sm flex items-center mb-1">
        <FaMapMarkerAlt className="mr-1 sm:mr-2 text-gray-700 w-4 h-4 sm:w-5 sm:h-5" /> {location}
      </p>
      <p className="font-semibold text-gray-700 text-sm sm:text-base mb-1">{price}</p>

      {contact && (
        <button className="mt-2 bg-black hover:bg-gray-800 text-white text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-4 rounded-lg flex items-center justify-center w-full font-medium shadow-lg transform hover:scale-105 transition">
          <FaWhatsapp className="mr-1 sm:mr-2 text-lg" /> Ver contato
        </button>
      )}
    </div>
  );
};

export default function Contato() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [animatePrice, setAnimatePrice] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatePrice(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const closeModal = (e) => {
    if (e.target.id === "modalBackground") {
      setModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 sm:p-6 rounded-3xl shadow-xl bg-white">
      {/* Título do Plano */}
      <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
        <FaPhoneAlt className="text-blue-500 text-xl sm:text-2xl" />
        <h3 className="text-lg sm:text-xl font-extrabold text-gray-800">
          Plano{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            Contato
          </span>
        </h3>
      </div>
      {/* Pontos de Listagem */}
      <p className="bg-blue-50 text-blue-700 font-semibold text-xs sm:text-sm px-3 py-1 rounded-full inline-block mb-6 sm:mb-8">
        +200
        pontos de listagem
      </p>
      {/* Benefícios */}
      <ul className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base mb-4">

        <li className="flex items-start space-x-2">
          <FaCheckCircle className="text-green-500 w-4 h-4 flex-shrink-0" />
          <span>Até 1.5x mais visitas e 2x mais contatos de clientes que outros perfis da sua cidade</span>
        </li>
        <li className="flex items-start space-x-2">
          <FaCheckCircle className="text-green-500 w-4 h-4 flex-shrink-0" />
          <span>Prioridade no suporte Faixa Rosa</span>
        </li>
        <li className="flex items-start space-x-2">
          <FaCheckCircle className="text-green-500 w-4 h-4 flex-shrink-0" />
          <span>Anúncio online todos os dias da semana</span>
        </li>
        <li className="flex items-start space-x-2">
          <FaTimesCircle className="text-red-500 w-4 h-4 flex-shrink-0" />
          <span>Sem galeria de fotos</span>
        </li>
        <li className="flex items-start space-x-2">
          <FaTimesCircle className="text-red-500 w-4 h-4 flex-shrink-0" />
          <span>Sem stories</span>
        </li>
        <li className="flex items-start space-x-2">
          <FaTimesCircle className="text-red-500 w-4 h-4 flex-shrink-0" />
          <span>Sem convênio</span>
        </li>
      </ul>

      {/* Preços */}
      <div className="flex flex-col items-center mb-4">
        <p className="text-gray-600 text-sm sm:text-base line-through">DE R$ 92,90</p>
        <p className="text-lg sm:text-xl font-bold text-gray-800">POR A PARTIR DE R$ 83,60 Mensal</p>
        <span className="bg-red-500 text-white text-xs sm:text-sm font-semibold px-2 py-0.5 rounded-full mt-1">
          10% OFF
        </span>
      </div>

      {/* Botão Contratar */}
      <BtnContratarPlano planId={7} />

      {/* Exemplo do Anúncio */}
      <div className="mt-3 text-center">
        <button
          onClick={() => setModalOpen(true)}
          className="text-blue-600 text-sm font-medium underline hover:text-blue-800 transition duration-300"
        >
          Veja um exemplo do anúncio
        </button>
      </div>

      {/* Modal Responsivo */}
      {isModalOpen && (
        <div
          id="modalBackground"
          onClick={closeModal}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 px-4"
        >
          <div className="bg-white rounded-2xl p-6 max-w-xs sm:max-w-sm w-full mx-auto shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-center text-gray-800 mb-4">Exemplo do Anúncio</h3>
            <p className="text-sm text-gray-400 italic text-center mb-4">
              O card abaixo é apenas uma ilustração do plano Básico e não reflete o plano selecionado.
            </p>
            {/* Renderizar o Card Light */}
            <CardLight
              name="Gabi Oliveira"
              price="R$150"
              location="São Paulo, SP"
              contact
              image={null}
              age="25"
            />
          </div>
        </div>
      )}
    </div>
  );
}
