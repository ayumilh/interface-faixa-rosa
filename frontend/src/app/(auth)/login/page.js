"use client";
import { useState } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [userType, setUserType] = useState("CONTRATANTE");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setLoading(true);

    console.log({ firstName, lastName, email, password, phone, cpf, userType });
    console.log({ email, password });
    console.log({ type });

    try {
      let res;
      if (type === "login") {
        res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
          { email, password },
          { withCredentials: true }
        );
      } else if (type === "register") {
        res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
          { firstName, lastName, email, password, phone, cpf, userType },
          { withCredentials: true }
        );
      }

      const data = res.data;

      if (res.status !== 200) {
        throw new Error(data.message || "Erro no login");
      }

      if (type === "login") {
        localStorage.setItem("token", data.token);
        toast.success("Login realizado com sucesso!");
        if (userType === "CONTRATANTE") {
          router.push("/userDashboard");
        } else if (userType === "ACOMPANHANTE") {
          router.push("/dashboard");
        }
      } else if (type === "register") {
        toast.success("Cadastro realizado com sucesso!");
        setTimeout(() => {
          router.push("/auth/login");
          toast.info("Por favor, faça login com suas credenciais.");
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            toast.error("Requisição inválida. Verifique os dados e tente novamente.");
            break;
          case 401:
            toast.error("Não autorizado. Verifique suas credenciais.");
            break;
          case 403:
            toast.error("Proibido. Você não tem permissão para realizar esta ação.");
            break;
          case 404:
            toast.error("Recurso não encontrado.");
            break;
          case 500:
            toast.error("Erro interno do servidor. Tente novamente mais tarde.");
            break;
          default:
            toast.error(error.response.data.message || "Erro desconhecido.");
        }
      } else if (error.request) {
        setError("Sem resposta do servidor. Verifique sua conexão.");
        toast.error("Sem resposta do servidor. Verifique sua conexão.");
      } else {
        setError(error.message);
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Para login
  const handleLoginSubmit = (e) => handleSubmit(e, "login");

  // Para cadastro
  const handleRegisterSubmit = (e) => handleSubmit(e, "register");

  // Função para alternar entre as páginas de Login e Cadastro
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/assets/background.svg')" }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
        {isLogin ? (
          // Formulário de Login
          <>
            <div className="text-center mb-6">
              <Image
                src="/assets/logofaixa.png"
                alt="Faixa Rosa Logo"
                width={160}
                height={64}
                className="mx-auto h-16"
              />
              <h2 className="text-2xl font-semibold text-pink-500 mt-4">
                Acesse sua conta
              </h2>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-6">
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 text-pink-500 focus:ring-pink-400 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember_me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Lembrar de mim
                  </label>
                </div>
                <div className="text-sm">
                  <Link
                    href="/auth/esqueceu-senha"
                    className="font-medium text-pink-500 hover:text-pink-600"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin h-5 w-5" />
                  ) : (
                    "Entrar"
                  )}
                </button>
              </div>
            </form>

            <div className="text-center mt-4 text-sm">
              Novo no Faixa Rosa?{" "}
              <button
                onClick={toggleAuthMode}
                className="font-medium text-pink-500 hover:text-pink-600"
              >
                Cadastre-se
              </button>
            </div>
          </>
        ) : (
          // Formulário de Cadastro
          <>
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
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
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
                  maxLength={11}
                  minLength={11}
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
                    className={`w-1/2 py-2 px-4 border rounded-lg shadow-sm focus:outline-none transition duration-200 ${userType === "CONTRATANTE"
                      ? "bg-pink-500 text-white border-pink-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    Contratante
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("ACOMPANHANTE")}
                    className={`w-1/2 py-2 px-4 border rounded-lg shadow-sm focus:outline-none transition duration-200 ${userType === "ACOMPANHANTE"
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
                onClick={toggleAuthMode}
                className="font-medium text-pink-500 hover:text-pink-600"
              >
                Entrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
