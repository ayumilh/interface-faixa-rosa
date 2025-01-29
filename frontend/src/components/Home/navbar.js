"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // Detecta rolagem para aplicar efeito na navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolling ? "bg-[#FFFFFF]" : "bg-[#FFFFFF]"
        }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/assets/logofaixa.png"
            alt="Faixa Rosa"
            width={120}
            height={48}
            className="h-14 w-auto transition-all duration-300 hover:scale-110"
            onClick={() => router.push("/")}
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <button onClick={() => router.push('/cadastro')} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Cadastro
          </button>
          <button onClick={() => router.push('/login')} className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-gray-300 hover:shadow-xl transition-all duration-300 hover:scale-105">
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800 transition-all duration-300 hover:scale-110"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? (
            <motion.svg
              initial={{ rotate: 0 }}
              animate={{ rotate: 180 }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              initial={{ rotate: 0 }}
              animate={{ rotate: 0 }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5M3.75 15h16.5" />
            </motion.svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "spring", duration: 0.4 }}
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex flex-col items-center justify-center z-40"
          >
            {/* Botão de Fechar */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 text-white text-3xl"
              aria-label="Fechar Menu"
            >
              ✖
            </button>

            {/* Itens do Menu */}
            <ul className="text-center space-y-6">
              <li>
                <button onClick={() => router.push('/cadastro')} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Cadastro
                </button>
              </li>
              <li>
                <button onClick={() => router.push('/login')} className="bg-gray-200 text-gray-800 text-lg font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-300 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Login
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
