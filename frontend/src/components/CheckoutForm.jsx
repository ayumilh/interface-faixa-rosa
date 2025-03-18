import React, { useState } from "react";
import { FaCreditCard, FaRegCheckCircle } from "react-icons/fa";
import { FaPix } from "react-icons/fa6";
import axios from "axios";
import Cookies from "js-cookie";

const CheckoutForm = ({ planId, planName, onClose }) => {
  const [selectedMethod, setSelectedMethod] = useState("pix");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    console.log("Método de pagamento selecionado:", method);
  };

  const handlePayment = async () => {
    if (!planId) {
      setError("ID do plano não encontrado.");
      return;
    }

    setLoading(true);
    setError(null); // Resetar erros anteriores

    const userToken = Cookies.get("userToken");

    if (!userToken) {
      setError("Token de usuário não encontrado. Faça login.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/checkout`,
        {
          product: planId, // O ID do produto
          payment_method_id: selectedMethod, // Método de pagamento (pix ou cartão)
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`, // Incluindo o token no cabeçalho
          },
        }
      );

      console.log("Resposta do pagamento:", response.data);

      // Redirecionando para a URL do pagamento
      window.location.href = response.data.ticket_url; // Redireciona o usuário para a URL do pagamento
    } catch (error) {
      setError("Erro ao criar pagamento. Tente novamente mais tarde.");
      console.error("Erro ao criar pagamento:", error);
    } finally {
      setLoading(false);
    }
  };

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


  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-50 fixed inset-0 z-50">
      <div className="w-full max-w-2xl p-8 bg-white shadow-lg rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-center">
            {planName}
          </h2>

          {/* Botão de fechar modal */}
          <button
            type="button"
            onClick={onClose} // Chama a função onClose para fechar o modal
            className="text-gray-600 text-lg"
          >
            X
          </button>
        </div>

        <div className="flex space-x-4 justify-center my-4">
          <button
            type="button"
            onClick={() => handleSelectMethod("card")}
            className={`flex-1 py-3 border-2 rounded-md text-center ${selectedMethod === "card"
                ? "border-pink-500 text-pink-500 bg-pink-100"
                : "border-gray-300"
              }`}
          >
            <FaCreditCard className="inline-block mr-2" /> Cartão
            {selectedMethod === "card" && (
              <FaRegCheckCircle className="inline-block ml-2 text-green-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSelectMethod("pix")}
            className={`flex-1 py-3 border-2 rounded-md text-center ${selectedMethod === "pix"
                ? "border-pink-500 text-pink-500 bg-pink-100"
                : "border-gray-300"
              }`}
          >
            <FaPix className="inline-block mr-2 w-6 h-6" />{" "}
            Pix
            {selectedMethod === "pix" && (
              <FaRegCheckCircle className="inline-block ml-2 text-green-500" />
            )}
          </button>
        </div>

        {/* Exibindo erro caso haja */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          type="button"
          onClick={handlePayment}
          className="w-full py-3 bg-pink-500 text-white text-lg font-semibold rounded-md hover:bg-pink-600 transition"
          disabled={loading} // Desabilita o botão enquanto está carregando
        >
          {loading ? "Carregando..." : "PAGAR AGORA"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutForm;
