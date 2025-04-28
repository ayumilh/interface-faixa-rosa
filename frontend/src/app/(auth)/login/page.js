"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from '@/context/AuthContext';
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import InputField from "@/components/ui/input/InputField";
import PasswordField from "@/components/ui/input/PasswordField";


export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorsInput, setErrorsInput] = useState({});
  const [inputClass, setInputClass] = useState('mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800');

  const router = useRouter();
  const { login, isAuthenticated, currentUser } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (!sessionStorage.getItem("loginToastShown")) {
        toast.success("Login realizado com sucesso!");
        sessionStorage.setItem("loginToastShown", "true");
      }

      const { userType } = currentUser;

      const pathMap = {
        CONTRATANTE: "/userDashboard",
        ACOMPANHANTE: "/dashboard",
        ADMIN: "/adminDashboard",
      };

      router.push(pathMap[userType] || "/login");
    }
  }, [isAuthenticated, currentUser, router]);


  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await login({ email, password });

    if (response?.status === 401 || response?.status === 404) {
      toast.error(response.message);
    } else if (!response?.token) {
      toast.error("Erro inesperado ao fazer login.");
    }

    setLoading(false);
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


  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Fundo padrão (mobile) */}
      <div
        className="block lg:hidden absolute inset-0 bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/chatGPT_background.png')",
        }}
      />

      {/* Fundo desktop */}
      <div
        className="hidden lg:block absolute inset-0 bg-no-repeat bg-cover"
        style={{
          backgroundImage: "url('/assets/chatGPT_backgroundDesktop.png')",
          backgroundPosition: "left center",
          backgroundSize: "cover",
        }}
      />

      {/* Formulário: no desktop, ficará no lado direito */}
      <div className="relative min-h-screen flex items-center justify-center lg:justify-end p-4">
        <div className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-md hover:shadow-2xl lg:ml-auto lg:mr-[250px] z-10">
          <div className="text-center mb-6">
            <Image
              src="/assets/logofaixa.png"
              alt="Faixa Rosa Logo"
              width={160}
              height={0}
              className="mx-auto h-auto"
              style={{ maxHeight: "80px", objectFit: "contain" }}
            />
            <h2 className="text-2xl font-semibold text-pink-500 mt-4">
              Acesse sua conta
            </h2>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <InputField
              label="E-mail"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              error={errorsInput.email}
            />


              <PasswordField
                label="Senha"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                show={showPassword}
                toggleShow={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                required
                error={errorsInput.password}
              />

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
                    href="esqueceu-senha"
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
              onClick={() => router.push("/registro")}
              className="font-medium text-pink-500 hover:text-pink-600"
            >
              Cadastre-se
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}