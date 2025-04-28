'use client';

import React from 'react';

export default function DateField({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
}) {
  const handleInputChange = (e) => {
    let raw = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    let masked = raw;

    // Aplica a máscara de data conforme o número de caracteres
    if (raw.length >= 3 && raw.length <= 4)
      masked = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    else if (raw.length >= 5)
      masked = `${raw.slice(0, 2)}/${raw.slice(2, 4)}/${raw.slice(4, 8)}`;

    // Atualiza o estado com o valor mascarado
    onChange(masked); // Passa o valor mascarado para o parent (no caso, o componente pai)
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        type="text"
        id={name}
        name={name}
        value={value || ""} // Exibe o valor com máscara
        onChange={handleInputChange} // Chama handleInputChange para formatar o valor
        placeholder="DD/MM/AAAA"
        maxLength={10}
        required={required}
        className={`mt-1 block w-full px-4 py-2 bg-white border rounded-lg shadow-sm transition duration-200 text-gray-800 ${
          error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-pink-500 focus:border-pink-500'
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
