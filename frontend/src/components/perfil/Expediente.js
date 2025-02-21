import React from 'react';

const diasDaSemanaMap = {
  Monday: 'Segunda-feira',
  Tuesday: 'Terça-feira',
  Wednesday: 'Quarta-feira',
  Thursday: 'Quinta-feira',
  Friday: 'Sexta-feira',
  Saturday: 'Sábado',
  Sunday: 'Domingo',
};

const Expediente = ({ weeklySchedules }) => {
  if (!weeklySchedules || weeklySchedules.length === 0) {
    return <p className="text-center text-gray-600">Horários não informados.</p>;
  }

  return (
    <div className="expediente bg-white p-6 rounded-lg shadow-lg mt-8">
      <h3 className="font-bold text-xl text-gray-800 flex items-center">Horário de Expediente</h3>
      <table className="min-w-full border-collapse border border-gray-200 mt-4">
        <tbody>
          {weeklySchedules.map((item, index) => (
            <tr 
              key={index} 
              className={item.isActive ? 'font-bold bg-gray-100' : 'opacity-50'}
            >
              <td className="border border-gray-200 px-4 py-2 text-gray-700">
                {diasDaSemanaMap[item.dayOfWeek] || item.dayOfWeek}
              </td>
              <td className={`border border-gray-200 px-4 py-2 ${item.isActive ? 'text-black' : 'text-gray-500'}`}>
                {item.isActive ? `${item.startTime} - ${item.endTime}` : 'Fechado'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm text-gray-600 mt-4">
        A disponibilidade do anunciante não é garantida pelo seu horário de atendimento.
      </p>
    </div>
  );
};

export default Expediente;
