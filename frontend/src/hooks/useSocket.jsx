"use client";

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useSocket(userId) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // Conecta apenas uma vez
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

      socketRef.current.on("userStatus", ({ userId, status }) => {
        console.log(`Usuário ${userId} está agora ${status}`);
      });
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId]);

  return socketRef.current;
}
