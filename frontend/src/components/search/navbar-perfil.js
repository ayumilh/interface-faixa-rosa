"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBell, FaSearch } from "react-icons/fa";
import ModalBusca from "../components/search/modalbusca";

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showModalBusca, setShowModalBusca] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="w-full bg-gray-100 py-2 shadow-sm fixed top-0 left-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
            <Image
              src="/assets/Faixa-Rosa-Horizontal.png"
              alt="Logo"
              width={160}
              height={32}
              className="h-8 w-auto block lg:hidden"
            />
            <Image
              src="/assets/Faixa-Rosa-Horizontal.png"
              alt="Logo"
              width={200}
              height={40}
              className="h-10 w-auto hidden lg:block"
            />
        </div>

        {/* Campo de busca para desktop */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center relative">
          <input
            type="text"
            placeholder="Buscar acompanhantes por cidade"
            className="w-full max-w-md py-2 pl-4 pr-12 rounded-full bg-white border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-sm transition-all duration-200"
            readOnly
          />
          <FaSearch
            size={18}
            className="absolute right-4 top-2.5 text-pink-500"
          />
        </div>

        {/* Sino de notificações */}
        <div className="relative">
          <FaBell
            className="text-gray-800 w-6 h-6 cursor-pointer"
            onClick={toggleNotifications}
          />
          <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-red-500 text-white text-xs text-center">
            1
          </span>

          {/* Menu de Notificações */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
              <h3 className="px-4 py-2 text-lg font-semibold text-gray-800 border-b">
                Notificações
              </h3>
              <div className="p-4 space-y-3">
                <p className="text-sm font-medium text-gray-800">Nenhuma nova notificação</p>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Campo de busca para mobile */}
      <div className="relative w-full max-w-sm mx-auto mt-2 block lg:hidden">
        <input
          type="text"
          placeholder="Buscar acompanhantes por cidade"
          onClick={() => setShowModalBusca(true)}
          className="w-full py-2 pl-4 pr-12 rounded-full bg-white border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-sm transition-transform transform hover:scale-105"
          readOnly
        />
        <button
          className="absolute right-4 top-2 bg-pink-500 p-2 rounded-full text-white transition-transform transform hover:scale-110"
          onClick={() => setShowModalBusca(true)}
        >
          <FaSearch size={16} />
        </button>
      </div>

      {/* Modal de busca */}
      {showModalBusca && <ModalBusca onClose={() => setShowModalBusca(false)} />}
    </header>
  );
}
