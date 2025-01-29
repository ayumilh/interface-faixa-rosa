"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { MdLocationOn, MdVideoLibrary, MdRateReview } from "react-icons/md";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetch(`/api/navbar`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            setIsAuthenticated(true);
            setUser(data.user);
          } else {
            setIsAuthenticated(false);
          }
        })
        .catch(() => setIsAuthenticated(false));
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleLogout = () => {
    Cookies.remove("userId");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <header className="w-full bg-white py-3 shadow-sm fixed top-0 left-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/assets/logofaixa.png"
            alt="Logo"
            width={40} height={40}
            className="h-10 w-auto"
          />
        </div>

        {isAuthenticated ? (
          <div className="relative flex items-center space-x-6">
            {/* Notificações */}
            <div className="relative">
              <FaBell
                className="text-gray-800 w-6 h-6 cursor-pointer"
                onClick={toggleNotifications}
              />
              <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 text-white text-xs text-center">
                1
              </span>

              {/* Menu de Notificações */}
              {showNotifications && (
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
                    <div className="flex items-center justify-between bg-pink-100 p-3 rounded-md">
                      <p className="text-sm font-medium text-gray-800">
                        Novo cadastro: rápido, fácil e sigiloso.
                      </p>
                      <button
                        onClick={() => router.push("/cadastro")}
                        className="text-pink-600 font-bold text-sm"
                      >
                        Cadastre-se
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar e Menu de Perfil */}
            <div className="relative">
              <FaUserCircle
                className="text-gray-800 w-8 h-8 cursor-pointer"
                onClick={toggleProfileMenu}
              />
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <p className="px-4 py-2 text-gray-800 font-semibold">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <Link href="/user-area" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Área do Usuário
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Configurações
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-6">
            <button
              onClick={() => router.push('/cadastro')}
              className="text-pink-500 hover:text-red-600 font-bold text-sm transition flex items-center"
            >
              CADASTRA-SE
            </button>
            <button
              onClick={() => router.push('/login')}
              className="text-gray-800 hover:text-gray-900 font-medium text-sm transition flex items-center"
            >
              LOGIN
            </button>

            <div className="relative">
              <FaBell
                className="text-gray-800 w-6 h-6 cursor-pointer"
                onClick={toggleNotifications}
              />
              <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 text-white text-xs text-center">
                1
              </span>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
                  <h3 className="px-4 py-2 text-lg font-semibold text-gray-800 border-b">
                    Notificações
                  </h3>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between bg-pink-100 p-3 rounded-md">
                      <p className="text-sm font-medium text-gray-800">
                        Novo cadastro: rápido, fácil e sigiloso.
                      </p>
                      <button
                        onClick={() => router.push("/cadastro")}
                        className="text-pink-600 font-bold text-sm"
                      >
                        Cadastre-se
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
