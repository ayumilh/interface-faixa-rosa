"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export const useSocketStatus = (watchedUserId) => {
  const [status, setStatus] = useState("offline");
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    if (!watchedUserId) {
      console.log("watchedUserId não fornecido");
      return;
    }

    // Cria nova instância do socket com query contendo o userId
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      transports: ["websocket"],
      query: { userId: watchedUserId },
    });

    setSocketInstance(socket);

    socket.connect();

    socket.on("connect", () => {
      console.log("Socket conectado para acompanhar ID:", watchedUserId);
    });

    // Atualiza status quando o backend envia novo estado
    const handleUserStatus = ({ userId, status }) => {
      console.log(`Status recebido para o usuário ${userId}: ${status}`);
      if (userId === watchedUserId) {
        setStatus(status);
        console.log(`Status atualizado para ${status}`);
      }
    };

    socket.on("userStatus", handleUserStatus);

    // Cleanup
    return () => {
      console.log("Desconectando socket...");
      socket.off("userStatus", handleUserStatus);
      socket.disconnect();
      console.log("Socket desconectado.");
    };
  }, [watchedUserId]);

  console.log(`Status atual do usuário ${watchedUserId}: ${status}`);

  return status;
};
