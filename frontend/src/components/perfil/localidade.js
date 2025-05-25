import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMapMarkerAlt, 
  FaChevronDown, 
  FaChevronUp, 
  FaLocationArrow,
  FaHome,
  FaCity,
  FaStar,
  FaMapPin
} from 'react-icons/fa';

export default function Localidade({ lugares, city, state }) {
  const [mostrarMais, setMostrarMais] = useState(false);

  const toggleMostrarMais = () => {
    setMostrarMais(!mostrarMais);
  };

  // Função para formatar nomes corretamente: primeira letra maiúscula, restante minúsculo
  const formatarNome = (nome) => {
    return nome
      .toLowerCase()
      .replace('_', ' ') // Substitui underscore por espaço
      .replace(/(^|\s)\S/g, (letra) => letra.toUpperCase()); // Capitaliza cada palavra
  };

  // Extrair e formatar os nomes das localidades
  const locaisAtendidos = lugares?.map(loc => formatarNome(loc.location?.name)).join(', ') || "Localização não informada";
  
  // Extrair e formatar comodidades sem duplicatas
  const todasComodidades = [...new Set(lugares?.flatMap(loc => loc.amenities) || [])]; 
  const comodidadesFormatadas = todasComodidades
    .map(amenity => formatarNome(amenity))
    .join(', ') || "Nenhuma comodidade informada";

  const locationData = [
    {
      icon: FaLocationArrow,
      title: "Locais que atendo",
      content: locaisAtendidos,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: FaStar,
      title: "Comodidades do local",
      content: comodidadesFormatadas,
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: FaMapPin,
      title: "Minha localização",
      content: `${city} - ${state}`,
      gradient: "from-pink-500 to-rose-500",
      isLocation: true
    },
    {
      icon: FaCity,
      title: "Bairros que também atendo",
      content: "Informações não disponíveis",
      gradient: "from-green-500 to-emerald-500"
    }
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
              <FaMapMarkerAlt className="text-pink-500 mr-3" />
              Localização & Atendimento
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Informações sobre localização e áreas de atendimento
            </p>
          </div>
        </motion.div>

        {/* Cards de informações */}
        <motion.div
          className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            {locationData.map((item, index) => (
              <motion.div
                key={item.title}
                className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -2, scale: 1.02 }}
              >
                {/* Background decorativo */}
                <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br opacity-10 rounded-full -mr-10 sm:-mr-12 -mt-10 sm:-mt-12"></div>
                
                {/* Ícone e título */}
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className={`bg-gradient-to-r ${item.gradient} p-2 sm:p-3 rounded-lg mr-3 flex-shrink-0`}>
                    <item.icon className="text-white text-sm sm:text-lg" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">{item.title}</h3>
                </div>

                {/* Conteúdo */}
                <div className="relative">
                  <p 
                    className={`text-gray-700 text-xs sm:text-sm leading-relaxed ${
                      item.isLocation ? 'text-pink-600 font-semibold' : ''
                    }`}
                  >
                    {item.content}
                  </p>
                  
                  {item.isLocation && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 bg-pink-100 text-pink-800 text-xs font-medium rounded-full">
                        <FaMapPin className="mr-1 text-xs" />
                        Localização Principal
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Seção adicional (cidades vizinhas) */}
          <AnimatePresence>
            {mostrarMais && (
              <motion.div
                className="mt-6 sm:mt-8"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 sm:p-3 rounded-lg mr-3">
                      <FaHome className="text-white text-sm sm:text-lg" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base">Cidades vizinhas que atendo</h3>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 sm:p-4 border border-orange-200">
                    <p className="text-gray-600 text-xs sm:text-sm text-center">
                      📍 Atualmente não atende em cidades vizinhas
                    </p>
                    <p className="text-gray-500 text-xs mt-2 text-center">
                      Entre em contato para verificar disponibilidade
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botão Ver mais/menos */}
          <div className="mt-6 sm:mt-8 text-center">
            <motion.button
              onClick={toggleMostrarMais}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2 mx-auto text-sm sm:text-base shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mostrarMais ? (
                <>
                  <FaChevronUp />
                  <span>Ver menos informações</span>
                </>
              ) : (
                <>
                  <FaChevronDown />
                  <span>Ver mais informações</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}