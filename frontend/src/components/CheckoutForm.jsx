import React, { useState, useEffect } from "react";
import { FaCreditCard, FaRegCheckCircle } from "react-icons/fa";
import { FaPix } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const CheckoutForm = ({ planId, planName, planPrice, onClose, planExtra }) => {
  console.log("ID do plano:", planId);
  const [selectedMethod, setSelectedMethod] = useState("pix");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedExtraPlans, setSelectedExtraPlans] = useState([]);
  const [extraPlans, setExtraPlans] = useState([
    { id: 10, name: "DarkMode", price: 97.90 },
    { id: 6, name: "Plano Nitro", price: 6.90 },
    { id: 7, name: "Contato", price: 83.60 },
    { id: 8, name: "Oculto", price: 99.90 },
    { id: 9, name: "Reviews Públicos", price: 314.91 }
  ]);


  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
  };

  // Função para selecionar ou desmarcar um plano extra
  const handleSelectExtraPlan = (planId) => {
    setSelectedExtraPlans((prevSelected) => {
      if (prevSelected.includes(planId)) {
        // Se o plano já estiver selecionado, remove ele
        return prevSelected.filter((id) => id !== planId);
      } else {
        // Caso contrário, adiciona o plano
        return [...prevSelected, planId];
      }
    });
  };

  // Calcular o preço total incluindo os planos extras
  const calculateTotalPrice = () => {
    let total = 0;

    // Se o plano não for um plano extra, inclui o preço do plano principal
    if (!planExtra) {
      total += planPrice || 0;
    }

    // Somar os preços dos planos extras
    extraPlans.forEach((plan) => {
      if (selectedExtraPlans.includes(plan.id)) {
        total += plan.price;
      }
    });

    // Verifica se o total é um número válido antes de usar toFixed
    if (!isNaN(total)) {
      return total.toFixed(2); // Retorna o total com 2 casas decimais
    } else {
      return '0.00'; // Retorna 0.00 se o total for inválido
    }
  };

    // Atualiza o estado selectedExtraPlans com base no planId recebido como prop
    useEffect(() => {
      if (planId) {
        const selectedPlans = [];
        // Verifica se o planId corresponde a algum dos planos extras e os adiciona ao estado
        extraPlans.forEach((plan) => {
          if (plan.id === planId) {
            selectedPlans.push(plan.id); // Adiciona o plano extra ao array de selecionados
          }
        });
  
        // Atualiza os planos extras selecionados com base no planId
        setSelectedExtraPlans(selectedPlans);
      }
    }, [planId]);

  const handlePayment = async () => {
    if (!planId) {
      setError("ID do plano não encontrado.");
      return;
    }

    setLoading(true);
    setError(null); // Resetar erros anteriores

    const userToken = Cookies.get("userToken");

    if (!userToken) {
      setLoading(false);
      return;
    }

    // Cria um array com os IDs dos planos extras selecionados
    const selectedExtraPlanIds = selectedExtraPlans;

    // Verifica se há planos extras selecionados
    const apiUrl = selectedExtraPlanIds.length > 0
      ? "http://localhost:4000/api/plans/create-with-extras" // Se houver planos extras
      : "http://localhost:4000/api/plans/subscribe"; // Caso contrário, usa a rota para a assinatura simples
    console.log("URL da API:", apiUrl);

    // Monta o requestBody com a estrutura desejada
    const requestBody = {
      planTypeId: planId, // Passa o ID do plano principal
      payment_method_id: selectedMethod, // Método de pagamento
    };

    // Se houver planos extras selecionados, adiciona a propriedade "extras"
    if (selectedExtraPlanIds.length > 0) {
      requestBody.extras = selectedExtraPlanIds;
    }

    console.log("Dados do pagamento:", requestBody);

    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      console.log("Resposta do pagamento:", response.data);

      if (response.data.message === 'Você já possui uma assinatura principal ativa.') {
        toast.info(response.data.message);
      }

      localStorage.setItem('paymentQRCode', response.data.qr_code);
      localStorage.setItem('paymentQRCode64', response.data.qr_code_base64);
      localStorage.setItem('transactionId', response.data.transactionId);

      if (response.data.ticketUrl) {
        window.location.href = response.data.ticketUrl;
      }

    } catch (error) {
      setError("Erro ao criar pagamento. Tente novamente mais tarde.");
      console.error("Erro ao criar pagamento:", error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-50 fixed inset-0 z-50 overflow-auto">
      <div className="w-full max-w-2xl p-8 bg-white shadow-lg rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-center">
            Confirmação de Pagamento
          </h2>

          {/* Botão de fechar modal */}
          <button
            type="button"
            onClick={onClose} // Chama a função onClose para fechar o modal
            className="text-gray-600 text-lg font-semibold hover:text-gray-800 transition"
          >
            X
          </button>
        </div>

        {/* Sessão para selecionar planos extras */}
        <div className="my-6">
          <p className="text-lg text-center text-gray-700 mb-6">
            Quer turbinar sua experiência? Adicione planos extras e aproveite recursos exclusivos para uma assinatura ainda mais completa!
          </p>

          <div className="grid grid-cols-2 gap-4">
            {extraPlans.map((plan) => {
              let buttonClass = "";

              // Definindo o estilo do botão para cada plano
              if (plan.id === 5) {
                buttonClass = "w-full border-2 border-gray-300 hover:border-black text-black font-bold py-3 rounded-lg transition duration-300 mb-4";
              } else if (plan.id === 6) {
                buttonClass = "w-full border-2 border-gray-300 hover:border-orange-600 text-orange-500 font-bold py-3 rounded-lg transition duration-300 mb-4";
              } else if (plan.id === 7) {
                buttonClass = "w-full border-2 border-gray-300 hover:border-green-600 text-green-500 font-bold py-3 rounded-lg transition duration-300 mb-4";
              } else if (plan.id === 8) {
                buttonClass = "w-full border-2 border-gray-300 hover:border-blue-600 text-blue-500 font-bold py-3 rounded-lg transition duration-300 mb-4";
              } else if (plan.id === 9) {
                buttonClass = "w-full border-2 border-gray-300 hover:border-yellow-600 text-yellow-500 font-bold py-3 rounded-lg hover:opacity-90 transition duration-300 ease-in-out";
              } else {
                buttonClass = "py-3 px-6 border-2 border-gray-300 text-gray-700 text-center"; // Default style
              }

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => handleSelectExtraPlan(plan.id)}
                  className={`${buttonClass} ${selectedExtraPlans.includes(plan.id) ? "border-pink-500 text-pink-500 bg-pink-100" : "border-gray-300"}`}
                >
                  {plan.name}
                  {selectedExtraPlans.includes(plan.id) && (
                    <FaRegCheckCircle className="inline-block ml-2 text-green-500" />
                  )}
                  <div className="text-sm text-gray-500">R$ {plan.price}</div>
                </button>
              );
            })}
          </div>
        </div>


        {/* Exibindo erro caso haja */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Resumo do Pedido */}
        <div className="my-6 items-start">
          <h3 className="text-xl font-semibold text-center mb-4">Resumo do Pedido</h3>
          <div className="border-t pt-4">
            {!planExtra && (
              <p className="text-lg font-semibold">Plano principal: <span className="font-medium">{planName} - R$ {planPrice && !isNaN(planPrice) ? planPrice.toFixed(2) : '0.00'}</span></p>
            )}

            {/* Exibir os planos extras selecionados */}
            <div className="mt-4 items-start">
              {selectedExtraPlans.length > 0 && (
                <div>
                  <p className="font-semibold">Planos Extras:</p>
                  {extraPlans.map((plan) => {
                    // Verifica se o plano extra pode ser selecionado com base no planId
                    if (selectedExtraPlans.includes(plan.id) || (planId === 5 && [6, 7, 8, 9].includes(plan.id))) {
                      return (
                        <p key={plan.id} className="text-lg">
                          {plan.name} - R$ {planPrice && !isNaN(planPrice) ? planPrice.toFixed(2) : '0.00'}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
              <p className="text-lg font-semibold mt-4">Total: R$ {calculateTotalPrice()}</p>
            </div>
          </div>

          {/* metodo de pagamento */}
          <div>
            <h2 className="font-semibold opacity-90">Metodo de pagamento</h2>
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
          </div>

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
