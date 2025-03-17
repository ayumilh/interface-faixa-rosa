"use client";

import { useState, useEffect } from "react";
import {
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaUserSecret,
} from "react-icons/fa";

export default function PlanoOculto() {
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
      <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
        <FaEyeSlash className="text-blue-600 text-2xl sm:text-3xl" />
        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800">
          Plano{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
            Oculto
          </span>
        </h3>
      </div>
      {/* Pontos de Listagem */}
      <p className="bg-blue-50 text-blue-700 font-semibold text-xs sm:text-sm px-3 py-1 rounded-full inline-block mb-6 sm:mb-8">
        +100
        pontos de listagem
      </p>
      {/* Benefícios */}
      <ul className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base mb-6 sm:mb-8 max-w-full sm:max-w-md">
        <li className="flex items-start space-x-2">
          <FaCheckCircle className="text-green-500 w-4 h-4" />
          <span>Esconda sua idade no Faixa Rosa</span>
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
          <span>Sem stories</span>
        </li>
        <li className="flex items-start space-x-2">
          <FaTimesCircle className="text-red-500 w-4 h-4" />
          <span>Sem convênio</span>
        </li>
      </ul>

      <div className="relative -mt-2 sm:-mt-16 text-center">
        {/* Preços com Animação */}
        <div className="mb-6 sm:mb-8">
          <p
            className={`text-gray-600 text-sm sm:text-base line-through mt-12 ${animatePrice ? "animate-strike" : ""
              }`}
          >
            DE R$ 111,00
          </p>
          <p
            className={`text-lg sm:text-xl font-bold text-gray-800 mt-2  ${animatePrice ? "animate-fade-in" : "opacity-0"
              }`}
          >
            POR A PARTIR DE R$ 99,90 Mensal
          </p>
          <span className="bg-red-500 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full mt-4 inline-block -mt-8 ">
            10% OFF
          </span>
        </div>

        {/* Botão Contratar */}
        <div className="mb-6">
          <button className="w-full max-w-xs bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm sm:text-base font-bold py-3 rounded-full hover:opacity-90 transition duration-300 ease-in-out -mt-40">
            Contrate o Plano
          </button>
        </div>

        {/* Botão Mais Informações */}
        <div className="mt-4">
          <button
            onClick={() => setModalOpen(true)}
            className="text-blue-600 text-sm font-medium underline hover:text-blue-800 transition duration-300"
          >
            Mais informações
          </button>
        </div>
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
              X
            </button>

            {/* Conteúdo do Modal */}
            <div className="text-center">
              <FaUserSecret className="text-blue-500 text-3xl sm:text-4xl mb-3" />
              <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                Seu perfil com idade oculta
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Clientes comuns não poderão ver a sua idade, garantindo sua
                privacidade.
              </p>
              <p className="text-sm text-gray-600">
                Apenas clientes premium poderão visualizar este detalhe.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
