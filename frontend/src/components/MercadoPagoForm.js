import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";

const MercadoPagoForm = ({ totalPrice, planId, selectedExtraPlans, selectedMethod }) => {
    const router = useRouter();

    useEffect(() => {
        // Função para carregar o script Mercado Pago
        const loadMercadoPagoScript = () => {
            return new Promise((resolve, reject) => {
                if (typeof window !== "undefined" && !window.MercadoPago) {
                    const script = document.createElement("script");
                    script.src = "https://sdk.mercadopago.com/js/v2";
                    script.onload = () => resolve(window.MercadoPago);
                    script.onerror = (err) => reject(err);
                    document.body.appendChild(script);
                } else {
                    resolve(window.MercadoPago);
                }
            });
        };

        const loadMercadoPago = async () => {
            try {
                const mp = await loadMercadoPagoScript();
                const mercadoPagoInstance = new mp("TEST-61ec5b26-9a78-452c-9c76-375c4405da46"); // Substitua pela sua chave pública

                const cardForm = mercadoPagoInstance.cardForm({
                    amount: totalPrice,
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
                        },
                        onSubmit: async (event) => {
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

                            const userToken = Cookies.get("userToken");
                            if (!userToken) {
                                console.error("Usuário não autenticado");
                                return;
                            }

                            // Lógica para verificar planos extras e se é um plano principal
                            const isMainPlan = planId >= 1 && planId <= 4;
                            const selectedExtraPlanIds = selectedExtraPlans;

                            const requestBody = {
                                payment_method_id: payment_method_id,
                                cardToken: token,
                                issuer_id: issuer_id,
                                installments: installments,
                                email: email,
                                identificationNumber: identificationNumber,
                                identificationType: identificationType,
                            };

                            // Lógica para adicionar o plano extra e tipo de plano
                            let apiUrl;

                            if (selectedExtraPlanIds.length > 0) {
                                if (isMainPlan) {
                                    requestBody.planTypeId = planId;  // ID do plano principal
                                    requestBody.extras = selectedExtraPlanIds;  // Planos extras
                                    apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/plans/create-with-extras`;  // URL da API para planos com extras
                                } else {
                                    requestBody.extras = selectedExtraPlanIds;  // Apenas planos extras
                                    apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/plans/user-plans/extras`;  // URL da API para planos do usuário
                                }
                            } else if (isMainPlan) {
                                requestBody.planTypeId = planId;  // ID do plano principal
                                apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/plans/create-with-extras`;  // URL da API para plano principal
                            } else {
                                console.error("Nenhum plano principal ou extra foi selecionado.");
                                return;
                            }

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


                                if (response.data.message === 'Pagamento feito por cartão de crédito.') {
                                    localStorage.setItem("transactionId", response.data.transactionId);
                                    router.push("/planos/pagamento");
                                }

                            } catch (error) {
                                console.error("Erro ao processar pagamento:", error);
                                toast.error("Erro na requisição, por favor, tente novamente.");
                            }
                        },
                        onFetching: (resource) => {
                            const progressBar = document.querySelector(".progress-bar");
                            progressBar.removeAttribute("value");
                            return () => {
                                progressBar.setAttribute("value", "0");
                            };
                        },
                    },
                });
            } catch (error) {
                console.error("Erro ao carregar o Mercado Pago:", error);
            }
        };

        loadMercadoPago();
    }, [planId, router, selectedExtraPlans, totalPrice]);

    return (
        <div>
            <form id="form-checkout">
                <div id="form-checkout__cardNumber" className="container border rounded w-full h-9 py-2 px-3 mb-4"></div>
                <div id="form-checkout__expirationDate" className="container border rounded w-full h-9 py-2 px-3 mb-4"></div>
                <div id="form-checkout__securityCode" className="container border rounded w-full h-9 py-2 px-3 mb-4"></div>
                <input
                    type="text"
                    id="form-checkout__cardholderName"
                    className="border rounded w-full py-2 px-3 mb-4"
                />
                <select id="form-checkout__issuer" className="border rounded w-full py-2 px-3 mb-4"></select>
                <select id="form-checkout__installments" className="hidden border rounded w-full py-2 px-3 mb-4"></select>
                <select id="form-checkout__identificationType" className="border rounded w-full py-2 px-3 mb-4"></select>
                <input
                    type="text"
                    id="form-checkout__identificationNumber"
                    className="border rounded w-full py-2 px-3 mb-4"
                />
                <input
                    type="email"
                    id="form-checkout__cardholderEmail"
                    className="border rounded w-full py-2 px-3 mb-4"
                />
                <button type="submit" id="form-checkout__submit" className="w-full py-3 bg-pink-500 text-white text-lg font-semibold rounded-md hover:bg-pink-600 transition">
                    Pagar
                </button>
                <progress value="0" className="progress-bar hidden">Carregando...</progress>
            </form>
        </div>
    );
};

export default dynamic(() => Promise.resolve(MercadoPagoForm), { ssr: false });
