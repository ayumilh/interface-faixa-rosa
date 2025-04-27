"use client";
import React, { useState } from "react";
import { FaInstagram, FaTwitter, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { SiTiktok, SiYoutube } from "react-icons/si";
import Link from "next/link";
import { IoClose } from "react-icons/io5"; // Ícone de fechar
import Image from "next/image";

export default function Rodape() {
  const [showFAQ, setShowFAQ] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "O que é o Faixa Rosa?",
      answer: "O Faixa Rosa é a principal plataforma brasileira de acompanhantes de alto nível, criada para conectar clientes a perfis verificados com segurança, descrição e qualidade."
    },
    {
      question: "Quem pode anunciar no Faixa Rosa?",
      answer: "Somente acompanhantes maiores de 18 anos com perfil profissional, que atendam aos critérios de qualidade e responsabilidade definidos pela plataforma."
    },
    {
      question: "Como me cadastro como cliente?",
      answer: "Basta acessar a página de cadastro, preencher os dados básicos e criar sua conta gratuitamente em poucos segundos."
    },
    {
      question: "Quais planos estão disponíveis para clientes?",
      answer: "Clientes podem escolher entre os planos Básico, Avançado e Premium — cada um com vantagens progressivas em visibilidade, suporte e recursos exclusivos."
    },
    {
      question: "O que o plano Premium oferece?",
      answer: "O plano Premium inclui suporte prioritário, acesso completo à plataforma, brindes exclusivos e máxima visibilidade entre os membros da comunidade."
    },
    {
      question: "O que são os convênios para acompanhantes?",
      answer: "Convênios são parcerias com descontos exclusivos em academias, clínicas, hotéis e serviços diversos — disponíveis para acompanhantes com planos Pink, Safira ou Rubi."
    },
    {
      question: "Como filtrar por cidade nos convênios?",
      answer: "Na página de convênios, você pode selecionar sua cidade para visualizar todos os estabelecimentos parceiros disponíveis na sua região."
    },
    {
      question: "Quais descontos estão disponíveis nos convênios?",
      answer: "Os descontos variam entre 5% e 10%, conforme o tipo de serviço e a parceria local. Consulte a página de convênios para ver todas as ofertas."
    },
    {
      question: "Como entrar em contato com um parceiro conveniado?",
      answer: "Cada cartão de parceiro exibe telefone, endereço e formas de contato para você agendar diretamente com o estabelecimento."
    },
    {
      question: "Como o Faixa Rosa protege meus dados?",
      answer: "Seguimos rigorosamente a LGPD e utilizamos protocolos avançados de segurança para garantir que suas informações estejam sempre protegidas e confidenciais."
    },
    {
      question: "O pagamento na plataforma é seguro?",
      answer: "Sim! Trabalhamos exclusivamente com Pix, garantindo transações rápidas, seguras e sem riscos de golpes ou clonagem de cartão."
    },
    {
      question: "O nome 'Faixa Rosa' aparece na fatura?",
      answer: "Não. Para garantir a sua privacidade, o nome da plataforma não aparece no comprovante do Pix. A cobrança é feita de forma discreta."
    },
    {
      question: "Posso cancelar minha assinatura?",
      answer: "Sim, o cancelamento pode ser feito a qualquer momento através do seu painel. Consulte os Termos de Uso para mais informações."
    },
    {
      question: "E se eu encontrar um perfil suspeito?",
      answer: "Você pode reportar diretamente através do botão de denúncia disponível em cada perfil ou entrar em contato com nosso suporte."
    },
    {
      question: "O Faixa Rosa está disponível em todo o Brasil?",
      answer: "Sim! A plataforma é nacional e atende todas as cidades. A oferta de acompanhantes pode variar conforme a região."
    },
    {
      question: "Como faço parte da elite do Faixa Rosa?",
      answer: "Adquirindo planos específicos e mantendo boas avaliações, você pode se tornar parte da elite — com benefícios e visibilidade premium."
    },
    {
      question: "Os perfis são realmente verificados?",
      answer: "Sim, todos os anunciantes passam por um processo de verificação manual e automatizada, garantindo autenticidade e confiança."
    },
    {
      question: "Quais formas de pagamento são aceitas?",
      answer: "Atualmente, aceitamos apenas pagamentos via Pix — a forma mais segura, rápida e prática para sua assinatura."
    },
    {
      question: "Como posso anunciar no Faixa Rosa?",
      answer: "Acesse a seção de planos para anunciantes, escolha o ideal para você e siga o passo a passo para criar seu perfil profissional."
    },
    {
      question: "Preciso de ajuda. Onde encontro suporte?",
      answer: "Nosso time de suporte está sempre à disposição. Você pode entrar em contato pelo link de Suporte e Informações disponível no rodapé do site."
    },
  ];
  

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const closeModal = () => setShowFAQ(false);

  return (
    <footer className="bg-[#273238] text-gray-300 py-12 mt-8">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Sobre */}
        <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Sobre o Faixa Rosa</h2>
