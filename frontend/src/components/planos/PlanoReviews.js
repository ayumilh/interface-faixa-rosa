"use client";

import { useState } from "react";
import {
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaQuoteRight,
  FaTimes,
} from "react-icons/fa";
import BtnContratarPlano from "./BtnContratarPlano";

export default function PlanoReviews() {
  const [isModalOpen, setModalOpen] = useState(false);

  const closeModal = (e) => {
    if (e.target.id === "modalBackground") {
      setModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl shadow-xl bg-white p-4 sm:p-6">
      {/* Título do Plano */}
      <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
        <FaStar className="text-orange-500 text-2xl sm:text-3xl" />
        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800">
          Plano{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 -m8  ">
            Reviews Públicos
          </span>
        </h3>
      </div>

      {/* Pontos de Listagem */}
      <p className="bg-orange-50 text-orange-700 font-semibold text-xs sm:text-sm px-3 py-1 rounded-full inline-block mb-6 sm:mb-8">
        +800 pontos de listagem
      </p>

      {/* Benefícios */}
      <ul className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base mb-6 sm:mb-8 max-w-full sm:max-w-md -mt-8">
        <li className="flex items-start space-x-2">
          <FaCheckCircle className="text-green-500 w-4 h-4" />
          <span>Deixe que os contratantes leiam seus reviews</span>
        </li>
        <li className="flex items-start space-x-2">
          <FaCheckCircle className="text-green-500 w-4 h-4" />
          <span>Prioridade no suporte Faixa Rosa</span>
        </li>
        <li className="flex items-start space-x-2">
          <FaCheckCircle className="text-green-500 w-4 h-4" />
          <span>Anúncio online todos os dias da semana</span>
        </li>
        <li className="flex items-start space-x-2">
          <FaTimesCircle className="text-red-500 w-4 h-4" />
          <span>Sem galeria de fotos</span>
        </li>
        <li className="flex items-start space-x-2">
          <FaTimesCircle className="text-red-500 w-4 h-4" />
          <span>Sem stories</span>
        </li>
        <li className="flex items-start space-x-2">
          <FaTimesCircle className="text-red-500 w-4 h-4" />
          <span>Sem convênio</span>
        </li>
      </ul>

      {/* Preços com 10% de Desconto */}
      <div className="text-center mb-4 sm:mb-6 -mt-6 ">
        <p className="text-gray-600 text-sm sm:text-base line-through">DE R$ 349,90</p>
        <p className="text-lg sm:text-xl font-bold text-gray-800">POR A PARTIR DE R$ 314,91</p>
        <span className="bg-red-500 text-white text-xs sm:text-sm font-semibold px-2 py-0.5 rounded-full mt-1 inline-block">
          10% OFF
        </span>
      </div>

      {/* Botão Contratar */}
      <BtnContratarPlano planId={9} planExtra={true} />

      {/* Botão Mais Informações */}
      <div className="mt-2 sm:mt-3 text-center">
        <button
          onClick={() => setModalOpen(true)}
          className="text-orange-600 text-sm font-medium underline hover:text-orange-800 transition duration-300"
        >
          Mais informações
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
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-5 h-5" />
            </button>

            {/* Conteúdo do Modal */}
            <div className="text-center">
              <FaQuoteRight className="text-orange-500 text-3xl sm:text-4xl mb-3" />
              <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                Seus reviews públicos
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Seus clientes poderão ler os reviews e depoimentos que outros clientes deixaram sobre você, aumentando sua credibilidade.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
