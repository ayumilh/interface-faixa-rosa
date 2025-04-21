"use client";

import { FaSpinner } from "react-icons/fa";
import { tv } from "tailwind-variants";

const inputClass = tv({
  base: "block w-full px-4 py-2 pr-28 border rounded-lg shadow-sm transition duration-200 text-gray-800", // espaço extra à direita
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

        <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <FaSpinner className="animate-spin text-pink-500 text-lg" />
          ) : (
            <button
              type="button"
              onClick={onVerify}
              disabled={value.replace(/\D/g, "").length !== 11}
              className="text-xs bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded"
            >
              Verificar
            </button>
          )}
        </div>
      </div>

      {isValid !== null && (
        <p className={`mt-1 text-sm ${isValid ? "text-green-500" : "text-red-500"}`}>
          {isValid ? "CPF válido e maior de idade" : error || "CPF inválido"}
        </p>
      )}
    </div>
  );
}
