// src/components/Dashboard/CityManagement.js

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaMapMarkerAlt,
  FaDollarSign,
  FaEdit,
  FaCheck,
  FaTimes,
  FaBuilding,
  FaWifi,
  FaHome,
  FaShower,
  FaParking,
  FaBed,
  FaCouch,
} from "react-icons/fa";
import Modal from "@/components/dashboard/Modal";
import ModalBusca from "@/components/search/modalbuscaconvenio";

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
      // Integre com sua API ou backend para obter dados reais
      const data = {
        localities: [
          "A domicílio",
          "Festas e Eventos",
          "Hotéis",
          "Local Próprio",
          "Motéis",
        ],
        amenities: [
          "Wi-Fi",
          "Chuveiro",
          "Ar-condicionado",
          "Estacionamento",
          "Frigobar",
          "Preservativos",
        ],
      };
      setIntermediaries(data);
    } catch (error) {
      console.error("Erro ao buscar intermediações", error);
    }
  };

  const handleSelectCity = (cityName, uf) => {
    setSelectedCity(cityName);
    setSelectedUF(uf);
    setValue("city", `${cityName} - ${uf}`);
    fetchIntermediaries(cityName, uf);
  };

  const onSubmitCityChange = () => {
    setIsConfirmModalOpen(true);
  };

  const confirmCityChange = () => {
    console.log("Cidade alterada para:", selectedCity, selectedUF);
    console.log("Intermediações:", intermediaries);
    // Integre com o backend para finalizar a troca de cidade
    onUpdate({
      city: `${selectedCity} - ${selectedUF}`,
      ...intermediaries,
    });
    setIsConfirmModalOpen(false);
    reset();
    setSelectedCity("");
    setSelectedUF("");
    setIntermediaries({
      localities: [],
      amenities: [],
    });
  };

  // Função para lidar com a seleção de Localidades
  const handleLocalityChange = (label) => {
    let updated = intermediaries.localities.includes(label)
      ? intermediaries.localities.filter((loc) => loc !== label)
      : [...intermediaries.localities, label];
    setIntermediaries((prev) => ({
      ...prev,
      localities: updated,
    }));
  };

  // Função para lidar com a seleção de Comodidades
  const handleAmenityChange = (label) => {
    let updated = intermediaries.amenities.includes(label)
      ? intermediaries.amenities.filter((amenity) => amenity !== label)
      : [...intermediaries.amenities, label];
    setIntermediaries((prev) => ({
      ...prev,
      amenities: updated,
    }));
  };

  const handleSaveLocalities = () => {
    setShowLocalitiesModal(false);
    setValue("localities", intermediaries.localities);
  };

  const handleSaveAmenities = () => {
    setShowAmenitiesModal(false);
    setValue("amenities", intermediaries.amenities);
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
        <form onSubmit={handleSubmit(onSubmitCityChange)} className="space-y-6">
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
            className={`w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition flex items-center justify-center ${
              !selectedCity ? "opacity-50 cursor-not-allowed" : ""
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
              { label: "A domicílio", icon: <FaHome className="mr-2 text-pink-500" /> },
              { label: "Festas e Eventos", icon: <FaBuilding className="mr-2 text-pink-500" /> },
              { label: "Hotéis", icon: <FaBuilding className="mr-2 text-pink-500" /> },
              { label: "Local Próprio", icon: <FaHome className="mr-2 text-pink-500" /> },
              { label: "Motéis", icon: <FaBed className="mr-2 text-pink-500" /> },
            ].map((item, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={intermediaries.localities.includes(item.label)}
                  onChange={() => handleLocalityChange(item.label)}
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
              { label: "Wi-Fi", icon: <FaWifi className="mr-2 text-pink-500" /> },
              { label: "Chuveiro", icon: <FaShower className="mr-2 text-pink-500" /> },
              { label: "Ar-condicionado", icon: <FaCouch className="mr-2 text-pink-500" /> },
              { label: "Estacionamento", icon: <FaParking className="mr-2 text-pink-500" /> },
              { label: "Frigobar", icon: <FaDollarSign className="mr-2 text-pink-500" /> },
              { label: "Preservativos", icon: <FaBed className="mr-2 text-pink-500" /> },
            ].map((item, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={intermediaries.amenities.includes(item.label)}
                  onChange={() => handleAmenityChange(item.label)}
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
