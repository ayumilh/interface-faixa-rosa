// (auth)/esqueceu-senha/page.js
"use client";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function EsqueceuSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = "/api/auth/esqueceu-senha";
    const payload = { email };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao solicitar redefinição de senha");
      }

      toast.success("E-mail de redefinição de senha enviado com sucesso!");
      // Após o sucesso, você pode redirecionar o usuário ou limpar o formulário
      setEmail("");
      // Opcionalmente, redirecionar para a página de login após um breve delay
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/assets/background.svg')" }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <Image
            src="/assets/logofaixa.png"
            alt="Faixa Rosa Logo"
            width={160}
            height={64}
            className="mx-auto h-16"
          />
          <h2 className="text-2xl font-semibold text-pink-500 mt-4">
            Esqueceu sua senha?
          </h2>
          <p className="mt-2 text-gray-700">
            Insira seu e-mail e enviaremos instruções para redefinir sua senha.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de E-mail */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800"
            />
          </div>

          {/* Botão de Enviar */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition"
            >
              {loading ? (
                <FaSpinner className="animate-spin h-5 w-5" />
              ) : (
                "Enviar Instruções"
              )}
            </button>
          </div>
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
  );
}
