import { useState } from "react";
import { FaInfoCircle, FaCamera, FaIdCard, FaAlignLeft } from "react-icons/fa";

export default function Sobre({ physicalCharacteristics, description, media }) {
  const [mostrarMaisDescricao, setMostrarMaisDescricao] = useState(false);
  const [mostrarMaisCaracteristicas, setMostrarMaisCaracteristicas] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  console.log("Media", media);

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
        <p className={`text-gray-700 ${!mostrarMaisDescricao ? "line-clamp-3" : ""}`}>
          {description}
        </p>
        <div className="mt-2 block md:hidden">
          <button onClick={toggleMostrarMaisDescricao} className="text-pink-500 font-bold hover:text-pink-600">
            {mostrarMaisDescricao ? "Ver menos ▲" : "Ver mais ▼"}
          </button>
        </div>
      </div>

      {/* Seção de mídia de comparação */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black flex items-center">
          <FaCamera className="mr-2 text-pink-500" /> Mídia de comparação
        </h2>
        <button onClick={abrirModal} className="text-pink-500 hover:text-pink-600 transition-colors duration-200">
          <FaInfoCircle className="cursor-pointer" />
        </button>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
            <h3 className="text-lg text-black font-semibold mb-4">Informação sobre a Mídia de Comparação</h3>
            <p className="text-gray-700 mb-4">
              Mídias de comparação são analisadas por nossa equipe para garantir credibilidade aos perfis. Caso tenha dúvidas sobre a veracidade de alguma mídia, consulte esta seção.
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

      {/* Layout com vídeo e características físicas */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Seção de vídeo */}
        {/* Verificação da variável 'media' */}
        {media && media.length > 0 ? (
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
                <source src={media[0].url} type="video/mp4" />
                Seu navegador não suporta a tag de vídeo.
              </video>
            </div>
            <p className="mt-2 text-center text-gray-600">
              Verificada em <span className="font-semibold">Ago/2024</span>.
            </p>
          </div>
        ) : (
          <div className="lg:w-1/3">
            <p className="text-gray-500">Sem mídia disponível</p>
          </div>
        )}

        {/* Características físicas */}
        <div className="lg:w-2/3 pl-4">
          <h3 className="text-lg text-black font-bold mb-2 flex items-center">
            <FaIdCard className="mr-2 text-pink-500" /> Características físicas
          </h3>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-black ${!mostrarMaisCaracteristicas && "md:max-h-[600px] md:overflow-hidden"}`}>
            <div>
              <p className="font-bold">Gênero</p>
              <p>
                {physicalCharacteristics && physicalCharacteristics.gender
                  ? physicalCharacteristics.gender === "MULHER_CISGENERO"
                    ? "Mulher Cisgênero"
                    : "Outro"
                  : "Não informado"}
              </p>
            </div>
            <div>
              <p className="font-bold">Genitália</p>
              <p>
                {physicalCharacteristics && physicalCharacteristics.genitalia
                  ? physicalCharacteristics.genitalia === "NATURAL"
                    ? "Natural"
                    : "Modificada"
                  : "Não informado"}
              </p>
            </div>
            <div>
              <p className="font-bold">Peso</p>
              <p>{physicalCharacteristics && physicalCharacteristics.weight ? `${physicalCharacteristics.weight} kg` : "Não informado"}</p>
            </div>
            <div>
              <p className="font-bold">Altura</p>
              <p>{physicalCharacteristics && physicalCharacteristics.height ? `${physicalCharacteristics.height / 100} m` : "Não informado"}</p>
            </div>
            <div>
              <p className="font-bold">Etnia</p>
              <p>{physicalCharacteristics && physicalCharacteristics.ethnicity ? physicalCharacteristics.ethnicity : "Não informado"}</p>
            </div>
            <div>
              <p className="font-bold">Cor dos olhos</p>
              <p>{physicalCharacteristics && physicalCharacteristics.eyeColor ? physicalCharacteristics.eyeColor : "Não informado"}</p>
            </div>
            <div>
              <p className="font-bold">Estilo de cabelo</p>
              <p>{physicalCharacteristics && physicalCharacteristics.hairStyle ? physicalCharacteristics.hairStyle : "Não informado"}</p>
            </div>
            <div>
              <p className="font-bold">Tamanho do cabelo</p>
              <p>{physicalCharacteristics && physicalCharacteristics.hairLength ? physicalCharacteristics.hairLength : "Não informado"}</p>
            </div>
            <div>
              <p className="font-bold">Tamanho do pé</p>
              <p>{physicalCharacteristics && physicalCharacteristics.shoeSize ? physicalCharacteristics.shoeSize : "Não informado"}</p>
            </div>
            <div>
              <p className="font-bold">Silicone</p>
              <p>{physicalCharacteristics && physicalCharacteristics.hasSilicone !== undefined ? (physicalCharacteristics.hasSilicone ? "Sim" : "Não") : "Não informado"}</p>
            </div>
            <div>
              <p className="font-bold">Tatuagens</p>
              <p>{physicalCharacteristics && physicalCharacteristics.hasTattoos !== undefined ? (physicalCharacteristics.hasTattoos ? "Sim" : "Não") : "Não informado"}</p>
            </div>
            <div>
              <p className="font-bold">Piercings</p>
              <p>{physicalCharacteristics && physicalCharacteristics.hasPiercings !== undefined ? (physicalCharacteristics.hasPiercings ? "Sim" : "Não") : "Não informado"}</p>
            </div>
            <div>
              <p className="font-bold">Fumante</p>
              <p>{physicalCharacteristics && physicalCharacteristics.smoker !== undefined ? (physicalCharacteristics.smoker ? "Sim" : "Não") : "Não informado"}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
