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
    FaSpinner
} from "react-icons/fa";
import Modal from "./Modal";
import Tooltip from "../common/Tooltip";
import axios from "axios";
import Cookies from "js-cookie";

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

        const aprovarDocumento = async () => {
            try {
                setIsLoading(true);
                await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/companion/${anunciante.id}/documents/approve`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                );
                atualizarStatusDocumento("APPROVED");
                alert("Documento aprovado com sucesso!");
                setModal({ isOpen: false, content: null });
            } catch (error) {
                console.error("Erro ao aprovar documento:", error);
                alert("Erro ao aprovar documento.");
            } finally {
                setIsLoading(false);
            }
        };

        const rejeitarDocumento = async () => {
            try {
                setIsLoading(true);
                await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/companion/${anunciante.id}/documents/reject`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                );
                atualizarStatusDocumento("REJECTED");
                alert("Documento rejeitado.");
                setModal({ isOpen: false, content: null });
            } catch (error) {
                console.error("Erro ao rejeitar documento:", error);
                alert("Erro ao rejeitar documento.");
            } finally {
                setIsLoading(false);
            }
        };

        setDocumentStatusModal(documentStatus);

        setModal({
            isOpen: true,
            content: (
                <>
                    <h2 className="text-xl font-semibold">Verificar Documentos</h2>
                    <p>
                        O documento de <strong>{anunciante.name}</strong> está atualmente:{" "}
                        <strong>{documentStatusModal || documentStatus}</strong>
                    </p>
                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            onClick={() => setModal({ isOpen: false, content: null })}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        {documentStatusModal === "REJECTED" || documentStatus === "REJECTED" ? (
                            <button
                                onClick={aprovarDocumento}
                                className={`px-4 py-2 text-white rounded bg-green-600 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={isLoading}
                            >
                                Aprovar
                            </button>
                        ) : (
                            <button
                                onClick={rejeitarDocumento}
                                className={`px-4 py-2 text-white rounded bg-red-600 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={isLoading}
                            >
                                Rejeitar
                            </button>
                        )}
                    </div>
                </>
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
                alert("Perfil aprovado com sucesso!");
                atualizarStatusPerfil("ACTIVE");
            } catch (error) {
                console.error("Erro ao aprovar perfil");
                alert("Erro ao aprovar perfil.");
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
                alert("Perfil rejeitado.");
                atualizarStatusPerfil("REJECTED");
            } catch (error) {
                console.error("Erro ao rejeitar perfil:", error.response?.data || error.message);
                alert("Erro ao rejeitar perfil.");
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
                alert("Perfil suspenso com sucesso.");
                atualizarStatusPerfil("SUSPENDED");
            } catch (error) {
                console.error("Erro ao suspender perfil:", error.response?.data || error.message);
                alert("Erro ao suspender perfil.");
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
                        <button
                            onClick={() => setModal({ isOpen: false, content: null })}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
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


    const handleEditarPlano = (anunciante) => {
        setModal({
            isOpen: true,
            content: (
                <>
                    <h2 className="text-xl font-semibold">Editar Plano</h2>
                    <p>Editar o plano de <strong>{anunciante.name}</strong>.</p>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => setModal({ isOpen: false, content: null })}
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                            Fechar
                        </button>
                    </div>
                </>
            ),
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
            // Aqui, não exibimos um erro de alerta, pois o foco é mostrar a mensagem personalizada
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
                            <th className="py-3 px-4 bg-gray-100 text-center font-semibold text-gray-700">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {anunciantes.map((anunciante) => (
                            <tr key={anunciante.id} className="border-b hover:bg-gray-50">
                                <td className="py-4 px-4 text-gray-700">{anunciante.name}</td>
                                <td className="py-4 px-4 text-gray-700">{anunciante.plan?.name}</td>
                                <td className="py-4 px-4">
                                    {["ACTIVE", "SUSPENDED", "REJECTED"].includes(anunciante.profileStatus) && (
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${anunciante.profileStatus === "ACTIVE"
                                                ? "bg-green-100 text-green-800" // Verde para status ativo
                                                : anunciante.profileStatus === "SUSPENDED"
                                                    ? "bg-yellow-100 text-yellow-800" // Amarelo para status suspenso
                                                    : "bg-red-100 text-red-800" // Vermelho para status rejeitado
                                                }`}
                                        >
                                            {anunciante.profileStatus === "ACTIVE"
                                                ? "Ativo"
                                                : anunciante.profileStatus === "SUSPENDED"
                                                    ? "Suspenso"
                                                    : "Rejeitado"}
                                        </span>
                                    )}
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${anunciante.documentStatus === "APPROVED"
                                        ? "bg-green-100 text-green-800" // Verde para documentos aprovados
                                        : anunciante.documentStatus === "REJECTED"
                                            ? "bg-red-100 text-red-800" // Vermelho para documentos rejeitados
                                            : "bg-yellow-100 text-yellow-800" // Amarelo para documentos pendentes
                                        }`}>
                                        {anunciante.documentStatus === "APPROVED"
                                            ? "Verificado"
                                            : anunciante.documentStatus === "REJECTED"
                                                ? "Rejeitado"
                                                : "Pendente"}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-center space-x-2 flex justify-center">

                                    {anunciante.documentStatus && (
                                        <>
                                            <Tooltip content="Verificar Documentos">
                                                <button
                                                    onClick={() => handleVerificarDocumentos(anunciante)}
                                                    className="text-blue-600 hover:text-blue-800 transition"
                                                    aria-label="Verificar Documentos"
                                                >
                                                    <FaFileAlt size={16} />
                                                </button>
                                            </Tooltip>
                                        </>
                                    )}

                                    <Tooltip content={anunciante.profileStatus === "ACTIVE" ? "Suspender Perfil" : "Ativar Perfil"}>
                                        <button
                                            onClick={() => handleAtivarDesativar(anunciante)}
                                            className={`${anunciante.profileStatus === "ACTIVE"
                                                ? "text-yellow-600 hover:text-yellow-800"
                                                : "text-green-600 hover:text-green-800"
                                                } transition`}
                                            aria-label={anunciante.profileStatus === "ACTIVE" ? "Suspender Perfil" : "Ativar Perfil"}
                                        >
                                            {anunciante.profileStatus === "ACTIVE" ? <FaBan size={16} /> : <FaCheck size={16} />}
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
