"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";
import { FaFlag, FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import Modal from "../adminDashboard/Modal";
import ModalEditarStatusDenuncia from "./modalAction/ModalEditarStatusDenuncia";

const Denuncias = () => {
    const [denuncias, setDenuncias] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const userToken = Cookies.get("userToken");

    useEffect(() => {
        const fetchDenuncias = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/denuncias`,
                    { withCredentials: true }
                );
                setDenuncias(res.data.data || []);
            } catch (error) {
                console.error("Erro ao buscar denúncias:", error);
                toast.error("Erro ao carregar denúncias.");
            } finally {
                setIsLoading(false);
            }
        };

        if (userToken) fetchDenuncias();
    }, [userToken]);

    const handleStatusUpdate = (denuncia) => {
        setModalContent(
            <ModalEditarStatusDenuncia
                denuncia={denuncia}
                userToken={userToken}
                onClose={() => setModalOpen(false)}
                onSalvarStatus={async (id, newStatus) => {
                    try {
                        await axios.patch(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/denuncias/${id}/status`,
                            { status: newStatus },
                            { withCredentials: true }
                        );
                        setDenuncias((prev) =>
                            prev.map((d) =>
                                d.id === id ? { ...d, denunciaStatus: newStatus } : d
                            )
                        );
                        toast.success("Status atualizado com sucesso.");
                        setModalOpen(false);
                    } catch (error) {
                        console.error(error);
                        toast.error("Erro ao atualizar status.");
                    }
                }}
            />
        );
        setModalOpen(true);
    };

    const handleExcluirDenuncia = async (id) => {
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/denuncias/${id}`,
                { withCredentials: true }
            );
            setDenuncias((prev) => prev.filter((d) => d.id !== id));
            toast.success("Denúncia excluída.");
        } catch (err) {
            console.error(err);
            toast.error("Erro ao excluir denúncia.");
        }
    };

    const StatusBadge = ({ status }) => {
        const statusMap = {
            RESOLVIDA: { label: "Resolvida", style: "bg-green-100 text-green-800" },
            PENDING: { label: "Pendente", style: "bg-yellow-100 text-yellow-800" },
            IN_ANALYSIS: {
                label: "Em Análise",
                style: "bg-orange-100 text-orange-800",
            },
            CANCELADA: { label: "Cancelada", style: "bg-gray-100 text-gray-800" },
            REJEITADA: { label: "Rejeitada", style: "bg-red-100 text-red-800" },
        };
        const current = statusMap[status] || {
            label: status,
            style: "bg-gray-100 text-gray-800",
        };
        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${current.style}`}
            >
                {current.label}
            </span>
        );
    };

    return (
        <div className="p-6 relative">
            <h1 className="text-3xl font-bold mb-6 text-pink-600 flex items-center gap-2">
                <FaFlag /> Gerenciamento de Denúncias
            </h1>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl shadow-lg">
                    <thead className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">ID</th>
                            <th className="py-3 px-4 text-left">Motivo</th>
                            <th className="py-3 px-4 text-left">Denunciante</th>
                            <th className="py-3 px-4 text-left">Denunciado</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="py-6 text-center">
                                    Carregando...
                                </td>
                            </tr>
                        ) : denuncias.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-6 text-center text-gray-500">
                                    Nenhuma denúncia encontrada.
                                </td>
                            </tr>
                        ) : (
                            denuncias.map((d) => (
                                <tr key={d.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">{d.id}</td>
                                    <td className="py-3 px-4">{d.motivo}</td>
                                    <td className="py-3 px-4">
                                        {d.denuncianteNome} <br />
                                        <span className="text-xs text-gray-500">
                                            {d.denuncianteLocal}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {d.denunciadoNome} <br />
                                        <span className="text-xs text-gray-500">
                                            {d.denunciadoLocal}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <StatusBadge status={d.denunciaStatus} />
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <select
                                                value={d.denunciaStatus}
                                                onChange={async (e) => {
                                                    const newStatus = e.target.value;
                                                    try {
                                                        await axios.put(
                                                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/denuncias/${d.id}/status`,
                                                            { status: newStatus },
                                                            { withCredentials: true }
                                                        );
                                                        setDenuncias((prev) =>
                                                            prev.map((item) =>
                                                                item.id === d.id
                                                                    ? { ...item, denunciaStatus: newStatus }
                                                                    : item
                                                            )
                                                        );
                                                        toast.success("Status atualizado com sucesso.");
                                                    } catch (error) {
                                                        console.error(error);
                                                        toast.error("Erro ao atualizar status.");
                                                    }
                                                }}
                                                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            >
                                                <option value="PENDING">Pendente</option>
                                                <option value="IN_ANALYSIS">Em Análise</option>
                                                <option value="RESOLVIDA">Resolvida</option>
                                                <option value="CANCELADA">Cancelada</option>
                                                <option value="REJEITADA">Rejeitada</option>
                                            </select>

                                            <motion.button
                                                onClick={() => handleExcluirDenuncia(d.id)}
                                                className="p-2 rounded-lg bg-red-100 text-red-600"
                                                whileHover={{ scale: 1.05 }}
                                                title="Excluir"
                                            >
                                                <FaTrash />
                                            </motion.button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal fora da tabela, aparece acima de tudo */}
            <AnimatePresence>
                {modalOpen && (
                    <Modal onClose={() => setModalOpen(false)}>{modalContent}</Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Denuncias;
