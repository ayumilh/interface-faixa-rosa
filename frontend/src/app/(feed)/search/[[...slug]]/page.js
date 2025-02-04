"use client";

import { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { FaSearch } from "react-icons/fa";

// Componentes (certifique-se de que os caminhos estejam corretos)
import Navbar from "@/components/Navbar";
import ModalBusca from "@/components/search/modalbusca";
import ModalFiltro from "@/components/search/modalfiltro";
import Stories from "@/components/search/stories";
import Final from "@/components/search/final";
import CardVIP from "@/components/search/CardVIP";
import CardVIPDark from "@/components/search/CardVIPDark";
import CardPink from "@/components/search/CardPink";
import CardPinkDark from "@/components/search/CardPinkDark";
import CardSafira from "@/components/search/CardSafira";
import CardSafiraDark from "@/components/search/CardSafiraDark";
import CardRubi from "@/components/search/CardRubi";
import CardRubiDark from "@/components/search/CardRubiDark";

export default function Search() {
  const params = useParams(); // Para capturar o slug (catch-all)
  const pathname = usePathname();

  // Se você usar uma rota catch-all, o parâmetro será um array
  let slugString = "";
  if (params.slug) {
    slugString = Array.isArray(params.slug) ? params.slug.join("/") : params.slug;
  }

  // Regex para extrair o padrão esperado: <base>-em-<cidade>-<estado>
  const regex = /(.*?)\-em\-(.*?)-(\w{2})$/;

  const [city, setCity] = useState("");
  const [stateUF, setStateUF] = useState("");
  const [category, setCategory] = useState("mulher"); // valor padrão
  const [showModalBusca, setShowModalBusca] = useState(false);
  const [showModalFiltro, setShowModalFiltro] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [cards, setCards] = useState([]);

  // Arrays de exemplo para botões, filtros e stories
  const categories = [
    { label: "Mulheres", value: "mulher" },
    { label: "Homens", value: "homem" },
    { label: "Trans", value: "travesti" },
  ];
  const filters = [
    "Fotos com rosto",
    "Online",
    "Em expediente",
    "Sexo anal",
    "Acompanhantes exclusivos",
    "Tem local",
    "Acompanhante jovem",
  ];
  const stories = [
    { image: "https://randomuser.me/api/portraits/women/10.jpg", name: "Aline" },
    { image: "https://randomuser.me/api/portraits/women/11.jpg", name: "Carla" },
    { image: "https://randomuser.me/api/portraits/women/12.jpg", name: "Julia" },
    { image: "https://randomuser.me/api/portraits/women/13.jpg", name: "Marina" },
    { image: "https://randomuser.me/api/portraits/women/14.jpg", name: "Natália" },
  ];

  // Dados fictícios para os cartões
  const defaultCards = [
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
  ];

  useEffect(() => {
    setCards(defaultCards);
  }, []);

  // Tenta extrair os parâmetros da URL (se o slug estiver no formato esperado)
  useEffect(() => {
    if (slugString) {
      const match = slugString.match(regex);
      if (match) {
        // match[1] = base (ex: "acompanhantes" ou "garotos-de-programa" ou "travestis-transex-transgenero")
        // match[2] = cidade (ex: "sao-paulo" – que pode ter hífens para espaços)
        // match[3] = estado (ex: "sp")
        const base = match[1];
        const citySlug = match[2];
        const uf = match[3];
        const cityName = citySlug.replace(/-/g, " ");
        setCity(cityName);
        setStateUF(uf.toUpperCase());
        if (base === "acompanhantes") {
          setCategory("mulher");
        } else if (base === "garotos-de-programa") {
          setCategory("homem");
        } else if (base === "travestis-transex-transgenero") {
          setCategory("travesti");
        }
      } else {
        console.error("Formato do slug inválido:", slugString);
        // Aqui você pode definir um fallback – por exemplo, redirecionar para a página de busca padrão
        // window.location.href = "/search";
      }
    }
  }, [slugString]);

  // Handler para alterar a categoria (ao clicar nos botões)
  const handleCategoryClick = (catValue) => {
    setCategory(catValue);
    let basePath = "";
    if (catValue === "mulher") {
      basePath = "acompanhantes-em";
    } else if (catValue === "homem") {
      basePath = "garotos-de-programa-em";
    } else if (catValue === "travesti") {
      basePath = "travestis-transex-transgenero-em";
    }
    const cityParam = city ? `-${city.replace(/\s+/g, "-")}-${stateUF}` : "";
    const formattedURL = `/search/${basePath}${cityParam}`.toLowerCase();
    window.location.href = formattedURL;
  };

  // Handler para quando o usuário selecionar uma cidade no ModalBusca
  const handleCitySelect = (cidade, estado) => {
    setCity(cidade);
    setStateUF(estado);
    setShowModalBusca(false);
    let basePath = "";
    if (category === "mulher") {
      basePath = "acompanhantes-em";
    } else if (category === "homem") {
      basePath = "garotos-de-programa-em";
    } else if (category === "travesti") {
      basePath = "travestis-transex-transgenero-em";
    }
    const formattedURL = `/search/${basePath}-${cidade.replace(/\s+/g, "-")}-${estado}`.toLowerCase();
    window.location.href = formattedURL;
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      <Navbar />

      {/* Toggle para Modo Escuro */}
      <div className="fixed top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-pink-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-pink-600 transition-transform transform hover:scale-105"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Header com imagem de fundo */}
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
            <div className="relative flex-1 flex items-center cursor-pointer" onClick={() => setShowModalBusca(true)}>
              <FaSearch className="w-5 h-5 text-gray-500 mr-2" />
              <input
                id="city"
                type="text"
                value={city && stateUF ? `${city}, ${stateUF}` : "Busque por cidade..."}
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
                    category === cat.value ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-800"
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
        <h3 className="text-lg font-semibold text-gray-600 mb-4">Filtros rápidos</h3>
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

      {/* Stories */}
      <div className="w-full max-w-7xl mx-auto mt-6 px-4">
        <Stories stories={stories} />
      </div>

      {/* Grid de Cartões */}
      <div className="mt-6 w-full max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800 text-center sm:text-left">
            Resultados para {category} em {city && stateUF ? `${city}, ${stateUF}` : "sua cidade"}:
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => {
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
              default:
                CardComponent = CardVIP;
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
        category={category}
      />
      <ModalFiltro
        showModalFiltro={showModalFiltro}
        setShowModalFiltro={setShowModalFiltro}
        category={category}
        city={city}
      />

      {/* Footer */}
      <Final />
    </div>
  );
}
