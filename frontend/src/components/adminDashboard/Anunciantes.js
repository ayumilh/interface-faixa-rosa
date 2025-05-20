import React, { useState, useEffect } from "react";
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
    FaStar
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
    const userToken = Cookies.get("userToken");

    useEffect(() => {
        const fetchAnunciantes = async () => {
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
            }
        };

        fetchAnunciantes();
    }, [userToken]);

    // documentos
    const [documentStatusModal, setDocumentStatusModal] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // MODAL VERIFICAR DOCUMENTOS
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



    // Atualizar status do perfil
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
                <>
                    <h2 className="text-xl font-semibold">
                        {anunciante.profileStatus === "ACTIVE" ? "Desativar" : "Ativar"} Perfil
                    </h2>
                    <p>
                        Deseja {anunciante.profileStatus === "ACTIVE" ? "desativar" : "ativar"} o perfil de <strong>{anunciante.name}</strong>?
                    </p>
                    <div className="mt-4 flex justify-end space-x-2">
                        {anunciante.profileStatus === "ACTIVE" && (
                            <>
                                <button
                                    onClick={rejeitarPerfil}
                                    className={`px-4 py-2 bg-red-600 text-white rounded ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    Rejeitar
                                </button>
                                <button
                                    onClick={suspenderPerfil}
                                    className={`px-4 py-2 bg-yellow-600 text-white rounded ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    Suspender
                                </button>
                            </>
                        )}
                        {anunciante.profileStatus !== "ACTIVE" && (
                            <button
                                onClick={aprovarPerfil}
                                className={`px-4 py-2 bg-green-600 text-white rounded ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                Ativar
                            </button>
                        )}
                    </div>
                </>
            ),
        });
    };



    const [planos, setPlanos] = useState([]);
    const [planosExtras, setPlanosExtras] = useState([]);

    // Carregar planos e planos extras
    useEffect(() => {
        const fetchPlanos = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/plans`,
                );
                const planosData = response.data;
                setPlanos(planosData.filter(plano => plano.isBasic)); // Filtra os planos básicos
                setPlanosExtras(planosData.filter(plano => !plano.isBasic)); // Filtra os planos extras
            } catch (error) {
                console.error("Erro ao carregar planos:", error);
            }
        };

        fetchPlanos();
    }, []);

    // MODAL EDITAR PLANOS
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

            // Atualiza no backend
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

            // ✅ Atualiza o estado do anunciante com os planos atualizados
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

            // ✅ Força reatribuição para o componente ModalEditarPlano reconhecer os novos valores
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
                    <>
                        <h2 className="text-xl font-semibold">Monitorar Postagens</h2>
                        <p className="mb-2">Postagens de <strong>{anunciante.name}</strong>:</p>
                        <div className="max-h-60 overflow-y-auto border p-2 rounded">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <div key={post.id} className="p-2 border-b bg-white shadow rounded-lg">
                                        <p className="font-semibold text-gray-900">{post.title || "Sem título"}</p>
                                        <p className="text-sm text-gray-600">{post.description}</p>

                                        {/* {post.mediaUrl ? (
                                            <img
                                                src={post.mediaUrl}
                                                alt={`Mídia do post de ${anunciante.name}`}
                                                className="w-full h-auto max-h-40 object-contain mt-2 rounded-lg border"
                                                onError={(e) => {
                                                    console.error("Erro ao carregar a imagem:", e.target.src);
                                                    e.target.style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            )} */}
                                        <p className="text-sm text-gray-500">Nenhuma mídia disponível</p>

                                        <p className="text-xs text-gray-500 mt-2">
                                            Criado em: {new Date(post.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">Nenhuma postagem encontrada.</p>
                            )}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setModal({ isOpen: false, content: null })}
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                                Fechar
                            </button>
                        </div>
                    </>
                ),
            });

        } catch (error) {
            console.error("Erro ao buscar postagens:", error);
            // Exibe uma mensagem de erro suave caso haja falha ao buscar os dados
            setModal({
                isOpen: true,
                content: (
                    <>
                        <h2 className="text-xl font-semibold">Monitorar Postagens</h2>
                        <p className="mb-2">Postagens de <strong>{anunciante.name}</strong>:</p>
                        <div className="max-h-60 overflow-y-auto border p-2 rounded">
                            <p className="text-gray-500">Não foi possível carregar as postagens. Tente novamente mais tarde.</p>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setModal({ isOpen: false, content: null })}
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                                Fechar
                            </button>
                        </div>
                    </>
                ),
            });
        }
    };

    const handleReportarConteudo = (anunciante) => {
        setModal({
            isOpen: true,
            content: (
                <>
                    <h2 className="text-xl font-semibold">Reportar Conteúdo Indevido</h2>
                    <p>Reportando conteúdo indevido de <strong>{anunciante.name}</strong>.</p>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => setModal({ isOpen: false, content: null })}
                            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                        >
                            Fechar
                        </button>
                    </div>
                </>
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
                    <>
                        <h2 className="text-xl font-semibold">Histórico de Atividades</h2>
                        <p className="mb-2">Visualizando histórico de <strong>{anunciante.name}</strong>:</p>

                        <div className="max-h-60 overflow-y-auto border p-2 rounded bg-gray-50">
                            {history.length > 0 ? (
                                history.map((event, index) => (
                                    <div key={index} className="p-2 border-b bg-white shadow rounded-lg">
                                        <p className="text-sm text-gray-900 font-semibold">{event.action}</p>
                                        <p className="text-xs text-gray-600">{event.details}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Data: {new Date(event.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">Nenhuma atividade encontrada.</p>
                            )}
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setModal({ isOpen: false, content: null })}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Fechar
                            </button>
                        </div>
                    </>
                ),
            });

        } catch (error) {
            console.error("Erro ao buscar histórico de atividades:", error);
            setModal({
                isOpen: true,
                content: (
                    <>
                        <h2 className="text-xl font-semibold">Histórico de Atividades</h2>
                        <p className="mb-2">Visualizando histórico de <strong>{anunciante.name}</strong>:</p>

                        <div className="max-h-60 overflow-y-auto border p-2 rounded bg-gray-50">
                            <p className="text-gray-500">Não foi possível carregar o histórico. Tente novamente mais tarde.</p>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setModal({ isOpen: false, content: null })}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Fechar
                            </button>
                        </div>
                    </>
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
                <>
                    <h2 className="text-xl font-semibold text-red-600">Excluir Anunciante</h2>
                    <p className="text-gray-700 mt-2">
                        Tem certeza que deseja <strong>excluir</strong> o perfil de <strong>{anunciante.name}</strong>?<br />
                        Essa ação é <span className="text-red-500 font-bold">irreversível</span>!
                    </p>
                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            onClick={() => confirmarExclusao(anunciante.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Confirmar Exclusão
                        </button>
                        <button
                            onClick={() => setModal({ isOpen: false, content: null })}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                    </div>
                </>
            ),
        });
    };




    // MODAL VERIFICAR VÍDEO
    const atualizarStatusMedia = (id, newStatus) => {
        setAnunciantes((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        media: {
                            ...item.media,
                            status: newStatus, // preserva o url e altera só o status
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



    // Adicione dentro do componente Anunciantes
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
            console.log("Dados do anunciante:", response.data);
            const dados = response.data;

            setModal({
                isOpen: true,
                content: (
                    <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl text-sm overflow-y-auto max-h-[80vh] relative pr-6 ">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaUser className="text-gray-500" /> Perfil da Acompanhante
                        </h2>

                        {/* Dados da Usuária */}
                        <section className="mb-6 border-b pb-4">
                            <h3 className="text-lg font-semibold text-pink-500 mb-2 flex items-center gap-2">
                                Dados da Usuária
                            </h3>
                            <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
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
                        <section className="mb-6 border-b pb-4">
                            <h3 className="text-lg font-semibold text-pink-500 mb-2 flex items-center gap-2">
                                Plano e Status
                            </h3>
                            <ul className="text-gray-700 text-sm space-y-1">
                                <li><strong>Plano:</strong> {dados.plan?.name || "Sem plano"}</li>
                                <li><strong>Status do Perfil:</strong> {dados.profileStatus}</li>
                                <li><strong>Status Documento:</strong> {dados.documentStatus}</li>
                                <li><strong>Status da Mídia:</strong> {dados.media?.[0]?.status || "Sem mídia"}</li>
                                <li><strong>Localização:</strong> <FaMapMarkerAlt className="inline mr-1 text-gray-400" /> {dados.city} / {dados.state}</li>
                            </ul>
                        </section>

                        {/* Descrição */}
                        <section className="mb-6 border-b pb-4">
                            <h3 className="text-lg font-semibold text-pink-500 mb-2">Descrição</h3>
                            <p className="text-gray-700 text-sm whitespace-pre-line">{dados.description || "Não informada"}</p>
                        </section>

                        {/* Contato */}
                        <section className="mb-6 border-b pb-4">
                            <h3 className="text-lg font-semibold text-pink-500 mb-2 flex items-center gap-2">
                                Contato
                            </h3>
                            {dados.contactMethods?.length > 0 ? (
                                <ul className="text-sm text-gray-700">
                                    {dados.contactMethods.map((c, i) => (
                                        <li key={i}>
                                            WhatsApp: {c.whatsappNumber || "—"} ({c.whatsappCountryCode || "—"})<br />
                                            Telegram: {c.telegramUsername || "—"}<br />
                                            Telefone: {c.phoneNumber || "—"} ({c.phoneCountryCode || "—"})
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">Nenhum contato cadastrado.</p>
                            )}
                        </section>

                        {/* Serviços */}
                        <section className="mb-6 border-b pb-4">
                            <h3 className="text-lg font-semibold text-pink-500 mb-2">Serviços Oferecidos</h3>
                            {dados.servicesOffered?.length > 0 ? (
                                <ul className="grid grid-cols-2 gap-x-6 text-sm text-gray-700 list-disc list-inside">
                                    {dados.servicesOffered.map((s) => (
                                        <li key={s.id}>{s.service.name} - R$ {s.price?.toFixed(2) || "N/A"}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">Nenhum serviço informado.</p>
                            )}
                        </section>

                        {/* Físico */}
                        <section className="mb-6 border-b pb-4">
                            <h3 className="text-lg font-semibold text-pink-500 mb-2">Características Físicas</h3>
                            <div className="text-gray-700 text-sm grid grid-cols-2 gap-2">
                                <div><FaWeight className="inline mr-1 text-gray-400" /> Peso: {dados.PhysicalCharacteristics?.weight || "N/A"} kg</div>
                                <div><FaRuler className="inline mr-1 text-gray-400" /> Altura: {dados.PhysicalCharacteristics?.height || "N/A"} cm</div>
                                <div><strong>Etnia:</strong> {dados.PhysicalCharacteristics?.ethnicity || "N/A"}</div>
                                <div><strong>Silicone:</strong> {dados.PhysicalCharacteristics?.hasSilicone ? "Sim" : "Não"}</div>
                                <div><strong>Tatuagens:</strong> {dados.PhysicalCharacteristics?.hasTattoos ? "Sim" : "Não"}</div>
                            </div>
                        </section>

                        {/* Extras */}
                        <section className="mb-6">
                            <h3 className="text-lg font-semibold text-pink-500 mb-2">Outros Dados</h3>
                            <ul className="text-gray-700 text-sm space-y-1">
                                <li><FaFileAlt className="inline mr-1 text-gray-400" /> Stories Ativos: {dados.Story?.length || 0}</li>
                                <li><FaFileAlt className="inline mr-1 text-gray-400" /> Documentos Enviados: {dados.documents?.length || 0}</li>
                                <li><FaStar className="inline mr-1 text-gray-400" /> Total de Reviews: {dados.reviews?.length || 0}</li>
                            </ul>
                        </section>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setModal({ isOpen: false, content: null })}
                                className="px-5 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                )
            });

        } catch (error) {
            console.error("Erro ao buscar detalhes:", error);
            toast.error("Erro ao buscar detalhes da anunciante.");
        }
    };


    const renderTable = (anunciantes) => {
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white text-sm">
                    <thead>
                        <tr>
                            <th className="py-3 px-4 bg-gray-100 text-left font-semibold text-gray-700">Nome</th>
                            <th className="py-3 px-4 bg-gray-100 text-left font-semibold text-gray-700">Plano</th>
                            <th className="py-3 px-4 bg-gray-100 text-left font-semibold text-gray-700">Status</th>
                            <th className="py-3 px-4 bg-gray-100 text-left font-semibold text-gray-700">Documentos</th>
                            <th className="py-3 px-4 bg-gray-100 text-left font-semibold text-gray-700">Mídia</th>
                            <th className="py-3 px-4 bg-gray-100 text-center font-semibold text-gray-700">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {anunciantes.map((anunciante) => (
                            <tr key={anunciante.id} onClick={() => handleVerDetalhesAnunciante(anunciante)} className="border-b hover:bg-gray-50 cursor-pointer">
                                <td className="py-4 px-4 text-gray-700">{anunciante.name}</td>
                                <td className="py-4 px-4 text-gray-700">{anunciante.plan?.name}</td>
                                <td className="py-4 px-4">
                                    {["ACTIVE", "PENDING", "IN_ANALYSIS", "SUSPENDED", "REJECTED"].includes(anunciante.profileStatus) && (
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold 
            ${anunciante.profileStatus === "ACTIVE"
                                                    ? "bg-green-100 text-green-800" // Verde para status ativo
                                                    : anunciante.profileStatus === "PENDING"
                                                        ? "bg-yellow-100 text-yellow-800" // Amarelo para status pendente
                                                        : anunciante.profileStatus === "IN_ANALYSIS"
                                                            ? "bg-orange-100 text-orange-800" // Laranja para status em análise
                                                            : anunciante.profileStatus === "SUSPENDED"
                                                                ? "bg-gray-100 text-gray-800" // Cinza para status suspenso
                                                                : "bg-red-100 text-red-800" // Vermelho para status rejeitado
                                                }`}
                                        >
                                            {anunciante.profileStatus === "ACTIVE"
                                                ? "Ativo"
                                                : anunciante.profileStatus === "PENDING"
                                                    ? "Pendente"
                                                    : anunciante.profileStatus === "IN_ANALYSIS"
                                                        ? "Em Análise"
                                                        : anunciante.profileStatus === "SUSPENDED"
                                                            ? "Suspenso" // Exibe "Suspenso" para status SUSPENDED
                                                            : "Rejeitado" // Exibe "Rejeitado" para status REJECTED
                                            }
                                        </span>
                                    )}
                                </td>

                                <td className="py-4 px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                        ${anunciante.documentStatus === "APPROVED"
                                            ? "bg-green-100 text-green-800" // Verde para documentos aprovados
                                            : anunciante.documentStatus === "IN_ANALYSIS"
                                                ? "bg-orange-100 text-orange-800" // Laranja para documentos em análise
                                                : anunciante.documentStatus === "REJECTED"
                                                    ? "bg-red-100 text-red-800" // Vermelho para documentos rejeitados
                                                    : "bg-yellow-100 text-yellow-800" // Amarelo para documentos pendentes
                                        }`}>
                                        {anunciante.documentStatus === "APPROVED"
                                            ? "Verificado"
                                            : anunciante.documentStatus === "REJECTED"
                                                ? "Rejeitado"
                                                : anunciante.documentStatus === "IN_ANALYSIS"
                                                    ? "Em Análise" // Texto para "IN_ANALYSIS"
                                                    : "Pendente"
                                        }
                                    </span>

                                </td>
                                <td className="py-4 px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
    ${anunciante.media?.status === "APPROVED"
                                            ? "bg-green-100 text-green-800"
                                            : anunciante.media?.status === "IN_ANALYSIS"
                                                ? "bg-orange-100 text-orange-800"
                                                : anunciante.media?.status === "REJECTED"
                                                    ? "bg-red-100 text-red-800"
                                                    : anunciante.media?.status === "SUSPENDED"
                                                        ? "bg-gray-100 text-gray-800"
                                                        : "bg-gray-100 text-gray-800"
                                        }`}>
                                        {anunciante.media && anunciante.media.status
                                            ? anunciante.media.status === "APPROVED"
                                                ? "Vídeo Aprovado"
                                                : anunciante.media.status === "IN_ANALYSIS"
                                                    ? "Vídeo em Análise"
                                                    : anunciante.media.status === "REJECTED"
                                                        ? "Vídeo Rejeitado"
                                                        : anunciante.media.status === "SUSPENDED"
                                                            ? "Vídeo Suspenso"
                                                            : "Sem Vídeo"
                                            : "Sem Vídeo"}
                                    </span>
                                </td>


                                <td className="py-4 px-4 text-center space-x-2 flex justify-center">
                                    <div
                                        className="flex space-x-2"
                                        onClick={(e) => e.stopPropagation()} // <-- impede abrir o modal
                                    >
                                        {anunciante.documentStatus && (
                                            <Tooltip content="Verificar Documentos">
                                                <button
                                                    onClick={() => handleVerificarDocumentos(anunciante)}
                                                    className="text-blue-600 hover:text-blue-800 transition"
                                                    aria-label="Verificar Documentos"
                                                >
                                                    <FaFileAlt size={16} />
                                                </button>
                                            </Tooltip>
                                        )}

                                        <Tooltip content={anunciante.profileStatus === "ACTIVE" ? "Suspender Perfil" : "Ativar Perfil"}>
                                            <button
                                                onClick={() => handleAtivarDesativar(anunciante)}
                                                className={`${anunciante.profileStatus === "ACTIVE"
                                                    ? "text-yellow-600 hover:text-yellow-800"
                                                    : "text-green-600 hover:text-green-800"
                                                    } transition`}
                                                aria-label="Ativar/Suspender Perfil"
                                            >
                                                {anunciante.profileStatus === "ACTIVE" ? <FaBan size={16} /> : <FaCheck size={16} />}
                                            </button>
                                        </Tooltip>

                                        <Tooltip content="Aprovar/Rejeitar Vídeo">
                                            <button
                                                onClick={() => handleAprovarRejeitarVideo(anunciante)}
                                                className="text-green-600 hover:text-green-800 transition"
                                                aria-label="Aprovar/Rejeitar Vídeo"
                                            >
                                                <FaVideo size={16} />
                                            </button>
                                        </Tooltip>

                                        <Tooltip content="Editar Plano">
                                            <button
                                                onClick={() => handleEditarPlano(anunciante)}
                                                className="text-purple-600 hover:text-purple-800 transition"
                                                aria-label="Editar Plano"
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                        </Tooltip>

                                        <Tooltip content="Monitorar Postagens">
                                            <button
                                                onClick={() => handleMonitorarPostagens(anunciante)}
                                                className="text-gray-600 hover:text-gray-800 transition"
                                                aria-label="Monitorar Postagens"
                                            >
                                                <FaEye size={16} />
                                            </button>
                                        </Tooltip>

                                        <Tooltip content="Reportar Conteúdo Indevido">
                                            <button
                                                onClick={() => handleReportarConteudo(anunciante)}
                                                className="text-pink-500 hover:text-pink-700 transition"
                                                aria-label="Reportar Conteúdo Indevido"
                                            >
                                                <FaFlag size={16} />
                                            </button>
                                        </Tooltip>

                                        <Tooltip content="Ver Histórico">
                                            <button
                                                onClick={() => handleVerHistorico(anunciante)}
                                                className="text-indigo-600 hover:text-indigo-800 transition"
                                                aria-label="Ver Histórico"
                                            >
                                                <FaHistory size={16} />
                                            </button>
                                        </Tooltip>

                                        <Tooltip content="Excluir Anunciante">
                                            <button
                                                onClick={() => handleDeletarAnunciante(anunciante)}
                                                className="text-red-500 hover:text-red-700 transition"
                                                aria-label="Excluir Anunciante"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </Tooltip>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Gerenciamento de Anunciantes</h1>
            <p className="mb-6 text-gray-600">
                Aprove, rejeite cadastros, verifique documentos, ative/desative perfis, edite planos, monitore postagens,
                controle conteúdo indevido, suspenda perfis, atenda solicitações e visualize o histórico de atividades
                dos anunciantes de maneira eficiente.
            </p>

            <div className="mb-6 p-5 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3 text-lg">Legenda dos Ícones:</h3>
                <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <li className="flex items-center space-x-2">
                        <FaCheck className="text-green-600" />
                        <span>Aprovar/Ativar</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <FaTimes className="text-red-600" />
                        <span>Rejeitar</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <FaFileAlt className="text-blue-600" />
                        <span>Verificar Documentos</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <FaBan className="text-yellow-600" />
                        <span>Desativar/Suspender</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <FaEdit className="text-purple-600" />
                        <span>Editar Plano/Solicitações</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <FaEye className="text-gray-600" />
                        <span>Monitorar Postagens</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <FaFlag className="text-pink-500" />
                        <span>Reportar Conteúdo Indevido</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <FaHistory className="text-indigo-600" />
                        <span>Histórico de Atividades</span>
                    </li>
                </ul>
            </div>

            {/* <div className="flex flex-wrap space-x-4 mb-6 border-b">
        {["mulheres", "homens", "trans"].map((categoria) => (
          <button
            key={categoria}
            className={`px-4 py-2 text-sm font-medium ${
              activeCategory === categoria
                ? "border-b-2 border-pink-600 text-pink-600"
                : "text-gray-600 hover:text-gray-800"
            } transition`}
            onClick={() => setActiveCategory(categoria)}
            aria-current={activeCategory === categoria ? "page" : undefined}
          >
            {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
          </button>
        ))}
      </div>

      {activeCategory === "mulheres" && renderTable(mulheres)}
      {activeCategory === "homens" && renderTable(homens)}
      {activeCategory === "trans" && renderTable(trans)} */}

            {renderTable(anunciantes)}

            {modal.isOpen && (
                <Modal onClose={() => setModal({ isOpen: false, content: null })}>
                    {modal.content}
                </Modal>
            )}
        </div>
    );
};

export default Anunciantes;
