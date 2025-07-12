"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaSpinner, FaUser, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaUserPlus, FaShieldAlt } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import InputField from "@/components/ui/input/InputField";
import PasswordField from "@/components/ui/input/PasswordField";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorsInput, setErrorsInput] = useState({});
  const [inputClass, setInputClass] = useState('mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800');

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/sign-in/email`, {
        method: "POST",
        credentials: "include", // importante para salvar os cookies do backend
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Mapa de redirecionamento por tipo de usuário
        const pathMap = {
          CONTRATANTE: "/userDashboard",
          ACOMPANHANTE: "/dashboard",
          ADMIN: "/adminDashboard",
        };

        const redirectPath = pathMap[data.userType];

        if (redirectPath) {
          router.push(redirectPath);
        } else {
          toast.error("Tipo de usuário não reconhecido.");
          router.push("/"); // Redireciona para uma página padrão
        }
      } else {
        const json = await response.json();
        toast.error(json.message || "Credenciais inválidas");
      }
    } catch (error) {
      toast.error("Erro inesperado");
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
    const sanitizedValue = sanitizeInput(value, /[^a-zA-Z0-9!@#$%^&*]/g);
    setPassword(sanitizedValue);

    if (sanitizedValue.length >= 8 && sanitizedValue.length <= 128) {
      setErrorsInput((prevErrors) => {
        const { password, ...rest } = prevErrors;
        return rest;
      });
      setInputClass('mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800');
    } else {
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
      {/* Background Images */}
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center lg:bg-left-center"
        style={{
          backgroundImage: "url('/assets/chatGPT_background.png')",
        }}
      />
      <div
        className="hidden lg:block absolute inset-0 bg-no-repeat bg-cover"
        style={{
          backgroundImage: "url('/assets/chatGPT_backgroundDesktop.png')",
          backgroundPosition: "left center",
          backgroundSize: "cover",
        }}
      />

      {/* Floating elements */}
      <div className="absolute top-10 left-5 w-16 h-16 lg:top-20 lg:left-10 lg:w-32 lg:h-32 bg-gradient-to-br from-pink-200/10 to-purple-200/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-5 w-20 h-20 lg:bottom-20 lg:right-10 lg:w-40 lg:h-40 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-xl animate-pulse delay-1000"></div>

      {/* Login Form Container */}
      <div className="relative min-h-screen flex items-center justify-center p-4 lg:justify-end lg:p-6">
        <div className="w-full max-w-sm mx-auto bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/20 lg:max-w-md lg:mr-[80px] xl:mr-[120px] z-10 transition-all duration-300">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="relative group">
              <Image
                src="/assets/logofaixa.png"
                alt="Faixa Rosa Logo"
                width={160}
                height={0}
                className="mx-auto h-auto transition-all duration-300 group-hover:scale-105"
                style={{ maxHeight: "70px", objectFit: "contain" }}
              />
              <HiSparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping" />
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-1 lg:text-2xl">
                Bem-vindo de volta!
              </h2>
              <p className="text-gray-600 text-sm lg:text-base">
                Acesse sua conta para continuar
              </p>
            </div>
          </div>

          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl border border-pink-200/50 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <FaShieldAlt className="w-4 h-4 text-pink-500" />
              <h3 className="text-sm font-semibold text-gray-800 lg:text-base">Acesso Seguro</h3>
            </div>
            <p className="text-gray-600 text-xs lg:text-sm">
              Digite suas credenciais para acessar sua conta com total segurança
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-5">

            {/* Email Field */}
            <div className="space-y-1">
              <div className="relative w-full">
                <InputField
                  label="E-mail"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  error={errorsInput.email}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800 bg-white"
                />
                <div className="absolute top-1/2 left-3 transform -translate-y-1/2 pointer-events-none z-10">
                  <FaUser className="h-4 w-4 text-gray-400 mt-4" />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="relative w-full">
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
                  className="w-full pl-10 pr-12 py-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800 bg-white"
                />
                <div className="absolute top-1/2 left-3 transform -translate-y-1/2 pointer-events-none z-10">
                  <FaLock className="h-4 w-4 text-gray-400 mt-4" />
                </div>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex flex-col gap-2 pt-1 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
              <label className="flex items-center group cursor-pointer">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-3 w-3 text-pink-500 focus:ring-pink-400 border-gray-300 rounded transition-all duration-200 group-hover:scale-110"
                />
                <span className="ml-2 text-xs text-gray-700 group-hover:text-pink-600 transition-colors duration-200">
                  Lembrar de mim
                </span>
              </label>

              <Link
                href="esqueceu-senha"
                className="text-xs font-medium text-pink-500 hover:text-pink-600 transition-colors duration-200 hover:underline text-center lg:text-right"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 text-white font-bold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg relative overflow-hidden ${loading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-[1.02] hover:shadow-2xl hover:from-pink-600 hover:via-purple-600 hover:to-pink-500'
                }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin h-4 w-4" />
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <FaUser className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span>Entrar na Conta</span>
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}

              {/* Shimmer effect */}
              {!loading && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform skew-x-12 -translate-x-full group-hover:translate-x-full duration-1000"></div>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-500 rounded-full">ou</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/50">
              <p className="text-gray-600 text-xs mb-2">
                Novo no Faixa Rosa?
              </p>
              <button
                onClick={() => router.push("/registro")}
                className="w-full py-2 px-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm rounded-lg border-2 border-gray-200 hover:border-pink-300 transition-all duration-300 flex items-center justify-center gap-2 group hover:scale-[1.02] hover:shadow-lg"
              >
                <FaUserPlus className="w-3 h-3 text-pink-500 group-hover:scale-110 transition-transform duration-200" />
                <span>Criar Conta Gratuita</span>
                <HiSparkles className="w-3 h-3 text-yellow-500 group-hover:animate-pulse" />
              </button>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
              <FaShieldAlt className="w-3 h-3 text-green-500" />
              <span className="text-green-700 text-xs font-medium">
                Conexão 100% Segura
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}