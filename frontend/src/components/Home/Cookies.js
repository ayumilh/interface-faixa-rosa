"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { ShieldCheck, Cookie, CheckCircle } from "phosphor-react"; // Ícones

export default function Cookies() {
  const [showWarning, setShowWarning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const lastAcceptedTime = localStorage.getItem("cookiesAcceptedAt");
    const currentTime = new Date().getTime();

    if (!lastAcceptedTime || currentTime - lastAcceptedTime > 30 * 60 * 1000) {
      setShowWarning(true);
    }
  }, []);

  const handleAgree = async () => {
    try {
      const { data } = await axios.get("https://api64.ipify.org?format=json");
      localStorage.setItem("userIP", data.ip);
    } catch (error) {
      console.error("Erro ao capturar IP:", error);
    }

    localStorage.setItem("cookiesAcceptedAt", new Date().getTime());
    setShowWarning(false);
  };

  return (
    showWarning && (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
      >
        <div className="relative bg-[#1F1F1F] text-white p-6 md:p-8 rounded-lg shadow-2xl border border-gray-700 w-full max-w-md mx-auto bg-opacity-90">
          {/* Título */}
          <div className="flex items-center justify-center space-x-2 text-pink-500">
            <ShieldCheck size={28} />
            <h2 className="text-2xl font-bold text-white">CONTEÚDO ADULTO</h2>
          </div>

          {/* Descrição */}
          <p className="text-gray-300 text-sm text-center leading-relaxed mt-4">
            O <span className="font-bold text-pink-500">Faixa Rosa</span> apresenta{" "}
            <strong>conteúdo explícito</strong> destinado a <strong>adultos</strong>.
          </p>

          {/* Aviso de Cookies e LGPD */}
          <div className="flex items-center justify-center space-x-2 text-gray-300 text-sm mt-3">
            <Cookie size={20} />
            <span>
              Utilizamos cookies em conformidade com a <strong>LGPD</strong> para melhorar sua experiência.
            </span>
          </div>

        {/* Aviso de Concordância */}
<p className="text-xs text-gray-500 text-center mt-2">
  Ao clicar em <strong>&quot;Concordo&quot;</strong>, você confirma que é maior de idade e concorda com nossa{" "}
  <button
    onClick={() => router.push("/termos")}
    className="text-pink-500 font-semibold underline hover:text-pink-400 transition duration-200"
  >
    Política de Privacidade e Termos de Uso.
  </button>
  .
</p>


          {/* Botão de Concordância */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleAgree}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-400 px-6 py-2 rounded-full font-bold text-white shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <CheckCircle size={20} />
              CONCORDO
            </button>
          </div>
        </div>
      </motion.div>
    )
  );
}
    