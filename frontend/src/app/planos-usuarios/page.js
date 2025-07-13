"use client"; // Marcando o arquivo como client-side

import { useState } from "react";
import { FaCheckCircle, FaCreditCard, FaMoneyBillWave, FaBarcode } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Final from "../../components/search/final";

export default function PlanosUsuarios() {
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  const handleCheckout = () => {
    if (selectedOption) {
      window.location.href = `/checkout?plano=${selectedOption}`;
    } else {
      alert("Por favor, selecione uma opção de pagamento antes de prosseguir.");
    }
  };

  const planos = [
    {
      nome: "Plano Básico",
      preco: "R$ 49,90/mês",
      beneficios: ["Acesso limitado", "Suporte básico", "Visualização de perfis"],
      pagamento: {
        cartao: [
          { descricao: "Parcelado em 12x", preco: "R$ 4,90/mês", destaque: "Popular" },
          { descricao: "À vista", preco: "R$ 49,90" }
        ],
        pix: [{ descricao: "Pagamento instantâneo", preco: "R$ 47,90" }],
        boleto: [{ descricao: "Boleto bancário", preco: "R$ 49,90" }]
      }
    },
    {
      nome: "Plano Premium",
      preco: "R$ 99,90/mês",
      beneficios: ["Acesso completo", "Suporte prioritário", "Mensagens ilimitadas"],
      pagamento: {
        cartao: [
          { descricao: "Parcelado em 12x", preco: "R$ 9,90/mês" },
          { descricao: "À vista", preco: "R$ 99,90" }
        ],
        pix: [{ descricao: "Pagamento instantâneo", preco: "R$ 94,90", destaque: "Desconto" }],
        boleto: [{ descricao: "Boleto bancário", preco: "R$ 99,90" }]
      }
    },
    {
      nome: "Plano VIP",
      preco: "R$ 199,90/mês",
      beneficios: ["Acesso total + bônus", "Consultoria exclusiva", "Eventos VIP"],
      pagamento: {
        cartao: [
          { descricao: "Parcelado em 12x", preco: "R$ 19,90/mês" },
          { descricao: "À vista", preco: "R$ 199,90" }
        ],
        pix: [{ descricao: "Pagamento instantâneo", preco: "R$ 189,90", destaque: "Melhor oferta" }],
        boleto: [{ descricao: "Boleto bancário", preco: "R$ 199,90" }]
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-pink-100 text-gray-900 font-sans">
      <Navbar className="mt-16" />

      {/* Seção de introdução com Banner Responsivo */}
      <div
        className="w-full rounded-3xl overflow-hidden shadow-lg mx-auto max-w-4xl mt-16 relative bg-center bg-contain sm:bg-cover"
        style={{
          backgroundImage: 'url("/Banner-elite-faixa.png")',
        }}
      >
        {/* Overlay para melhorar a legibilidade do texto */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        {/* Conteúdo da Seção de Introdução */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-12 sm:py-16 md:py-20">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 tracking-wide text-white">
            Acesse mais de{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff007f] via-[#ff66cc] to-[#8000ff] animate-pulse">
              80 mil acompanhantes
            </span>{" "}
            pelo Brasil
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Vantagens{" "}
            <span className="font-semibold italic">exclusivas</span> e{" "}
            <span className="font-semibold italic">únicas</span> esperam por você. Assine agora e{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff007f] via-[#ff66cc] to-[#8000ff] animate-pulse">
              transforme sua experiência
            </span>{" "}
            na nossa plataforma.
          </p>
          <button
            onClick={() =>
              window.scrollTo({ top: document.getElementById("planos").offsetTop, behavior: "smooth" })
            }
            className="bg-gradient-to-r from-[#ff007f] to-[#8000ff] text-white py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-bold"
          >
            Conheça os nossos planos
          </button>
        </div>
      </div>

      {/* Seção dos planos */}
      <div id="planos" className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-14 text-pink-600 tracking-tight">
          Conheça nossos Planos de Assinatura
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {planos.map((plano, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transform transition-all duration-500 p-8 hover:scale-105 hover:border-pink-300 flex flex-col justify-between h-full"
            >
              <div className="flex-grow">
                <h3 className="text-3xl font-semibold mb-4 text-pink-500">{plano.nome}</h3>
                <p className="text-2xl font-bold mb-6">{plano.preco}</p>
                <ul className="mb-6 space-y-3">
                  {plano.beneficios.map((beneficio, i) => (
                    <li key={i} className="flex items-center mb-3">
                      <FaCheckCircle className="text-green-500 mr-3" />
                      <span className="text-base text-gray-700">{beneficio}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Métodos de Pagamento */}
              <div className="mb-6">
                {["cartao", "pix", "boleto"].map((metodo) =>
                  plano.pagamento[metodo] ? (
                    <div key={metodo} className="mb-6">
                      <h4 className="font-semibold text-gray-700 flex items-center mb-3">
                        {metodo === "cartao" && <FaCreditCard className="mr-2" />}
                        {metodo === "pix" && <FaMoneyBillWave className="mr-2" />}
                        {metodo === "boleto" && <FaBarcode className="mr-2" />}
                        {`Pague com ${metodo.charAt(0).toUpperCase() + metodo.slice(1)}`}
                      </h4>
                      {plano.pagamento[metodo].map((opcao, j) => (
                        <label
                          key={j}
                          className="flex items-center justify-between border border-gray-300 p-3 rounded-lg mb-3 cursor-pointer hover:bg-pink-50 transition shadow-sm hover:shadow-md"
                        >
                          <input
                            type="radio"
                            name={`plano-${index}`}
                            className="accent-pink-500"
                            checked={selectedOption === `${plano.nome}-${metodo}-${j}`}
                            onChange={() => handleSelect(`${plano.nome}-${metodo}-${j}`)}
                          />
                          <div className="flex items-center space-x-3">
                            <span className="text-base">{opcao.descricao}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-gray-900">{opcao.preco}</span>
                            {opcao.destaque && (
                              <span className="text-xs bg-pink-600 text-white rounded-full px-2 ml-3">
                                {opcao.destaque}
                              </span>
                            )}
                            {opcao.total && (
                              <span className="block text-gray-500 text-sm">{opcao.total}</span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : null
                )}
              </div>

              {/* Botão de Assinatura */}
              <button
                onClick={handleCheckout}
                className="mt-4 bg-pink-500 text-white py-3 px-5 rounded-full hover:bg-pink-600 shadow-lg hover:shadow-xl transition transform hover:scale-110 w-full"
              >
                Assine Agora
              </button>
            </div>
          ))}
        </div>
      </div>

      <Final />
    </div>
  );
}
