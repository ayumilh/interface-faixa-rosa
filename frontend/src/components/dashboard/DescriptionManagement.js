"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import {
  FaEdit,
  FaIdCard,
  FaVideo,
  FaCheckCircle,
  FaClock,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
} from "react-icons/fa";

// Opções para o multi-select de idiomas
const languageOptions = [
  { value: "Português", label: "Português" },
  { value: "Inglês", label: "Inglês" },
  { value: "Espanhol", label: "Espanhol" },
  { value: "Francês", label: "Francês" },
  { value: "Mandarim", label: "Mandarim" },
];

// Opções para Genitália
const genitaliaOptions = [
  { value: "Possui Vagina", label: "Possui Vagina" },
  { value: "Possui Penis", label: "Possui Penis" },
];

const DescriptionManagement = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [videoPending, setVideoPending] = useState(false);
  const [isVideoApproved, setIsVideoApproved] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: "",
      genero: "",
      genitalia: "",
      peso: "",
      altura: "",
      etnia: "",
      olhos: "",
      estiloCabelo: "",
      tamanhoCabelo: "",
      tamanhoPe: "",
      silicone: "",
      tatuagens: "",
      piercings: "",
      fumante: "",
      idiomas: [],
    },
  });

  const onSubmit = (data) => {
    console.log("Dados Atualizados:", data);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    reset(data);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Vídeo enviado:", file.name);
      setVideoUploaded(true);
      setVideoPending(true);
      // Aqui você pode adicionar lógica para enviar o vídeo para o servidor
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md mt-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
          <FaEdit className="text-pink-500 mr-3 text-xl md:text-2xl" />
          Gerenciar Perfil
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
              className={`w-full p-3 border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400 transition duration-300`}
            ></textarea>
            {errors.description && (
              <span className="text-red-500 text-sm mt-2 block">
                Por favor, preencha a descrição antes de enviar.
              </span>
            )}
          </div>
        </div>

        {/* Seção de Upload de Vídeo */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <FaVideo className="text-pink-500 mr-2 text-xl md:text-2xl" />
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
              Mídia de Comparação (Vídeo)
            </h3>
          </div>
          {isVideoApproved ? (
            <div className="flex items-center space-x-3 bg-green-100 border border-green-300 text-green-700 p-4 rounded-lg shadow-sm transition duration-300">
              <FaCheckCircle className="text-xl md:text-2xl" />
              <p className="font-semibold">
                Vídeo aprovado. Não pode ser alterado.
              </p>
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
                  htmlFor="genero"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Gênero
                </label>
                <select
                  {...register("genero", { required: true })}
                  id="genero"
                  className={`w-full p-2 border ${
                    errors.genero ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300`}
                >
                  <option value="">Selecione</option>
                  <option value="Mulher Cisgênero">Mulher Cisgênero</option>
                  <option value="Homem Cisgênero">Homem Cisgênero</option>
                  <option value="Mulher Trans">Mulher Trans</option>
                  <option value="Homem Trans">Homem Trans</option>
                </select>
                {errors.genero && (
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
                  className={`w-full p-2 border ${
                    errors.genitalia ? "border-red-500" : "border-gray-300"
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
                  htmlFor="peso"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Peso (kg)
                </label>
                <input
                  {...register("peso", {
                    required: true,
                    pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
                  })}
                  type="text"
                  id="peso"
                  placeholder="Ex: 70"
                  className={`w-full p-2 border ${
                    errors.peso ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400 transition duration-300`}
                />
                {errors.peso && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, insira um peso válido.
                  </span>
                )}
              </div>

              {/* Altura */}
              <div>
                <label
                  htmlFor="altura"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Altura (cm)
                </label>
                <input
                  {...register("altura", {
                    required: true,
                    pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
                  })}
                  type="text"
                  id="altura"
                  placeholder="Ex: 170"
                  className={`w-full p-2 border ${
                    errors.altura ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400 transition duration-300`}
                />
                {errors.altura && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, insira uma altura válida.
                  </span>
                )}
              </div>

              {/* Etnia */}
              <div>
                <label
                  htmlFor="etnia"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Etnia
                </label>
                <select
                  {...register("etnia", { required: true })}
                  id="etnia"
                  className={`w-full p-2 border ${
                    errors.etnia ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300`}
                >
                  <option value="">Selecione</option>
                  <option value="Branca">Branca</option>
                  <option value="Preta">Preta</option>
                  <option value="Parda">Parda</option>
                  <option value="Amarela">Amarela</option>
                  <option value="Indígena">Indígena</option>
                  <option value="Outra">Outra</option>
                </select>
                {errors.etnia && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, selecione a etnia.
                  </span>
                )}
              </div>

              {/* Cor dos Olhos */}
              <div>
                <label
                  htmlFor="olhos"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Cor dos Olhos
                </label>
                <select
                  {...register("olhos", { required: true })}
                  id="olhos"
                  className={`w-full p-2 border ${
                    errors.olhos ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300`}
                >
                  <option value="">Selecione</option>
                  <option value="Castanhos">Castanhos</option>
                  <option value="Azuis">Azuis</option>
                  <option value="Verdes">Verdes</option>
                  <option value="Cinzas">Cinzas</option>
                  <option value="Pretos">Pretos</option>
                  <option value="Outros">Outros</option>
                </select>
                {errors.olhos && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, selecione a cor dos olhos.
                  </span>
                )}
              </div>

              {/* Estilo de Cabelo */}
              <div>
                <label
                  htmlFor="estiloCabelo"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Estilo de Cabelo
                </label>
                <select
                  {...register("estiloCabelo", { required: true })}
                  id="estiloCabelo"
                  className={`w-full p-2 border ${
                    errors.estiloCabelo ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300`}
                >
                  <option value="">Selecione</option>
                  <option value="Curto">Curto</option>
                  <option value="Médio">Médio</option>
                  <option value="Longo">Longo</option>
                  <option value="Ondulado">Ondulado</option>
                  <option value="Liso">Liso</option>
                  <option value="Cacheado">Cacheado</option>
                  <option value="Outro">Outro</option>
                </select>
                {errors.estiloCabelo && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, selecione o estilo de cabelo.
                  </span>
                )}
              </div>

              {/* Tamanho de Cabelo */}
              <div>
                <label
                  htmlFor="tamanhoCabelo"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Tamanho de Cabelo
                </label>
                <select
                  {...register("tamanhoCabelo", { required: true })}
                  id="tamanhoCabelo"
                  className={`w-full p-2 border ${
                    errors.tamanhoCabelo ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300`}
                >
                  <option value="">Selecione</option>
                  <option value="Curto">Curto</option>
                  <option value="Médio">Médio</option>
                  <option value="Longo">Longo</option>
                </select>
                {errors.tamanhoCabelo && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, selecione o tamanho de cabelo.
                  </span>
                )}
              </div>

              {/* Tamanho do Pé */}
              <div>
                <label
                  htmlFor="tamanhoPe"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Tamanho do Pé
                </label>
                <select
                  {...register("tamanhoPe", { required: true })}
                  id="tamanhoPe"
                  className={`w-full p-2 border ${
                    errors.tamanhoPe ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300`}
                >
                  <option value="">Selecione</option>
                  {Array.from({ length: 14 }, (_, i) => i + 35).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                  <option value="Outro">Outro</option>
                </select>
                {errors.tamanhoPe && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, selecione um tamanho de pé válido.
                  </span>
                )}
              </div>

              {/* Possui Silicone */}
              <div>
                <label
                  htmlFor="silicone"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Possui Silicone?
                </label>
                <select
                  {...register("silicone", { required: true })}
                  id="silicone"
                  className={`w-full p-2 border ${
                    errors.silicone ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300`}
                >
                  <option value="">Selecione</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
                {errors.silicone && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, selecione uma opção.
                  </span>
                )}
              </div>

              {/* Possui Tatuagens */}
              <div>
                <label
                  htmlFor="tatuagens"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Possui Tatuagens?
                </label>
                <select
                  {...register("tatuagens", { required: true })}
                  id="tatuagens"
                  className={`w-full p-2 border ${
                    errors.tatuagens ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300`}
                >
                  <option value="">Selecione</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
                {errors.tatuagens && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, selecione uma opção.
                  </span>
                )}
              </div>

              {/* Possui Piercings */}
              <div>
                <label
                  htmlFor="piercings"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Possui Piercings?
                </label>
                <select
                  {...register("piercings", { required: true })}
                  id="piercings"
                  className={`w-full p-2 border ${
                    errors.piercings ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300`}
                >
                  <option value="">Selecione</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
                {errors.piercings && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, selecione uma opção.
                  </span>
                )}
              </div>

              {/* Fumante */}
              <div>
                <label
                  htmlFor="fumante"
                  className="block text-gray-800 font-medium mb-2"
                >
                  Fumante?
                </label>
                <select
                  {...register("fumante", { required: true })}
                  id="fumante"
                  className={`w-full p-2 border ${
                    errors.fumante ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300`}
                >
                  <option value="">Selecione</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
                {errors.fumante && (
                  <span className="text-red-500 text-sm mt-2">
                    Por favor, selecione uma opção.
                  </span>
                )}
              </div>

              {/* Idiomas */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
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
              </div>
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
