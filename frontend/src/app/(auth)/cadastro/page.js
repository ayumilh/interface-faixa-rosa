"use client";

import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/image";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useRouter } from "next/navigation";
import axios from "axios";
import { searchUserId } from "@/utils/searchUserId";

export default function CadastroPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [cpf, setCpf] = useState("");
    const [userType, setUserType] = useState("CONTRATANTE");
    const [loading, setLoading] = useState(false);
    const [isCpfValid, setIsCpfValid] = useState(null);
    const [loadingCpf, setLoadingCpf] = useState(false);
    const [userName, setUserName] = useState("");
    const [dataNascimento, setDataNascimento] = useState(null);
    const [formattedBirthDate, setFormattedBirthDate] = useState(null);
    const [errorsInput, setErrorsInput] = useState({});
    const [locale, setLocale] = useState("pt-br");
    const [isFormValid, setIsFormValid] = useState(false);
    const [inputClass, setInputClass] = useState('mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800');
    const router = useRouter();

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
            userName.trim().length >= 3 &&
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
    }, [userName, firstName, lastName, phone, email, cpf, dataNascimento, password, userType, isCpfValid]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        console.log({ firstName, lastName, email, password, phone, cpf, userType });

        try {
            const formatDateToISO = (dateString) => {
                // Divide a string no formato "DD/MM/YYYY"
                const [day, month, year] = dateString.split("/");
                // Retorna no formato "YYYY-MM-DD"
                return `${year}-${month}-${day}`;
            };

            const formattedBirthDate = dataNascimento ? formatDateToISO(dataNascimento) : undefined;


            // Simulando o envio para o backend
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/register`,
                { userName, firstName, lastName, email, password, phone, cpf, birthDate: formattedBirthDate, userType },
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

    const handleUserNameChange = (e) => {
        const value = e.target.value.trimStart();
        const regex = /[^a-zA-ZÀ-ÿ\s0-9&_-]/g;

        const sanitizedValue = sanitizeInput(value, regex, false);

        setUserName(sanitizedValue);

        setErrorsInput((prevErrors) => {
            const { userName, ...rest } = prevErrors;
            return rest;
        });
    };

    const handleUserNameBlur = () => {
        if (userName === '') {
            setErrorsInput((prevErrors) => ({
                ...prevErrors,
                userName: "UserName é obrigatório.",
            }));
        } else {
            setErrorsInput((prevErrors) => {
                const { userName, ...rest } = prevErrors;
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
            // Ainda digitando (não exibe erro)
            setIsCpfValid(null);
            setErrorsInput((prevErrors) => {
                const { cpf, ...rest } = prevErrors;
                return rest;
            });
        } else if (sanitizedValue.length === 11) {
            // CPF completo → Agora validamos
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

    const verifyCpf = async () => {
        if (cpf.length !== 11 || !dataNascimento) {
            setErrorsInput((prevErrors) => ({
                ...prevErrors,
                cpf: "CPF e data de nascimento são obrigatórios.",
            }));
            return;
        }

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
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-4" style={{ backgroundImage: "url('/assets/background.svg')" }}>
            <div className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
                <div className="text-center mb-6">
                    <Image src="/assets/logofaixa.png" alt="Faixa Rosa Logo" width={160} height={64} className="mx-auto h-16" />
                    <h2 className="text-2xl font-semibold text-pink-500 mt-4">Crie sua conta</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6 mb-6">
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

                    {/* userName */}
                    <div>
                        <label
                            htmlFor="userName"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Nome de Usuário
                        </label>
                        <input
                            id="userName"
                            name="userName"
                            type="text"
                            value={userName}
                            onChange={handleUserNameChange}
                            onBlur={handleUserNameBlur}
                            required
                            maxLength={50}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-200 text-gray-800"
                        />
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
        </div>
    );
}
