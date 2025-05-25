import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaCheck,
    FaTimes,
    FaEye,
    FaBan,
    FaEdit,
    FaFileAlt,
    FaHistory,
    FaFlag,
    FaVideo,
    FaTrash,
    FaUser,
    FaMapMarkerAlt,
    FaRuler,
    FaWeight,
    FaStar,
    FaUsers,
    FaChartBar,
    FaShieldAlt,
    FaCog,
    FaChevronLeft,
    FaChevronRight,
    FaSort,
    FaSortUp,
    FaSortDown
} from "react-icons/fa";
import Modal from "./Modal";
import Tooltip from "../common/Tooltip";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import ModalEditarPlano from "./modalAction/ModalEditarPlano";
import ModalVerificarDocumentos from "./modalAction/ModalVerificarDocumentos";
import ModalVerificarVideo from "./modalAction/ModalVerificarVideo";

const Anunciantes = () => {
    const [modal, setModal] = useState({ isOpen: false, content: null });
    const [anunciantes, setAnunciantes] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [filtroStatus, setFiltroStatus] = useState("todos");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Itens por página
    const [sortOrder, setSortOrder] = useState("desc"); // "asc" ou "desc"
    const [isLoading, setIsLoading] = useState(false);
    const userToken = Cookies.get("userToken");

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const fetchAnunciantes = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/companion`,
                    {
                        headers: { Authorization: `Bearer ${userToken}` },
                    }
                );
                setAnunciantes(response.data);
            } catch (error) {
                console.error("Erro ao buscar anunciantes:", error);
                toast.error("Erro ao carregar anunciantes");
            } finally {
                setIsLoading(false);
            }
        };

        if (userToken) {
            fetchAnunciantes();
        }
    }, [userToken]);

    // Estados e loading para modais
    const [documentStatusModal, setDocumentStatusModal] = useState(null);
    const [planos, setPlanos] = useState([]);
    const [planosExtras, setPlanosExtras] = useState([]);

    // Carregar planos
    useEffect(() => {
        const fetchPlanos = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/plans`,
                );
                const planosData = response.data;
                setPlanos(planosData.filter(plano => plano.isBasic));
                setPlanosExtras(planosData.filter(plano => !plano.isBasic));
            } catch (error) {
                console.error("Erro ao carregar planos:", error);
            }
        };

        fetchPlanos();
    }, []);

    // Função para ordenar anunciantes por data de chegada
    const sortAnunciantesByDate = (anunciantesArray, order) => {
        return [...anunciantesArray].sort((a, b) => {
            const dateA = new Date(a.createdAt || a.user?.createdAt);
            const dateB = new Date(b.createdAt || b.user?.createdAt);
            
            if (order === "desc") {
                return dateB - dateA; // Mais recentes primeiro
            } else {
                return dateA - dateB; // Mais antigos primeiro
            }
        });
    };

    // Filtrar e ordenar anunciantes
    const anunciantesFiltrados = React.useMemo(() => {
        let filtered = anunciantes.filter(anunciante => {
            if (filtroStatus === "todos") return true;
            return anunciante.profileStatus === filtroStatus;
        });

        // Ordenar por data de chegada
        filtered = sortAnunciantesByDate(filtered, sortOrder);

        return filtered;
    }, [anunciantes, filtroStatus, sortOrder]);

    // Cálculos de paginação
    const totalPages = Math.ceil(anunciantesFiltrados.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const anunciantesPaginados = anunciantesFiltrados.slice(startIndex, endIndex);

    // Resetar página ao mudar filtro
    useEffect(() => {
        setCurrentPage(1);
    }, [filtroStatus]);

    // Função para mudar ordenação
    const toggleSortOrder = () => {
        setSortOrder(prevOrder => prevOrder === "desc" ? "asc" : "desc");
        setCurrentPage(1); // Resetar para primeira página
    };

    // Funções de navegação da paginação
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Gerar números das páginas para navegação
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const start = Math.max(1, currentPage - 2);
            const end = Math.min(totalPages, currentPage + 2);
            
            if (start > 1) {
                pages.push(1);
                if (start > 2) pages.push("...");
            }
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            if (end < totalPages) {
                if (end < totalPages - 1) pages.push("...");
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    // Todas as funções originais mantidas...
    const handleVerificarDocumentos = (anunciante) => {
        const documentStatus = anunciante?.documents?.[0]?.documentStatus ?? "PENDING";

        const atualizarStatusDocumento = (novoStatus) => {
            setAnunciantes((prev) =>
                prev.map((item) =>
                    item.id === anunciante.id ? { ...item, documentStatus: novoStatus } : item
                )
            );
            setDocumentStatusModal(novoStatus);
        };

        setDocumentStatusModal(documentStatus);

        setModal({
            isOpen: true,
            content: (
                <ModalVerificarDocumentos
                    anunciante={anunciante}
                    documentStatus={documentStatus}
                    atualizarStatusDocumento={atualizarStatusDocumento}
                    userToken={userToken}
                    onClose={() => setModal({ isOpen: false, content: null })}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setDocumentStatusModal={setDocumentStatusModal}
                />
            ),
        });
    };

    const handleAtivarDesativar = (anunciante) => {
        const atualizarStatusPerfil = (novoStatus) => {
            setAnunciantes((prev) =>
                prev.map((item) =>
                    item.id === anunciante.id ? { ...item, profileStatus: novoStatus } : item
                )
            );
            setModal({ isOpen: false, content: null });
        };

        const aprovarPerfil = async () => {
            try {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/companion/${anunciante.id}/approve`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                );
                toast.success("Perfil aprovado com sucesso!");
                atualizarStatusPerfil("ACTIVE");
                atualizarStatusMedia(anunciante.id, "APPROVED");
            } catch (error) {
                console.error("Erro ao aprovar perfil");
                toast.error("Erro ao aprovar perfil.");
            }
        };

        const rejeitarPerfil = async () => {
            try {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/companion/${anunciante.id}/reject`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                );
                toast.success("Perfil rejeitado com sucesso!");
                atualizarStatusPerfil("REJECTED");
                atualizarStatusMedia(anunciante.id, "REJECTED");
            } catch (error) {
                console.error("Erro ao rejeitar perfil:", error.response?.data || error.message);
                toast.error("Erro ao rejeitar perfil.");
            }
        };

        const suspenderPerfil = async () => {
            try {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/companion/${anunciante.id}/suspend`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                );
                toast.success("Perfil suspenso com sucesso!");
                atualizarStatusPerfil("SUSPENDED");
                atualizarStatusMedia(anunciante.id, "SUSPENDED");
            } catch (error) {
                console.error("Erro ao suspender perfil:", error.response?.data || error.message);
                toast.error("Erro ao suspender perfil.");
            }
        };

        setModal({
            isOpen: true,
            content: (
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {anunciante.profileStatus === "ACTIVE" ? "Desativar" : "Ativar"} Perfil
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Deseja {anunciante.profileStatus === "ACTIVE" ? "desativar" : "ativar"} o perfil de <strong>{anunciante.name}</strong>?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        {anunciante.profileStatus === "ACTIVE" && (
                            <>
                                <motion.button
                                    onClick={rejeitarPerfil}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isLoading}
                                >
                                    Rejeitar
                                </motion.button>
                                <motion.button
                                    onClick={suspenderPerfil}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isLoading}
                                >
                                    Suspender
                                </motion.button>
                            </>
                        )}
                        {anunciante.profileStatus !== "ACTIVE" && (
                            <motion.button
                                onClick={aprovarPerfil}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                            >
                                Ativar
                            </motion.button>
                        )}
                    </div>
                </div>
            ),
        });
    };

    // Mantendo todas as outras funções originais...
    const handleSalvarPlanoBasico = async (
        anuncianteId,
        selectedPlano,
        userToken,
        anunciantePlanId,
        setModal
    ) => {
        if (selectedPlano === null || isNaN(selectedPlano)) {
            toast.error("Selecione um plano válido.");
            return;
        }

        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/companion/${anuncianteId}/update-plan`,
                { planId: Number(selectedPlano) },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            toast.success("Plano básico atualizado com sucesso!");

            const updatedPlan = planos.find((p) => p.id === Number(selectedPlano));
            setAnunciantes((prev) =>
                prev.map((a) =>
                    a.id === anuncianteId ? { ...a, plan: updatedPlan } : a
                )
            );

            setModal({ isOpen: false, content: null });
        } catch (err) {
            console.error("Erro ao salvar plano básico:", err);
            toast.error("Erro ao atualizar o plano básico.");
        }
    };

    const handleSalvarPlanoExtra = async (
        anunciante,
        anuncianteId,
        selectedPlanoExtra,
        userToken,
        setModal
    ) => {
        try {
            const extrasOriginais = anunciante.subscriptions?.map(sub => sub.extraPlan?.id) || [];
            const novos = new Set(selectedPlanoExtra);
            const antigos = new Set(extrasOriginais);
            const extrasParaAdicionar = [...novos].filter(id => !antigos.has(id));
            const extrasParaRemover = [...antigos].filter(id => !novos.has(id));

            for (const extraId of extrasParaAdicionar) {
                await axios.put(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/companion/${anuncianteId}/update-extrasPlan`,
                    { extraPlanId: extraId, isChecked: true },
                    { headers: { Authorization: `Bearer ${userToken}` } }
                );
            }

            for (const extraId of extrasParaRemover) {
                await axios.put(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/companion/${anuncianteId}/update-extrasPlan`,
                    { extraPlanId: extraId, isChecked: false },
                    { headers: { Authorization: `Bearer ${userToken}` } }
                );
            }

            toast.success("Planos extras atualizados com sucesso!");

            const novosExtras = planosExtras.filter(p => selectedPlanoExtra.includes(p.id));

            setAnunciantes((prev) =>
                prev.map((a) =>
                    a.id === anuncianteId
                        ? {
                            ...a,
                            subscriptions: novosExtras.map((extra) => ({
                                extraPlan: extra,
                            })),
                        }
                        : a
                )
            );

            anunciante.subscriptions = novosExtras.map((extra) => ({
                extraPlan: extra,
            }));

            setModal({ isOpen: false, content: null });

        } catch (err) {
            console.error("Erro ao salvar planos extras:", err);
            toast.error("Erro ao atualizar os planos extras.");
        }
    };

    const handleEditarPlano = (anunciante) => {
        setModal({
            isOpen: true,
            content: (
                <ModalEditarPlano
                    anunciante={anunciante}
                    planos={planos}
                    planosExtras={planosExtras}
                    userToken={userToken}
                    onClose={() => setModal({ isOpen: false, content: null })}
                    onSalvarPlanoBasico={handleSalvarPlanoBasico}
                    onSalvarPlanoExtra={handleSalvarPlanoExtra}
                />
            )
        });
    };

    // Mantendo todas as outras funções... (handleMonitorarPostagens, handleReportarConteudo, etc.)
    const handleMonitorarPostagens = async (anunciante) => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/companion/${anunciante.id}/posts`,
                {
                    headers: { Authorization: `Bearer ${userToken}` },
                }
            );

            const posts = response.data;

            setModal({
                isOpen: true,
                content: (
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Monitorar Postagens</h2>
                        <p className="text-gray-600 mb-4">Postagens de <strong>{anunciante.name}</strong>:</p>
                        <div className="max-h-60 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <div key={post.id} className="p-3 border-b bg-white shadow-sm rounded-lg mb-2">
                                        <p className="font-semibold text-gray-900">{post.title || "Sem título"}</p>
                                        <p className="text-sm text-gray-600">{post.description}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Criado em: {new Date(post.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">Nenhuma postagem encontrada.</p>
                            )}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <motion.button
                                onClick={() => setModal({ isOpen: false, content: null })}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Fechar
                            </motion.button>
                        </div>
                    </div>
                ),
            });

        } catch (error) {
            console.error("Erro ao buscar postagens:", error);
            setModal({
                isOpen: true,
                content: (
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Monitorar Postagens</h2>
                        <p className="text-gray-600 mb-4">Postagens de <strong>{anunciante.name}</strong>:</p>
                        <div className="max-h-60 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                            <p className="text-gray-500 text-center py-4">Não foi possível carregar as postagens. Tente novamente mais tarde.</p>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <motion.button
                                onClick={() => setModal({ isOpen: false, content: null })}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Fechar
                            </motion.button>
                        </div>
                    </div>
                ),
            });
        }
    };

    const handleReportarConteudo = (anunciante) => {
        setModal({
            isOpen: true,
            content: (
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Reportar Conteúdo Indevido</h2>
                    <p className="text-gray-600 mb-6">Reportando conteúdo indevido de <strong>{anunciante.name}</strong>.</p>
                    <div className="flex justify-end">
                        <motion.button
                            onClick={() => setModal({ isOpen: false, content: null })}
                            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Fechar
                        </motion.button>
                    </div>
                </div>
            ),
        });
    };

    const handleVerHistorico = async (anunciante) => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/companion/${anunciante.id}/activity`,
                {
                    headers: { Authorization: `Bearer ${userToken}` },
                }
            );

            const history = response.data;

            setModal({
                isOpen: true,
                content: (
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Histórico de Atividades</h2>
                        <p className="text-gray-600 mb-4">Visualizando histórico de <strong>{anunciante.name}</strong>:</p>

                        <div className="max-h-60 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                            {history.length > 0 ? (
                                history.map((event, index) => (
                                    <div key={index} className="p-3 border-b bg-white shadow-sm rounded-lg mb-2">
                                        <p className="text-sm text-gray-900 font-semibold">{event.action}</p>
                                        <p className="text-xs text-gray-600">{event.details}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Data: {new Date(event.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">Nenhuma atividade encontrada.</p>
                            )}
                        </div>

                        <div className="flex justify-end mt-4">
                            <motion.button
                                onClick={() => setModal({ isOpen: false, content: null })}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Fechar
                            </motion.button>
                        </div>
                    </div>
                ),
            });

        } catch (error) {
            console.error("Erro ao buscar histórico de atividades:", error);
            setModal({
                isOpen: true,
                content: (
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Histórico de Atividades</h2>
                        <p className="text-gray-600 mb-4">Visualizando histórico de <strong>{anunciante.name}</strong>:</p>

                        <div className="max-h-60 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                            <p className="text-gray-500 text-center py-4">Não foi possível carregar o histórico. Tente novamente mais tarde.</p>
                        </div>

                        <div className="flex justify-end mt-4">
                            <motion.button
                                onClick={() => setModal({ isOpen: false, content: null })}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Fechar
                            </motion.button>
                        </div>
                    </div>
                ),
            });
        }
    };

    const handleDeletarAnunciante = (anunciante) => {
        const confirmarExclusao = async (id) => {
            try {
                await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/companion/deletar/${id}`, {
                    headers: { Authorization: `Bearer ${userToken}` },
                });
                toast.success("Anunciante excluído com sucesso!");
                setAnunciantes(prev => prev.filter(a => a.id !== id));
                setModal({ isOpen: false, content: null });
            } catch (error) {
                console.error("Erro ao excluir anunciante:", error);
                toast.error("Erro ao excluir anunciante.");
            }
        };

        setModal({
            isOpen: true,
            content: (
                <div className="p-6">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Excluir Anunciante</h2>
                    <p className="text-gray-700 mb-6">
                        Tem certeza que deseja <strong>excluir</strong> o perfil de <strong>{anunciante.name}</strong>?<br />
                        Essa ação é <span className="text-red-500 font-bold">irreversível</span>!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <motion.button
                            onClick={() => confirmarExclusao(anunciante.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Confirmar Exclusão
                        </motion.button>
                        <motion.button
                            onClick={() => setModal({ isOpen: false, content: null })}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancelar
                        </motion.button>
                    </div>
                </div>
            ),
        });
    };

    const atualizarStatusMedia = (id, newStatus) => {
        setAnunciantes((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        media: {
                            ...item.media,
                            status: newStatus,
                        },
                    }
                    : item
            )
        );
    };

    const handleAprovarRejeitarVideo = (anunciante) => {
        setModal({
            isOpen: true,
            content: (
                <ModalVerificarVideo
                    anunciante={anunciante}
                    userToken={userToken}
                    atualizarStatusMedia={atualizarStatusMedia}
                    onClose={() => setModal({ isOpen: false, content: null })}
                />
            )
        });
    };

    const handleVerDetalhesAnunciante = async (anunciante) => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/companion/${anunciante.id}/detalhes`,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            const dados = response.data;

            setModal({
                isOpen: true,
                content: (
                    <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-xl text-sm overflow-y-auto max-h-[90vh]">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FaUser className="text-pink-500" /> Perfil Detalhado da Acompanhante
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Dados da Usuária */}
                            <section className="bg-gray-50 rounded-xl p-4">
                                <h3 className="text-lg font-semibold text-pink-500 mb-3 flex items-center gap-2">
                                    <FaUser /> Dados da Usuária
                                </h3>
                                <div className="space-y-2 text-gray-700 text-sm">
                                    <div><strong>ID:</strong> {dados.user?.id}</div>
                                    <div><strong>Nome:</strong> {dados.user?.firstName} {dados.user?.lastName}</div>
                                    <div><strong>Email:</strong> {dados.user?.email}</div>
                                    <div><strong>CPF:</strong> {dados.user?.cpf}</div>
                                    <div><strong>Nascimento:</strong> {dados.user?.birthDate && new Date(dados.user.birthDate).toLocaleDateString()}</div>
                                    <div><strong>Tipo:</strong> {dados.user?.userType}</div>
                                    <div><strong>Visível:</strong> {dados.user?.profileVisibility ? "Sim" : "Não"}</div>
                                    <div><strong>Criado:</strong> {new Date(dados.user?.createdAt).toLocaleString()}</div>
                                </div>
                            </section>

                            {/* Status e Local */}
                            <section className="bg-gray-50 rounded-xl p-4">
                                <h3 className="text-lg font-semibold text-pink-500 mb-3 flex items-center gap-2">
                                    <FaShieldAlt /> Plano e Status
                                </h3>
                                <div className="space-y-2 text-gray-700 text-sm">
                                    <div><strong>Plano:</strong> {dados.plan?.name || "Sem plano"}</div>
                                    <div><strong>Status do Perfil:</strong> 
                                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                            dados.profileStatus === "ACTIVE" ? "bg-green-100 text-green-800" :
                                            dados.profileStatus === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                                            "bg-red-100 text-red-800"
                                        }`}>
                                            {dados.profileStatus}
                                        </span>
                                    </div>
                                    <div><strong>Status Documento:</strong> 
                                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                            dados.documentStatus === "APPROVED" ? "bg-green-100 text-green-800" :
                                            dados.documentStatus === "IN_ANALYSIS" ? "bg-orange-100 text-orange-800" :
                                            "bg-yellow-100 text-yellow-800"
                                        }`}>
                                            {dados.documentStatus}
                                        </span>
                                    </div>
                                    <div><strong>Status da Mídia:</strong> 
                                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                            dados.media?.[0]?.status === "APPROVED" ? "bg-green-100 text-green-800" :
                                            dados.media?.[0]?.status === "IN_ANALYSIS" ? "bg-orange-100 text-orange-800" :
                                            "bg-gray-100 text-gray-800"
                                        }`}>
                                            {dados.media?.[0]?.status || "Sem mídia"}
                                        </span>
                                    </div>
                                    <div><strong>Localização:</strong> <FaMapMarkerAlt className="inline mr-1 text-gray-400" /> {dados.city} / {dados.state}</div>
                                </div>
                            </section>

                            {/* Descrição */}
                            <section className="bg-gray-50 rounded-xl p-4 lg:col-span-2">
                                <h3 className="text-lg font-semibold text-pink-500 mb-3">Descrição</h3>
                                <p className="text-gray-700 text-sm whitespace-pre-line">{dados.description || "Não informada"}</p>
                            </section>

                            {/* Contato */}
                            <section className="bg-gray-50 rounded-xl p-4">
                                <h3 className="text-lg font-semibold text-pink-500 mb-3">Contato</h3>
                                {dados.contactMethods?.length > 0 ? (
                                    <div className="space-y-2 text-sm text-gray-700">
                                        {dados.contactMethods.map((c, i) => (
                                            <div key={i} className="space-y-1">
                                                <div><strong>WhatsApp:</strong> {c.whatsappNumber || "—"} ({c.whatsappCountryCode || "—"})</div>
                                                <div><strong>Telegram:</strong> {c.telegramUsername || "—"}</div>
                                                <div><strong>Telefone:</strong> {c.phoneNumber || "—"} ({c.phoneCountryCode || "—"})</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">Nenhum contato cadastrado.</p>
                                )}
                            </section>

                            {/* Físico */}
                            <section className="bg-gray-50 rounded-xl p-4">
                                <h3 className="text-lg font-semibold text-pink-500 mb-3">Características Físicas</h3>
                                <div className="space-y-2 text-gray-700 text-sm">
                                    <div><FaWeight className="inline mr-1 text-gray-400" /> <strong>Peso:</strong> {dados.PhysicalCharacteristics?.weight || "N/A"} kg</div>
                                    <div><FaRuler className="inline mr-1 text-gray-400" /> <strong>Altura:</strong> {dados.PhysicalCharacteristics?.height || "N/A"} cm</div>
                                    <div><strong>Etnia:</strong> {dados.PhysicalCharacteristics?.ethnicity || "N/A"}</div>
                                    <div><strong>Silicone:</strong> {dados.PhysicalCharacteristics?.hasSilicone ? "Sim" : "Não"}</div>
                                    <div><strong>Tatuagens:</strong> {dados.PhysicalCharacteristics?.hasTattoos ? "Sim" : "Não"}</div>
                                </div>
                            </section>

                            {/* Serviços */}
                            <section className="bg-gray-50 rounded-xl p-4 lg:col-span-2">
                                <h3 className="text-lg font-semibold text-pink-500 mb-3">Serviços Oferecidos</h3>
                                {dados.servicesOffered?.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                                        {dados.servicesOffered.map((s) => (
                                            <div key={s.id} className="bg-white p-2 rounded border">
                                                <strong>{s.service.name}</strong> - R$ {s.price?.toFixed(2) || "N/A"}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">Nenhum serviço informado.</p>
                                )}
                            </section>

                            {/* Extras */}
                            <section className="bg-gray-50 rounded-xl p-4 lg:col-span-2">
                                <h3 className="text-lg font-semibold text-pink-500 mb-3">Estatísticas</h3>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="bg-white p-3 rounded">
                                        <FaFileAlt className="mx-auto text-blue-500 mb-1" />
                                        <div className="text-lg font-bold text-gray-800">{dados.Story?.length || 0}</div>
                                        <div className="text-xs text-gray-600">Stories</div>
                                    </div>
                                    <div className="bg-white p-3 rounded">
                                        <FaFileAlt className="mx-auto text-green-500 mb-1" />
                                        <div className="text-lg font-bold text-gray-800">{dados.documents?.length || 0}</div>
                                        <div className="text-xs text-gray-600">Documentos</div>
                                    </div>
                                    <div className="bg-white p-3 rounded">
                                        <FaStar className="mx-auto text-yellow-500 mb-1" />
                                        <div className="text-lg font-bold text-gray-800">{dados.reviews?.length || 0}</div>
                                        <div className="text-xs text-gray-600">Reviews</div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="flex justify-end mt-6">
                            <motion.button
                                onClick={() => setModal({ isOpen: false, content: null })}
                                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Fechar
                            </motion.button>
                        </div>
                    </div>
                )
            });

        } catch (error) {
            console.error("Erro ao buscar detalhes:", error);
            toast.error("Erro ao buscar detalhes da anunciante.");
        }
    };

    // Estatísticas
    const stats = {
        total: anunciantes.length,
        ativos: anunciantes.filter(a => a.profileStatus === "ACTIVE").length,
        pendentes: anunciantes.filter(a => a.profileStatus === "PENDING").length,
        suspensos: anunciantes.filter(a => a.profileStatus === "SUSPENDED").length
    };

    // Render do componente de paginação
    const renderPaginacao = () => (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-4">
            <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                Mostrando {startIndex + 1} a {Math.min(endIndex, anunciantesFiltrados.length)} de {anunciantesFiltrados.length} anunciantes
            </div>
            
            {totalPages > 1 && (
                <div className="flex items-center space-x-2">
                    <motion.button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg ${
                            currentPage === 1 
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                                : "bg-white text-gray-700 hover:bg-gray-100"
                        } border shadow-sm`}
                        whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                        whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                    >
                        <FaChevronLeft size={14} />
                    </motion.button>

                    <div className="flex space-x-1">
                        {getPageNumbers().map((page, index) => (
                            <React.Fragment key={index}>
                                {page === "..." ? (
                                    <span className="px-3 py-2 text-gray-500">...</span>
                                ) : (
                                    <motion.button
                                        onClick={() => goToPage(page)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                            currentPage === page
                                                ? "bg-pink-500 text-white"
                                                : "bg-white text-gray-700 hover:bg-gray-100"
                                        } border shadow-sm`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {page}
                                    </motion.button>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <motion.button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg ${
                            currentPage === totalPages 
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                                : "bg-white text-gray-700 hover:bg-gray-100"
                        } border shadow-sm`}
                        whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                        whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                    >
                        <FaChevronRight size={14} />
                    </motion.button>
                </div>
            )}
        </div>
    );

    // Render para desktop (tabela)
    const renderDesktopTable = () => (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="min-w-full">
                <thead className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                    <tr>
                        <th className="py-4 px-6 text-left font-semibold">
                            <div className="flex items-center gap-2">
                                Nome
                                <motion.button
                                    onClick={toggleSortOrder}
                                    className="text-white hover:text-gray-200"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {sortOrder === "desc" ? <FaSortDown /> : <FaSortUp />}
                                </motion.button>
                            </div>
                        </th>
                        <th className="py-4 px-6 text-left font-semibold">Plano</th>
                        <th className="py-4 px-6 text-left font-semibold">Status</th>
                        <th className="py-4 px-6 text-left font-semibold">Documentos</th>
                        <th className="py-4 px-6 text-left font-semibold">Mídia</th>
                        <th className="py-4 px-6 text-left font-semibold">Data de Chegada</th>
                        <th className="py-4 px-6 text-center font-semibold">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="7" className="py-8 text-center">
                                <div className="flex justify-center items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                                    <span className="ml-2 text-gray-600">Carregando...</span>
                                </div>
                            </td>
                        </tr>
                    ) : anunciantesPaginados.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="py-8 text-center text-gray-500">
                                Nenhum anunciante encontrado
                            </td>
                        </tr>
                    ) : (
                        anunciantesPaginados.map((anunciante, index) => (
                            <motion.tr
                                key={anunciante.id}
                                onClick={() => handleVerDetalhesAnunciante(anunciante)}
                                className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ backgroundColor: "#f9fafb" }}
                            >
                                <td className="py-4 px-6 font-medium text-gray-900">{anunciante.name}</td>
                                <td className="py-4 px-6 text-gray-700">{anunciante.plan?.name}</td>
                                <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        anunciante.profileStatus === "ACTIVE" ? "bg-green-100 text-green-800" :
                                        anunciante.profileStatus === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                                        anunciante.profileStatus === "IN_ANALYSIS" ? "bg-orange-100 text-orange-800" :
                                        anunciante.profileStatus === "SUSPENDED" ? "bg-gray-100 text-gray-800" :
                                        "bg-red-100 text-red-800"
                                    }`}>
                                        {anunciante.profileStatus === "ACTIVE" ? "Ativo" :
                                         anunciante.profileStatus === "PENDING" ? "Pendente" :
                                         anunciante.profileStatus === "IN_ANALYSIS" ? "Em Análise" :
                                         anunciante.profileStatus === "SUSPENDED" ? "Suspenso" : "Rejeitado"}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        anunciante.documentStatus === "APPROVED" ? "bg-green-100 text-green-800" :
                                        anunciante.documentStatus === "IN_ANALYSIS" ? "bg-orange-100 text-orange-800" :
                                        anunciante.documentStatus === "REJECTED" ? "bg-red-100 text-red-800" :
                                        "bg-yellow-100 text-yellow-800"
                                    }`}>
                                        {anunciante.documentStatus === "APPROVED" ? "Verificado" :
                                         anunciante.documentStatus === "REJECTED" ? "Rejeitado" :
                                         anunciante.documentStatus === "IN_ANALYSIS" ? "Em Análise" : "Pendente"}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        anunciante.media?.status === "APPROVED" ? "bg-green-100 text-green-800" :
                                        anunciante.media?.status === "IN_ANALYSIS" ? "bg-orange-100 text-orange-800" :
                                        anunciante.media?.status === "REJECTED" ? "bg-red-100 text-red-800" :
                                        "bg-gray-100 text-gray-800"
                                    }`}>
                                        {anunciante.media?.status === "APPROVED" ? "Vídeo Aprovado" :
                                         anunciante.media?.status === "IN_ANALYSIS" ? "Vídeo em Análise" :
                                         anunciante.media?.status === "REJECTED" ? "Vídeo Rejeitado" : "Sem Vídeo"}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-gray-600 text-sm">
                                    {new Date(anunciante.createdAt || anunciante.user?.createdAt).toLocaleDateString("pt-BR")}
                                </td>
                                <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex justify-center space-x-2">
                                        {anunciante.documentStatus && (
                                            <Tooltip content="Verificar Documentos">
                                                <motion.button
                                                    onClick={() => handleVerificarDocumentos(anunciante)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <FaFileAlt size={16} />
                                                </motion.button>
                                            </Tooltip>
                                        )}

                                        <Tooltip content={anunciante.profileStatus === "ACTIVE" ? "Suspender Perfil" : "Ativar Perfil"}>
                                            <motion.button
                                                onClick={() => handleAtivarDesativar(anunciante)}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    anunciante.profileStatus === "ACTIVE"
                                                        ? "text-yellow-600 hover:bg-yellow-100"
                                                        : "text-green-600 hover:bg-green-100"
                                                }`}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                {anunciante.profileStatus === "ACTIVE" ? <FaBan size={16} /> : <FaCheck size={16} />}
                                            </motion.button>
                                        </Tooltip>

                                        <Tooltip content="Aprovar/Rejeitar Vídeo">
                                            <motion.button
                                                onClick={() => handleAprovarRejeitarVideo(anunciante)}
                                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FaVideo size={16} />
                                            </motion.button>
                                        </Tooltip>

                                        <Tooltip content="Editar Plano">
                                            <motion.button
                                                onClick={() => handleEditarPlano(anunciante)}
                                                className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FaEdit size={16} />
                                            </motion.button>
                                        </Tooltip>

                                        <Tooltip content="Monitorar Postagens">
                                            <motion.button
                                                onClick={() => handleMonitorarPostagens(anunciante)}
                                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FaEye size={16} />
                                            </motion.button>
                                        </Tooltip>

                                        <Tooltip content="Reportar Conteúdo Indevido">
                                            <motion.button
                                                onClick={() => handleReportarConteudo(anunciante)}
                                                className="p-2 text-pink-500 hover:bg-pink-100 rounded-lg transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FaFlag size={16} />
                                            </motion.button>
                                        </Tooltip>

                                        <Tooltip content="Ver Histórico">
                                            <motion.button
                                                onClick={() => handleVerHistorico(anunciante)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FaHistory size={16} />
                                            </motion.button>
                                        </Tooltip>

                                        <Tooltip content="Excluir Anunciante">
                                            <motion.button
                                                onClick={() => handleDeletarAnunciante(anunciante)}
                                                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FaTrash size={16} />
                                            </motion.button>
                                        </Tooltip>
                                    </div>
                                </td>
                            </motion.tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    // Render para mobile (cards)
    const renderMobileCards = () => (
        <div className="space-y-4">
            {isLoading ? (
                <div className="text-center py-8">
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                        <span className="ml-2 text-gray-600">Carregando...</span>
                    </div>
                </div>
            ) : anunciantesPaginados.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    Nenhum anunciante encontrado
                </div>
            ) : (
                anunciantesPaginados.map((anunciante, index) => (
                    <motion.div
                        key={anunciante.id}
                        className="bg-white rounded-xl shadow-lg p-4 border border-gray-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleVerDetalhesAnunciante(anunciante)}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{anunciante.name}</h3>
                                <p className="text-gray-600 text-sm">{anunciante.plan?.name}</p>
                                <p className="text-gray-500 text-xs">
                                    Chegada: {new Date(anunciante.createdAt || anunciante.user?.createdAt).toLocaleDateString("pt-BR")}
                                </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                anunciante.profileStatus === "ACTIVE" ? "bg-green-100 text-green-800" :
                                anunciante.profileStatus === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"
                            }`}>
                                {anunciante.profileStatus === "ACTIVE" ? "Ativo" :
                                 anunciante.profileStatus === "PENDING" ? "Pendente" : "Inativo"}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Documentos</p>
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    anunciante.documentStatus === "APPROVED" ? "bg-green-100 text-green-800" :
                                    anunciante.documentStatus === "IN_ANALYSIS" ? "bg-orange-100 text-orange-800" :
                                    "bg-yellow-100 text-yellow-800"
                                }`}>
                                    {anunciante.documentStatus === "APPROVED" ? "Verificado" :
                                     anunciante.documentStatus === "IN_ANALYSIS" ? "Em Análise" : "Pendente"}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Mídia</p>
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    anunciante.media?.status === "APPROVED" ? "bg-green-100 text-green-800" :
                                    anunciante.media?.status === "IN_ANALYSIS" ? "bg-orange-100 text-orange-800" :
                                    "bg-gray-100 text-gray-800"
                                }`}>
                                    {anunciante.media?.status === "APPROVED" ? "Aprovado" :
                                     anunciante.media?.status === "IN_ANALYSIS" ? "Análise" : "Sem Vídeo"}
                                </span>
                            </div>
                        </div>

                        {/* Ações Mobile */}
                        <div className="grid grid-cols-4 gap-2" onClick={(e) => e.stopPropagation()}>
                            <motion.button
                                onClick={() => handleVerificarDocumentos(anunciante)}
                                className="p-3 bg-blue-100 text-blue-600 rounded-lg text-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaFileAlt className="mx-auto mb-1" />
                                <span className="text-xs block">Docs</span>
                            </motion.button>

                            <motion.button
                                onClick={() => handleAtivarDesativar(anunciante)}
                                className={`p-3 rounded-lg text-center ${
                                    anunciante.profileStatus === "ACTIVE"
                                        ? "bg-yellow-100 text-yellow-600"
                                        : "bg-green-100 text-green-600"
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {anunciante.profileStatus === "ACTIVE" ? <FaBan className="mx-auto mb-1" /> : <FaCheck className="mx-auto mb-1" />}
                                <span className="text-xs block">{anunciante.profileStatus === "ACTIVE" ? "Suspender" : "Ativar"}</span>
                            </motion.button>

                            <motion.button
                                onClick={() => handleEditarPlano(anunciante)}
                                className="p-3 bg-purple-100 text-purple-600 rounded-lg text-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaEdit className="mx-auto mb-1" />
                                <span className="text-xs block">Plano</span>
                            </motion.button>

                            <motion.button
                                onClick={() => handleAprovarRejeitarVideo(anunciante)}
                                className="p-3 bg-green-100 text-green-600 rounded-lg text-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaVideo className="mx-auto mb-1" />
                                <span className="text-xs block">Vídeo</span>
                            </motion.button>
                        </div>
                    </motion.div>
                ))
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-6">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                            Gerenciamento de Anunciantes
                        </h1>
                        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                            Painel completo para administração de perfis, documentos, planos e atividades dos anunciantes
                        </p>
                    </div>

                    {/* Estatísticas */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        <motion.div
                            className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                                </div>
                                <FaUsers className="text-gray-500 text-2xl" />
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Ativos</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.ativos}</p>
                                </div>
                                <FaCheck className="text-green-500 text-2xl" />
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Pendentes</p>
                                    <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
                                </div>
                                <FaCog className="text-yellow-500 text-2xl" />
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Suspensos</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.suspensos}</p>
                                </div>
                                <FaBan className="text-red-500 text-2xl" />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Filtros e Ordenação */}
                <motion.div
                    className="bg-white rounded-xl p-4 sm:p-6 shadow-lg mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <h3 className="text-lg font-semibold text-gray-800">Filtrar por Status</h3>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { key: "todos", label: "Todos", color: "gray" },
                                    { key: "ACTIVE", label: "Ativos", color: "green" },
                                    { key: "PENDING", label: "Pendentes", color: "yellow" },
                                    { key: "SUSPENDED", label: "Suspensos", color: "red" }
                                ].map(filtro => (
                                    <motion.button
                                        key={filtro.key}
                                        onClick={() => setFiltroStatus(filtro.key)}
                                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                            filtroStatus === filtro.key
                                                ? `bg-${filtro.color}-500 text-white`
                                                : `bg-${filtro.color}-100 text-${filtro.color}-700 hover:bg-${filtro.color}-200`
                                        }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {filtro.label}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Ordenar por chegada:</span>
                            <motion.button
                                onClick={toggleSortOrder}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                                    sortOrder === "desc" 
                                        ? "bg-blue-500 text-white" 
                                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {sortOrder === "desc" ? <FaSortDown /> : <FaSortUp />}
                                {sortOrder === "desc" ? "Mais Recentes" : "Mais Antigos"}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Legenda de Ações */}
                <motion.div
                    className="bg-white rounded-xl p-4 sm:p-6 shadow-lg mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="font-semibold mb-4 text-lg text-gray-800">🔧 Ações Disponíveis</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-sm">
                        {[
                            { icon: FaFileAlt, label: "Verificar Documentos", color: "blue" },
                            { icon: FaCheck, label: "Aprovar/Ativar", color: "green" },
                            { icon: FaBan, label: "Suspender", color: "yellow" },
                            { icon: FaVideo, label: "Aprovar Vídeo", color: "green" },
                            { icon: FaEdit, label: "Editar Plano", color: "purple" },
                            { icon: FaEye, label: "Monitorar Posts", color: "gray" },
                            { icon: FaFlag, label: "Reportar", color: "pink" },
                            { icon: FaTrash, label: "Excluir", color: "red" }
                        ].map((acao, i) => (
                            <div key={i} className="flex flex-col items-center text-center">
                                <acao.icon className={`text-${acao.color}-600 mb-1`} />
                                <span className="text-xs text-gray-600">{acao.label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Lista de Anunciantes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {isMobile ? renderMobileCards() : renderDesktopTable()}
                </motion.div>

                {/* Paginação */}
                {anunciantesFiltrados.length > 0 && renderPaginacao()}

                {/* Modal */}
                <AnimatePresence>
                    {modal.isOpen && (
                        <Modal onClose={() => setModal({ isOpen: false, content: null })}>
                            {modal.content}
                        </Modal>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Anunciantes;