import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image"; 
import { 
  FaMoneyBillWave, 
  FaCreditCard, 
  FaCcVisa, 
  FaCcMastercard, 
  FaMoneyCheck,
  FaChevronDown,
  FaChevronUp,
  FaDollarSign,
  FaClock,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

export default function Valores({ timedService, paymentMethods }) {
  const [mostrarNaoOferecidos, setMostrarNaoOferecidos] = useState(false);

  const paymentIcons = { 
    PIX: <Image src="/assets/pix-icon.png" alt="Pix Icon" width={32} height={32} className="w-8 h-8" />, 
    DEBITO: <FaCcMastercard className="text-2xl text-blue-600" />, 
    CARTAO_CREDITO: <FaCreditCard className="text-2xl text-green-600" />, 
    DINHEIRO: <FaMoneyBillWave className="text-2xl text-yellow-600" />, 
  }; 
 
  // Definição dos nomes formatados 
  const paymentNames = { 
    PIX: "PIX", 
    DEBITO: "Cartão de Débito", 
    CARTAO_CREDITO: "Cartão de Crédito", 
    DINHEIRO: "Dinheiro", 
  }; 

  // Separar serviços oferecidos e não oferecidos
  const servicosOferecidos = timedService?.filter(service => service.isOffered) || [];
  const servicosNaoOferecidos = timedService?.filter(service => !service.isOffered) || [];

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
              <FaMoneyBillWave className="text-pink-500 mr-3" />
              Valores & Pagamento
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Preços dos serviços e formas de pagamento aceitas
            </p>
          </div>
        </motion.div>

        {/* Seção de Serviços com Valores */}
        <motion.div
          className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 sm:p-3 rounded-lg mr-3">
              <FaClock className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Tabela de Preços</h2>
              <p className="text-gray-600 text-sm">
                {servicosOferecidos.length} serviço{servicosOferecidos.length !== 1 ? 's' : ''} disponível{servicosOferecidos.length !== 1 ? 'eis' : ''}
              </p>
            </div>
          </div>

          {servicosOferecidos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {servicosOferecidos.map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-green-200 hover:shadow-lg transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-green-500 p-2 rounded-lg group-hover:bg-green-600 transition-colors">
                      <FaCheckCircle className="text-white text-sm" />
                    </div>
                    <div className="bg-white border border-green-200 px-3 py-1 rounded-full flex items-center">
                      <FaDollarSign className="text-green-600 text-sm mr-1" />
                      <span className="text-green-700 font-bold text-lg">R$ {service.price}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-2 group-hover:text-green-700 transition-colors">
                    {service.name}
                  </h3>
                  
                  <div className="flex items-center justify-between">
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
                <FaClock className="text-gray-400 text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Nenhum serviço disponível</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Os preços ainda não foram configurados.
              </p>
            </div>
          )}

          {/* Serviços não oferecidos */}
          {servicosNaoOferecidos.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <FaTimesCircle className="text-red-500 mr-2" />
                  Serviços Não Realizados
                </h3>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {servicosNaoOferecidos.map((service, index) => (
                        <motion.div
                          key={index}
                          className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-200 opacity-75"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 0.75, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="bg-red-500 p-2 rounded-lg">
                              <FaTimesCircle className="text-white text-sm" />
                            </div>
                            <span className="text-red-600 font-bold text-sm">Não realiza</span>
                          </div>
                          
                          <h3 className="font-bold text-gray-800 text-sm line-through mb-2">
                            {service.name}
                          </h3>
                          
                          <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            <FaTimesCircle className="mr-1 text-xs" />
                            Indisponível
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Formas de Pagamento */}
        <motion.div
          className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 sm:p-3 rounded-lg mr-3">
              <FaCreditCard className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Formas de Pagamento</h2>
              <p className="text-gray-600 text-sm">
                {paymentMethods?.length || 0} método{(paymentMethods?.length || 0) !== 1 ? 's' : ''} aceito{(paymentMethods?.length || 0) !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {paymentMethods && paymentMethods.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {paymentMethods.map((method, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-blue-200 hover:shadow-lg transition-all duration-300 group text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -2, scale: 1.05 }}
                >
                  <div className="flex justify-center mb-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                      {paymentIcons[method] || <FaMoneyCheck className="text-2xl text-gray-600" />}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-800 text-xs sm:text-sm group-hover:text-blue-700 transition-colors">
                    {paymentNames[method] || method}
                  </h3>
                  
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      <FaCheckCircle className="mr-1 text-xs" />
                      Aceito
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCreditCard className="text-gray-400 text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Nenhuma forma de pagamento</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                As formas de pagamento ainda não foram configuradas.
              </p>
            </div>
          )}
        </motion.div>

        {/* Resumo Financeiro */}
        <motion.div
          className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg text-white"
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
              <FaMoneyBillWave className="text-white text-xl sm:text-2xl" />
            </motion.div>
            
            <h3 className="text-lg sm:text-xl font-bold mb-2">Resumo dos Valores</h3>
            <p className="text-white/90 text-sm sm:text-base mb-4">
              Informações sobre preços e pagamentos
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs sm:text-sm font-semibold">Serviços</p>
                <p className="text-lg sm:text-xl font-bold">{servicosOferecidos.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs sm:text-sm font-semibold">Pagamentos</p>
                <p className="text-lg sm:text-xl font-bold">{paymentMethods?.length || 0}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:col-span-1 col-span-2">
                <p className="text-xs sm:text-sm font-semibold">Menor Valor</p>
                <p className="text-lg sm:text-xl font-bold">
                  {servicosOferecidos.length > 0 
                    ? `R$ ${Math.min(...servicosOferecidos.map(s => parseFloat(s.price)))}` 
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}