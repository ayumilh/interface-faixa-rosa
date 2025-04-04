"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:4000"; // Atualize conforme necessário

export default function GerenciamentoDeAssinaturas() {
    const [companions, setCompanions] = useState([]);
    const [selectedExtras, setSelectedExtras] = useState({});
    const token = Cookies.get("userToken");
    const [expanded, setExpanded] = useState({});



    const toggleExpand = (id) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Buscar assinaturas ativas
    const fetchSubscriptions = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/subscriptions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCompanions(response.data);
        } catch (error) {
            console.error("Erro ao buscar assinaturas ativas:", error);
            toast.error("Erro ao buscar assinaturas ativas.");
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, [fetchSubscriptions]);

    // Cancelar assinatura normal
    const disableUserPlan = async (companionId, subscriptionId) => {
        try {
            // await axios.put(
            //     `${API_URL}/api/admin/subscriptions/${companionId}/${subscriptionId}/disable`,
            //     {},
            //     { headers: { Authorization: `Bearer ${token}` } }
            // );
            console.log("Assinatura cancelada com sucesso.");
            toast.success("Assinatura cancelada com sucesso.");
            fetchSubscriptions();
        } catch (error) {
            console.error("Erro ao cancelar assinatura:", error);
            toast.error("Erro ao cancelar assinatura.");
        }
    };

    // Função para notificar a acompanhante que o plano está acabando
    const notifyPlanExpiring = async (companionId, subscriptionId) => {
        try {
            // Exemplo de chamada à API para notificar
            // await axios.post(
            //     `${API_URL}/api/admin/notify-plan-expiring`,
            //     { companionId, subscriptionId },
            //     { headers: { Authorization: `Bearer ${token}` } }
            // );
            console.log("Notificação enviada com sucesso para a assinatura:", subscriptionId);
            toast.success("Notificação enviada com sucesso.");
        } catch (error) {
            console.error("Erro ao enviar notificação:", error);
            toast.error("Erro ao enviar notificação.");
        }
    };

    // Selecionar/Deselecionar plano extra
    const toggleExtraPlanSelection = (companionId, extraPlanId) => {
        setSelectedExtras((prevState) => {
            const newSelection = new Set(prevState[companionId] || []);
            if (newSelection.has(extraPlanId)) {
                newSelection.delete(extraPlanId);
            } else {
                newSelection.add(extraPlanId);
            }
            return { ...prevState, [companionId]: newSelection };
        });
    };

    // Cancelar planos extras selecionados
    const disableExtraPlans = async (companionId) => {
        if (!selectedExtras[companionId] || selectedExtras[companionId].size === 0) {
            toast.warning("Selecione ao menos um plano extra para cancelar.");
            return;
        }

        const extraPlanIds = Array.from(selectedExtras[companionId]);

        try {
            // await axios.put(
            //     `${API_URL}/api/admin/subscriptions/${companionId}/disable-extras`,
            //     { extraPlanIds },
            //     { headers: { Authorization: `Bearer ${token}` } }
            // );
            console.log("Planos extras cancelados com sucesso.", extraPlanIds);
            toast.success("Planos extras cancelados com sucesso.");
            fetchSubscriptions();
        } catch (error) {
            console.error("Erro ao cancelar planos extras:", error);
            toast.error("Erro ao cancelar planos extras.");
        }
    };

    // Função para traduzir o status do perfil
    const getTranslatedStatus = (status) => {
        switch (status) {
            case "ACTIVE":
                return "Ativo";
            case "SUSPENDED":
                return "Suspendido";
            case "PENDING":
                return "Pendente";
            default:
                return status;
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "SUSPENDED":
                return "bg-yellow-500 text-white"; // suspendido = amarelo
            case "PENDING":
                return "bg-red-500 text-white"; // pending = vermelho
            case "ACTIVE":
            default:
                return "bg-green-500 text-white"; // ativo = verde (padrão)
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Gerenciamento de Assinaturas
            </h2>
            <p className="text-gray-600">
                Controle as assinaturas ativas das acompanhantes.
            </p>
            <div className="p-6">
                {companions.length === 0 ? (
                    <p className="text-gray-500 text-center">Nenhuma assinatura ativa encontrada.</p>
                ) : (
                    companions.map((companion) => {
                        const activePlans = companion.subscriptions.filter((sub) => !sub.isExtra);
                        const extraPlans = companion.subscriptions.filter((sub) => sub.isExtra);

                        return (
                            <div key={companion.id} className="w-full bg-white shadow-md rounded-lg p-4 mb-4 border-l-4 border-pink-500">
                                {/* Cabeçalho Compacto */}
                                <div className="flex justify-between items-center">
                                    <div className="py-4 w-full">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                {/* Ícone com a primeira letra */}
                                                <div className="flex-shrink-0 bg-gray-200 rounded-full h-12 w-12 flex items-center justify-center">
                                                    <span className="text-xl font-bold text-gray-700">
                                                        {companion.name.charAt(0)}
                                                    </span>
                                                </div>

                                                {/* Nome da Acompanhante */}
                                                <h1 className="text-xl font-semibold text-gray-800">
                                                    {companion.name}
                                                </h1>
                                            </div>

                                            {/* Planos Ativos e Extras */}
                                            <div className="flex items-center space-x-2 mt-1 mr-4">
                                                {/* Plano Ativo */}
                                                {activePlans.length > 0 && (
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-lg">
                                                        {activePlans.map(plan => plan.plan?.name || "Desconhecido").join(", ")}
                                                    </span>
                                                )}

                                                {/* Planos Extras */}
                                                {extraPlans.length > 0 && (
                                                    <span className="bg-pink-100 text-pink-800 px-2 py-1 text-xs rounded-lg">
                                                        {extraPlans.map(plan => plan.extraPlan?.name || "Extra").join(", ")}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between space-x-4 mt-2">
                                            <div className="flex items-center space-x-4 mt-2">
                                                {/* Cidade e Status */}
                                                <div className="flex items-center mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        {companion.city}, {companion.state}
                                                    </p>
                                                    <span
                                                        className={`ml-2 inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(
                                                            companion.profileStatus
                                                        )}`}
                                                    >
                                                        {getTranslatedStatus(companion.profileStatus)}
                                                    </span>
                                                </div>

                                                {/* Última atividade e pontos */}
                                                <p className="mt-2 text-xs text-gray-400">
                                                    Última atividade:{" "}
                                                    {new Date(companion.lastOnline).toLocaleDateString()} • Pontos:{" "}
                                                    {companion.points}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => notifyPlanExpiring(companion.id, sub.id)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-full shadow-sm text-xs ml-2"
                                            >
                                                Notificar
                                            </button>

                                        </div>

                                    </div>
                                    <button
                                        onClick={() => toggleExpand(companion.id)}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        {expanded[companion.id] ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
                                    </button>
                                </div>

                                {/* Conteúdo Expandível */}
                                {expanded[companion.id] && (
                                    <div className={`mt-4 px-4 py-2 border-t border-gray-200 transition-all duration- ease-in-out ${expanded[companion.id] ? "opacity-100" : "opacity-0"}`} style={{
                                        maxHeight: expanded[companion.id] ? "500px" : "0",
                                    }}>
                                        {activePlans.length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="font-semibold text-lg text-blue-700 mb-2">Plano Ativo</h4>
                                                {activePlans.map((sub) => (
                                                    <div key={sub.id} className="bg-blue-50 border border-blue-300 rounded-lg p-4 shadow-sm mb-2">
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <p className="text-blue-800 font-bold text-lg">{sub.plan?.name || "Desconhecido"}</p>
                                                            </div>
                                                            <div className="flex items-center space-x-3">
                                                                {/* Botão para expandir detalhes */}
                                                                <button
                                                                    onClick={() => toggleExpand(sub.id)}
                                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                                >
                                                                    {expanded[sub.id] ? "Ocultar" : "Ver Detalhes"}
                                                                </button>

                                                                {/* Botão de cancelar */}
                                                                <button
                                                                    onClick={() => disableUserPlan(companion.id, sub.id)}
                                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-full shadow-sm text-sm"
                                                                >
                                                                    Cancelar
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Informações adicionais do plano (Ocultas por padrão) */}
                                                        {expanded[sub.id] && (
                                                            <div className="mt-2 p-3 bg-white border rounded-lg shadow-md transition-all duration-300">
                                                                <p className="text-gray-600 text-sm">
                                                                    Início: {new Date(sub.startDate).toLocaleDateString()}
                                                                </p>
                                                                <p className="text-gray-600 text-sm">{sub.plan?.description || "Sem descrição disponível"}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Planos Extras */}
                                        {extraPlans.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="font-semibold text-md text-pink-700 mb-2">Planos Extras</h4>

                                                <div className="grid grid-cols-2 gap-4">
                                                    {extraPlans.map((extraSub) => (
                                                        <div
                                                            key={extraSub.id}
                                                            className="bg-gray-50 border border-gray-300 rounded-lg p-3 shadow-sm"
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <div className="flex items-center">
                                                                    {/* Checkbox */}
                                                                    <input
                                                                        type="checkbox"
                                                                        className="mr-3 w-5 h-5 accent-pink-600 cursor-pointer"
                                                                        checked={
                                                                            selectedExtras[companion.id]?.has(
                                                                                extraSub.extraPlan?.id
                                                                            ) || false
                                                                        }
                                                                        onChange={() =>
                                                                            toggleExtraPlanSelection(companion.id, extraSub.extraPlan?.id)
                                                                        }
                                                                    />
                                                                    <p className="text-gray-800 font-semibold">
                                                                        {extraSub.extraPlan?.name}
                                                                    </p>
                                                                </div>

                                                                {/* Botão para expandir detalhes */}
                                                                <button
                                                                    onClick={() => toggleExpand(extraSub.id)}
                                                                    className="text-pink-600 hover:text-pink-800 text-sm font-medium"
                                                                >
                                                                    {expanded[extraSub.id] ? "Ocultar" : "Ver Detalhes"}
                                                                </button>
                                                            </div>

                                                            {/* Informações adicionais do plano (Ocultas por padrão) */}
                                                            {expanded[extraSub.id] && (
                                                                <div className="mt-2 p-3 bg-white border rounded-lg shadow-md transition-all duration-300">
                                                                    <p className="text-gray-600 text-sm">
                                                                        {extraSub.extraPlan?.description ||
                                                                            "Sem descrição disponível"}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Botão para cancelar planos extras */}
                                                <div className="flex justify-end mt-3">
                                                    <button
                                                        onClick={() => disableExtraPlans(companion.id)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-full shadow-sm text-sm"
                                                    >
                                                        Cancelar Planos Extras
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
