"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  FaEdit,
  FaIdCard,
  FaVideo,
  FaCheckCircle,
  FaClock,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaBuilding,
} from "react-icons/fa";
import Cookies from "js-cookie";

const atendimentoOptions = [
  { value: "HOMENS", label: "Homens" },
  { value: "MULHERES", label: "Mulheres" },
  { value: "CASAIS", label: "Casais" },
  { value: "DEFICIENTES_FISICOS", label: "Deficientes Físicos" },
];

// Opções para os selects
const genitaliaOptions = [
  { value: "NATURAL", label: "Natural" },
  { value: "CIRURGIA", label: "Cirurgicamente Modificada" },
];

const DescriptionManagement = () => {
  const [loading, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [videoPending, setVideoPending] = useState(false);
  const [isVideoApproved, setIsVideoApproved] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(true);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [atendimentos, setAtendimentos] = useState([""]);
  const [showAtendimentosModal, setShowAtendimentosModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = Cookies.get("userToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/description`,
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );

        if (response.status === 200) {
          const data = response.data;
          
          // Preenchendo os campos do formulário com os dados recebidos
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
          
          setValue("atendimentos", data.atendimentos || []);
          setAtendimentos(data.atendimentos || []);
          
          // Verifica se o vídeo foi enviado mas ainda está aguardando aprovação
          if (data.characteristics?.comparisonMedia === null && data.characteristics?.hasComparisonMedia === true) {
            setVideoPending(true);
          }
          
          // Verifica se o vídeo foi aprovado e já está disponível
          if (data.video && data.video.url) {
            setIsVideoApproved(true);
            setVideoUrl(data.video.url);
          }
        } else {
          console.log("Nenhum dado retornado ou status diferente de 200");
        }
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setValue]);

  const handleAtendimentoSelection = (e) => {
    const { value, checked } = e.target;
    setAtendimentos((prev) => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter((atendimento) => atendimento !== value);
      }
    });
    setValue("atendimentos", atendimentos);
  };

  const handleSaveAtendimentos = () => {
    setShowAtendimentosModal(false);
    setValue("atendimentos", atendimentos);
  };

  const handleSubmitForm = async (data) => {
    try {
      const userToken = Cookies.get("userToken");

      // Conversão correta dos valores para o formato esperado pelo backend
      const processedData = {
        description: data.description || "",
        gender: data.gender || "", // Required
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
        atendimentos: data.atendimentos || [],
      };

      let response;

      if (videoFile) {
        // Envio com FormData apenas se houver vídeo
        const formData = new FormData();

        Object.entries(processedData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });

        formData.append("comparisonMedia", videoFile, videoFile.name);


        response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/description/update`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${userToken}`,
            },
            timeout: 60000,
          }
        );
      } else {
        // Envio como JSON normal se não houver vídeo
        console.log("Enviando como JSON:", processedData);

        response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/description/update`,
          processedData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
      }

      if (response.status !== 200) {
        throw new Error(response.data.error || "Erro ao atualizar o perfil");
      }

      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert(error.response?.data?.error || "Ocorreu um erro ao atualizar o perfil.");
    }
  };


  const handleVideoUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setVideoUploaded(true);
      setVideoPending(true);
      setVideoFile(file);
    }
  };


  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md mt-8 max-w-7xl mx-auto">
      {/* Carregamento com ícone de fogo */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center z-50">
                    <Image
                      src="/iconOficial_faixaRosa.png"
                      alt="Ícone oficial Faixa Rosa"
                      width={50}
                      height={50}
                      className="animate-pulse"
                    />
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
          <FaEdit className="text-pink-500 mr-3 text-xl md:text-2xl" />
          Gerenciar Perfil
        </h2>
      </div>

      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-8">
        {/* Seção de Descrição */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <FaInfoCircle className="text-pink-500 mr-2 text-xl md:text-2xl" />
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
              Descrição do Perfil
            </h3>
          </div>
          <div className="relative">
            <textarea
              {...register("description", { required: true })}
              id="description"
              rows="4"
              placeholder="Adicione ou edite sua descrição aqui..."
              className={`w-full p-3 border ${errors.description ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400 transition duration-300`}
            ></textarea>
            {errors.description && (
              <span className="text-red-500 text-sm mt-2 block">
                Por favor, preencha a descrição antes de enviar.
              </span>
            )}
          </div>
        </div>

        {/* Editar Atendimentos */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FaBuilding className="text-pink-500 mr-2" />
            Editar Atendimentos
          </h3>
          <div className="flex items-center">
            <input
              type="text"
              id="atendimentos"
              value={atendimentos.join(", ")}
              readOnly
              placeholder="Selecione os atendimentos"
              className="w-full p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-100 cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowAtendimentosModal(true)}
              className="p-3 bg-pink-500 text-white rounded-r-lg hover:bg-pink-600 transition flex items-center justify-center"
              title="Selecionar Atendimentos"
            >
              <FaEdit />
            </button>
          </div>
        </div>

        {/* Modal de Seleção de Atendimentos */}
        {showAtendimentosModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-semibold mb-4">Selecione os atendimentos</h3>
              <div className="space-y-4">
                {atendimentoOptions.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={option.value}
                      value={option.value}
                      checked={atendimentos.includes(option.value)} // Verifica se o atendimento está selecionado
                      onChange={handleAtendimentoSelection}
                      className="mr-2"
                    />
                    <label htmlFor={option.value} className="text-gray-800">{option.label}</label>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleSaveAtendimentos}
                  className="p-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setShowAtendimentosModal(false)}
                  className="p-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Seção de Upload de Vídeo */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <FaVideo className="text-pink-500 mr-2 text-xl md:text-2xl" />
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
              Mídia de Comparação (Vídeo)
            </h3>
          </div>
          {isVideoApproved && videoUrl ? (
            <div>
              <video src={videoUrl} controls className="w-full max-h-64 object-cover" />
              <div className="flex items-center space-x-3 bg-green-100 border border-green-300 text-green-700 p-4 rounded-lg shadow-sm transition duration-300 mt-2">
                <FaCheckCircle className="text-xl md:text-2xl" />
                <p className="font-semibold">
                  Vídeo aprovado. Não pode ser alterado.
                </p>
              </div>
            </div>
          ) : videoPending ? (
            <div className="flex items-center space-x-3 bg-yellow-100 border border-yellow-300 text-yellow-700 p-4 rounded-lg shadow-sm transition duration-300">
              <FaClock className="text-xl md:text-2xl" />
              <p className="font-semibold">
                Vídeo enviado. Aguardando aprovação do administrador.
              </p>
            </div>
          ) : (
            <div className="relative group">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-lg hover:border-pink-500 transition-colors duration-300">
                <label
                  htmlFor="video-upload"
                  className="text-gray-700 font-semibold cursor-pointer text-xl md:text-2xl"
                >
                  Clique para enviar seu vídeo ou arraste aqui
                </label>
                <p className="text-sm text-gray-500">
                  Formato permitido: MP4
                </p>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/mp4"
                  onChange={handleVideoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              {videoUploaded && (
                <p className="text-gray-700 italic mt-2">
                  Vídeo enviado. Status:{" "}
                  <span className="font-semibold">Pendente</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Seção de Características Físicas */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <button
            type="button"
            onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
            className="flex items-center justify-between w-full text-left text-gray-800 font-semibold text-lg focus:outline-none"
          >
            <div className="flex items-center">
              <FaIdCard className="inline-block mr-2 text-pink-500 text-xl md:text-2xl" />
              Características Físicas
            </div>
            {isFeaturesOpen ? (
              <FaChevronUp className="text-xl md:text-2xl text-pink-500" />
            ) : (
              <FaChevronDown className="text-xl md:text-2xl text-pink-500" />
            )}
          </button>

          {isFeaturesOpen && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Gênero */}
              <div>
                <label
                  htmlFor="gender"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Gênero
                </label>
                <select
                  {...register("gender", { required: true })}
                  id="gender"
                  className={`w-full p-2 border ${errors.gender ? "border-red-500" : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300`}
                >
                  <option value="">Selecione</option>
                  <option value="MULHER_CISGENERO">Mulher Cisgênero</option>
                  <option value="HOMEM_CISGENERO">Homem Cisgênero</option>
                  <option value="MULHER_TRANS">Mulher Trans</option>
                  <option value="HOMEM_TRANS">Homem Trans</option>
                </select>
                {errors.gender && (
                  <span className="text-red-500 text-sm mt-2 block">
                    Por favor, selecione o gênero.
                  </span>
                )}
              </div>

              {/* Genitália */}
              <div>
                <label
                  htmlFor="genitalia"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Genitália
                </label>
                <select
                  {...register("genitalia", { required: true })}
                  id="genitalia"
                  className={`w-full p-2 border ${errors.genitalia ? "border-red-500" : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300`}
                >
                  <option value="">Selecione</option>
                  {genitaliaOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.genitalia && (
                  <span className="text-red-500 text-sm mt-2 block">
                    Por favor, selecione a genitália.
                  </span>
                )}
              </div>

              {/* Peso */}
              <div>
                <label
                  htmlFor="weight"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Peso (kg)
                </label>
                <input
                  {...register("weight", {
                    required: true,
                    pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
                  })}
                  type="text"
                  id="weight"
                  placeholder="Ex: 70"
                  className={`w-full p-2 border ${errors.weight ? "border-red-500" : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400 transition duration-300`}
                />
                {errors.weight && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, insira um weight válido.
                  </span>
                )}
              </div>

              {/* Altura */}
              <div>
                <label
                  htmlFor="height"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Altura (cm)
                </label>
                <input
                  {...register("height", {
                    required: true,
                    pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
                  })}
                  type="text"
                  id="height"
                  placeholder="Ex: 170"
                  className={`w-full p-2 border ${errors.height ? "border-red-500" : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400 transition duration-300`}
                />
                {errors.height && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, insira uma height válida.
                  </span>
                )}
              </div>

              {/* Etnia */}
              <div>
                <label
                  htmlFor="ethnicity"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Etnia
                </label>
                <select
                  {...register("ethnicity", { required: true })}
                  id="ethnicity"
                  className={`w-full p-2 border ${errors.ethnicity ? "border-red-500" : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300`}
                >
                  <option value="">Selecione</option>
                  <option value="BRANCA">Branca</option>
                  <option value="LATINA">Latina</option>
                  <option value="MULATA">Mulata</option>
                  <option value="NEGRA">Negra</option>
                  <option value="ORIENTAl">Oriental</option>
                  <option value="Outra">Outra</option>
                </select>
                {errors.ethnicity && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, selecione a ethnicity.
                  </span>
                )}
              </div>

              {/* Cor dos Olhos */}
              <div>
                <label
                  htmlFor="eyeColor"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Cor dos Olhos
                </label>
                <select
                  {...register("eyeColor", { required: true })}
                  id="eyeColor"
                  className={`w-full p-2 border ${errors.eyeColor ? "border-red-500" : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300`}
                >
                  <option value="">Selecione</option>
                  <option value="CASTANHOS">Castanhos</option>
                  <option value="AZUIS">Azuis</option>
                  <option value="VERDES">Verdes</option>
                  <option value="CINZAS">Cinzas</option>
                  <option value="PRETOS">Pretos</option>
                  <option value="OUTROS">Outros</option>
                </select>
                {errors.eyeColor && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, selecione a cor dos eyeColor.
                  </span>
                )}
              </div>

              {/* Estilo de Cabelo */}
              <div>
                <label
                  htmlFor="hairStyle"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Estilo de Cabelo
                </label>
                <select
                  {...register("hairStyle", { required: true })}
                  id="hairStyle"
                  className={`w-full p-2 border ${errors.hairStyle ? "border-red-500" : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300`}
                >
                  <option value="">Selecione</option>
                  <option value="ONDULADO">Ondulado</option>
                  <option value="LISO">Liso</option>
                  <option value="CACHEADO">Cacheado</option>
                  <option value="CRESPO">Crespo</option>
                  <option value="RASPADO">Raspado</option>
                </select>
                {errors.hairStyle && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, selecione o estilo de cabelo.
                  </span>
                )}
              </div>

              {/* Tamanho de Cabelo */}
              <div>
                <label
                  htmlFor="hairLength"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Tamanho de Cabelo
                </label>
                <select
                  {...register("hairLength", { required: true })}
                  id="hairLength"
                  className={`w-full p-2 border ${errors.hairLength ? "border-red-500" : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300`}
                >
                  <option value="">Selecione</option>
                  <option value="CURTO">Curto</option>
                  <option value="MEDIO">Médio</option>
                  <option value="LONGO">Longo</option>
                </select>
                {errors.hairLength && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, selecione o tamanho de cabelo.
                  </span>
                )}
              </div>

              {/* Tamanho do Pé */}
              <div>
                <label htmlFor="footSize" className="block text-gray-800 font-medium mb-2">
                  Tamanho do Pé
                </label>
                <select
                  {...register("shoeSize", { required: true })}
                  id="shoeSize"
                  defaultValue={getValues("shoeSize") || ""}
                  className={`w-full p-2 border ${errors.shoeSize ? "border-red-500" : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300`}
                >
                  <option value="">Selecione</option>
                  {Array.from({ length: 14 }, (_, i) => (i + 35).toString()).map((size) => ( // Convertendo para string
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                  <option value="Outro">Outro</option>
                </select>

                {errors.footSize && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, selecione um tamanho de pé válido.
                  </span>
                )}
              </div>

              {/* Possui Silicone */}
              <div>
                <label
                  htmlFor="hasSilicone"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Possui Silicone?
                </label>
                <select
                  {...register("hasSilicone", { required: true })}
                  id="hasSilicone"
                  className={`w-full p-2 border ${errors.hasSilicone ? "border-red-500" : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300`}
                >
                  <option value="">Selecione</option>
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
                {errors.hasSilicone && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, selecione uma opção.
                  </span>
                )}
              </div>

              {/* Possui Tatuagens */}
              <div>
                <label
                  htmlFor="hasTattoos"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Possui Tatuagens?
                </label>
                <select
                  {...register("hasTattoos", { required: true })}
                  id="hasTattoos"
                  className={`w-full p-2 border ${errors.hasTattoos ? "border-red-500" : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300`}
                >
                  <option value="">Selecione</option>
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
                {errors.hasTattoos && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, selecione uma opção.
                  </span>
                )}
              </div>

              {/* Possui Piercings */}
              <div>
                <label
                  htmlFor="hasPiercings"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Possui Piercings?
                </label>
                <select
                  {...register("hasPiercings", { required: true })}
                  id="hasPiercings"
                  className={`w-full p-2 border ${errors.hasPiercings ? "border-red-500" : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300`}
                >
                  <option value="">Selecione</option>
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
                {errors.hasPiercings && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, selecione uma opção.
                  </span>
                )}
              </div>

              {/* Fumante */}
              <div>
                <label
                  htmlFor="smoker"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Fumante?
                </label>
                <select
                  {...register("smoker", { required: true })}
                  id="smoker"
                  defaultValue={getValues("smoker") || ""}
                  className={`w-full p-2 border ${errors.smoker ? "border-red-500" : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300`}
                >
                  <option value="">Selecione</option>
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>

                {errors.smoker && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, selecione uma opção.
                  </span>
                )}
              </div>

              {/* Idiomas */}
              {/* <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <label className="block text-gray-800 font-medium mb-2">
                  Idiomas
                </label>
                <Controller
                  control={control}
                  name="idiomas"
                  rules={{
                    required: "Por favor, selecione pelo menos um idioma.",
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isMulti
                      options={languageOptions}
                      classNamePrefix="react-select"
                      placeholder="Selecione os idiomas..."
                      // Mapeia os valores selecionados para os objetos de opção
                      value={languageOptions.filter((option) =>
                        field.value.includes(option.value)
                      )}
                      onChange={(selectedOptions) => {
                        field.onChange(
                          selectedOptions
                            ? selectedOptions.map((option) => option.value)
                            : []
                        );
                      }}
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          borderColor: errors.idiomas ? "#f87171" : "#d1d5db",
                          boxShadow: "none",
                          "&:hover": {
                            borderColor: errors.idiomas ? "#f87171" : "#9ca3af",
                          },
                        }),
                        multiValue: (provided) => ({
                          ...provided,
                          backgroundColor: "#3b82f6",
                        }),
                        multiValueLabel: (provided) => ({
                          ...provided,
                          color: "white",
                        }),
                        multiValueRemove: (provided) => ({
                          ...provided,
                          color: "white",
                          ":hover": {
                            backgroundColor: "#ef4444",
                            color: "white",
                          },
                        }),
                      }}
                    />
                  )}
                />
                {errors.idiomas && (
                  <span className="text-red-500 text-sm mt-2 block">
                    {errors.idiomas.message}
                  </span>
                )}
              </div> */}
            </div>
          )}

          {/* Botão de Atualizar */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-3 bg-pink-500 text-white font-bold text-lg rounded-lg shadow-md hover:bg-pink-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              Atualizar Informações
            </button>
          </div>

          {/* Mensagem de Sucesso */}
          {showSuccessMessage && (
            <div className="mt-4 bg-green-100 border border-green-300 text-green-700 p-4 rounded-lg shadow-sm transition duration-300">
              <p className="font-semibold">
                Informações atualizadas com sucesso!
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default DescriptionManagement;
