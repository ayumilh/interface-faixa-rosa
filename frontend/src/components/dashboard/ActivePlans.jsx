import React, { useEffect, useState } from "react";
import axios from "axios";
import { searchUserId } from "@/utils/searchUserId";

export default function ActivePlans() {
    const [activePlan, setActivePlan] = useState(null); // Estado para armazenar o plano ativo
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserPlans = async () => {
            const token = searchUserId();
            try {
                // Faz a chamada para a API de planos do usuário
                const response = await axios.get("https://backend-faixa-rosa.vercel.app/api/plans/user-plans", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Inclui o token de autenticação, se necessário
                    },
                });

                console.log("Plano ativo:", response.data.plan); // Verifica a resposta no console

                // Atualiza o estado com o plano ativo
                setActivePlan(response.data.plan); // Supondo que "plan" seja um objeto único retornado pela API
            } catch (error) {
                console.error("Erro ao buscar plano ativo:", error);
                setActivePlan(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPlans();
    }, []);

    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 text-center">Planos Ativos</h2>

            <ul className="mt-4 space-y-3">
                {loading ? (
                    <li className="text-gray-500 text-sm text-center">Carregando planos...</li>
                ) : activePlan ? (
                    <li className="px-4 py-3 bg-blue-50 text-blue-800 font-medium rounded-lg text-sm shadow-sm text-center">
                        <span className="block font-bold">{activePlan.name}</span>
                    </li>
                ) : (
                    <div className="text-center">
                        <p className="text-gray-500 text-sm mb-3">Nenhum plano ativo</p>
                        <button
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition duration-200"
                        >
                            Assinar Plano Básico
                        </button>
                    </div>
                )}
            </ul>
        </div>
    );
}
