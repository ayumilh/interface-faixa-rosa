'use client';

import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { tv } from 'tailwind-variants';
import IconButton from '@mui/material/IconButton';

const inputVariants = tv({
  base: 'block w-full pl-4 pr-10 py-2 border rounded-lg shadow-sm transition duration-200 text-gray-800 focus:outline-none',
  variants: {
    intent: {
      default: 'border-gray-300 focus:ring-pink-500 focus:border-pink-500',
      error: 'border-red-500 focus:ring-red-500 focus:border-red-500',
    },
  },
  defaultVariants: {
    intent: 'default',
  },
});

export default function PasswordField({
  label,
  name,
  value,
  onChange,
  error,
  show,
  toggleShow,
  onMouseDown,
  required = false,
  ...props
}) {
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
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          required={required}
          className={inputVariants({ intent: error ? 'error' : 'default' })}
          {...props}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <IconButton
            aria-label="toggle password visibility"
            onClick={toggleShow}
            onMouseDown={onMouseDown}
          >
            {show ? <FaEye className="text-gray-600" /> : <FaEyeSlash className="text-gray-600" />}
          </IconButton>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
