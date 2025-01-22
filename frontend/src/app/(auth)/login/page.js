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
  const [errorsInput, setErrorsInput] = useState({});
  const [inputClass, setInputClass] = useState('mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800');

  const router = useRouter();

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setLoading(true);

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

      if (res.status !== 200 && res.status !== 201) {
        throw new Error(data.message || "Erro ao realizar ação.");
      }

      if (type === "login") {
        toast.success("Login realizado com sucesso!");
        localStorage.setItem("token", data.token);

        if (userType === "CONTRATANTE") {
          router.push("/userDashboard");
        } else if (userType === "ACOMPANHANTE") {
          router.push("/dashboard");
        }

      } else if (type === "register") {
        toast.success("Cadastro realizado com sucesso!");

        setTimeout(() => {
          router.push("/login");
          toast.info("Por favor, faça login com suas credenciais.");
        }, 1200);
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            toast.error("Requisição inválida. Verifique os dados e tente novamente.");
            // informar se ja tem email ou cpf cadastrado
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
        toast.error("Sem resposta do servidor. Verifique sua conexão.");
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
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

    if (sanitizedValue === '') {
      setErrorsInput((prevErrors) => {
        const { firstName, ...rest } = prevErrors;
        return rest;
      });
    } else if (sanitizedValue.length <= 50) {
      setErrorsInput((prevErrors) => {
        const { firstName, ...rest } = prevErrors;
        return rest; // Remove o erro do estado
      });
    } else {
      setErrorsInput((prevErrors) => ({
        ...prevErrors,
        firstName: 'Nome inválido. Apenas letras, espaços, hifens e apóstrofos são permitidos.',
      }));
    }
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value.trimStart();
    const regex = /[^a-zA-ZÀ-ÿ\s'-]/g;
    const sanitizedValue = sanitizeInput(value, regex, false);

    setLastName(sanitizedValue);

    if (value !== sanitizedValue) {
      setInputClass('mt-1 block w-full px-4 py-2 border border-red-500 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-200 text-gray-800');
    } else {
      setInputClass('mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800');
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
  
    if (value != sanitizedValue) {
      setErrorsInput((prevErrors) => {
        const { cpf, ...rest } = prevErrors;
        return rest;
      });
      setInputClass('mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800');
    } else {
      setErrorsInput((prevErrors) => ({
        ...prevErrors,
        cpf: 'CPF inválido. Deve conter exatamente 11 números.',
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
                    onChange={handleFirstNameChange}
                    maxLength={50}
                    minLength={3}
                    required
                    pattern="[a-zA-ZÀ-ÿ\s'-]{3,50}"
                    title="Por favor, insira apenas letras. São permitidos espaços, hifens e apóstrofos."
                    autoComplete="off"
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm transition duration-200 text-gray-800 ${
                      errorsInput.firstName
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-pink-500 focus:border-pink-500'
                    }`}
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
                    maxLength={100}
                    minLength={3}
                    required
                    pattern="[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]{3,100}"
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
                  minLength={11}
                  pattern="\d{11}"
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
                  onChange={handleCpfChange}
                  required
                  maxLength={11}
                  minLength={11}
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
                  onChange={handlePasswordChange}
                  required
                  maxLength={128}
                  minLength={8}
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
