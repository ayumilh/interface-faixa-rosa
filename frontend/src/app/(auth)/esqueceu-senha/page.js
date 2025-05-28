"use client";

import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import InputField from "@/components/ui/input/InputField";

export default function EsqueceuSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const [errorsInput, setErrorsInput] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || errorsInput.email) return;

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/esqueceu-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao solicitar redefinição de senha");

      toast.success("E-mail de redefinição enviado com sucesso!");
      setEmailSent(true);
      setCooldown(30);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value.trimStart();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(value);
    setErrorsInput((prev) => ({
      ...prev,
      email: regex.test(value) ? null : "E-mail inválido.",
    }));
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center lg:bg-left-center"
        style={{ backgroundImage: "url('/assets/chatGPT_background.png')" }}
      />
      <div
        className="hidden lg:block absolute inset-0 bg-no-repeat bg-cover"
        style={{ backgroundImage: "url('/assets/chatGPT_backgroundDesktop.png')" }}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4 lg:justify-end lg:p-6">
        <div className="w-full max-w-sm mx-auto bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/20 lg:max-w-md lg:mr-[80px] xl:mr-[120px] z-10 transition-all duration-300">
          <div className="text-center mb-6">
            <Image
              src="/assets/logofaixa.png"
              alt="Faixa Rosa Logo"
              width={160}
              height={0}
              className="mx-auto h-auto"
              style={{ maxHeight: "70px", objectFit: "contain" }}
            />
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mt-4">
              Esqueceu sua senha?
            </h2>
            <p className="text-gray-600 text-sm">
              Insira seu e-mail e enviaremos instruções para redefinir sua senha.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <InputField
                label="E-mail"
                name="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                error={errorsInput.email}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 text-gray-800"
              />
            </div>

            {emailSent ? (
              <div className="text-sm text-green-600 text-center">
                E-mail enviado! Verifique sua caixa de entrada.
                {cooldown > 0 ? (
                  <p className="mt-2 text-gray-500">Você poderá reenviar em {cooldown}s...</p>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="mt-3 w-full py-3 px-4 bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 text-white font-bold text-sm rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                  >
                    Reenviar e-mail
                  </button>
                )}
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading || errorsInput.email}
                className={`w-full py-3 px-4 bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 text-white font-bold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg relative overflow-hidden ${
                  loading || errorsInput.email ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-2xl'
                }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin h-4 w-4" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <span>Enviar Instruções</span>
                )}
              </button>
            )}
          </form>

          <div className="text-center mt-4 text-sm">
            Lembrou sua senha?{" "}
            <button
              onClick={() => router.push("/auth/login")}
              className="font-medium text-pink-500 hover:text-pink-600"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
