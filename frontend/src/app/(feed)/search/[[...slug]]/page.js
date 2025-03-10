"use client";

import { useState, useEffect } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { FaSearch, FaFire } from "react-icons/fa";
import Link from "next/link";
import { usePlan } from "@/context/PlanContext";

// Componentes necessários
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
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  let slugString = "";
  if (params.slug) {
    slugString = Array.isArray(params.slug) ? params.slug.join("/") : params.slug;
  }

  const [loadingSearch, setLoadingSearch] = useState(true);
  const [city, setCity] = useState("");
  const [stateUF, setStateUF] = useState("");
  const [category, setCategory] = useState("mulher");
  const [showModalBusca, setShowModalBusca] = useState(false);
  const [showModalFiltro, setShowModalFiltro] = useState(false);
  const [cards, setCards] = useState([]);

  const { companions, fetchCompanions, loading, error } = usePlan();

  // Categorias disponíveis
  const categories = [
    { label: "Mulheres", value: "mulher" },
    { label: "Homens", value: "homem" },
    { label: "Trans", value: "travesti" },
  ];

  // Capturar parâmetros da URL
  useEffect(() => {
    const regex = /(.*?)\-em\-(.*?)-(\w{2})$/;
    if (slugString) {
      const match = slugString.match(regex);
      if (match) {
        const base = match[1];
        const citySlug = match[2];
        const uf = match[3];
        const cityName = decodeURIComponent(citySlug).replace(/-/g, " ");
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
      }
    }
  }, [slugString]);

  // Capturar os dados de acompanhantes da API via query string
  // useEffect(() => {
  //   const resultsParam = searchParams.get("results");
  //   if (resultsParam) {
  //     try {
  //       const results = JSON.parse(resultsParam);
  //       console.log("Resultados da API:", results);
  //       setCards(results);
  //     } catch (error) {
  //       console.error("Erro ao processar os resultados da API:", error);
  //     } finally {
  //       setLoadingSearch(false);
  //     }
  //   }
  // }, [searchParams]);

  useEffect(() => {
    if (city && stateUF) {
      // Use os filtros que desejar. Aqui estamos passando a cidade e o estado.
      fetchCompanions({ cidade: city, estado: stateUF });
      setLoadingSearch(false);
    }
  }, [city, stateUF, fetchCompanions]);

  useEffect(() => {
    console.log("Dados do context (companions):", companions);
  }, [companions]);
  

  return (
    <div className="bg-gray-100 text-gray-800">
      {loadingSearch && (
        <div className="fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center z-50">
          <FaFire className="animate-pulse text-pink-500" size={50} />
        </div>
      )}

      <Navbar bgColor="white" />

      {/* Breadcrumbs */}
      <div className="w-full max-w-7xl mx-auto p-4 mt-16 bg-cover flex justify-start items-center">
        <nav className="text-sm text-gray-700">
          <Link href="/" className="text-pink-500 hover:text-pink-700">Início</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-500">Acompanhantes</span>
        </nav>
      </div>

      {/* Título */}
      <div className="w-full h-min bg-cover bg-center flex justify-center items-start mt-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black text-center px-4">
          {cards.length === 0 ? "Acompanhantes não encontradas" : `Acompanhantes disponíveis em ${decodeURIComponent(city)}, ${stateUF}`}
        </h1>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative w-full max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
          <div className="relative flex-1 flex items-center cursor-pointer" onClick={() => setShowModalBusca(true)}>
            <FaSearch className="w-5 h-5 text-gray-500 mr-2" />
            <input
              id="city"
              type="text"
              value={city && stateUF ? `${decodeURIComponent(city)}, ${stateUF}` : "Busque por cidade..."}
              className="w-full bg-gray-200 rounded-full px-6 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 transition cursor-pointer"
              readOnly
            />
          </div>
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 sm:px-6 sm:py-2 rounded-full text-sm font-medium ${category === cat.value ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-800"
                  } transition transform hover:scale-105`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
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
        {companions.length === 0 ? (
            <p className="text-center text-gray-500">Nenhuma acompanhante encontrada.</p>
          ) : (
            companions.map((card, index) => {
              console.log("Card:", card);
              let CardComponent;
              // Escolhe o componente de card com base no plano
              if (card.plan?.name === "Plano Rubi") {
                CardComponent = CardRubi;
              } else if (card.plan?.name === "Plano Safira") {
                CardComponent = CardSafira;
              } else if (card.plan?.name === "Plano Pink") {
                CardComponent = CardPink;
              } else {
                CardComponent = CardVIP; // Se não for nenhum dos planos específicos, utiliza o CardVIP
              }

              return (
                <Link href={`/perfil/${card.userName}`} key={index}>
                  <CardComponent
                    userName={card.userName}
                    age={card.age}
                    location={`${card.city}, ${card.state}`}
                    description={card.description}
                    images={
                      card.profileImage
                        ? [card.profileImage]
                        : card.media?.length > 0
                        ? card.media
                        : ["/default-avatar.jpg"]
                    }
                    contact={true}
                    plan={card.plan}
                    planType={card.planType}
                  />
                </Link>
              );
            })
          )}
        </div>
      </div>

      <Final />
    </div>
  );
}
