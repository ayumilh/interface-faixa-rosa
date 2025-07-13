"use client";
import React, { useState, useCallback, memo } from "react";
import { 
  InstagramLogo, 
  YoutubeLogo, 
  WhatsappLogo,
  Question,
  X,
  CaretDown,
  CaretUp,
  Article,
  Users,
  Shield,
  Heart,
  Sparkle
} from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const Rodape = memo(() => {
  const [showFAQ, setShowFAQ] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      id: 1,
      question: "O que é o Faixa Rosa?",
      answer: "O Faixa Rosa é a principal plataforma brasileira de acompanhantes de alto nível, criada para conectar clientes a perfis verificados com segurança, discrição e qualidade.",
      category: "Geral"
    },
    {
      id: 2,
      question: "Quem pode anunciar no Faixa Rosa?",
      answer: "Somente acompanhantes maiores de 18 anos com perfil profissional, que atendam aos critérios de qualidade e responsabilidade definidos pela plataforma.",
      category: "Anunciantes"
    },
    {
      id: 3,
      question: "Como me cadastro como cliente?",
      answer: "Basta acessar a página de cadastro, preencher os dados básicos e criar sua conta gratuitamente em poucos segundos.",
      category: "Clientes"
    },
    {
      id: 4,
      question: "Quais planos estão disponíveis para clientes?",
      answer: "Clientes podem escolher entre os planos Básico, Avançado e Premium — cada um com vantagens progressivas em visibilidade, suporte e recursos exclusivos.",
      category: "Planos"
    },
    {
      id: 5,
      question: "O que o plano Premium oferece?",
      answer: "O plano Premium inclui suporte prioritário, acesso completo à plataforma, brindes exclusivos e máxima visibilidade entre os membros da comunidade.",
      category: "Planos"
    },
    {
      id: 6,
      question: "O que são os convênios para acompanhantes?",
      answer: "Convênios são parcerias com descontos exclusivos em academias, clínicas, hotéis e serviços diversos — disponíveis para acompanhantes com planos Pink, Safira ou Rubi.",
      category: "Convênios"
    },
    {
      id: 7,
      question: "Como filtrar por cidade nos convênios?",
      answer: "Na página de convênios, você pode selecionar sua cidade para visualizar todos os estabelecimentos parceiros disponíveis na sua região.",
      category: "Convênios"
    },
    {
      id: 8,
      question: "Quais descontos estão disponíveis nos convênios?",
      answer: "Os descontos variam entre 5% e 10%, conforme o tipo de serviço e a parceria local. Consulte a página de convênios para ver todas as ofertas.",
      category: "Convênios"
    },
    {
      id: 9,
      question: "Como entrar em contato com um parceiro conveniado?",
      answer: "Cada cartão de parceiro exibe telefone, endereço e formas de contato para você agendar diretamente com o estabelecimento.",
      category: "Convênios"
    },
    {
      id: 10,
      question: "Como o Faixa Rosa protege meus dados?",
      answer: "Seguimos rigorosamente a LGPD e utilizamos protocolos avançados de segurança para garantir que suas informações estejam sempre protegidas e confidenciais.",
      category: "Segurança"
    },
    {
      id: 11,
      question: "O pagamento na plataforma é seguro?",
      answer: "Sim! Trabalhamos exclusivamente com Pix, garantindo transações rápidas, seguras e sem riscos de golpes ou clonagem de cartão.",
      category: "Pagamento"
    },
    {
      id: 12,
      question: "O nome 'Faixa Rosa' aparece na fatura?",
      answer: "Não. Para garantir a sua privacidade, o nome da plataforma não aparece no comprovante do Pix. A cobrança é feita de forma discreta.",
      category: "Privacidade"
    },
    {
      id: 13,
      question: "Posso cancelar minha assinatura?",
      answer: "Sim, o cancelamento pode ser feito a qualquer momento através do seu painel. Consulte os Termos de Uso para mais informações.",
      category: "Geral"
    },
    {
      id: 14,
      question: "E se eu encontrar um perfil suspeito?",
      answer: "Você pode reportar diretamente através do botão de denúncia disponível em cada perfil ou entrar em contato com nosso suporte.",
      category: "Segurança"
    },
    {
      id: 15,
      question: "O Faixa Rosa está disponível em todo o Brasil?",
      answer: "Sim! A plataforma é nacional e atende todas as cidades. A oferta de acompanhantes pode variar conforme a região.",
      category: "Geral"
    },
    {
      id: 16,
      question: "Como faço parte da elite do Faixa Rosa?",
      answer: "Adquirindo planos específicos e mantendo boas avaliações, você pode se tornar parte da elite — com benefícios e visibilidade premium.",
      category: "Elite"
    },
    {
      id: 17,
      question: "Os perfis são realmente verificados?",
      answer: "Sim, todos os anunciantes passam por um processo de verificação manual e automatizada, garantindo autenticidade e confiança.",
      category: "Verificação"
    },
    {
      id: 18,
      question: "Quais formas de pagamento são aceitas?",
      answer: "Atualmente, aceitamos apenas pagamentos via Pix — a forma mais segura, rápida e prática para sua assinatura.",
      category: "Pagamento"
    },
    {
      id: 19,
      question: "Como posso anunciar no Faixa Rosa?",
      answer: "Acesse a seção de planos para anunciantes, escolha o ideal para você e siga o passo a passo para criar seu perfil profissional.",
      category: "Anunciantes"
    },
    {
      id: 20,
      question: "Preciso de ajuda. Onde encontro suporte?",
      answer: "Nosso time de suporte está sempre à disposição. Você pode entrar em contato pelo link de Suporte e Informações disponível no rodapé do site.",
      category: "Suporte"
    }
  ];

  const socialLinks = [
    {
      name: "Instagram",
      icon: <InstagramLogo size={20} weight="duotone" />,
      url: "https://www.instagram.com/faixarosa.brasil",
      color: "from-pink-500 to-purple-600"
    },
    {
      name: "YouTube",
      icon: <YoutubeLogo size={20} weight="duotone" />,
      url: "https://youtube.com/@faixa.rosa.br.?si=QU2dXkgl1e3rkYn6",
      color: "from-red-500 to-red-600"
    },
    {
      name: "WhatsApp",
      icon: <WhatsappLogo size={20} weight="duotone" />,
      url: "https://chat.whatsapp.com/FR0R57IxlTjFQjzOkGQD6B",
      color: "from-green-500 to-green-600"
    }
  ];

  const toggleFAQ = useCallback((index) => {
    setActiveIndex(activeIndex === index ? null : index);
  }, [activeIndex]);

  const closeModal = useCallback(() => {
    setShowFAQ(false);
    setSearchTerm("");
    setActiveIndex(null);
  }, []);

  const openModal = useCallback(() => {
    setShowFAQ(true);
  }, []);

  // Filtro de FAQs por busca
  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-gray-300 py-16 mt-12 overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-blue-500/5" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />
      
      {/* Elementos decorativos */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-12">
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Coluna Sobre */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Heart size={28} className="text-pink-500" weight="duotone" />
              <h2 className="text-2xl lg:text-3xl font-bold text-white">Sobre o Faixa Rosa</h2>
            </div>
            
            <p className="text-sm lg:text-base leading-relaxed text-gray-400">
              O <span className="text-pink-400 font-semibold">Faixa Rosa</span> é a plataforma nº1 para quem busca{" "}
              <span className="text-white font-semibold">acompanhantes de alto nível</span> em todo o Brasil. 
              Criada para oferecer uma experiência segura, elegante e moderna, conectamos você aos melhores 
              anúncios com <span className="text-purple-400">verificação de perfil, fotos reais</span> e total discrição.
            </p>

            {/* Redes sociais */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Sparkle size={16} className="text-pink-500" weight="duotone" />
                Siga-nos nas redes sociais
              </h3>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`p-3 rounded-xl bg-gradient-to-r ${social.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 group`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="group-hover:scale-110 transition-transform">
                      {social.icon}
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500">CNPJ: 53.839.625/0001-08</p>
            </div>
          </motion.div>

          {/* Coluna Links Importantes */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Article size={28} className="text-purple-500" weight="duotone" />
              <h2 className="text-2xl lg:text-3xl font-bold text-white">Links Importantes</h2>
            </div>
            
            <ul className="space-y-3">
              {[
                { href: "https://faixarosa.com/blog", label: "Conheça o Blog Faixa Rosa", icon: <Article size={16} /> },
                { href: "/planos", label: "Planos para Anunciantes", icon: <Users size={16} /> }
              ].map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link 
                    href={link.href} 
                    className="flex items-center gap-3 text-gray-400 hover:text-pink-400 transition-colors duration-300 group py-2 px-3 rounded-lg hover:bg-white/5"
                  >
                    <span className="text-pink-500 group-hover:scale-110 transition-transform">
                      {link.icon}
                    </span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Coluna Suporte e Informações */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield size={28} className="text-blue-500" weight="duotone" />
              <h2 className="text-2xl lg:text-3xl font-bold text-white">Suporte e Informações</h2>
            </div>
            
            <ul className="space-y-3">
              {/* FAQ Button especial */}
              <motion.li
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={openModal}
                  className="flex items-center gap-3 w-full text-left p-3 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300 hover:text-pink-200 transition-all duration-300 group"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="text-pink-500"
                  >
                    <Question size={16} weight="duotone" />
                  </motion.div>
                  <span className="font-semibold">Perguntas Frequentes</span>
                  <Sparkle size={12} className="ml-auto opacity-60 group-hover:opacity-100" weight="duotone" />
                </button>
              </motion.li>

              {/* Outros links */}
              {[
                { href: "/termos", label: "Termos de Uso", icon: <Shield size={16} /> },
                { href: "/politica-privacidade", label: "Política de Privacidade", icon: <Shield size={16} /> },
                { href: "https://new.safernet.org.br/denuncie", label: "Denunciar Exploração Sexual", icon: <Shield size={16} /> }
              ].map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Link 
                    href={link.href} 
                    className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors duration-300 group py-2 px-3 rounded-lg hover:bg-white/5"
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <span className="text-blue-500 group-hover:scale-110 transition-transform">
                      {link.icon}
                    </span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Rodapé Inferior */}
        <motion.div
          className="border-t border-gray-700 mt-12 pt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} <span className="text-pink-400 font-semibold">Faixa Rosa</span>. 
            Todos os direitos reservados.
          </p>
        </motion.div>
      </div>

      {/* Modal de Perguntas Frequentes */}
      <AnimatePresence>
        {showFAQ && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header do Modal */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white relative">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  aria-label="Fechar FAQ"
                >
                  <X size={20} weight="bold" />
                </button>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Question size={32} weight="duotone" />
                    <h2 className="text-2xl lg:text-3xl font-bold">Perguntas Frequentes</h2>
                  </div>
                  <p className="text-pink-100 text-sm">Encontre respostas para suas dúvidas sobre a plataforma</p>
                </div>

                {/* Campo de busca */}
                <div className="mt-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar pergunta..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-3 pl-4 pr-12 rounded-xl text-gray-800 bg-white/95 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <Question size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Conteúdo do Modal */}
              <div className="max-h-[60vh] overflow-y-auto p-6">
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-12">
                    <Question size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Nenhuma pergunta encontrada para &quot;{searchTerm}&quot;</p>
                    </div>
                ) : (
                  <div className="space-y-3">
                    {filteredFAQs.map((faq, index) => (
                      <motion.div
                        key={faq.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <button
                          className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between group"
                          onClick={() => toggleFAQ(index)}
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <span className="bg-pink-100 text-pink-600 text-xs font-semibold px-2 py-1 rounded-full mt-0.5 flex-shrink-0">
                              {faq.category}
                            </span>
                            <span className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">
                              {faq.question}
                            </span>
                          </div>
                          <motion.div
                            animate={{ rotate: activeIndex === index ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-gray-400 group-hover:text-pink-500"
                          >
                            <CaretDown size={20} weight="bold" />
                          </motion.div>
                        </button>
                        
                        <AnimatePresence>
                          {activeIndex === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 pt-0 bg-white">
                                <p className="text-gray-700 leading-relaxed pl-3 border-l-2 border-pink-200">
                                  {faq.answer}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
});

Rodape.displayName = 'Rodape';

export default Rodape;