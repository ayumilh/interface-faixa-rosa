"use client";

import { FaCheckCircle } from "react-icons/fa";
import { tv } from "tailwind-variants";

const inputClass = tv({
  base: "block w-full px-4 py-2 pr-10 border rounded-lg shadow-sm transition duration-200 text-gray-800", 
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

export default function CpfField({ value, onChange, error }) {
  const handleMask = (v) => {
    return v
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };

  const isCpfValidLength = value.replace(/\D/g, "").length === 11;

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
          className={inputClass({ valid: error ? false : true })}
        />

        {isCpfValidLength && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
            <FaCheckCircle className="text-lg" />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
