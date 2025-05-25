import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaCalendarDay,
  FaBusinessTime,
  FaInfoCircle
} from 'react-icons/fa';

const diasDaSemanaMap = {
  Monday: 'Segunda-feira',
  Tuesday: 'Terça-feira',
  Wednesday: 'Quarta-feira',
  Thursday: 'Quinta-feira',
  Friday: 'Sexta-feira',
  Saturday: 'Sábado',
  Sunday: 'Domingo',
};

const diasAbreviados = {
  Monday: 'SEG',
  Tuesday: 'TER',
  Wednesday: 'QUA',
  Thursday: 'QUI',
  Friday: 'SEX',
  Saturday: 'SÁB',
  Sunday: 'DOM',
};

const Expediente = ({ weeklySchedules }) => {
  if (!weeklySchedules || weeklySchedules.length === 0) {
    return (
      <motion.div
        className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center py-8 sm:py-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaClock className="text-gray-400 text-2xl sm:text-3xl" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Horários não informados</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Os horários de atendimento ainda não foram configurados.
          </p>
        </div>
      </motion.div>
    );
  }

  // Calcular estatísticas
  const diasAtivos = weeklySchedules.filter(item => item.isActive).length;
  const totalDias = weeklySchedules.length;

  return (
    <motion.div
      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 sm:p-3 rounded-lg mr-3">
          <FaClock className="text-white text-lg sm:text-xl" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Horário de Expediente</h3>
          <p className="text-gray-600 text-sm">
            {diasAtivos} de {totalDias} dias com atendimento
          </p>
        </div>
      </div>

      {/* Cards dos dias da semana */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {weeklySchedules.map((item, index) => (
          <motion.div
            key={index}
            className={`relative rounded-xl sm:rounded-2xl p-4 border transition-all duration-300 hover:shadow-md ${
              item.isActive 
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300' 
                : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200 hover:border-red-300'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2, scale: 1.02 }}
          >
            {/* Status indicator */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className={`p-1.5 rounded-lg mr-2 ${
                  item.isActive ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {item.isActive ? (
                    <FaCheckCircle className="text-white text-xs" />
                  ) : (
                    <FaTimesCircle className="text-white text-xs" />
                  )}
                </div>
                <span className={`text-xs font-bold ${
                  item.isActive ? 'text-green-700' : 'text-red-700'
                }`}>
                  {diasAbreviados[item.dayOfWeek] || item.dayOfWeek.substring(0, 3).toUpperCase()}
                </span>
              </div>
              
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                item.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {item.isActive ? 'Aberto' : 'Fechado'}
              </span>
            </div>

            {/* Dia da semana */}
            <h4 className="font-bold text-gray-800 text-sm mb-2">
              {diasDaSemanaMap[item.dayOfWeek] || item.dayOfWeek}
            </h4>

            {/* Horário */}
            <div className="flex items-center">
              <FaBusinessTime className={`mr-2 text-sm ${
                item.isActive ? 'text-green-600' : 'text-red-600'
              }`} />
              <span className={`text-sm font-medium ${
                item.isActive ? 'text-gray-800' : 'text-gray-500'
              }`}>
                {item.isActive ? `${item.startTime} - ${item.endTime}` : 'Fechado'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resumo visual */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-green-800">Dias Abertos</p>
              <p className="text-xl font-bold text-green-700">{diasAtivos}</p>
            </div>
            <FaCheckCircle className="text-green-500 text-lg" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg p-3 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-red-800">Dias Fechados</p>
              <p className="text-xl font-bold text-red-700">{totalDias - diasAtivos}</p>
            </div>
            <FaTimesCircle className="text-red-500 text-lg" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-800">Disponibilidade</p>
              <p className="text-xl font-bold text-blue-700">{Math.round((diasAtivos / totalDias) * 100)}%</p>
            </div>
            <FaCalendarDay className="text-blue-500 text-lg" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-800">Total Dias</p>
              <p className="text-xl font-bold text-purple-700">{totalDias}</p>
            </div>
            <FaClock className="text-purple-500 text-lg" />
          </div>
        </div>
      </div>

      {/* Aviso importante */}
      <motion.div
        className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 flex items-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-yellow-500 p-2 rounded-lg mr-3 flex-shrink-0">
          <FaInfoCircle className="text-white text-sm" />
        </div>
        <div>
          <h4 className="font-semibold text-yellow-800 text-sm mb-1">Importante</h4>
          <p className="text-yellow-700 text-xs sm:text-sm leading-relaxed">
            A disponibilidade do anunciante não é garantida pelo seu horário de atendimento. 
            Recomendamos sempre confirmar a disponibilidade antes de agendar.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Expediente;