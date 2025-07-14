"use client";
import { useState, useEffect, useCallback } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GerenciamentoDePlanos() {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({
    name: "",
    price: "",
    description: "",
    isBasic: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = Cookies.get("userToken");



  // Buscar planos do backend
  const fetchPlans = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/plans`,
        { withCredentials: true }
      );
      setPlans(response.data);
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
      toast.error("Erro ao buscar planos.");
    }
  }, [token]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Criar novo plano
  const createPlan = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/plans/create`,
        {
          name: newPlan.name,
          price: parseFloat(newPlan.price),
          description: newPlan.description,
          isBasic: newPlan.isBasic,
          planTypeId: newPlan.planTypeId, // Certifique-se de enviar esse campo conforme necessário
        },
        { withCredentials: true }
      );
      setIsModalOpen(false); // Fecha modal
      fetchPlans(); // Atualiza lista
      setNewPlan({
        name: "",
        price: "",
        description: "",
        isBasic: false,
        planTypeId: 2, // Valor padrão (ou conforme sua lógica)
      });
      toast.success("Plano criado com sucesso.");
    } catch (error) {
      console.error("Erro ao criar plano:", error);
      toast.error("Erro ao criar plano.");
    }
  };

  // Deletar plano
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/plans/${id}/delete`,
        { withCredentials: true }
      );
      toast.success("Plano deletado com sucesso.");
      fetchPlans(); // Atualiza a lista de planos
    } catch (error) {
      console.error("Erro ao deletar plano:", error);
      toast.error("Erro ao deletar plano.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* ToastContainer para exibir notificações */}
      <ToastContainer />

      <h2 className="text-3xl font-bold text-gray-800 text-start">
        Gerenciamento de Planos
      </h2>

      {/* Modal de Criação de Planos */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
            <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
              Criar Novo Plano
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-gray-600 font-medium mb-2">
                  Nome do Plano
                </label>
                <input
                  type="text"
                  placeholder="Ex: Plano Gold"
                  value={newPlan.name}
                  onChange={(e) =>
                    setNewPlan({ ...newPlan, name: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-2">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 99.90"
                  value={newPlan.price}
                  onChange={(e) =>
                    setNewPlan({ ...newPlan, price: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-2">
                  Descrição
                </label>
                <textarea
                  placeholder="Breve descrição do plano"
                  value={newPlan.description}
                  onChange={(e) =>
                    setNewPlan({ ...newPlan, description: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newPlan.isBasic}
                  onChange={(e) =>
                    setNewPlan({ ...newPlan, isBasic: e.target.checked })
                  }
                  className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-2 focus:ring-pink-400"
                />
                <span className="ml-2 text-gray-700 font-medium">
                  Plano Básico?
                </span>
              </div>
            </div>
            <button
              onClick={createPlan}
              className="w-full mt-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition duration-300"
            >
              Criar Plano
            </button>
          </div>
        </div>
      )}

      {/* Lista de Planos */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold mt-12 mb-6 text-gray-700 text-start">
          Planos Cadastrados
        </h3>
        {/* Botão para abrir modal */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white px-6 py-3 text-sm font-semibold rounded-full shadow-lg transition duration-300"
          >
            + Criar Novo Plano
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 shadow-lg rounded-xl transition transform hover:scale-105 ${plan.isBasic
              ? "bg-blue-50 border-blue-500"
              : "bg-pink-50 border-pink-500"
              } border-2`}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-semibold text-gray-800">
                {plan.name}
              </h4>
              <span
                className={`px-3 py-1 rounded-full text-sm font-bold ${plan.isBasic
                  ? "bg-blue-500 text-white"
                  : "bg-pink-500 text-white"
                  }`}
              >
                {plan.isBasic ? "Plano Básico" : "Plano Extra"}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">
                R$ {plan.price.toFixed(2)}
              </span>
              <button
                onClick={() => handleDelete(plan.id)}
                className="text-red-500 hover:text-red-700 p-2 rounded-lg transition duration-300"
              >
                <FaTrash size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
