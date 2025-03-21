import Cookies from "js-cookie";
import React, { useState } from "react";
import { toast } from "react-toastify";
import CheckoutForm from "../CheckoutForm";

const BtnContratarPlano = ({ planId }) => {
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const userToken = Cookies.get("userToken");

  const handleClick = async () => {
    if (!userToken) {
      toast.error("Faça o login para contratar um plano.");
      return;
    }

    try {
      setLoading(true);
      setShowCheckout(true);
    } catch (error) {
      toast.error("Ocorreu um erro ao tentar contratar o plano.");
    } finally {
      setLoading(false);
    }
  };

  const buttonClass = planId === 2
    ? "w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 rounded-lg transition duration-300 mb-4"
    : planId === 1
      ? "w-full bg-gradient-to-r from-red-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 rounded-lg transition duration-300 mb-4"
      : planId === 4
        ? "w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition duration-300 mb-4"
        : planId === 3
          ? "w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition duration-300 mb-4"
          : planId === 6
            ? "w-full bg-gradient-to-r from-orange-400 to-orange-600 text-black font-bold py-3 rounded-lg hover:opacity-90 transition duration-300 ease-in-out"
            : planId === 8
              ? "w-full max-w-xs bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm sm:text-base font-bold py-3 rounded-full hover:opacity-90 transition duration-300 ease-in-out -mt-40"
              : planId === 9
                ? "w-full max-w-xs bg-gradient-to-r from-orange-400 to-red-500 text-white text-sm sm:text-base font-bold py-2 rounded-full hover:opacity-90 transition duration-300 ease-in-out mb-3"
                : planId === 7
                  ? "w-full bg-gradient-to-r from-green-400 to-blue-500 text-white text-sm font-bold py-2 rounded-full hover:opacity-90 transition duration-300 ease-in-out"
                  : planId === 5
                    ? "w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-md sm:text-lg font-bold py-3 sm:py-4 rounded-full hover:opacity-90 transition duration-300 ease-in-out mt-4"
                    : "";

  const planos = [
    { id: 4, name: "Plano Vip", price: 169.9 },
    { id: 3, name: "Plano Pink", price: 227.9 },
    { id: 2, name: "Plano Safira", price: 287.9 },
    { id: 1, name: "Plano Rubi", price: 327.9 },
    { id: 5, name: "DarkMode", price: 314.91 },
    { id: 6, name: "Plano Nitro", price: 6.9 },
    { id: 7, name: "Contato", price: 83.6 },
    { id: 8, name: "Oculto", price: 99.9 },
    { id: 9, name: "Reviews Públicos", price: 314.91 }
  ];

  const plano = planos.find((p) => p.id === planId);
  const planName = plano ? plano.name : "Plano Indefinido";
  const planPrice = plano ? plano.price : 0;

  const onClose = () => {
    setShowCheckout(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        className={buttonClass}
      >
        {loading ? "Processando..." : "Contratar plano"}
      </button>

      {showCheckout && <CheckoutForm planId={planId} planName={planName} planPrice={planPrice} onClose={onClose} />}
    </>
  );
};

export default BtnContratarPlano;
