import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { IoIosArrowForward } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";

export default function ActivePlans() {
    const [activePlan, setActivePlan] = useState(null);
    const [extraPlans, setExtraPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [planToManage, setPlanToManage] = useState(null);
    const [newPlanDetails, setNewPlanDetails] = useState({
        name: "",
        isActive: true,
        planType: {},
    });

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
                const { plan, subscriptions } = response.data;

                setActivePlan(plan);
                const extraPlans = subscriptions.filter((sub) => sub.isExtra);
                setExtraPlans(extraPlans);
                setNewPlanDetails({
                    name: plan.name,
                    planType: plan.planType,
                });
            } catch (error) {
                setActivePlan(null);
                setExtraPlans([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPlans();
    }, []);

    const handleManagePlan = () => {
        console.log(`Atualizando plano ${planToManage?.name}`);
        setIsModalOpen(false);
    };

    const handleDeactivatePlan = () => {
        console.log(`Desativando plano ${planToManage?.name}`);
        setNewPlanDetails({ ...newPlanDetails, isActive: false });
        setIsModalOpen(false);
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Gerenciamento de Planos</h2>

            {/* Modal de Gerenciamento do Plano */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
                        >
                            ✕
                        </button>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Gerenciar Plano</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700">Nome do Plano</label>
                                <p className="w-full p-3 border border-gray-300 rounded-lg shadow-sm">{newPlanDetails.name}</p>
                            </div>

                            {/* Exibição das Funcionalidades em Lista com ícones de check */}
                            <div>
                                <label className="block text-gray-700">Funcionalidades do Plano</label>
                                <ul className="list-disc pl-6">
                                    {newPlanDetails?.planType?.accessDashboard && (
                                        <li className="flex items-center">
                                            <FaCheckCircle className="text-green-500 mr-2" /> Acesso ao Dashboard
                                        </li>
                                    )}
                                    {newPlanDetails?.planType?.accessMetrics && (
                                        <li className="flex items-center">
                                            <FaCheckCircle className="text-green-500 mr-2" /> Acesso às Métricas
                                        </li>
                                    )}
                                    {newPlanDetails?.planType?.accessConvenio && (
                                        <li className="flex items-center">
                                            <FaCheckCircle className="text-green-500 mr-2" /> Acesso ao Convênio
                                        </li>
                                    )}
                                    {newPlanDetails?.planType?.cityChangeAllowed && (
                                        <li className="flex items-center">
                                            <FaCheckCircle className="text-green-500 mr-2" /> Mudança de Cidade Permitida
                                        </li>
                                    )}
                                    {newPlanDetails?.planType?.isDarkMode && (
                                        <li className="flex items-center">
                                            <FaCheckCircle className="text-green-500 mr-2" /> Modo Escuro
                                        </li>
                                    )}
                                    <li className="flex items-center">
                                        <FaCheckCircle className="text-green-500 mr-2" /> {newPlanDetails?.planType?.points} Pontos de Listagem
                                    </li>
                                </ul>
                            </div>

                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    onClick={handleManagePlan}
                                    className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
                                >
                                    Salvar Alterações
                                </button>
                                <button
                                    onClick={handleDeactivatePlan}
                                    className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600"
                                >
                                    Desativar Plano
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600"
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Planos Ativos e Extras */}
            <div className="space-y-4">
                {loading ? (
                    <p className="text-gray-500 text-center">Carregando planos...</p>
                ) : activePlan ? (
                    <div className="bg-blue-50 p-4 rounded-lg shadow-md flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-blue-800">{activePlan.name}</h3>
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => {
                                    setPlanToManage(activePlan);
                                    setNewPlanDetails({ name: activePlan.name, planType: activePlan.planType });
                                    setIsModalOpen(true);
                                }}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                <IoIosArrowForward size={24} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-gray-500">Nenhum plano ativo</p>
                        <button className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg mt-4">Assinar Plano Básico</button>
                    </div>
                )}

                {extraPlans.length > 0 && (
                    <div>
                        <ul className="space-y-3">
                            {extraPlans.map((sub, index) => (
                                <li key={index} className="bg-pink-50 p-4 rounded-lg shadow-md flex justify-between items-center">
                                    <h4 className="text-lg font-semibold text-pink-800">{sub.extraPlan.name}</h4>
                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={() => {
                                                setPlanToManage(sub.extraPlan);
                                                setNewPlanDetails({ name: sub.extraPlan.name, planType: sub.extraPlan.planType });
                                                setIsModalOpen(true);
                                            }}
                                            className="text-pink-500 hover:text-pink-700"
                                        >
                                            <IoIosArrowForward size={20} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
