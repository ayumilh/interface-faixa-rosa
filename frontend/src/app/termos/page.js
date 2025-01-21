"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar"; // Verifique se o alias está configurado ou use caminho relativo

import "./styles-termos.css";

export default function Termos() {
  const [activeTab, setActiveTab] = useState("usuarios");

  const containerStyle = {
    backgroundColor: '#FFC0CB',
    color: '#000000',
    fontFamily: '"Roboto", sans-serif',
    lineHeight: '1.6',
  };

  const linkStyle = {
    color: '#FF69B4',
    textDecoration: 'none',
  };

  const headingStyle = {
    color: '#333',
    fontWeight: 'bold',
  };

  const contentStyle = {
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const userContent = (
    <div style={contentStyle} className="text-black">
      <h2 style={headingStyle} className="text-2xl font-semibold">
        Termos de Uso e Serviços | Usuários
      </h2>

      <h2>PARTES ENVOLVIDAS</h2>
      <p>
        1.1 Este documento constitui um contrato entre a{" "}
        <strong>
          TMF Technology Company Conteúdos na Internet LTDA
        </strong>
        , empresa legalmente constituída, com sede em Avenida Brig. Faria Lima,
        1811, Jardim Paulistano, São Paulo, CEP 01452-001, inscrita no
        CNPJ/MF sob número 53.839.625/0001-08, doravante referida como &quot;O Faixa
        Rosa&quot;, e o usuário identificado no Cadastramento Eletrônico pelo seu
        Código de <strong>VISITANTE ASSINANTE</strong>, doravante denominado
        simplesmente como &quot;VISITANTE/USUÁRIO&quot;.
      </p>

      <h2>OBJETO DOS TERMOS DE USO E SERVIÇOS</h2>
      <p>
        2.1 Este contrato estabelece os termos e condições para o uso da
        plataforma e a contratação de planos de destaque em buscas na plataforma{" "}
        <strong>O Faixa Rosa</strong>. As informações detalhadas estão
        disponíveis para o VISITANTE no site{" "}
        <a href="http://www.faixarosa.com.br">www.faixarosa.com.br</a>.
      </p>
      <p>
        2.2 Todos os dispositivos dos Termos de Uso e Serviços são aplicáveis a
        este contrato.
      </p>
      <p>
        2.3 A plataforma destina-se exclusivamente a maiores de 18 anos e
        contém conteúdo adulto.
      </p>

      <h2>CÓDIGO DA ASSINATURA</h2>
      <p>
        3.1 <strong>O Faixa Rosa</strong> atribuirá ao VISITANTE ASSINANTE um
        &quot;Código de VISITANTE ASSINANTE&quot; para identificação junto ao Serviço de
        Atendimento ao Cliente <strong>O Faixa Rosa</strong>, que servirá como
        código de identificação do usuário - ID.
      </p>
      <p>
        3.2 O Código de VISITANTE ASSINANTE será disponibilizado ao VISITANTE
        ASSINANTE após a confirmação do pedido e o envio dos Produtos/Serviços.
      </p>

      <h2>COLETA E TRATAMENTO DE DADOS PESSOAIS</h2>
      <p>
        4.1 <strong>O Faixa Rosa</strong> coleta e trata dados pessoais dos
        VISITANTES ASSINANTES com o objetivo de garantir a segurança, prevenir
        fraudes e verificar a maioridade dos usuários. Os dados coletados
        incluem, mas não se limitam a:
      </p>
      <ul>
        <li>Informações de identificação (nome, CPF, data de nascimento).</li>
        <li>Dados de contato (e-mail).</li>
        <li>
          Dados de pagamento (processados por terceiros, conforme a Seção 5).
        </li>
        <li>Dados de navegação (cookies, endereço IP, dispositivo).</li>
      </ul>
      <p>
        4.2 O tratamento dos dados pessoais é realizado com base nas seguintes
        finalidades:
      </p>
      <ul>
        <li>
          Identificação e autenticação do usuário para acesso seguro à
          plataforma.
        </li>
        <li>Prevenção de fraudes e segurança dos dados.</li>
        <li>
          Cumprimento de obrigações legais e regulatórias.
        </li>
      </ul>
      <p>
        4.3 Os dados coletados são armazenados na infraestrutura da Amazon S3,
        a qual aplica rigorosas medidas de segurança para proteger as
        informações. A responsabilidade pelo armazenamento e segurança técnica
        dos dados também é da Amazon S3.
      </p>

      <div className="clausula-dados">
        <h3>Cláusula de Responsabilidade por Vazamento de Dados</h3>
        <p>
          Embora o <strong>Faixa Rosa</strong> adote rigorosas medidas de
          segurança para proteger os dados dos VISITANTES ASSINANTES, todos os
          dados são hospedados na infraestrutura da Amazon S3, que também
          possui seus próprios protocolos de segurança. O <strong>Faixa Rosa</strong>{" "}
          não se responsabiliza por quaisquer vazamentos de dados que possam
          ocorrer devido a falhas na infraestrutura da Amazon S3 ou a ataques
          de terceiros fora do controle direto do <strong>Faixa Rosa</strong>.
        </p>
        <p>
          Os VISITANTES ASSINANTES reconhecem e concordam que a segurança dos seus
          dados está sujeita às práticas e políticas de segurança da Amazon S3,
          e que o <strong>Faixa Rosa</strong> envidará esforços razoáveis para
          garantir a proteção dos dados, mas não pode garantir a total prevenção
          de acessos não autorizados.
        </p>
      </div>

      <h2>FORMAS DE PAGAMENTO</h2>
      <p>
        5.1 <strong>O Faixa Rosa</strong> utiliza um checkout próprio, com
        processamento de pagamentos exclusivamente pelo gateway Mercado Pago.
      </p>
      <p>
        5.2 As formas de pagamento aceitas na plataforma incluem PIX e Cartão
        de Crédito (Visa, Mastercard, American Express, entre outras bandeiras
        disponíveis no Mercado Pago).
      </p>
      <p>
        5.3 <strong>O Faixa Rosa</strong> e o Mercado Pago adotam rigorosas
        medidas de segurança para garantir a integridade e confidencialidade
        dos dados de pagamento.
      </p>

      <h2>PLANOS DE ASSINATURA E BENEFÍCIOS</h2>
      <p>
        6.1 <strong>O Faixa Rosa</strong> oferece o Plano de Assinatura Premium,
        que inclui acesso a todos os conteúdos da Plataforma e prioridade no
        suporte.
      </p>

      <h2>BANCO DE DADOS E SEGURANÇA</h2>
      <p>
        7.1 Ao contratar um Produto/Serviço, o VISITANTE ASSINANTE concorda em
        fazer parte do banco de dados de <strong>O Faixa Rosa</strong>.
      </p>
      <p>
        7.2 As informações cadastrais dos VISITANTES ASSINANTES são armazenadas
        de acordo com rigorosos critérios de segurança, incluindo criptografia
        e controle de acesso.
      </p>
      <p>
        7.3 <strong>O Faixa Rosa</strong> adota todas as medidas de segurança
        recomendadas para proteger os dados, porém, em caso de vazamento de
        dados na infraestrutura de terceiros (Amazon S3), a responsabilidade
        será atribuída ao prestador do serviço de armazenamento.
      </p>

      <h2>DIREITOS DOS TITULARES DE DADOS</h2>
      <p>
        8.1 O VISITANTE ASSINANTE possui direitos, conforme a LGPD, incluindo:
      </p>
      <ul>
        <li>Acesso: solicitar uma cópia dos dados pessoais tratados.</li>
        <li>
          Correção: solicitar correção ou atualização dos dados.
        </li>
        <li>
          Exclusão: solicitar a exclusão de dados pessoais, exceto quando
          necessários para o cumprimento de obrigações legais.
        </li>
        <li>
          Revogação do consentimento: o usuário pode retirar o consentimento para
          o tratamento de dados a qualquer momento.
        </li>
      </ul>
      <p>
        8.2 As solicitações podem ser feitas pelo e-mail:{" "}
        <a href="mailto:contato@faixarosa.com.br">
          contato@faixarosa.com.br
        </a>
        . O prazo para resposta é de até 15 dias úteis.
      </p>

      <h2>SERVIÇO DE ATENDIMENTO AO VISITANTE ASSINANTE</h2>
      <p>
        9.1 <strong>O Faixa Rosa</strong> disponibiliza serviço de atendimento
        ao VISITANTE ASSINANTE através do e-mail{" "}
        <a href="mailto:contato@faixarosa.com.br">
          contato@faixarosa.com.br
        </a>
        .
      </p>

      <h2>PRAZO</h2>
      <p>
        10.1 Este contrato tem duração inicial de 30 dias, podendo ser prorrogado
        por períodos iguais.
      </p>

      <h2>PROCEDIMENTO DE RENOVAÇÃO</h2>
      <p>
        11.1 <strong>O Faixa Rosa</strong> adota o procedimento de renovação
        programada da assinatura, garantindo facilidade e agilidade ao
        VISITANTE ASSINANTE.
      </p>

      <h2>CANCELAMENTO E RESCISÃO</h2>
      <p>
        12.1 O cancelamento da assinatura e a rescisão do contrato podem ocorrer
        em caso de infração contratual ou inadimplemento, sujeitos a notificação
        prévia.
      </p>
      <p>
        12.2 Em caso de rescisão, os dados do usuário poderão ser mantidos para
        cumprimento de obrigações legais ou regulatórias.
      </p>

      <h2>ALTERAÇÕES DOS TERMOS DE USO E SERVIÇOS</h2>
      <p>
        13.1 <strong>O Faixa Rosa</strong> poderá modificar os Termos de Uso e
        Serviços, notificando os usuários em caso de mudanças que impactem
        direitos e deveres contratuais, incluindo obrigações financeiras.
      </p>

      <h2>CONSENTIMENTO E AUTORIZAÇÕES</h2>
      <p>
        14.1 Ao se cadastrar e utilizar a plataforma, o VISITANTE ASSINANTE
        consente com o tratamento de dados conforme descrito nesta política,
        incluindo o uso de dados para autenticação, segurança e prevenção de
        fraudes.
      </p>
      <p>
        14.2 Consentimentos específicos para uso de dados sensíveis, como
        imagens e vídeos, serão obtidos separadamente, assegurando que o
        usuário compreende e concorda com a exposição de seu conteúdo na
        plataforma.
      </p>

      <h2>SEGURANÇA E RESPONSABILIDADES</h2>
      <p>
        15.1 <strong>O Faixa Rosa</strong> aplica práticas de segurança recomendadas,
        incluindo criptografia, controle de acesso e auditorias de segurança.
      </p>
      <p>
        15.2 O VISITANTE ASSINANTE é responsável por manter a confidencialidade de
        seu código de acesso e senha. <strong>O Faixa Rosa</strong> não se
        responsabiliza por acessos indevidos decorrentes do descuido do usuário
        com suas credenciais.
      </p>
      <p>
        15.3 Em caso de vazamento de dados na infraestrutura da Amazon S3, a
        responsabilidade primária pela segurança do armazenamento será da
        Amazon.
      </p>

      <h2>FORO</h2>
      <p>
        16.1 Fica assegurado ao VISITANTE ASSINANTE o direito de recorrer ao Foro
        da Comarca de sua residência para questões oriundas deste instrumento.
      </p>

      <h2>CONSENTIMENTO PARA MARKETING E COMUNICAÇÃO</h2>
      <p>
        17.1 Ao fornecer dados de contato, o VISITANTE ASSINANTE concorda com o
        recebimento de e-mails e notificações com informações promocionais e
        atualizações da plataforma. Caso não deseje mais receber comunicações,
        poderá cancelar a inscrição a qualquer momento pelo próprio e-mail
        recebido.
      </p>

      <h2>REVISÃO E AUDITORIA DOS TERMOS</h2>
      <p>
        18.1 <strong>O Faixa Rosa</strong> compromete-se a revisar e atualizar
        periodicamente estes Termos de Uso e a Política de Privacidade para
        assegurar conformidade com a legislação vigente e garantir a proteção
        dos dados dos usuários.
      </p>

      <p>
        <strong>Última Atualização:</strong> 01 de Novembro de 2024.
      </p>
      <p>
        Este é um espaço reservado para inserir os termos e condições específicos
        para os usuários.
      </p>

      {/* Exemplo de Cláusula Destacada */}
      <div className="bg-pink-50 p-4 border-l-4 border-pink-600 mt-6 rounded">
        <h3 className="text-lg font-bold text-pink-600 mb-2">
          Cláusula de Responsabilidade por Vazamento de Dados
        </h3>
        <p>
          Embora o <strong>Faixa Rosa</strong> adote rigorosas medidas de segurança
          para proteger os dados dos USUÁRIOS e ANUNCIANTES, todos os dados são
          hospedados na infraestrutura da Amazon S3, que também possui seus
          próprios protocolos de segurança. O <strong>Faixa Rosa</strong> não se
          responsabiliza por quaisquer vazamentos de dados que possam ocorrer
          devido a falhas na infraestrutura da Amazon S3 ou a ataques de
          terceiros fora do controle direto do <strong>Faixa Rosa</strong>.
        </p>
        <p>
          Os VISITANTES ASSINANTES reconhecem e concordam que a segurança dos seus
          dados está sujeita às práticas e políticas de segurança da Amazon S3,
          e que o <strong>Faixa Rosa</strong> envidará esforços razoáveis para
          garantir a proteção dos dados, mas não pode garantir a total prevenção
          de acessos não autorizados.
        </p>
      </div>
    </div>
  );

  const advertiserContent = (
    <div style={contentStyle} className="text-black">
      <h2 style={headingStyle} className="text-2xl font-semibold">
        Termos de Uso e Serviços | Anunciantes
      </h2>

      <p>
        Olá! Que bom contar com seu interesse! Antes de usar nossos serviços, tire
        um tempo para ler e conhecer as regras que regem nossa relação com você.
      </p>

      <p>
        1.1 Este documento constitui um contrato entre a{" "}
        <strong>
          TMF Technology Company Conteúdos na Internet LTDA
        </strong>
        , empresa legalmente constituída, com sede em Avenida Brig. Faria Lima,
        1811, Jardim Paulistano, São Paulo, CEP 01452-001, inscrita no
        CNPJ/MF sob número 53.839.625/0001-08, doravante referida como &quot;O Faixa
        Rosa&quot;, e o usuário identificado no Cadastramento Eletrônico pelo seu
        Código de <strong>ANUNCIANTE ASSINANTE</strong>, doravante denominado
        simplesmente como &quot;ANUNCIANTE/ACOMPANHANTE&quot;.
      </p>

      <p>
        Abaixo esclarecemos alguns pontos que julgamos importantes. Caso persista
        alguma dúvida acerca de quaisquer pontos discutidos ou não neste documento,
        por favor, não hesite em contatar-nos pelo e-mail{" "}
        <a href="mailto:contato@faixarosa.com.br">
          contato@faixarosa.com.br
        </a>
        .
      </p>

      <h2>1. DEFINIÇÕES</h2>

      <p>
        1.1 No presente instrumento, entendemos as expressões abaixo de acordo
        com as seguintes definições:
      </p>

      <ul>
        <li>
          <strong>USUÁRIOS:</strong>
          <ul>
            <li>
              <strong>VISITANTE:</strong> Pessoa física sem cadastro na
              PLATAFORMA, que acessa os conteúdos publicitários ofertados pelos
              ANUNCIANTES na PLATAFORMA.
            </li>
            <li>
              <strong>CONTRATANTE:</strong> Pessoa física cadastrada na
              PLATAFORMA, que acessa os conteúdos publicitários ofertados pelos
              ANUNCIANTES na PLATAFORMA.
            </li>
            <li>
              <strong>CONTRATANTE PREMIUM:</strong> Pessoa física cadastrada na
              PLATAFORMA, que acessa os conteúdos publicitários ofertados pelos
              ANUNCIANTES na PLATAFORMA na modalidade paga premium.
            </li>
            <li>
              <strong>ANUNCIANTE:</strong> Pessoa física cadastrada na
              PLATAFORMA, que, no uso desta, divulga seus anúncios aos
              VISITANTES.
            </li>
            <li>
              <strong>ASSINANTE:</strong> Pessoa física cadastrada na PLATAFORMA
              como ANUNCIANTE, que contrata os serviços da PLATAFORMA para
              otimizar a procura de seus anúncios aos VISITANTES.
            </li>
            <li>
              <strong>PLATAFORMA:</strong> Sistema constituído por uma aplicação
              web, onde há cessão de espaço publicitário para anúncios, em que
              todos os USUÁRIOS podem visualizar os anúncios publicados pelos
              ANUNCIANTES cadastrados na plataforma do FAIXA ROSA.
            </li>
          </ul>
        </li>
      </ul>

      <h2>2. ADESÃO</h2>

      <p>
        2.1 Este instrumento regula as condições de uso dos serviços da
        PLATAFORMA, sendo um contrato entre os USUÁRIOS e o FAIXA ROSA. A
        utilização dos serviços oferecidos através da PLATAFORMA indica
        expressamente que você concorda com todos os termos e condições contidos
        neste instrumento e com as disposições legais aplicáveis à espécie.
      </p>

      <p>
        2.2 <strong>VOCÊ ENTENDE E CONCORDA</strong> QUE O FAIXA ROSA
        CONSIDERARÁ O USO DOS SERVIÇOS DISPONIBILIZADOS COMO ACEITAÇÃO DESTES
        TERMOS E TODAS AS DEMAIS DISPOSIÇÕES LEGAIS PERTINENTES À ESPÉCIE.
      </p>

      <p>
        2.3 AO ACEITAR OS TERMOS DO PRESENTE INSTRUMENTO, O USUÁRIO AUTORIZA
        EXPRESSAMENTE O TRATAMENTO DE SEUS DADOS, A FIM DE GARANTIR A
        MANUTENÇÃO E O BOM DESEMPENHO DAS FUNCIONALIDADES DA PLATAFORMA.
      </p>

      <p>
        2.4 O USUÁRIO, NESTE ATO, MANIFESTA O SEU COMPLETO CONSENTIMENTO PARA O
        COMPARTILHAMENTO DOS DADOS COLETADOS E TRATADOS PELO FAIXA ROSA, NOS
        TERMOS DESTE INSTRUMENTO, COM OUTRAS EMPRESAS QUE FAÇAM PARTE DE SEU
        GRUPO ECONÔMICO, OU SEJAM SUAS PRESTADORAS DE SERVIÇO.
      </p>

      <p>
        2.5 Caso você <strong>NÃO CONCORDA</strong> com as disposições
        previstas neste instrumento, <strong>NÃO</strong> acesse, visualize,
        baixe ou utilize de qualquer forma nenhuma página, conteúdo, informação
        ou serviço do FAIXA ROSA.
      </p>

      <p>
        2.6 Os presentes termos estão disponíveis para leitura a qualquer momento
        na PLATAFORMA, em{" "}
        <a href="https://faixarosa.com.br/terms">https://faixarosa.com.br/terms</a>
        .
      </p>

      <h2>3. CONDIÇÕES GERAIS DE USO</h2>

      <p>
        3.1 O FAIXA ROSA apenas é uma PLATAFORMA de cessão de espaço publicitário,
        sendo sua responsabilidade restrita tão somente ao funcionamento
        correto da PLATAFORMA e de suas funcionalidades, conforme este
        instrumento, não detendo o FAIXA ROSA nenhuma responsabilidade sobre:
      </p>

      <ul>
        <li>
          (i) Eventuais negociações realizadas entre os USUÁRIOS;
        </li>
        <li>
          (ii) A verificação se o ANUNCIANTE realmente detém a qualificação
          informada em seu anúncio;
        </li>
        <li>
          (iii) A qualidade dos anúncios;
        </li>
        <li>
          (iv) A efetivação de qualquer pagamento acertado entre os USUÁRIOS;
        </li>
        <li>
          (v) Eventuais danos decorrentes de eventos de terceiros, englobando,
          entre outros, ataque hacker e softwares maliciosos;
        </li>
        <li>
          (vi) Qualquer outro ato ou fato decorrente da conduta dos USUÁRIOS.
        </li>
      </ul>

      <p>
        3.2 O FAIXA ROSA possibilita que os VISITANTES e os ANUNCIANTES
        contatem-se de forma direta, sem qualquer intervenção, seja na
        negociação ou na efetivação do que fora negociado, não sendo o FAIXA ROSA
        intermediadora ou fornecedora de quaisquer dos serviços ou produtos
        anunciados na PLATAFORMA, ou empregador/representante/agente de qualquer
        dos ANUNCIANTES nesta cadastrados.
      </p>

      <p>
        3.3 O FAIXA ROSA:
      </p>

      <ul>
        <li>
          a) Disponibiliza a PLATAFORMA ao USUÁRIO, realiza a verificação da
          documentação enviada pelos USUÁRIOS, não detém nenhuma relação com os
          ANUNCIANTES cadastrados, não sendo possível imputar ao FAIXA ROSA a
          responsabilidade por qualquer dano eventualmente causado aos
          VISITANTES ou a terceiros, por atos oriundos dos ANUNCIANTES através da
          PLATAFORMA.
        </li>
        <li>
          b) Não detém nenhuma relação com os VISITANTES cadastrados, não sendo
          possível imputar ao FAIXA ROSA a responsabilidade por qualquer dano
          eventualmente causado aos ANUNCIANTES ou a terceiros, por atos oriundos
          dos VISITANTES através da PLATAFORMA.
        </li>
        <li>
          c) Não intermedia qualquer negociação que venha a ser realizada entre
          USUÁRIOS, ficando somente a cargo destes o acerto das condições do negócio
          que efetivarem, tais como o valor, a qualidade, a forma, o prazo e outros
          pontos que julgarem necessários.
        </li>
        <li>
          d) Não interfere em nenhuma negociação que eventualmente venha a ser
          realizada entre USUÁRIOS, ficando somente a cargo destes o acerto de quaisquer
          condições de realização das negociações praticadas, tais como o valor,
          a qualidade, a forma, o prazo e outros pontos que julgarem necessários.
        </li>
      </ul>

      <p>
        3.4 Por não figurar como parte nas transações que eventualmente sejam
        firmadas entre os USUÁRIOS, o FAIXA ROSA também não pode obrigar os
        USUÁRIOS a honrarem com as possíveis obrigações assumidas no momento da
        realização das negociações.
      </p>

      <p>
        3.5 Em nenhuma hipótese o FAIXA ROSA será responsabilizada por quaisquer
        danos suportados pelos USUÁRIOS por eventual indisponibilidade temporária
        da PLATAFORMA.
      </p>

      <h2>4. CADASTRO, DADOS COLETADOS E SEGURANÇA</h2>

      <p>
        4.1 Os USUÁRIOS deverão efetuar cadastro, preenchendo todos os dados
        solicitados pela PLATAFORMA no momento do cadastramento, também
        declarando que preenchem os seguintes pré-requisitos para utilização da
        PLATAFORMA:
      </p>

      <ul>
        <li>a) Ser maior de idade e absolutamente capaz.</li>
        <li>
          b) Possuir a capacidade de comprometer-se aos presentes termos,
          prestando todas as informações que forem necessárias para realização
          de seu cadastro, declarando prestá-las de maneira idônea e verídica,
          sob pena de responder penal e civilmente.
        </li>
        <li>
          c) Possuir número de telefone móvel válido e endereço eletrônico
          (e-mail), por meio do qual o FAIXA ROSA possa entrar em contato quando
          necessário.
        </li>
      </ul>

      <p>
        4.2 É de exclusiva responsabilidade dos USUÁRIOS fornecer, atualizar e
        garantir a veracidade dos dados cadastrais, não recaindo ao FAIXA ROSA
        qualquer tipo de responsabilidade civil e criminal resultante de dados
        inverídicos, incorretos ou incompletos fornecidos pelos USUÁRIOS.
      </p>

      <h3>4.3 VISITANTES:</h3>

      <ul>
        <li>
          a) <strong>E-mail:</strong> A finalidade de tal coleta é
          identificá-lo, bem como habilitá-lo ao correto uso da PLATAFORMA, e,
          com isto, o FAIXA ROSA poderá assegurar a boa qualidade dos serviços
          licenciados e a base legal é a execução do contrato.
        </li>
      </ul>

      <h3>4.4 ANUNCIANTES:</h3>

      <ul>
        <li>a) Nome</li>
        <li>b) Sobrenome</li>
        <li>c) Filiação</li>
        <li>d) Número do CPF</li>
        <li>e) Cópia do Documento de Identificação (frente e verso)</li>
        <li>f) Vídeo de Apresentação</li>
        <li>g) Número de Telefone Móvel</li>
        <li>h) Dados de Atendimento</li>
      </ul>

      <p>
        4.5 A finalidade de tal coleta é identificá-lo, bem como habilitá-lo ao
        correto uso da PLATAFORMA, e, com isto, o FAIXA ROSA poderá assegurar a
        boa qualidade dos serviços licenciados e a base legal é a execução do
        contrato e prevenção a fraudes.
      </p>

      <h3>4.6 ASSINANTES:</h3>

      <ul>
        <li>a) Nome</li>
        <li>b) Sobrenome</li>
        <li>c) Filiação</li>
        <li>d) Número do CPF</li>
        <li>e) Cópia do Documento de Identificação (frente e verso)</li>
        <li>f) Vídeo de Apresentação</li>
        <li>g) Número de Telefone Móvel</li>
        <li>h) Dados de Atendimento</li>
        <li>i) Dados de Pagamento</li>
      </ul>

      <p>
        4.7 A finalidade de tal coleta é identificá-lo, bem como habilitá-lo ao
        correto uso da PLATAFORMA, e, com isto, o FAIXA ROSA poderá assegurar a
        boa qualidade dos serviços licenciados e a base legal é a execução do
        contrato e prevenção a fraudes.
      </p>

      <p>
        4.8 O FAIXA ROSA se reserva o direito de utilizar todos os meios válidos
        e possíveis para identificar seus ANUNCIANTES, bem como de solicitar
        dados adicionais e documentos que estime serem pertinentes a fim de
        conferir os dados informados, incluindo antecedentes criminais. Neste
        caso, o uso da PLATAFORMA pelo ANUNCIANTE fica condicionado ao envio
        dos documentos eventualmente solicitados.
      </p>

      <p>
        4.9 Caso um cadastro seja considerado suspeito de conter dados errôneos ou
        inverídicos, o FAIXA ROSA se reserva ao direito de suspender,
        temporária ou definitivamente, sem necessidade de aviso prévio, o USUÁRIO
        responsável pelo cadastro. No caso de suspensão, não assistirá ao USUÁRIO
        direito a qualquer tipo de indenização ou ressarcimento por perdas e
        danos, lucros cessantes ou ainda danos morais.
      </p>

      <p>
        4.10 Para melhor utilização da PLATAFORMA, o ANUNCIANTE deverá manter
        atualizado seu anúncio (perfil) com os seguintes dados:
      </p>

      <ul>
        <li>i) Descrição do perfil;</li>
        <li>ii) Horários de atendimento;</li>
        <li>iii) Tempo de atendimento;</li>
        <li>iv) Serviços prestados;</li>
        <li>v) Serviços adicionais;</li>
        <li>vi) Localidades de atendimento.</li>
      </ul>

      <p>
        4.11 O anúncio é único, pessoal e identificado internamente pelo CPF do
        ANUNCIANTE cadastrado, devendo pertencer à pessoa física, portadora dos
        documentos fornecidos no ato do cadastro, não podendo ser compartilhado,
        pertencer a grupo de pessoas, ser cedido ou comercializado sob qualquer
        forma ou pretexto. A simulação, ocultação de informações ou indução a
        erro configuram infração grave ao presente documento, e sujeita o
        ANUNCIANTE a penalidade de banimento, além das sanções legais previstas
        em lei.
      </p>

      <p>
        <strong>4.11.1</strong> O ANUNCIANTE está ciente de que, caso opte por
        excluir sua conta, ao restaurá-la, todas as informações previamente
        inseridas serão restabelecidas, mantendo a integridade dos seus dados,
        uma vez que seu anúncio está vinculado ao CPF cadastrado.
      </p>

      <p>
        4.12 É expressamente vedada a criação de mais de um cadastro por
        USUÁRIO na PLATAFORMA. Em caso de multiplicidade de cadastros
        elaborados por um só USUÁRIO, o FAIXA ROSA se reserva o direito de, a
        seu exclusivo critério, sem contrapartida indenizatória e sem necessidade
        de prévia anuência ou comunicação, inabilitar todos os cadastros existentes
        em nome deste USUÁRIO, podendo não aceitar novo cadastro do referido
        USUÁRIO na PLATAFORMA.
      </p>

      <p>
        4.13 O USUÁRIO compromete-se a notificar o FAIXA ROSA imediatamente, por
        meio dos canais de contato mantidos pelo FAIXA ROSA na PLATAFORMA, a
        respeito de qualquer uso não autorizado de sua conta. O USUÁRIO será o
        único responsável pelas operações efetuadas em sua conta, uma vez que o
        acesso só será possível mediante a utilização de senha de seu exclusivo
        conhecimento.
      </p>

      <p>
        4.14 O USUÁRIO compromete-se a notificar o FAIXA ROSA imediatamente, por
        meio dos canais de contato mantidos pelo FAIXA ROSA na PLATAFORMA, a
        respeito de qualquer conhecimento de irregularidades de outros USUÁRIOS
        que possam ocasionar danos aos próprios USUÁRIOS da PLATAFORMA, ao FAIXA
        ROSA ou a terceiros.
      </p>

      <p>
        4.15 Em nenhuma hipótese será permitida a cessão, a venda, o aluguel ou
        outra forma de transferência do cadastro do USUÁRIO.
      </p>

      <p>
        4.16 O apelido que o USUÁRIO utiliza na PLATAFORMA não poderá guardar
        semelhança com o nome FAIXA ROSA, tampouco poderá ser utilizado qualquer
        apelido que insinue ou sugira que o vincule à FAIXA ROSA.
      </p>

      <p>
        4.17 Ao seu exclusivo critério, o FAIXA ROSA poderá excluir, inabilitar,
        criar limites no uso do serviço, suspender ou bloquear, por tempo
        indeterminado, sem aviso prévio ou contrapartida indenizatória, cadastros
        de USUÁRIOS que sejam considerados ofensivos, que infrinjam os termos deste
        instrumento ou a legislação em vigor.
      </p>

      <p>
        4.18 O FAIXA ROSA se reserva o direito de não permitir novo cadastro de
        USUÁRIOS que já tenham sido cancelados, inabilitados, bloqueados,
        excluídos ou suspensos da PLATAFORMA. Não se permitirá, ainda, a criação
        de novos cadastros por pessoas cujos cadastros originais tenham sido
        cancelados, bloqueados, inabilitados, excluídos ou suspensos por
        infrações às políticas da PLATAFORMA ou à legislação vigente.
      </p>

      <p>
        4.19 O FAIXA ROSA se reserva o direito de, unilateralmente, sem prévio
        aviso, anuência ou contrapartida indenizatória, recusar qualquer
        solicitação de cadastro de um USUÁRIO na PLATAFORMA, bem como cancelar,
        inabilitar, bloquear, excluir ou suspender o uso de um cadastro previamente
        aceito.
      </p>

      <p>
        4.20 O Cadastro deve ser regularmente atualizado a cada 6 meses por via
        de Mídia de Verificação, para garantir a fidedignidade acerca da identidade
        do(a) ANUNCIANTE. O FAIXA ROSA poderá solicitar a qualquer momento a
        autenticação facial do(a) ANUNCIANTE, assegurando assim a segurança sobre
        a identidade do(a) mesmo(a).
      </p>

      <p>
        4.21 Ao concordar com o presente instrumento, o USUÁRIO declara estar
        ciente de que é o único responsável pelo seu cadastro, sendo certo que
        qualquer prejuízo causado pela inserção de informações desatualizadas,
        inexatas ou inverídicas não poderá ser imputado ao FAIXA ROSA ou à
        PLATAFORMA.
      </p>

      <h2>5. FUNCIONALIDADES</h2>

      <p>
        5.1 O FAIXA ROSA poderá, a qualquer tempo, sem necessidade de aviso
        prévio ou contrapartida indenizatória, editar e/ou excluir as
        funcionalidades existentes, bem como incluir novas funcionalidades à
        PLATAFORMA.
      </p>

      <p>
        5.2 No momento do cadastro, os USUÁRIOS terão acesso às funcionalidades
        contratadas na PLATAFORMA, declarando, para tanto, terem lido, compreendido
        e aceitado todos os dispositivos contidos neste Termos de Uso.
      </p>

      <p>
        5.3 O(a) ANUNCIANTE poderá ser removido(a), definitiva ou temporariamente,
        da listagem de sua cidade ou de outro filtro de pesquisa que resultaria
        em seu anúncio, ainda que possua assinatura em vigor ou planos ativos, na
        hipótese de reiterada negativa à verificação de sua identidade por meio das
        ferramentas que a PLATAFORMA faz uso.
      </p>

      <p>
        5.4 A PLATAFORMA poderá instituir regras que restringem o acesso a
        determinadas funcionalidades, mediante critérios de sua própria conveniência
        comercial, inclusive estipulando unilateralmente dias e/ou horários para
        aplicar tais restrições de acordo com os planos ou ausência destes que
        cada usuário possua em seu perfil.
      </p>

      <p>
        5.5 <strong>OS USUÁRIOS</strong> poderão, através de funcionalidade
        específica, publicar reviews aos outros USUÁRIOS, e estes estarão sujeitos a
        moderação da PLATAFORMA nas seguintes hipóteses:
      </p>

      <ul>
        <li>a) Quando o review for reportado pelo USUÁRIO avaliado.</li>
        <li>
          b) Quando constar palavras ou conteúdo ofensivo.
        </li>
        <li>
          c) Quando conter informações pessoais que identifiquem terceira pessoa,
          marca ou propriedade intelectual.
        </li>
        <li>
          d) Quando infringir os Termos de Uso ou as Diretrizes da Comunidade.
        </li>
        <li>
          e) Quando conter informações manifestamente inverídicas, caluniosas ou
          difamatórias.
        </li>
        <li>
          f) Quando infringir qualquer regulamento ou legislação a que a PLATAFORMA
          esteja submetida.
        </li>
      </ul>

      <p>
        5.6 Os reviews passam a ser vinculados internamente ao CPF do USUÁRIO, e na
        hipótese de exclusão de um anúncio e criação de novo, os reviews permanecerão
        necessariamente vinculados ao USUÁRIO.
      </p>

      <p>
        5.7 Caso o USUÁRIO, com o objetivo de fraudar a funcionalidade e induzir os
        demais usuários a erro, realize sua autoavaliação, este estará sujeito às
        penalidades previstas no presente documento, inclusive a de banimento.
      </p>

      <p>
        5.8 O FAIXA ROSA reserva-se o direito de não moderar determinado review, caso
        este não infrinja qualquer disposição de suas políticas, e é isento de
        responsabilização civil, penal e administrativa pelo conteúdo gerado por
        terceiros, sendo sua obrigação apenas manter o regular funcionamento da
        PLATAFORMA.
      </p>

      <p>
        5.9 Fica resguardado à PLATAFORMA o direito de restringir as mídias
        publicadas por um usuário ANUNCIANTE, parcial ou totalmente, cuja
        visualização poderá ser restrita aos VISITANTES, de acordo com critérios
        estabelecidos pela PLATAFORMA, quais sejam:
      </p>

      <ul>
        <li>Regularidade do cadastro;</li>
        <li>Assinatura de planos ou ausência destes;</li>
        <li>
          Comportamento do USUÁRIO, conforme as diretrizes da comunidade.
        </li>
      </ul>

      <h2>6. DA PROPRIEDADE INTELECTUAL DO FAIXA ROSA</h2>

      <p>
        6.1 O USUÁRIO reconhece expressamente que, através deste instrumento,
        recebe do FAIXA ROSA a outorga de uma licença de uso da PLATAFORMA, que é
        intransferível, sendo vedado o sublicenciamento, para uso em território
        nacional ou estrangeiro, pelo tempo em que perdurar a adesão a este termo,
        restando vedado o uso da PLATAFORMA em desacordo com o previsto neste
        instrumento.
      </p>

      <h2>7. OBRIGAÇÕES DOS USUÁRIOS</h2>

      <p>
        7.1 <strong>Responsabilidades exclusivas do USUÁRIO:</strong>
      </p>

      <ul>
        <li>
          a) Pela escolha, realização de negociação, acerto de preço, forma de
          pagamento e a respectiva contratação dos demais USUÁRIOS;
        </li>
        <li>
          b) Pela veracidade dos dados informados por si próprio na PLATAFORMA;
        </li>
        <li>
          c) Pela segurança de sua senha e pelo uso de seu cadastro na PLATAFORMA;
        </li>
        <li>
          d) Pela resolução de todo e qualquer problema com negociação resultante
          de anúncio oriundo da PLATAFORMA;
        </li>
        <li>
          e) Pela manutenção da atualização de seus dados cadastrais (em especial:
          telefone e e-mail) e dados de pagamento (em especial o CPF para
          pagamento via Pix);
        </li>
        <li>
          f) Responder por quaisquer danos causados a terceiros, a outros USUÁRIOS,
          à PLATAFORMA ou ao próprio FAIXA ROSA, decorrentes do uso das
          funcionalidades da PLATAFORMA.
        </li>
      </ul>

      <p>
        7.2 <strong>Os USUÁRIOS não devem utilizar a PLATAFORMA para fins diversos
          daqueles estipulados neste instrumento, em especial:</strong>
      </p>

      <ul>
        <li>
          a) Utilizar a PLATAFORMA para a realização de atos ilícitos, imorais,
          que afrontem a moral e os bons costumes;
        </li>
        <li>
          b) Utilizar a PLATAFORMA para a promoção de conteúdos de cunho
          pornográfico ou sexual, bem como de conteúdos que incitem a prática de
          atos ilegais;
        </li>
        <li>
          c) Utilizar a PLATAFORMA para a promoção de conteúdos de violência,
          discriminação de qualquer natureza, preconceito, intolerância ou ódio;
        </li>
        <li>
          d) Utilizar a PLATAFORMA para promover a venda, distribuição ou
          divulgação de produtos ilegais ou proibidos pela legislação vigente;
        </li>
        <li>
          e) Utilizar a PLATAFORMA para coletar ou armazenar dados pessoais de
          outros USUÁRIOS ou VISITANTES, sem o seu consentimento expresso;
        </li>
        <li>
          f) Utilizar a PLATAFORMA para a prática de spam, envio de mensagens
          não solicitadas ou qualquer tipo de comunicação comercial não
          autorizada;
        </li>
        <li>
          g) Utilizar a PLATAFORMA para a prática de hacking, phishing, ataques de
          negação de serviço ou qualquer outra atividade relacionada a
          ciberataques;
        </li>
        <li>
          h) Utilizar a PLATAFORMA para falsificar identidade, adulterar
          documentos ou praticar qualquer tipo de fraude ou atividade ilegal;
        </li>
        <li>
          i) Utilizar a PLATAFORMA para criar, distribuir ou divulgar vírus,
          malware ou qualquer tipo de código malicioso;
        </li>
        <li>
          j) Utilizar a PLATAFORMA para interferir no funcionamento normal da
          mesma ou prejudicar sua segurança, integridade ou disponibilidade.
        </li>
      </ul>

      <h2>8. MERCADO PAGO</h2>

      <p>
        8.1 A funcionalidade Mercado Pago permite que ANUNCIANTES acompanhem suas
        operações financeiras realizadas na PLATAFORMA, incluindo aquisições de
        funcionalidades pagas e resgates de valores recebidos.
      </p>

      <p>
        8.2 As transações financeiras são processadas pelo Mercado Pago, que possui
        suas próprias políticas de privacidade e segurança.
      </p>

      <p>
        8.3 ANUNCIANTES que utilizarem a funcionalidade Mercado Pago declaram estar
        cientes e concordar com todas as condições e políticas do Mercado Pago.
      </p>

      <p>
        8.4 O FAIXA ROSA pode adotar medidas adicionais de segurança para autenticar
        as transações realizadas pelos ANUNCIANTES, com o objetivo de prevenir
        fraudes e garantir a integridade do sistema.
      </p>

      <p>
        8.5 Em caso de suspeita de atividade fraudulenta ou irregularidade nas
        transações financeiras, o FAIXA ROSA poderá suspender temporariamente a
        conta do ANUNCIANTE envolvido até que a situação seja esclarecida e
        resolvida.
      </p>

      <p>
        8.6 O FAIXA ROSA não se responsabiliza por eventuais problemas ou falhas no
        processamento das transações financeiras pelo Mercado Pago, exceto em
        casos de comprovada negligência ou conduta dolosa por parte da PLATAFORMA.
      </p>

      <p>
        8.7 <strong>Formas de Pagamento Aceitas:</strong>
      </p>
      <ul>
        <li>Pix</li>
        <li>
          Cartão de Crédito (Visa, Mastercard, American Express e outras bandeiras
          suportadas pelo Mercado Pago)
        </li>
      </ul>

      <p>
        8.8 O checkout próprio integrado ao Mercado Pago garante a segurança das
        transações financeiras, utilizando criptografia avançada e seguindo os
        padrões de segurança internacionais.
      </p>

      <h2>9. TRATAMENTO DOS DADOS</h2>

      <p>
        9.1 O tratamento dos dados pessoais dos USUÁRIOS pela PLATAFORMA será
        realizado em conformidade com a legislação aplicável, em especial a Lei
        Geral de Proteção de Dados (LGPD) e demais normas pertinentes.
      </p>

      <p>
        9.2 Os dados pessoais dos USUÁRIOS poderão ser compartilhados com
        empresas parceiras do FAIXA ROSA, para viabilizar a prestação dos serviços
        oferecidos pela PLATAFORMA, bem como para aprimorar a experiência do
        usuário.
      </p>

      <p>
        9.3 A PLATAFORMA adotará medidas técnicas e organizacionais adequadas para
        garantir a segurança e a privacidade dos dados dos USUÁRIOS, buscando
        minimizar os riscos de violação, vazamento ou uso indevido das informações.
      </p>

      <p>
        9.4 Sempre que possível, os dados pessoais dos USUÁRIOS serão
        pseudonimizados ou anonimizados, de modo a proteger sua identidade e
        privacidade, ressalvadas as hipóteses em que a identificação seja necessária
        para a execução dos serviços prestados pela PLATAFORMA.
      </p>

      <p>
        9.5 Os USUÁRIOS poderão exercer seus direitos de acesso, retificação,
        exclusão, portabilidade e oposição quanto aos seus dados pessoais, mediante
        solicitação à PLATAFORMA, nos termos da legislação vigente.
      </p>

      <p>
        9.6 O FAIXA ROSA poderá utilizar cookies e outras tecnologias de rastreamento
        para melhorar a experiência do usuário na PLATAFORMA, bem como para
        coletar informações sobre o uso e a navegação dos USUÁRIOS, de acordo com
        a Política de Cookies.
      </p>

      <div className="clausula-dados">
        <h3>Cláusula de Responsabilidade por Vazamento de Dados</h3>
        <p>
          Embora o <strong>Faixa Rosa</strong> adote rigorosas medidas de segurança
          para proteger os dados dos USUÁRIOS e ANUNCIANTES, todos os dados são
          hospedados na infraestrutura da Amazon S3, que também possui seus
          próprios protocolos de segurança. O <strong>Faixa Rosa</strong> não se
          responsabiliza por quaisquer vazamentos de dados que possam ocorrer
          devido a falhas na infraestrutura da Amazon S3 ou a ataques de
          terceiros fora do controle direto do <strong>Faixa Rosa</strong>.
        </p>
        <p>
          Os USUÁRIOS reconhecem e concordam que a segurança dos seus dados está
          sujeita às práticas e políticas de segurança da Amazon S3, e que o FAIXA ROSA
          envidará esforços razoáveis para garantir a proteção dos dados, mas não pode
          garantir a total prevenção de acessos não autorizados.
        </p>
      </div>

      <h2>10. DA LICENÇA DO USO DE IMAGEM</h2>

      <p>
        10.1 O USUÁRIO, ao aceitar este instrumento, autoriza expressamente o FAIXA ROSA
        a utilizar sua imagem nos anúncios veiculados na PLATAFORMA, seja em formato de
        fotografia ou vídeo, sem que isso implique em qualquer violação de seus direitos
        de imagem ou de personalidade.
      </p>

      <p>
        10.2 O FAIXA ROSA poderá utilizar tecnologias de reconhecimento facial para
        prevenir fraudes, autenticar a identidade dos USUÁRIOS e garantir a segurança
        da PLATAFORMA, mediante consentimento prévio e expresso dos usuários, nos
        termos da legislação aplicável.
      </p>

      <h2>11. POLÍTICA DE NOMES E PERFIL</h2>

      <p>
        11.1 Os USUÁRIOS deverão utilizar nomes verdadeiros e completos em seus
        perfis na PLATAFORMA, sendo vedado o uso de pseudônimos, apelidos ou nomes
        fictícios, exceto nos casos autorizados expressamente pelo FAIXA ROSA.
      </p>

      <p>
        11.2 O FAIXA ROSA se reserva o direito de suspender ou banir os USUÁRIOS que
        utilizarem nomes inadequados, ofensivos, impróprios ou que violem os direitos
        de terceiros, bem como os que pratiquem atos de falsidade ideológica ou
        representação fraudulenta.
      </p>

      <h2>12. DISPOSIÇÕES GERAIS</h2>

      <p>
        12.1 Este Termos de Uso constitui o acordo integral entre o USUÁRIO e o FAIXA ROSA,
        prevalecendo sobre quaisquer entendimentos anteriores ou contemporâneos, verbais
        ou escritos, sobre o mesmo objeto.
      </p>

      <p>
        12.2 A invalidade ou inexequibilidade de qualquer disposição deste instrumento não
        afetará a validade ou exequibilidade das demais disposições, que continuarão em
        pleno vigor e efeito.
      </p>

      <p>
        12.3 Este Termos de Uso será regido e interpretado de acordo com as leis brasileiras,
        sendo eleito o Foro da Comarca de São Paulo, Estado de São Paulo, como o único
        competente para dirimir quaisquer litígios decorrentes deste instrumento, com
        renúncia expressa a qualquer outro, por mais privilegiado que seja.
      </p>

      <p>
        12.4 O FAIXA ROSA poderá atualizar ou modificar este Termos de Uso a qualquer
        momento, mediante aviso prévio aos USUÁRIOS, por meio da PLATAFORMA ou por
        outros meios de comunicação disponibilizados pela PLATAFORMA, cabendo aos
        USUÁRIOS verificar periodicamente as alterações realizadas.
      </p>

      <p>
        12.5 A continuidade do uso da PLATAFORMA pelos USUÁRIOS após a entrada em
        vigor das alterações deste Termos de Uso implicará na aceitação tácita dos novos
        termos e condições, vinculando as partes da mesma forma que se houvessem sido
        assinados.
      </p>



      <h2>5. Banco de Dados</h2>

      <p>
        5.1 O ASSINANTE se declara ciente de que, a partir da contratação da assinatura
        de um Produto/Serviço, o mesmo passa a fazer parte do banco de dados do
        FAIXA ROSA, por meio do qual poderá vir a receber informações do FAIXA ROSA.
        Caso o ASSINANTE não tenha o interesse em receber essas informações, fica
        assegurado ao mesmo o direito de manifestar sua oposição, bastando que tal
        decisão seja comunicada ao Serviço de Atendimento ao Cliente do FAIXA ROSA.
      </p>

      <p>
        5.2 A inviolabilidade e o sigilo dos dados cadastrais de todos os seus
        ASSINANTES são assegurados pelo FAIXA ROSA. Todas as suas informações são
        armazenadas dentro dos mais rígidos critérios de segurança no banco de dados
        do FAIXA ROSA e são tratadas de acordo com a legislação aplicável e com os
        termos de uso da PLATAFORMA, cláusula 10. Em nenhuma hipótese são fornecidas
        informações pessoais para terceiros não relacionados à prestação dos serviços,
        objeto do presente instrumento, salvo mediante autorização do ASSINANTE.
      </p>

      <h2>6. Serviço de Atendimento ao ASSINANTE</h2>

      <p>
        6.1 O FAIXA ROSA disponibiliza ao ASSINANTE Serviço de Atendimento através do
        e-mail{" "}
        <a href="mailto:contato@faixarosa.com.br">
          contato@faixarosa.com.br
        </a>
        .
      </p>

      <h2>7. Prazo</h2>

      <p>
        7.1 Este instrumento é celebrado pelo prazo de até 30 dias, conforme opção
        do ASSINANTE no site do FAIXA ROSA, sendo prorrogado por períodos iguais, por
        meio da renovação facilitada, conforme procedimento previsto no próximo item.
      </p>

      <h2>8. Procedimento de Renovação</h2>

      <p>
        8.1 O FAIXA ROSA adota o procedimento de renovação programada da assinatura,
        dirigido exclusivamente ao ASSINANTE, assegurando facilidade e agilidade na
        renovação.
      </p>

      <p>
        8.2 Se acaso não for do interesse do ASSINANTE a renovação de sua assinatura,
        basta que o mesmo responda ou entre em contato com o Serviço de Atendimento ao
        Cliente do FAIXA ROSA através do e-mail{" "}
        <a href="mailto:contato@faixarosa.com.br">
          contato@faixarosa.com.br
        </a>
        .
      </p>

      <h2>9. Cancelamento</h2>

      <p>
        9.1 O FAIXA ROSA assegura ao ASSINANTE a possibilidade de cancelamento do
        presente instrumento a qualquer tempo, mediante aviso prévio por parte do
        ASSINANTE, e respeitando o previsto nos Termos de Uso da PLATAFORMA.
      </p>

      <h2>10. Rescisão</h2>

      <p>
        10.1 A assinatura poderá ser cancelada e o presente instrumento rescindido na
        hipótese de infração contratual, caso a parte infratora não corrija o
        inadimplemento após notificação.
      </p>

      <p>
        10.2 Caso o ASSINANTE não pague o valor devido no prazo estipulado em
        notificação a ser enviada pelo FAIXA ROSA, o presente instrumento poderá ser
        rescindido com a imediata suspensão da entrega dos Produtos/Serviços.
      </p>

      <h2>11. Alterações dos Termos e Condições</h2>

      <p>
        11.1 Quaisquer alterações que impactem em ônus financeiro ao ASSINANTE
        serão feitas mediante comunicação prévia ao mesmo, que poderá manifestar sua
        concordância por qualquer meio disponível, renegociar tais alterações ou
        qualquer das partes poderá denunciá-lo caso não cheguem a um acordo.
      </p>

      <h2>12. Foro</h2>

      <p>
        12.1 Fica assegurado ao ASSINANTE o direito, caso necessário, de recorrer ao Foro
        da Comarca de São Paulo/SP, para quaisquer dúvidas e questões oriundas deste
        instrumento.
      </p>




      {/* Exemplo de Cláusula Destacada */}
      <div className="bg-pink-50 p-4 border-l-4 border-pink-600 mt-6 rounded">
        <h3 className="text-lg font-bold text-pink-600 mb-2">
          Cláusula de Responsabilidade por Vazamento de Dados
        </h3>
        <p>
          Embora o FAIXA ROSA adote rigorosas medidas de segurança para proteger os
          dados dos ANUNCIANTES, todos os dados são hospedados na infraestrutura da
          Amazon S3, que também possui seus próprios protocolos de segurança. O
          FAIXA ROSA não se responsabiliza por quaisquer vazamentos de dados que
          possam ocorrer devido a falhas na infraestrutura da S3 ou a ataques de
          terceiros fora do controle direto do FAIXA ROSA.
        </p>
        <p>
          Os ANUNCIANTES reconhecem e concordam que a segurança dos seus dados está
          sujeita às práticas e políticas de segurança da Amazon S3, e que o FAIXA ROSA
          envidará esforços razoáveis para garantir a proteção dos dados, mas não pode
          garantir a total prevenção de acessos não autorizados.
        </p>
      </div>
    </div>
  );

  return (

    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          <Navbar />

          Termos de Uso e Serviços
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Você é Anunciante ou Usuário?
        </p>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            className={`px-6 py-2 rounded-full font-semibold transition 
              ${activeTab === "usuarios"
                ? "bg-pink-600 text-white transform scale-105"
                : "bg-white text-pink-600 border border-pink-600 hover:bg-pink-50"
              }`}
            onClick={() => setActiveTab("usuarios")}
          >
            Usuários
          </button>
          <button
            className={`px-6 py-2 rounded-full font-semibold transition 
              ${activeTab === "anunciantes"
                ? "bg-pink-600 text-white transform scale-105"
                : "bg-white text-pink-600 border border-pink-600 hover:bg-pink-50"
              }`}
            onClick={() => setActiveTab("anunciantes")}
          >
            Anunciantes
          </button>
        </div>

        {/* Seção de Usuários */}
        {activeTab === "usuarios" && userContent}

        {/* Seção de Anunciantes */}
        {activeTab === "anunciantes" && advertiserContent}
      </main>

      {/* Footer (Opcional) */}
      <footer className="bg-white shadow-inner py-4">
        <p className="text-center text-gray-600">
          &copy; {new Date().getFullYear()} Faixa Rosa. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
