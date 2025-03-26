"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from '@/context/AuthContext';
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorsInput, setErrorsInput] = useState({});
  const [inputClass, setInputClass] = useState('mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800');

  const router = useRouter();
  const { login, isAuthenticated, currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Verifica se o toast já foi exibido
      if (!sessionStorage.getItem("loginToastShown")) {
        toast.success("Login realizado com sucesso!");
        sessionStorage.setItem("loginToastShown", "true");
      }

      // Redireciona conforme o tipo de usuário
      if (currentUser.userType === "CONTRATANTE") {
        router.push("/userDashboard");
      } else if (currentUser.userType === "ACOMPANHANTE") {
        router.push("/dashboard");
      } else if (currentUser.userType === "ADMIN") {
        router.push("/adminDashboard");
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, currentUser, router]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login({ email, password });

      if (response?.status === 401) {
        // Se o erro for 401, exibe a mensagem de erro no toast
        toast.error(response.message);
    } else if (response?.token) {
        const { userType } = response;
        if (userType === "CONTRATANTE") {
            router.push("/userDashboard");
        } else if (userType === "ACOMPANHANTE") {
            router.push("/dashboard");
        } else if (userType === "ADMIN") {
            router.push("/adminDashboard");
        } else {
            router.push("/login");
        }
    }

    
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const sanitizeInput = (value, regex, shouldTrim = true) => {
    const sanitizedValue = shouldTrim ? value.trim().replace(regex, '') : value.replace(regex, '');
    return sanitizedValue;
};

  const handleEmailChange = (e) => {
    const value = e.target.value.trimStart();
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const sanitizedValue = sanitizeInput(value, /[^a-zA-Z0-9._@-]/g);

    setEmail(sanitizedValue);

    if (regex.test(sanitizedValue)) {
      setErrorsInput((prevErrors) => {
        const { email, ...rest } = prevErrors;
        return rest;
      });
      setInputClass('mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800');
    } else {
      setErrorsInput((prevErrors) => ({
        ...prevErrors,
        email: 'Email inválido. Por favor, insira um endereço de email válido.',
      }));
      setInputClass('mt-1 block w-full px-4 py-2 border border-red-500 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-200 text-gray-800');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    // Sanitiza o valor, permitindo apenas letras, números e caracteres especiais comuns para senhas
    const sanitizedValue = sanitizeInput(value, /[^a-zA-Z0-9!@#$%^&*]/g);

    // Atualiza o estado com o valor sanitizado
    setPassword(sanitizedValue);

    // Verifica a validade da senha
    if (sanitizedValue.length >= 8 && sanitizedValue.length <= 128) {
      // Senha válida
      setErrorsInput((prevErrors) => {
        const { password, ...rest } = prevErrors;
        return rest; // Remove o erro do estado
      });
      setInputClass('mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800');
    } else {
      // Senha inválida
      setErrorsInput((prevErrors) => ({
        ...prevErrors,
        password: 'Senha inválida. Deve conter entre 8 e 128 caracteres e apenas letras, números ou caracteres especiais.',
      }));
      setInputClass('mt-1 block w-full px-4 py-2 border border-red-500 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-200 text-gray-800');
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
              onChange={handleEmailChange}
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
              onChange={handlePasswordChange}
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
                href="#"
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
            onClick={() => router.push("/cadastro")}
            className="font-medium text-pink-500 hover:text-pink-600"
          >
            Cadastre-se
          </button>
        </div>
      </div>
    </div>
  );
}
