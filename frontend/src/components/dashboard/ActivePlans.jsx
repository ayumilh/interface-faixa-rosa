import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { IoIosArrowForward } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";

export default function ActivePlans() {
    const [activePlan, setActivePlan] = useState(null);
    const [extraPlans, setExtraPlans] = useState([]);
    const [allPlans, setAllPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
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

                const extraPlansData = subscriptions
                    .filter((sub) => sub.isExtra)
                    .map((sub) => sub.extraPlan);

                setExtraPlans(extraPlansData);
                setNewPlanDetails({
                    name: plan.name,
                    planType: plan.planType,
                });

                setAllPlans([plan, ...extraPlansData]);

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

    const handlePlanExtraClick = (extraPlanData) => {
        setPlanToManage(extraPlanData);
        setNewPlanDetails({
            name: extraPlanData.name,
            planType: extraPlanData,
        });
        setIsPlansModalOpen(false);
        setIsModalOpen(true);
    };

    const togglePlansModal = () => {
        setIsPlansModalOpen(!isPlansModalOpen);
        if (isPlansModalOpen) {
            setIsModalOpen(false);
        }
    };


    const toggleManagePlanModal = () => {
        setIsModalOpen(!isModalOpen);
        if (isModalOpen) {
            setIsPlansModalOpen(false);
        }
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Planos</h2>

            {/* Modal de Gerenciamento do Plano */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`bg-white p-8 rounded-xl shadow-xl w-full max-w-lg ${activePlan.isBasic ? 'bg-blue-50' : 'bg-pink-50'}`}>
                        <div className="relative flex items-center justify-between">
                            <h3 className="text-2xl font-semibold text-gray-700 mb-6">Gerenciar Plano</h3>
                            <button onClick={toggleManagePlanModal} className="absolute top-2 right-3 font-semibold text-gray-500 hover:text-gray-700 text-xl">✕</button>
                        </div>
                        <div className="space-y-4">
                            {loading ? (
                                <p className="text-gray-500 text-center">Carregando plano...</p>
                            ) : planToManage ? (
                                <div className={`p-6 rounded-xl shadow-md ${planToManage.isBasic ? 'bg-blue-50' : 'bg-pink-50'}`}>
                                    <h3 className={`text-2xl font-semibold ${planToManage.isBasic ? 'text-blue-800' : 'text-pink-800'}  mb-4 text-center`}>{planToManage.name}</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <ul className="list-disc pl-6 mt-2">
                                                {planToManage?.hasContact && <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Contato com clientes</li>}
                                                {planToManage?.canHideAge && <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Esconder idade</li>}
                                                {planToManage?.hasDarkMode && <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Modo escuro</li>}
                                                {planToManage?.hasPublicReviews && <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Reviews públicos</li>}
                                                {planToManage?.hasStories && <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Stories</li>}
                                            </ul>
                                        </div>

                                        <div className="flex justify-center gap-4 mt-6">
                                            <button onClick={handleManagePlan} className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600">Gerenciar Plano</button>
                                            <button onClick={handleDeactivatePlan} className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600">Desativar Plano</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-gray-500">Nenhum plano extra selecionado</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Botão para abrir o modal com todos os planos assinados */}
            <button
                onClick={togglePlansModal}
                className="px-6 py-2 bg-pink-600 text-white font-semibold rounded-md mt-4 shadow-md hover:bg-pink-700 transition-colors ease-in-out"
            >
                Ver Todos os Planos Assinados
            </button>

            {/* Modal mostrando todos os planos assinados */}
            {isPlansModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg">
                        <div className="relative flex items-center justify-between">
                            <h3 className="text-2xl font-semibold text-gray-700 mb-6">Todos os Planos</h3>
                            <button onClick={togglePlansModal} className="absolute top-2 right-3 font-semibold text-gray-500 hover:text-gray-700 text-xl">✕</button>
                        </div>
                        <div className="space-y-4">
                            <ul className="space-y-3">
                                {allPlans.map((plan, index) => (
                                    <li key={index} className={`p-4 rounded-lg shadow-md flex justify-between items-center ${plan.isBasic ? 'bg-blue-50' : 'bg-pink-50'}`}>
                                        <h4 className={`text-sm font-semibold ${plan.isBasic ? 'text-blue-800' : 'text-pink-800'}`}>{plan.name}</h4>
                                        <button
                                            onClick={() => handlePlanExtraClick(plan)}
                                            className={`text-sm font-semibold ${plan.isBasic ? 'text-blue-500 hover:text-blue-700' : 'text-pink-500 hover:text-pink-700'}`}
                                        >
                                            <IoIosArrowForward size={20} />
                                        </button>
                                    </li>

                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
