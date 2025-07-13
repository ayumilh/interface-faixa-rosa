"use client";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import useSocket from "../hooks/useSocket";

export default function SocketWrapper() {
  const { userInfo } = useContext(AuthContext);

  useSocket(userInfo?.id); // agora está dentro do Provider

  return null; // esse componente só serve para manter a conexão ativa
}
