import React, { useState, useEffect, useCallback } from "react";
import {
  FaClock,
  FaTrash,
  FaSave,
  FaCopy,
  FaPlay,
  FaGraduationCap,
  FaLightbulb,
  FaTimes,
  FaSpinner,
  FaInfoCircle,
  FaExclamationTriangle,
  FaBars,
  FaArrowRight,
  FaChartLine,
  FaTrophy,
  FaGem,
  FaCamera,
  FaStar,
  FaHeart,
  FaComment,
  FaCheck,
  FaEye,
  FaEdit,
  FaKeyboard,
  FaCog,
  FaServicestack,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarCheck,
  FaCalendarTimes,
  FaBusinessTime,
  FaRegClock
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { toast } from "react-toastify";

const WorkingHours = () => {
  // Estados principais
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Estados do tutorial
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Estados de horários
  const [workingHours, setWorkingHours] = useState([]);
  const [originalHours, setOriginalHours] = useState([]);
  const [exceptions, setExceptions] = useState([]);
  const [originalExceptions, setOriginalExceptions] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [message, setMessage] = useState("");

  // Configuração das tabs
  const tabs = [
    { id: "overview", label: "Resumo", icon: FaChartLine },
    { id: "schedule", label: "Horários", icon: FaClock },
    { id: "exceptions", label: "Exceções", icon: FaCalendarTimes },
  ];

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Bem-vinda ao Gerenciamento de Horários! ⏰",
      description: "Configure seus horários de trabalho e exceções para que clientes saibam quando você está disponível",
      icon: FaGraduationCap,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Resumo dos Horários 📊",
      description: "Veja estatísticas dos seus horários configurados, dias ativos e total de horas semanais",
      icon: FaChartLine,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Configurar Horários 🕐",
      description: "Defina seus horários para cada dia da semana. Use o botão 'Copiar' para aplicar o mesmo horário a todos os dias",
      icon: FaClock,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Marcar Exceções 📅",
      description: "Use o calendário para marcar dias específicos em que você não estará disponível",
      icon: FaCalendarTimes,
      color: "from-red-500 to-pink-500"
    },
    {
      title: "Dicas Importantes 💡",
      description: "Horários bem configurados aumentam a confiança dos clientes e melhoram sua organização pessoal",
      icon: FaLightbulb,
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "Salvar Alterações 💾",
      description: "Sempre clique em 'Salvar' após fazer alterações para que apareçam no seu perfil público!",
      icon: FaSave,
      color: "from-purple-500 to-pink-500"
    }
  ];

  const defaultSchedule = [
    { id: 1, dia: "Segunda-feira", ativo: false, start: "", end: "" },
    { id: 2, dia: "Terça-feira", ativo: false, start: "", end: "" },
    { id: 3, dia: "Quarta-feira", ativo: false, start: "", end: "" },
    { id: 4, dia: "Quinta-feira", ativo: false, start: "", end: "" },
    { id: 5, dia: "Sexta-feira", ativo: false, start: "", end: "" },
    { id: 6, dia: "Sábado", ativo: false, start: "", end: "" },
    { id: 7, dia: "Domingo", ativo: false, start: "", end: "" },
  ];

  const daysOfWeekMap = {
    "Monday": "Segunda-feira",
    "Tuesday": "Terça-feira",
    "Wednesday": "Quarta-feira",
    "Thursday": "Quinta-feira",
    "Friday": "Sexta-feira",
    "Saturday": "Sábado",
    "Sunday": "Domingo"
  };

  // Tutorial handlers
  const handleNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowTutorial(false);
      setCurrentStep(0);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    setCurrentStep(0);
  };

  // Função para buscar horários
  const fetchWorkingHours = useCallback(async () => {
    try {
      const token = Cookies.get("userToken");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/schedule`,
        { withCredentials: true }
      );

      if (response.data.schedule) {
        const formattedData = defaultSchedule.map((defaultDay) => {
          const existingDay = response.data.schedule.find(
            (item) => daysOfWeekMap[item.dayOfWeek] === defaultDay.dia
          );

          return existingDay
            ? {
              id: existingDay.id,
              dia: daysOfWeekMap[existingDay.dayOfWeek],
              ativo: existingDay.isActive,
              start: existingDay.startTime,
              end: existingDay.endTime,
              error: "",
            }
            : defaultDay;
        });

        setWorkingHours(formattedData);
        setOriginalHours(JSON.stringify(formattedData));
      } else {
        setWorkingHours(defaultSchedule);
      }
      setLoadingPage(false);
    } catch (error) {
      console.error("Erro ao buscar horários do backend:", error);
      setWorkingHours(defaultSchedule);
      setLoadingPage(false);
    }
  }, []);

  // Função para buscar as datas indisponíveis do backend
  const fetchUnavailableDates = async () => {
    try {
      const token = Cookies.get("userToken");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/unavailable-date`,
        { withCredentials: true }
      );

      if (response.data.unavailableDates) {
        const formattedDates = response.data.unavailableDates.map(date => new Date(date).toDateString());
        setExceptions(formattedDates);
        setOriginalExceptions(JSON.stringify(formattedDates));
      }
    } catch (error) {
      console.error("Erro ao buscar datas indisponíveis:", error);
    }
  };

  useEffect(() => {
    fetchWorkingHours();
    fetchUnavailableDates();
  }, [fetchWorkingHours]);

  useEffect(() => {
    setTimeout(() => {
      setLoadingPage(false);
    }, 1000);
  }, []);

  const handleHoursChange = (index, field, value) => {
    const updatedHours = [...workingHours];
    updatedHours[index][field] = value;
    updatedHours[index].error = "";

    if (field === "end" || field === "start") {
      const start = updatedHours[index].start;
      const end = updatedHours[index].end;
      if (start && end && start >= end) {
        updatedHours[index].error = "O horário de término deve ser posterior ao horário de início.";
      }
    }

    setWorkingHours(updatedHours);
    setIsUpdated(JSON.stringify(updatedHours) !== originalHours);
  };

  // Copia os horários de segunda para os outros dias
  const copyMondayToAll = () => {
    const updatedHours = workingHours.map((day, index) => {
      if (index === 0) return day;
      return { ...day, ativo: workingHours[0].ativo, start: workingHours[0].start, end: workingHours[0].end };
    });

    setWorkingHours(updatedHours);
    setIsUpdated(true);
    toast.success("✨ Horários copiados para todos os dias!");
  };

  // Função para salvar alterações
  const saveChanges = async () => {
    setLoading(true);
    setMessage("");

    const token = Cookies.get("userToken");

    const daysOfWeek = {
      "Segunda-feira": "Monday",
      "Terça-feira": "Tuesday",
      "Quarta-feira": "Wednesday",
      "Quinta-feira": "Thursday",
      "Sexta-feira": "Friday",
      "Sábado": "Saturday",
      "Domingo": "Sunday",
    };

    const payload = {
      schedule: workingHours.map(({ dia, start, end, ativo }) => ({
        dayOfWeek: daysOfWeek[dia] || dia,
        startTime: ativo && start ? start : "00:00",
        endTime: ativo && end ? end : "00:00",
        isActive: ativo,
      })),
    };

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/schedule/update`,
        payload,
        { withCredentials: true }
      );

      setOriginalHours(JSON.stringify(workingHours));
      setIsUpdated(false);
      toast.success("⏰ Horários atualizados com sucesso!");

      setTimeout(async () => {
        await fetchWorkingHours();
      }, 2000);
    } catch (error) {
      console.error("Erro ao atualizar horários:", error);
      toast.error("❌ Erro ao salvar horários. Tente novamente.");
    }

    setLoading(false);
  };

  const handleDateClick = (date) => {
    const dateStr = date.toDateString();
    let updatedDates;

    if (exceptions.includes(dateStr)) {
      updatedDates = exceptions.filter(d => d !== dateStr);
    } else {
      updatedDates = [...exceptions, dateStr];
    }

    setExceptions(updatedDates);
    setIsUpdated(JSON.stringify(updatedDates) !== originalExceptions);
  };

  // Função para salvar as datas indisponíveis no backend
  const saveUnavailableDates = async () => {
    setLoading(true);
    setMessage("");

    const token = Cookies.get("userToken");
    const formattedDates = exceptions.map(date => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    });

    const payload = { unavailableDates: formattedDates };

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/unavailable-date/update`,
        payload,
        { withCredentials: true }
      );

      setOriginalExceptions(JSON.stringify(exceptions));
      setIsUpdated(false);
      toast.success("📅 Datas indisponíveis atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar datas indisponíveis:", error);
      toast.error("❌ Erro ao salvar exceções. Tente novamente.");
    }

    setLoading(false);
  };

  // Calcular estatísticas
  const activeDays = workingHours.filter(day => day.ativo).length;
  const totalDays = workingHours.length;
  const totalWeeklyHours = workingHours.reduce((total, day) => {
    if (day.ativo && day.start && day.end) {
      const start = new Date(`2000-01-01T${day.start}`);
      const end = new Date(`2000-01-01T${day.end}`);
      const diff = (end - start) / (1000 * 60 * 60);
      return total + diff;
    }
    return total;
  }, 0);
  const exceptionsCount = exceptions.length;

  const renderOverviewTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {/* Dias Ativos */}
        <motion.div
          className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10"></div>
          <FaBusinessTime className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-green-200" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">Dias Ativos</h3>
          <div className="text-2xl sm:text-3xl font-bold">{activeDays}/{totalDays}</div>
        </motion.div>

        {/* Horas Semanais */}
        <motion.div
          className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10"></div>
          <FaClock className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-cyan-200" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">Horas Semanais</h3>
          <div className="text-2xl sm:text-3xl font-bold">{totalWeeklyHours.toFixed(1)}h</div>
        </motion.div>

        {/* Exceções */}
        <motion.div
          className="bg-gradient-to-br from-red-500 to-pink-500 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10"></div>
          <FaCalendarTimes className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-pink-200" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">Exceções</h3>
          <div className="text-2xl sm:text-3xl font-bold">{exceptionsCount}</div>
        </motion.div>

        {/* Status Geral */}
        <motion.div
          className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white relative overflow-hidden sm:col-span-2 lg:col-span-1"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10"></div>
          <FaTrophy className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-purple-200" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">Status</h3>
          <div className="text-sm sm:text-lg">
            {activeDays > 0 ? "Configurado" : "Pendente"}
          </div>
        </motion.div>
      </div>

      {/* Resumo dos horários ativos */}
      {activeDays > 0 && (
        <motion.div
          className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
            <FaCalendarCheck className="text-green-500 mr-2" />
            Seus Horários de Trabalho
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {workingHours
              .filter(day => day.ativo)
              .map((day, index) => (
                <div key={day.id} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 sm:p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{day.dia}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {day.start} - {day.end}
                      </p>
                    </div>
                    <div className="bg-green-500 text-white p-2 rounded-full">
                      <FaCheckCircle className="text-sm" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Próximas exceções */}
      {exceptionsCount > 0 && (
        <motion.div
          className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
            <FaCalendarTimes className="text-red-500 mr-2" />
            Próximas Exceções
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {exceptions
              .map(dateStr => new Date(dateStr))
              .sort((a, b) => a - b)
              .slice(0, 6)
              .map((date, index) => (
                <div key={index} className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <FaCalendarTimes className="text-red-500 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-800">
                      {date.toLocaleDateString('pt-BR', {
                        weekday: 'short',
                        day: '2-digit',
                        month: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
          </div>

          {exceptionsCount > 6 && (
            <p className="text-center text-gray-500 text-sm mt-4">
              +{exceptionsCount - 6} exceções adicionais
            </p>
          )}
        </motion.div>
      )}

      {/* Dicas de organização */}
      <motion.div
        className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl sm:rounded-2xl p-4 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="bg-yellow-500 p-3 rounded-full w-fit">
            <FaLightbulb className="text-white text-lg sm:text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-2">
              💡 Dicas para otimizar seus horários
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Defina horários consistentes</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Marque folgas e feriados como exceções</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Mantenha seus horários atualizados</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Considere horários de maior demanda</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress de configuração */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Completude da Configuração</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Horários configurados</span>
            {activeDays > 0 ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaExclamationTriangle className="text-yellow-500" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Horários válidos</span>
            {workingHours.filter(day => day.ativo && !day.error).length === activeDays ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaExclamationTriangle className="text-yellow-500" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Cobertura semanal</span>
            {activeDays >= 5 ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaExclamationTriangle className="text-yellow-500" />
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso</span>
            <span>
              {Math.round((activeDays / totalDays) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${Math.round((activeDays / totalDays) * 100)}%`
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScheduleTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Header da seção */}
      <motion.div
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <FaClock className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Horários Semanais</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {activeDays > 0 ? `⏰ ${activeDays} dias configurados` : '⚪ Nenhum dia configurado'}
              </p>
            </div>
          </div>
        </div>

        {/* Info sobre horários */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <FaInfoCircle className="text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">⏰ Configure Seus Horários</h4>
              <p className="text-xs sm:text-sm text-green-700">
                Defina quando você está disponível para atendimento. Clientes podem ver seus horários e agendar nos momentos certos.
              </p>
            </div>
          </div>
        </div>

        {/* Botão para copiar segunda-feira */}
        {workingHours[0]?.ativo && workingHours[0]?.start && workingHours[0]?.end && (
          <motion.div
            className="flex justify-center mt-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={copyMondayToAll}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center space-x-2 text-sm sm:text-base"
            >
              <FaCopy />
              <span>Aplicar Seg-Feira a Todos os Dias</span>
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Grid dos dias da semana */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {workingHours.map((day, index) => (
          <motion.div
            key={day.id}
            className={`bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border-l-4 transition-all duration-300 hover:shadow-xl ${day.ativo ? 'border-green-500' : 'border-gray-300'
              }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            {/* Header do dia */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={day.ativo}
                onChange={(e) => handleHoursChange(index, "ativo", e.target.checked)}
                className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                aria-label={`Ativar ${day.dia}`}
              />
              <label className="text-base sm:text-lg text-gray-800 font-semibold">{day.dia}</label>
            </div>

            {/* Inputs de horário */}
            {day.ativo && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2" htmlFor={`start-${index}`}>
                    Horário de Início:
                  </label>
                  <input
                    type="time"
                    id={`start-${index}`}
                    value={day.start}
                    onChange={(e) => handleHoursChange(index, "start", e.target.value)}
                    className={`w-full p-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 transition-all ${day.error ? "focus:ring-red-500 border-red-300" : "focus:ring-green-500"
                      }`}
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2" htmlFor={`end-${index}`}>
                    Horário de Término:
                  </label>
                  <input
                    type="time"
                    id={`end-${index}`}
                    value={day.end}
                    onChange={(e) => handleHoursChange(index, "end", e.target.value)}
                    className={`w-full p-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 transition-all ${day.error ? "focus:ring-red-500 border-red-300" : "focus:ring-green-500"
                      }`}
                    aria-required="true"
                  />
                </div>

                {/* Erro de validação */}
                {day.error && (
                  <motion.div
                    className="bg-red-50 border border-red-200 rounded-lg p-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <p className="text-red-700 text-xs sm:text-sm font-medium flex items-center">
                      <FaExclamationTriangle className="mr-2" />
                      {day.error}
                    </p>
                  </motion.div>
                )}

                {/* Preview do horário */}
                {day.start && day.end && !day.error && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700 text-xs sm:text-sm font-medium flex items-center">
                      <FaCheckCircle className="mr-2" />
                      Funcionamento: {day.start} - {day.end}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Estado inativo */}
            {!day.ativo && (
              <div className="text-center py-4">
                <FaTimesCircle className="text-gray-400 text-2xl mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Dia inativo</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Dicas de horário */}
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaLightbulb className="text-blue-500 mr-2" />
          Dicas para definir horários
        </h3>
        <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-500 text-white p-1.5 rounded-full flex-shrink-0 mt-1">
                <FaCheck className="text-xs" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Horários comerciais</h4>
                <p className="text-xs sm:text-sm text-gray-600">8h às 18h são horários populares</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-green-500 text-white p-1.5 rounded-full flex-shrink-0 mt-1">
                <FaCheck className="text-xs" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Flexibilidade</h4>
                <p className="text-xs sm:text-sm text-gray-600">Horários estendidos atraem mais clientes</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="bg-purple-500 text-white p-1.5 rounded-full flex-shrink-0 mt-1">
                <FaCheck className="text-xs" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Consistência</h4>
                <p className="text-xs sm:text-sm text-gray-600">Mantenha horários regulares</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-orange-500 text-white p-1.5 rounded-full flex-shrink-0 mt-1">
                <FaCheck className="text-xs" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Fins de semana</h4>
                <p className="text-xs sm:text-sm text-gray-600">Considere atender aos finais de semana</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderExceptionsTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Header da seção */}
      <motion.div
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
              <FaCalendarTimes className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Exceções de Dias</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {exceptionsCount > 0 ? `📅 ${exceptionsCount} exceções marcadas` : '⚪ Nenhuma exceção marcada'}
              </p>
            </div>
          </div>
        </div>

        {/* Info sobre exceções */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <FaInfoCircle className="text-red-500 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-red-800 mb-2 text-sm sm:text-base">📅 Marcar Dias Indisponíveis</h4>
              <p className="text-xs sm:text-sm text-red-700">
                Clique nas datas do calendário para marcar dias em que você não estará disponível (feriados, folgas, viagens, etc.).
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Calendário */}
      <motion.div
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="calendar-container">
          <Calendar
            onClickDay={handleDateClick}
            tileContent={({ date }) => {
              const dateStr = date.toDateString();
              return exceptions.includes(dateStr) ? (
                <div className="flex justify-center mt-1">
                  <FaTimesCircle className="text-red-500 text-xs" aria-label="Exceção marcada" />
                </div>
              ) : null;
            }}
            tileClassName={({ date }) => {
              const dateStr = date.toDateString();
              const today = new Date().toDateString();
              const isPast = date < new Date() && dateStr !== today;

              if (exceptions.includes(dateStr)) {
                return "bg-red-100 border-red-500 text-red-700 font-semibold hover:bg-red-200";
              }
              if (isPast) {
                return "text-gray-400 cursor-not-allowed";
              }
              return "hover:bg-pink-100 hover:text-pink-600 transition-all duration-200 cursor-pointer";
            }}
            className="w-full"
          />
        </div>

        {/* Legenda */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border border-red-500 rounded"></div>
            <span className="text-gray-600">Dia indisponível</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
            <span className="text-gray-600">Dia disponível</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span className="text-gray-400">Dia passado</span>
          </div>
        </div>
      </motion.div>

      {/* Lista de exceções marcadas */}
      {exceptionsCount > 0 && (
        <motion.div
          className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="font-semibold text-gray-800 mb-4 text-sm sm:text-base flex items-center">
            <FaCalendarTimes className="text-red-500 mr-2" />
            Exceções Marcadas ({exceptionsCount})
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {exceptions
              .map(dateStr => new Date(dateStr))
              .sort((a, b) => a - b)
              .map((date, index) => (
                <div
                  key={index}
                  className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3 text-center cursor-pointer hover:bg-red-100 transition-colors"
                  onClick={() => handleDateClick(date)}
                  title="Clique para remover"
                >
                  <FaCalendarTimes className="text-red-500 mx-auto mb-1" />
                  <span className="text-xs sm:text-sm font-medium text-red-700 block">
                    {date.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit'
                    })}
                  </span>
                  <span className="text-xs text-red-600">
                    {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </span>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Dicas sobre exceções */}
      <motion.div
        className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl sm:rounded-2xl p-4 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaLightbulb className="text-orange-500 mr-2" />
          Quando marcar exceções
        </h3>
        <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="bg-orange-500 text-white p-1.5 rounded-full flex-shrink-0 mt-1">
                <FaCheck className="text-xs" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Feriados</h4>
                <p className="text-xs sm:text-sm text-gray-600">Natal, Ano Novo, Carnaval, etc.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-red-500 text-white p-1.5 rounded-full flex-shrink-0 mt-1">
                <FaCheck className="text-xs" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Férias</h4>
                <p className="text-xs sm:text-sm text-gray-600">Períodos de descanso planejados</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="bg-purple-500 text-white p-1.5 rounded-full flex-shrink-0 mt-1">
                <FaCheck className="text-xs" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Viagens</h4>
                <p className="text-xs sm:text-sm text-gray-600">Quando estiver fora da cidade</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-500 text-white p-1.5 rounded-full flex-shrink-0 mt-1">
                <FaCheck className="text-xs" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Compromissos</h4>
                <p className="text-xs sm:text-sm text-gray-600">Eventos pessoais importantes</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Loading screen
  if (loadingPage) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <motion.div
          className="text-center px-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4"
          >
            <Image
              src="/iconOficial_faixaRosa.png"
              alt="Loading"
              width={64}
              height={64}
              className="w-full h-full"
            />
          </motion.div>
          <p className="text-gray-600 font-medium text-sm sm:text-base">Carregando horários...</p>
        </motion.div>
      </div>
    );
  }

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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Gerenciamento de Horários
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Configure seus horários de trabalho e exceções
              </p>
            </div>

            <button
              onClick={() => setShowTutorial(true)}
              className="mt-4 lg:mt-0 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base mx-auto lg:mx-0"
            >
              <FaLightbulb />
              <span>Tutorial</span>
            </button>
          </div>

          {/* Tabs Mobile */}
          <div className="block sm:hidden">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h2>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg bg-gray-100"
              >
                <FaBars className="text-gray-600" />
              </button>
            </div>

            <AnimatePresence>
              {showMobileMenu && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden mb-4"
                >
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setShowMobileMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${activeTab === tab.id
                          ? "bg-green-50 text-green-600 border-r-4 border-green-500"
                          : "text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        <Icon className="text-lg" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tabs Desktop */}
          <div className="hidden sm:flex space-x-1 bg-gray-100 p-1 rounded-2xl overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap text-sm sm:text-base ${activeTab === tab.id
                    ? "bg-white text-green-600 shadow-lg"
                    : "text-gray-600 hover:text-gray-800"
                    }`}
                >
                  <Icon className="text-lg" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && renderOverviewTab()}
          {activeTab === "schedule" && renderScheduleTab()}
          {activeTab === "exceptions" && renderExceptionsTab()}
        </motion.div>

        {/* Save Button */}
        {isUpdated && (
          <motion.div
            className="mt-6 sm:mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={JSON.stringify(exceptions) !== originalExceptions ? saveUnavailableDates : saveChanges}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl disabled:opacity-50"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-lg sm:text-xl" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <FaSave className="text-lg sm:text-xl" />
                  <span>
                    {JSON.stringify(exceptions) !== originalExceptions
                      ? "Salvar Exceções"
                      : "Salvar Horários"}
                  </span>
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Tutorial Modal */}
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {(() => {
                  const currentTutorial = tutorialSteps[currentStep];
                  const IconComponent = currentTutorial.icon;

                  return (
                    <div className="text-center">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 bg-gradient-to-br ${currentTutorial.color}`}>
                        <IconComponent className="text-white text-lg sm:text-2xl" />
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                        {currentTutorial.title}
                      </h3>

                      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                        {currentTutorial.description}
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          {tutorialSteps.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentStep ? "bg-green-500 w-6 sm:w-8" : "bg-gray-300"
                                }`}
                            />
                          ))}
                        </div>

                        <div className="flex space-x-2 sm:space-x-3">
                          {currentStep > 0 && (
                            <button
                              onClick={handlePrevStep}
                              className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
                            >
                              Anterior
                            </button>
                          )}

                          <button
                            onClick={handleNextStep}
                            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 text-sm sm:text-base"
                          >
                            {currentStep === tutorialSteps.length - 1 ? "Finalizar" : "Próximo"}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={closeTutorial}
                        className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        <FaTimes className="text-lg sm:text-xl" />
                      </button>
                    </div>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Calendar Styles */}
      <style jsx global>{`
        .react-calendar {
          width: 100% !important;
          border: none !important;
          font-family: inherit !important;
          border-radius: 16px !important;
          overflow: hidden !important;
        }
        
        .react-calendar__navigation {
          display: flex !important;
          height: 60px !important;
          margin-bottom: 1rem !important;
          background: linear-gradient(135deg, #10b981, #059669) !important;
        }
        
        .react-calendar__navigation button {
          color: white !important;
          min-width: 44px !important;
          background: none !important;
          border: none !important;
          font-size: 16px !important;
          font-weight: 600 !important;
        }
        
        .react-calendar__navigation button:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        .react-calendar__month-view__weekdays {
          text-align: center !important;
          text-transform: uppercase !important;
          font-weight: 600 !important;
          font-size: 12px !important;
          color: #6b7280 !important;
          margin-bottom: 0.5rem !important;
        }
        
        .react-calendar__tile {
          max-width: 100% !important;
          padding: 12px 6px !important;
          background: none !important;
          text-align: center !important;
          line-height: 16px !important;
          font-size: 14px !important;
          border: 1px solid transparent !important;
          border-radius: 8px !important;
          margin: 2px !important;
          transition: all 0.2s ease !important;
        }
        
        .react-calendar__tile:hover {
          transform: scale(1.05) !important;
        }
        
        .react-calendar__tile--now {
          background: #f3f4f6 !important;
          font-weight: 600 !important;
          color: #1f2937 !important;
        }
        
        .react-calendar__tile--active {
          background: #10b981 !important;
          color: white !important;
        }
        
        @media (max-width: 640px) {
          .react-calendar__tile {
            padding: 8px 4px !important;
            font-size: 12px !important;
          }
          
          .react-calendar__navigation {
            height: 50px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default WorkingHours;