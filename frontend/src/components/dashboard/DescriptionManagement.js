"use client";

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEdit,
  FaIdCard,
  FaUser,
  FaVideo,
  FaCheckCircle,
  FaClock,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaBuilding,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaWeight,
  FaRuler,
  FaPalette,
  FaCut,
  FaHeart,
  FaTimes,
  FaCheck,
  FaSave,
  FaSpinner,
  FaUserEdit,
  FaGem,
  FaMagic,
  FaShieldAlt,
  FaQuestionCircle,
  FaHandsHelping,
  FaBars,
  FaArrowLeft,
  FaLightbulb,
  FaArrowRight,
  FaMousePointer,
  FaKeyboard,
  FaClipboardList,
  FaCog,
  FaGraduationCap,
  FaPlay
} from "react-icons/fa";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { usePlan } from "../../context/PlanContext";
import { AuthContext } from "../../context/AuthContext";

const atendimentoOptions = [
  {
    value: "HOMENS",
    label: "Homens",
    icon: "👨",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-500",
    textColor: "text-blue-800"
  },
  {
    value: "MULHERES",
    label: "Mulheres",
    icon: "👩",
    bgColor: "bg-pink-100",
    borderColor: "border-pink-500",
    textColor: "text-pink-800"
  },
  {
    value: "CASAIS",
    label: "Casais",
    icon: "💑",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-500",
    textColor: "text-purple-800"
  },
  {
    value: "DEFICIENTES_FISICOS",
    label: "Deficientes Físicos",
    icon: "♿",
    bgColor: "bg-green-100",
    borderColor: "border-green-500",
    textColor: "text-green-800"
  },
];

const genitaliaOptions = [
  { value: "NATURAL", label: "Natural" },
  { value: "CIRURGIA", label: "Cirurgicamente Modificada" },
];

