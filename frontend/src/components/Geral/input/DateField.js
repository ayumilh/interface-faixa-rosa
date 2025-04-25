// components/ui/input/DateField.jsx
'use client';

import React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

export default function DateField({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
}) {
  const handleInputChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    let masked = raw;

    if (raw.length >= 3 && raw.length <= 4)
      masked = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    else if (raw.length >= 5)
      masked = `${raw.slice(0, 2)}/${raw.slice(2, 4)}/${raw.slice(4, 8)}`;

    onChange(masked);
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
        value={value || ""}
        onChange={handleInputChange}
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