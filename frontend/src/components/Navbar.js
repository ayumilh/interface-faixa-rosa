"use client";
import { useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaBell, FaUser, FaCog, FaSearch, FaSignOutAlt } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import Image from "next/image";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { Transition } from "@headlessui/react";

export default function Navbar({ bgColor = "pink" }) {
  const { logout, userInfo, isAuthenticated, loadingUserInfo } = useContext(AuthContext);
  const profileRef = useRef();
  const notificationsRef = useRef();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

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
  };

  const handleLogoClick = () => {
    router.push(userInfo?.userType === "CONTRATANTE" ? "/" : "/dashboard");
  };

  const logoSrc = bgColor === "white" ? "/assets/logofaixa.png" : "/assets/FaixaRosaSombra.png";
  const backgroundClass = bgColor === "white" 
    ? "bg-white/95 backdrop-blur-md border-b border-gray-200/50" 
    : "bg-gradient-to-r from-pink-600/95 via-pink-500/95 to-purple-600/95 backdrop-blur-md border-b border-white/10";

  if (loadingUserInfo) {
    return (
      <header className={`w-full fixed top-0 left-0 z-50 ${backgroundClass} shadow-lg`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="relative group">
              <Image
                src={logoSrc}
                alt="Logo"
                width={120}
                height={48}
                className="h-12 w-auto mr-2 cursor-pointer transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-lg"
                onClick={handleLogoClick}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full animate-pulse"></div>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full animate-pulse delay-75"></div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className={`w-full fixed top-0 left-0 z-50 ${backgroundClass} shadow-xl`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center">
          <div className="relative group">
            <Image
              src={logoSrc}
              alt="Logo"
              width={120}
              height={48}
              className="h-12 w-auto mr-2 cursor-pointer transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-2xl"
              onClick={handleLogoClick}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10 blur-xl"></div>
            <HiSparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
          </div>
        </div>

        {/* Right Side of Navbar */}
        <div className="flex items-center space-x-6">
          {/* Notificações */}
          {!loadingUserInfo && isAuthenticated && (
            <div className="relative" ref={notificationsRef}>
              <button
                className={`relative p-3 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12 focus:outline-none group ${
                  bgColor === "pink" 
                    ? "text-white hover:bg-white/10 hover:shadow-lg" 
                    : "text-pink-500 hover:bg-pink-50 hover:shadow-md"
                }`}
                onClick={toggleNotifications}
              >
                <FaBell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150"></div>
              </button>

              {/* Menu de Notificações */}
              <Transition
                show={showNotifications}
                enter="transition ease-out duration-300"
                enterFrom="transform opacity-0 scale-90 translate-y-2"
                enterTo="transform opacity-100 scale-100 translate-y-0"
                leave="transition ease-in duration-200"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <FaBell className="w-4 h-4" />
                      Notificações
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-center h-20 text-gray-500">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <FaBell className="w-5 h-5 text-pink-400" />
                        </div>
                        <p className="text-sm font-medium">Nenhuma notificação</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          )}

          {/* Condicional: Perfil ou Botões de Login/Cadastro */}
          {!loadingUserInfo && isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                className="relative group focus:outline-none"
                onClick={toggleProfileMenu}
                title="Abrir menu de perfil"
              >
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-110">
                    {userInfo?.companion?.profileImage ? (
                      <Image
                        src={userInfo.companion.profileImage}
                        alt="Imagem de Perfil"
                        width={44}
                        height={44}
                        className="rounded-full w-11 h-11 object-cover border-2 border-white/20"
                      />
                    ) : (
                      <span className="text-lg font-bold">
                        {userInfo?.userType === "ADMIN"
                          ? userInfo?.firstName?.charAt(0).toUpperCase()
                          : userInfo?.userName?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400/30 to-purple-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150 animate-pulse"></div>
                </div>
              </button>

              {/* Menu de Perfil */}
              <Transition
                show={showProfileMenu}
                enter="transition ease-out duration-300"
                enterFrom="transform opacity-0 scale-90 translate-y-2"
                enterTo="transform opacity-100 scale-100 translate-y-0"
                leave="transition ease-in duration-200"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4">
                    {loadingUserInfo ? (
                      <div className="text-white/80 animate-pulse">Carregando usuário...</div>
                    ) : userInfo ? (
                      <div className="text-white">
                        <p className="font-bold text-lg">
                          {userInfo.userType === 'ADMIN' ? userInfo.first : userInfo.userName}
                        </p>
                        <p className="text-sm text-white/80 truncate">{userInfo.email}</p>
                      </div>
                    ) : (
                      <p className="text-white/80">Usuário não encontrado.</p>
                    )}
                  </div>
                  
                  {!loadingUserInfo && userInfo && (
                    <div className="py-2">
                      {userInfo.userType === 'ACOMPANHANTE' && (
                        <>
                          <Link
                            href="/dashboard"
                            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 group"
                          >
                            <FaCog className="w-4 h-4 mr-3 text-pink-500 group-hover:rotate-180 transition-transform duration-300" />
                            <span className="font-medium">Dashboard</span>
                          </Link>

                          <Link
                            href={`/perfil/${userInfo?.userName || ''}`}
                            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 group"
                          >
                            <FaUser className="w-4 h-4 mr-3 text-pink-500 group-hover:scale-110 transition-transform duration-200" />
                            <span className="font-medium">Perfil</span>
                          </Link>
                        </>
                      )}

                      {userInfo.userType === 'ADMIN' && (
                        <>
                          <Link
                            href="/adminDashboard"
                            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 group"
                          >
                            <FaCog className="w-4 h-4 mr-3 text-pink-500 group-hover:rotate-180 transition-transform duration-300" />
                            <span className="font-medium">Painel Admin</span>
                          </Link>

                          <Link
                            href="/"
                            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 group"
                          >
                            <HiSparkles className="w-4 h-4 mr-3 text-pink-500 group-hover:scale-110 transition-transform duration-200" />
                            <span className="font-medium">Início</span>
                          </Link>
                        </>
                      )}

                      <Link
                        href="/search"
                        className="flex items-center px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 group"
                      >
                        <FaSearch className="w-4 h-4 mr-3 text-pink-500 group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-medium">Search</span>
                      </Link>

                      <div className="border-t border-gray-200/50 mt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-6 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 group"
                        >
                          <FaSignOutAlt className="w-4 h-4 mr-3 group-hover:translate-x-1 transition-transform duration-200" />
                          <span className="font-medium">Sair</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Transition>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/registro')}
                className="relative px-8 py-3 bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 text-white font-bold text-sm rounded-full overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                <span className="relative z-10">CADASTRE-SE</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -top-1 -left-1 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
              
              <button
                onClick={() => router.push('/login')}
                className="relative px-8 py-3 bg-white/90 backdrop-blur-sm text-gray-800 font-bold text-sm rounded-full border-2 border-gray-200/50 overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-pink-300"
              >
                <span className="relative z-10 group-hover:text-pink-600 transition-colors duration-200">LOGIN</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}