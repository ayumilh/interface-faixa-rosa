'use client';

import { tv } from 'tailwind-variants';
import React from 'react';

const inputVariants = tv({
  base: 'block w-full px-4 py-2 rounded-lg shadow-sm transition duration-200 text-gray-800',
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

export default function InputField({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
  required = false,
  maxLength,
  error,
  size,
  autoComplete,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        autoComplete={autoComplete}
        className={inputVariants({ intent: error ? 'error' : 'default', size })}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}