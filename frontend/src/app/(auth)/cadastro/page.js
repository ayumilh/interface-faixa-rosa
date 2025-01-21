// (auth)/cadastro/page.js
"use client";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CadastroPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [userType, setUserType] = useState("CONTRATANTE");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = "/api/auth/cadastro";
    const payload = { firstName, lastName, email, password, phone, cpf, userType };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
        { email, password },
        { withCredentials: true }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro no cadastro");
      }

      toast.success("Cadastro realizado com sucesso!");
      // Após cadastro bem-sucedido, redireciona para a página de login após um breve delay
      setTimeout(() => {
        router.push("/auth/login");
        toast.info("Por favor, faça login com suas credenciais.");
      }, 2000);
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
            Crie sua conta
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome Completo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                Nome
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Sobrenome
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800"
              />
            </div>
          </div>

          {/* Telefone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Telefone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800"
            />
          </div>

          {/* Email */}
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

          {/* CPF */}
          <div>
            <label
              htmlFor="cpf"
              className="block text-sm font-medium text-gray-700"
            >
              CPF
            </label>
            <input
              id="cpf"
              name="cpf"
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800"
            />
          </div>

          {/* Senha */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800"
            />
          </div>

          {/* Seletor de Tipo de Usuário */}
          <div>
            <label
              htmlFor="userType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Você é
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setUserType("CONTRATANTE")}
                className={`w-1/2 py-2 px-4 border rounded-lg shadow-sm focus:outline-none transition duration-200 ${
                  userType === "CONTRATANTE"
                    ? "bg-pink-500 text-white border-pink-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                Contratante
              </button>
              <button
                type="button"
                onClick={() => setUserType("ACOMPANHANTE")}
                className={`w-1/2 py-2 px-4 border rounded-lg shadow-sm focus:outline-none transition duration-200 ${
                  userType === "ACOMPANHANTE"
                    ? "bg-pink-500 text-white border-pink-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                Acompanhante
              </button>
            </div>
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
                "Cadastrar"
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4 text-sm">
          Já tem uma conta?{" "}
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
