import React, { useState, useEffect } from "react";
import { FaClock, FaTrash, FaSave, FaCopy } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import Cookies from "js-cookie";

const WorkingHours = () => {
  // Estado para os horários de trabalho
  const [workingHours, setWorkingHours] = useState([]);
  const [originalHours, setOriginalHours] = useState([]);
  const [exceptions, setExceptions] = useState([]);
  const [originalExceptions, setOriginalExceptions] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  // Função para buscar os horários do backend
  const fetchWorkingHours = async () => {
    try {
      const token = Cookies.get("userToken");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/schedule`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.schedule) {
        const formattedData = defaultSchedule.map((defaultDay) => {
          // Converter os nomes dos dias da semana do backend para português
          const existingDay = response.data.schedule.find((item) => daysOfWeekMap[item.dayOfWeek] === defaultDay.dia);

          return existingDay
            ? {
              id: existingDay.id,
              dia: daysOfWeekMap[existingDay.dayOfWeek], // Convertendo para português
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
    } catch (error) {
      console.error("Erro ao buscar horários do backend:", error);
      setWorkingHours(defaultSchedule);
    }
  };

  useEffect(() => {
    fetchWorkingHours();
  }, []);

  // Função para buscar as datas indisponíveis do backend
  const fetchUnavailableDates = async () => {
    try {
      const token = Cookies.get("userToken");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/unavailable-date`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (response.data.unavailableDates) {
        const formattedDates = response.data.unavailableDates.map(date => new Date(date).toDateString());
        setExceptions(formattedDates);
        setOriginalExceptions(JSON.stringify(formattedDates)); // Armazena o estado original
      }
    } catch (error) {
      console.error("Erro ao buscar datas indisponíveis:", error);
    }
  };

  useEffect(() => {
    fetchUnavailableDates();
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
    setIsUpdated(JSON.stringify(updatedHours) !== JSON.stringify(originalHours));
  };

  // Copia os horários de segunda para os outros dias
  const copyMondayToAll = () => {
    const updatedHours = workingHours.map((day, index) => {
      if (index === 0) return day; // Mantém segunda-feira igual
      return { ...day, ativo: workingHours[0].ativo, start: workingHours[0].start, end: workingHours[0].end };
    });

    setWorkingHours(updatedHours);
    setIsUpdated(true);
  };

  // Função para salvar alterações
  const saveChanges = async () => {
    setLoading(true);
    setMessage("");

    const token = Cookies.get("userToken");

    // Converter os nomes dos dias da semana corretamente
    const daysOfWeek = {
      "Segunda-feira": "Monday",
      "Terça-feira": "Tuesday",
      "Quarta-feira": "Wednesday",
      "Quinta-feira": "Thursday",
      "Sexta-feira": "Friday",
      "Sábado": "Saturday",
      "Domingo": "Sunday",
    };

    // Criar payload no formato correto
    const payload = {
      schedule: workingHours.map(({ dia, start, end, ativo }) => ({
        dayOfWeek: daysOfWeek[dia] || dia, // Se precisar converter para inglês, fazemos aqui
        startTime: ativo && start ? start : "00:00", // Se não estiver ativo, garante "00:00"
        endTime: ativo && end ? end : "00:00",
        isActive: ativo, // O backend espera um booleano
      })),
    };

    console.log("Payload enviado para o backend:", JSON.stringify(payload, null, 2));

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/schedule/update`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Resposta do backend:", response.data);

      setOriginalHours([...workingHours]);
      setIsUpdated(false);
      setMessage("Horários atualizados com sucesso!");

      setTimeout(async () => {
        await fetchWorkingHours();
      }, 2000);
    } catch (error) {
      console.error("Erro ao atualizar horários:", error);

      if (error.response) {
        console.error("Detalhes do erro do backend:", error.response.data);
        setMessage(`Erro: ${JSON.stringify(error.response.data)}`);
      } else {
        setMessage("Erro ao salvar. Tente novamente.");
      }
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
        {
          headers: { Authorization: `Bearer ${token}` },
        });

      setOriginalExceptions(JSON.stringify(exceptions));
      setIsUpdated(false);
      setMessage("Datas indisponíveis atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar datas indisponíveis:", error);
      setMessage("Erro ao salvar. Tente novamente.");
    }

    setLoading(false);
  };

  // Subcomponente: DaySchedule
  const DaySchedule = ({ day, index }) => (
    <div
      className="border bg-white p-4 rounded-lg shadow-sm hover:shadow-md transform transition-transform duration-300 hover:scale-105"
      key={day.id}
    >
      <div className="flex items-center mb-3">
        <input
          type="checkbox"
          checked={day.ativo}
          onChange={(e) => handleHoursChange(index, "ativo", e.target.checked)}
          className="mr-3 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
          aria-label={`Ativar ${day.dia}`}
        />
        <label className="text-base text-gray-700 font-semibold">{day.dia}</label>
      </div>
      {day.ativo && (
        <div className="flex flex-col space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1" htmlFor={`start-${index}`}>
              Início:
            </label>
            <input
              type="time"
              id={`start-${index}`}
              value={day.start}
              onChange={(e) => handleHoursChange(index, "start", e.target.value)}
              className={`w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 ${day.error ? "focus:ring-red-500" : "focus:ring-pink-500"
                }`}
              aria-required="true"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1" htmlFor={`end-${index}`}>
              Fim:
            </label>
            <input
              type="time"
              id={`end-${index}`}
              value={day.end}
              onChange={(e) => handleHoursChange(index, "end", e.target.value)}
              className={`w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 ${day.error ? "focus:ring-red-500" : "focus:ring-pink-500"
                }`}
              aria-required="true"
            />
          </div>
          {day.error && <p className="text-red-500 text-xs">{day.error}</p>}
        </div>
      )}
    </div>
  );

  // Subcomponente: ExceptionCalendar
  const ExceptionCalendar = () => {
    return (
      <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
        <Calendar
          onClickDay={handleDateClick}
          tileContent={({ date }) => {
            const dateStr = date.toDateString();
            return exceptions.includes(dateStr) ? (
              <FaTrash className="text-red-500 inline ml-1" aria-label="Exceção marcada" />
            ) : null;
          }}
          tileClassName={({ date }) => {
            const dateStr = date.toDateString();
            return exceptions.includes(dateStr) ? "bg-red-100 border-red-500 text-gray-900 font-semibold" : "hover:bg-pink-100 hover:text-pink-500 transition-all duration-200";
          }}
        />
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-10 rounded-xl shadow-2xl max-w-6xl mx-auto mt-8 md:mt-12">
      <header className="flex flex-col md:flex-row items-center md:items-center mb-6 md:mb-10">
        <FaClock className="text-pink-500 mr-0 md:mr-3 mb-3 md:mb-0 animate-pulse text-3xl" />
        <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900">
          Gerenciar Horários de Trabalho
        </h2>
      </header>

      <section>
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Horários Semanais</h3>

        {/* Botão para copiar segunda-feira para todos os dias */}
        {workingHours[0]?.ativo && workingHours[0]?.start && workingHours[0]?.end && (
          <div className="flex justify-center mb-4">
            <button
              onClick={copyMondayToAll}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg flex items-center"
            >
              <FaCopy className="mr-2" />
              Preencher Todos os Dias
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {workingHours.map((day, index) => (
            <DaySchedule key={day.id} day={day} index={index} />
          ))}
        </div>
      </section>

      {isUpdated && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={saveChanges}
            disabled={loading}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-400"
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      )}

      {/* {message && <p className="text-center mt-4 text-lg font-semibold text-gray-800">{message}</p>} */}

      <section className="mt-8 md:mt-12">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Exceções de Dias</h3>
        <ExceptionCalendar />

        {/* Botão de salvar alterações em datas indisponíveis */}
        {JSON.stringify(exceptions) !== originalExceptions && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={saveUnavailableDates}
              disabled={loading}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg flex items-center"
            >
              {loading ? "Salvando..." : (
                <>
                  <FaSave className="mr-2" />
                  Salvar Datas Indisponíveis
                </>
              )}
            </button>
          </div>
        )}

        {message && <p className="text-center mt-4 text-lg font-semibold text-gray-800">{message}</p>}
      </section>

    </div>
  );
};

export default WorkingHours;
