// hooks/useSocketStatus.js
"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export const useSocketStatus = (watchedUserId) => {
  const [status, setStatus] = useState("offline");
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    if (!watchedUserId) return;

    // Cria nova instância do socket com query contendo o userId
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
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
      if (userId === watchedUserId) {
        setStatus(status);
      }
    };

    socket.on("userStatus", handleUserStatus);

    return () => {
      socket.off("userStatus", handleUserStatus);
      socket.disconnect();
    };
  }, [watchedUserId]);

  return status;
};
