"use client";

import { useEffect, useState } from "react";
import { CaretDown, CaretUp } from "phosphor-react";

export default function VerMais() {
  const [expandido, setExpandido] = useState(false);
  const [regiao, setRegiao] = useState("sua região");

  const toggleExpandido = () => setExpandido((prev) => !prev);

  // GeoIP: detecta a região do visitante via IP
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        const cidade = data.city;
        const estado = data.region_code || data.region;
        if (cidade && estado) {
          setRegiao(`${cidade} - ${estado}`);
        }
      })
      .catch(() => {
        setRegiao("sua cidade");
      });
  }, []);

  return (
    <div className="bg-[#ebeff1] rounded-lg p-4 md:p-8 text-gray-900 max-w-4xl mx-auto relative w-full mt-8">
      <h2 className="text-xl sm:text-3xl font-bold text-center text-gray-900 mb-4 sm:mb-6 font-[Poppins]">
        Faixa Rosa: A melhor plataforma de acompanhantes do Brasil
      </h2>

      <div className="relative overflow-hidden">
        <p className="text-gray-700 text-sm sm:text-lg leading-relaxed mb-4">
          Seja bem-vindo ao <strong>Faixa Rosa</strong>, o site nº1 para quem busca
          <strong> acompanhantes de alto nível em {regiao}</strong> e em todo o Brasil.
          Aqui você encontra uma seleção exclusiva de perfis verificados, com fotos reais,
          descrição completa e total sigilo. Somos referência nacional no segmento.
        </p>

        <div
          className={`transition-all duration-500 ease-in-out ${
            expandido ? "max-h-[1000px] md:max-h-screen" : "max-h-0 overflow-hidden"
          }`}
        >
          <p className="text-gray-700 text-sm sm:text-lg leading-relaxed mb-4">
            <strong>Excelência, Segurança e Respeito</strong><br />
            No Faixa Rosa, valorizamos o profissionalismo e a diversidade.
            Acompanhantes de grandes capitais como São Paulo, Rio, Manaus ou Salvador
            — e também de cidades menores — encontram aqui um espaço seguro e acolhedor
            para divulgar seus serviços.
          </p>

          <p className="text-gray-700 text-sm sm:text-lg leading-relaxed mb-4">
            <strong>Cliente ou profissional, você está no lugar certo</strong><br />
            Se você procura um serviço diferenciado ou deseja anunciar com visibilidade real,
            o Faixa Rosa é a escolha certa. Com interface moderna, suporte dedicado e
            cadastro gratuito, oferecemos a melhor experiência para ambos os lados.
          </p>

          <p className="text-gray-700 text-sm sm:text-lg leading-relaxed mb-4">
            <strong>Pagamento 100% via Pix</strong><br />
            Para sua segurança e praticidade, aceitamos apenas <strong>Pix</strong> —
            evitando fraudes com cartão clonado ou boletos falsos. Aqui, sua privacidade
            e segurança são prioridade máxima.
          </p>

          <p className="text-gray-700 text-sm sm:text-lg leading-relaxed mb-4">
            Com milhares de acessos diários e presença nas principais cidades do país,
            o <strong>Faixa Rosa</strong> é a plataforma definitiva para acompanhantes
            e clientes que prezam por descrição, elegância e qualidade.
          </p>
        </div>
      </div>

      {!expandido && (
        <div className="absolute bottom-[90px] left-0 w-full h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      )}

      <div className="flex justify-center mt-8">
        <button
          onClick={toggleExpandido}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 text-white font-semibold py-4 px-10 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95"
          style={{ boxShadow: "0px 4px 12px rgba(255, 105, 180, 0.5)" }}
        >
          {expandido ? "Ver Menos" : "Ver Mais"}{" "}
          {expandido ? <CaretUp size={20} /> : <CaretDown size={20} />}
        </button>
      </div>
    </div>
  );
}
