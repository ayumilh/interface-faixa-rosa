'use client'

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Final from "@/components/search/final";
import ModalBuscaconvenio from "@/components/search/modalbuscaconvenio";
import EstablishmentCard from "@/components/convenio/EstablishmentCard";
import { estabelecimentos } from "@/components/convenio/estabelecimentosData";
import { FaFilter } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";



export default function Convenio() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showModalBusca, setShowModalBusca] = useState(false);

  const categories = ["Todos", "Academias", "Psicólogos", "Médicos", "Hotéis"];

  const handleSelectCity = (cityName, stateSigla) => {
    setSelectedCity(cityName);
    setSelectedState(stateSigla);
  };

  const filteredEstabelecimentos = useMemo(() => {
    return estabelecimentos.filter(
      (estab) =>
        (selectedCity === "" ||
          (estab.cidade === selectedCity && estab.estado === selectedState)) &&
        (selectedCategory === "Todos" || estab.categoria === selectedCategory)
    );
  }, [selectedCity, selectedState, selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow mt-24">
        <section
          className="relative bg-center bg-cover h-64 sm:h-80 md:h-96 lg:h-[500px]"
          style={{ backgroundImage: 'url("/Banner-elite-faixa.png")' }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 py-12 sm:py-16 md:py-20">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Convênios Exclusivos para a{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff007f] via-[#ff00ff] to-[#8000ff]">
                ELITE DO FAIXA ROSA
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-xl mb-6">
              Aproveite descontos especiais em nossos parceiros selecionados.
              Sua exclusividade merece os melhores benefícios.
            </p>
            <button
              onClick={() => setShowModalBusca(true)}
              className="flex items-center bg-gradient-to-r from-[#ff007f] via-[#ff00ff] to-[#8000ff] hover:from-pink-600 hover:via-pink-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <FaFilter className="mr-2" />
              Selecionar Cidade
            </button>
          </div>
        </section>

        <ModalBuscaconvenio
          showModalBusca={showModalBusca}
          setShowModalBusca={setShowModalBusca}
          onSelectCity={handleSelectCity}
        />

        <section className="bg-white py-6 sm:py-8 shadow-md">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
            <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
              <label className="block text-gray-700 font-semibold mb-2">Cidade Selecionada:</label>
              <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-inner">
                <span className="text-gray-900 font-medium">
                  {selectedCity ? `${selectedCity} - ${selectedState}` : "Todas as Cidades"}
                </span>
              </div>
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block text-gray-700 font-semibold mb-2">Categoria:</label>
              <div className="relative">
                <select
                  className="block appearance-none w-full bg-gray-100 border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  value={selectedCategory}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiChevronDown />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            {filteredEstabelecimentos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredEstabelecimentos.map((estab, index) => (
                  <EstablishmentCard key={index} estabelecimento={estab} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>Nenhum estabelecimento encontrado para os filtros selecionados.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Final />
    </div>
  );
}
