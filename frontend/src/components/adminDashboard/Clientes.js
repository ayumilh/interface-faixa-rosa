import React, { useState, useEffect } from "react";
import {
  FaComments,
  FaTrash,
  FaBan,
  FaLifeRing,
  FaSearch,
} from "react-icons/fa";
import Modal from "./Modal";
import Tooltip from "../common/Tooltip";
import axios from "axios";
import Cookies from "js-cookie";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [modal, setModal] = useState({ isOpen: false, content: null });

  useEffect(() => {
    const fetchContratantes = async () => {
      try {
        const userToken = Cookies.get("userToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/contratantes`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setClientes(response.data);
      } catch (error) {
        console.error("Erro ao buscar contratantes:", error);
      }
    };

    fetchContratantes();
  }, []);


  const atualizarStatusCliente = (clienteId, novoStatus) => {
    setClientes((prevClientes) =>
      prevClientes.map((cliente) =>
        cliente.id === clienteId ? { ...cliente, status: novoStatus } : cliente
      )
    );
  };

  const monitorarInteracoes = async (clienteId) => {
    setModal({
      isOpen: true,
      content: (
        <>
          <h2 className="text-xl font-semibold">Monitorar Interações</h2>
          <p>
            Você está monitorando as interações do cliente ID: <strong>{clienteId}</strong>.
          </p>
          {/* Futuramente você pode carregar dados reais aqui */}
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


  const excluirConta = (clienteId) => {
    setModal({
      isOpen: true,
      content: (
        <>
          <h2 className="text-xl font-semibold">Confirmar Exclusão</h2>
          <p>
            Tem certeza que deseja excluir a conta do cliente ID: <strong>{clienteId}</strong>?
          </p>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setModal({ isOpen: false, content: null })}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={async () => {
                try {
                  const userToken = Cookies.get("userToken");
                  await axios.delete(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/contratantes/${clienteId}`,
                    {
                      headers: {
                        Authorization: `Bearer ${userToken}`,
                      },
                    }
                  );
                  setClientes(clientes.filter((c) => c.id !== clienteId));
                  setModal({
                    isOpen: true,
                    content: (
                      <>
                        <h2 className="text-xl font-semibold">Sucesso</h2>
                        <p>Conta excluída com sucesso!</p>
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() =>
                              setModal({ isOpen: false, content: null })
                            }
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Fechar
                          </button>
                        </div>
                      </>
                    ),
                  });
                } catch (error) {
                  console.error("Erro ao excluir contratante:", error);
                  alert("Erro ao excluir a conta.");
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Confirmar
            </button>
          </div>
        </>
      ),
    });
  };


  const bloquearUsuario = (clienteId) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    if (cliente.status === "Banido") {
      // Desbloquear
      setModal({
        isOpen: true,
        content: (
          <>
            <h2 className="text-xl font-semibold">Desbloquear Usuário</h2>
            <p>
              O usuário ID: <strong>{clienteId}</strong> está atualmente <strong>Banido</strong>. Deseja desbloquear?
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
                  atualizarStatusCliente(clienteId, "Ativo");
                  setModal({
                    isOpen: true,
                    content: (
                      <>
                        <h2 className="text-xl font-semibold">Sucesso</h2>
                        <p>Usuário desbloqueado com sucesso!</p>
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => setModal({ isOpen: false, content: null })}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Fechar
                          </button>
                        </div>
                      </>
                    ),
                  });
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Desbloquear
              </button>
            </div>
          </>
        ),
      });
    } else {
      // Bloquear
      setModal({
        isOpen: true,
        content: (
          <>
            <h2 className="text-xl font-semibold">Bloquear Usuário</h2>
            <p>
              Tem certeza que deseja bloquear o usuário ID: <strong>{clienteId}</strong>?
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
                  atualizarStatusCliente(clienteId, "Banido");
                  setModal({
                    isOpen: true,
                    content: (
                      <>
                        <h2 className="text-xl font-semibold">Sucesso</h2>
                        <p>Usuário bloqueado com sucesso!</p>
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => setModal({ isOpen: false, content: null })}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Fechar
                          </button>
                        </div>
                      </>
                    ),
                  });
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Bloquear
              </button>
            </div>
          </>
        ),
      });
    }
  };

  const atenderSuporte = (clienteId) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    setModal({
      isOpen: true,
      content: (
        <>
          <h2 className="text-xl font-semibold">Atender Suporte</h2>
          <p>
            Atendendo suporte do cliente: <strong>{cliente.nome}</strong>.
          </p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setModal({ isOpen: false, content: null })}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Fechar
            </button>
          </div>
        </>
      ),
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredClientes = clientes.filter((cliente) => {
    const query = searchQuery.toLowerCase();
    const fullName = `${cliente.firstName} ${cliente.lastName}`.toLowerCase();
    return (
      fullName.includes(query) ||
      cliente.id.toString().includes(query) ||
      cliente.email.toLowerCase().includes(query) ||
      cliente.phone.toLowerCase().includes(query) ||
      cliente.cpf.toLowerCase().includes(query)
    );
  });

  const statusColors = {
    Ativo: "bg-green-100 text-green-800",
    Suspenso: "bg-yellow-100 text-yellow-800",
    Banido: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Gerenciamento de Clientes
      </h1>
      <p className="mb-6 text-gray-600">
        Monitore interações, exclua contas infratoras, bloqueie/banir usuários e
        atenda solicitações de suporte dos clientes de forma eficiente.
      </p>

      {/* Legenda dos Ícones */}
      <div className="mb-6 p-5 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3 text-lg">Legenda dos Ícones:</h3>
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <li className="flex items-center space-x-2">
            <FaComments className="text-blue-600" />
            <span>Monitorar Interações</span>
          </li>
          <li className="flex items-center space-x-2">
            <FaTrash className="text-red-600" />
            <span>Excluir Conta</span>
          </li>
          <li className="flex items-center space-x-2">
            <FaBan className="text-yellow-600" />
            <span>Bloquear/Banir Usuário</span>
          </li>
          <li className="flex items-center space-x-2">
            <FaLifeRing className="text-green-600" />
            <span>Atender Suporte</span>
          </li>
        </ul>
      </div>

      {/* Barra de Pesquisa */}
      <div className="flex items-center mb-6">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Pesquisar por Nome, ID, Status ou Suporte"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          aria-label="Pesquisar Clientes"
        />
      </div>

      {/* Tabela de Clientes */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-sm">
          <thead>
            <tr>
              <th className="py-3 px-4 bg-gray-100 text-left font-semibold text-gray-700">ID</th>
              <th className="py-3 px-4 bg-gray-100 text-left font-semibold text-gray-700">Nome</th>
              <th className="py-3 px-4 bg-gray-100 text-left font-semibold text-gray-700">Status</th>
              <th className="py-3 px-4 bg-gray-100 text-left font-semibold text-gray-700">Interações</th>
              <th className="py-3 px-4 bg-gray-100 text-left font-semibold text-gray-700">Suporte</th>
              <th className="py-3 px-4 bg-gray-100 text-center font-semibold text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.length > 0 ? (
              filteredClientes.map((cliente) => (
                <tr
                  key={cliente.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4 text-gray-700">{cliente.id}</td>
                  <td className="py-4 px-4 text-gray-700">
                    {`${cliente.firstName} ${cliente.lastName}`}
                  </td>
                  <td className="py-4 px-4 text-gray-700">Status</td>
                  <td className="py-4 px-4 text-gray-700">Interações</td>
                  <td className="py-4 px-4 text-gray-700">Suporte</td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex justify-center space-x-3">
                      <Tooltip content="Monitorar Interações">
                        <button
                          onClick={() => monitorarInteracoes(cliente.id)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          aria-label={`Monitorar Interações de ${cliente.firstName} ${cliente.lastName}`}
                        >
                          <FaComments size={18} />
                        </button>
                      </Tooltip>

                      <Tooltip content="Excluir Conta">
                        <button
                          onClick={() => excluirConta(cliente.id)}
                          className="text-red-600 hover:text-red-800 transition"
                          aria-label={`Excluir Conta de ${cliente.firstName} ${cliente.lastName}`}
                        >
                          <FaTrash size={18} />
                        </button>
                      </Tooltip>

                      <Tooltip
                        content={
                          cliente.status === "Banido"
                            ? "Desbloquear Usuário"
                            : "Bloquear/Banir Usuário"
                        }
                      >
                        <button
                          onClick={() => bloquearUsuario(cliente.id)}
                          className={`${cliente.status === "Banido"
                            ? "text-green-600 hover:text-green-800"
                            : "text-yellow-600 hover:text-yellow-800"
                            } transition`}
                          aria-label={
                            cliente.status === "Banido"
                              ? `Desbloquear ${cliente.firstName} ${cliente.lastName}`
                              : `Bloquear/Banir ${cliente.firstName} ${cliente.lastName}`
                          }
                        >
                          <FaBan size={18} />
                        </button>
                      </Tooltip>

                      <Tooltip content="Atender Suporte">
                        <button
                          onClick={() => atenderSuporte(cliente.id)}
                          className="text-green-600 hover:text-green-800 transition"
                          aria-label={`Atender Suporte de ${cliente.firstName} ${cliente.lastName}`}
                        >
                          <FaLifeRing size={18} />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  Nenhum contratante encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.isOpen && (
        <Modal onClose={() => setModal({ isOpen: false, content: null })}>
          {modal.content}
        </Modal>
      )}
    </div>
  );
};

export default Clientes;
