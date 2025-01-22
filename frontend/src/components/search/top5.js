import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import Image from "next/image";

export default function Top10() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  const topAdvertisers = [
    { id: 1, name: "Ana Silva", city: "São Paulo", image: "/assets/images/albums/01.jpg" },
    { id: 2, name: "Beatriz Costa", city: "Rio de Janeiro", image: "/assets/images/albums/01.jpg" },
    { id: 3, name: "Carla Mendes", city: "Belo Horizonte", image: "/assets/images/albums/01.jpg" },
    { id: 4, name: "Daniela Souza", city: "Porto Alegre", image: "/assets/images/albums/01.jpg" },
    { id: 5, name: "Elena Rocha", city: "Curitiba", image: "/assets/images/albums/01.jpg" },
    { id: 6, name: "Fernanda Lima", city: "Brasília", image: "/assets/images/albums/01.jpg" },
    { id: 7, name: "Gabriela Santos", city: "Salvador", image: "/assets/images/albums/01.jpg" },
    { id: 8, name: "Heloísa Andrade", city: "Fortaleza", image: "/assets/images/albums/01.jpg" },
    { id: 9, name: "Isabela Ramos", city: "Manaus", image: "/assets/images/albums/01.jpg" },
    { id: 10, name: "Juliana Oliveira", city: "Recife", image: "/assets/images/albums/01.jpg" },
  ];

  // Hook para detectar tamanho da tela
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize(); // Verifica inicialmente
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Lista de dependências vazia, executa apenas uma vez

  // Hook para gerenciar o carrossel no desktop (Removido)
  // Como exibiremos todos os 10 anunciantes, a lógica do carrossel no desktop não é necessária.

  const nextAdvertiser = () => {
    if (isDesktop) {
      // Lógica de carrossel para Desktop (Removida)
    } else {
      setCurrentIndex((prevIndex) =>
        prevIndex === topAdvertisers.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevAdvertiser = () => {
    if (isDesktop) {
      // Lógica de carrossel para Desktop (Removida)
    } else {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? topAdvertisers.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <div className="pt-4 md:pt-2 pb-8 bg-gradient-to-b from-transparent to-pink-100 lg:-mt-2">
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-4 text-gray-800">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff007f] via-[#ff33aa] to-[#8000ff]">
          Top 10
        </span>{" "}
        Anunciantes do{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00ff00] via-[#ffff00] to-[#0000ff]">
          Brasil
        </span>
      </h2>
      <div className="relative max-w-6xl mx-auto overflow-hidden">
        {isDesktop ? (
          // Layout para Desktop (exibindo 10 anunciantes em duas linhas de cinco cada)
          <div className="grid grid-cols-5 grid-rows-2 gap-4">
            {topAdvertisers.map((advertiser) => (
              <div
                key={advertiser.id}
                className="w-full h-64 rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent relative"
              >
                {advertiser.image && (
                  <Image
                    src={advertiser.image}
                    alt={`Foto de ${advertiser.name}`}
                    layout="fill"
                    objectFit="cover"
                    priority
                    className="w-full h-full object-cover rounded-lg opacity-90 hover:opacity-100"
                  />
                )}
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent text-white p-4 rounded-b-lg">
                  <h3 className="text-xl font-semibold">{advertiser.name}</h3>
                  <p className="text-sm">{advertiser.city}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Layout para Mobile (exibindo um item por vez)
          <div className="relative h-96 overflow-hidden rounded-lg shadow-lg">
            {topAdvertisers.map((advertiser) => (
              <div
                key={advertiser.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${advertiser.id === topAdvertisers[currentIndex].id ? "opacity-100" : "opacity-0"
                  }`}
              >
                <Image
                  src={advertiser.image}
                  alt={`Foto de ${advertiser.name}`}
                  layout="fill"
                  objectFit="cover"
                  priority
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent text-white p-4">
                  <h3 className="text-xl font-semibold">{advertiser.name}</h3>
                  <p className="text-sm">{advertiser.city}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Controles para Mobile */}
        {!isDesktop && (
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={prevAdvertiser}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
            >
              Anterior
            </button>
            <button
              onClick={nextAdvertiser}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
            >
              Próximo
            </button>
          </div>
        )}

        {/* Indicadores para Desktop */}
        {isDesktop && (
          <div className="flex justify-center mt-4 space-x-1">
            {Array.from({ length: topAdvertisers.length - 5 }).map((_, index) => (
              <FaStar
                key={index}
                className={`mx-1 ${index === currentIndex ? "text-pink-800" : "text-gray-600"
                  }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
