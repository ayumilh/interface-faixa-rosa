import React from 'react';

const Expediente = () => {
  const workingHours = [
    { dia: 'Segunda-feira', start: '08:00', end: '18:00', ativo: true, destacado: false },
    { dia: 'Terça-feira', start: '08:00', end: '18:00', ativo: true, destacado: false },
    { dia: 'Quarta-feira', start: '08:00', end: '18:00', ativo: true, destacado: true },
    { dia: 'Quinta-feira', start: '08:00', end: '18:00', ativo: true, destacado: false },
    { dia: 'Sexta-feira', start: '08:00', end: '18:00', ativo: true, destacado: false },
    { dia: 'Sábado', start: '09:00', end: '13:00', ativo: false, destacado: false },
    { dia: 'Domingo', start: 'Fechado', end: '', ativo: false, destacado: false },
  ];

  return (
    <div className="expediente bg-white p-6 rounded-lg shadow-lg mt-8">
      <h3 className="font-bold text-xl text-gray-800 flex items-center">Horário de Expediente</h3>
      <table className="min-w-full border-collapse border border-gray-200 mt-4">
        <tbody>
          {workingHours.map((item, index) => (
            item.ativo ? (
              <tr key={index} className={item.destacado ? 'font-bold bg-gray-100' : ''}>
                <td className="border border-gray-200 px-4 py-2 text-gray-700">{item.dia}</td>
                <td className="border border-gray-200 px-4 py-2 text-gray-700">{item.start} - {item.end}</td>
              </tr>
            ) : null
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
