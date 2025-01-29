"use client";
import { useState } from "react";
import { CaretDown, CaretUp } from "phosphor-react";

export default function VerMais() {
  const [expandido, setExpandido] = useState(false);

  const toggleExpandido = () => {
    setExpandido((prev) => !prev);
  };

  return (
    <div className=" bg-[#ebeff1] rounded-lg p-4 md:p-8 text-gray-900 max-w-4xl mx-auto relative w-full mt-8 ">
      {/* Título */}
      <h2 className="text-xl sm:text-3xl font-bold text-center text-gray-900 mb-4 sm:mb-6 font-[Poppins]">
        Faixa Rosa: O melhor site de acompanhantes do Brasil
      </h2>

      {/* Texto principal */}
      <div className="relative overflow-hidden">
        <p className="text-gray-700 text-sm sm:text-lg leading-relaxed mb-4">
          O <strong>Faixa Rosa</strong> é a principal referência para quem busca uma
          experiência segura, respeitosa e de alta qualidade no universo de acompanhantes
          em todo o país. Com uma ampla variedade de perfis anunciados, nossa plataforma
          se destaca por oferecer um ambiente confiável, onde cada anúncio passa por um
          rigoroso processo de verificação, garantindo autenticidade e segurança.
        </p>

        {/* Texto expandido (visível apenas se expandido) */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            expandido ? "max-h-[1000px] md:max-h-screen" : "max-h-0 overflow-hidden"
          }`}
        >
          <p className="text-gray-700 text-sm sm:text-lg leading-relaxed mb-4">
            <strong>Diversidade e Respeito em Primeiro Lugar</strong> <br />
            No <strong>Faixa Rosa</strong>, valorizamos a diversidade e a dignidade
            de todos os profissionais. Seja você acompanhante em grandes capitais,
            como São Paulo ou Rio de Janeiro, ou em cidades de menor porte, aqui
            encontra espaço para divulgar seu trabalho com total respeito e discrição.
            Acreditamos que o termo <strong>acompanhante</strong> é o mais adequado,
            evitando expressões que possam ter conotação pejorativa.
          </p>

          <p className="text-gray-700 text-sm sm:text-lg leading-relaxed mb-4">
            <strong>Como contatar uma acompanhante?</strong> <br />
            Para quem deseja contratar esses serviços, recomendamos utilizar sempre
            o termo <strong>acompanhante</strong>, demonstrando consideração e
            profissionalismo. A escolha de palavras reflete o compromisso em valorizar
            o trabalho exercido, reforçando a importância do respeito em todo o processo.
          </p>

          <p className="text-gray-700 text-sm sm:text-lg leading-relaxed mb-4">
            <strong>Anuncie com Segurança e Confiança</strong> <br />
            Se você é uma profissional do segmento e deseja anunciar no maior site
            de acompanhantes, o <strong>Faixa Rosa</strong> é o lugar certo. Oferecemos
            um ambiente de credibilidade e total suporte para que você possa divulgar
            seu perfil de forma segura.
          </p>

          <p className="text-gray-700 text-sm sm:text-lg leading-relaxed mb-4">
            Nossa equipe de suporte está sempre à disposição para assegurar excelência
            na sua experiência, independentemente da região onde você atua. Venha fazer
            parte do <strong>Faixa Rosa</strong> e descubra por que somos o melhor
            caminho para quem busca ou oferece serviços de acompanhantes no Brasil!
          </p>
        </div>
      </div>

      {/* Gradiente no fim do texto quando estiver recolhido */}
      {!expandido && (
        <div className="absolute bottom-[90px] left-0 w-full h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      )}

      {/* Botão de Expandir / Recolher */}
      <div className="flex justify-center mt-8">
        <button
          onClick={toggleExpandido}
          className="
            flex items-center gap-2
            bg-gradient-to-r from-pink-500 to-pink-400
            hover:from-pink-600 hover:to-pink-500
            text-white font-semibold py-4 px-10
            rounded-full shadow-lg
            transition-all duration-300
            hover:shadow-xl
            active:scale-95
          "
          style={{
            boxShadow: "0px 4px 12px rgba(255, 105, 180, 0.5)",
          }}
        >
          {expandido ? "Ver Menos" : "Ver Mais"}{" "}
          {expandido ? <CaretUp size={20} /> : <CaretDown size={20} />}
        </button>
      </div>
    </div>
  );
}
