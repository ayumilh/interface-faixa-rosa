// ./src/components/planos/PlanoVip.js

"use client";

import React, { useState, useCallback, memo } from "react";
import {
  FaWhatsapp,
  FaMapMarkerAlt,
  FaStar,
  FaRegComments,
  FaRegCopy,
  FaTelegram,
  FaCheckCircle,
  FaBirthdayCake,
  FaTimes,
  FaPhone,
  FaTimesCircle,
} from "react-icons/fa";
import { BsCardText } from "react-icons/bs";
import Image from "next/image";
import BtnContratarPlano from "./BtnContratarPlano";

// Constantes
const DEFAULT_PHONE_NUMBER = "(00) 00000-0000";
const DEFAULT_PROFILE_IMAGE = "/assets/default-profile.png";

// Dados de Benefícios para o Plano Vip
const benefitsVip = [
  { text: "Tenha até 10 fotos e 4 vídeos exclusivos", included: true },
  { text: "Anúncio online todos os dias da semana", included: true },
  { text: "Prioridade no suporte Faixa Rosa", included: true },
  { text: "Sem convênio", included: false },
  { text: "Sem stories", included: false },
  // Adicione mais benefícios conforme necessário
];

// Componente Modal genérico
const Modal = memo(({ onClose, title, description, children, theme = "light" }) => {
  React.useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

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
          className={`absolute top-3 right-3 ${theme === "dark"
              ? "text-gray-300 hover:text-white"
              : "text-gray-700 hover:text-gray-900"
            }`}
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
Modal.displayName = "Modal";

// Componente CardVIPLight
const CardVIPLight = memo(
  ({
    name = "Nome do Anunciante",
    price = "R$169,90",
    location = "Centro, Rio de Janeiro",
    description = "Descrição breve sobre o anunciante.",
    reviews = 8,
    contact = true,
    images = [],
    age = 28,
    phoneNumber = DEFAULT_PHONE_NUMBER,
    theme = "light",
  }) => {
    const [showModalNumero, setShowModalNumero] = useState(false);

    const handleOpenModal = useCallback(() => {
      setShowModalNumero(true);
    }, []);

    return (
      <>
        <div
          className={`bg-yellow-100 border border-yellow-600 rounded-lg shadow-2xl p-4 relative transition transform hover:scale-105 hover:shadow-2xl ${theme === "dark" ? "bg-gray-800 text-white" : "bg-yellow-100 text-gray-800"
            }`}
        >
          {/* Imagem Principal */}
          {images && images.length > 0 ? (
            <Image
              src={images[0]}
              alt={name}
              width={320}
              height={192}
              className="w-full h-48 object-cover rounded-md mb-3"
            />
          ) : (
            <div className="w-full h-48 bg-gray-800 rounded-md mb-3 flex items-center justify-center text-gray-500 text-lg">
              Sem imagem disponível
            </div>
          )}

          {/* Nome */}
          <h3 className="text-xl font-extrabold text-yellow-500 mb-1">{name}</h3>

          {/* Descrição */}
          <p className="text-sm text-black italic mb-2 flex items-center">
            <BsCardText className="mr-2 text-yellow-500" /> {description}
          </p>

          {/* Idade */}
          {age && (
            <p className="text-black mb-1 flex items-center">
              <FaBirthdayCake className="mr-2 text-pink-400" /> {age} anos
            </p>
          )}

          {/* Localização */}
          <p className="text-black mb-1 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-yellow-500" /> {location}
          </p>

          {/* Preço */}
          <p className="font-semibold text-yellow-500 mb-1 flex items-center">
            <FaStar className="mr-1 text-yellow-500" /> {price}
          </p>

          {/* Reviews */}
          <p className="text-gray-400 mb-3 flex items-center">
            <FaRegComments className="mr-1 text-yellow-500" />
            {reviews > 0 ? (
              <span className="text-green-500">
                {reviews} review{reviews !== 1 ? "s" : ""}
              </span>
            ) : (
              <span className="text-gray-400">Sem reviews</span>
            )}
          </p>

          {/* Botão de contato */}
          {contact && (
            <button
              className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg flex items-center justify-center w-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              onClick={handleOpenModal}
            >
              <FaWhatsapp className="mr-2 text-lg" /> Ver contato
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
            <div className="relative bg-yellow-100 p-4 rounded-lg shadow-lg max-w-md w-full">
              {/* Carrossel de foto */}
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                {images.length > 0 ? (
                  <>
                    <Image
                      src={images[0]}
                      alt={`Foto de ${name}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    {/* Botões de navegação do carrossel podem ser implementados aqui */}
                  </>
                ) : (
                  <div className="w-full h-48 bg-gray-800 rounded-md flex items-center justify-center text-gray-500">
                    Sem imagem disponível
                  </div>
                )}
              </div>

              {/* Imagem de perfil e nome */}
              <div className="flex flex-col items-center mb-4">
                <div className="relative w-20 h-20 rounded-full border-4 border-yellow-500 shadow-md overflow-hidden">
                  <Image
                    src="/assets/mulher.png"
                    alt="Foto de perfil"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <FaCheckCircle className="absolute bottom-0 right-0 text-green-500 text-xl" />
                </div>
                <h2 className="text-xl text-yellow-500 font-bold mt-2">{name}</h2>
              </div>

              {/* Banner Google simulado */}
              <div className="bg-yellow-600 p-2 rounded-md mb-4">
                <p className="text-center text-gray-200 font-semibold">
                  Banner GOOGLE
                </p>
              </div>

              {/* Informações de telefone com ícone de copiar */}
              <div className="bg-yellow-600 p-4 rounded-md mb-4 shadow-inner flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-200">Telefone:</p>
                  <p className="text-lg text-white">{phoneNumber}</p>
                </div>
                <button
                  className="text-gray-300 hover:text-white"
                  onClick={() => navigator.clipboard.writeText(phoneNumber)}
                  aria-label="Copiar número"
                >
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
                  <FaPhone />
                  <span>Ligar</span>
                </button>
                <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105">
                  <FaTelegram />
                  <span>Telegram</span>
                </button>
              </div>
            </div>
          </Modal>
        )}
      </>
    );
  }
);
CardVIPLight.displayName = "CardVIPLight";

// Componente CardVIPDark
const CardVIPDark = memo(
  ({
    name = "Nome do Anunciante",
    price = "R$169,90",
    location = "Centro, Rio de Janeiro",
    description = "Descrição breve sobre o anunciante.",
    reviews = 8,
    contact = true,
    images = [],
    age = 28,
    phoneNumber = DEFAULT_PHONE_NUMBER,
    theme = "dark",
  }) => {
    const [showModalNumero, setShowModalNumero] = useState(false);

    const handleOpenModal = useCallback(() => {
      setShowModalNumero(true);
    }, []);

    return (
      <>
        <div
          className={`bg-black border border-yellow-600 rounded-lg shadow-2xl p-4 relative transition transform hover:scale-105 hover:shadow-2xl ${theme === "dark" ? "bg-black text-white" : "bg-black text-white"
            }`}
        >
          {/* Imagem Principal */}
          {images && images.length > 0 ? (
            <Image
              src={images[0]}
              alt={name}
              width={320}
              height={192}
              className="w-full h-48 object-cover rounded-md mb-3"
            />
          ) : (
            <div className="w-full h-48 bg-gray-800 rounded-md mb-3 flex items-center justify-center text-gray-500 text-lg">
              Sem imagem disponível
            </div>
          )}

          {/* Nome */}
          <h3 className="text-xl font-extrabold text-yellow-500 mb-1">{name}</h3>

          {/* Descrição */}
          <p className="text-sm text-white italic mb-2 flex items-center">
            <BsCardText className="mr-2 text-yellow-500" /> {description}
          </p>

          {/* Idade */}
          {age && (
            <p className="text-white mb-1 flex items-center">
              <FaBirthdayCake className="mr-2 text-pink-500" /> {age} anos
            </p>
          )}

          {/* Localização */}
          <p className="text-white mb-1 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-yellow-500" /> {location}
          </p>

          {/* Preço */}
          <p className="font-semibold text-yellow-500 mb-1 flex items-center">
            <FaStar className="mr-1 text-yellow-500" /> {price}
          </p>

          {/* Reviews */}
          <p className="text-gray-400 mb-3 flex items-center">
            <FaRegComments className="mr-1 text-yellow-500" />
            {reviews > 0 ? (
              <span className="text-green-500">
                {reviews} review{reviews !== 1 ? "s" : ""}
              </span>
            ) : (
              <span className="text-gray-400">Sem reviews</span>
            )}
          </p>

          {/* Botão de contato */}
          {contact && (
            <button
              className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg flex items-center justify-center w-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              onClick={handleOpenModal}
            >
              <FaWhatsapp className="mr-2 text-lg" /> Ver contato
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
            <div className="relative bg-yellow-900 p-4 rounded-lg shadow-lg max-w-md w-full">
              {/* Carrossel de foto */}
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                {images.length > 0 ? (
                  <>
                    <Image
                      src={images[0]}
                      alt={`Foto de ${name}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    {/* Botões de navegação do carrossel podem ser implementados aqui */}
                  </>
                ) : (
                  <div
                    className={`w-full h-48 rounded-md flex items-center justify-center text-gray-500 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                      }`}
                  >
                    Sem imagem disponível
                  </div>
                )}
              </div>

              {/* Imagem de perfil e nome */}
              <div className="flex flex-col items-center mb-4">
                <div
                  className={`relative w-20 h-20 rounded-full border-4 border-yellow-500 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 hover:from-yellow-600 hover:via-yellow-500 hover:to-yellow-600 shadow-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105`}
                >
                  <Image
                    src={images[0] || DEFAULT_PROFILE_IMAGE}
                    alt="Foto de perfil"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <FaCheckCircle className="absolute bottom-1 right-1 text-green-500 text-2xl" />
                </div>
                <h2
                  className={`text-xl text-yellow-500 font-bold mt-2 ${theme === "dark" ? "text-white" : "text-yellow-500"
                    }`}
                >
                  {name}
                </h2>
              </div>

              {/* Banner Google simulado */}
              <div className="bg-yellow-600 p-2 rounded-md mb-4">
                <p className="text-center text-gray-200 font-semibold">
                  Banner GOOGLE
                </p>
              </div>

              {/* Informações de telefone com ícone de copiar */}
              <div className="bg-yellow-600 p-4 rounded-md mb-4 shadow-inner flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-200">Telefone:</p>
                  <p className="text-lg text-white">{phoneNumber}</p>
                </div>
                <button
                  className="text-gray-300 hover:text-white"
                  onClick={() => navigator.clipboard.writeText(phoneNumber)}
                  aria-label="Copiar número"
                >
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
                  <FaPhone />
                  <span>Ligar</span>
                </button>
                <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105">
                  <FaTelegram />
                  <span>Telegram</span>
                </button>
              </div>
            </div>
          </Modal>
        )}
      </>
    );
  }
);
CardVIPDark.displayName = "CardVIPDark";

// Componente PlanoVip
const PlanoVip = () => {
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
            <FaCheckCircle className="text-yellow-500 text-2xl sm:text-3xl" />
            <h3 className="text-xl sm:text-2xl font-extrabold text-black">
              Plano{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                Vip
              </span>
            </h3>
          </div>

          {/* Pontos de Listagem */}
          <p className="bg-yellow-50 text-yellow-700 font-semibold text-xs sm:text-sm px-3 py-1 rounded-full inline-block mb-6 sm:mb-8">
            +300 pontos de listagem
          </p>

          {/* Benefícios */}
          <ul className="space-y-3 sm:space-y-4 text-black text-sm sm:text-base mb-6 sm:mb-8">
            {benefitsVip.map((benefit, index) => (
              <li key={index} className="flex items-start space-x-2 sm:space-x-3">
                {benefit.included ? (
                  <FaCheckCircle className="text-yellow-500 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <FaTimesCircle className="text-red-500 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                )}
                <span>{benefit.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Preços */}
        <div className="flex-grow flex flex-col justify-end mt-4 sm:mt-0 ">
          {/* Seção de Preço Atualizada */}
          <div className="text-center mb-6 sm:mb-8 -mt-10">
            {/* Texto acima do preço */}
            <p className="text-gray-400 text-sm">A partir de:</p>

            {/* Preço do plano */}
            <p className="text-3xl font-bold text-gray-800">R$ 169,90</p>

            {/* Detalhe do desconto */}
            <span className="text-sm text-green-600 font-medium mt-2 block">
              Economize 10% no pagamento
            </span>
          </div>

          {/* Botão Contratar */}
          <BtnContratarPlano planId={4} />


          {/* Exemplo de Anúncio */}
          <div className="mt-6 sm:mt-2 text-center">
            <button
              onClick={() => setModalOpen(true)}
              className="text-yellow-500 text-sm underline hover:text-yellow-600 transition duration-300"
            >
              Veja um exemplo do anúncio
            </button>

          </div>
        </div>
      </div>

      {/* Modal Responsivo com tema Light e Dark */}
      {isModalOpen && (
        <Modal
          onClose={closeModal}
          title="Exemplo de Anúncio"
          description="Descubra como o plano Vip realça seu anúncio e maximiza a visibilidade. Para aproveitar o modo escuro (Dark Mode), certifique-se de que o recurso está habilitado no seu plano."
          theme={modalTheme}
        >
          {/* Botões para alternar temas */}
          <div className="flex justify-center mb-4 space-x-4">
            {/* Botão Light */}
            <button
              onClick={() => toggleTheme("light")}
              className={`px-4 py-2 rounded transition ${modalTheme === "light"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-gray-300 text-gray-700"
                } hover:bg-yellow-100 hover:text-yellow-800`}
            >
              Light
            </button>

            {/* Botão Dark */}
            <button
              onClick={() => toggleTheme("dark")}
              className={`px-4 py-2 rounded transition ${modalTheme === "dark"
                  ? "bg-yellow-800 text-yellow-100"
                  : "bg-gray-600 text-gray-400"
                } hover:bg-yellow-700 hover:text-yellow-100`}
            >
              Dark
            </button>
          </div>

          {/* Exibir CardVIPLight ou CardVIPDark com tema selecionado */}
          {modalTheme === "light" ? (
            <CardVIPLight
              name="Nome do Anunciante"
              price="R$169,90"
              location="Centro, Rio de Janeiro"
              description="Descrição breve sobre o anunciante."
              reviews={8}
              contact={false}
              images={[
                "/assets/banner-faixa.jpg",
                "/assets/banner-faixa.jpg",
                "/assets/banner-faixa.jpg",
              ]}
              age={28}
              phoneNumber="(00) 00000-0000"
              theme="light"
            />
          ) : (
            <CardVIPDark
              name="Nome do Anunciante"
              price="R$169,90"
              location="Centro, Rio de Janeiro"
              description="Descrição breve sobre o anunciante."
              reviews={8}
              contact={false}
              images={[
                "/assets/banner-faixa.jpg",
                "/assets/banner-faixa.jpg",
                "/assets/banner-faixa.jpg",
              ]}
              age={28}
              phoneNumber="(00) 00000-0000"
              theme="dark"
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default PlanoVip;
