"use client";
import { useState } from "react";
import { FaRegClock, FaFire } from "react-icons/fa";
import Image from "next/image";


export default function Blog() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const articles = [
    {
      title: "Diversidade e Inclusão: O Faixa Rosa Como Espaço Livre de Discriminação",
      description: "No universo da plataforma Faixa Rosa, a diversidade é celebrada e a inclusão é um...",
      image: "/files/images/Blog01.png",
      author: "Faixa Rosa",
      date: "22 de abril de 2024",
      link: "https://faixarosa.blog/por-que-anunciar-no-faixa-rosa/",
    },
    {
      title: "A Importância da Segurança Digital para Anunciantes: Dicas do Faixa Rosa",
      description: "No cenário digital em constante evolução, a segurança online tornou-se uma prioridade inegável...",
      image: "/files/images/Blog02.png",
      author: "Faixa Rosa",
      date: "24 de julho de 2023",
      link: "https://faixarosa.blog/diversidade-e-inclusao-o-faixa-rosa-como-espaco-livre-de-discriminacao/",
    },
    {
      title: "Por que Anunciar no Faixa Rosa?",
      description: "Se você está no mundo dos anúncios, provavelmente já percebeu que a escolha da plataforma...",
      image: "/files/images/Blog03.png",
      author: "Faixa Rosa",
      date: "4 de abril de 2024",
      link: "https://faixarosa.blog/dicas-faixarosa/",
    },
  ];

  const nextArticle = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
  };

  const prevArticle = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + articles.length) % articles.length);
  };

  return (
    <div className="flex flex-col items-center py-16 bg-white">
      {/* Título do Blog */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-8 text-gray-900 font-[Poppins]">
        É acompanhante? Confira mais conteúdos para melhorar seus resultados
      </h2>

      {/* Carrossel de Artigos para Mobile */}
      <div className="w-full max-w-xs md:hidden px-4">
        <div className=" bg-[#ebeff1]  rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300">
        <Image
  src={articles[currentIndex].image}
  alt={articles[currentIndex].title}
  width={600}
  height={300}
  className="w-full h-48 object-cover"
/>          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{articles[currentIndex].title}</h3>
            <div className="flex items-center text-gray-500 text-sm mb-2">
              <FaFire className="text-pink-500 mr-1" />
              <span>{articles[currentIndex].author}</span>
              <FaRegClock className="text-gray-400 mx-2" />
              <span>{articles[currentIndex].date}</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{articles[currentIndex].description}</p>
            <a href={articles[currentIndex].link} className="text-pink-500 font-semibold hover:underline">
              Saiba mais &rarr;
            </a>
          </div>
        </div>

        {/* Controles de Navegação */}
        <div className="flex justify-between mt-4">
          <button onClick={prevArticle} className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full">
            Anterior
          </button>
          <button onClick={nextArticle} className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full">
            Próximo
          </button>
        </div>
      </div>

      {/* Layout Grid para Desktop */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-6 md:w-full md:max-w-6xl ">
        {articles.map((article, index) => (
          <div key={index} className="relative  bg-[#ebeff1] rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
<Image
  src={article.image}
  alt={article.title}
  width={600}
  height={300}
  className="w-full h-48 object-cover"
/>            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{article.title}</h3>
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <FaFire className="text-pink-500 mr-1" />
                <span>{article.author}</span>
                <FaRegClock className="text-gray-400 mx-2" />
                <span>{article.date}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{article.description}</p>
              <a href={article.link} className="text-pink-500 font-semibold hover:underline">
                Saiba mais &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
