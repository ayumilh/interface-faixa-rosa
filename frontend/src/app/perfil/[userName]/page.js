"use client";
import { useState, useEffect } from 'react';
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
  FaRegCopy,
} from 'react-icons/fa';
import Final from '@/components/search/final';
import { useParams } from "next/navigation";
import axios from 'axios';


export default function Perfil() {
  const { userName } = useParams();

  const [maisAcompanhantes, setMaisAcompanhantes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("fotos");
  const [status, setStatus] = useState("online"); // Status do usuário ("online", "offline")
  const [showModalBusca, setShowModalBusca] = useState(false); // Controle do modal de busca
  const [showModalNumero, setShowModalNumero] = useState(false); // Controle do modal de número
  const [companionData, setCompanionData] = useState(null); // Para armazenar os dados da acompanhante

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userName) return;
      
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/profile?userName=${userName}`
        );
        setCompanionData(response.data);
        setIsLoading(false);

        // Buscar mais acompanhantes com base na cidade e estado
        const city = response.data.city;
        const state = response.data.state;

        const acompanhantesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/companion-city?cidade=${city}&estado=${state}`
        );

        setMaisAcompanhantes(acompanhantesResponse.data);
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userName]);



  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getStatusColor = () => {
    return status === "online" ? "bg-green-500" : "bg-gray-500";
  };

  const getStatusAnimation = () => {
    return status === "online" ? "animate-pulse" : "";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
                  <Image
                    src="/iconOficial_faixaRosa.png"
                    alt="Ícone oficial Faixa Rosa"
                    width={50}
                    height={50}
                    className="animate-pulse"
                  />
      </div>
    );
  }

  if (!companionData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Perfil não encontrado.</p> {/* Exibe uma mensagem de erro se os dados não forem encontrados */}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f7f9fc', marginTop: '80px' }}>
      <Navbar bgColor='white' />

      {/* Breadcrumbs */}
      <div className="w-full max-w-7xl mx-auto  p-4 mt-16 bg-cover flex justify-start items-center">
        <nav className="text-sm text-gray-700">
          <Link href="/" className="text-pink-500 hover:text-pink-700">Início</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-500">Acompanhantes</span>   {/* incluir o redirecionamento */}
          <span className="mx-2">/</span>
          <span className="text-gray-500">Perfil</span>
        </nav>
      </div>

      {/* Campo de busca estilizado */}
      {/* <div className="relative w-full max-w-md mb-6 mx-auto">
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
      </div> */}

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
                {companionData.media.map((mediaItem, index) => (
                  <div key={index} className="w-full h-48 bg-gray-200 flex-shrink-0">
                    <Image
                      src={mediaItem.url} // Usando a URL da mídia retornada da API
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
                {companionData.media.map((_, index) => (
                  <div key={index} className="w-2 h-2 bg-gray-400 rounded-full"></div>
                ))}
              </div>
            </div>

            {/* Imagem de perfil e nome */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative w-20 h-20 rounded-full border-4 border-pink-500 shadow-md overflow-hidden">
                <Image
                  src={companionData.profileImage} // Usando a imagem de perfil retornada da API
                  alt="Foto de perfil"
                  layout="fill"
                  objectFit="cover"
                />
                <FaCheckCircle className="absolute bottom-0 right-0 text-green-500 text-xl" />
              </div>
              <h2 className="text-xl text-black font-bold mt-2">{companionData.userName}</h2>
            </div>

            {/* Banner Google simulado */}
            <div className="bg-purple-200 p-2 rounded-md mb-4">
              <p className="text-center text-gray-600 font-semibold">Banner GOOGLE</p>
            </div>

            {/* Informações de telefone com ícone de copiar */}
            <div className="bg-purple-100 p-4 rounded-md mb-4 shadow-inner flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">Telefone:</p>
                <p className="text-lg text-gray-900">{companionData.phone}</p> {/* Exibindo telefone retornado da API */}
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
                {companionData.bannerImage ? (
                  <Image
                    src={companionData.bannerImage}
                    alt="Foto de perfil"
                    width={1200}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Sem foto</span>
                  </div>
                )}
              </div>

              {/* Foto de perfil: Usando posicionamento absoluto para sobrepor o banner */}
              <div className="absolute left-4 md:left-6 top-40 md:top-44 z-10">
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-lg overflow-hidden">
                  {companionData.profileImage ? (
                    <Image
                      src={companionData.profileImage}
                      alt="Foto de perfil"
                      width={150}
                      height={150}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Sem foto</span>
                    </div>
                  )}
                  <FaCheckCircle className="absolute bottom-0 right-0 text-green-500 text-lg" />
                </div>
              </div>

              {/* Conteúdo posicionado abaixo da foto */}
              <div className="mt-16 md:mt-20 px-4 md:px-6">
                <div className="text-center md:text-left text-gray-900 flex items-center justify-center md:justify-start space-x-2">
                  <h2 className="text-xl md:text-2xl font-bold">{companionData.userName}</h2>
                  <Link href="#" className="flex items-center space-x-1">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor()} ${getStatusAnimation()}`}></span>
                    <p className={`text-sm ${status === "online" ? "text-green-500" : "text-gray-500"}`}>
                      {status === "online" ? "Online agora" : "Offline há 30 minutos"}
                    </p>
                  </Link>
                </div>

                <div className="flex flex-col space-y-1 text-gray-700 mt-2">
                  {/* <div className="flex items-center space-x-2">
                    <FaDollarSign />
                    <p>{companionData.plan ? `${companionData.plan.name} - R$${companionData.plan.price}/h` : 'Plano não disponível'}</p>
                  </div> */}
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt />
                    <p>Local: {companionData.city} - {companionData.state}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaRegUser />
                    <p>Idade: {companionData.age} anos</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaMale />
                    <p>Atende:
                      {companionData.atendimentos && companionData.atendimentos.length > 0 ? (
                        companionData.atendimentos.map((atendimento, index) => (
                          <span key={index}>
                            {atendimento === "HOMENS" && "Homens"}
                            {atendimento === "MULHERES" && "Mulheres"}
                            {atendimento === "CASAIS" && "Casais"}
                            {atendimento === "DEFICIENTES_FISICOS" && "Deficientes Físicos"}
                            {index < companionData.atendimentos.length - 1 && ", "}
                          </span>
                        ))
                      ) : (
                        <span>Não especificado</span>
                      )}
                    </p>
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
              </div>

              {/* Botões de ação e seções adicionais */}
              <div className="mt-4 px-4 md:px-6 flex flex-wrap items-center justify-center md:justify-start space-x-2">
                {/* Botões de ação */}
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
                      className={`pb-2 capitalize ${activeTab === tab
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
                {activeTab === "fotos" && <Fotos userName={companionData.userName} />}
                {activeTab === "videos" && <Videos />}
                {activeTab === "sobre" && <Sobre physicalCharacteristics={companionData.PhysicalCharacteristics} description={companionData.description} />}
                {activeTab === "localidade" && <Localidade lugares={companionData.lugares} city={companionData.city} state={companionData.state} />}
                {activeTab === "serviços" && <Servicos servicesOffered={companionData.servicesOffered} weeklySchedules={companionData.weeklySchedules} />}
                {activeTab === "valores" && <Valores timedService={companionData.timedServiceCompanion} paymentMethods={companionData.paymentMethods} />}
              </div>
            </div>

            {/* Seção lateral com outros perfis e promoções */}
            <div className="lg:col-span-1 space-y-4 mt-6">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-4 text-black">Mais acompanhantes</h3>
                <div className="space-y-4 text-black">
                  {maisAcompanhantes
                    .filter((acompanhante) => acompanhante.userName !== userName) // Filtra o perfil atual
                    .map((acompanhante, index) => (
                      <div key={index} className="flex items-center">
                        {acompanhante.profileImage ? (
                          <Image
                            src={acompanhante.profileImage}
                            alt={`Acompanhante ${acompanhante.userName}`}
                            width={40}
                            height={40}
                            className="rounded-full w-10 h-10 object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                            {acompanhante.userName ? acompanhante.userName.charAt(0).toUpperCase() : ""}
                          </div>
                        )}
                        <div className="ml-4">
                          <p className="font-semibold">{acompanhante.userName}</p>
                          <p className="text-gray-600 text-sm">
                            {acompanhante.atendimentos && Array.isArray(acompanhante.atendimentos)
                              ? acompanhante.atendimentos.map((item, index) => (
                                <span key={index}>
                                  {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
                                  {index < acompanhante.atendimentos.length - 1 && ", "}
                                </span>
                              ))
                              : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <Image
                  src="/assets/banner-publi.jpg"
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
