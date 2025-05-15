"use client";

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useSocket(userId, onStatusChange) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    if (!socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
        query: { userId },
        withCredentials: true,
      });

      socketRef.current.on("connect", () => {
        console.log("Conectado ao Socket.IO");
      });

      socketRef.current.on("disconnect", () => {
        console.log("Desconectado do Socket.IO");
      });

      socketRef.current.on("userStatus", ({ userId: id, status }) => {
        console.log(`Usuário ${id} está agora ${status}`);
        if (onStatusChange && typeof onStatusChange === "function") {
          onStatusChange(status);
        }
      });
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId, onStatusChange]);

  return socketRef.current;
}
