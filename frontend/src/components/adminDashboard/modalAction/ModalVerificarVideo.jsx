import React from "react";
import { toast } from "react-toastify";
import axios from "axios";

const ModalVerificarVideo = ({ anunciante, userToken, atualizarStatusMedia, onClose }) => {
  const status = anunciante.media?.status || "NONE";
  const url = anunciante.media?.url || null;
  const isVideo = url && url.toLowerCase().endsWith(".mp4");

  const statusLabel = {
    "APPROVED": { texto: "Aprovado", cor: "text-green-600" },
    "IN_ANALYSIS": { texto: "Em Análise", cor: "text-orange-500" },
    "REJECTED": { texto: "Rejeitado", cor: "text-red-600" },
    "SUSPENDED": { texto: "Suspenso", cor: "text-gray-600" },
    "NONE": { texto: "Nenhum vídeo enviado", cor: "text-gray-500" }
  };

  const label = statusLabel[status] || statusLabel["NONE"];

  const handleAprovarVideo = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/companion/${anunciante.id}/media/approve`,
        {},
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      toast.success("Vídeo aprovado com sucesso!");
      atualizarStatusMedia(anunciante.id, "APPROVED");
      onClose();
    } catch (error) {
      console.error("Erro ao aprovar vídeo:", error);
      toast.error("Erro ao aprovar o vídeo.");
    }
  };

  const handleRejeitarVideo = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/companion/${anunciante.id}/media/reject`,
        {},
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      toast.success("Vídeo rejeitado com sucesso!");
      atualizarStatusMedia(anunciante.id, "REJECTED");
      onClose();
    } catch (error) {
      console.error("Erro ao rejeitar vídeo:", error);
      toast.error("Erro ao rejeitar o vídeo.");
    }
  };

  const handleSuspenderVideo = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/companion/${anunciante.id}/media/suspend`,
        {},
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      toast.success("Vídeo suspenso com sucesso!");
      atualizarStatusMedia(anunciante.id, "SUSPENDED");
      onClose();
    } catch (error) {
      console.error("Erro ao suspender vídeo:", error);
      toast.error("Erro ao suspender o vídeo.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Aprovar ou Rejeitar Vídeo</h2>
      <p className="mb-4">
        O vídeo de <strong>{anunciante.name}</strong> está atualmente:{" "}
        <span className={`font-semibold ${label.cor}`}>{label.texto}</span>
      </p>

      {url && isVideo ? (
        <div className="mb-4">
          <video controls className="w-full max-h-64 rounded shadow">
            <source src={url} type="video/mp4" />
            Seu navegador não suporta a tag de vídeo.
          </video>
        </div>
      ) : url && !isVideo ? (
        <p className="text-red-500 mb-4">
          ⚠️ A mídia enviada não é um vídeo válido (.mp4).
        </p>
      ) : (
        <p className="text-gray-500 mb-4">Nenhum vídeo enviado.</p>
      )}

      <div className="mt-4 flex justify-end space-x-2">
        {status === "IN_ANALYSIS" && (
          <>
            <button onClick={handleAprovarVideo} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Aprovar Vídeo</button>
            <button onClick={handleRejeitarVideo} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Rejeitar Vídeo</button>
          </>
        )}

        {status === "APPROVED" && (
          <>
            <button onClick={handleRejeitarVideo} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Rejeitar Vídeo</button>
            <button onClick={handleSuspenderVideo} className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">Suspender Vídeo</button>
          </>
        )}

        {status === "SUSPENDED" && (
          <button onClick={handleAprovarVideo} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Aprovar Vídeo</button>
        )}

        {status === "REJECTED" && (
          <>
            <button onClick={handleSuspenderVideo} className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">Suspender Vídeo</button>
            <button onClick={handleAprovarVideo} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Aprovar Vídeo</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalVerificarVideo;
