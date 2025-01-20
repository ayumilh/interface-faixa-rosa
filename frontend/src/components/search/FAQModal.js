"use client";
import { useState } from "react";

export default function FAQModal() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

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
    { question: "O que faço se precisar de suporte?", answer: "Nosso time de suporte está disponível para ajudar. Entre em contato por meio do canal de Suporte e Informações no rodapé do site." }
  ];

  return (
    <div>
      <button
        onClick={toggleModal}
        className="bg-pink-500 text-white py-2 px-4 rounded-full hover:bg-pink-600 transition"
      >
        Perguntas Frequentes
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-3xl mx-4 md:mx-auto p-8 rounded-lg shadow-lg relative">
            <button onClick={toggleModal} className="absolute top-4 right-4 text-gray-600 hover:text-pink-500 text-2xl">&times;</button>
            <h2 className="text-2xl font-semibold text-center mb-6">Perguntas Frequentes</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {faqs.map((faq, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-semibold text-pink-500">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
