"use client";

import { useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { tv } from "tailwind-variants";

const inputClass = tv({
  base: "block w-full px-4 py-2 border rounded-lg shadow-sm transition duration-200 text-gray-800",
  variants: {
    valid: {
      true: "border-gray-300 focus:ring-pink-500 focus:border-pink-500",
      false: "border-red-500 focus:ring-red-500 focus:border-red-500",
    },
  },
  defaultVariants: {
    valid: true,
  },
});

export default function CpfField({
  value,
  onChange,
  onVerify,
  isValid,
  isLoading,
  error,
}) {
  useEffect(() => {
    if (value.length === 11) {
      onVerify();
    }
  }, [value]);

  const handleMask = (v) => {
    return v
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };

  return (
    <div>
      <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
        CPF
      </label>
      <div className="relative">
        <input
          id="cpf"
          name="cpf"
          type="text"
          value={handleMask(value)}
          onChange={onChange}
          required
          maxLength={14}
          className={inputClass({ valid: isValid !== false })}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <FaSpinner className="animate-spin text-pink-500" />
          </div>
        )}
      </div>
      {isValid !== null && (
        <p className={`mt-1 text-sm ${isValid ? "text-green-500" : "text-red-500"}`}>
          {isValid ? "CPF válido e maior de idade" : error || "CPF inválido"}
        </p>
      )}
    </div>
  );
}
