"use client";
import { useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaBell } from "react-icons/fa";
import { MdLocationOn, MdVideoLibrary, MdRateReview } from "react-icons/md";
import Image from "next/image";
import { AuthContext } from "@/context/AuthContext";
import { searchUserId } from "@/utils/searchUserId";
import Link from "next/link";
import { Transition } from "@headlessui/react";

export default function Navbar({ bgColor = "pink" }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef();
  const notificationsRef = useRef();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { logout, userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await searchUserId();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    fetchUser();
  }, []);

  // Close menus when clicking outside
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
    setShowProfileMenu(!showProfileMenu);
    if (showNotifications) setShowNotifications(false); // Close notifications if open
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showProfileMenu) setShowProfileMenu(false); // Close profile menu if open
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  const handleLogoClick = () => {
    router.push(user?.userType === "CONTRATANTE" ? "/userDashboard" : "/dashboard");
  };

  const logoSrc = bgColor === "white" ? "/assets/logofaixa.png" : "/assets/FaixaRosaSombra.png";
  const backgroundClass = bgColor === "white" ? "bg-white" : "bg-pink-600";

  return (
    <header className={`w-full shadow-sm fixed top-0 left-0 z-50 ${backgroundClass}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src={logoSrc}
            alt="Logo"
            width={120}
            height={48}
            className="h-12 w-auto mr-2"
            onClick={handleLogoClick}
          />
        </div>

        {/* Right Side of Navbar */}
        <div className="flex items-center space-x-4">
          {/* Notificações */}
          {isAuthenticated && (
            <div className="relative" ref={notificationsRef}>
              <button
                className="flex items-center text-gray-700 hover:text-pink-500 transition focus:outline-none"
                onClick={toggleNotifications}
              >
                <FaBell className={`w-6 h-6 cursor-pointer ${bgColor === "pink" ? "text-white" : "text-pink-500"}`} />
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
          )}


          {/* Condicional: Perfil ou Botões de Login/Cadastro */}
          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center text-white hover:text-pink-500 transition focus:outline-none"
                onClick={toggleProfileMenu}
                title="Abrir menu de perfil"
              >
                <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold shadow-md">
                  {/* Usando a imagem de perfil do usuário */}
                  <Image
                    src={userInfo?.companion?.profileImage} // Se não houver imagem, usar uma imagem padrão
                    alt="Perfil"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
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
                    {user ? (
                      <>
                        <p className="text-gray-800 font-semibold">{user.userName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </>
                    ) : (
                      <p className="text-gray-500">Carregando usuário...</p>
                    )}
                  </div>
                  <Link href="/dashboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-pink-100 transition">
                    Dashboard
                  </Link>

                  <Link href={`/perfil/${user ? user.userName : ''}`} className="flex items-center px-4 py-2 text-gray-700 hover:bg-pink-100 transition">
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
          ) : (
            <div className="flex items-center space-x-6">
              <button
                onClick={() => router.push('/cadastro')}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm rounded-full hover:from-pink-600 hover:to-purple-700 transition"
              >
                CADASTRE-SE
              </button>
              <button
                onClick={() => router.push('/login')}
                className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold text-sm rounded-full hover:bg-gray-300 transition"
              >
                LOGIN
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
