// src/components/modalAction/ModalVerificarDocumentos.js
import React from "react";
import { toast } from "react-toastify";
import axios from "axios";

const ModalVerificarDocumentos = ({
  anunciante,
  documentStatus,
  atualizarStatusDocumento,
  userToken,
  onClose,
  isLoading,
  setIsLoading,
  setDocumentStatusModal,
}) => {
  const statusLabel = {
    APPROVED: { texto: "Aprovado", cor: "text-green-600" },
    IN_ANALYSIS: { texto: "Em Análise", cor: "text-orange-500" },
    REJECTED: { texto: "Rejeitado", cor: "text-red-600" },
    PENDING: { texto: "Pendente", cor: "text-yellow-500" },
  };

  const status = statusLabel[documentStatus] || { texto: "Indefinido", cor: "text-gray-600" };

  const document = anunciante?.documents?.[0];

  const aprovarDocumento = async () => {
    try {
      setIsLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/companion/${anunciante.id}/documents/approve`,
        {},
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      atualizarStatusDocumento("APPROVED");
      setDocumentStatusModal("APPROVED");
      toast.success("Documento aprovado com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao aprovar documento:", error);
      toast.error("Erro ao aprovar documento.");
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
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      atualizarStatusDocumento("REJECTED");
      setDocumentStatusModal("REJECTED");
      toast.success("Documento rejeitado com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao rejeitar documento:", error);
      toast.error("Erro ao rejeitar documento.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Verificar Documentos</h2>
      <p>
        O documento de <strong>{anunciante.name}</strong> está atualmente:{" "}
        <strong className={status.cor}>{status.texto}</strong>
      </p>

      {/* IMAGENS DO DOCUMENTO */}
      {document?.fileFront || document?.fileBack ? (
        <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {document.fileFront && (
            <div>
              <p className="text-sm text-gray-600 mb-1 font-semibold">Frente do Documento:</p>
              <img
                src={document.fileFront}
                alt="Documento Frente"
                className="w-full h-auto rounded border"
              />
            </div>
          )}
          {document.fileBack && (
            <div>
              <p className="text-sm text-gray-600 mb-1 font-semibold">Verso do Documento:</p>
              <img
                src={document.fileBack}
                alt="Documento Verso"
                className="w-full h-auto rounded border"
              />
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">Nenhuma imagem de documento enviada.</p>
      )}

      {/* BOTÕES */}
      <div className="mt-6 flex justify-end space-x-2">
        {documentStatus === "IN_ANALYSIS" && (
          <>
            <button
              onClick={aprovarDocumento}
              className={`px-4 py-2 text-white rounded bg-green-600 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoading}
            >
              Aprovar
            </button>
            <button
              onClick={rejeitarDocumento}
              className={`px-4 py-2 text-white rounded bg-red-600 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoading}
            >
              Rejeitar
            </button>
          </>
        )}
        {documentStatus === "REJECTED" && (
          <button
            onClick={aprovarDocumento}
            className={`px-4 py-2 text-white rounded bg-green-600 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isLoading}
          >
            Aprovar
          </button>
        )}
        {documentStatus === "PENDING" && (
          <p className="text-gray-500">Acompanhante não enviou documento.</p>
        )}
        {documentStatus === "APPROVED" && (
          <>
            <p className="text-green-500 font-medium mr-4 mt-1">Documento já aprovado.</p>
            <button
              onClick={rejeitarDocumento}
              className={`px-4 py-2 text-white rounded bg-red-600 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoading}
            >
              Rejeitar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalVerificarDocumentos;
