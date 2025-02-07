"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from '@/context/AuthContext';
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/image";
import WithGoogle from "@/components/Auth/WithGoogle";
import { FaCheck } from "react-icons/fa";
import { signIn } from 'next-auth/react';
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import Link from "next/link";
import { searchUserId } from "@/utils/searchUserId";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dataNascimento, setDataNascimento] = useState(null);
  const [cpf, setCpf] = useState("");
  const [isCpfValid, setIsCpfValid] = useState(null);
  const [userType, setUserType] = useState("CONTRATANTE");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [errorsInput, setErrorsInput] = useState({});
  const [loadingCpf, setLoadingCpf] = useState(null);
  const [locale, setLocale] = useState("pt-br");
  const [isFormValid, setIsFormValid] = useState(false);
  const [inputClass, setInputClass] = useState('mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800');

  const router = useRouter();

  const { login, isAuthenticated, currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Verifica se o toast já foi exibido
      if (!sessionStorage.getItem("loginToastShown")) {
        toast.success("Login realizado com sucesso!");
        sessionStorage.setItem("loginToastShown", "true");
        router.push(currentUser.userType === "CONTRATANTE" ? "/userDashboard" : "/dashboard");
      }
    }
  }, [isAuthenticated, currentUser, router]);

  // Detecta o idioma do usuário
  useEffect(() => {
    const userLocale = navigator.language.toLowerCase();
    const supportedLocales = ["pt-br", "en", "es", "fr"];

    if (supportedLocales.includes(userLocale)) {
      setLocale(userLocale);
    } else {
      setLocale("pt-br"); // Padrão: Português
    }
  }, []);

  useEffect(() => {
    setIsFormValid(
      firstName.trim().length >= 3 &&
      lastName.trim().length >= 3 &&
      phone.length === 11 &&
      email.includes("@") &&
      cpf.length === 11 &&
      dataNascimento &&
      password.length >= 8 &&
      userType !== "" &&
      isCpfValid === true
    );
  }, [firstName, lastName, phone, email, cpf, dataNascimento, password, userType, isCpfValid]);

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setLoading(true);

    if (type === "login") {
      console.log({ email, password });
      try {
        const response = await login({ email, password });

        console.log(response);

        // vericação do next-auth
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false
        });
        if (result?.error) {
          toast.error('Usuário não encontrado. Por favor, verifique as informações inseridas e tente novamente');
          return
        }
        if (response) {
          const { userType } = response;
          router.push(userType === "CONTRATANTE" ? "/userDashboard" : "/dashboard");
        }

      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }

    } else if (type === "register") {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/register`,
          { firstName, lastName, email, password, phone, cpf, userType },
          { withCredentials: true }
        );

        const data = res.data;

        if (res.status !== 200 && res.status !== 201) {
          toast.error(data.message || "Erro no cadastro");
        }

        toast.success("Cadastro realizado com sucesso!");

        setTimeout(() => {
          router.push("/login");
          toast.info("Por favor, faça login com suas credenciais.");
        }, 1200);
      } catch (error) {
        if (error.response) {
          switch (error.response.status) {
            case 400:
              toast.error(
                "Requisição inválida. Verifique os dados e tente novamente."
              );
              break;
            case 401:
              toast.error(
                "Não autorizado. Verifique suas credenciais."
              );
              break;
            case 403:
              toast.error(
                "Proibido. Você não tem permissão para realizar esta ação."
              );
              break;
            case 404:
              toast.error("Recurso não encontrado.");
              break;
            case 500:
              toast.error(
                "Erro interno do servidor. Tente novamente mais tarde."
              );
              break;
            default:
              toast.error(
                error.response.data.message || "Erro desconhecido."
              );
          }
        } else if (error.request) {
          toast.error(
            "Sem resposta do servidor. Verifique sua conexão."
          );
        } else {
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    }
  };
  const handleLoginSubmit = (e) => handleSubmit(e, "login");
  const handleRegisterSubmit = (e) => handleSubmit(e, "register");


  // Função para alternar entre as páginas de Login e Cadastro
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };


  // Função para sanitizar os inputs
  const sanitizeInput = (value, regex, shouldTrim = true) => {
    const sanitizedValue = shouldTrim ? value.trim().replace(regex, '') : value.replace(regex, '');
    return sanitizedValue;
  };

  const handleFirstNameChange = (e) => {
    const value = e.target.value.trimStart();
    const regex = /[^a-zA-ZÀ-ÿ\s'-]/g;
    const sanitizedValue = sanitizeInput(value, regex, false);
  
    setFirstName(sanitizedValue);

    setErrorsInput((prevErrors) => {
      const { firstName, ...rest } = prevErrors;
      return rest;
    });
  };
  const handleFirstNameBlur = () => {
    if (firstName === '') {
      setErrorsInput((prevErrors) => ({
        ...prevErrors,
        firstName: "Nome é obrigatório.",
      }));
    } else {
      setErrorsInput((prevErrors) => {
        const { firstName, ...rest } = prevErrors;
        return rest;
      });
    }
  };


  const handleLastNameChange = (e) => {
    const value = e.target.value.trimStart();
    const regex = /[^a-zA-ZÀ-ÿ\s'-]/g;
    const sanitizedValue = sanitizeInput(value, regex, false);

    setLastName(sanitizedValue);

    setErrorsInput((prevErrors) => {
      const { lastName, ...rest } = prevErrors;
      return rest;
    });
  };
  const handleLastNameBlur = () => {
    if (lastName === '') {
      setErrorsInput((prevErrors) => ({
        ...prevErrors,
        lastName: "Sobrenome é obrigatório.",
      }));
    } else {
      setErrorsInput((prevErrors) => {
        const { lastName, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.trimStart();
    const regex = /[^0-9]/g;
    const sanitizedValue = sanitizeInput(value, regex);

    setPhone(sanitizedValue);

    if (value !== sanitizedValue) {
      setErrorsInput((prevErrors) => {
        const { phone, ...rest } = prevErrors;
        return rest;
      });
      setInputClass('mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800');
    } else {
      setErrorsInput((prevErrors) => ({
        ...prevErrors,
        phone: 'Número de telefone inválido. Apenas números são permitidos.',
      }));
      setInputClass('mt-1 block w-full px-4 py-2 border border-red-500 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-200 text-gray-800');
    }
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

  const handleCpfChange = (e) => {
    const value = e.target.value.trimStart();
    const regex = /[^0-9]/g;
    const sanitizedValue = sanitizeInput(value, regex);

    setCpf(sanitizedValue);

    if (sanitizedValue.length < 11) {
      // 🔥 Ainda digitando (não exibe erro)
      setIsCpfValid(null);
      setErrorsInput((prevErrors) => {
        const { cpf, ...rest } = prevErrors;
        return rest;
      });
    } else if (sanitizedValue.length === 11) {
      // 🔥 CPF completo → Agora validamos
      if (!/^\d{11}$/.test(sanitizedValue)) {
        setIsCpfValid(false);
        setErrorsInput((prevErrors) => ({
          ...prevErrors,
          cpf: "CPF inválido. Deve conter exatamente 11 números.",
        }));
      } else {
        setErrorsInput((prevErrors) => {
          const { cpf, ...rest } = prevErrors;
          return rest;
        });
      }
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

  // Função para verificar se o CPF é válido
  const verifyCpf = async () => {
    if (cpf.length !== 11 || !dataNascimento) {
      setErrorsInput((prevErrors) => ({
        ...prevErrors,
        cpf: "CPF e data de nascimento são obrigatórios.",
      }));
      return;
    }

    console.log({ cpf, dataNascimento });

    const token = searchUserId();

    setLoadingCpf(true);
    setIsCpfValid(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/verify-cpf`,
        {
          cpf: cpf,
          data_nascimento: dataNascimento,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      if (response.data.maior_de_idade) {
        setIsCpfValid(true);
        setErrorsInput((prevErrors) => {
          const { cpf, ...rest } = prevErrors;
          return rest;
        });
      } else {
        setIsCpfValid(false);
        setErrorsInput((prevErrors) => ({
          ...prevErrors,
          cpf: "CPF inválido ou menor de idade.",
        }));
      }
    } catch (error) {
      setIsCpfValid(false);
      setErrorsInput((prevErrors) => ({
        ...prevErrors,
        cpf: "Erro ao verificar CPF.",
      }));
    } finally {
      setLoadingCpf(false);
    }
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

            <WithGoogle loginType="login" />

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
            <form onSubmit={handleRegisterSubmit} className="space-y-6 mb-6">
              {/* Nome */}
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
                    onChange={handleFirstNameChange}
                    onBlur={handleFirstNameBlur}
                    maxLength={50}
                    required
                    title="Por favor, insira apenas letras. São permitidos espaços, hifens e apóstrofos."
                    autoComplete="off"
                    className={inputClass}
                  />
                  {errorsInput.firstName && (
                    <p className="text-red-500 relative text-sm mt-1">{errorsInput.firstName}</p>
                  )}
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
                    onChange={handleLastNameChange}
                    onBlur={handleLastNameBlur}
                    maxLength={100}
                    required
                    title="Por favor, insira apenas letras. São permitidos espaços, hifens e apóstrofos."
                    autoComplete="off"
                    className={inputClass}
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
                  onChange={handlePhoneChange}
                  required
                  maxLength={11}
                  pattern="[0-9]{11}"
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
                  onChange={handleEmailChange}
                  maxLength={320}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800"
                />
              </div>

              {/* Data de Nascimento */}
              <div>
                <label htmlFor="data_nascimento" className="block text-sm font-medium text-gray-700">
                  Data de Nascimento
                </label>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
                  <DatePicker
                    value={dataNascimento ? dayjs(dataNascimento, "DD/MM/YYYY") : null}
                    onChange={(newValue) => {
                      if (newValue) {
                        setDataNascimento(dayjs(newValue).format("DD/MM/YYYY"));
                      }
                    }}
                    format="DD/MM/YYYY"
                    disableFuture
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        error: !!errorsInput.dataNascimento,
                        helperText: errorsInput.dataNascimento || "",
                        className:
                          "mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800",
                      },
                    }}
                  />
                </LocalizationProvider>
                {errorsInput.dataNascimento && (
                  <p className="text-red-500 text-sm mt-1">{errorsInput.dataNascimento}</p>
                )}
              </div>

              {/* CPF */}
              <div>
                <label
                  htmlFor="cpf"
                  className="block text-sm font-medium text-gray-700"
                >
                  CPF
                </label>
                <div className="relative">
                  <input
                    id="cpf"
                    name="cpf"
                    type="text"
                    value={cpf}
                    onChange={handleCpfChange}
                    required
                    maxLength={11}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={verifyCpf}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-pink-500 text-white px-3 py-1 rounded-md hover:bg-pink-600 transition duration-200"
                  >
                    {loadingCpf ? <FaSpinner className="animate-spin" /> : "Verificar"}
                  </button>
                </div>
                {isCpfValid !== null && (
                  <p className={`mt-1 text-sm ${isCpfValid ? "text-green-500" : "text-red-500"}`}>
                    {isCpfValid ? "CPF válido e maior de idade" : "CPF inválido ou menor de idade"}
                  </p>
                )}
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
                  onChange={handlePasswordChange}
                  required
                  maxLength={128}
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
                  disabled={!isFormValid || loading}
                  className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                    ${isFormValid ? "bg-pink-500 hover:bg-pink-600 focus:ring-pink-500" : "bg-pink-400 cursor-not-allowed"} 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 transition`}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin h-5 w-5" />
                  ) : (
                    "Cadastrar"
                  )}
                </button>
              </div>
            </form>

            <WithGoogle loginType="cadastro" />

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
