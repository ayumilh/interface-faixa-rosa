"use client";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Navbar from "@/components/Navbar"; // Importe a Navbar
import ModalBusca from "@/components/search/modalbusca"; // Importe o modal de busca
import ModalFiltro from "@/components/search/modalfiltro"; // Importe o modal de filtro
import Stories from "@/components/search/stories"; // 'Stories' com 'S' maiúsculo
import Final from "@/components/search/final"; // Footer fixo
import CardVIP from "@/components/search/CardVIP";
import CardVIPDark from "@/components/search/CardVIPDark";
import CardPink from "@/components/search/CardPink";
import CardPinkDark from "@/components/search/CardPinkDark";
import CardSafira from "@/components/search/CardSafira";
import CardSafiraDark from "@/components/search/CardSafiraDark";
import CardRubi from "@/components/search/CardRubi";
import CardRubiDark from "@/components/search/CardRubiDark";

export default function Search() {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [category, setCategory] = useState("mulher");
  const categories = [
    { label: "Mulheres", value: "mulher" },
    { label: "Homens", value: "homem" },
    { label: "Trans", value: "travesti" },
  ];
  const [showModalBusca, setShowModalBusca] = useState(false);
  const [showModalFiltro, setShowModalFiltro] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Estado global para modo escuro (opcional)
  const filters = [
    "Fotos com rosto",
    "Online",
    "Em expediente",
    "Sexo anal",
    "Acompanhantes exclusivos",
    "Tem local",
    "Acompanhante jovem",
  ];

  const handleCategoryClick = (catValue) => {
    setCategory(catValue);
    // Construir a URL similar à função formatCityURL no ModalBusca
    const basePath =
      catValue === "mulher"
        ? "acompanhantes-em"
        : catValue === "homem"
        ? "garotos-de-programa"
        : "travestis-transex-transgenero";
    const cityParam = city && state ? `-${city}-${state}` : "";
    const formattedURL = `/${basePath}${cityParam}`
      .replace(/ /g, "-")
      .toLowerCase();
    window.location.href = formattedURL;
  };

  const handleCitySelect = (cidade, estado) => {
    setCity(cidade);
    setState(estado);
    setShowModalBusca(false);
    // Atualizar a URL ao selecionar a cidade
    const basePath =
      category === "mulher"
        ? "acompanhantes-em"
        : category === "homem"
        ? "garotos-de-programa"
        : "travestis-transex-transgenero";
    const formattedURL = `/${basePath}-${cidade}-${estado}`
      .replace(/ /g, "-")
      .toLowerCase();
    window.location.href = formattedURL;
  };

  // Exemplo de stories
  const stories = [
    { image: "https://randomuser.me/api/portraits/women/10.jpg", name: "Aline" },
    { image: "https://randomuser.me/api/portraits/women/11.jpg", name: "Carla" },
    { image: "https://randomuser.me/api/portraits/women/12.jpg", name: "Julia" },
    { image: "https://randomuser.me/api/portraits/women/13.jpg", name: "Marina" },
    { image: "https://randomuser.me/api/portraits/women/14.jpg", name: "Natália" },
  ];

  // Dados para os cartões na ordem desejada, incluindo versões light e dark
  const cards = [
    // Cartões "rubi"
    {
      type: "rubi",
      dark: false,
      name: "Rafaela",
      price: "R$ 250/h",
      reviews: 2,
      location: "Jardins, São Paulo",
      description: "Acompanhante premium com experiências únicas.",
      images: [
        "https://randomuser.me/api/portraits/women/23.jpg",
        "https://randomuser.me/api/portraits/women/24.jpg",
        "https://randomuser.me/api/portraits/women/25.jpg",
        "https://randomuser.me/api/portraits/women/26.jpg",
        "https://randomuser.me/api/portraits/women/27.jpg",
      ],
      contact: true,
    },
    {
      type: "rubi",
      dark: true,
      name: "Rafaela Dark",
      price: "R$ 250/h",
      reviews: 2,
      location: "Jardins, São Paulo",
      description: "Acompanhante premium com experiências únicas.",
      images: [
        "https://randomuser.me/api/portraits/women/28.jpg",
        "https://randomuser.me/api/portraits/women/29.jpg",
        "https://randomuser.me/api/portraits/women/30.jpg",
        "https://randomuser.me/api/portraits/women/31.jpg",
        "https://randomuser.me/api/portraits/women/32.jpg",
      ],
      contact: true,
    },
    // Cartões "safira"
    {
      type: "safira",
      dark: false,
      name: "Sofia",
      price: "R$ 300/h",
      reviews: 5,
      location: "Pinheiros, São Paulo",
      description: "Acompanhante sofisticada e elegante.",
      images: [
        "https://randomuser.me/api/portraits/women/33.jpg",
        "https://randomuser.me/api/portraits/women/34.jpg",
        "https://randomuser.me/api/portraits/women/35.jpg",
        "https://randomuser.me/api/portraits/women/36.jpg",
        "https://randomuser.me/api/portraits/women/37.jpg",
      ],
      contact: true,
    },
    {
      type: "safira",
      dark: true,
      name: "Sofia Dark",
      price: "R$ 300/h",
      reviews: 5,
      location: "Pinheiros, São Paulo",
      description: "Acompanhante sofisticada e elegante.",
      images: [
        "https://randomuser.me/api/portraits/women/38.jpg",
        "https://randomuser.me/api/portraits/women/39.jpg",
        "https://randomuser.me/api/portraits/women/40.jpg",
        "https://randomuser.me/api/portraits/women/41.jpg",
        "https://randomuser.me/api/portraits/women/42.jpg",
      ],
      contact: true,
    },
    // Cartões "pink"
    {
      type: "pink",
      dark: false,
      name: "Camila",
      price: "R$ 200/h",
      reviews: 3,
      location: "Vila Madalena, São Paulo",
      description: "Acompanhante divertida e carinhosa.",
      images: [
        "https://randomuser.me/api/portraits/women/43.jpg",
        "https://randomuser.me/api/portraits/women/44.jpg",
        "https://randomuser.me/api/portraits/women/45.jpg",
        "https://randomuser.me/api/portraits/women/46.jpg",
        "https://randomuser.me/api/portraits/women/47.jpg",
      ],
      contact: true,
    },
    {
      type: "pink",
      dark: true,
      name: "Camila Dark",
      price: "R$ 200/h",
      reviews: 3,
      location: "Vila Madalena, São Paulo",
      description: "Acompanhante divertida e carinhosa.",
      images: [
        "https://randomuser.me/api/portraits/women/48.jpg",
        "https://randomuser.me/api/portraits/women/49.jpg",
        "https://randomuser.me/api/portraits/women/50.jpg",
        "https://randomuser.me/api/portraits/women/51.jpg",
        "https://randomuser.me/api/portraits/women/52.jpg",
      ],
      contact: true,
    },
    // Cartões "vip"
    {
      type: "vip",
      dark: false,
      name: "Isabela",
      price: "R$ 500/h",
      reviews: 10,
      location: "Itaim Bibi, São Paulo",
      description: "Acompanhante VIP para eventos exclusivos.",
      images: [
        "https://randomuser.me/api/portraits/women/53.jpg",
        "https://randomuser.me/api/portraits/women/54.jpg",
        "https://randomuser.me/api/portraits/women/55.jpg",
        "https://randomuser.me/api/portraits/women/56.jpg",
        "https://randomuser.me/api/portraits/women/57.jpg",
      ],
      contact: true,
    },
    {
      type: "vip",
      dark: true,
      name: "Isabela Dark",
      price: "R$ 500/h",
      reviews: 10,
      location: "Itaim Bibi, São Paulo",
      description: "Acompanhante VIP para eventos exclusivos.",
      images: [
        "https://randomuser.me/api/portraits/women/58.jpg",
        "https://randomuser.me/api/portraits/women/59.jpg",
        "https://randomuser.me/api/portraits/women/60.jpg",
        "https://randomuser.me/api/portraits/women/61.jpg",
        "https://randomuser.me/api/portraits/women/62.jpg",
      ],
      contact: true,
    },
    
    
    
    // Adicione mais cartões conforme necessário...
  ];

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <Navbar />

      {/* Toggle para Modo Escuro (opcional) */}
      <div className="fixed top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-pink-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-pink-600 transition-transform transform hover:scale-105"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Header */}
      <div
        className="w-full h-40 sm:h-60 bg-cover bg-center relative flex flex-col justify-center items-center mt-8"
        style={{ backgroundImage: 'url("/assets/images/background.jpg")' }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black text-center px-4">
          Procure acompanhantes perto de você
        </h1>
      </div>

      {/* Search Box */}
      <div className="relative -mt-14 w-full max-w-4xl mx-auto p-4">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
          <form className="flex flex-col md:flex-row gap-4 w-full">
            <div
              className="relative flex-1 flex items-center cursor-pointer"
              onClick={() => setShowModalBusca(true)}
            >
              <FaSearch className="w-5 h-5 text-gray-500 mr-2" />
              <input
                id="city"
                type="text"
                value={city ? `${city}, ${state}` : "Busque por cidade..."}
                className="w-full bg-gray-200 rounded-full px-6 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 transition cursor-pointer"
                readOnly
              />
            </div>
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => handleCategoryClick(cat.value)}
                  className={`px-4 py-2 sm:px-6 sm:py-2 rounded-full text-sm font-medium ${
                    category === cat.value
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  } transition transform hover:scale-105`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>

      {/* Filtros em Rolagem Horizontal */}
      <div className="w-full max-w-7xl mx-auto mt-8 px-4">
        <h3 className="text-lg font-semibold text-gray-600 mb-4">
          Filtros rápidos
        </h3>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 transition transform hover:scale-105 whitespace-nowrap"
            >
              {filter}
            </button>
          ))}
          <button
            className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-full shadow-lg hover:bg-pink-600 transition-transform transform hover:scale-105"
            onClick={() => setShowModalFiltro(true)}
          >
            Filtros
          </button>
        </div>
      </div>

      {/* Stories com Scroll Horizontal */}
      <div className="w-full max-w-7xl mx-auto mt-6 px-4">
        <Stories stories={stories} />
      </div>

      {/* Resultados da Busca */}
      <div className="mt-6 w-full max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800 text-center sm:text-left">
            Resultados para {category} em {city ? `${city}, ${state}` : "sua cidade"}:
          </h2>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <button className="text-gray-700 text-sm">Ordenar</button>
            <button
              className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-full shadow-lg hover:bg-pink-600 transition-transform transform hover:scale-105"
              onClick={() => setShowModalFiltro(true)}
            >
              Filtros
            </button>
          </div>
        </div>

        {/* Grid de Cartões */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            // Escolher o componente com base no tipo e na flag dark
            let CardComponent;
            switch (card.type) {
              case "rubi":
                CardComponent = card.dark ? CardRubiDark : CardRubi;
                break;
              case "safira":
                CardComponent = card.dark ? CardSafiraDark : CardSafira;
                break;
              case "pink":
                CardComponent = card.dark ? CardPinkDark : CardPink;
                break;
              case "vip":
                CardComponent = card.dark ? CardVIPDark : CardVIP;
                break;
             
              
                
            }

            return (
              <div key={index}>
                <CardComponent
                  name={card.name}
                  price={card.price}
                  reviews={card.reviews}
                  location={card.location}
                  description={card.description}
                  images={card.images}
                  contact={card.contact}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Modais */}
      <ModalBusca
        showModalBusca={showModalBusca}
        setShowModalBusca={setShowModalBusca}
        onCitySelect={handleCitySelect}
        category={category} // Passa a categoria selecionada
      />
      <ModalFiltro
        showModalFiltro={showModalFiltro}
        setShowModalFiltro={setShowModalFiltro}
        category={category} // Passa a categoria selecionada
        city={city} // Passa a cidade selecionada
      />
      {/* Footer fixo */}
      <Final />
    </div>
  );
}