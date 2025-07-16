import Footer from "../../../components/search/footer";

export default function SEOContent() {
  const highlights = [
    {
      bgColor: "bg-pink-100",
      iconColor: "text-pink-600",
      title: "Perfis 100% Verificados em Sorocaba",
      desc:
        "Cada acompanhante em Sorocaba passa por verificação rigorosa de identidade, garantindo confiança local.",
    },
    {
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      title: "Avaliações Autênticas",
      desc:
        "Depoimentos reais de clientes em Sorocaba ajudam você a escolher com segurança e tranquilidade.",
    },
    {
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "Mídias Recentes",
      desc:
        "Fotos e vídeos atualizados de Sorocaba, todos verificados para transparência total.",
    },
    {
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      title: "Filtros Avançados para Sorocaba",
      desc:
        "Refine sua busca por acompanhante em Sorocaba por idade, corpo, cor de cabelo, serviços e disponibilidade.",
    },
  ];

  const cities = [
    "São Paulo-SP",
    "Campinas-SP",
    "Santos-SP",
    "Ribeirão Preto-SP",
    "Bauru-SP",
    "Birigui-SP",
    "Marília-SP",
    "Presidente Prudente-SP",
    "São José do Rio Preto-SP",
    "Botucatu-SP",
  ];

  return (<>
    <section
      className="py-12 sm:py-16 bg-white/90 backdrop-blur-lg scroll-mt-24"
      aria-labelledby="seo-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título com efeito de destaque */}
        <h2
          id="seo-heading"
          className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-700 mb-4 animate-pulse drop-shadow-lg"
        >
          Encontre as Melhores Acompanhantes em Sorocaba – SP
        </h2>

        {/* Texto descritivo específico para Sorocaba e otimizado para SEO */}
        <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-6 opacity-90">
          Em <strong>Sorocaba, SP</strong>, o Faixa Rosa é o <span className="font-semibold text-pink-600">portal número 1</span> para acompanhantes .
          Nossa seleção local traz profissionais verificadas, avaliações e mídias autênticas,
          proporcionando experiências seguras e memoráveis na região.
        </p>
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-8 opacity-80">
          Aproveite <em>filtros inteligentes</em> e navegue por perfis detalhados para encontrar
          a companhia ideal para eventos, viagens ou momentos de lazer em Sorocaba.
        </p>

        {/* Destaques em grid com hover effects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow hover:shadow-xl hover:scale-[1.02] transform transition-all duration-300"
            >
              <div
                className={`${item.bgColor} p-3 rounded-full flex items-center justify-center`}
              >
                {/* <MapPin size={24} className={item.iconColor} weight="fill" /> */}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Seção de Cidades com badges disabled e texto SEO extra */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
            Explore Outras Cidades de SP (Em breve)
          </h3>
          <p className="text-gray-700 mb-6">
            Expandindo nosso alcance! Em breve, o Faixa Rosa de Sorocaba estará presente em toda São Paulo.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            {cities.map((city) => {
              const slug = city.toLowerCase().replace(/\s+/g, "-");
              return (
                <span
                  key={city}
                  className="flex items-center gap-2 bg-pink-50 text-pink-600 px-4 py-2 rounded-full text-sm sm:text-base opacity-60 cursor-not-allowed relative"
                >
                  {/* <MapPin size={16} className="text-pink-500" weight="fill" /> */}
                  {city}
                  <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs px-1 rounded-full">
                    em breve
                  </span>
                </span>
              );
            })}
          </div>
          {/* Texto SEO extra detalhado */}
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base tracking-wide">
            O Faixa Rosa de Sorocaba está dedicado a crescer e levar <strong>serviços de alta qualidade</strong>
            a mais cidades paulistas. Em breve, você encontrará o mesmo nível de segurança,
            discrição e verificação em São Paulo, Campinas, Santos, Ribeirão Preto e muito mais.
          </p>
        </div>
      </div>
    </section>
    
    <Footer />
  </>);
}
