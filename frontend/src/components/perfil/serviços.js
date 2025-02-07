import { useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Ícones para indicar os serviços oferecidos e não oferecidos
import Expediente from "@/components/perfil/Expediente"; // Importa o componente Expediente

export default function Servicos() {
  const servicosOferecidosDetalhados = [
    { nome: 'Sexo anal com preservativo', descricao: 'Aceita receber penetração anal com preservativo de seus clientes. Taxa adicional pelo serviço: <strong>R$ 500</strong>' },
    { nome: 'Sexo vaginal com preservativo', descricao: 'Faz penetração vaginal com preservativo em seus clientes. Taxa adicional pelo serviço: <strong>R$ 400</strong>' },
    { nome: 'Beijo na boca', descricao: 'Realiza beijo na boca com seus clientes. Taxa adicional pelo serviço: <strong>R$ 200</strong>' },
    { nome: 'Sexo oral com preservativo', descricao: 'Realiza sexo oral com preservativo em seus clientes. Taxa adicional pelo serviço: <strong>R$ 150</strong>' },
    { nome: 'Striptease', descricao: 'Tira a roupa de forma lenta e sensual, normalmente com dança. Taxa adicional pelo serviço: <strong>R$ 150</strong>' },
    { nome: 'Masturbação', descricao: 'Realiza masturbação em seus clientes. Taxa adicional pelo serviço: <strong>R$ 300</strong>' },
    { nome: 'Massagem tradicional', descricao: 'Realiza massagem relaxante em seus clientes. Taxa adicional pelo serviço: <strong>R$ 350</strong>' },
    { nome: 'Massagem tântrica', descricao: 'Realiza massagem tântrica que expande a sensibilidade e proporciona vivências sexuais mais intensas. Taxa adicional pelo serviço: <strong>R$ 350</strong>' },
    { nome: 'Sexo virtual', descricao: 'Sexo à distância por meio de texto, áudio e vídeo online. Sem contato físico. Taxa adicional pelo serviço: <strong>R$ 300</strong>' },
    { nome: 'Acompanhante', descricao: 'Companhia para encontros, festas e eventos. Taxa adicional pelo serviço: <strong>R$ 200</strong>' },
    { nome: 'Viagem', descricao: 'Aceita viajar com seus clientes. Taxa adicional pelo serviço: <strong>Sob consulta</strong>' },
  ];

  const servicosNaoOferecidosDetalhados = [
    { nome: 'Sexo oral sem preservativo', descricao: 'Atividade em que o sexo oral é realizado sem o uso de preservativo, aumentando os riscos de transmissão de doenças.' },
    { nome: 'Dupla penetração', descricao: 'Prática que envolve a penetração simultânea em duas áreas do corpo, geralmente vaginal e anal.' },
    { nome: 'Tripla penetração', descricao: 'Prática que envolve a penetração simultânea em três áreas do corpo, geralmente oral, vaginal e anal.' },
    { nome: 'Dominação', descricao: 'Envolve o controle e a submissão de uma pessoa sobre a outra, geralmente dentro do contexto BDSM.' },
    { nome: 'Uso de roupas de fantasia/uniformes', descricao: 'Prática onde um dos participantes veste roupas específicas ou uniformes para aumentar a excitação.' },
    { nome: 'Fazer roleplay', descricao: 'Envolve atuar ou fingir ser outra pessoa em um cenário fictício para aumentar a excitação sexual.' },
    { nome: 'Penetração com acessórios sexuais', descricao: 'Uso de brinquedos ou acessórios durante a penetração.' },
    { nome: 'Utiliza acessórios eróticos', descricao: 'Inclui o uso de brinquedos eróticos diversos para aumentar a estimulação.' },
    { nome: 'Permite filmagem', descricao: 'Consente que a relação seja filmada, algo que exige confiança mútua e consentimento claro.' },
    { nome: 'Beijo grego', descricao: 'Prática que envolve a estimulação oral da região anal.' },
    { nome: 'Sexo com voyeurismo/ser voyeur', descricao: 'Ato de observar ou ser observado durante relações sexuais, aumentando a excitação.' },
    { nome: 'Podolatria', descricao: 'Atração sexual por pés, onde os pés são o foco principal da excitação.' },
    { nome: 'Bondage', descricao: 'Prática de amarração consensual com cordas ou outros materiais para restrição durante o ato sexual.' },
    { nome: 'Sadomasoquismo', descricao: 'Atividades que envolvem dor ou humilhação consensual, combinando sadismo e masoquismo.' },
    { nome: 'Fisting', descricao: 'Introdução de uma mão inteira na vagina ou no ânus durante o ato sexual.' },
    { nome: 'Facefuck', descricao: 'Ato de penetração oral intensa e profunda.' },
    { nome: 'Quirofilia', descricao: 'Excitação sexual causada pelas mãos.' },
    { nome: 'Squirt', descricao: 'Ejaculação feminina durante o clímax.' },
    { nome: 'Chuva dourada', descricao: 'Prática de urinar no parceiro durante o ato sexual.' },
    { nome: 'Chuva marrom', descricao: 'Prática de defecar no parceiro, considerada extrema.' },
    { nome: 'Trampling', descricao: 'Ato de pisotear outra pessoa com os pés como forma de excitação sexual.' },
  ];

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      {/* Renderiza o componente Expediente no topo */}
      <Expediente />

      {/* Serviços Oferecidos */}
      <h2 className="mt-8 text-xl font-semibold text-black flex items-center mb-4">
        <FaCheckCircle className="text-green-500 mr-2" /> Serviços Oferecidos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {servicosOferecidosDetalhados.map((servico, index) => (
          <div key={index} className="text-black border-b pb-2 cursor-pointer hover:bg-green-50 rounded-md p-2 transition duration-300">
            <span className="font-bold">{servico.nome}</span>
            <p className="text-sm mt-1" dangerouslySetInnerHTML={{ __html: servico.descricao }}></p>
          </div>
        ))}
      </div>

      {/* Serviços Não Oferecidos */}
      <h2 className="text-xl font-semibold text-black flex items-center mb-4">
        <FaTimesCircle className="text-red-500 mr-2" /> Serviços Não Oferecidos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {servicosNaoOferecidosDetalhados.map((servico, index) => (
          <div key={index} className="text-gray-600 border-b pb-2 cursor-pointer hover:bg-red-50 rounded-md p-2 transition duration-300">
            <span className="line-through font-bold text-black">{servico.nome}</span>
            <p className="text-sm mt-1">{servico.descricao}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
