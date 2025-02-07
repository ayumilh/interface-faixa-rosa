// components/perfil/Sobre.js

import { useState } from 'react';
import { FaInfoCircle, FaCamera, FaIdCard, FaAlignLeft } from 'react-icons/fa';

export default function Sobre() {
  const [mostrarMaisDescricao, setMostrarMaisDescricao] = useState(false);
  const [mostrarMaisCaracteristicas, setMostrarMaisCaracteristicas] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  const toggleMostrarMaisDescricao = () => {
    setMostrarMaisDescricao(!mostrarMaisDescricao);
  };

  const toggleMostrarMaisCaracteristicas = () => {
    setMostrarMaisCaracteristicas(!mostrarMaisCaracteristicas);
  };

  const abrirModal = () => {
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      {/* Seção de descrição */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black flex items-center mb-2">
          <FaAlignLeft className="mr-2 text-pink-500" /> Descrição
        </h2>
        <p className={`text-gray-700 ${!mostrarMaisDescricao ? 'line-clamp-3' : ''}`}>
          Sou uma profissional dedicada a proporcionar momentos de relaxamento e prazer em um ambiente discreto e acolhedor. Ofereço diversas modalidades de massagens e experiências personalizadas. Sempre prezando pelo bem-estar e conforto de quem me visita. Cada detalhe é pensado para tornar o momento inesquecível, desde o atendimento exclusivo até a atenção às suas preferências. Sinta-se à vontade para explorar todas as possibilidades e descobrir como posso tornar o seu dia mais especial.
        </p>
        {/* Botão de ver mais/menos para mobile apenas */}
        <div className="mt-2 block md:hidden">
          <button onClick={toggleMostrarMaisDescricao} className="text-pink-500 font-bold hover:text-pink-600">
            {mostrarMaisDescricao ? 'Ver menos ▲' : 'Ver mais ▼'}
          </button>
        </div>
      </div>

      {/* Título e ícones de informações */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black flex items-center">
          <FaCamera className="mr-2 text-pink-500" /> Mídia de comparação
        </h2>
        {/* Ícone de informação que abre o modal */}
        <button onClick={abrirModal} className="text-pink-500 hover:text-pink-600 transition-colors duration-200">
          <FaInfoCircle className="cursor-pointer" />
        </button>
      </div>

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
            <h3 className="text-lg text-black font-semibold mb-4">Informação sobre a Mídia de Comparação</h3>
            <p className="text-gray-700 mb-4">
              Mídias de comparação é o sistema que a Faixa Rosa usa visando gerar mais credibilidade aos perfis.
              Todas as mídias de comparação são analisadas por nossa equipe. Lembre-se: sempre que ficar com dúvida
              se as mídias de algum acompanhante são verdadeiras, venha aqui e dê uma espiada para comparar.
            </p>
            <button
              onClick={fecharModal}
              className="mt-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-300"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Layout com vídeo e características físicas lado a lado */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Seção de vídeo */}
        <div className="lg:w-1/3">
          <div className="relative">
            <video
              className="rounded-lg w-full shadow-lg hover:shadow-xl transition duration-300"
              autoPlay
              loop
              muted
              playsInline
              controls={false}
            >
              <source src="/assets/video.mp4" type="video/mp4" />
              Seu navegador não suporta a tag de vídeo.
            </video>
          </div>
          <p className="mt-2 text-center text-gray-600">
            Verificada em <span className="font-semibold">Ago/2024</span>.
          </p>
        </div>

        {/* Características físicas */}
        <div className="lg:w-2/3 pl-4">
          <h3 className="text-lg text-black font-bold mb-2 flex items-center">
            <FaIdCard className="mr-2 text-pink-500" /> Características físicas
          </h3>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-black ${!mostrarMaisCaracteristicas && 'md:max-h-[600px] md:overflow-hidden'}`}>
            <div>
              <p className="font-bold">Gênero</p>
              <p>Mulher</p>
              <p className="text-sm text-gray-600">Mulher Cisgênero. Nasceu do sexo feminino e se identifica como mulher.</p>
            </div>
            <div>
              <p className="font-bold">Genitália</p>
              <p>Possui vagina</p>
            </div>
            <div>
              <p className="font-bold">Peso</p>
              <p>61 kg</p>
            </div>
            <div>
              <p className="font-bold">Altura</p>
              <p>1,65 m</p>
            </div>
            <div>
              <p className="font-bold">Etnia</p>
              <p>Pardo</p>
            </div>
            <div>
              <p className="font-bold">Cor dos olhos</p>
              <p>Azul</p>
            </div>
            <div>
              <p className="font-bold">Estilo de cabelo</p>
              <p>Moreno</p>
            </div>
            <div>
              <p className="font-bold">Tamanho de cabelo</p>
              <p>Longo</p>
            </div>
            <div className={mostrarMaisCaracteristicas ? 'block' : 'hidden md:block'}>
              <p className="font-bold">Tamanho do pé</p>
              <p>36</p>
            </div>
            <div className={mostrarMaisCaracteristicas ? 'block' : 'hidden md:block'}>
              <p className="font-bold">Silicone</p>
              <p>Sim</p>
            </div>
            <div className={mostrarMaisCaracteristicas ? 'block' : 'hidden md:block'}>
              <p className="font-bold">Tatuagens</p>
              <p>Não</p>
            </div>
            <div className={mostrarMaisCaracteristicas ? 'block' : 'hidden md:block'}>
              <p className="font-bold">Piercings</p>
              <p>Não</p>
            </div>
            <div className={mostrarMaisCaracteristicas ? 'block' : 'hidden md:block'}>
              <p className="font-bold">Fumante</p>
              <p>Não informado</p>
            </div>
            <div className={mostrarMaisCaracteristicas ? 'block' : 'hidden md:block'}>
              <p className="font-bold">Idiomas</p>
              <p>Espanhol, Inglês e Português</p>
            </div>
          </div>

          {/* Botão de ver mais/menos para mobile apenas */}
          <div className="mt-4 block md:hidden">
            <button onClick={toggleMostrarMaisCaracteristicas} className="w-full text-center text-pink-500 font-bold hover:text-pink-600">
              {mostrarMaisCaracteristicas ? 'Ver menos ▲' : 'Ver mais ▼'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
