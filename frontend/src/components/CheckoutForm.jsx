import React, { useState, useEffect } from "react";
import { FaCreditCard, FaRegCheckCircle } from "react-icons/fa";
import { FaPix } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const CheckoutForm = ({ planId, planName, planPrice, onClose, planExtra }) => {
  console.log("ID do plano:", planId);

  // Estados originais
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

  // Estados para os dados do cartão
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiration, setCardExpiration] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Carregar MercadoPago.js no componente
  useEffect(() => {
    const loadMercadoPago = async () => {
      if (typeof window !== "undefined" && window.MercadoPago) {
        const mp = new window.MercadoPago("TEST-61ec5b26-9a78-452c-9c76-375c4405da46"); // Substitua pela sua chave pública

        const cardForm = mp.cardForm({
          amount: "100.5", // Alterar com o valor da transação
          iframe: true,
          form: {
            id: "form-checkout",
            cardNumber: {
              id: "form-checkout__cardNumber",
              placeholder: "Número do cartão",
            },
            expirationDate: {
              id: "form-checkout__expirationDate",
              placeholder: "MM/YY",
            },
            securityCode: {
              id: "form-checkout__securityCode",
              placeholder: "Código de segurança",
            },
            cardholderName: {
              id: "form-checkout__cardholderName",
              placeholder: "Titular do cartão",
            },
            issuer: {
              id: "form-checkout__issuer",
              placeholder: "Banco emissor",
            },
            installments: {
              id: "form-checkout__installments",
              placeholder: "Parcelas",
            },
            identificationType: {
              id: "form-checkout__identificationType",
              placeholder: "Tipo de documento",
            },
            identificationNumber: {
              id: "form-checkout__identificationNumber",
              placeholder: "Número do documento",
            },
            cardholderEmail: {
              id: "form-checkout__cardholderEmail",
              placeholder: "E-mail",
            },
          },
          callbacks: {
            onFormMounted: (error) => {
              if (error) return console.warn("Form Mounted handling error: ", error);
              console.log("Form mounted");
            },
            onSubmit: (event) => {
              event.preventDefault();

              const {
                paymentMethodId: payment_method_id,
                issuerId: issuer_id,
                cardholderEmail: email,
                amount,
                token,
                installments,
                identificationNumber,
                identificationType,
              } = cardForm.getCardFormData();

              fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mp/process_payment`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  token,
                  issuer_id,
                  payment_method_id,
                  transaction_amount: Number(amount),
                  installments: Number(installments),
                  description: "Descrição do produto",
                  payer: {
                    email,
                    identification: {
                      type: identificationType,
                      number: identificationNumber,
                    },
                  },
                }),
              });
            },
            onFetching: (resource) => {
              console.log("Fetching resource: ", resource);
              const progressBar = document.querySelector(".progress-bar");
              progressBar.removeAttribute("value");
              return () => {
                progressBar.setAttribute("value", "0");
              };
            },
          },
        });
      }
    };

    loadMercadoPago();
  }, []);

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
  };

  // Seleção de planos extras
  const handleSelectExtraPlan = (planId) => {
    setSelectedExtraPlans((prevSelected) => {
      if (prevSelected.includes(planId)) {
        return prevSelected.filter((id) => id !== planId);
      } else {
        return [...prevSelected, planId];
      }
    });
  };

  // Cálculo do preço total
  const calculateTotalPrice = () => {
    let total = 0;
    if (!planExtra) {
      total += planPrice || 0;
    }
    extraPlans.forEach((plan) => {
      if (selectedExtraPlans.includes(plan.id)) {
        total += plan.price;
      }
    });
    return !isNaN(total) ? total.toFixed(2) : "0.00";
  };

  useEffect(() => {
    if (planId) {
      const selectedPlans = [];
      extraPlans.forEach((plan) => {
        if (plan.id === planId) {
          selectedPlans.push(plan.id);
        }
      });
      setSelectedExtraPlans(selectedPlans);
    }
  }, [planId, extraPlans]);

  // Função para inserir "/" automático na validade
  const handleCardExpirationChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setCardExpiration(value);
  };

  const handlePayment = async () => {
    if (!planId) {
      setError("ID do plano não encontrado.");
      return;
    }
    setLoading(true);
    setError(null);
    const userToken = Cookies.get("userToken");
    if (!userToken) {
      setLoading(false);
      return;
    }

    let isMainPlan = planId >= 1 && planId <= 4;
    const selectedExtraPlanIds = selectedExtraPlans;
    const requestBody = {
      payment_method_id: selectedMethod,
    };
    let apiUrl;

    if (selectedExtraPlanIds.length > 0) {
      if (isMainPlan) {
        requestBody.planTypeId = planId;
        requestBody.extras = selectedExtraPlanIds;
        apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/plans/create-with-extras`;
      } else {
        requestBody.extras = selectedExtraPlanIds;
        apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/plans/user-plans/extras`;
      }
    } else if (isMainPlan) {
      requestBody.planTypeId = planId;
      apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/plans/create-with-extras`;
    } else {
      setError("Nenhum plano principal ou extra foi selecionado.");
      setLoading(false);
      return;
    }

    console.log("Dados do pagamento:", requestBody);
    console.log("URL da API:", apiUrl);

    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.data.message === 'Acompanhante já possui um plano ativo.') {
        toast.info(response.data.message);
        return;
      }

      localStorage.setItem("paymentQRCode", response.data.qr_code);
      localStorage.setItem("paymentQRCode64", response.data.qr_code_base64);
      localStorage.setItem("transactionId", response.data.transactionId);

      if (response.data.ticketUrl) {
        window.location.href = response.data.ticketUrl;
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 && data && data.error) {
          toast.info(data.error);
        } else {
          toast.error("Erro desconhecido, por favor, tente novamente.");
        }
      } else {
        toast.error("Erro na requisição, por favor, tente novamente.");
      }
    } finally {
      setLoading(false);
      onClose();
      document.body.style.overflow = "auto";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-50 fixed inset-0 z-50 overflow-auto">
      <div className="w-full max-w-2xl p-8 bg-white shadow-lg rounded-lg overflow-y-auto max-h-[84vh]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-center">
            Confirmação de Pagamento
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 text-lg font-semibold hover:text-gray-800 transition"
          >
            X
          </button>
        </div>

        {/* Sessão para selecionar planos extras */}
        <div className="my-6">
          <p className="text-lg text-center text-gray-700 mb-6">
            Quer turbinar sua experiência? Adicione planos extras e aproveite
            recursos exclusivos para uma assinatura ainda mais completa!
          </p>
          <div className="grid grid-cols-2 gap-4">
            {extraPlans.map((plan) => {
              let buttonClass = "";
              if (plan.id === 5) {
                buttonClass =
                  "w-full border-2 border-gray-300 hover:border-black text-black font-bold py-3 rounded-lg transition duration-300 mb-4";
              } else if (plan.id === 6) {
                buttonClass =
                  "w-full border-2 border-gray-300 hover:border-orange-600 text-orange-500 font-bold py-3 rounded-lg transition duration-300 mb-4";
              } else if (plan.id === 7) {
                buttonClass =
                  "w-full border-2 border-gray-300 hover:border-green-600 text-green-500 font-bold py-3 rounded-lg transition duration-300 mb-4";
              } else if (plan.id === 8) {
                buttonClass =
                  "w-full border-2 border-gray-300 hover:border-blue-600 text-blue-500 font-bold py-3 rounded-lg transition duration-300 mb-4";
              } else if (plan.id === 9) {
                buttonClass =
                  "w-full border-2 border-gray-300 hover:border-yellow-600 text-yellow-500 font-bold py-3 rounded-lg hover:opacity-90 transition duration-300 ease-in-out";
              } else {
                buttonClass =
                  "py-3 px-6 border-2 border-gray-300 text-gray-700 text-center";
              }
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => handleSelectExtraPlan(plan.id)}
                  className={`${buttonClass} ${selectedExtraPlans.includes(plan.id)
                      ? "border-pink-500 text-pink-500 bg-pink-100"
                      : "border-gray-300"
                    }`}
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

        {/* Resumo do Pedido */}
        <div className="my-6 items-start">
          <h3 className="text-xl font-semibold text-center mb-4">
            Resumo do Pedido
          </h3>
          <div className="border-t pt-4 px-3">
            {!planExtra && (
              <p className="text-lg font-semibold">
                Plano principal:{" "}
                <span className="font-medium">
                  {planName} - R${" "}
                  {planPrice && !isNaN(planPrice)
                    ? planPrice.toFixed(2)
                    : "0.00"}
                </span>
              </p>
            )}
            <div className="mt-4 items-start">
              {selectedExtraPlans.length > 0 && (
                <div>
                  <p className="font-semibold">Planos Extras:</p>
                  {extraPlans.map((plan) => {
                    if (
                      selectedExtraPlans.includes(plan.id) ||
                      (planId === 5 && [6, 7, 8, 9].includes(plan.id))
                    ) {
                      return (
                        <p key={plan.id} className="text-lg">
                          {plan.name} - R${" "}
                          {plan.price && !isNaN(plan.price)
                            ? plan.price.toFixed(2)
                            : "0.00"}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
            <hr className="my-4" />
            <p className="text-2xl font-semibold mt-4">
              Total: R$ {calculateTotalPrice()}
            </p>
          </div>
        </div>

        {/* Método de pagamento */}
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
              <FaPix className="inline-block mr-2 w-6 h-6" /> Pix
              {selectedMethod === "pix" && (
                <FaRegCheckCircle className="inline-block ml-2 text-green-500" />
              )}
            </button>
          </div>
        </div>

        {/* Se o método for cartão, exibe o formulário e o cartão acima */}
        {selectedMethod === "card" && (
          <div className="mb-4">
            {/* Cartão Animado Personalizado - Fixo no lugar ao virar */}
            <div
              className="relative w-[340px] h-[200px] mx-auto mb-6"
              style={{ perspective: "1000px" }}
            >
              <div
                className="absolute w-[340px] h-[200px] transition-transform duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "center center",
                  transform: isCardFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Frente do Cartão */}
                <div
                  className="absolute w-full h-full rounded-xl text-white"
                  style={{
                    backfaceVisibility: "hidden",
                    background: "linear-gradient(135deg, #ff007f, #000)",
                    overflow: "hidden",
                  }}
                >
                  {/* Ajuste de logo (Ex: "Faixa Rosa") */}
                  <img
                    src="/assets/FaixaRosaSombra.png"
                    alt="Logo"
                    className="absolute w-20 top-4 left-4"
                  />
                  <p className="absolute text-lg font-mono tracking-widest bottom-14 left-4 drop-shadow-lg">
                    {cardNumber
                      ? cardNumber.replace(/(.{4})/g, "$1 ")
                      : "**** **** **** ****"}
                  </p>
                  <p className="absolute text-sm bottom-8 right-4 drop-shadow">
                    {cardExpiration || "MM/YY"}
                  </p>
                  <p className="absolute text-sm bottom-8 left-4 uppercase drop-shadow">
                    {cardName || "NOME"}
                  </p>
                </div>

                {/* Verso do Cartão */}
                <div
                  className="absolute w-full h-full rounded-xl text-white"
                  style={{
                    backfaceVisibility: "hidden",
                    background: "linear-gradient(135deg, #ff007f, #000)",
                    transform: "rotateY(180deg)",
                    overflow: "hidden",
                  }}
                >
                  <div className="absolute top-8 w-full h-10 bg-black opacity-80" />
                  <p className="absolute text-sm bottom-8 right-4 drop-shadow">
                    {cardCVV ? cardCVV.replace(/\d/g, "*") : "***"}
                  </p>
                </div>
              </div>
            </div>

            {/* Formulário de Dados do Cartão */}
            {/* <label className="block text-gray-700 font-bold mb-2 text-start" htmlFor="cardNumber">
              Número do Cartão
            </label>
            <input
              className="border rounded w-full py-2 px-3 mb-4"
              id="cardNumber"
              type="text"
              maxLength={16}
              value={cardNumber}
              onChange={(e) =>
                setCardNumber(e.target.value.replace(/\D/g, ""))
              }
              onFocus={() => setIsCardFlipped(false)}
              placeholder="Digite o número do cartão"
            />

            <label className="block text-gray-700 font-bold mb-2 text-start" htmlFor="cardName">
              Nome no Cartão
            </label>
            <input
              className="border rounded w-full py-2 px-3 mb-4"
              id="cardName"
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              onFocus={() => setIsCardFlipped(false)}
              placeholder="Nome como está no cartão"
            />

            <label className="block text-gray-700 font-bold mb-2 text-start" htmlFor="cardExpiration">
              Validade (MM/YY)
            </label>
            <input
              className="border rounded w-full py-2 px-3 mb-4"
              id="cardExpiration"
              type="text"
              maxLength={5}
              placeholder="MM/YY"
              value={cardExpiration}
              onChange={handleCardExpirationChange}
              onFocus={() => setIsCardFlipped(false)}
            />

            <label className="block text-gray-700 font-bold mb-2 text-start" htmlFor="cardCVV">
              CVV
            </label>
            <input
              className="border rounded w-full py-2 px-3 mb-4"
              id="cardCVV"
              type="text"
              maxLength={3}
              value={cardCVV}
              onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, ""))}
              onFocus={() => setIsCardFlipped(true)}
              onBlur={() => setIsCardFlipped(false)}
              placeholder="Ex: 123"
            /> */}



            <style>
              {`
    #form-checkout {
      display: flex;
      flex-direction: column;
      max-width: 600px;
    }

    .container {
      height: 18px;
      display: inline-block;
      border: 1px solid rgb(118, 118, 118);
      border-radius: 2px;
      padding: 1px 2px;
    }`}
            </style>
            <form id="form-checkout">
              <div id="form-checkout__cardNumber" className="container"></div>
              <div id="form-checkout__expirationDate" className="container"></div>
              <div id="form-checkout__securityCode" className="container"></div>
              <input type="text" id="form-checkout__cardholderName" />
              <select id="form-checkout__issuer"></select>
              <select id="form-checkout__installments"></select>
              <select id="form-checkout__identificationType"></select>
              <input type="text" id="form-checkout__identificationNumber" />
              <input type="email" id="form-checkout__cardholderEmail" />

              <button type="submit" id="form-checkout__submit">Pagar</button>
              <progress value="0" className="progress-bar">Carregando...</progress>
            </form>

          </div>
        )}

        <button
          type="button"
          onClick={handlePayment}
          className="w-full py-3 bg-pink-500 text-white text-lg font-semibold rounded-md hover:bg-pink-600 transition"
          disabled={loading}
        >
          {loading ? "Carregando..." : "PAGAR AGORA"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutForm;