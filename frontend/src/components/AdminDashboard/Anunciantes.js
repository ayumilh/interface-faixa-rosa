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
} from "react-icons/fa";
import Modal from "./Modal";
import Tooltip from "../common/Tooltip";
import axios from "axios";
import Cookies from "js-cookie";

const Anunciantes = () => {
  const [activeCategory, setActiveCategory] = useState("mulheres");
  const [modal, setModal] = useState({ isOpen: false, content: null });
  const [anunciantes, setAnunciantes] = useState([]);

  // const mulheres = [
  //   { id: 1, nome: "Ana Silva", plano: "Pink", status: "Aguardando Aprovação", documentos: "Pendente" },
  //   { id: 2, nome: "Beatriz Gomes", plano: "Safira", status: "Ativa", documentos: "Verificado" },
  //   { id: 3, nome: "Carla Torres", plano: "Rubi", status: "Desativada", documentos: "Verificado" },
  // ];

  // const homens = [
  //   { id: 1, nome: "Daniel Souza", plano: "Pink", status: "Aguardando Aprovação", documentos: "Pendente" },
  //   { id: 2, nome: "Eduardo Lima", plano: "Rubi", status: "Ativa", documentos: "Verificado" },
  //   { id: 3, nome: "Felipe Melo", plano: "Safira", status: "Ativa", documentos: "Verificado" },
  // ];

  // const trans = [
  //   { id: 1, nome: "Gisele Amaral", plano: "Safira", status: "Ativa", documentos: "Verificado" },
  //   { id: 2, nome: "Helena Ribeiro", plano: "Pink", status: "Aguardando Aprovação", documentos: "Pendente" },
  //   { id: 3, nome: "Isadora Lopes", plano: "Rubi", status: "Desativada", documentos: "Verificado" },
  //   { id: 4, nome: "Júlia Santos", plano: "Pink", status: "Ativa", documentos: "Verificado" },
  // ];

  useEffect(() => {
    const fetchAnunciantes = async () => {
      try {
        const userToken = Cookies.get("userToken");
        const response = await axios.get(
          // `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/acompanhante`,
          `http://localhost:4000/api/admin/acompanhante`,
          {
            headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInVzZXJUeXBlIjoiQURNSU4iLCJmaXJzdE5hbWUiOiJBZG1pbiIsImxhc3ROYW1lIjoidGVzdGUiLCJpYXQiOjE3NDAyMjEzNDMsImV4cCI6MTc0MDMwNzc0M30.tSMnBEghq7jtiV88BbV2J1hrrfSFZUzpVJTjZlhkCBs` },
          }
        );
        setAnunciantes(response.data);
        console.log("Anunciantes:", response.data);
      } catch (error) {
        console.error("Erro ao buscar anunciantes:", error);
      }
    };

    fetchAnunciantes();
  }, []);

  const handleAprovar = (anunciante) => {
    setModal({
      isOpen: true,
      content: (
        <>
          <h2 className="text-xl font-semibold">Aprovar Anunciante</h2>
          <p>Deseja aprovar o cadastro de <strong>{anunciante.name}</strong>?</p>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setModal({ isOpen: false, content: null })}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                alert("Anunciante aprovado com sucesso!");
                setModal({ isOpen: false, content: null });
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Aprovar
            </button>
          </div>
        </>
      ),
    });
  };

  const handleRejeitar = (anunciante) => {
    setModal({
      isOpen: true,
      content: (
        <>
          <h2 className="text-xl font-semibold">Rejeitar Anunciante</h2>
          <p>Deseja rejeitar o cadastro de <strong>{anunciante.name}</strong>?</p>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setModal({ isOpen: false, content: null })}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                alert("Anunciante rejeitado.");
                setModal({ isOpen: false, content: null });
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Rejeitar
            </button>
          </div>
        </>
      ),
    });
  };

  const handleVerificarDocumentos = (anunciante) => {
    setModal({
      isOpen: true,
      content: (
        <>
          <h2 className="text-xl font-semibold">Verificar Documentos</h2>
          <p>Verifique os documentos de <strong>{anunciante.name}</strong>.</p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setModal({ isOpen: false, content: null })}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Fechar
            </button>
          </div>
        </>
      ),
    });
  };

  const handleAtivarDesativar = (anunciante) => {
    setModal({
      isOpen: true,
      content: (
        <>
          <h2 className="text-xl font-semibold">
            {anunciante.profileStatus === "Ativa" ? "Desativar" : "Ativar"} Perfil
          </h2>
          <p>
            Deseja {anunciante.profileStatus  === "Ativa" ? "desativar" : "ativar"} o perfil de <strong>{anunciante.name}</strong>?
          </p>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setModal({ isOpen: false, content: null })}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                alert(`${anunciante.profileStatus  === "Ativa" ? "Desativado" : "Ativado"} com sucesso!`);
                setModal({ isOpen: false, content: null });
              }}
              className={`px-4 py-2 ${
                anunciante.profileStatus  === "Ativa" ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
              } text-white rounded`}
            >
              {anunciante.profileStatus  === "Ativa" ? "Desativar" : "Ativar"}
            </button>
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

  const handleMonitorarPostagens = (anunciante) => {
    setModal({
      isOpen: true,
      content: (
        <>
          <h2 className="text-xl font-semibold">Monitorar Postagens</h2>
          <p>Monitorando postagens de <strong>{anunciante.name}</strong>.</p>
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

  const handleVerHistorico = (anunciante) => {
    setModal({
      isOpen: true,
      content: (
        <>
          <h2 className="text-xl font-semibold">Histórico de Atividades</h2>
          <p>Visualizando histórico de <strong>{anunciante.name}</strong>.</p>
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
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    anunciante.profileStatus === "Ativa"
                      ? "bg-green-100 text-green-800"
                      : anunciante.status === "Aguardando Aprovação"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {anunciante.profileStatus}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    anunciante.documentStatus === "Verificado"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {anunciante.documentStatus}
                  </span>
                </td>
                <td className="py-4 px-4 text-center space-x-2 flex justify-center">
                  {anunciante.profileStatus === "Aguardando Aprovação" && (
                    <>
                      <Tooltip content="Aprovar">
                        <button
                          onClick={() => handleAprovar(anunciante)}
                          className="text-green-600 hover:text-green-800 transition"
                          aria-label="Aprovar"
                        >
                          <FaCheck size={16} />
                        </button>
                      </Tooltip>
                      <Tooltip content="Rejeitar">
                        <button
                          onClick={() => handleRejeitar(anunciante)}
                          className="text-red-600 hover:text-red-800 transition"
                          aria-label="Rejeitar"
                        >
                          <FaTimes size={16} />
                        </button>
                      </Tooltip>
                    </>
                  )}

                  {anunciante.documentStatus === "Pendente" && (
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

                  <Tooltip content={anunciante.profileStatus === "Ativa" ? "Desativar Perfil" : "Ativar Perfil"}>
                    <button
                      onClick={() => handleAtivarDesativar(anunciante)}
                      className={`${
                        anunciante.profileStatus === "Ativa"
                          ? "text-yellow-600 hover:text-yellow-800"
                          : "text-green-600 hover:text-green-800"
                      } transition`}
                      aria-label={anunciante.profileStatus === "Ativa" ? "Desativar Perfil" : "Ativar Perfil"}
                    >
                      {anunciante.profileStatus === "Ativa" ? <FaBan size={16} /> : <FaCheck size={16} />}
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
