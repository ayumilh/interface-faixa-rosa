"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";

const MercadoPagoForm = ({ totalPrice, planId, selectedExtraPlans }) => {
    const router = useRouter();
    const [formReady, setFormReady] = useState(false);
    const [iframesReady, setIframesReady] = useState(false);

    const cardFormInitialized = useRef(false);
    const cardFormInstance = useRef(null);
    const securityFieldRef = useRef(null);
    const mpInstance = useRef(null);

    useEffect(() => {
        const checkIframes = () => {
            const selectors = [
                "#form-checkout__cardNumber iframe",
                "#form-checkout__expirationDate iframe",
                "#form-checkout__securityCode iframe",
            ];

            const allReady = selectors.every(sel => {
                const iframe = document.querySelector(sel);
                return iframe && iframe.contentWindow;
            });

            setIframesReady(allReady);
        };

        const interval = setInterval(checkIframes, 300); // checa a cada 300ms

        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const fetchSavedCards = async () => {
            try {
                const userToken = Cookies.get("userToken");
                if (!userToken) return;

                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/cards`, {
                    headers: { Authorization: `Bearer ${userToken}` },
                });

                const savedCards = Array.isArray(res?.data?.cards) ? res.data.cards : [];
                const selectElement = document.getElementById("form-checkout__cardId");

                if (selectElement && savedCards.length > 0) {
                    savedCards.forEach(card => {
                        const option = document.createElement("option");
                        option.value = card.id;
                        option.text = `${card.payment_method.name} final ${card.last_four_digits}`;
                        selectElement.appendChild(option);
                    });
                }
            } catch (error) {
                console.error("Erro ao buscar cartões salvos:", error);
            }
        };

        fetchSavedCards();
    }, []);

    useEffect(() => {
        const selectCard = document.getElementById("form-checkout__cardId");

        const handleCardSelection = async (e) => {
            const selectedCardId = e.target.value;
            const isSavedCardSelected = selectedCardId && selectedCardId.trim() !== "";


            if (isSavedCardSelected) {
                // Oculta campos do cardForm padrão
                const fieldIds = [
                    "form-checkout__cardNumber",
                    "form-checkout__expirationDate",
                    "form-checkout__securityCode",
                    "form-checkout__cardholderName",
                    "form-checkout__issuer",
                    "form-checkout__installments",
                    "form-checkout__identificationType",
                    "form-checkout__identificationNumber",
                    "form-checkout__cardholderEmail",
                ];
                fieldIds.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.style.display = "none";
                    }
                });

                // Monta CVV isolado
                const securityCodeContainer = document.getElementById("form-checkout__securityCode-saved");
                if (securityCodeContainer) securityCodeContainer.innerHTML = "";

                const mp = new window.MercadoPago("TEST-61ec5b26-9a78-452c-9c76-375c4405da46");
                const securityField = mp.fields.create("securityCode", {
                    placeholder: "CVV",
                });

                await securityField.mount("form-checkout__securityCode-saved");

                await new Promise(resolve => setTimeout(resolve, 700));

                securityFieldRef.current = securityField;
            } else {
                // Mostra os campos de cartão novo
                const fieldIds = [
                    "form-checkout__cardNumber",
                    "form-checkout__expirationDate",
                    "form-checkout__securityCode",
                    "form-checkout__cardholderName",
                    "form-checkout__issuer",
                    "form-checkout__installments",
                    "form-checkout__identificationType",
                    "form-checkout__identificationNumber",
                    "form-checkout__cardholderEmail",
                ];
                fieldIds.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.style.display = "block";
                    }
                });

                if (securityFieldRef.current?.unmount) {
                    await securityFieldRef.current.unmount();
                    securityFieldRef.current = null;
                }
                if (securityCodeContainer) securityCodeContainer.innerHTML = "";
            }
        };

        if (selectCard) {
            selectCard.addEventListener("change", handleCardSelection);
        }

        return () => {
            if (selectCard) {
                selectCard.removeEventListener("change", handleCardSelection);
            }
        };
    }, []);

    useEffect(() => {
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
                if (cardFormInitialized.current) return;

                const mp = await loadMercadoPagoScript();
                mpInstance.current = new mp("TEST-61ec5b26-9a78-452c-9c76-375c4405da46");
                let cardForm;
                cardForm = mpInstance.current.cardForm({
                    amount: totalPrice,
                    iframe: true,
                    form: {
                        id: "form-checkout",
                        cardNumber: { id: "form-checkout__cardNumber", placeholder: "Número do cartão" },
                        expirationDate: { id: "form-checkout__expirationDate", placeholder: "MM/YY" },
                        securityCode: { id: "form-checkout__securityCode", placeholder: "CVV" },
                        cardholderName: { id: "form-checkout__cardholderName", placeholder: "Titular do cartão" },
                        issuer: { id: "form-checkout__issuer", placeholder: "Banco emissor" },
                        installments: { id: "form-checkout__installments", placeholder: "Parcelas" },
                        identificationType: { id: "form-checkout__identificationType", placeholder: "Tipo de documento" },
                        identificationNumber: { id: "form-checkout__identificationNumber", placeholder: "Número do documento" },
                        cardholderEmail: { id: "form-checkout__cardholderEmail", placeholder: "E-mail" },
                    },
                    callbacks: {
                        onFormMounted: (error) => {
                            if (error) {
                                setFormReady(false);
                            } else {
                                setFormReady(true);
                                cardFormInitialized.current = true;
                                cardFormInstance.current = cardForm;
                            }
                        },
                        onSubmit: async (event) => {
                            event.preventDefault();
                            if (!formReady || !cardFormInstance.current) {
                                toast.error("O formulário ainda está carregando.");
                                return;
                            }

                            const {
                                token: autoToken,
                                paymentMethodId: payment_method_id,
                                issuerId: issuer_id,
                                cardholderEmail: email,
                                installments,
                                identificationNumber,
                                identificationType,
                            } = cardFormInstance.current.getCardFormData();

                            const userToken = Cookies.get("userToken");
                            if (!userToken) return;
                            
                            const selectedCardId = document.getElementById("form-checkout__cardId").value?.trim();
                            const isUsingSavedCard = selectedCardId !== "";
                            let token = null;

                            if (isUsingSavedCard) {
                                // ✅ Garante que o iframe do CVV está montado antes de usar
                                const iframe = document.querySelector("#form-checkout__securityCode-saved iframe");
                                const hasIframeLoaded = iframe && iframe.contentWindow;
                                const canGetSecurity = typeof securityFieldRef.current?.getValue === "function";

                                if (!hasIframeLoaded || !canGetSecurity) {
                                    toast.error("O campo de segurança (CVV) ainda não está pronto.");
                                    return;
                                }

                                try {
                                    const securityCode = await securityFieldRef.current.getValue();

                                    if (!securityCode) {
                                        toast.error("Digite o código de segurança (CVV).");
                                        return;
                                    }

                                    const tokenResult = await mpInstance.current.fields.createCardToken({
                                        cardId: selectedCardId,
                                        securityCode,
                                    });

                                    token = tokenResult?.id;

                                    if (!token) {
                                        toast.error("Token inválido retornado pelo Mercado Pago.");
                                        return;
                                    }

                                } catch (err) {
                                    console.error("❌ Erro ao gerar token do cartão salvo:", err);
                                    toast.error("Erro ao gerar token do cartão salvo.");
                                    return;
                                }

                            } else {
                                token = autoToken;
                            
                                if (!token) {
                                  toast.error("Erro ao gerar token do novo cartão.");
                                  return;
                                }
                              }

                            const requestBody = {
                                payment_method_id,
                                cardToken: token,
                                issuer_id,
                                installments,
                                email,
                                identificationNumber,
                                identificationType,
                                fromSavedCard: isUsingSavedCard,
                                cardId: isUsingSavedCard ? selectedCardId : null,
                            };

                            const isMainPlan = planId >= 1 && planId <= 4;
                            const selectedExtraPlanIds = selectedExtraPlans;
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
                                toast.error("Nenhum plano válido selecionado.");
                                return;
                            }

                            try {
                                const response = await axios.post(apiUrl, requestBody, {
                                    headers: { Authorization: `Bearer ${userToken}` },
                                });

                                if (response.data.message === "Acompanhante já possui um plano ativo.") {
                                    toast.info(response.data.message);
                                    return;
                                }

                                if (response.data.message === "Pagamento feito por cartão de crédito.") {
                                    localStorage.setItem("transactionId", response.data.transactionId);
                                    router.push("/planos/pagamento");
                                }
                            } catch (error) {
                                toast.error("Erro na requisição, tente novamente.");
                            }
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
        <form id="form-checkout">
            <select id="form-checkout__cardId" className="border rounded w-full py-2 px-3 mb-4">
                <option value="">Usar um novo cartão</option>
            </select>

            <div id="form-checkout__securityCode-saved" className="mb-4"></div>

            <div id="form-checkout__cardNumber" className="mb-4"></div>
            <div id="form-checkout__expirationDate" className="mb-4"></div>
            <div id="form-checkout__securityCode" className="mb-4"></div>
            <input id="form-checkout__cardholderName" className="mb-4 w-full border rounded px-3 py-2" placeholder="Nome" />
            <select id="form-checkout__issuer" className="mb-4 w-full border rounded px-3 py-2"></select>
            <select id="form-checkout__installments" className="mb-4 w-full border rounded px-3 py-2 hidden"></select>
            <select id="form-checkout__identificationType" className="mb-4 w-full border rounded px-3 py-2"></select>
            <input id="form-checkout__identificationNumber" className="mb-4 w-full border rounded px-3 py-2" />
            <input id="form-checkout__cardholderEmail" className="mb-4 w-full border rounded px-3 py-2" placeholder="Email" />

            <button
                type="submit"
                disabled={!formReady || !iframesReady}
                className={`w-full py-3 text-white font-bold rounded transition-all duration-200 ${formReady && iframesReady ? "bg-pink-500 hover:bg-pink-600" : "bg-gray-400 cursor-not-allowed"
                    }`}
            >
                {formReady && iframesReady ? "Pagar" : "Carregando..."}
            </button>

        </form>
    );
};

export default dynamic(() => Promise.resolve(MercadoPagoForm), { ssr: false });
