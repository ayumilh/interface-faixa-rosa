import Cookies from "js-cookie";
import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";

const BtnContratarPlano = ({ planId }) => {
  const [loading, setLoading] = useState(false);
  const userId = Cookies.get("userToken");
  const router = useRouter();

  console.log(userId);

  const handleClick = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:4000/api/payments/checkout",
        { product: planId },
        {
          headers: {
            Authorization: `Bearer ${userId}`,
          },
        }
      );

      // Verifica se a resposta foi bem-sucedida
      if (response.status === 200 && response.data.init_point) {
        // Redireciona para a URL recebida
        window.location.href = response.data.init_point;
      } else {
        toast.success("Faça o login para contratar um plano.");
        router.push("/login"); // Redireciona para a página de login se falhar
      }

      setModalOpen(true);
    } catch (error) {
      toast.success("Faça o login para contratar um plano.");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        ${planId === 2
          ? "w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 rounded-lg transition duration-300 mb-4"
          : planId === 4
            ? "w-full bg-gradient-to-r from-red-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 rounded-lg transition duration-300 mb-4"
            : planId === 1
            ? "w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition duration-300 mb-4"
            : planId === 3
            ? "w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition duration-300 mb-4"
            : ""
        }
      `}
    >
      {loading ? "Processando..." : "Contratar plano"}
    </button>
  );
};

export default BtnContratarPlano;
