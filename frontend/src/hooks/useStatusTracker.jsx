// hooks/useStatusTracker.js
"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function useStatusTracker(userIds = []) {
  const [statusMap, setStatusMap] = useState({});
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userIds || userIds.length === 0) return;

    if (!socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
        withCredentials: true,
      });

      socketRef.current.on("connect", () => {
        console.log("Conectado para rastrear status");
      });

      socketRef.current.on("userStatus", ({ userId, status }) => {
        setStatusMap((prev) => ({
          ...prev,
          [userId]: status,
        }));
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userIds]);

  return statusMap;
}
