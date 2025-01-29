"use client";
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Fotos from "@/components/perfil/fotos";
import Videos from "@/components/perfil/videos";
import Sobre from "@/components/perfil/sobre";
import Servicos from "@/components/perfil/serviços";
import Localidade from "@/components/perfil/localidade";
import Valores from "@/components/perfil/valores";
import ModalBusca from "@/components/search/modalbusca";
import Image from 'next/image';
import Link from 'next/link';
import {
  FaDollarSign,
  FaMapMarkerAlt,
  FaRegUser,
  FaCheckCircle,
  FaShareAlt,
  FaWhatsapp,
  FaEllipsisH,
  FaTelegram,
  FaUserPlus,
  FaMale,
  FaSearch,
  FaRegCopy
} from 'react-icons/fa';
import Final from '@/components/search/final'; // Import do novo Footer

export default function PerfilPage() {
  const [activeTab, setActiveTab] = useState("fotos");
  const [status, setStatus] = useState("online"); // Status do usuário ("online", "offline")
  const [showModalBusca, setShowModalBusca] = useState(false); // Controle do modal de busca
  const [showModalNumero, setShowModalNumero] = useState(false); // Controle do modal de número

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getStatusColor = () => {
    return status === "online" ? "bg-green-500" : "bg-gray-500";
  };

  const getStatusAnimation = () => {
    return status === "online" ? "animate-pulse" : "";
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f7f9fc', marginTop: '80px' }}>
      <Navbar />

      {/* Campo de busca estilizado */}
      <div className="relative w-full max-w-md mb-6 mx-auto">
        <input
          type="text"
          placeholder="Buscar acompanhantes por cidade"
          onClick={() => setShowModalBusca(true)}
          className="w-full py-3 pl-4 pr-12 rounded-full bg-white border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-sm"
          readOnly
        />
        <button
          className="absolute right-4 top-2.5 bg-pink-500 p-2 rounded-full text-white transition-transform transform hover:scale-110"
          onClick={() => setShowModalBusca(true)}
        >
          <FaSearch size={16} />
        </button>
      </div>

      {/* Modal de busca */}
      {showModalBusca && (
        <ModalBusca
          showModalBusca={showModalBusca}
          setShowModalBusca={setShowModalBusca}
          className="text-black" // Adiciona fonte preta ao modal de busca
        />
      )}

      {/* Modal de número */}
      {showModalNumero && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black" // Fonte preta no modal de número
          onClick={(e) => {
            if (e.target.classList.contains("fixed")) {
              setShowModalNumero(false);
            }
          }}
        >
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full relative">
            {/* Botão de Fechar */}
            <button
              className="absolute top-[-6px] right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModalNumero(false)}
            >
              &times;
            </button>

            {/* Carrossel de fotos */}
            <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
              <div className="flex transition-transform transform">
                {/* Imagens do carrossel */}
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="w-full h-48 bg-gray-200 flex-shrink-0">
                    <Image
                      src={`/assets/foto${index + 1}.jpg`} // Substitua pelos caminhos das imagens reais
                      alt={`Foto ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                ))}
              </div>

              {/* Setas para navegação */}
              <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
              >
                &lt;
              </button>
              <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
              >
                &gt;
              </button>

              {/* Bolinhas indicadoras */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="w-2 h-2 bg-gray-400 rounded-full"></div>
                ))}
              </div>
            </div>

            {/* Imagem de perfil e nome */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative w-20 h-20 rounded-full border-4 border-pink-500 shadow-md overflow-hidden">
                <Image
                  src="/assets/mulher.png" // Caminho da imagem de perfil
                  alt="Foto de perfil"
                  layout="fill"
                  objectFit="cover"
                />
                <FaCheckCircle className="absolute bottom-0 right-0 text-green-500 text-xl" />
              </div>
              <h2 className="text-xl text-black font-bold mt-2">Melissa</h2>
            </div>

            {/* Banner Google simulado */}
            <div className="bg-purple-200 p-2 rounded-md mb-4">
              <p className="text-center text-gray-600 font-semibold">Banner GOOGLE</p>
            </div>

            {/* Informações de telefone com ícone de copiar */}
            <div className="bg-purple-100 p-4 rounded-md mb-4 shadow-inner flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">Telefone:</p>
                <p className="text-lg text-gray-900">(00) 00000-0000</p>
              </div>
              <button className="text-gray-700 hover:text-gray-900">
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

      {/* Seção de perfil com banner, informações e conteúdo da aba selecionada */}
      {/* Adicionando um container para centralizar no desktop */}
      <div className="flex-grow">
        <div className="container mx-auto px-4 lg:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 bg-white shadow rounded-lg overflow-hidden relative">
              {/* Banner de perfil */}
              <div className="relative h-56 bg-gray-200">
                <Image
                  src="/assets/banner-faixa.jpg" // Substitua pelo caminho da imagem do banner
                  alt="Banner de perfil"
                  layout="fill"
                  objectFit="cover"
                  className="opacity-90"
                />
              </div>

              {/* Foto de perfil: Usando posicionamento absoluto para sobrepor o banner */}
              <div className="absolute left-4 md:left-6 top-40 md:top-44 z-10">
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-lg overflow-hidden">
                  <Image
                    src="/assets/mulher.png" // Substitua pelo caminho da imagem de perfil
                    alt="Foto de perfil"
                    layout="fill"
                    objectFit="cover"
                  />
                  <FaCheckCircle className="absolute bottom-0 right-0 text-green-500 text-lg" />
                </div>
              </div>

              {/* Conteúdo posicionado abaixo da foto */}
              <div className="mt-16 md:mt-20 px-4 md:px-6">
                <div className="text-center md:text-left text-gray-900 flex items-center justify-center md:justify-start space-x-2">
                  <h2 className="text-xl md:text-2xl font-bold">Melissa Nascimento</h2>
                  <Link className="flex items-center space-x-1">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor()} ${getStatusAnimation()}`}></span>
                    <p className={`text-sm ${status === "online" ? "text-green-500" : "text-gray-500"}`}>
                      {status === "online" ? "Online agora" : "Offline há 30 minutos"}
                    </p>
                  </Link>
                </div>

                <div className="flex flex-col space-y-1 text-gray-700 mt-2">
                  <div className="flex items-center space-x-2">
                    <FaDollarSign />
                    <p>R$500/h</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt />
                    <p>Local: São Paulo</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaRegUser />
                    <p>Idade: 25 anos</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaMale />
                    <p>Atende apenas homens</p>
                  </div>
                </div>

                {/* Informações adicionais: Estatísticas Inspiradas no Instagram */}
                <div className="px-4 md:px-6 mt-4 text-gray-900">
                  <div className="flex flex-wrap justify-center md:justify-start border-t border-gray-200 pt-4">
                    {/* Cada estatística */}
                    <div className="flex flex-col items-center md:items-start mx-4 mb-4 md:mb-0">
                      <span className="text-2xl md:text-3xl font-bold text-pink-500">12.4k</span>
                      <span className="text-sm font-semibold text-gray-700">Seguidores</span>
                    </div>
                    <div className="flex flex-col items-center md:items-start mx-4 mb-4 md:mb-0">
                      <span className="text-2xl md:text-3xl font-bold text-pink-500">200</span>
                      <span className="text-sm font-semibold text-gray-700">Seguindo</span>
                    </div>
                    <div className="flex flex-col items-center md:items-start mx-4 mb-4 md:mb-0">
                      <span className="text-2xl md:text-3xl font-bold text-pink-500">150</span>
                      <span className="text-sm font-semibold text-gray-700">Postagens</span>
                    </div>
                    <div className="flex flex-col items-center md:items-start mx-4 mb-4 md:mb-0">
                      <span className="text-2xl md:text-3xl font-bold text-pink-500">45</span>
                      <span className="text-sm font-semibold text-gray-700">Reviews</span>
                    </div>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="mt-4 px-4 md:px-6 flex flex-wrap items-center justify-center md:justify-start space-x-2">
                  {/* Botão "Ver Contato" destacado para Mobile */}
                  <button
                    onClick={() => setShowModalNumero(true)}
                    className="w-full md:w-auto p-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out flex items-center justify-center space-x-2 mb-2 md:mb-0"
                  >
                    <FaWhatsapp className="text-lg" />
                    <span className="inline md:hidden font-semibold">Ver Contato</span>
                    <span className="hidden md:inline">Ver Contato</span>
                  </button>

                  {/* Outros Botões */}
                  <button
                    onClick={() => setShowModalNumero(true)}
                    className="p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 mb-2 md:mb-0"
                  >
                    <FaTelegram />
                  </button>
                  <button className="p-2 bg-pink-500 text-white rounded-full shadow-md hover:bg-pink-600 mb-2 md:mb-0">
                    <FaShareAlt />
                  </button>
                  <button className="p-2 bg-gray-400 text-white rounded-full shadow-md hover:bg-gray-500 mb-2 md:mb-0">
                    <FaEllipsisH />
                  </button>
                  <button className="p-2 bg-yellow-500 text-white rounded-full shadow-md hover:bg-yellow-600 flex items-center space-x-2 mb-2 md:mb-0">
                    <FaUserPlus className="text-lg" />
                    <span className="hidden md:inline">Seguir</span>
                  </button>
                </div>

                {/* Abas de navegação ajustadas para mobile */}
                <div className="mt-6 px-4 md:px-6 border-b border-gray-300">
                  <div className="flex flex-wrap space-x-4 text-gray-900 font-semibold justify-center md:justify-start">
                    {['fotos', 'videos', 'sobre', 'localidade', 'serviços', 'valores'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`pb-2 capitalize ${
                          activeTab === tab
                            ? "text-pink-500 border-b-2 border-pink-500"
                            : "hover:text-pink-500"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conteúdo da aba selecionada */}
                <div className="mt-4 px-4 md:px-6">
                  {activeTab === "fotos" && <Fotos />}
                  {activeTab === "videos" && <Videos />}
                  {activeTab === "sobre" && <Sobre />}
                  {activeTab === "localidade" && <Localidade />}
                  {activeTab === "serviços" && <Servicos />}
                  {activeTab === "valores" && <Valores />}
                </div>
              </div>
            </div>

            {/* Seção lateral com outros perfis e promoções */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-4 text-black">Mais acompanhantes</h3>
                <div className="space-y-4 text-black">
                  {[
                    { name: 'Camila Ramos', price: 'R$750/h', location: 'Birigui', img: '/assets/acompanhante02.jpg' },
                    { name: 'Alessandra Pinheiros', price: 'R$855/h', location: 'Valparaíso', img: '/assets/anunciante01.jpg' }
                  ].map((profile, index) => (
                    <div key={index} className="flex items-center">
                      <Image
                        src={profile.img}
                        alt={profile.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="ml-4">
                        <p className="font-semibold">{profile.name}</p>
                        <p className="text-gray-600 text-sm">{`${profile.price} • ${profile.location}`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <Image
                  src="/assets/banner-publi.jpg" // Substitua pelo caminho do banner promocional
                  alt="Banner promocional"
                  width={300}
                  height={250}
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Responsivo */}
      <Final />
    </div>
  );
}
