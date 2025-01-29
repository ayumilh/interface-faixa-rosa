"use client";
import React, { useState } from "react";
import { FaInstagram, FaTwitter, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { SiTiktok, SiYoutube } from "react-icons/si";
import Link from "next/link";
import { IoClose } from "react-icons/io5"; // Ícone de fechar

export default function Rodape() {
  const [showFAQ, setShowFAQ] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { question: "O que é o Faixa Rosa?", answer: "O Faixa Rosa é uma plataforma inovadora para anúncios e serviços de acompanhantes no Brasil, conectando clientes e profissionais de forma segura e eficiente." },
    { question: "Quem pode anunciar no Faixa Rosa?", answer: "Apenas acompanhantes maiores de 18 anos que atendam aos critérios de qualidade e profissionalismo da plataforma podem anunciar no Faixa Rosa." },
    { question: "Como faço para me cadastrar como cliente?", answer: "Para se cadastrar como cliente, basta acessar a página de cadastro e preencher os dados solicitados. É rápido e gratuito!" },
    { question: "Quais são os planos disponíveis para clientes?", answer: "Os clientes podem escolher entre três planos: Básico, Avançado e Premium, cada um com benefícios específicos. Confira mais detalhes na página de planos." },
    { question: "Quais os benefícios do plano Premium para clientes?", answer: "O plano Premium oferece suporte prioritário, perfil visível para a comunidade, brindes exclusivos e todos os benefícios dos planos anteriores." },
    { question: "Como funcionam os convênios?", answer: "Os convênios são benefícios exclusivos para acompanhantes com planos Pink, Safira e Rubi. Esses profissionais têm acesso a descontos em academias, psicólogos, hotéis, entre outros estabelecimentos parceiros." },
    { question: "Como selecionar a cidade no convênio?", answer: "Na página de convênios, você pode selecionar a cidade desejada para visualizar os estabelecimentos parceiros disponíveis em sua região." },
    { question: "Quais descontos posso obter com o convênio?", answer: "Os descontos variam de 5% a 10%, dependendo do estabelecimento e da cidade. Acesse a página de convênios para ver os detalhes de cada parceria." },
    { question: "Como faço para entrar em contato com um estabelecimento conveniado?", answer: "Nos cartões de cada estabelecimento na página de convênios, você encontrará as informações de contato, como telefone e endereço, para facilitar o agendamento do serviço." },
    { question: "Como é garantida a privacidade dos meus dados?", answer: "O Faixa Rosa segue uma política rigorosa de privacidade e segurança de dados, garantindo que todas as informações sejam tratadas de forma confidencial e protegida." },
    { question: "Os pagamentos são seguros?", answer: "Sim, utilizamos métodos de pagamento seguros e confiáveis, como cartão de crédito e Pix. Nossos parceiros de pagamento são auditados e certificados." },
    { question: "O nome do Faixa Rosa aparece na fatura?", answer: "Não, para garantir a privacidade dos nossos clientes, o nome 'Faixa Rosa' não aparece na fatura de pagamentos." },
    { question: "Posso cancelar um plano de assinatura?", answer: "Sim, você pode cancelar a assinatura a qualquer momento. Consulte nossos Termos de Uso para informações sobre o processo e prazos." },
    { question: "O que devo fazer se encontrar um perfil suspeito?", answer: "Caso encontre um perfil suspeito, entre em contato com o nosso suporte ou utilize o botão de denúncia disponível na plataforma para que possamos tomar as devidas providências." },
    { question: "O Faixa Rosa é acessível para todas as cidades?", answer: "Sim, o Faixa Rosa atende clientes e profissionais de todas as cidades do Brasil. No entanto, a disponibilidade de serviços pode variar por região." },
    { question: "Como posso me tornar membro da elite do Faixa Rosa?", answer: "Para se tornar membro da elite do Faixa Rosa, você precisa adquirir um dos planos de assinatura específicos e manter um histórico de boas avaliações." },
    { question: "Os anunciantes são verificados?", answer: "Sim, todos os anunciantes passam por um processo de verificação para garantir a segurança e qualidade dos serviços oferecidos na plataforma." },
    { question: "Quais métodos de pagamento são aceitos?", answer: "Atualmente, aceitamos pagamentos via cartão de crédito, Pix e boleto bancário, proporcionando flexibilidade e segurança." },
    { question: "Como faço para anunciar no Faixa Rosa?", answer: "Acesse a página de planos para anunciantes e escolha o plano que melhor atende às suas necessidades. Após isso, você será guiado pelo processo de criação do perfil." },
    { question: "O que faço se precisar de suporte?", answer: "Nosso time de suporte está disponível para ajudar. Entre em contato por meio do canal de Suporte e Informações no rodapé do site." },
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
            Lançada para conectar e interagir com o melhor conteúdo do Brasil, o Faixa Rosa é uma plataforma inovadora para anúncios e serviços de acompanhantes.
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
              href="https://www.tiktok.com/@faixa.rosa.br?_t=8lAQyHcuUKs&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="bg-pink-500 p-2 rounded-full text-white hover:bg-pink-600 transition duration-200"
            >
              <SiTiktok size={20} />
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
              href="https://x.com/faixarosabr10?s=21"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="bg-pink-500 p-2 rounded-full text-white hover:bg-pink-600 transition duration-200"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://t.me/+NPqKr1BHnoYyZWNh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="bg-pink-500 p-2 rounded-full text-white hover:bg-pink-600 transition duration-200"
            >
              <FaTelegramPlane size={20} />
            </a>
            <a
              href="https://chat.whatsapp.com/JhN54ArwFFy73rjnXWwxUv"
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
            <li>
              <Link href="/convenio" className="hover:underline text-gray-300">
                Seja uma ELITE do Faixa Rosa
              </Link>
            </li>
            <li>
              <Link href="/planos" className="hover:underline text-gray-300">
                Planos para Anunciantes
              </Link>
            </li>
            <li>
              <Link href="/planos-usuarios" className="hover:underline text-gray-300">
                Planos para Clientes
              </Link>
            </li>
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
