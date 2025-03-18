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
            : "";

  const planos = [
    { id: 4, name: "Plano Vip" },
    { id: 3, name: "Plano Pink" },
    { id: 2, name: "Plano Safira" },
    { id: 1, name: "Plano Rubi" },
    { id: 5, name: "DarkMode" },
    { id: 6, name: "Plano Nitro" },
    { id: 7, name: "Contato" },
    { id: 8, name: "Oculto" },
    { id: 9, name: "Reviews Públicos" }
  ];

  const plano = planos.find((p) => p.id === planId);
  const planName = plano ? plano.name : "Plano Indefinido";

  const onClose = () => {
    setShowCheckout(false); // Fecha o modal
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className={buttonClass}
      >
        {loading ? "Processando..." : "Contratar plano"}
      </button>

      {showCheckout && <CheckoutForm planId={planId} planName={planName} onClose={onClose} />}
    </div>
  );
};

export default BtnContratarPlano;
