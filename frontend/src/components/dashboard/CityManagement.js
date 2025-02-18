"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaDollarSign,
  FaEdit,
  FaCheck,
  FaTimes,
  FaBuilding,
  FaWifi,
  FaHome,
  FaUtensils,
  FaPlane,
  FaGlassMartini,
  FaGlassCheers,
  FaBed,
  FaShower,
  FaCouch,
  FaParking
} from "react-icons/fa";
import Modal from "@/components/dashboard/Modal";
import ModalBusca from "@/components/search/modalbuscaconvenio";
import Cookies from "js-cookie";

const CityManagement = ({ onUpdate }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      city: "",
    },
  });

  const [showModalBusca, setShowModalBusca] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedUF, setSelectedUF] = useState("");
  const [intermediaries, setIntermediaries] = useState({
    localities: [],
    amenities: [],
  });

  // Estados para controlar os modais de seleção adicionais
  const [showLocalitiesModal, setShowLocalitiesModal] = useState(false);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);

  // Função para buscar locais atendidos e comodidades
  const fetchIntermediaries = async (cityName, uf) => {
    try {
      const data = {
        localities: ["A domicílio", "Festas e Eventos", "Hotéis", "Local Próprio", "Motéis"],
        amenities: ["Wi-Fi", "Chuveiro", "Ar-condicionado", "Estacionamento", "Frigobar", "Preservativos"],
      };

      setIntermediaries((prev) => ({
        ...prev,
        localities: prev.localities.length ? prev.localities : data.localities,
        amenities: prev.amenities.length ? prev.amenities : data.amenities,
      }));
    } catch (error) {
      console.error("Erro ao buscar intermediações", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = Cookies.get("userToken");

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/locations`,
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );

        if (response.status === 200) {
          const data = response.data;

          setSelectedCity(data.city);
          setSelectedUF(data.state);
          setValue("city", `${data.city} - ${data.state}`);

          const attendedLocations = data.attendedLocations.map((loc) => loc.name);
          const amenities = data.amenities;

          setIntermediaries((prev) => ({
            ...prev,
            localities: attendedLocations,
            amenities: amenities || [],
          }));
        } else {
          console.error("Erro ao buscar dados:", data.error);
        }
      } catch (error) {
        console.error("Erro ao buscar locais:", error);
      }
    };

    fetchData();
  }, [setValue]);


  const handleSelectCity = (cityName, uf) => {
    setSelectedCity(cityName);
    setSelectedUF(uf);
    setValue("city", `${cityName} - ${uf}`);

    fetchIntermediaries(cityName, uf).then(() => {
      setIntermediaries((prev) => ({
        localities: prev.localities.length ? prev.localities : prev.localities,
        amenities: prev.amenities.length ? prev.amenities : prev.amenities,
      }));
    });
  };

  const confirmCityChange = () => {
    console.log("Cidade alterada para:", selectedCity, selectedUF);

    onUpdate({
      city: `${selectedCity} - ${selectedUF}`,
      localities: intermediaries.localities,
      amenities: intermediaries.amenities,
    });

    setIsConfirmModalOpen(false);
  };

  const LOCATION_ENUMS = {
    "A domicílio": "A_DOMICILIO",
    "Festas e Eventos": "FESTAS_EVENTOS",
    "Hotéis": "HOTEIS",
    "Local Próprio": "LOCAL_PROPRIO",
    "Motéis": "MOTEIS",
    "Viagens": "VIAGENS",
    "Club de Swing": "CLUB_DE_SWING",
    "Jantares": "JANTARES",
    "Despedida de Solteiro": "DESPEDIDA_SOLTEIRO",
  };

  const AMENITIES_ENUMS = {
    "Wi-Fi": "WIFI",
    "Chuveiro": "CHUVEIRO",
    "Ar-condicionado": "AR_CONDICIONADO",
    "Estacionamento": "ESTACIONAMENTO",
    "Frigobar": "FRIGOBAR",
    "Preservativos": "PRESERVATIVOS",
  };

  const updateLocationsAndAmenities = async () => {
    try {
      const userToken = Cookies.get("userToken");

      // Função para formatar os valores corretamente (maiúsculas, sem acento e com _)
      const formatEnum = (str) =>
        str
          .toUpperCase()
          .replace(/\s/g, "_")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

      // Converte os valores para os ENUMs esperados pelo backend
      const locations = intermediaries.localities.map(formatEnum);
      const amenities = intermediaries.amenities.map(formatEnum);

      // Verifica se houve mudanças nos arrays
      const hasLocalitiesChanged =
        intermediaries.localities.length !== locations.length ||
        intermediaries.localities.some((loc) => !locations.includes(formatEnum(loc)));

      const hasAmenitiesChanged =
        intermediaries.amenities.length !== amenities.length ||
        intermediaries.amenities.some((amenity) => !amenities.includes(formatEnum(amenity)));

      // Garante que os valores sejam enviados corretamente
      const payload = {
        city: selectedCity,
        state: selectedUF,
        locations: locations.length > 0 ? locations.map((loc) => ({ name: loc })) : intermediaries.localities.map((loc) => ({ name: formatEnum(loc) })),
        amenities: amenities.length > 0 ? amenities : intermediaries.amenities.map(formatEnum),
      };

      console.log("Payload FINAL para o Backend:", JSON.stringify(payload, null, 2));

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/locations/update`,
        payload,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      console.log("Atualização bem-sucedida!", response.data);
      alert("Dados atualizados com sucesso!");

      // Atualiza o estado corretamente sem sobrescrever os valores existentes
      setIntermediaries((prev) => ({
        localities: hasLocalitiesChanged ? locations : prev.localities,
        amenities: hasAmenitiesChanged ? amenities : prev.amenities,
      }));

      setShowLocalitiesModal(false);
      setShowAmenitiesModal(false);
      setIsConfirmModalOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      if (error.response) {
        console.error("Detalhes do erro da API:", error.response.data);
        alert(`Erro: ${JSON.stringify(error.response.data)}`);
      } else {
        alert("Erro ao atualizar. Tente novamente.");
      }
    }
  };


  // Atualiza corretamente os valores no estado antes de salvar
  const handleLocalityChange = (value) => {
    setIntermediaries((prev) => {
      // Verifica se o valor já é um ENUM (caso já tenha sido convertido antes)
      const enumValue = LOCATION_ENUMS[value] || value;

      if (!Object.values(LOCATION_ENUMS).includes(enumValue)) {
        console.error(`Erro: O local '${value}' não tem um ENUM correspondente.`);
        return prev;
      }

      const updatedLocalities = prev.localities.includes(enumValue)
        ? prev.localities.filter((loc) => loc !== enumValue)
        : [...prev.localities, enumValue];

      console.log("Localidades Atualizadas:", updatedLocalities);
      return { ...prev, localities: updatedLocalities };
    });
  };

  const handleAmenityChange = (value) => {
    setIntermediaries((prev) => {
      const enumValue = AMENITIES_ENUMS[value] || value; // Converte para ENUM se necessário

      if (!Object.values(AMENITIES_ENUMS).includes(enumValue)) {
        console.error(`Erro: A comodidade '${value}' não tem um ENUM correspondente.`);
        return prev;
      }

      const updatedAmenities = prev.amenities.includes(enumValue)
        ? prev.amenities.filter((amenity) => amenity !== enumValue)
        : [...prev.amenities, enumValue];

      console.log("Comodidades Atualizadas:", updatedAmenities);
      return { ...prev, amenities: updatedAmenities };
    });
  };

  // Salva os valores corretamente antes de enviar ao backend
  const handleSaveLocalities = () => {
    console.log("Salvando locais selecionados:", intermediaries.localities);
    updateLocationsAndAmenities();
  };

  const handleSaveAmenities = () => {
    console.log("Salvando comodidades selecionadas:", intermediaries.amenities);
    updateLocationsAndAmenities();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
        <FaMapMarkerAlt className="text-pink-500 mr-2" />
        Gestão de Localidade
      </h2>

      {/* Seção para Alterar Cidade */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaMapMarkerAlt className="text-pink-500 mr-2" />
          Alterar Cidade
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateLocationsAndAmenities(); // Agora altera a cidade e locais juntos
          }}
          className="space-y-6"
        >
          {/* Campo Cidade */}
          <div>
            <label className="block text-gray-700 mb-2 flex items-center">
              <FaMapMarkerAlt className="inline-block mr-2" />
              Cidade Selecionada:
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="city"
                {...register("city", { required: true })}
                placeholder="Selecione uma cidade"
                value={selectedCity ? `${selectedCity} - ${selectedUF}` : ""}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-100 cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowModalBusca(true)}
                className="p-3 bg-pink-500 text-white rounded-r-lg hover:bg-pink-600 transition flex items-center justify-center"
                title="Selecionar Cidade"
              >
                <FaEdit />
              </button>
            </div>
            {errors.city && (
              <span className="text-red-500 text-sm">
                A cidade é obrigatória.
              </span>
            )}
          </div>

          <button
            type="submit"
            className={`w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition flex items-center justify-center ${!selectedCity ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={!selectedCity}
          >
            <FaDollarSign className="mr-2" />
            Salvar Alterações de Cidade
          </button>
        </form>
      </div>

      {/* Seção para Editar Locais Atendidos */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaBuilding className="text-pink-500 mr-2" />
          Editar Locais Atendidos
        </h3>
        <div className="flex items-center">
          <input
            type="text"
            id="localities"
            {...register("localities")}
            placeholder="Selecione os locais atendidos"
            readOnly
            value={intermediaries.localities.join(", ")}
            className="w-full p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-100 cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => setShowLocalitiesModal(true)}
            className="p-3 bg-pink-500 text-white rounded-r-lg hover:bg-pink-600 transition flex items-center justify-center"
            title="Selecionar Locais Atendidos"
          >
            <FaEdit />
          </button>
        </div>
        {errors.localities && (
          <span className="text-red-500 text-sm">
            Este campo é obrigatório.
          </span>
        )}
      </div>

      {/* Seção para Editar Comodidades */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaWifi className="text-pink-500 mr-2" />
          Editar Comodidades
        </h3>
        <div className="flex items-center">
          <input
            type="text"
            id="amenities"
            {...register("amenities")}
            placeholder="Selecione as comodidades"
            readOnly
            value={intermediaries.amenities.join(", ")}
            className="w-full p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-100 cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => setShowAmenitiesModal(true)}
            className="p-3 bg-pink-500 text-white rounded-r-lg hover:bg-pink-600 transition flex items-center justify-center"
            title="Selecionar Comodidades"
          >
            <FaEdit />
          </button>
        </div>
        {errors.amenities && (
          <span className="text-red-500 text-sm">
            Este campo é obrigatório.
          </span>
        )}
      </div>

      {/* Modal de Confirmação de Cobrança para Alteração de Cidade */}
      {isConfirmModalOpen && (
        <Modal
          onClose={() => setIsConfirmModalOpen(false)}
          title="Confirmar Troca de Cidade"
          description={`A troca para a cidade "${selectedCity} - ${selectedUF}" implicará na cobrança de uma taxa. Deseja proceder?`}
        >
          <div className="flex space-x-4 mt-4">
            <button
              onClick={confirmCityChange}
              className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition flex items-center justify-center"
            >
              <FaCheck className="mr-2" />
              Confirmar
            </button>
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition flex items-center justify-center"
            >
              <FaTimes className="mr-2" />
              Cancelar
            </button>
          </div>
        </Modal>
      )}

      {/* Modal de Busca de Cidade */}
      {showModalBusca && (
        <ModalBusca
          showModalBusca={showModalBusca}
          setShowModalBusca={setShowModalBusca}
          onSelectCity={handleSelectCity}
        />
      )}

      {/* Modal para Selecionar Locais Atendidos */}
      {showLocalitiesModal && (
        <Modal
          onClose={() => setShowLocalitiesModal(false)}
          title="Selecionar Locais Atendidos"
        >
          <div className="flex flex-col gap-2">
            {[
              { label: "A domicílio", value: "A_DOMICILIO", icon: <FaHome className="mr-2 text-pink-500" /> },
              { label: "Festas e Eventos", value: "FESTAS_EVENTOS", icon: <FaBuilding className="mr-2 text-pink-500" /> },
              { label: "Hotéis", value: "HOTEIS", icon: <FaBuilding className="mr-2 text-pink-500" /> },
              { label: "Local Próprio", value: "LOCAL_PROPRIO", icon: <FaHome className="mr-2 text-pink-500" /> },
              { label: "Motéis", value: "MOTEIS", icon: <FaBed className="mr-2 text-pink-500" /> },
              { label: "Viagens", value: "VIAGENS", icon: <FaPlane className="mr-2 text-pink-500" /> },
              { label: "Club de Swing", value: "CLUB_DE_SWING", icon: <FaGlassMartini className="mr-2 text-pink-500" /> },
              { label: "Jantares", value: "JANTARES", icon: <FaUtensils className="mr-2 text-pink-500" /> },
              { label: "Despedida de Solteiro", value: "DESPEDIDA_SOLTEIRO", icon: <FaGlassCheers className="mr-2 text-pink-500" /> },
            ].map((item, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  value={item.value} // Definindo o value conforme ENUM
                  checked={intermediaries.localities.includes(item.value)} // Comparando com os valores vindos do backend
                  onChange={() => handleLocalityChange(item.value)}
                />
                {item.icon}
                {item.label}
              </label>
            ))}
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={() => setShowLocalitiesModal(false)}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition flex items-center"
            >
              <FaTimes className="mr-2" />
              Cancelar
            </button>
            <button
              onClick={handleSaveLocalities}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition flex items-center"
            >
              <FaCheck className="mr-2" />
              Salvar
            </button>
          </div>
        </Modal>
      )}

      {/* Modal para Selecionar Comodidades */}
      {showAmenitiesModal && (
        <Modal
          onClose={() => setShowAmenitiesModal(false)}
          title="Selecionar Comodidades"
        >
          <div className="flex flex-col gap-2">
            {[
              { label: "Wi-Fi", value: "WIFI", icon: <FaWifi className="mr-2 text-pink-500" /> },
              { label: "Chuveiro", value: "CHUVEIRO", icon: <FaShower className="mr-2 text-pink-500" /> },
              { label: "Ar-condicionado", value: "AR_CONDICIONADO", icon: <FaCouch className="mr-2 text-pink-500" /> },
              { label: "Estacionamento", value: "ESTACIONAMENTO", icon: <FaParking className="mr-2 text-pink-500" /> },
              { label: "Frigobar", value: "FRIGOBAR", icon: <FaDollarSign className="mr-2 text-pink-500" /> },
              { label: "Preservativos", value: "PRESERVATIVOS", icon: <FaBed className="mr-2 text-pink-500" /> },
            ].map((item, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  value={item.value} // Definindo o value conforme ENUM
                  checked={intermediaries.amenities.includes(item.value)} // Comparando com os valores vindos do backend
                  onChange={() => handleAmenityChange(item.value)}
                />
                {item.icon}
                {item.label}
              </label>
            ))}
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={() => setShowAmenitiesModal(false)}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition flex items-center"
            >
              <FaTimes className="mr-2" />
              Cancelar
            </button>
            <button
              onClick={handleSaveAmenities}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition flex items-center"
            >
              <FaCheck className="mr-2" />
              Salvar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CityManagement;
