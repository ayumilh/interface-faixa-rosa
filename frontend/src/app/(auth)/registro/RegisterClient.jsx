'use client';
import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaUser, FaFileAlt, FaVideo, FaImage, FaLock, FaCheckCircle, FaUserTie, FaHeart, FaShieldAlt, FaCamera, FaEye, FaCloudUploadAlt, FaStar } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { searchUserId } from "@/utils/searchUserId";

// UI components
import InputField from "../../../components/Geral/input/InputField";
import DateField from "../../../components/Geral/input/DateField";
import PasswordField from "../../../components/Geral/input/PasswordField";
import UserNameField from "../../../components/Geral/input/UserNameField";
import CpfField from "../../../components/Geral/input/CpfField";
import EmailField from "../../../components/Geral/input/EmailField";

export default function CadastroPage() {
    const [step, setStep] = useState(0);
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
    const [documentFileFront, setDocumentFileFront] = useState(null);
    const [documentFileBack, setDocumentFileBack] = useState(null);
    const [errorsInput, setErrorsInput] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    // All the existing useEffect and handler functions remain exactly the same
    useEffect(() => {
        try {
            const savedForm = localStorage.getItem("cadastroStepForm");
            if (!savedForm) return;
            const parsed = JSON.parse(savedForm);
            const isValidData = parsed && typeof parsed === "object" && parsed.formData && typeof parsed.formData === "object" && typeof parsed.step === "number";
            if (isValidData) {
                setFormData((prev) => ({ ...prev, ...parsed.formData }));
                setStep(parsed.step);
            } else {
                localStorage.removeItem("cadastroStepForm");
            }
        } catch (err) {
            localStorage.removeItem("cadastroStepForm");
        }
    }, []);

    const validateForm = () => {
        if (step === 0) return formData.userType !== "";
        if (step === 1) return (formData.firstName.trim().length > 0 && formData.lastName.trim().length > 0 && formData.userName.trim().length > 0 && formData.email.includes("@") && formData.birthDate.trim().length > 0);
        if (step === 2) {
            const cpfValido = formData.cpf.replace(/\D/g, "").length === 11;
            return cpfValido && formData.documents.fileFront && formData.documents.fileBack;
        }
        if (step === 3) return formData.comparisonMedia !== null;
        if (step === 4) return formData.profilePic !== null;
        if (step === 5) return formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
        return false;
    };

    const handleClearForm = () => {
        setFormData({
            userType: "", firstName: "", lastName: "", userName: "", email: "", cpf: "", birthDate: "", password: "", confirmPassword: "", comparisonMedia: null, profilePic: null, documents: { fileFront: null, fileBack: null },
        });
        setStep(0);
        setErrorsInput({});
        setIsCpfValid(null);
        setDocumentFileFront(null);
        setDocumentFileBack(null);
        localStorage.removeItem("cadastroStepForm");
        toast.info("Formulário limpo com sucesso!");
    };

    const verifyCpf = async () => {
        const cpfLimpo = formData.cpf.replace(/\D/g, "");
        if (cpfLimpo.length !== 11 || !formData.birthDate) {
            setErrorsInput((prevErrors) => ({ ...prevErrors, cpf: "CPF e data de nascimento são obrigatórios." }));
            return;
        }
        const token = searchUserId();
        setLoadingCpf(true);
        setIsCpfValid(null);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/verify-cpf`, { cpf: cpfLimpo, data_nascimento: formData.birthDate }, { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.maior_de_idade) {
                setIsCpfValid(true);
                setErrorsInput((prevErrors) => {
                    const { cpf, ...rest } = prevErrors;
                    return rest;
                });
            } else {
                setIsCpfValid(false);
                setErrorsInput((prevErrors) => ({ ...prevErrors, cpf: "CPF inválido ou menor de idade." }));
            }
        } catch (error) {
            setIsCpfValid(false);
            setErrorsInput((prevErrors) => ({ ...prevErrors, cpf: "Erro ao verificar CPF." }));
        } finally {
            setLoadingCpf(false);
        }
    };

    useEffect(() => {
        const dataToStore = { formData, step };
        localStorage.setItem("cadastroStepForm", JSON.stringify(dataToStore));
    }, [formData, step]);

    const sanitizeInput = (value, regex, shouldTrim = true) => {
        const sanitizedValue = shouldTrim ? value.trim().replace(regex, '') : value.replace(regex, '');
        return sanitizedValue;
    };

    const handleFirstNameChange = (e) => {
        const value = e.target.value.trimStart();
        const regex = /[^a-zA-ZÀ-ÿ\s'-]/g;
        const sanitizedValue = sanitizeInput(value, regex, false);
        setFormData((prevFormData) => ({ ...prevFormData, firstName: sanitizedValue }));
        setErrorsInput((prevErrors) => {
            const { firstName, ...rest } = prevErrors;
            return rest;
        });
    };

    const handleFirstNameBlur = () => {
        if (formData.firstName === '') {
            setErrorsInput((prevErrors) => ({ ...prevErrors, firstName: "Nome é obrigatório." }));
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
        setFormData((prevFormData) => ({ ...prevFormData, lastName: sanitizedValue }));
        setErrorsInput((prevErrors) => {
            const { lastName, ...rest } = prevErrors;
            return rest;
        });
    };

    const handleLastNameBlur = () => {
        if (formData.lastName === '') {
            setErrorsInput((prevErrors) => ({ ...prevErrors, lastName: "Sobrenome é obrigatório." }));
        } else {
            setErrorsInput((prevErrors) => {
                const { lastName, ...rest } = prevErrors;
                return rest;
            });
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleFileUpload = (e, side) => {
        const file = e.target.files[0];
        if (!file) return;
        const imageUrl = URL.createObjectURL(file);
        if (side === "front") {
            setFormData((prevFormData) => ({ ...prevFormData, documents: { ...prevFormData.documents, fileFront: file } }));
            setDocumentFileFront(imageUrl);
        } else {
            setFormData((prevFormData) => ({ ...prevFormData, documents: { ...prevFormData.documents, fileBack: file } }));
            setDocumentFileBack(imageUrl);
        }
    };

    const handleUserTypeSelection = (type) => {
        setFormData((prevFormData) => ({ ...prevFormData, userType: type }));
        setStep(1);
    };

    const handleNextStep = () => {
        if (validateForm()) {
            if (formData.userType === "CONTRATANTE" && step === 2) {
                setStep(4);
            } else {
                setStep(step + 1);
            }
        }
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

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
        if (formData.profilePic) formDataToSend.append("profilePic", formData.profilePic);
        if (formData.comparisonMedia) formDataToSend.append("comparisonMedia", formData.comparisonMedia);
        if (formData.documents.fileFront) formDataToSend.append("fileFront", formData.documents.fileFront);
        if (formData.documents.fileBack) formDataToSend.append("fileBack", formData.documents.fileBack);

        console.log("📦 FormData REGISTRO enviado:");
        for (let [key, value] of formDataToSend.entries()) {
            if (value instanceof File) {
                console.log(`🗂️ ${key}: [Arquivo] ${value.name} (${value.type})`);
            } else {
                console.log(`✏️ ${key}: ${value}`);
            }
        }


        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/register`, formDataToSend, { withCredentials: true });

            console.log("✅ Resposta da API:", response);

            if (response.status === 200 || response.status === 201) {
                localStorage.removeItem("cadastroStepForm");
                toast.success("Cadastro realizado com sucesso!");
                setTimeout(() => {
                    router.push("/login");
                    toast.info("Por favor, faça login com suas credenciais.");
                }, 2000);
            } else {
                toast.error(response.data.message || "Erro no cadastro");
                localStorage.removeItem("cadastroStepForm");
            }
        } catch (error) {
            console.error("Erro ao registrar:", error.response?.data || error.message);

            const backendMessage = error.response?.data?.error || error.response?.data?.message;

            if (backendMessage === 'Email ou CPF já estão em uso') {
                toast.error("Este e-mail ou CPF já está cadastrado. Tente outro.");
            } else {
                toast.error(backendMessage || "Erro ao realizar o cadastro. Tente novamente.");
            }

            localStorage.removeItem("cadastroStepForm");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsFormValid(validateForm());
    }, [formData, step]);

    const getStepInfo = () => {
        const steps = [
            { icon: FaUser, title: "Tipo de Conta", description: "Escolha seu perfil" },
            { icon: FaUser, title: "Dados Pessoais", description: "Suas informações básicas" },
            { icon: FaShieldAlt, title: "Documentação", description: "Verificação de identidade" },
            ...(formData.userType === "ACOMPANHANTE" ? [{ icon: FaVideo, title: "Vídeo", description: "Comparação de identidade" }] : []),
            { icon: FaCamera, title: "Foto de Perfil", description: "Sua imagem principal" },
            { icon: FaLock, title: "Senha", description: "Proteção da conta" }
        ];
        return steps;
    };

    const getCurrentStepIndex = () => {
        if (formData.userType === "CONTRATANTE" && step > 2) return step - 1;
        return step;
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden">
            {/* Background Images - Clean without overlay */}
            <div
                className="block lg:hidden absolute inset-0 bg-no-repeat bg-cover bg-center"
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

            {/* Subtle floating elements - reduced opacity */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-200/10 to-purple-200/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-xl animate-pulse delay-1000"></div>

            <div className="relative min-h-screen flex items-center justify-center lg:justify-end p-4">
                <div className="w-full max-w-2xl bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 lg:mr-[200px] z-10 transition-all duration-300">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="relative group">
                            <Image
                                src="/assets/logofaixa.png"
                                alt="Faixa Rosa Logo"
                                width={200}
                                height={0}
                                className="mx-auto h-auto transition-all duration-300 group-hover:scale-105"
                                style={{ maxHeight: "100px", objectFit: "contain" }}
                            />
                            <HiSparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping" />
                        </div>

                        {/* Enhanced Progress Bar */}
                        <div className="my-8">
                            <div className="flex flex-wrap justify-center gap-4 mb-6">
                                {getStepInfo().map((stepInfo, index) => {
                                    const Icon = stepInfo.icon;
                                    const isActive = getCurrentStepIndex() === index;
                                    const isCompleted = getCurrentStepIndex() > index;

                                    return (
                                        <div key={index} className="flex flex-col items-center group">
                                            <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${isCompleted
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 shadow-lg'
                                                : isActive
                                                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-pink-500 shadow-lg scale-110'
                                                    : 'bg-gray-100 border-gray-300'
                                                }`}>
                                                {isCompleted ? (
                                                    <FaCheckCircle className="w-5 h-5 text-white" />
                                                ) : (
                                                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                                )}
                                                {isActive && (
                                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400/30 to-purple-400/30 animate-pulse"></div>
                                                )}
                                            </div>
                                            <div className="text-center mt-2 hidden sm:block">
                                                <p className={`text-xs font-medium ${isActive ? 'text-pink-600' : 'text-gray-500'}`}>
                                                    {stepInfo.title}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Progress line */}
                            <div className="relative mb-6">
                                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 h-2 rounded-full transition-all duration-700 ease-out relative"
                                        style={{
                                            width: `${(getCurrentStepIndex() / (getStepInfo().length - 1)) * 100}%`,
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Title */}
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                {getStepInfo()[getCurrentStepIndex()]?.title}
                            </h2>
                            <p className="text-gray-600 text-lg">
                                {getStepInfo()[getCurrentStepIndex()]?.description}
                            </p>
                        </div>

                        {/* Clear Form Button */}
                        <div className="flex justify-end mb-6">
                            <button
                                type="button"
                                onClick={handleClearForm}
                                className="text-sm text-gray-500 hover:text-pink-500 transition-colors duration-200 flex items-center gap-2 group"
                            >
                                <HiSparkles className="w-4 h-4 group-hover:animate-spin" />
                                Limpar formulário
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Step 0: User Type Selection */}
                        {step === 0 && (
                            <div className="space-y-8">
                                <div className="text-center mb-8">
                                    <p className="text-gray-600 text-lg mb-8">Selecione o tipo de conta que melhor se adequa ao seu perfil</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <button
                                        type="button"
                                        onClick={() => handleUserTypeSelection("CONTRATANTE")}
                                        className="group relative p-8 bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl hover:from-blue-100 hover:to-indigo-200 hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                    >
                                        <div className="text-center">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <FaUserTie className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-blue-700 mb-2">Contratante</h3>
                                            <p className="text-blue-600 text-sm leading-relaxed">
                                                Para quem busca contratar serviços de acompanhantes profissionais
                                            </p>
                                        </div>
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleUserTypeSelection("ACOMPANHANTE")}
                                        className="group relative p-8 bg-gradient-to-br from-pink-50 to-purple-100 border-2 border-pink-200 rounded-2xl hover:from-pink-100 hover:to-purple-200 hover:border-pink-300 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                    >
                                        <div className="text-center">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <FaHeart className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-pink-700 mb-2">Anunciante</h3>
                                            <p className="text-pink-600 text-sm leading-relaxed">
                                                Para profissionais que desejam oferecer serviços de acompanhante
                                            </p>
                                        </div>
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 1: Personal Data */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-2xl border border-pink-200/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <FaUser className="w-5 h-5 text-pink-500" />
                                        <h3 className="text-lg font-semibold text-gray-800">Informações Pessoais</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm">Preencha seus dados pessoais para prosseguir com o cadastro</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <InputField
                                            label="Nome"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleFirstNameChange}
                                            onBlur={handleFirstNameBlur}
                                            maxLength={50}
                                            required
                                            autoComplete="off"
                                            error={errorsInput.firstName}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <InputField
                                            label="Sobrenome"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleLastNameChange}
                                            onBlur={handleLastNameBlur}
                                            maxLength={100}
                                            required
                                            autoComplete="off"
                                            error={errorsInput.lastName}
                                        />
                                    </div>
                                </div>

                                <UserNameField
                                    label="Nome de Usuário"
                                    value={formData.userName}
                                    onChange={(e) => {
                                        const sanitizedValue = e.target.value
                                            .normalize("NFD")
                                            .replace(/[\u0300-\u036f]/g, "")
                                            .replace(/[^\w]/g, "")
                                            .replace(/_/g, "")
                                            .replace(/\s+/g, "")
                                            .toLowerCase();
                                        setFormData({ ...formData, userName: sanitizedValue });
                                    }}
                                    required
                                    maxLength={50}
                                    error={errorsInput.userName}
                                    setError={(error) => setErrorsInput((prev) => ({ ...prev, userName: error }))}
                                    setValid={(valid) => setIsFormValid(valid)}
                                />

                                <EmailField
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    maxLength={320}
                                    error={errorsInput.email}
                                    setError={(err) => setErrorsInput(prev => ({ ...prev, email: err }))}
                                    setValid={(valid) => console.log("Email válido:", valid)}
                                />

                                <DateField
                                    label="Data de Nascimento"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={(newDate) => setFormData({ ...formData, birthDate: newDate })}
                                    error={errorsInput.birthDate}
                                />

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={handlePreviousStep}
                                        className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
                                    >
                                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
                                        Voltar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        disabled={!isFormValid}
                                        className={`flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 group ${!isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-lg'}`}
                                    >
                                        Próxima Etapa
                                        <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Documents */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <FaShieldAlt className="w-5 h-5 text-orange-500" />
                                        <h3 className="text-lg font-semibold text-gray-800">Verificação de Identidade</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm">Para sua segurança, precisamos verificar sua identidade através de documentos oficiais</p>
                                </div>

                                <div className="space-y-6">
                                    <CpfField
                                        value={formData.cpf}
                                        onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                                        required
                                        error={errorsInput.cpf}
                                    />

                                    {formData.cpf.replace(/\D/g, "").length === 11 && (
                                        <div className="space-y-6">
                                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                                                <div className="flex items-start gap-3">
                                                    <FaFileAlt className="w-5 h-5 text-blue-500 mt-1" />
                                                    <div>
                                                        <h4 className="font-semibold text-blue-800 mb-1">Upload de Documentos</h4>
                                                        <p className="text-blue-600 text-sm">
                                                            Envie fotos claras da <strong>frente e verso</strong> do seu documento de identidade (RG)
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Front Document Upload */}
                                                <div className="space-y-3">
                                                    <label className="block text-sm font-medium text-gray-700">Frente do Documento</label>
                                                    <label className="group relative block w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 hover:border-pink-400 transition-all duration-300">
                                                        {documentFileFront ? (
                                                            <div className="relative w-full h-full rounded-xl overflow-hidden">
                                                                <Image
                                                                    src={documentFileFront}
                                                                    alt="Documento Frente"
                                                                    fill
                                                                    className="object-contain p-2"
                                                                />
                                                                <div className="absolute top-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                                    <FaCheckCircle className="w-4 h-4 text-white" />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center h-full p-6">
                                                                <FaCloudUploadAlt className="w-12 h-12 text-gray-400 group-hover:text-pink-500 transition-colors duration-300 mb-3" />
                                                                <p className="text-gray-600 text-center font-medium">Clique para enviar</p>
                                                                <p className="text-gray-400 text-sm text-center mt-1">ou arraste o arquivo aqui</p>
                                                            </div>
                                                        )}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => handleFileUpload(e, "front")}
                                                        />
                                                    </label>
                                                </div>

                                                {/* Back Document Upload */}
                                                <div className="space-y-3">
                                                    <label className="block text-sm font-medium text-gray-700">Verso do Documento</label>
                                                    <label className="group relative block w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 hover:border-pink-400 transition-all duration-300">
                                                        {documentFileBack ? (
                                                            <div className="relative w-full h-full rounded-xl overflow-hidden">
                                                                <Image
                                                                    src={documentFileBack}
                                                                    alt="Documento Verso"
                                                                    fill
                                                                    className="object-contain p-2"
                                                                />
                                                                <div className="absolute top-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                                    <FaCheckCircle className="w-4 h-4 text-white" />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center h-full p-6">
                                                                <FaCloudUploadAlt className="w-12 h-12 text-gray-400 group-hover:text-pink-500 transition-colors duration-300 mb-3" />
                                                                <p className="text-gray-600 text-center font-medium">Clique para enviar</p>
                                                                <p className="text-gray-400 text-sm text-center mt-1">ou arraste o arquivo aqui</p>
                                                            </div>
                                                        )}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => handleFileUpload(e, "back")}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setStep(step - 1)}
                                        className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
                                    >
                                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
                                        Voltar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        disabled={!isFormValid}
                                        className={`flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 group ${!isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-lg'}`}
                                    >
                                        Próxima Etapa
                                        <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Video (Only for ACOMPANHANTE) */}
                        {formData.userType === "ACOMPANHANTE" && step === 3 && (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-200/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <FaVideo className="w-5 h-5 text-purple-500" />
                                        <h3 className="text-lg font-semibold text-gray-800">Vídeo de Verificação</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm">Grave um vídeo curto para verificar sua identidade e autenticidade</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                                        <div className="flex items-start gap-3">
                                            <FaEye className="w-5 h-5 text-yellow-600 mt-1" />
                                            <div>
                                                <h4 className="font-semibold text-yellow-800 mb-1">Instruções para o vídeo</h4>
                                                <ul className="text-yellow-700 text-sm space-y-1">
                                                    <li>• Grave um vídeo de 15-30 segundos</li>
                                                    <li>• Mostre claramente seu corpo</li>
                                                    <li>• De uma voltinha no vídeo</li>
                                                    <li>• Mantenha boa iluminação</li>
                                                    <li>• <strong>Segure um papel/placa com a data de hoje: {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</strong></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <label className="group relative block w-full h-32 bg-gradient-to-br from-purple-50 to-indigo-100 border-2 border-dashed border-purple-300 rounded-xl cursor-pointer hover:bg-purple-100 hover:border-purple-400 transition-all duration-300">
                                        {formData.comparisonMedia ? (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="text-center">
                                                    <FaCheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                                    <p className="text-green-600 font-medium">Vídeo carregado com sucesso!</p>
                                                    <p className="text-sm text-gray-500">{formData.comparisonMedia.name}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full p-6">
                                                <FaVideo className="w-8 h-8 text-purple-400 group-hover:text-purple-600 transition-colors duration-300 mb-2" />
                                                <p className="text-purple-600 text-center font-medium">Clique para enviar seu vídeo</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            name="video"
                                            accept="video/*"
                                            className="hidden"
                                            onChange={(e) => setFormData({ ...formData, comparisonMedia: e.target.files[0] })}
                                            required
                                        />
                                    </label>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={handlePreviousStep}
                                        className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
                                    >
                                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
                                        Voltar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        disabled={!formData.comparisonMedia}
                                        className={`flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 group ${!formData.comparisonMedia ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-lg'}`}
                                    >
                                        Próxima Etapa
                                        <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Profile Picture */}
                        {step === 4 && (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <FaCamera className="w-5 h-5 text-green-500" />
                                        <h3 className="text-lg font-semibold text-gray-800">Foto de Perfil</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm">Escolha uma foto que represente bem você - será sua imagem principal no perfil</p>
                                </div>

                                <label className="group relative block w-full h-64 bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-dashed border-green-300 rounded-xl cursor-pointer hover:bg-green-100 hover:border-green-400 transition-all duration-300">
                                    {formData.profilePic ? (
                                        <div className="relative w-full h-full rounded-xl overflow-hidden">
                                            <Image
                                                src={URL.createObjectURL(formData.profilePic)}
                                                alt="Foto de Perfil"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <p className="text-white font-medium">Clique para alterar</p>
                                            </div>
                                            <div className="absolute top-4 right-4 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                                <FaCheckCircle className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full p-6">
                                            <FaCamera className="w-16 h-16 text-green-400 group-hover:text-green-600 transition-colors duration-300 mb-4" />
                                            <p className="text-green-600 text-center font-medium text-lg">Clique para escolher sua foto</p>
                                            <p className="text-green-500 text-sm text-center mt-2">Formatos aceitos: JPG, PNG, GIF</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        name="profilePic"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => setFormData({ ...formData, profilePic: e.target.files[0] })}
                                        required
                                    />
                                </label>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={handlePreviousStep}
                                        className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
                                    >
                                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
                                        Voltar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        disabled={!formData.profilePic}
                                        className={`flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 group ${!formData.profilePic ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-lg'}`}
                                    >
                                        Próxima Etapa
                                        <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Password */}
                        {step === 5 && (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <FaLock className="w-5 h-5 text-red-500" />
                                        <h3 className="text-lg font-semibold text-gray-800">Proteção da Conta</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm">Crie uma senha forte para proteger sua conta e dados pessoais</p>
                                </div>

                                <div className="space-y-6">
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

                                    {/* Password Match Status */}
                                    {formData.confirmPassword.length > 0 && (
                                        <div className={`p-4 rounded-xl border ${formData.password === formData.confirmPassword && !passwordMatchError
                                            ? 'bg-green-50 border-green-200'
                                            : 'bg-red-50 border-red-200'
                                            }`}>
                                            <div className="flex items-center gap-3">
                                                {formData.password === formData.confirmPassword && !passwordMatchError ? (
                                                    <>
                                                        <FaCheckCircle className="text-green-500 w-5 h-5" />
                                                        <p className="text-green-700 font-medium">Senhas coincidem perfeitamente!</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <HiSparkles className="text-red-500 w-5 h-5" />
                                                        <p className="text-red-700 font-medium">As senhas não correspondem</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={handlePreviousStep}
                                        className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
                                    >
                                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
                                        Voltar
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || formData.password !== formData.confirmPassword}
                                    className={`w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 group ${loading || formData.password !== formData.confirmPassword
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:scale-[1.02] hover:shadow-xl'
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processando...
                                        </>
                                    ) : (
                                        <>
                                            <HiSparkles className="w-5 h-5 group-hover:animate-pulse" />
                                            Finalizar Cadastro
                                            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </form>

                    {/* Footer */}
                    <div className="text-center mt-8 p-4 bg-gray-50 rounded-xl">
                        <p className="text-gray-600 text-sm">
                            Já tem uma conta?{" "}
                            <button
                                onClick={() => router.push("/login")}
                                className="font-semibold text-pink-500 hover:text-pink-600 transition-colors duration-200"
                            >
                                Fazer Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}