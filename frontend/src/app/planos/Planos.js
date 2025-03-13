"use client";
import Navbar from "@/components/Navbar";
import Final from "@/components/search/final";
import Contato from "@/components/planos/Contato";
import PlanoOculto from "@/components/planos/PlanoOculto";
import TrocaDeCidade from "@/components/planos/TrocaDeCidade";
import PlanoReviews from "@/components/planos/PlanoReviews";
import DarkMode from "@/components/planos/DarkMode";
import PlanoNitro from "@/components/planos/PlanoNitro";
import PlanoRubi from "@/components/planos/PlanoRubi";
import PlanoSafira from "@/components/planos/PlanoSafira";
import PlanoPink from "@/components/planos/PlanoPink";
import PlanoVip from "@/components/planos/PlanoVip";
import Simular from "@/components/planos/simular";
import "@/app/planos/planos.css";

const Planos = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#ebeff2]">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow mt-16 sm:mt-24 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section
          className="relative bg-center bg-cover h-64 sm:h-80 md:h-96 lg:h-[500px] mb-12 rounded-lg overflow-hidden shadow-2xl"
          style={{
            backgroundImage: 'url("/Banner-elite-faixa.png")',
          }}
        >
          {/* Overlay Escuro */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>

          {/* Conteúdo */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 py-6 sm:py-12">
            {/* Título */}
            <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-5xl font-extrabold text-white leading-snug mb-4 sm:mb-6">
              Escolha seu{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient">
                Plano Ideal
              </span>
            </h1>

            {/* Descrição */}
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 max-w-md sm:max-w-xl leading-normal sm:leading-relaxed mb-4 sm:mb-6">
              Personalize seu plano para aumentar sua visibilidade e alcançar
              novos clientes. Flexível e sob medida para o seu sucesso.
            </p>

            {/* Botão de Ação */}
            <button
              onClick={() => {
                document.getElementById("planos-principais").scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-bold text-xs sm:text-sm md:text-base rounded-full shadow-md hover:shadow-lg hover:scale-105 transition transform duration-300 ease-in-out"
            >
              Conheça os Planos
            </button>
          </div>
        </section>

        {/* Planos Principais e Extras */}
        <section id="planos-principais" className="py-12">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center text-gray-800 mb-6">
              Planos Principais
            </h2>
            <div className="grid grid-cols-layout gap-6 max-w-7xl mx-auto">
              <div className="plan-card shadow-lg rounded-lg hover:shadow-xl transition-shadow">
                <PlanoRubi />
              </div>
              <div className="plan-card shadow-lg rounded-lg hover:shadow-xl transition-shadow">
                <PlanoSafira />
              </div>
              <div className="plan-card shadow-lg rounded-lg hover:shadow-xl transition-shadow">
                <PlanoPink />
              </div>
              <div className="plan-card shadow-lg rounded-lg hover:shadow-xl transition-shadow">
                <PlanoVip />
              </div>
              <div className="plan-card shadow-lg rounded-lg hover:shadow-xl transition-shadow">
                <PlanoNitro />
              </div>
            </div>
          </div>

          <div className="mt-12 mb-16 lg:mb-24">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center text-gray-800 mb-6">
              Planos Extras
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <div className="plan-card flex justify-center items-center shadow-lg rounded-lg hover:shadow-xl transition-shadow">
                <Contato />
              </div>
              <div className="plan-card flex justify-center items-center shadow-lg rounded-lg hover:shadow-xl transition-shadow">
                <PlanoOculto />
              </div>
              <div className="plan-card flex justify-center items-center shadow-lg rounded-lg hover:shadow-xl transition-shadow">
                <PlanoReviews />
              </div>
              <div className="plan-card flex justify-center items-center shadow-lg rounded-lg hover:shadow-xl transition-shadow">
                <DarkMode />
              </div>
            </div>



          </div>
        </section>

        {/* Simular */}
        <Simular />
      </main>

      {/* Footer */}
      <Final />
    </div>
  );
}
export default Planos;