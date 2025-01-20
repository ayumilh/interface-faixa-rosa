"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FaSearch,
  FaUser,
  FaComments,
  FaVideo,
  FaCheckCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import ModalBusca from "@/components/search/modalbusca";
import Footer from "@/components/search/footer";

export default function Parte01() {
  const [showModalBusca, setShowModalBusca] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8">
      <div className="w-full max-w-4xl mx-auto text-center mb-auto">
        
        {/* Título e Subtítulo */}
        <h1 className="text-2xl md:text-4xl font-bold mb-2 text-gray-800 tracking-wide mt-24">
          A <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff0055] via-[#ff33aa] to-[#9900ff]">melhor plataforma</span> de acompanhantes do Brasil
        </h1>
        <p className="text-gray-600 font-medium mb-6">
          Faixa Rosa, <span className="underline decoration-transparent bg-clip-text text-transparent bg-gradient-to-r from-[#ff0055] via-[#ff33aa] to-[#9900ff]">onde a elegância</span>{" "}
          encontra seu momento exclusivo.
        </p>

        {/* Cartões de ação com layout responsivo */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-6">
          
          {/* Cartões de ação */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-4 flex flex-col items-center shadow-lg transform transition-transform duration-300 hover:scale-105">
            <FaUser className="text-white text-3xl mb-2" />
            <h3 className="text-md font-semibold text-white">Documentos Verificados</h3>
            <p className="text-sm text-gray-200">Segurança em todos os perfis.</p>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 flex flex-col items-center shadow-lg transform transition-transform duration-300 hover:scale-105">
            <FaComments className="text-white text-3xl mb-2" />
            <h3 className="text-md font-semibold text-white">Mídia de Comparação 360°</h3>
            <p className="text-sm text-gray-200">Imagens detalhadas de cada perfil.</p>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 flex flex-col items-center shadow-lg transform transition-transform duration-300 hover:scale-105">
            <FaCheckCircle className="text-white text-3xl mb-2" />
            <h3 className="text-md font-semibold text-white">Verificação Fácil</h3>
            <p className="text-sm text-gray-200">Perfis aprovados com rigor.</p>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-4 flex flex-col items-center shadow-lg transform transition-transform duration-300 hover:scale-105">
            <FaVideo className="text-white text-3xl mb-2" />
            <h3 className="text-md font-semibold text-white">Cuidados da Saúde</h3>
            <p className="text-sm text-gray-200">Dicas e suporte para bem-estar.</p>
          </div>
        </div>

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
            className="absolute right-4 top-2.5 bg-gradient-to-r from-[#ff0055] via-[#ff33aa] to-[#9900ff] p-2 rounded-full text-white transition-transform transform hover:scale-110"
            onClick={() => setShowModalBusca(true)}
          >
            <FaSearch size={16} />
          </button>
          <p className="text-xs text-gray-500 mt-2">
            A PROFISSÃO DE ACOMPANHANTE É LEGALIZADA NO BRASIL e reconhecida pelo Ministério do
            Trabalho desde 2002.
          </p>
        </div>
  
     {/* Informativo de convênios estilizado com redirecionamento */}
<Link href="/convenio/">
  <div className="bg-white w-full max-w-md mx-auto rounded-lg p-6 text-center shadow-lg border border-gray-300 mb-6 hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer mt-16">
    <div className="flex justify-center items-center mb-4">
      <FaMapMarkerAlt className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-[#ff0055] via-[#ff33aa] to-[#9900ff] text-2xl mr-2" />
      <h2 className="text-lg font-semibold text-gray-800">Você é anunciante?</h2>
    </div>
    <p className="text-gray-600">
      Explore nossos <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff0055] via-[#ff33aa] to-[#9900ff] font-bold">convênios exclusivos</span>{" "}
      perto de você e descubra vantagens feitas para você!
    </p>
  </div>
</Link>

  
        {/* Modal de busca */}
        {showModalBusca && (
          <ModalBusca
            showModalBusca={showModalBusca}
            setShowModalBusca={setShowModalBusca}
          />
        )}
      </div>
      
      {/* Rodapé fixo */}
      <Footer />
    </div>
  );
}
