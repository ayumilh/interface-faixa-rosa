"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaSpinner, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";

export default function ResetarSenhaPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [cooldown, setCooldown] = useState(30);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      setToken("");
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  // Cooldown para reenviar e-mail
  useEffect(() => {
    if (!canResend) {
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [canResend]);

  const handleResend = async () => {
    if (!email) return toast.error("Preencha o e-mail.");
    setCanResend(false);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/esqueceu-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao enviar e-mail");
      toast.success("E-mail enviado com sucesso!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getPasswordStrength = (password) => {
    if (password.length < 6) return "fraca";
    if (password.match(/[a-z]/) && password.match(/[A-Z]/) && password.match(/\d/) && password.length >= 8) return "forte";
    return "média";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("As senhas não coincidem.");

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/resetar-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao redefinir senha");

      toast.success("Senha redefinida com sucesso!");
      setTimeout(() => router.push("/login"), 3000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-no-repeat bg-cover bg-center lg:bg-left-center" style={{ backgroundImage: "url('/assets/chatGPT_background.png')" }} />
      <div className="hidden lg:block absolute inset-0 bg-no-repeat bg-cover" style={{ backgroundImage: "url('/assets/chatGPT_backgroundDesktop.png')", backgroundPosition: "left center", backgroundSize: "cover" }} />
      <div className="absolute top-10 left-5 w-16 h-16 lg:top-20 lg:left-10 lg:w-32 lg:h-32 bg-gradient-to-br from-pink-200/10 to-purple-200/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-5 w-20 h-20 lg:bottom-20 lg:right-10 lg:w-40 lg:h-40 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-xl animate-pulse delay-1000"></div>

      <div className="relative min-h-screen flex items-center justify-center p-4 lg:justify-end lg:p-6">
        <div className="w-full max-w-sm mx-auto bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/20 lg:max-w-md lg:mr-[80px] xl:mr-[120px] z-10 transition-all duration-300">
          <div className="text-center mb-6">
            <Image src="/assets/logofaixa.png" alt="Faixa Rosa Logo" width={160} height={0} className="mx-auto h-auto" style={{ maxHeight: "70px", objectFit: "contain" }} />
            <h2 className="text-xl font-bold text-pink-500 mt-4">{token ? "Redefinir Senha" : "Recuperar Acesso"}</h2>
            <p className="text-gray-600 text-sm">{token ? "Digite e confirme sua nova senha abaixo" : "Informe seu e-mail para receber o link de redefinição."}</p>
          </div>

          {token ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nova Senha */}
              <div className="space-y-1">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nova Senha</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 text-gray-800 bg-white"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 text-gray-400" />
                  </div>
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Força: <span className={
                  getPasswordStrength(newPassword) === "fraca" ? "text-red-500"
                    : getPasswordStrength(newPassword) === "forte" ? "text-green-600"
                    : "text-yellow-500"
                }>
                  {getPasswordStrength(newPassword)}
                </span></p>
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 text-gray-800 bg-white"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 text-gray-400" />
                  </div>
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {confirmPassword && (
                  <p className={`text-sm ${newPassword === confirmPassword ? "text-green-600" : "text-red-600"}`}>
                    {newPassword === confirmPassword ? "✔ Senhas coincidem" : "✖ Senhas não coincidem"}
                  </p>
                )}
              </div>

              {/* Botão */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 text-white font-bold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg relative overflow-hidden ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-2xl hover:from-pink-600 hover:via-purple-600 hover:to-pink-500'
                }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin h-4 w-4" />
                    <span>Redefinindo...</span>
                  </>
                ) : (
                  <span>Redefinir Senha</span>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <input
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 px-4 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 text-gray-800 bg-white"
              />
              <button
                onClick={handleResend}
                disabled={!canResend}
                className="w-full py-3 px-4 bg-pink-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
              >
                {canResend ? "Enviar link de redefinição" : `Aguarde ${cooldown}s`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
