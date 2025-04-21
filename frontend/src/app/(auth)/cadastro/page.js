"use client";

import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/image";

import "dayjs/locale/pt-br";
import { useRouter } from "next/navigation";
import axios from "axios";
import { searchUserId } from "@/utils/searchUserId";


// UI components
import CpfField from "@/components/ui/input/CpfField";
import InputField from "@/components/ui/input/InputField";
import DateField from "@/components/ui/input/DateField";
import PasswordField from "@/components/ui/input/PasswordField";
import UserNameField from "@/components/ui/input/UserNameField";
import EmailField from "@/components/ui/input/EmailField";
import { FaCheckCircle } from "react-icons/fa";

export default function CadastroPage() {
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMatchError, setPasswordMatchError] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [userNameError, setUserNameError] = useState("");
    const [isUserNameValid, setIsUserNameValid] = useState(null);
    const [cpf, setCpf] = useState("");
    const [userType, setUserType] = useState("");
    const [loading, setLoading] = useState(false);
    const [isCpfValid, setIsCpfValid] = useState(null);
    const [loadingCpf, setLoadingCpf] = useState(false);
    const [userName, setUserName] = useState("");
    const [dataNascimento, setDataNascimento] = useState(null);
    const [errorsInput, setErrorsInput] = useState({});
    const [locale, setLocale] = useState("pt-br");
    const [isFormValid, setIsFormValid] = useState(false);
    const [inputClass, setInputClass] = useState('mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800');
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const userLocale = navigator.language.toLowerCase();
        const supportedLocales = ["pt-br", "en", "es", "fr"];
        if (supportedLocales.includes(userLocale)) {
            setLocale(userLocale);
        } else {
            setLocale("pt-br");
        }
    }, []);

    useEffect(() => {
        setIsFormValid(
            userName.trim().length >= 3 &&
            firstName.trim().length >= 3 &&
            lastName.trim().length >= 3 &&
            email.includes("@") &&
            cpf.replace(/\D/g, "").length === 11 &&
            dataNascimento &&
            password.length >= 8 &&
            password === confirmPassword &&
            userType !== "" &&
            isCpfValid === true
        );
    }, [userName, firstName, lastName, email, cpf, dataNascimento, password, userType, isCpfValid]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!isFormValid) {
            toast.error("Por favor, preencha todos os campos corretamente.");
            setLoading(false);
            return;
        }

        try {
            const formatDateToISO = (dateString) => {
                const [day, month, year] = dateString.split("/");
                return `${year}-${month}-${day}`;
            };

            const formattedBirthDate = dataNascimento ? formatDateToISO(dataNascimento) : undefined;


            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/register`,
                { userName, firstName, lastName, email, password, cpf, birthDate: formattedBirthDate, userType },
                { withCredentials: true }
            );

            if (response.status === 200 || response.status === 201) {
                toast.success("Cadastro realizado com sucesso!");
                setTimeout(() => {
                    router.push("/login");
                    toast.info("Por favor, faça login com suas credenciais.");
                }, 2000);
            } else {
                toast.error(response.data.message || "Erro no cadastro");
            }
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
    };

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

    const verifyCpf = async () => {
        console.log("Verificando CPF:", cpf); // Log do CPF sendo verificado

        const cpfLimpo = cpf.replace(/\D/g, ""); // Remove pontos e traços

        if (cpfLimpo.length !== 11 || !dataNascimento) {
            setErrorsInput((prevErrors) => ({
                ...prevErrors,
                cpf: "CPF e data de nascimento são obrigatórios.",
            }));
            return;
        }

        const token = searchUserId();
        setLoadingCpf(true);
        setIsCpfValid(null);


        console.log("Dados enviados:", { cpf: cpfLimpo, dataNascimento }); // Log dos dados enviados

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/verify-cpf`,
                {
                    cpf: cpfLimpo,
                    data_nascimento: dataNascimento,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Resposta do servidor:", response.data); // Log da resposta do servidor
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

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden">
            {/* Fundo para mobile */}
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

            {/* Formulário posicionado à direita no desktop e centralizado no mobile */}
            <div className="relative min-h-screen flex items-center justify-center lg:justify-end p-4">
                <div className="w-full max-w-md bg-white bg-opacity-90 p-6 rounded-lg shadow-md hover:shadow-2xl max-h-[90vh] overflow-y-auto lg:ml-auto lg:mr-[250px] z-10">
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
                            Crie sua conta
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 mb-6">
                        <div className="flex gap-4">
                            <InputField
                                label="Nome"
                                name="firstName"
                                value={firstName}
                                onChange={handleFirstNameChange}
                                onBlur={handleFirstNameBlur}
                                maxLength={50}
                                required
                                autoComplete="off"
                                error={errorsInput.firstName}
                            />
                            <InputField
                                label="Sobrenome"
                                name="lastName"
                                value={lastName}
                                onChange={handleLastNameChange}
                                onBlur={handleLastNameBlur}
                                maxLength={100}
                                required
                                autoComplete="off"
                            />

                        </div>

                        {/* Nome de Usuário */}
                        <UserNameField
                            label="Nome de Usuário"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                            maxLength={50}
                            error={userNameError}
                            setError={setUserNameError}
                            setValid={setIsUserNameValid}
                        />

                        {/* E-mail */}
                        <EmailField
                            value={email}
                            onChange={handleEmailChange}
                            required
                            maxLength={320}
                            error={errorsInput.email}
                            setError={(err) => setErrorsInput(prev => ({ ...prev, email: err }))}
                            setValid={(valid) => console.log("Email válido:", valid)}
                        />

                        {/* Data de Nascimento */}
                        <DateField
                            label="Data de Nascimento"
                            name="data_nascimento"
                            value={dataNascimento}
                            onChange={setDataNascimento}
                            error={errorsInput.dataNascimento}
                        />

                        <CpfField
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            onVerify={verifyCpf}
                            isValid={isCpfValid}
                            isLoading={loadingCpf}
                            error={"CPF inválido"}
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
                            maxLength={128}
                            error={errorsInput.password}
                        />

                        {/* Campo de confirmação de senha */}
                        {password.length > 0 && (
                            < PasswordField
                                label="Confirmar Senha"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setConfirmPassword(val);
                                    setPasswordMatchError(val !== password ? "As senhas não coincidem." : "");
                                }}
                                show={showPassword}
                                toggleShow={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                required
                                maxLength={128}
                                error={passwordMatchError}
                            />

                        )}
                        {confirmPassword.length > 0 &&
                            confirmPassword === password &&
                            !passwordMatchError && (
                                <div className="text-green-600 text-sm flex items-center gap-2 mt-1">
                                    <FaCheckCircle className="text-green-500" />
                                    As senhas coincidem!
                                </div>
                            )}

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
                                className='w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600'
                            >
                                {loading ? <FaSpinner className="animate-spin h-5 w-5" /> : "Cadastrar"}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-4 text-sm">
                        Já tem uma conta?{" "}
                        <button
                            onClick={() => router.push("/login")}
                            className="font-medium text-pink-500 hover:text-pink-600"
                        >
                            Entrar
                        </button>
                    </div>
                </div>
            </div >
        </div >
    );
}