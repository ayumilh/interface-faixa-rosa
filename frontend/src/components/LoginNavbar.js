"use client";

import Link from "next/link";
import { FaBell } from "react-icons/fa";
import { MdLocationOn, MdVideoLibrary, MdRateReview } from "react-icons/md";
import { Transition } from "@headlessui/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";
import { searchUserId } from "@/utils/searchUserId";

export default function LoginNavbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef();
  const [user, setUser] = useState(null);
  const notificationsRef = useRef();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await searchUserId(); 
      if (userData) {
        setUser(userData);
      }
    };

    fetchUser();
  }, []);

  // Fechar os menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
    // Fecha o menu de notificações se estiver aberto
    if (showNotifications) setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    // Fecha o menu de perfil se estiver aberto
    if (showProfileMenu) setShowProfileMenu(false);
  };

  const handleLogout = () => {
    Cookies.remove("token");
  };

  const handleLogoClick = () => {
    router.push(user.userType === "CONTRATANTE" ? "/userDashboard" : "/dashboard");
  }

  return (
    <header className="w-full bg-pink-600 shadow-sm fixed top-0 left-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/assets/FaixaRosaSombra.png"
            alt="Logo"
            width={120} height={48}
            className="h-12 w-auto mr-2"
            onClick={handleLogoClick}
          />
        </div>

        {/* Right Side of Navbar */}
        <div className="flex items-center space-x-4">
          {/* Notificações */}
          <div className="relative" ref={notificationsRef}>
            <button
              className="flex items-center text-gray-700 hover:text-pink-500 transition focus:outline-none"
              onClick={toggleNotifications}
            >
              <FaBell className="text-white w-6 h-6 cursor-pointer" />
              <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-blue-500 text-white text-xs text-center">
                1
              </span>
            </button>

            {/* Menu de Notificações */}
            <Transition
              show={showNotifications}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
                <h3 className="px-4 py-2 text-lg font-semibold text-gray-800 border-b">
                  Notificações
                </h3>
                <div className="p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <MdLocationOn className="text-pink-500 w-5 h-5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        23 acompanhantes novos em São Paulo - SP
                      </p>
                      <p className="text-xs text-gray-500">Essa semana</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MdVideoLibrary className="text-pink-500 w-5 h-5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        61 vídeos novos de acompanhantes em São Paulo - SP
                      </p>
                      <p className="text-xs text-gray-500">Essa semana</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MdRateReview className="text-pink-500 w-5 h-5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        6 reviews novos em São Paulo - SP
                      </p>
                      <p className="text-xs text-gray-500">Essa semana</p>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          {/* Perfil do Usuário */}
          <div className="relative" ref={profileRef}>
            <button
              className="flex items-center text-white hover:text-pink-500 transition focus:outline-none"
              onClick={toggleProfileMenu}
            >
              <Image
                src={"/images/user.jpg"}
                alt="Usuário"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full mr-3"
              />
            </button>

            {/* Menu de Perfil */}
            <Transition
              show={showProfileMenu}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                <div className="px-4 py-2 border-b">
                  {/* <p className="text-gray-800 font-semibold">{session?.session?.user?.name}</p>
                  <p className="text-sm text-gray-500">{session?.session?.user?.email}</p> */}
                </div>
                <Link href="/userDashboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-pink-100 transition">
                  Dashboard
                </Link>

                <Link href="/user-area" className="flex items-center px-4 py-2 text-gray-700 hover:bg-pink-100 transition">
                  Perfil
                </Link>
                <Link href="/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-pink-100 transition">
                  Configurações
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-pink-100 transition"
                >
                  Sair
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </nav>
    </header>
  );
}
