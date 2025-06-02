import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  FaInfoCircle, 
  FaCamera, 
  FaIdCard, 
  FaAlignLeft, 
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaPlay,
  FaUser,
  FaRuler,
  FaWeight,
  FaEye,
  FaPalette,
  FaCut,
  FaShoePrints
} from "react-icons/fa";

export default function Sobre({ physicalCharacteristics, description, media }) {
  console.log("Media:", media);
  const [mostrarMaisDescricao, setMostrarMaisDescricao] = useState(false);
  const [mostrarMaisCaracteristicas, setMostrarMaisCaracteristicas] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

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

  // Função para formatar dados das características
  const formatCharacteristic = (value, type = 'text') => {
    if (value === undefined || value === null) return "Não informado";
    
    switch (type) {
      case 'boolean':
        return value ? "Sim" : "Não";
      case 'weight':
        return `${value} kg`;
      case 'height':
        return `${(value / 100).toFixed(2)} m`;
      case 'gender':
        return value === "MULHER_CISGENERO" ? "Mulher Cisgênero" : value;
      case 'genitalia':
        return value === "NATURAL" ? "Natural" : "Modificada";
      default:
        return value;
    }
  };

  const characteristics = [
    { icon: FaUser, label: "Gênero", value: formatCharacteristic(physicalCharacteristics?.gender, 'gender') },
    { icon: FaUser, label: "Genitália", value: formatCharacteristic(physicalCharacteristics?.genitalia, 'genitalia') },
    { icon: FaWeight, label: "Peso", value: formatCharacteristic(physicalCharacteristics?.weight, 'weight') },
    { icon: FaRuler, label: "Altura", value: formatCharacteristic(physicalCharacteristics?.height, 'height') },
    { icon: FaPalette, label: "Etnia", value: formatCharacteristic(physicalCharacteristics?.ethnicity) },
    { icon: FaEye, label: "Cor dos olhos", value: formatCharacteristic(physicalCharacteristics?.eyeColor) },
    { icon: FaCut, label: "Estilo de cabelo", value: formatCharacteristic(physicalCharacteristics?.hairStyle) },
    { icon: FaCut, label: "Tamanho do cabelo", value: formatCharacteristic(physicalCharacteristics?.hairLength) },
    { icon: FaShoePrints, label: "Tamanho do pé", value: formatCharacteristic(physicalCharacteristics?.shoeSize) },
    { icon: FaUser, label: "Silicone", value: formatCharacteristic(physicalCharacteristics?.hasSilicone, 'boolean') },
    { icon: FaPalette, label: "Tatuagens", value: formatCharacteristic(physicalCharacteristics?.hasTattoos, 'boolean') },
    { icon: FaPalette, label: "Piercings", value: formatCharacteristic(physicalCharacteristics?.hasPiercings, 'boolean') },
    { icon: FaUser, label: "Fumante", value: formatCharacteristic(physicalCharacteristics?.smoker, 'boolean') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-8">
        {/* Header */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center justify-center">
              <FaInfoCircle className="text-pink-500 mr-3" />
              Sobre
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Informações detalhadas e mídia de verificação
            </p>
          </div>
        </motion.div>

        {/* Seção de descrição */}
        <motion.div
          className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-lg mr-3">
              <FaAlignLeft className="text-white text-lg" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Descrição</h2>
          </div>
          
          <div className="relative">
            <p 
              className={`text-gray-700 text-sm sm:text-base leading-relaxed transition-all duration-300 ${
                !mostrarMaisDescricao ? "line-clamp-4 sm:line-clamp-6" : ""
              }`}
            >
              {description || "Nenhuma descrição disponível."}
            </p>
            
            {description && description.length > 200 && (
              <motion.button
                onClick={toggleMostrarMaisDescricao}
                className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {mostrarMaisDescricao ? (
                  <>
                    <FaChevronUp />
                    <span>Ver menos</span>
                  </>
                ) : (
                  <>
                    <FaChevronDown />
                    <span>Ver mais</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Seção de mídia de comparação */}
        <motion.div
          className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-lg mr-3">
                <FaCamera className="text-white text-lg" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Mídia de Verificação</h2>
            </div>
            <motion.button
              onClick={abrirModal}
              className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaInfoCircle className="text-pink-500 text-lg" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Vídeo de verificação */}
            <div className="lg:col-span-1">
              {media && media.length > 0 && media[0].status === "APPROVED" ? (
                <div className="relative group">
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <video
                      className="w-full h-auto rounded-xl transition-transform duration-300 group-hover:scale-105"
                      autoPlay={videoPlaying}
                      loop
                      muted
                      playsInline
                      controls={videoPlaying}
                      onClick={() => setVideoPlaying(!videoPlaying)}
                    >
                      <source src={media[0].url} type="video/mp4" />
                      Seu navegador não suporta a tag de vídeo.
                    </video>
                    
                    {/* Play overlay */}
                    {!videoPlaying && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                          <FaPlay className="text-white text-2xl ml-1" />
                        </div>
                      </div>
                    )}

                    {/* Marca d'água */}
                    <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded flex items-center space-x-1 text-xs text-white">
                      <Image
                        src="/iconOficial_faixaRosa.png"
                        alt="Logo"
                        width={12}
                        height={12}
                        className="object-contain w-3 h-3"
                      />
                      <span className="text-xs font-medium">faixarosa.com</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-xl p-6 text-center">
                  <FaCamera className="text-gray-400 text-3xl mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Sem mídia de verificação disponível</p>
                </div>
              )}
            </div>

            {/* Características físicas */}
            <div className="lg:col-span-3">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-lg mr-3">
                  <FaIdCard className="text-white text-lg" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Características Físicas</h3>
              </div>

              <div 
                className={`grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 transition-all duration-300 ${
                  !mostrarMaisCaracteristicas ? "max-h-96 overflow-hidden" : ""
                }`}
              >
                {characteristics.map((char, index) => (
                  <motion.div
                    key={char.label}
                    className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200 border border-gray-100"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.01 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-1.5 rounded-lg flex-shrink-0">
                        <char.icon className="text-white text-xs" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-xs mb-0.5">{char.label}</p>
                        <p className="text-gray-600 text-sm font-medium">{char.value}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Botão Ver todas para mobile */}
              <div className="sm:hidden mt-4 text-center">
                <motion.button
                  onClick={toggleMostrarMaisCaracteristicas}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold text-sm flex items-center space-x-2 mx-auto transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {mostrarMaisCaracteristicas ? (
                    <>
                      <FaChevronUp />
                      <span>Ver menos características</span>
                    </>
                  ) : (
                    <>
                      <FaChevronDown />
                      <span>Ver todas características</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modal de informação */}
        <AnimatePresence>
          {modalAberto && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={fecharModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-lg mr-3">
                      <FaInfoCircle className="text-white text-lg" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Mídia de Verificação</h3>
                  </div>
                  <button
                    onClick={fecharModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed mb-6">
                  Mídias de verificação são analisadas por nossa equipe para garantir a autenticidade dos perfis. 
                  Este processo ajuda a verificar a identidade e aumentar a confiança na plataforma.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                  <p className="text-blue-800 text-xs font-medium">
                    💡 As verificações são realizadas periodicamente para manter a segurança da comunidade.
                  </p>
                </div>

                <motion.button
                  onClick={fecharModal}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Entendi
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}