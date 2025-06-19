import { useState } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

const ModalEditarStatusDenuncia = ({
  denuncia,
  userToken,
  onClose,
  onSalvarStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(
    denuncia.denunciaStatus || "PENDING"
  );

  const [statusAlterado, setStatusAlterado] = useState(false);
  const [statusSalvo, setStatusSalvo] = useState(false);

  const statusOptions = [
    { value: "PENDING", label: "Pendente" },
    { value: "IN_ANALYSIS", label: "Em Análise" },
    { value: "RESOLVIDA", label: "Resolvida" },
    { value: "CANCELADA", label: "Cancelada" },
    { value: "REJEITADA", label: "Rejeitada" },
  ];

  const handleSalvar = async () => {
    await onSalvarStatus(denuncia.id, selectedStatus, userToken, () => {});
    setStatusAlterado(false);
    setStatusSalvo(true);
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black bg-opacity-50 flex items-center justify-center px-4">

      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4">
          Alterar Status da Denúncia #{denuncia.id}
        </h2>

        <div className="space-y-6">
          {/* Status Atual */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Status Atual
            </label>
            <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-200 rounded-md shadow-inner">
              <span className="text-indigo-700 font-semibold text-base">
                {statusOptions.find((s) => s.value === denuncia.denunciaStatus)
                  ?.label || "Desconhecido"}
              </span>
            </div>
          </div>

          {/* Selecionar Novo Status */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Selecionar Novo Status
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {statusOptions.map((status) => {
                const selected = selectedStatus === status.value;
                return (
                  <div
                    key={status.value}
                    onClick={() => {
                      setSelectedStatus(status.value);
                      setStatusAlterado(true);
                      setStatusSalvo(false);
                    }}
                    className={`cursor-pointer border rounded-lg p-3 transition hover:shadow-md ${
                      selected
                        ? "bg-indigo-100 border-indigo-500 ring-2 ring-indigo-500"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <p className="font-medium text-gray-800">{status.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-wrap justify-between items-center gap-4 pt-4">
            <div className="flex gap-4">
              {statusAlterado && (
                <button
                  onClick={handleSalvar}
                  className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition font-medium"
                >
                  Salvar Status
                </button>
              )}
              {statusSalvo && !statusAlterado && (
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <FaCheckCircle /> Status salvo
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarStatusDenuncia;