<p className="text-sm leading-relaxed">
  O <strong>Faixa Rosa</strong> é a plataforma nº1 para quem busca <strong>acompanhantes de alto nível</strong> em todo o Brasil. Criada para oferecer uma experiência segura, elegante e moderna, conectamos você aos melhores anúncios de acompanhantes com <strong>verificação de perfil, fotos reais</strong> e total descrição. Explore agora e descubra um novo padrão de exclusividade.
</p>

          <div className="flex space-x-3 mt-4">
            <a
              href="https://www.instagram.com/faixa.rosa.br?igsh=cmdhcTVkM3FyZjNp"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="bg-pink-500 p-2 rounded-full text-white hover:bg-pink-600 transition duration-200"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://youtube.com/@faixa.rosa.br.?si=QU2dXkgl1e3rkYn6"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="bg-pink-500 p-2 rounded-full text-white hover:bg-pink-600 transition duration-200"
            >
              <SiYoutube size={20} />
            </a>
            <a
              href="https://chat.whatsapp.com/FR0R57IxlTjFQjzOkGQD6B"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="bg-pink-500 p-2 rounded-full text-white hover:bg-pink-600 transition duration-200"
            >
              <FaWhatsapp size={20} />
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-4">CNPJ: 53.839.625/0001-08</p>
        </div>

        {/* Coluna Links Importantes */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Links Importantes</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="https://faixarosa.blog/" className="hover:underline text-gray-300">
                Conheça o Blog Faixa Rosa
              </Link>
            </li>
            {/* <li>
              <Link href="/convenio" className="hover:underline text-gray-300">
                Seja uma ELITE do Faixa Rosa
              </Link>
            </li> */}
            <li>
              <Link href="/planos" className="hover:underline text-gray-300">
                Planos para Anunciantes
              </Link>
            </li>
            {/* <li>
              <Link href="/planos-usuarios" className="hover:underline text-gray-300">
                Planos para Clientes
              </Link>
            </li> */}
          </ul>
        </div>

        {/* Coluna Suporte e Informações */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Suporte e Informações</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <button
                onClick={() => setShowFAQ(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 animate-pulse font-semibold text-transparent bg-clip-text hover:underline"
              >
                Perguntas Frequentes
              </button>
            </li>
            <li>
              <Link href="/termos" className="hover:underline text-gray-300">
                Termos de Uso
              </Link>
            </li>
            <li>
              <Link href="/politica-privacidade" className="hover:underline text-gray-300">
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link href="https://new.safernet.org.br/denuncie" className="hover:underline text-gray-300">
                Denunciar Exploração Sexual
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Rodapé Inferior */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Faixa Rosa. Todos os direitos reservados.</p>
      </div>

      {/* Modal de Perguntas Frequentes */}
      {showFAQ && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white w-11/12 max-w-2xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[80vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-pink-500">Perguntas Frequentes</h2>
            <button
              onClick={() => setShowFAQ(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
              aria-label="Fechar FAQ"
            >
              <IoClose />
            </button>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <button
                    className="w-full text-left font-semibold text-gray-800 py-2 px-4 bg-pink-100 rounded-md focus:outline-none focus:bg-pink-200 transition"
                    onClick={() => toggleFAQ(index)}
                  >
                    {faq.question}
                  </button>
                  {activeIndex === index && (
                    <p className="text-gray-700 mt-2 px-4">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
