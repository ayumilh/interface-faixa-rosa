import React, { createContext, useState } from "react";

// Criação do Contexto
export const WorkingHoursContext = createContext();

// Provedor do Contexto
export const WorkingHoursProvider = ({ children }) => {
  const [workingHours, setWorkingHours] = useState([
    { dia: "Segunda-feira", ativo: true, start: "09:00", end: "17:00" },
    { dia: "Terça-feira", ativo: true, start: "09:00", end: "17:00" },
    { dia: "Quarta-feira", ativo: true, start: "09:00", end: "17:00" },
    { dia: "Quinta-feira", ativo: true, start: "09:00", end: "17:00" },
    { dia: "Sexta-feira", ativo: true, start: "09:00", end: "17:00" },
    { dia: "Sábado", ativo: false, start: "", end: "" },
    { dia: "Domingo", ativo: false, start: "", end: "" },
  ]);

  const [exceptions, setExceptions] = useState([]);

  return (
    <WorkingHoursContext.Provider
      value={{ workingHours, setWorkingHours, exceptions, setExceptions }}
    >
      {children}
    </WorkingHoursContext.Provider>
  );
};
