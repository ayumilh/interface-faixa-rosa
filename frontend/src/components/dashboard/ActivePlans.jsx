import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { IoIosArrowForward } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

export default function ActivePlans() {
    const [activePlan, setActivePlan] = useState(null);
    const [extraPlans, setExtraPlans] = useState([]);
    const [allPlans, setAllPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); // Para o plano básico
    const [isExtraPlanConfirmationModalOpen, setIsExtraPlanConfirmationModalOpen] = useState(false); // Para plano extra
    const [planToManage, setPlanToManage] = useState(null);
    const [newPlanDetails, setNewPlanDetails] = useState({
        name: "",
        isActive: true,
        planType: {},
    });
    const router = useRouter();

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

    useEffect(() => {
        fetchUserPlans();
    }, []);


    const handleDeactivatePlan = async () => {
        if (planToManage.isBasic) {
            // Exibe o modal de confirmação antes de desativar o plano básico
            setIsConfirmationModalOpen(true);
        } else {
            // Exibe o modal de confirmação antes de desativar o plano extra
            setIsExtraPlanConfirmationModalOpen(true);
        }

        setIsModalOpen(false);
    };

    const handleConfirmDeactivateBasicPlan = async () => {
        // Chama a rota POST para desativar o plano básico e os extras
        const token = Cookies.get("userToken");
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/plans/disable`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Autenticação com o token
                    },
                }
            );
            toast.success("Plano básico desativado com sucesso!");

            // Atualiza a lista de planos diretamente no estado
            setAllPlans([]);
            setExtraPlans([]);
            setActivePlan(null); // O plano básico foi removido, então não há plano ativo

        } catch (error) {
            console.error("Erro ao desativar o plano básico:", error);
            toast.error("Erro ao desativar o plano básico. Tente novamente.");
        }

        // Fecha o modal de confirmação
        setIsConfirmationModalOpen(false);
    };

    const handleCancelDeactivate = () => {
        setIsConfirmationModalOpen(false);
        setIsExtraPlanConfirmationModalOpen(false);
    };

    const handleConfirmDeactivateExtraPlan = async () => {
        // Chama a rota POST para desativar o plano extra
        const token = Cookies.get("userToken");
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/plans/disableExtra`,
                {
                    extraPlanIds: [planToManage.id], // Envia o ID do plano extra
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Autenticação com o token
                    },
                }
            );

            toast.success("Plano extra desativado com sucesso!");

            // Atualiza a lista de planos diretamente no estado
            setAllPlans((prevPlans) =>
                prevPlans.filter((plan) => plan.id !== planToManage.id)
            );
            setExtraPlans((prevPlans) =>
                prevPlans.filter((plan) => plan.id !== planToManage.id)
            );
            setActivePlan((prevPlan) =>
                prevPlan.id === planToManage.id ? null : prevPlan
            );
        } catch (error) {
            console.error("Erro ao desativar o plano extra:", error);
            toast.error("Erro ao desativar o plano extra. Tente novamente.");
        }

        // Fecha o modal de confirmação
        setIsExtraPlanConfirmationModalOpen(false);
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

    // Condição para mostrar o botão "Assinar Plano" caso o usuário não tenha planos
    const showSignUpButton = !activePlan && extraPlans.length === 0;

    return (
        <div className="p-6 bg-white shadow-lg rounded-xl">
            <ToastContainer />

            <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">Planos</h2>

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

            {/* Modal de confirmação antes de desativar o plano básico */}
            {isConfirmationModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-6">Confirmar Desativação</h3>
                        <p className="text-gray-500 mb-6">
                            Você está prestes a desativar o plano básico, o que irá desativar também todos os planos extras associados. Tem certeza de que deseja continuar?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button onClick={handleConfirmDeactivateBasicPlan} className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600">Sim, desativar</button>
                            <button onClick={handleCancelDeactivate} className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmação antes de desativar o plano extra */}
            {isExtraPlanConfirmationModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-6">Confirmar Desativação</h3>
                        <p className="text-gray-500 mb-6">
                            Você está prestes a desativar o plano extra. Tem certeza de que deseja continuar?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button onClick={handleConfirmDeactivateExtraPlan} className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600">Sim, desativar</button>
                            <button onClick={handleCancelDeactivate} className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Botão de assinar plano caso não tenha nenhum plano */}
            {showSignUpButton && (
                <div className="text-center">
                    <button
                        onClick={() => router.push("/planos")}
                        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md mt-4 shadow-md hover:bg-green-600 transition-colors ease-in-out"
                    >
                        Assinar Plano
                    </button>
                </div>

            )}

            {/* Botão para abrir o modal com todos os planos assinados */}
            {!showSignUpButton && (
                <div className="flex items-center justify-between">
                    <button
                        onClick={togglePlansModal}
                        className="px-6 py-2 bg-pink-600 text-white font-semibold rounded-md mt-4 shadow-md hover:bg-pink-700 transition-colors ease-in-out"
                    >
                        Ver Todos os Planos Assinados
                    </button>
                </div>
            )}

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
                                        <h4 className={`text-sm font-semibold ${plan.isBasic ? 'text-blue-800' : 'text-pink-800'}`}>
                                            {plan.name}
                                            <span className={`ml-2 text-xs font-medium ${plan.isBasic ? 'text-blue-500' : 'text-pink-500'}`}>
                                                {plan.isBasic ? 'Básico' : 'Extra'}
                                            </span>
                                        </h4>
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
