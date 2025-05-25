"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { CaretDown, CaretUp, MapPin, Shield, CreditCard, Sparkle } from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";

const VerMais = memo(() => {
  const [expandido, setExpandido] = useState(false);
  const [regiao, setRegiao] = useState("sua região");
  const [loading, setLoading] = useState(true);

  const toggleExpandido = useCallback(() => {
    setExpandido((prev) => !prev);
  }, []);

  // GeoIP: detecta a região do visitante via IP - otimizado
  useEffect(() => {
    const detectarRegiao = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        const cidade = data.city;
        const estado = data.region_code || data.region;
        
        if (cidade && estado) {
          setRegiao(`${cidade} - ${estado}`);
        } else {
          setRegiao("sua cidade");
        }
      } catch (error) {
        console.error("Erro ao detectar região:", error);
        setRegiao("sua cidade");
      } finally {
        setLoading(false);
      }
    };

    detectarRegiao();
  }, []);

  return (
    <div className="rounded-2xl md:rounded-3xl shadow-lg p-6 md:p-8 lg:p-12 text-gray-900 max-w-5xl mx-auto relative w-full mt-8 md:mt-12 overflow-hidden" style={{ backgroundColor: '#EDF1F3', border: '1px solid rgba(255, 255, 255, 0.5)' }}>
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-pink-50/30 to-purple-50/20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-200/30 to-transparent rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/30 to-transparent rounded-tr-full" />

      {/* Título principal */}
      <motion.div
        className="relative z-10 text-center mb-6 md:mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <Sparkle size={24} className="text-pink-500 hidden sm:block" weight="duotone" />
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 font-sans">
            Faixa Rosa: A melhor plataforma de acompanhantes do Brasil
          </h2>
          <Sparkle size={24} className="text-purple-500 hidden sm:block" weight="duotone" />
        </div>
        
        {/* Localização detectada */}
        <motion.div
          className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-full px-4 py-2 text-sm font-medium text-pink-700"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <MapPin size={16} weight="duotone" />
          {loading ? (
            <span>Detectando sua localização...</span>
          ) : (
            <span>Você está na região de {regiao}</span>
          )}
        </motion.div>
      </motion.div>

      {/* Conteúdo principal */}
      <div className="relative z-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-6 text-center md:text-left">
            Seja bem-vindo ao <strong className="text-pink-600">Faixa Rosa</strong>, o site nº1 para quem busca
            <strong className="text-gray-900"> acompanhantes de alto nível em {regiao}</strong> e em todo o Brasil.
            Aqui você encontra uma seleção exclusiva de perfis verificados, com fotos reais,
            descrição completa e total sigilo. Somos referência nacional no segmento.
          </p>
        </motion.div>

        {/* Conteúdo expansível */}
        <AnimatePresence>
          {expandido && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="space-y-6"
            >
              {/* Seção 1 - Excelência */}
              <motion.div
                className="bg-white/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-green-200/30 shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <Shield size={24} className="text-green-600 mt-1 flex-shrink-0" weight="duotone" />
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">
                    Excelência, Segurança e Respeito
                  </h3>
                </div>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  No Faixa Rosa, valorizamos o profissionalismo e a diversidade.
                  Acompanhantes de grandes capitais como São Paulo, Rio, Manaus ou Salvador
                  — e também de cidades menores — encontram aqui um espaço seguro e acolhedor
                  para divulgar seus serviços.
                </p>
              </motion.div>

              {/* Seção 2 - Cliente/Profissional */}
              <motion.div
                className="bg-white/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-blue-200/30 shadow-sm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
                  Cliente ou profissional, você está no lugar certo
                </h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  Se você procura um serviço diferenciado ou deseja anunciar com visibilidade real,
                  o Faixa Rosa é a escolha certa. Com interface moderna, suporte dedicado e
                  cadastro gratuito, oferecemos a melhor experiência para ambos os lados.
                </p>
              </motion.div>

              {/* Seção 3 - Pagamento */}
              <motion.div
                className="bg-white/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-purple-200/30 shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <CreditCard size={24} className="text-purple-600 mt-1 flex-shrink-0" weight="duotone" />
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">
                    Pagamento 100% via Pix
                  </h3>
                </div>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  Para sua segurança e praticidade, aceitamos apenas <strong className="text-purple-600">Pix</strong> —
                  evitando fraudes com cartão clonado ou boletos falsos. Aqui, sua privacidade
                  e segurança são prioridade máxima.
                </p>
              </motion.div>

              {/* Seção final */}
              <motion.div
                className="bg-white/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-200/30 shadow-sm text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  Com milhares de acessos diários e presença nas principais cidades do país,
                  o <strong className="text-pink-600">Faixa Rosa</strong> é a plataforma definitiva para acompanhantes
                  e clientes que prezam por discrição, elegância e qualidade.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gradiente de fade quando não expandido */}
        {!expandido && (
          <div className="absolute bottom-0 left-0 w-full h-16 pointer-events-none" style={{ 
            background: 'linear-gradient(to top, #EDF1F3, rgba(237, 241, 243, 0.8), transparent)' 
          }} />
        )}
      </div>

      {/* Botão de expansão */}
      <motion.div
        className="relative z-10 flex justify-center mt-8 md:mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={toggleExpandido}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 hover:from-pink-600 hover:via-pink-700 hover:to-purple-700 text-white font-semibold py-4 px-8 md:px-12 rounded-full shadow-lg transition-all duration-300 hover:shadow-2xl overflow-hidden"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          style={{ 
            boxShadow: "0 8px 25px rgba(236, 72, 153, 0.4)" 
          }}
        >
          {/* Background animado */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          
          <span className="relative z-10 text-sm md:text-base">
            {expandido ? "Ver Menos" : "Ver Mais"}
          </span>
          
          <motion.div
            animate={{ rotate: expandido ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {expandido ? (
              <CaretUp size={20} weight="bold" />
            ) : (
              <CaretDown size={20} weight="bold" />
            )}
          </motion.div>

          {/* Efeito de brilho */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.button>
      </motion.div>
    </div>
  );
});

VerMais.displayName = 'VerMais';

export default VerMais;