const DescriptionManagement = () => {
  const { companions, fetchCompanions } = usePlan();
  const { userInfo } = useContext(AuthContext);

  // Estados principais
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Estados de dados
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [videoPending, setVideoPending] = useState(false);
  const [isVideoApproved, setIsVideoApproved] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoStatus, setVideoStatus] = useState("PENDING"); // PENDING, APPROVED, REJECTED, IN_ANALYSIS
  const [videoUrl, setVideoUrl] = useState(null);
  const [atendimentos, setAtendimentos] = useState([]);
  const [userName, setUserName] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [isAgeVisible, setIsAgeVisible] = useState(false);

  // Estados de modais
  const [showAtendimentosModal, setShowAtendimentosModal] = useState(false);
  const [showUserNameModal, setShowUserNameModal] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(true);
  const [canHideAge, setCanHideAge] = useState(false);

  // Estados do tutorial
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Bem-vinda ao Gerenciamento de Perfil! 🎯",
      description: "Vamos te ensinar como completar e otimizar seu perfil em 4 etapas simples",
      icon: FaGraduationCap,
      color: "from-purple-500 to-purple-600",
      action: "Começar tutorial",
      highlight: null
    },
    {
      title: "Navegação entre Seções 📱",
      description: "Use as abas no topo (desktop) ou o menu sanfona (mobile) para navegar entre: Perfil, Características, Atendimentos e Privacidade",
      icon: FaBars,
      color: "from-blue-500 to-blue-600",
      action: "Entendi!",
      highlight: "navigation"
    },
    {
      title: "1️⃣ Seção Perfil - Sua Apresentação",
      description: "Aqui você escreve uma descrição envolvente e pode editar seu nome de usuário. Clique no botão 'Editar' ao lado do seu nome para alterá-lo",
      icon: FaUser,
      color: "from-pink-500 to-pink-600",
      action: "Próximo passo",
      highlight: "profile-section",
      tip: "💡 Dica: Use uma descrição autêntica que destaque seus hobbies e o que te torna única!"
    },
    {
      title: "2️⃣ Seção Características - Seus Dados",
      description: "Preencha suas características físicas como altura, peso, cor dos olhos, etc. Todos os campos são obrigatórios para um perfil completo",
      icon: FaIdCard,
      color: "from-green-500 to-green-600",
      action: "Continue",
      highlight: "characteristics-section",
      tip: "⚠️ Importante: Informações precisas aumentam a confiança dos clientes!"
    },
    {
      title: "3️⃣ Seção Atendimentos - Seu Público",
      description: "Clique em 'Selecionar' para escolher quem você atende: Homens, Mulheres, Casais ou Deficientes Físicos. Pode selecionar várias opções!",
      icon: FaHandsHelping,
      color: "from-orange-500 to-red-500",
      action: "Continuar",
      highlight: "services-section",
      tip: "💼 Estratégia: Quanto mais opções, maior seu alcance de clientes!"
    },
    {
      title: "4️⃣ Seção Privacidade - Seu Controle",
      description: "Se você tem o Plano Oculto, pode esconder sua idade. Use o interruptor para controlar a visibilidade",
      icon: FaShieldAlt,
      color: "from-teal-500 to-cyan-500",
      action: "Finalizar",
      highlight: "privacy-section",
      tip: "🛡️ Premium: O Plano Oculto oferece mais controle sobre suas informações!"
    },
    {
      title: "💾 Salvando suas Alterações",
      description: "Após preencher tudo, clique no botão 'Salvar Alterações' no final da página. Suas informações serão atualizadas instantaneamente!",
      icon: FaSave,
      color: "from-green-500 to-emerald-500",
      action: "Concluir tutorial",
      highlight: "save-button",
      tip: "✅ Lembre-se: Sempre salve após fazer alterações!"
    }
  ];

  const sections = [
    { id: "profile", label: "Perfil", icon: FaUser, shortLabel: "Perfil" },
    { id: "comparisonVideo", label: "Vídeo", icon: FaVideo, shortLabel: "Vídeo" },
    { id: "characteristics", label: "Características", icon: FaIdCard, shortLabel: "Física" },
    { id: "services", label: "Atendimentos", icon: FaHandsHelping, shortLabel: "Serviços" },
    { id: "privacy", label: "Privacidade", icon: FaShieldAlt, shortLabel: "Privacidade" },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  // Funções de carregamento e inicialização
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = Cookies.get("userToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/description`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          const data = response.data;

          setValue("description", data.description || "");
          setValue("gender", data.characteristics?.gender || "");
          setValue("genitalia", data.characteristics?.genitalia || "");
          setValue("weight", data.characteristics?.weight || "");
          setValue("height", data.characteristics?.height || "");
          setValue("ethnicity", data.characteristics?.ethnicity || "");
          setValue("eyeColor", data.characteristics?.eyeColor || "");
          setValue("hairStyle", data.characteristics?.hairStyle || "");
          setValue("hairLength", data.characteristics?.hairLength || "");
          setValue("shoeSize", data.characteristics?.shoeSize || "");
          setValue("hasSilicone", data.characteristics?.hasSilicone ? "true" : "false");
          setValue("hasTattoos", data.characteristics?.hasTattoos ? "true" : "false");
          setValue("hasPiercings", data.characteristics?.hasPiercings ? "true" : "false");
          setValue("smoker", data.characteristics?.smoker ? "true" : "false");
          setUserName(data.userName || "");
          setValue("atendimentos", data.atendimentos || []);
          setAtendimentos(data.atendimentos || []);

          if (data.characteristics?.comparisonMedia === null && data.characteristics?.hasComparisonMedia === true) {
            setVideoPending(true);
          }

          if (data.video && data.video.url) {
            setIsVideoApproved(true);
            setVideoUrl(data.video.url);
            setVideoStatus(data.video.status);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        toast.error("Erro ao carregar dados do perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setValue]);

  useEffect(() => {
    if (userName) {
      fetchCompanions({ planos: true, userName: userName });
    }
  }, [userName, fetchCompanions]);

  useEffect(() => {
    if (companions) {
      const canHideAge = hasActiveHideAgePlan(companions);
      setCanHideAge(canHideAge);
      setIsAgeVisible(companions.isAgeHidden);
    }
  }, [companions]);


  // Handlers
  const handleAgeVisibilityChange = async () => {
    setIsAgeVisible(!isAgeVisible);

    const updatedData = {
      canHideAge: !isAgeVisible,
    };

    try {
      const userToken = Cookies.get("userToken");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/description/update`,
        updatedData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("✨ Visibilidade da idade atualizada!");
      } else {
        toast.error("Erro ao atualizar configuração");
      }
    } catch {
      toast.error("Erro de conexão");
    }
  };

  const handleAtendimentoSelection = (e) => {
    const { value, checked } = e.target;
    setAtendimentos((prev) => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter((atendimento) => atendimento !== value);
      }
    });
  };

  const handleSaveAtendimentos = () => {
    setShowAtendimentosModal(false);
    setValue("atendimentos", atendimentos);
    toast.success("Atendimentos selecionados!");
  };

  const handleSubmitForm = async (data) => {
    setSaving(true);
    try {
      const userToken = Cookies.get("userToken");

      const processedData = {
        description: data.description || "",
        gender: data.gender || "",
        genitalia: data.genitalia || null,
        weight: data.weight ? Number(data.weight) : 0,
        height: data.height ? Number(data.height) : 0,
        ethnicity: data.ethnicity || "",
        eyeColor: data.eyeColor || "",
        hairStyle: data.hairStyle || "",
        hairLength: data.hairLength || "",
        shoeSize: data.shoeSize ? String(data.shoeSize) : "",
        hasSilicone: data.hasSilicone === true || data.hasSilicone === "true",
        hasTattoos: data.hasTattoos === true || data.hasTattoos === "true",
        hasPiercings: data.hasPiercings === true || data.hasPiercings === "true",
        smoker: data.smoker === true || data.smoker === "true",
        hasComparisonMedia: Boolean(videoFile),
        atendimentos: atendimentos || [],
      };

      let response;

      if (videoFile) {
        const formData = new FormData();
        Object.entries(processedData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });
        formData.append("comparisonMedia", videoFile);

        response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/description/update`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
            timeout: 60000,
          }
        );
      } else {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/description/update`,
          processedData,
          { withCredentials: true }
        );
      }

      if (response.status === 200) {
        toast.success("🎉 Perfil atualizado com sucesso!");
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        toast.error("Erro ao atualizar perfil");
      }
    } catch (error) {
      toast.error("Erro de conexão");
      console.error("Erro:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveUserName = async () => {
    try {
      const userToken = Cookies.get("userToken");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/description/update`,
        { userName: newUserName },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("✨ Nome de usuário atualizado!");
        setShowUserNameModal(false);
        setUserName(newUserName);
        setValue("userName", newUserName);
      } else {
        toast.error("Erro ao atualizar nome");
      }
    } catch {
      toast.error("Erro de conexão");
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error("Arquivo muito grande! Máximo 100MB");
        return;
      }

      if (!file.type.startsWith('video/')) {
        toast.error("Apenas arquivos de vídeo são permitidos!");
        return;
      }

      setVideoUploaded(true);
      setVideoPending(true);
      setVideoFile(file);

      const formData = new FormData();
      formData.append('comparisonMedia', file, file.name);

      const userToken = Cookies.get("userToken");

      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/description/update`, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000,
        })
        .then((response) => {
          toast.success('🎬 Vídeo enviado para análise!');
        })
        .catch((error) => {
          toast.error('Erro ao enviar vídeo');
        });
    }
  };

  // Tutorial handlers
  const handleNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowTutorial(false);
      setCurrentStep(0);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    setCurrentStep(0);
  };

  // Tutorial highlight effect
  const getHighlightClass = (elementId) => {
    const currentStepData = tutorialSteps[currentStep];
    if (showTutorial && currentStepData?.highlight === elementId) {
      return "relative z-50 ring-4 ring-yellow-400 ring-opacity-75 shadow-2xl rounded-2xl";
    }
    return "";
  };

  // Renderização de seções MOBILE FIRST
  const renderProfileBasicSection = () => (
    <div className={`space-y-4 md:space-y-6 ${getHighlightClass('profile-section')}`}>
      {/* Descrição */}
      <motion.div
        className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center mr-3 md:mr-4">
            <FaInfoCircle className="text-white text-lg md:text-xl" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800">Descrição do Perfil</h3>
            <p className="text-gray-600 text-xs md:text-sm">Conte sua história de forma atrativa</p>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          <textarea
            {...register("description", { required: "Descrição é obrigatória" })}
            rows="4"
            placeholder="Escreva uma descrição envolvente sobre você..."
            className={`w-full p-3 md:p-4 border-2 rounded-xl md:rounded-2xl resize-none transition-all duration-300 focus:outline-none text-sm md:text-base ${errors.description
              ? "border-red-500 focus:border-red-600 bg-red-50"
              : "border-gray-200 focus:border-pink-500 focus:bg-pink-50"
              }`}
          />

          {errors.description && (
            <motion.div
              className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl text-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <FaInfoCircle />
              <span className="font-medium">{errors.description.message}</span>
            </motion.div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 md:p-4">
            <div className="flex items-start space-x-2 md:space-x-3">
              <FaQuestionCircle className="text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2 text-sm md:text-base">💡 Dicas para uma boa descrição:</h4>
                <ul className="text-xs md:text-sm text-blue-700 space-y-1">
                  <li>• Seja autêntica e genuína</li>
                  <li>• Mencione seus hobbies e interesses</li>
                  <li>• Destaque o que te torna única</li>
                  <li>• Use uma linguagem positiva e acolhedora</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Nome de usuário */}
      <motion.div
        className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl md:rounded-2xl flex items-center justify-center mr-3 md:mr-4">
            <FaUserEdit className="text-white text-lg md:text-xl" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800">Nome de Usuário</h3>
            <p className="text-gray-600 text-xs md:text-sm">Como você será conhecida na plataforma</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={userInfo?.companion?.userName || userName}
              readOnly
              className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl md:rounded-2xl bg-gray-50 text-gray-700 font-medium text-sm md:text-base"
            />
            <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2">
              <FaUser className="text-gray-400" />
            </div>
          </div>
          <motion.button
            type="button"
            onClick={() => {
              setNewUserName(userInfo?.companion?.userName || userName);
              setShowUserNameModal(true);
            }}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center space-x-2 text-sm md:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaEdit />
            <span>Editar</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );

  const renderComparisonVideoSection = () => (
    <motion.div
      className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl md:rounded-2xl flex items-center justify-center mr-3 md:mr-4">
          <FaVideo className="text-white text-lg md:text-xl" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800">Vídeo de Comparação</h3>
          <p className="text-gray-600 text-xs md:text-sm">
            Envie um vídeo seu para aumentar a confiança no seu perfil
          </p>
        </div>
      </div>

      {videoUrl && videoStatus === "APPROVED" ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-green-800 text-sm flex items-center space-x-2">
            <FaCheckCircle />
            <span>Seu vídeo foi aprovado! Ele está visível na sua página de perfil público.</span>
          </div>
          <Link
            href={`/perfil/${userName}`}
            className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
          >
            <FaArrowRight />
            <span>Ver meu Perfil</span>
          </Link>
        </div>
      ) : videoStatus === "IN_ANALYSIS" ? (
        <div className="space-y-4">
          <video
            src={videoUrl}
            controls
            className="w-full rounded-xl border border-gray-200 shadow"
          />
          <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded-xl text-sm">
            <FaClock />
            <span>Seu vídeo está em análise pela equipe</span>
          </div>
        </div>
      ) : videoStatus === "SUSPENDED" ? (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-800 text-sm flex items-center space-x-2">
          <FaLock />
          <span>Seu vídeo foi suspenso. Entre em contato com o suporte para mais informações.</span>
        </div>
      ) : (
        <div className="space-y-4">
          {videoStatus === "REJECTED" && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-800 text-sm flex items-center space-x-2">
              <FaTimes />
              <span>Seu vídeo foi rejeitado. Por favor, envie novamente seguindo as orientações abaixo.</span>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
            <p>
              <FaInfoCircle className="inline mr-1" />
              Envie um vídeo apresentando seu rosto e corpo em pé, com boa iluminação e nitidez.
            </p>
          </div>

          <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300">
            <FaVideo className="text-indigo-500 text-3xl mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Clique para enviar vídeo de até 100MB</p>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoUpload}
            />
          </label>
        </div>
      )}
    </motion.div>
  );

  const renderCharacteristicsSection = () => (
    <div className={`space-y-4 md:space-y-6 ${getHighlightClass('characteristics-section')}`}>
      <motion.div
        className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center mr-3 md:mr-4">
              <FaIdCard className="text-white text-lg md:text-xl" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800">Características Físicas</h3>
              <p className="text-gray-600 text-xs md:text-sm">Informações sobre sua aparência</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
            className="p-2 md:p-3 bg-gray-100 rounded-xl md:rounded-2xl hover:bg-gray-200 transition-colors"
          >
            {isFeaturesOpen ? <FaChevronUp className="text-gray-600" /> : <FaChevronDown className="text-gray-600" />}
          </button>
        </div>

        <AnimatePresence>
          {isFeaturesOpen && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Gênero */}
              <div className="space-y-2 md:space-y-3">
                <label className="flex items-center space-x-2 text-gray-800 font-semibold text-sm md:text-base">
                  <FaUser className="text-pink-500" />
                  <span>Gênero</span>
                </label>
                <select
                  {...register("gender", { required: "Selecione seu gênero" })}
                  className={`w-full p-2 md:p-3 border-2 rounded-xl md:rounded-2xl transition-all duration-300 text-sm md:text-base ${errors.gender ? "border-red-500" : "border-gray-200 focus:border-pink-500"
                    }`}
                >
                  <option value="">Selecione...</option>
                  <option value="MULHER_CISGENERO">Mulher Cisgênero</option>
                  <option value="HOMEM_CISGENERO">Homem Cisgênero</option>
                  <option value="MULHER_TRANS">Mulher Trans</option>
                  <option value="HOMEM_TRANS">Homem Trans</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-xs md:text-sm flex items-center space-x-1">
                    <FaInfoCircle />
                    <span>{errors.gender.message}</span>
                  </p>
                )}
              </div>

              {/* Genitália */}
              <div className="space-y-2 md:space-y-3">
                <label className="flex items-center space-x-2 text-gray-800 font-semibold text-sm md:text-base">
                  <FaIdCard className="text-purple-500" />
                  <span>Genitália</span>
                </label>
                <select
                  {...register("genitalia", { required: "Selecione uma opção" })}
                  className={`w-full p-2 md:p-3 border-2 rounded-xl md:rounded-2xl transition-all duration-300 text-sm md:text-base ${errors.genitalia ? "border-red-500" : "border-gray-200 focus:border-purple-500"
                    }`}
                >
                  <option value="">Selecione...</option>
                  {genitaliaOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.genitalia && (
                  <p className="text-red-500 text-xs md:text-sm flex items-center space-x-1">
                    <FaInfoCircle />
                    <span>{errors.genitalia.message}</span>
                  </p>
                )}
              </div>

              {/* Peso */}
              <div className="space-y-2 md:space-y-3">
                <label className="flex items-center space-x-2 text-gray-800 font-semibold text-sm md:text-base">
                  <FaWeight className="text-blue-500" />
                  <span>Peso (kg)</span>
                </label>
                <input
                  {...register("weight", {
                    required: "Peso é obrigatório",
                    pattern: {
                      value: /^[0-9]+(\.[0-9]{1,2})?$/,
                      message: "Digite um peso válido"
                    }
                  })}
                  type="text"
                  placeholder="Ex: 60"
                  className={`w-full p-2 md:p-3 border-2 rounded-xl md:rounded-2xl transition-all duration-300 text-sm md:text-base ${errors.weight ? "border-red-500" : "border-gray-200 focus:border-blue-500"
                    }`}
                />
                {errors.weight && (
                  <p className="text-red-500 text-xs md:text-sm flex items-center space-x-1">
                    <FaInfoCircle />
                    <span>{errors.weight.message}</span>
                  </p>
                )}
              </div>

              {/* Altura */}
              <div className="space-y-2 md:space-y-3">
                <label className="flex items-center space-x-2 text-gray-800 font-semibold text-sm md:text-base">
                  <FaRuler className="text-green-500" />
                  <span>Altura (cm)</span>
                </label>
                <input
                  {...register("height", {
                    required: "Altura é obrigatória",
                    pattern: {
                      value: /^[0-9]+(\.[0-9]{1,2})?$/,
                      message: "Digite uma altura válida"
                    }
                  })}
                  type="text"
                  placeholder="Ex: 165"
                  className={`w-full p-2 md:p-3 border-2 rounded-xl md:rounded-2xl transition-all duration-300 text-sm md:text-base ${errors.height ? "border-red-500" : "border-gray-200 focus:border-green-500"
                    }`}
                />
                {errors.height && (
                  <p className="text-red-500 text-xs md:text-sm flex items-center space-x-1">
                    <FaInfoCircle />
                    <span>{errors.height.message}</span>
                  </p>
                )}
              </div>

              {/* Etnia */}
              <div className="space-y-2 md:space-y-3">
                <label className="flex items-center space-x-2 text-gray-800 font-semibold text-sm md:text-base">
                  <FaPalette className="text-purple-500" />
                  <span>Etnia</span>
                </label>
                <select
                  {...register("ethnicity", { required: "Selecione sua etnia" })}
                  className={`w-full p-2 md:p-3 border-2 rounded-xl md:rounded-2xl transition-all duration-300 text-sm md:text-base ${errors.ethnicity ? "border-red-500" : "border-gray-200 focus:border-purple-500"
                    }`}
                >
                  <option value="">Selecione...</option>
                  <option value="BRANCA">Branca</option>
                  <option value="LATINA">Latina</option>
                  <option value="MULATA">Mulata</option>
                  <option value="NEGRA">Negra</option>
                  <option value="ORIENTAL">Oriental</option>
                  <option value="Outra">Outra</option>
                </select>
                {errors.ethnicity && (
                  <p className="text-red-500 text-xs md:text-sm flex items-center space-x-1">
                    <FaInfoCircle />
                    <span>{errors.ethnicity.message}</span>
                  </p>
                )}
              </div>

              {/* Cor dos Olhos */}
              <div className="space-y-2 md:space-y-3">
                <label className="flex items-center space-x-2 text-gray-800 font-semibold text-sm md:text-base">
                  <FaEye className="text-blue-500" />
                  <span>Cor dos Olhos</span>
                </label>
                <select
                  {...register("eyeColor", { required: "Selecione a cor dos olhos" })}
                  className={`w-full p-2 md:p-3 border-2 rounded-xl md:rounded-2xl transition-all duration-300 text-sm md:text-base ${errors.eyeColor ? "border-red-500" : "border-gray-200 focus:border-blue-500"
                    }`}
                >
                  <option value="">Selecione...</option>
                  <option value="CASTANHOS">Castanhos</option>
                  <option value="AZUIS">Azuis</option>
                  <option value="VERDES">Verdes</option>
                  <option value="CINZAS">Cinzas</option>
                  <option value="PRETOS">Pretos</option>
                  <option value="OUTROS">Outros</option>
                </select>
                {errors.eyeColor && (
                  <p className="text-red-500 text-xs md:text-sm flex items-center space-x-1">
                    <FaInfoCircle />
                    <span>{errors.eyeColor.message}</span>
                  </p>
                )}
              </div>

              {/* Estilo de Cabelo */}
              <div className="space-y-2 md:space-y-3">
                <label className="flex items-center space-x-2 text-gray-800 font-semibold text-sm md:text-base">
                  <FaCut className="text-orange-500" />
                  <span>Estilo do Cabelo</span>
                </label>
                <select
                  {...register("hairStyle", { required: "Selecione o estilo do cabelo" })}
                  className={`w-full p-2 md:p-3 border-2 rounded-xl md:rounded-2xl transition-all duration-300 text-sm md:text-base ${errors.hairStyle ? "border-red-500" : "border-gray-200 focus:border-orange-500"
                    }`}
                >
                  <option value="">Selecione...</option>
                  <option value="ONDULADO">Ondulado</option>
                  <option value="LISO">Liso</option>
                  <option value="CACHEADO">Cacheado</option>
                  <option value="CRESPO">Crespo</option>
                  <option value="RASPADO">Raspado</option>
                </select>
                {errors.hairStyle && (
                  <p className="text-red-500 text-xs md:text-sm flex items-center space-x-1">
                    <FaInfoCircle />
                    <span>{errors.hairStyle.message}</span>
                  </p>
                )}
              </div>

              {/* Tamanho do Cabelo */}
              <div className="space-y-2 md:space-y-3">
                <label className="flex items-center space-x-2 text-gray-800 font-semibold text-sm md:text-base">
                  <FaRuler className="text-teal-500" />
                  <span>Tamanho do Cabelo</span>
                </label>
                <select
                  {...register("hairLength", { required: "Selecione o tamanho do cabelo" })}
                  className={`w-full p-2 md:p-3 border-2 rounded-xl md:rounded-2xl transition-all duration-300 text-sm md:text-base ${errors.hairLength ? "border-red-500" : "border-gray-200 focus:border-teal-500"
                    }`}
                >
                  <option value="">Selecione...</option>
                  <option value="CURTO">Curto</option>
                  <option value="MEDIO">Médio</option>
                  <option value="LONGO">Longo</option>
                </select>
                {errors.hairLength && (
                  <p className="text-red-500 text-xs md:text-sm flex items-center space-x-1">
                    <FaInfoCircle />
                    <span>{errors.hairLength.message}</span>
                  </p>
                )}
              </div>

              {/* Tamanho do Pé */}
              <div className="space-y-2 md:space-y-3">
                <label className="flex items-center space-x-2 text-gray-800 font-semibold text-sm md:text-base">
                  <FaRuler className="text-indigo-500" />
                  <span>Tamanho do Pé</span>
                </label>
                <select
                  {...register("shoeSize", { required: "Selecione o tamanho do pé" })}
                  className={`w-full p-2 md:p-3 border-2 rounded-xl md:rounded-2xl transition-all duration-300 text-sm md:text-base ${errors.shoeSize ? "border-red-500" : "border-gray-200 focus:border-indigo-500"
                    }`}
                >
                  <option value="">Selecione...</option>
                  {Array.from({ length: 14 }, (_, i) => (i + 35).toString()).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                  <option value="Outro">Outro</option>
                </select>
                {errors.shoeSize && (
                  <p className="text-red-500 text-xs md:text-sm flex items-center space-x-1">
                    <FaInfoCircle />
                    <span>{errors.shoeSize.message}</span>
                  </p>
                )}
              </div>

              {/* Características Sim/Não */}
              {[
                { key: "hasSilicone", label: "Possui Silicone?", icon: FaGem },
                { key: "hasTattoos", label: "Possui Tatuagens?", icon: FaMagic },
                { key: "hasPiercings", label: "Possui Piercings?", icon: FaHeart },
                { key: "smoker", label: "Fumante?", icon: FaInfoCircle },
              ].map((item) => (
                <div key={item.key} className="space-y-2 md:space-y-3">
                  <label className="flex items-center space-x-2 text-gray-800 font-semibold text-sm md:text-base">
                    <item.icon className="text-pink-500" />
                    <span>{item.label}</span>
                  </label>
                  <select
                    {...register(item.key, { required: "Selecione uma opção" })}
                    className={`w-full p-2 md:p-3 border-2 rounded-xl md:rounded-2xl transition-all duration-300 text-sm md:text-base ${errors[item.key] ? "border-red-500" : "border-gray-200 focus:border-pink-500"
                      }`}
                  >
                    <option value="">Selecione...</option>
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                  </select>
                  {errors[item.key] && (
                    <p className="text-red-500 text-xs md:text-sm flex items-center space-x-1">
                      <FaInfoCircle />
                      <span>{errors[item.key].message}</span>
                    </p>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );

  const renderServicesSection = () => (
    <motion.div
      className={`bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100 ${getHighlightClass('services-section')}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl md:rounded-2xl flex items-center justify-center mr-3 md:mr-4">
          <FaHandsHelping className="text-white text-lg md:text-xl" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800">Tipos de Atendimento</h3>
          <p className="text-gray-600 text-xs md:text-sm">Selecione quem você atende</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4 md:mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            value={atendimentos.length > 0 ? atendimentos.join(", ") : "Nenhum atendimento selecionado"}
            readOnly
            className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl md:rounded-2xl bg-gray-50 text-gray-700 font-medium text-sm md:text-base"
          />
          <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2">
            <FaBuilding className="text-gray-400" />
          </div>
        </div>
        <motion.button
          type="button"
          onClick={() => setShowAtendimentosModal(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center space-x-2 text-sm md:text-base"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaEdit />
          <span>Selecionar</span>
        </motion.button>
      </div>

      {/* Preview dos atendimentos selecionados - MOBILE OPTIMIZED */}
      {atendimentos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {atendimentos.map((atendimento) => {
            const option = atendimentoOptions.find(opt => opt.value === atendimento);
            return option ? (
              <div
                key={atendimento}
                className={`${option.bgColor} border-2 ${option.borderColor} p-3 md:p-4 rounded-xl md:rounded-2xl text-center`}
              >
                <div className="text-xl md:text-2xl mb-2">{option.icon}</div>
                <div className={`${option.textColor} font-semibold text-xs md:text-sm`}>
                  {option.label}
                </div>
              </div>
            ) : null;
          })}
        </div>
      )}
    </motion.div>
  );

  function hasActiveHideAgePlan(companion) {
    return Array.isArray(companion?.subscriptions) &&
      companion.subscriptions.some(
        (sub) =>
          sub?.extraPlan?.isEnabled &&
          sub?.extraPlan?.canHideAge === true &&
          (!sub.endDate || new Date(sub.endDate) > new Date())
      );
  }

  const renderPrivacySection = () => {
    return (
      <motion.div
        className={`bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100 ${getHighlightClass('privacy-section')}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl md:rounded-2xl flex items-center justify-center mr-3 md:mr-4">
            <FaShieldAlt className="text-white text-lg md:text-xl" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800">Configurações de Privacidade</h3>
            <p className="text-gray-600 text-xs md:text-sm">Controle o que aparece no seu perfil</p>
          </div>
        </div>

        {canHideAge ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl md:rounded-2xl p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-4">
                <div className="flex items-center space-x-3">
                  <FaGem className="text-green-500 text-xl flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-green-800 text-sm md:text-base">Ocultar Idade</h4>
                    <p className="text-green-600 text-xs md:text-sm">Controle a visibilidade da sua idade</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAgeVisible}
                    onChange={handleAgeVisibilityChange}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 md:w-14 h-6 md:h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 md:after:h-6 md:after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              <div className="flex items-center space-x-2 text-xs md:text-sm">
                {isAgeVisible ? (
                  <>
                    <FaEye className="text-green-500" />
                    <span className="text-green-700 font-medium">Idade visível para todos</span>
                  </>
                ) : (
                  <>
                    <FaEyeSlash className="text-gray-500" />
                    <span className="text-gray-700 font-medium">Idade oculta</span>
                  </>
                )}
              </div>

              <div className="mt-4 p-3 md:p-4 bg-white/60 rounded-xl">
                <p className="text-xs md:text-sm text-green-700">
                  <strong>Como funciona:</strong> Quando ativada, sua idade será escondida tanto no card de anúncio quanto no seu perfil público.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                <FaLock className="text-gray-400 text-lg md:text-xl" />
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2 text-sm md:text-base">Plano Premium Necessário</h4>
                <p className="text-gray-600 text-xs md:text-sm mb-4">
                  Para ocultar sua idade, você precisa do <strong>Plano Oculto</strong>
                </p>

                <Link
                  href="/planos"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 text-sm md:text-base"
                >
                  <FaGem />
                  <span>Ver Planos</span>
                </Link>
              </div>

              <div className="mt-4 p-3 md:p-4 bg-blue-50 rounded-xl">
                <p className="text-xs md:text-sm text-blue-700">
                  <FaInfoCircle className="inline mr-2" />
                  Com o Plano Oculto você pode esconder sua idade tanto no card quanto no perfil.
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // Loading screen
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <motion.div
          className="text-center p-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4"
          >
            <Image
              src="/iconOficial_faixaRosa.png"
              alt="Loading"
              width={64}
              height={64}
              className="w-full h-full"
            />
          </motion.div>
          <p className="text-gray-600 font-medium text-sm md:text-base">Carregando informações do perfil...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto p-3 md:p-4 lg:p-8">
        {/* Header MOBILE OPTIMIZED */}
        <motion.div
          className="mb-6 md:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 md:mb-4">
              Gerenciar Perfil
            </h1>
            <p className="text-gray-600 text-sm md:text-lg mb-4">
              Complete e atualize as informações do seu perfil
            </p>

            {/* Tutorial Button */}
            <motion.button
              onClick={() => setShowTutorial(true)}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-2 text-sm md:text-base mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlay />
              <span>Como Usar este Painel</span>
            </motion.button>
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden mb-4 ${getHighlightClass('navigation')}`}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between bg-white p-4 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="flex items-center space-x-3">
                {sections.find(s => s.id === activeSection)?.icon && (
                  React.createElement(sections.find(s => s.id === activeSection).icon, {
                    className: "text-pink-500 text-lg"
                  })
                )}
                <span className="font-semibold text-gray-800">
                  {sections.find(s => s.id === activeSection)?.label}
                </span>
              </div>
              {isMobileMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  className="mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => {
                          setActiveSection(section.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 p-4 text-left transition-colors ${activeSection === section.id
                          ? "bg-pink-50 text-pink-600 border-r-4 border-pink-500"
                          : "text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        <Icon className="text-lg" />
                        <span className="font-medium">{section.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex flex-wrap justify-center gap-2 bg-gray-100 p-2 rounded-3xl ${getHighlightClass('navigation')}`}>
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${activeSection === section.id
                    ? "bg-white text-pink-600 shadow-lg"
                    : "text-gray-600 hover:text-gray-800"
                    }`}
                >
                  <Icon className="text-lg" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          {/* Content based on active section */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === "profile" && renderProfileBasicSection()}
            {activeSection === "comparisonVideo" && renderComparisonVideoSection()}
            {activeSection === "characteristics" && renderCharacteristicsSection()}
            {activeSection === "services" && renderServicesSection()}
            {activeSection === "privacy" && renderPrivacySection()}
          </motion.div>

          {/* Save button MOBILE OPTIMIZED */}
          <motion.div
            className={`mt-6 md:mt-8 ${getHighlightClass('save-button')}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-3xl font-bold text-base md:text-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-3 shadow-2xl"
              whileHover={{ scale: saving ? 1 : 1.02 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin text-lg md:text-xl" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <FaSave className="text-lg md:text-xl" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </form>

        {/* Success message */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              className="fixed bottom-4 left-4 right-4 md:bottom-6 md:right-6 md:left-auto bg-green-500 text-white p-3 md:p-4 rounded-2xl shadow-2xl flex items-center space-x-3 z-50"
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <FaCheckCircle className="text-lg md:text-xl flex-shrink-0" />
              <span className="font-semibold text-sm md:text-base">Perfil atualizado com sucesso!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tutorial Modal MOBILE OPTIMIZED */}
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {(() => {
                  const currentTutorial = tutorialSteps[currentStep];
                  const IconComponent = currentTutorial.icon;

                  return (
                    <div className="text-center">
                      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-br ${currentTutorial.color}`}>
                        <IconComponent className="text-white text-2xl md:text-3xl" />
                      </div>

                      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                        {currentTutorial.title}
                      </h3>

                      <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
                        {currentTutorial.description}
                      </p>

                      {/* Tip Section */}
                      {currentTutorial.tip && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                          <p className="text-xs md:text-sm text-yellow-800 font-medium">
                            {currentTutorial.tip}
                          </p>
                        </div>
                      )}

                      {/* Progress indicators */}
                      <div className="flex justify-center items-center space-x-2 mb-6">
                        {tutorialSteps.map((_, index) => (
                          <div
                            key={index}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentStep
                              ? "bg-pink-500 w-8 md:w-10"
                              : index < currentStep
                                ? "bg-green-500 w-2"
                                : "bg-gray-300 w-2"
                              }`}
                          />
                        ))}
                      </div>

                      {/* Navigation buttons */}
                      <div className="flex justify-between items-center">
                        <div className="text-xs md:text-sm text-gray-500 font-medium">
                          {currentStep + 1} de {tutorialSteps.length}
                        </div>

                        <div className="flex space-x-3">
                          {currentStep > 0 && (
                            <button
                              onClick={handlePrevStep}
                              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm md:text-base"
                            >
                              Anterior
                            </button>
                          )}

                          <button
                            onClick={handleNextStep}
                            className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base bg-gradient-to-r ${currentTutorial.color} text-white hover:shadow-lg`}
                          >
                            {currentStep === tutorialSteps.length - 1 ? "Finalizar" : currentTutorial.action}
                          </button>
                        </div>
                      </div>

                      {/* Close button */}
                      <button
                        onClick={closeTutorial}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <FaTimes className="text-lg md:text-xl" />
                      </button>
                    </div>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de Nome de Usuário MOBILE OPTIMIZED */}
        <AnimatePresence>
          {showUserNameModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FaUserEdit className="text-white text-lg md:text-2xl" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                    Editar Nome de Usuário
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm">
                    Escolha como você será conhecida na plataforma
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Digite o novo nome de usuário"
                    className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl md:rounded-2xl focus:border-blue-500 focus:outline-none transition-all duration-300 text-sm md:text-base"
                  />
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => setShowUserNameModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl md:rounded-2xl font-semibold hover:bg-gray-200 transition-colors text-sm md:text-base"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveUserName}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl md:rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 text-sm md:text-base"
                  >
                    Salvar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de Atendimentos MOBILE OPTIMIZED */}
        <AnimatePresence>
          {showAtendimentosModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FaHandsHelping className="text-white text-lg md:text-2xl" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                    Selecionar Atendimentos
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm">
                    Escolha quem você atende (pode selecionar múltiplas opções)
                  </p>
                </div>

                <div className="space-y-3 md:space-y-4 mb-6">
                  {atendimentoOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center space-x-3 md:space-x-4 p-3 md:p-4 border-2 rounded-xl md:rounded-2xl cursor-pointer transition-all duration-300 ${atendimentos.includes(option.value)
                        ? `${option.borderColor} ${option.bgColor}`
                        : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={atendimentos.includes(option.value)}
                        onChange={handleAtendimentoSelection}
                        className="hidden"
                      />
                      <div className="text-xl md:text-2xl">{option.icon}</div>
                      <div className="flex-1">
                        <span className="font-semibold text-gray-800 text-sm md:text-base">{option.label}</span>
                      </div>
                      {atendimentos.includes(option.value) && (
                        <FaCheckCircle className="text-green-500 text-lg md:text-xl" />
                      )}
                    </label>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => setShowAtendimentosModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl md:rounded-2xl font-semibold hover:bg-gray-200 transition-colors text-sm md:text-base"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveAtendimentos}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl md:rounded-2xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-sm md:text-base"
                  >
                    Salvar Seleção
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DescriptionManagement;