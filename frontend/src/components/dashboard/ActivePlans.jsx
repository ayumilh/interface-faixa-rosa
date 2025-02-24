import React, { useEffect, useState } from "react";
import axios from "axios";
import { searchUserId } from "@/utils/searchUserId";
import Cookies from "js-cookie";

export default function ActivePlans() {
    const [activePlan, setActivePlan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserPlans = async () => {
            const token = Cookies.get("userToken");
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/plans/user-plans`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setActivePlan(response.data.plan);
            } catch (error) {
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
                            className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition duration-200"
                        >
                            Assinar Plano Básico
                        </button>
                    </div>
                )}
            </ul>
        </div>
    );
}
