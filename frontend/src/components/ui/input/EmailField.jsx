'use client';

import React, { useEffect, useState } from 'react';
import { FaSpinner, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { tv } from 'tailwind-variants';

const inputVariants = tv({
  base: 'block w-full pr-10 px-4 py-2 rounded-lg shadow-sm transition duration-200 text-gray-800',
  variants: {
    intent: {
      default: 'border border-gray-300 focus:ring-pink-500 focus:border-pink-500',
      error: 'border border-red-500 focus:ring-red-500 focus:border-red-500',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    intent: 'default',
    size: 'md',
  },
});

export default function EmailField({
  label = 'E-mail',
  name = 'email',
  value,
  onChange,
  required = false,
  maxLength,
  error,
  setError,
  setValid,
}) {
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);

  useEffect(() => {
    const verificarEmail = async (email) => {
      setLoading(true);
      setIsAvailable(null);

      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/verify-email`, { email });
        if (res.data.valid) {
          setValid(true);
          setError('');
          setIsAvailable(true);
        } else {
          setValid(false);
          setError(res.data.message || 'E-mail já cadastrado');
          setIsAvailable(false);
        }
      } catch (err) {
        setValid(false);
        setError('Erro ao verificar e-mail.');
        setIsAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      if (value && value.length >= 5 && value.includes('@')) {
        verificarEmail(value);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [value, setError, setValid]);

  const handleChange = (e) => {
    const cleaned = e.target.value.replace(/\s/g, '');
    onChange({ target: { name: e.target.name, value: cleaned } });
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type="email"
          value={value}
          onChange={handleChange}
          required={required}
          maxLength={maxLength}
          className={inputVariants({ intent: error ? 'error' : 'default' })}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
          {loading ? (
            <FaSpinner className="animate-spin text-pink-500 text-sm" />
          ) : isAvailable === true ? (
            <FaCheckCircle className="text-green-500 text-sm" />
          ) : null}
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
