'use client';
import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Importing arrow icons
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { searchUserId } from "@/utils/searchUserId";
import { FaCheckCircle } from "react-icons/fa";


// UI components
import InputField from "../../../components/Geral/input/InputField";
import DateField from "../../../components/Geral/input/DateField";
import PasswordField from "../../../components/Geral/input/PasswordField";
import UserNameField from "../../../components/Geral/input/UserNameField";
import CpfField from "../../../components/Geral/input/CpfField";
import EmailField from "../../../components/Geral/input/EmailField";

export default function CadastroPage() {
    const [step, setStep] = useState(0); // Controla em qual etapa o usuário está
    const [formData, setFormData] = useState({
        userType: "",
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        cpf: "",
        birthDate: "",
        password: "",
        confirmPassword: "",
        comparisonMedia: null,
        profilePic: null,
        documents: { fileFront: null, fileBack: null },
    });

    const [isCpfValid, setIsCpfValid] = useState(null);
    const [loadingCpf, setLoadingCpf] = useState(false);

    const [passwordMatchError, setPasswordMatchError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [documentFileFront, setDocumentFileFront] = useState(null); // Para armazenar o arquivo real
    const [documentFileBack, setDocumentFileBack] = useState(null); // Para armazenar o arquivo real

    const [errorsInput, setErrorsInput] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    // Função de validação
    const validateForm = () => {
        if (step === 0) {
            return formData.userType !== ""; // Verifica se o userType foi selecionado
        }
        if (step === 1) {
            return (
                formData.firstName.trim().length > 0 &&
                formData.lastName.trim().length > 0 &&
                formData.userName.trim().length > 0 &&
                formData.email.includes("@") &&
                formData.birthDate.trim().length > 0 // Verifica se a data de nascimento foi preenchida
            );
        }
        if (step === 2) {
            return isCpfValid && formData.documents.fileFront && formData.documents.fileBack; // Verifica CPF e documentos
        }
        if (step === 3) {
            return formData.comparisonMedia !== null;
        }
        if (step === 4) {
            return formData.profilePic !== null;
        }
        if (step === 5) {
            return formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
        }
        return false;
    };


    const verifyCpf = async () => {
        const cpfLimpo = formData.cpf.replace(/\D/g, "");

        if (cpfLimpo.length !== 11 || !formData.birthDate) {
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
                    cpf: cpfLimpo,
                    data_nascimento: formData.birthDate,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

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


    const sanitizeInput = (value, regex, shouldTrim = true) => {
        const sanitizedValue = shouldTrim ? value.trim().replace(regex, '') : value.replace(regex, '');
        return sanitizedValue;
    };

    // firstName
    const handleFirstNameChange = (e) => {
        const value = e.target.value.trimStart();
        const regex = /[^a-zA-ZÀ-ÿ\s'-]/g;
        const sanitizedValue = sanitizeInput(value, regex, false);

        // Atualiza o campo "firstName" dentro de formData
        setFormData((prevFormData) => ({
            ...prevFormData,
            firstName: sanitizedValue,
        }));

        // Limpa o erro de firstName
        setErrorsInput((prevErrors) => {
            const { firstName, ...rest } = prevErrors;
            return rest; // Remove o erro se o campo for alterado
        });
    };
    const handleFirstNameBlur = () => {
        if (formData.firstName === '') { // Acessando diretamente de formData
            setErrorsInput((prevErrors) => ({
                ...prevErrors,
                firstName: "Nome é obrigatório.",
            }));
        } else {
            setErrorsInput((prevErrors) => {
                const { firstName, ...rest } = prevErrors;
                return rest; // Remove o erro se o campo estiver preenchido
            });
        }
    };

    // lastName
    const handleLastNameChange = (e) => {
        const value = e.target.value.trimStart();
        const regex = /[^a-zA-ZÀ-ÿ\s'-]/g;
        const sanitizedValue = sanitizeInput(value, regex, false);

        // Atualiza o campo "lastName" dentro de formData
        setFormData((prevFormData) => ({
            ...prevFormData,
            lastName: sanitizedValue,
        }));

        // Limpa o erro de lastName
        setErrorsInput((prevErrors) => {
            const { lastName, ...rest } = prevErrors;
            return rest; // Remove o erro se o campo for alterado
        });
    };
    const handleLastNameBlur = () => {
        if (formData.lastName === '') { // Acessando o valor de lastName no formData
            setErrorsInput((prevErrors) => ({
                ...prevErrors,
                lastName: "Sobrenome é obrigatório.",
            }));
        } else {
            setErrorsInput((prevErrors) => {
                const { lastName, ...rest } = prevErrors;
                return rest; // Remove o erro se o campo não estiver vazio
            });
        }
    };


    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // Função para carregar documentos
    const handleFileUpload = (e, side) => {
        const file = e.target.files[0]; // Obtém o arquivo
        if (!file) return; // Verifica se o arquivo foi selecionado

        const imageUrl = URL.createObjectURL(file); // Cria a URL da imagem para exibição

        // Armazena o arquivo real (não a URL) para envio ao backend
        if (side === "front") {
            setFormData((prevFormData) => ({
                ...prevFormData,
                documents: {
                    ...prevFormData.documents,
                    fileFront: file, // Armazena o arquivo real para envio ao backend
                },
            }));
            setDocumentFileFront(imageUrl); // Armazena a URL para exibição
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                documents: {
                    ...prevFormData.documents,
                    fileBack: file, // Armazena o arquivo real para envio ao backend
                },
            }));
            setDocumentFileBack(imageUrl); // Armazena a URL para exibição
        }
    };

    const handleUserTypeSelection = (type) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            userType: type,
        }));
        setStep(1); // Após selecionar o userType, vai para o próximo passo
    };

    const handleNextStep = () => {
        if (validateForm()) {
            if (formData.userType === "CONTRATANTE" && step === 2) {
                setStep(4); // Pula diretamente para o passo 4, pois o Contratante não tem etapa 3
            } else {
                setStep(step + 1);
            }
        }
    };


    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    // Envia os dados do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataToSend = new FormData();

        formDataToSend.append("firstName", formData.firstName);
        formDataToSend.append("lastName", formData.lastName);
        formDataToSend.append("userName", formData.userName);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("cpf", formData.cpf);
        formDataToSend.append("birthDate", formData.birthDate);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("userType", formData.userType);

        // Adicionando os arquivos
        if (formData.profilePic) {
            formDataToSend.append("profilePic", formData.profilePic); // O nome do campo deve ser 'profilePic'
        }

        if (formData.comparisonMedia) {
            formDataToSend.append("comparisonMedia", formData.comparisonMedia); // Para o vídeo de comparação
        }

        // Enviando os documentos
        if (formData.documents.fileFront) {
            formDataToSend.append("fileFront", formData.documents.fileFront);
        }
        if (formData.documents.fileBack) {
            formDataToSend.append("fileBack", formData.documents.fileBack);
        }

        console.log("Dados do formulário:", formDataToSend); // Para depuração

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/register`,
                formDataToSend,
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
            toast.error(error.response?.data?.message || "Erro no cadastro");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsFormValid(validateForm()); // Atualiza a validade do formulário
    }, [formData, step]); // Garante que a validação seja chamada quando formData ou step mudar

    return (
        <div className="min-h-screen w-full relative">
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
                        {/* Barra de progresso ajustada */}
                        <div className="my-6">
                            <div className="flex flex-wrap justify-between text-sm text-pink-500 mb-4 space-y-2 md:space-y-0 md:flex-nowrap">
                                <div className="flex items-center w-1/2 md:w-auto">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'bg-pink-500' : 'bg-gray-300'}`}>
                                        <span className={`${step >= 1 ? 'text-white' : 'text-pink-500'}`}>1</span>
                                    </div>
                                    <span className="ml-2">Dados</span>
                                </div>
                                <div className="flex items-center w-1/2 md:w-auto">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'bg-pink-500' : 'bg-gray-300'}`}>
                                        <span className={`${step >= 2 ? 'text-white' : 'text-pink-500'}`}>2</span>
                                    </div>
                                    <span className="ml-2">Documentos</span>
                                </div>
                                {formData.userType === "ACOMPANHANTE" && (
                                    <div className="flex items-center w-1/2 md:w-auto">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'bg-pink-500' : 'bg-gray-300'}`}>
                                            <span className={`${step >= 3 ? 'text-white' : 'text-pink-500'}`}>3</span>
                                        </div>
                                        <span className="ml-2">Vídeo</span>
                                    </div>
                                )}
                                <div className="flex items-center w-1/2 md:w-auto">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step >= (formData.userType === "ACOMPANHANTE" ? 4 : 3) ? 'bg-pink-500' : 'bg-gray-300'}`}>
                                        <span className={`${step >= (formData.userType === "ACOMPANHANTE" ? 4 : 3) ? 'text-white' : 'text-pink-500'}`}>{formData.userType === "ACOMPANHANTE" ? 4 : 3}</span>
                                    </div>
                                    <span className="ml-2">Foto</span>
                                </div>
                                <div className="flex items-center w-1/2 md:w-auto">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step >= (formData.userType === "ACOMPANHANTE" ? 5 : 4) ? 'bg-pink-500' : 'bg-gray-300'}`}>
                                        <span className={`${step >= (formData.userType === "ACOMPANHANTE" ? 5 : 4) ? 'text-white' : 'text-pink-500'}`}>{formData.userType === "ACOMPANHANTE" ? 5 : 4}</span>
                                    </div>
                                    <span className="ml-2">Senha</span>
                                </div>
                            </div>

                            {/* Barra de progresso */}
                            <div className="relative">
                                <div className="w-full bg-gray-200 h-2 rounded-full">
                                    <div
                                        className="bg-pink-500 h-2 rounded-full"
                                        style={{
                                            width: `${((step) / (formData.userType === "ACOMPANHANTE" ? 5 : 4)) * 100}%`,
                                            transition: 'width 0.5s ease-in-out',
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>


                        <h2 className="text-3xl font-semibold text-pink-500 mb-8 text-center">
                            {formData.userType === "CONTRATANTE" ? (
                                "Crie sua conta como Contratante"
                            ) : formData.userType === "ACOMPANHANTE" ? (
                                "Crie sua conta como Anunciante"
                            ) : (
                                "Escolha seu tipo de conta para começar"
                            )}
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {step === 0 && (
                            <div className="flex flex-col justify-center items-center py-12 px-6">
                                <div className="space-y-6 w-full max-w-sm">
                                    <button
                                        onClick={() => handleUserTypeSelection("CONTRATANTE")}
                                        className="w-full py-4 text-lg text-white bg-pink-500 hover:bg-pink-600 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95"
                                    >
                                        <span className="font-semibold">Contratante</span>
                                    </button>
                                    <button
                                        onClick={() => handleUserTypeSelection("ACOMPANHANTE")}
                                        className="w-full py-4 text-lg text-white bg-pink-500 hover:bg-pink-600 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95"
                                    >
                                        <span className="font-semibold">Anunciante</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-pink-500">Dados Pessoais</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        label="Nome"
                                        name="firstName"
                                        value={formData.firstName} // Usando formData para o valor
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
                                        value={formData.lastName} // Usando formData para o valor
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
                                    value={formData.userName} // Usando formData para o valor
                                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })} // Atualiza formData
                                    required
                                    maxLength={50}
                                    error={errorsInput.userName} // Pode armazenar o erro do nome de usuário
                                    setError={(error) => setErrorsInput((prev) => ({ ...prev, userName: error }))} // Armazena o erro
                                    setValid={(valid) => setIsFormValid(valid)} // Controla a validação do formulário
                                />

                                {/* Email */}
                                <EmailField
                                    value={formData.email} // Usando formData para o valor
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} // Atualiza formData
                                    required
                                    maxLength={320}
                                    error={errorsInput.email}
                                    setError={(err) => setErrorsInput(prev => ({ ...prev, email: err }))}
                                    setValid={(valid) => console.log("Email válido:", valid)}
                                />

                                <DateField
                                    label="Data de Nascimento"
                                    name="birthDate"
                                    value={formData.birthDate}  // Valor que vem do estado no componente pai
                                    onChange={(newDate) => setFormData({ ...formData, birthDate: newDate })}  // Atualiza o estado com a data formatada
                                    error={errorsInput.birthDate}  // Exibe erro, se houver
                                />


                                <div className="flex items-center gap-4 justify-between mt-4">
                                    {/* Botão Voltar */}
                                    <button
                                        type="button"
                                        onClick={handlePreviousStep}
                                        className="w-full py-2 bg-gray-300 text-black rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <FaArrowLeft /> Voltar
                                    </button>

                                    {/* Botão Próxima Etapa */}
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        disabled={!isFormValid}
                                        className={`w-full py-2 text-white bg-pink-500 hover:bg-pink-600 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <FaArrowRight /> Próxima Etapa
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-pink-500">Dados de Documentos</h3>

                                {/* CPF */}
                                <CpfField
                                    value={formData.cpf} // Usando formData para o valor
                                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} // Atualiza formData
                                    onVerify={verifyCpf}
                                    isValid={isCpfValid}
                                    isLoading={loadingCpf}
                                    required
                                    error={"CPF inválido"}
                                />

                                {/* Upload de documentos */}
                                {isCpfValid && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Upload Frente */}
                                        <label className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer">
                                            {documentFileFront ? (
                                                <Image
                                                    src={documentFileFront} // Usando a URL gerada com createObjectURL
                                                    alt="Documento Frente"
                                                    width={200}
                                                    height={200}
                                                    style={{ objectFit: 'contain' }}
                                                />
                                            ) : (
                                                <div>Enviar Frente</div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleFileUpload(e, "front")}
                                            />
                                        </label>

                                        {/* Upload Verso */}
                                        <label className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer">
                                            {documentFileBack ? (
                                                <Image
                                                    src={documentFileBack} // Usando a URL gerada com createObjectURL
                                                    alt="Documento Verso"
                                                    width={200}
                                                    height={200}
                                                    style={{ objectFit: 'contain' }}
                                                />
                                            ) : (
                                                <div>Enviar Verso</div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleFileUpload(e, "back")}
                                            />
                                        </label>
                                    </div>
                                )}


                                <div className="flex items-center gap-4 justify-between mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(step - 1)}
                                        className="w-full py-2 bg-gray-300 text-black rounded-lg"
                                    >
                                        Voltar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        disabled={!isFormValid}
                                        className={`w-full py-2 text-white bg-pink-500 hover:bg-pink-600 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Próxima Etapa
                                    </button>

                                </div>
                            </div>
                        )}

                        {formData.userType === "ACOMPANHANTE" && step === 3 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-pink-500">Vídeo de Comparação</h3>
                                <input
                                    type="file"
                                    name="video"
                                    onChange={(e) => setFormData({ ...formData, comparisonMedia: e.target.files[0] })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                                <div className="flex items-center gap-4 justify-between mt-4">
                                    <button
                                        type="button"
                                        onClick={handlePreviousStep}
                                        className="w-full py-2 bg-gray-300 text-black rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <FaArrowLeft /> Voltar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        disabled={!formData.comparisonMedia} // Verifica se o vídeo foi carregado
                                        className={`w-full py-2 text-white bg-pink-500 hover:bg-pink-600 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${!formData.comparisonMedia ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <FaArrowRight /> Próxima Etapa
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-pink-500">Foto de Perfil</h3>
                                <input
                                    type="file"
                                    name="profilePic"
                                    onChange={(e) => setFormData({ ...formData, profilePic: e.target.files[0] })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                                <div className="flex items-center gap-4 justify-between mt-4">
                                    <button
                                        type="button"
                                        onClick={handlePreviousStep}
                                        className="w-full py-2 bg-gray-300 text-black rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <FaArrowLeft /> Voltar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        disabled={!formData.profilePic} // Verifica se a imagem de perfil foi carregada
                                        className={`w-full py-2 text-white bg-pink-500 hover:bg-pink-600 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${!formData.profilePic ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <FaArrowRight /> Próxima Etapa
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-pink-500">Criação de Senha</h3>

                                {/* Senha */}
                                <PasswordField
                                    label="Senha"
                                    name="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    show={showPassword}
                                    toggleShow={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    required
                                    maxLength={128}
                                    error={errorsInput.password}
                                />


                                <PasswordField
                                    label="Confirmar Senha"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setFormData({ ...formData, confirmPassword: val });
                                        setPasswordMatchError(val !== formData.password ? "As senhas não coincidem." : "");
                                    }}
                                    show={showPassword}
                                    toggleShow={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    required
                                    maxLength={128}
                                    error={passwordMatchError}
                                />

                                {/* Mensagem de erro se as senhas não coincidirem */}
                                {formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-2">As senhas não correspondem. Por favor, verifique novamente.</p>
                                )}

                                {/* Mensagem de sucesso se as senhas coincidirem */}
                                {formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword && !passwordMatchError && (
                                    <div className="text-green-600 text-sm flex items-center gap-2 mt-1">
                                        <FaCheckCircle className="text-green-500" />
                                        As senhas coincidem!
                                    </div>
                                )}

                                <div className="flex items-center gap-4 justify-between mt-4">
                                    <button
                                        type="button"
                                        onClick={handlePreviousStep}
                                        className="w-full py-2 bg-gray-300 text-black rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <FaArrowLeft /> Voltar
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className='w-full py-2 text-white bg-pink-500 hover:bg-pink-600 rounded-lg flex items-center justify-center gap-2 transition-all duration-200'
                                >
                                    <FaArrowRight /> Cadastrar
                                </button>
                            </div>
                        )}

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
        </div>
    );
}
