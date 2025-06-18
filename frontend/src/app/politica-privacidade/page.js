'use client'

import { useState } from "react";
import { motion } from 'framer-motion';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Home/footer";

export default function PoliticaPrivacidade() {
  const [activeSection, setActiveSection] = useState("geral");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const sections = [
    { id: "geral", label: "Informações Gerais" },
    { id: "coleta", label: "Coleta de Dados" },
    { id: "uso", label: "Uso dos Dados" },
    { id: "compartilhamento", label: "Compartilhamento" },
    { id: "seguranca", label: "Segurança" },
    { id: "direitos", label: "Seus Direitos" },
    { id: "cookies", label: "Cookies" },
    { id: "contato", label: "Contato" }
  ];

  const contentStyle = {
    padding: '32px',
    borderRadius: '16px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f3f4f6'
  };

  const renderContent = () => {
    switch (activeSection) {
      case "geral":
        return (
          <motion.div style={contentStyle} variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-pink-600 pb-4">
              Informações Gerais sobre Privacidade
            </h2>

            <div className="space-y-6">
              <div className="bg-pink-50 p-6 rounded-lg border-l-4 border-pink-600">
                <h3 className="text-xl font-semibold text-pink-700 mb-3">
                  Compromisso com sua Privacidade
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  A <strong>TMF Technology Company Conteúdos na Internet LTDA</strong>, 
                  responsável pela plataforma <strong>Faixa Rosa</strong>, está comprometida 
                  com a proteção da privacidade e dos dados pessoais de todos os seus usuários, 
                  em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-pink-600 rounded-full mr-3"></span>
                    Empresa Responsável
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Razão Social:</strong> TMF Technology Company Conteúdos na Internet LTDA</p>
                    <p><strong>CNPJ:</strong> 53.839.625/0001-08</p>
                    <p><strong>Endereço:</strong> Avenida Brig. Faria Lima, 1811, Jardim Paulistano, São Paulo, CEP 01452-001</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-pink-600 rounded-full mr-3"></span>
                    Canais de Contato
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>E-mail DPO:</strong> contato@faixarosa.com</p>
                    <p><strong>Site:</strong> www.faixarosa.com</p>
                    <p><strong>Prazo de Resposta:</strong> Até 15 dias úteis</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Escopo desta Política
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Esta Política de Privacidade se aplica a todos os usuários da plataforma Faixa Rosa, incluindo:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Visitantes:</strong> Usuários que acessam o site sem cadastro</li>
                  <li><strong>Usuários Cadastrados:</strong> Pessoas físicas que criam conta na plataforma</li>
                  <li><strong>Usuários Premium:</strong> Assinantes do plano premium</li>
                  <li><strong>Anunciantes:</strong> Profissionais que publicam anúncios</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  ⚠️ Importante: Restrição de Idade
                </h4>
                <p className="text-yellow-700">
                  Nossa plataforma destina-se exclusivamente a <strong>maiores de 18 anos</strong> e 
                  contém conteúdo adulto. Não coletamos intencionalmente dados de menores de idade.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case "coleta":
        return (
          <motion.div style={contentStyle} variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-pink-600 pb-4">
              Coleta de Dados Pessoais
            </h2>

            <div className="space-y-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">
                  Tipos de Dados Coletados
                </h3>
                <p className="text-blue-700 mb-4">
                  Coletamos diferentes tipos de dados conforme o seu perfil de usuário e as funcionalidades utilizadas:
                </p>
              </div>

              <div className="grid gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                    Visitantes (Sem Cadastro)
                  </h4>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Endereço IP e localização aproximada</li>
                    <li>Dados de navegação (páginas visitadas, tempo de permanência)</li>
                    <li>Informações do dispositivo (tipo, sistema operacional, navegador)</li>
                    <li>Cookies técnicos e de análise</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                    Usuários Cadastrados
                  </h4>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>E-mail para identificação e comunicação</li>
                    <li>Data de nascimento para verificação de maioridade</li>
                    <li>Histórico de atividades na plataforma</li>
                    <li>Preferências e configurações de conta</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                    Anunciantes
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Dados de Identificação:</h5>
                      <ul className="list-disc pl-4 text-gray-700 text-sm space-y-1">
                        <li>Nome completo e filiação</li>
                        <li>CPF</li>
                        <li>Documento de identidade (frente e verso)</li>
                        <li>Vídeo de apresentação</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Dados de Contato:</h5>
                      <ul className="list-disc pl-4 text-gray-700 text-sm space-y-1">
                        <li>Número de telefone móvel</li>
                        <li>E-mail</li>
                        <li>Dados de atendimento</li>
                        <li>Localidades de atuação</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-pink-500 rounded-full mr-3"></span>
                    Assinantes Premium
                  </h4>
                  <p className="text-gray-700 mb-3">Além dos dados de anunciantes, coletamos:</p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Dados de pagamento (processados pelo Mercado Pago)</li>
                    <li>Histórico de transações</li>
                    <li>Informações de faturamento</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Como Coletamos os Dados
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-pink-600 font-bold text-lg">1</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Fornecimento Direto</h4>
                    <p className="text-sm text-gray-600">Quando você se cadastra ou preenche formulários</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-pink-600 font-bold text-lg">2</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Coleta Automática</h4>
                    <p className="text-sm text-gray-600">Durante a navegação e uso da plataforma</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-pink-600 font-bold text-lg">3</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Terceiros</h4>
                    <p className="text-sm text-gray-600">Parceiros como Mercado Pago para pagamentos</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "uso":
        return (
          <motion.div style={contentStyle} variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-pink-600 pb-4">
              Como Utilizamos seus Dados
            </h2>

            <div className="space-y-8">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-4">
                  Bases Legais para o Tratamento
                </h3>
                <p className="text-green-700 mb-4">
                  Tratamos seus dados pessoais com base nas seguintes bases legais previstas na LGPD:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-green-800 mb-2">Execução de Contrato</h4>
                    <p className="text-sm text-gray-700">Para prestação dos serviços da plataforma</p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-green-800 mb-2">Legítimo Interesse</h4>
                    <p className="text-sm text-gray-700">Segurança, prevenção de fraudes e melhorias</p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-green-800 mb-2">Consentimento</h4>
                    <p className="text-sm text-gray-700">Marketing e comunicações promocionais</p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-green-800 mb-2">Obrigação Legal</h4>
                    <p className="text-sm text-gray-700">Cumprimento de determinações legais</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Finalidades do Tratamento de Dados
                </h3>

                <div className="grid gap-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      🔐 Segurança e Autenticação
                    </h4>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Verificação de identidade e autenticação de usuários</li>
                      <li>Prevenção de fraudes e atividades suspeitas</li>
                      <li>Detecção de múltiplos cadastros</li>
                      <li>Verificação de maioridade (18+ anos)</li>
                      <li>Monitoramento de segurança da plataforma</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      ⚙️ Funcionamento da Plataforma
                    </h4>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Criação e gerenciamento de contas de usuário</li>
                      <li>Disponibilização de funcionalidades e serviços</li>
                      <li>Processamento de anúncios e publicações</li>
                      <li>Sistema de avaliações e reviews</li>
                      <li>Atendimento ao cliente e suporte técnico</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-green-500 pl-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      💳 Transações e Pagamentos
                    </h4>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Processamento de pagamentos via Mercado Pago</li>
                      <li>Gestão de assinaturas e planos</li>
                      <li>Emissão de comprovantes e faturas</li>
                      <li>Controle de inadimplência</li>
                      <li>Análise de risco em transações</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      📊 Análise e Melhorias
                    </h4>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Análise de uso e comportamento na plataforma</li>
                      <li>Desenvolvimento de novos recursos</li>
                      <li>Otimização da experiência do usuário</li>
                      <li>Pesquisas de satisfação</li>
                      <li>Estatísticas agregadas e anonimizadas</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-pink-500 pl-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      📧 Comunicação e Marketing
                    </h4>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Envio de notificações sobre a conta</li>
                      <li>Comunicações transacionais importantes</li>
                      <li>E-mails promocionais (com consentimento)</li>
                      <li>Atualizações de produtos e serviços</li>
                      <li>Pesquisas de feedback</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h4 className="text-lg font-semibold text-yellow-800 mb-3">
                  ⏱️ Tempo de Retenção dos Dados
                </h4>
                <p className="text-yellow-700 mb-3">
                  Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades 
                  para as quais foram coletados, respeitando os seguintes critérios:
                </p>
                <ul className="list-disc pl-6 text-yellow-700 space-y-1">
                  <li><strong>Usuários ativos:</strong> Durante a vigência da conta</li>
                  <li><strong>Dados de pagamento:</strong> 5 anos após a última transação</li>
                  <li><strong>Obrigações legais:</strong> Conforme determinado por lei</li>
                  <li><strong>Dados anonimizados:</strong> Podem ser mantidos indefinidamente</li>
                </ul>
              </div>
            </div>
          </motion.div>
        );

      case "compartilhamento":
        return (
          <motion.div style={contentStyle} variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-pink-600 pb-4">
              Compartilhamento de Dados
            </h2>

            <div className="space-y-8">
              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h3 className="text-xl font-semibold text-red-800 mb-4">
                  🚫 Política de Não Venda
                </h3>
                <p className="text-red-700 font-medium">
                  <strong>Nunca vendemos seus dados pessoais</strong> para terceiros. Seus dados são 
                  compartilhados apenas nas situações específicas descritas abaixo, sempre com 
                  base legal adequada.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Situações de Compartilhamento Autorizado
                </h3>

                <div className="grid gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        💳
                      </span>
                      Parceiros de Pagamento
                    </h4>
                    <div className="pl-11">
                      <p className="text-gray-700 mb-3">
                        <strong>Mercado Pago:</strong> Para processamento seguro de pagamentos
                      </p>
                      <ul className="list-disc pl-6 text-gray-600 text-sm space-y-1">
                        <li>Dados necessários para transações (nome, CPF, e-mail)</li>
                        <li>Informações de pagamento criptografadas</li>
                        <li>Histórico de transações para controle antifraude</li>
                        <li>Sujeito às políticas de privacidade do Mercado Pago</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        ☁️
                      </span>
                      Provedores de Infraestrutura
                    </h4>
                    <div className="pl-11">
                      <p className="text-gray-700 mb-3">
                        <strong>Wasabi Hot Cloud Storage:</strong> Para armazenamento seguro de dados
                      </p>
                      <ul className="list-disc pl-6 text-gray-600 text-sm space-y-1">
                        <li>Todos os dados são criptografados antes do armazenamento</li>
                        <li>Acesso restrito apenas para operações autorizadas</li>
                        <li>Backup e recuperação de dados</li>
                        <li>Conformidade com padrões internacionais de segurança</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-orange-600 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                        ⚖️
                      </span>
                      Autoridades Legais
                    </h4>
                    <div className="pl-11">
                      <p className="text-gray-700 mb-3">
                        Quando exigido por lei ou ordem judicial:
                      </p>
                      <ul className="list-disc pl-6 text-gray-600 text-sm space-y-1">
                        <li>Cumprimento de decisões judiciais</li>
                        <li>Investigações criminais ou administrativas</li>
                        <li>Proteção de direitos e segurança</li>
                        <li>Prevenção de atividades ilegais</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                  ⚠️ Cláusula de Responsabilidade - Infraestrutura de Terceiros
                </h3>
                <div className="space-y-4">
                  <p className="text-yellow-700">
                    Embora implementemos rigorosas medidas de segurança, nossos dados são 
                    armazenados na infraestrutura do <strong>Wasabi Hot Cloud Storage</strong>, 
                    que possui seus próprios protocolos de segurança.
                  </p>
                  <div className="bg-white p-4 rounded border border-yellow-300">
                    <h4 className="font-semibold text-yellow-800 mb-2">Importante:</h4>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• O Faixa Rosa não se responsabiliza por falhas na infraestrutura do Wasabi</li>
                      <li>• Ataques externos fora do nosso controle direto</li>
                      <li>• Envidamos esforços razoáveis para proteção dos dados</li>
                      <li>• Não podemos garantir 100% de prevenção contra acessos não autorizados</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "seguranca":
        return (
          <motion.div style={contentStyle} variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-pink-600 pb-4">
              Segurança dos Dados
            </h2>

            <div className="space-y-8">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-xl font-semibold text-green-800 mb-4">
                  🛡️ Nosso Compromisso com a Segurança
                </h3>
                <p className="text-green-700">
                  Implementamos medidas técnicas e organizacionais rigorosas para proteger seus 
                  dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição, 
                  seguindo as melhores práticas de segurança da informação.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Medidas de Segurança Implementadas
                </h3>

                <div className="grid gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        🔐
                      </span>
                      Criptografia Avançada
                    </h4>
                    <div className="pl-11 space-y-3">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded">
                          <h5 className="font-semibold text-gray-800 mb-2">Dados em Trânsito</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Protocolo HTTPS/TLS 1.3</li>
                            <li>• Certificados SSL atualizados</li>
                            <li>• Criptografia ponta a ponta</li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 p-4 rounded">
                          <h5 className="font-semibold text-gray-800 mb-2">Dados em Repouso</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Criptografia AES-256</li>
                            <li>• Chaves gerenciadas separadamente</li>
                            <li>• Backup criptografado</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-purple-600 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        👤
                      </span>
                      Controle de Acesso
                    </h4>
                    <div className="pl-11 space-y-3">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <span className="text-purple-600 font-bold">2FA</span>
                          </div>
                          <h5 className="font-semibold text-gray-800 mb-1">Autenticação Dupla</h5>
                          <p className="text-xs text-gray-600">Para contas administrativas</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <span className="text-purple-600 font-bold">IAM</span>
                          </div>
                          <h5 className="font-semibold text-gray-800 mb-1">Gestão de Identidade</h5>
                          <p className="text-xs text-gray-600">Controle granular</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <span className="text-purple-600 font-bold">LOG</span>
                          </div>
                          <h5 className="font-semibold text-gray-800 mb-1">Auditoria Completa</h5>
                          <p className="text-xs text-gray-600">Todos os acessos</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        🔍
                      </span>
                      Monitoramento e Detecção
                    </h4>
                    <div className="pl-11">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">Monitoramento 24/7</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Detecção de anomalias em tempo real</li>
                            <li>• Alertas automáticos de segurança</li>
                            <li>• Análise comportamental de usuários</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">Prevenção de Fraudes</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Verificação de identidade facial</li>
                            <li>• Análise de documentos automatizada</li>
                            <li>• Detecção de múltiplos cadastros</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">
                  📋 Certificações e Conformidade
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold">LGPD</span>
                    </div>
                    <h4 className="font-semibold text-blue-800">Lei Geral de Proteção de Dados</h4>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold">ISO</span>
                    </div>
                    <h4 className="font-semibold text-blue-800">Padrões Internacionais</h4>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold">PCI</span>
                    </div>
                    <h4 className="font-semibold text-blue-800">Segurança de Pagamentos</h4>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "direitos":
        return (
          <motion.div style={contentStyle} variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-pink-600 pb-4">
              Seus Direitos como Titular de Dados
            </h2>

            <div className="space-y-8">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">
                  📋 Direitos Garantidos pela LGPD
                </h3>
                <p className="text-blue-700">
                  Como titular de dados pessoais, você possui direitos fundamentais garantidos 
                  pela Lei Geral de Proteção de Dados. Estamos comprometidos em facilitar o 
                  exercício desses direitos de forma simples e eficiente.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      👁️
                    </span>
                    Direito de Acesso
                  </h4>
                  <div className="pl-11 space-y-3">
                    <p className="text-gray-700">
                      Você pode solicitar uma cópia completa dos seus dados pessoais que tratamos.
                    </p>
                    <div className="bg-green-50 p-4 rounded border">
                      <h5 className="font-semibold text-green-800 mb-2">O que você receberá:</h5>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Lista completa dos dados pessoais tratados</li>
                        <li>• Finalidades do tratamento</li>
                        <li>• Categorias de dados coletados</li>
                        <li>• Informações sobre compartilhamento</li>
                        <li>• Período de retenção dos dados</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      ✏️
                    </span>
                    Direito de Correção
                  </h4>
                  <div className="pl-11 space-y-3">
                    <p className="text-gray-700">
                      Solicite a correção de dados incompletos, inexatos ou desatualizados.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded">
                        <h6 className="font-semibold text-blue-800 text-sm mb-1">Correções Automáticas</h6>
                        <p className="text-xs text-blue-700">Dados básicos do perfil podem ser atualizados diretamente na plataforma</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <h6 className="font-semibold text-blue-800 text-sm mb-1">Correções via Suporte</h6>
                        <p className="text-xs text-blue-700">Dados sensíveis requerem verificação da nossa equipe</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      🗑️
                    </span>
                    Direito de Exclusão
                  </h4>
                  <div className="pl-11 space-y-3">
                    <p className="text-gray-700">
                      Solicite a exclusão dos seus dados pessoais quando não forem mais necessários.
                    </p>
                    <div className="bg-red-50 p-4 rounded border border-red-200">
                      <h5 className="font-semibold text-red-800 mb-2">⚠️ Limitações Legais:</h5>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• Dados necessários para cumprimento de obrigações legais</li>
                        <li>• Informações em processos judiciais em andamento</li>
                        <li>• Dados históricos para fins de auditoria</li>
                        <li>• Exercício regular de direitos em processo judicial</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-purple-600 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      📦
                    </span>
                    Direito de Portabilidade
                  </h4>
                  <div className="pl-11 space-y-3">
                    <p className="text-gray-700">
                      Receba seus dados em formato estruturado e de uso comum.
                    </p>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="text-center bg-purple-50 p-3 rounded">
                        <div className="w-8 h-8 bg-purple-100 rounded mx-auto mb-2 flex items-center justify-center">
                          <span className="text-purple-600 text-xs font-bold">JSON</span>
                        </div>
                        <p className="text-xs text-purple-700">Formato estruturado</p>
                      </div>
                      <div className="text-center bg-purple-50 p-3 rounded">
                        <div className="w-8 h-8 bg-purple-100 rounded mx-auto mb-2 flex items-center justify-center">
                          <span className="text-purple-600 text-xs font-bold">CSV</span>
                        </div>
                        <p className="text-xs text-purple-700">Planilha compatível</p>
                      </div>
                      <div className="text-center bg-purple-50 p-3 rounded">
                        <div className="w-8 h-8 bg-purple-100 rounded mx-auto mb-2 flex items-center justify-center">
                          <span className="text-purple-600 text-xs font-bold">PDF</span>
                        </div>
                        <p className="text-xs text-purple-700">Relatório legível</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  📞 Como Exercer seus Direitos
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Canais de Atendimento:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-xs">✉</span>
                        </span>
                        <span className="text-gray-700">contato@faixarosa.com</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs">⚙</span>
                        </span>
                        <span className="text-gray-700">Configurações da conta</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Informações Necessárias:</h4>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                      <li>Nome completo</li>
                      <li>E-mail cadastrado</li>
                      <li>Tipo de solicitação</li>
                      <li>Descrição detalhada do pedido</li>
                      <li>Documento de identificação (se necessário)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                  ⏰ Prazos de Atendimento
                </h3>
                <div className="grid md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <span className="text-yellow-600 font-bold text-sm">24h</span>
                    </div>
                    <h5 className="font-semibold text-yellow-800 text-sm">Confirmação</h5>
                    <p className="text-xs text-yellow-700">Recebimento da solicitação</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <span className="text-yellow-600 font-bold text-sm">72h</span>
                    </div>
                    <h5 className="font-semibold text-yellow-800 text-sm">Análise</h5>
                    <p className="text-xs text-yellow-700">Verificação da solicitação</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <span className="text-yellow-600 font-bold text-sm">15d</span>
                    </div>
                    <h5 className="font-semibold text-yellow-800 text-sm">Resposta</h5>
                    <p className="text-xs text-yellow-700">Atendimento completo</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <span className="text-yellow-600 font-bold text-sm">+15d</span>
                    </div>
                    <h5 className="font-semibold text-yellow-800 text-sm">Complexas</h5>
                    <p className="text-xs text-yellow-700">Casos especiais</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "cookies":
        return (
          <motion.div style={contentStyle} variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-pink-600 pb-4">
              Política de Cookies
            </h2>

            <div className="space-y-8">
              <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                <h3 className="text-xl font-semibold text-amber-800 mb-4">
                  🍪 O que são Cookies?
                </h3>
                <p className="text-amber-700 mb-3">
                  Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando 
                  você visita nosso site. Eles nos ajudam a melhorar sua experiência, personalizar 
                  conteúdo e analisar como nosso site é usado.
                </p>
                <div className="bg-white p-4 rounded border border-amber-300">
                  <p className="text-amber-800 text-sm">
                    <strong>Transparência:</strong> Utilizamos cookies apenas para finalidades 
                    legítimas e sempre respeitando sua privacidade.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Tipos de Cookies Utilizados
                </h3>

                <div className="grid gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        ⚡
                      </span>
                      Cookies Essenciais (Necessários)
                    </h4>
                    <div className="pl-11 space-y-3">
                      <p className="text-gray-700">
                        Indispensáveis para o funcionamento básico do site. Não podem ser desabilitados.
                      </p>
                      <div className="bg-green-50 p-4 rounded border">
                        <h5 className="font-semibold text-green-800 mb-2">Finalidades:</h5>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• Manter você logado durante a sessão</li>
                          <li>• Lembrar suas preferências de idioma</li>
                          <li>• Garantir a segurança da navegação</li>
                          <li>• Funcionalidades do carrinho de compras</li>
                          <li>• Prevenção de ataques CSRF</li>
                        </ul>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded">
                          <h6 className="font-semibold text-gray-800 text-sm">Duração</h6>
                          <p className="text-xs text-gray-600">Sessão ou até 30 dias</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <h6 className="font-semibold text-gray-800 text-sm">Base Legal</h6>
                          <p className="text-xs text-gray-600">Legítimo interesse</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        📊
                      </span>
                      Cookies de Análise e Performance
                    </h4>
                    <div className="pl-11 space-y-3">
                      <p className="text-gray-700">
                        Coletam informações sobre como você usa nosso site para melhorarmos a experiência.
                      </p>
                      <div className="bg-blue-50 p-4 rounded border">
                        <h5 className="font-semibold text-blue-800 mb-2">Ferramentas Utilizadas:</h5>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h6 className="font-medium text-blue-800 text-sm mb-1">Google Analytics</h6>
                            <ul className="text-xs text-blue-700 space-y-1">
                              <li>• Páginas mais visitadas</li>
                              <li>• Tempo de permanência</li>
                              <li>• Taxa de rejeição</li>
                              <li>• Dados demográficos anônimos</li>
                            </ul>
                          </div>
                          <div>
                            <h6 className="font-medium text-blue-800 text-sm mb-1">Hotjar (Opcional)</h6>
                            <ul className="text-xs text-blue-700 space-y-1">
                              <li>• Mapas de calor</li>
                              <li>• Gravações de sessão</li>
                              <li>• Feedback dos usuários</li>
                              <li>• Análise de usabilidade</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                        <p className="text-yellow-800 text-sm">
                          <strong>Seu Controle:</strong> Você pode desabilitar estes cookies nas 
                          configurações do seu navegador ou através do nosso banner de cookies.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-purple-600 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        🎯
                      </span>
                      Cookies de Marketing e Publicidade
                    </h4>
                    <div className="pl-11 space-y-3">
                      <p className="text-gray-700">
                        Personalizam anúncios e conteúdo com base nos seus interesses e comportamento.
                      </p>
                      <div className="bg-purple-50 p-4 rounded border">
                        <h5 className="font-semibold text-purple-800 mb-2">Funcionalidades:</h5>
                        <ul className="text-sm text-purple-700 space-y-1">
                          <li>• Anúncios personalizados no Google e Facebook</li>
                          <li>• Remarketing para visitantes anteriores</li>
                          <li>• Medição da eficácia de campanhas</li>
                          <li>• Conteúdo relevante baseado no perfil</li>
                        </ul>
                      </div>
                      <div className="bg-red-50 p-3 rounded border border-red-200">
                        <p className="text-red-800 text-sm">
                          <strong>Requer Consentimento:</strong> Estes cookies só são ativados 
                          com sua permissão explícita.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-orange-600 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                        ⚙️
                      </span>
                      Cookies de Funcionalidade
                    </h4>
                    <div className="pl-11 space-y-3">
                      <p className="text-gray-700">
                        Lembram suas escolhas e preferências para personalizar sua experiência.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-orange-50 p-3 rounded">
                          <h6 className="font-semibold text-orange-800 text-sm mb-2">Preferências</h6>
                          <ul className="text-xs text-orange-700 space-y-1">
                            <li>• Tema claro/escuro</li>
                            <li>• Configurações de layout</li>
                            <li>• Filtros de pesquisa</li>
                          </ul>
                        </div>
                        <div className="bg-orange-50 p-3 rounded">
                          <h6 className="font-semibold text-orange-800 text-sm mb-2">Personalização</h6>
                          <ul className="text-xs text-orange-700 space-y-1">
                            <li>• Localização preferida</li>
                            <li>• Configurações de notificação</li>
                            <li>• Histórico de visualizações</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  🔧 Gerenciamento de Cookies
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Através do nosso site:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-xs">🍪</span>
                        </span>
                        <span className="text-gray-700 text-sm">Banner de consentimento na primeira visita</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs">⚙</span>
                        </span>
                        <span className="text-gray-700 text-sm">Central de preferências de cookies</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 text-xs">🔄</span>
                        </span>
                        <span className="text-gray-700 text-sm">Alterar preferências a qualquer momento</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Através do navegador:</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Chrome:</span>
                        <span className="text-gray-600 ml-2">Configurações → Privacidade → Cookies</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Firefox:</span>
                        <span className="text-gray-600 ml-2">Preferências → Privacidade → Cookies</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Safari:</span>
                        <span className="text-gray-600 ml-2">Preferências → Privacidade → Cookies</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Edge:</span>
                        <span className="text-gray-600 ml-2">Configurações → Privacidade → Cookies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                  ⚠️ Consequências de Desabilitar Cookies
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-red-600 font-bold">❌</span>
                    </div>
                    <h4 className="font-semibold text-yellow-800 text-sm mb-2">Cookies Essenciais</h4>
                    <p className="text-xs text-yellow-700">Site pode não funcionar corretamente</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-orange-600 font-bold">📊</span>
                    </div>
                    <h4 className="font-semibold text-yellow-800 text-sm mb-2">Cookies de Análise</h4>
                    <p className="text-xs text-yellow-700">Perdemos insights para melhorias</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">🎯</span>
                    </div>
                    <h4 className="font-semibold text-yellow-800 text-sm mb-2">Cookies de Marketing</h4>
                    <p className="text-xs text-yellow-700">Anúncios menos relevantes</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "contato":
        return (
          <motion.div style={contentStyle} variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-pink-600 pb-4">
              Entre em Contato - DPO e Privacidade
            </h2>

            <div className="space-y-8">
              <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
                <h3 className="text-xl font-semibold text-pink-800 mb-4">
                  📞 Estamos Aqui para Ajudar
                </h3>
                <p className="text-pink-700">
                  Tem dúvidas sobre esta Política de Privacidade, quer exercer seus direitos como 
                  titular de dados ou precisa reportar algum problema relacionado à proteção de dados? 
                  Nossa equipe de privacidade está pronta para atendê-lo.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        👤
                      </span>
                      Encarregado de Dados (DPO)
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-semibold text-gray-800 text-sm">E-mail Oficial:</h5>
                        <a href="mailto:contato@faixarosa.com" 
                           className="text-blue-600 hover:text-blue-800 transition-colors">
                          contato@faixarosa.com
                        </a>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-800 text-sm">Prazo de Resposta:</h5>
                        <p className="text-gray-600 text-sm">Até 15 dias úteis</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-800 text-sm">Horário de Atendimento:</h5>
                        <p className="text-gray-600 text-sm">Segunda a Sexta, 9h às 18h</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        🏢
                      </span>
                      Dados da Empresa
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold text-gray-800">Razão Social:</span>
                        <p className="text-gray-600">TMF Technology Company Conteúdos na Internet LTDA</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">CNPJ:</span>
                        <p className="text-gray-600">53.839.625/0001-08</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">Endereço:</span>
                        <p className="text-gray-600">
                          Avenida Brig. Faria Lima, 1811<br/>
                          Jardim Paulistano, São Paulo - SP<br/>
                          CEP: 01452-001
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-purple-600 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        📝
                      </span>
                      Tipos de Solicitação
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded">
                        <h5 className="font-semibold text-gray-800 text-sm mb-1">Exercício de Direitos</h5>
                        <p className="text-gray-600 text-xs">Acesso, correção, exclusão, portabilidade, oposição</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <h5 className="font-semibold text-gray-800 text-sm mb-1">Dúvidas sobre Privacidade</h5>
                        <p className="text-gray-600 text-xs">Esclarecimentos sobre nossa política</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <h5 className="font-semibold text-gray-800 text-sm mb-1">Incidentes de Segurança</h5>
                        <p className="text-gray-600 text-xs">Reportar possíveis vazamentos ou problemas</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <h5 className="font-semibold text-gray-800 text-sm mb-1">Denúncias</h5>
                        <p className="text-gray-600 text-xs">Violações da LGPD ou desta política</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-orange-600 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                        📋
                      </span>
                      Informações para Contato
                    </h4>
                    <div className="bg-orange-50 p-4 rounded">
                      <p className="text-orange-800 text-sm mb-3">
                        <strong>Para agilizar seu atendimento, inclua:</strong>
                      </p>
                      <ul className="text-orange-700 text-sm space-y-1">
                        <li>• Nome completo</li>
                        <li>• E-mail cadastrado na plataforma</li>
                        <li>• Tipo de solicitação</li>
                        <li>• Descrição detalhada da solicitação</li>
                        <li>• Documento de identificação (se necessário)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">
                  🏛️ Órgãos Reguladores
                </h3>
                <p className="text-blue-700 mb-4">
                  Caso não fique satisfeito com nossa resposta, você pode contatar as autoridades competentes:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-blue-800 mb-2">ANPD - Autoridade Nacional</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p><strong>Site:</strong> gov.br/anpd</p>
                      <p><strong>E-mail:</strong> comunicacao@anpd.gov.br</p>
                      <p><strong>Telefone:</strong> 0800-735-2196</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-blue-800 mb-2">Procon - São Paulo</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p><strong>Site:</strong> procon.sp.gov.br</p>
                      <p><strong>Telefone:</strong> 151</p>
                      <p><strong>Presencial:</strong> Unidades Procon-SP</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  💚 Obrigado por Confiar em Nós
                </h3>
                <p className="text-green-700">
                  Sua privacidade é nossa prioridade. Estamos comprometidos em proteger seus dados 
                  e ser transparentes sobre como os utilizamos. Não hesite em nos contatar com 
                  qualquer dúvida ou preocupação.
                </p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return (
          <motion.div style={contentStyle} variants={itemVariants}>
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-600 mb-4">
                Seção em desenvolvimento
              </h3>
              <p className="text-gray-500">
                Esta seção será disponibilizada em breve.
              </p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar bgColor="white" />
      
      <div className="h-[80px] sm:h-[90px]" />

      <motion.main
        className="flex-1 px-4 sm:px-6 lg:px-8 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Política de <span className="text-pink-600">Privacidade</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transparência total sobre como protegemos e utilizamos seus dados pessoais 
              conforme a Lei Geral de Proteção de Dados (LGPD)
            </p>
            <div className="mt-6 flex justify-center">
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                ✓ Conforme LGPD • Atualizado em Nov/2024
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div className="mb-8" variants={itemVariants}>
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 overflow-x-auto pb-4">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                      activeSection === section.id
                        ? 'border-pink-600 text-pink-600 bg-pink-50 rounded-t-lg'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div variants={itemVariants}>
            {renderContent()}
          </motion.div>

          {/* Footer Info */}
          <motion.div 
            className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500"
            variants={itemVariants}
          >
            <p>
              Este documento está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)
            </p>
            <p className="mt-2">
              Última atualização: 01 de Novembro de 2024 • 
              <a href="/termos" className="text-pink-600 hover:text-pink-800 ml-1">
                Consulte nossos Termos de Uso
              </a>
            </p>
          </motion.div>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}