import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaServicestack,
  FaChevronDown,
  FaChevronUp,
  FaDollarSign,
  FaClock
} from 'react-icons/fa';
import Expediente from "../../components/perfil/Expediente";

export default function Servicos({ servicesOffered, weeklySchedules }) {
  const [mostrarNaoOferecidos, setMostrarNaoOferecidos] = useState(false);

  if (!servicesOffered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <motion.div
          className="text-center px-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 animate-spin">
            <FaServicestack className="w-full h-full text-pink-500" />
          </div>
          <p className="text-gray-600 font-medium text-sm sm:text-base">Carregando serviços...</p>
        </motion.div>
      </div>
    );
  }

  // Filtrar serviços oferecidos e não oferecidos
  const servicosOferecidos = servicesOffered.filter(service => service.isOffered);
  const servicosNaoOferecidos = servicesOffered.filter(service => !service.isOffered);

  const toggleNaoOferecidos = () => {
    setMostrarNaoOferecidos(!mostrarNaoOferecidos);
  };

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
              <FaServicestack className="text-pink-500 mr-3" />
              Serviços & Horários
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Serviços oferecidos e horários de atendimento
            </p>
          </div>
        </motion.div>

        {/* Componente Expediente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Expediente weeklySchedules={weeklySchedules} />
        </motion.div>

        {/* Seção de Serviços Oferecidos */}
        <motion.div
          className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 sm:p-3 rounded-lg mr-3">
              <FaCheckCircle className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Serviços Oferecidos</h2>
              <p className="text-gray-600 text-sm">
                {servicosOferecidos.length} serviço{servicosOferecidos.length !== 1 ? 's' : ''} disponível{servicosOferecidos.length !== 1 ? 'eis' : ''}
              </p>
            </div>
          </div>

          {servicosOferecidos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {servicosOferecidos.map((servico, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-green-200 hover:shadow-lg transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-green-500 p-2 rounded-lg group-hover:bg-green-600 transition-colors">
                      <FaCheckCircle className="text-white text-sm" />
                    </div>
                    {servico.price && (
                      <div className="bg-white border border-green-200 px-2 py-1 rounded-full flex items-center">
                        <FaDollarSign className="text-green-600 text-xs mr-1" />
                        <span className="text-green-700 font-bold text-xs">R$ {servico.price}</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-2 group-hover:text-green-700 transition-colors">
                    {servico.name}
                  </h3>
                  
                  {servico.price && (
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Taxa adicional pelo serviço
                    </p>
                  )}
                  
                  <div className="mt-3 flex items-center justify-between">
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      <FaCheckCircle className="mr-1 text-xs" />
                      Disponível
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaServicestack className="text-gray-400 text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Nenhum serviço oferecido</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Os serviços ainda não foram configurados.
              </p>
            </div>
          )}
        </motion.div>

        {/* Seção de Serviços Não Oferecidos */}
        {servicosNaoOferecidos.length > 0 && (
          <motion.div
            className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-red-500 to-rose-500 p-2 sm:p-3 rounded-lg mr-3">
                  <FaTimesCircle className="text-white text-lg sm:text-xl" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Serviços Não Oferecidos</h2>
                  <p className="text-gray-600 text-sm">
                    {servicosNaoOferecidos.length} serviço{servicosNaoOferecidos.length !== 1 ? 's' : ''} não disponível{servicosNaoOferecidos.length !== 1 ? 'eis' : ''}
                  </p>
                </div>
              </div>
              
              <motion.button
                onClick={toggleNaoOferecidos}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-semibold text-sm flex items-center space-x-2 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {mostrarNaoOferecidos ? (
                  <>
                    <FaChevronUp />
                    <span>Ocultar</span>
                  </>
                ) : (
                  <>
                    <FaChevronDown />
                    <span>Ver lista</span>
                  </>
                )}
              </motion.button>
            </div>

            <AnimatePresence>
              {mostrarNaoOferecidos && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {servicosNaoOferecidos.map((servico, index) => (
                      <motion.div
                        key={index}
                        className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-red-200 hover:shadow-lg transition-all duration-300 group opacity-75"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 0.75, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="bg-red-500 p-2 rounded-lg group-hover:bg-red-600 transition-colors">
                            <FaTimesCircle className="text-white text-sm" />
                          </div>
                        </div>
                        
                        <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-2 line-through group-hover:text-red-700 transition-colors">
                          {servico.name}
                        </h3>
                        
                        {servico.description && (
                          <p className="text-gray-600 text-xs sm:text-sm mb-3">
                            {servico.description}
                          </p>
                        )}
                        
                        <div className="mt-3">
                          <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            <FaTimesCircle className="mr-1 text-xs" />
                            Não disponível
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Resumo dos serviços */}
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <FaServicestack className="text-white text-xl sm:text-2xl" />
            </motion.div>
            
            <h3 className="text-lg sm:text-xl font-bold mb-2">Resumo dos Serviços</h3>
            <p className="text-white/90 text-sm sm:text-base mb-4">
              Total de opções disponíveis na plataforma
            </p>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs sm:text-sm font-semibold">Oferecidos</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-300">{servicosOferecidos.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs sm:text-sm font-semibold">Não oferecidos</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-300">{servicosNaoOferecidos.length}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}