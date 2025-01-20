import React, { useState } from "react";
import { FaClock, FaTrash } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const WorkingHours = () => {
  // Estado para os horários de trabalho
  const [workingHours, setWorkingHours] = useState([
    { dia: "Segunda-feira", ativo: true, start: "09:00", end: "17:00", error: "" },
    { dia: "Terça-feira", ativo: true, start: "09:00", end: "17:00", error: "" },
    { dia: "Quarta-feira", ativo: true, start: "09:00", end: "17:00", error: "" },
    { dia: "Quinta-feira", ativo: true, start: "09:00", end: "17:00", error: "" },
    { dia: "Sexta-feira", ativo: true, start: "09:00", end: "17:00", error: "" },
    { dia: "Sábado", ativo: false, start: "", end: "", error: "" },
    { dia: "Domingo", ativo: false, start: "", end: "", error: "" },
  ]);

  // Estado para as exceções no calendário
  const [exceptions, setExceptions] = useState([]);

  // Função para atualizar os horários de trabalho
  const handleHoursChange = (index, field, value) => {
    const updatedHours = [...workingHours];
    updatedHours[index][field] = value;

    // Resetar o erro ao alterar os campos
    updatedHours[index].error = "";

    // Validação: Horário de fim deve ser posterior ao horário de início
    if (field === "end" || field === "start") {
      const start = updatedHours[index].start;
      const end = updatedHours[index].end;
      if (start && end && start >= end) {
        updatedHours[index].error = "O horário de término deve ser posterior ao horário de início.";
      }
    }

    setWorkingHours(updatedHours);
  };

  // Função para lidar com cliques no calendário
  const handleDateClick = (date) => {
    const dateStr = date.toDateString();
    if (exceptions.includes(dateStr)) {
      setExceptions(exceptions.filter((d) => d !== dateStr));
    } else {
      setExceptions([...exceptions, dateStr]);
    }
  };

  // Subcomponente: DaySchedule
  const DaySchedule = ({ day, index }) => (
    <div
      className="border bg-white p-4 rounded-lg shadow-sm hover:shadow-md transform transition-transform duration-300 hover:scale-105"
      key={day.dia}
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
              className={`w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 ${
                day.error ? "focus:ring-red-500" : "focus:ring-pink-500"
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
              className={`w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 ${
                day.error ? "focus:ring-red-500" : "focus:ring-pink-500"
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
    // Função para adicionar conteúdo aos tiles do calendário
    const tileContent = ({ date }) => {
      const dateStr = date.toDateString();
      if (exceptions.includes(dateStr)) {
        return (
          <FaTrash
            className="text-red-500 inline ml-1"
            aria-label="Exceção marcada"
            title="Exceção marcada"
          />
        );
      }
      return null;
    };

    // Função para adicionar classes aos tiles do calendário
    const tileClassName = ({ date }) => {
      const dateStr = date.toDateString();
      if (exceptions.includes(dateStr)) {
        return "bg-red-100 border-red-500 text-gray-900 font-semibold";
      }
      return "hover:bg-pink-100 hover:text-pink-500 transition-all duration-200";
    };

    return (
      <div className="w-full">
        <Calendar
          onClickDay={handleDateClick}
          tileContent={tileContent}
          tileClassName={tileClassName}
          className="rounded-lg border shadow-lg text-gray-700 w-full"
        />
        <p className="text-sm text-gray-600 mt-2">
          Clique em um dia no calendário para marcar como exceção. Dias marcados em vermelho não estarão disponíveis.
        </p>
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

      {/* Horários Semanais */}
      <section>
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Horários Semanais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {workingHours.map((day, index) => (
            <DaySchedule key={day.dia} day={day} index={index} />
          ))}
        </div>
      </section>

      {/* Calendário para Exceções */}
      <section className="mt-8 md:mt-12">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Exceções de Horário</h3>
        <ExceptionCalendar />
      </section>
    </div>
  );
};

export default WorkingHours;
