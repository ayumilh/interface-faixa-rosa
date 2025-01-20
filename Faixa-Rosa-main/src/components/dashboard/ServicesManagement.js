// src/dashboard/ServicesManagement.js

import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ServicesManagement = () => {
  const allServices = [
    { nome: 'Sexo anal com preservativo', descricao: 'Aceita receber penetração anal com preservativo de seus clientes.' },
    { nome: 'Sexo vaginal com preservativo', descricao: 'Faz penetração vaginal com preservativo em seus clientes.' },
    { nome: 'Beijo na boca', descricao: 'Realiza beijo na boca com seus clientes.' },
    { nome: 'Sexo oral com preservativo', descricao: 'Realiza sexo oral com preservativo em seus clientes.' },
    { nome: 'Striptease', descricao: 'Tira a roupa de forma lenta e sensual, normalmente com dança.' },
    { nome: 'Masturbação', descricao: 'Realiza masturbação em seus clientes.' },
    { nome: 'Massagem tradicional', descricao: 'Realiza massagem relaxante em seus clientes.' },
    { nome: 'Massagem tântrica', descricao: 'Realiza massagem tântrica que expande a sensibilidade sexual.' },
    { nome: 'Sexo virtual', descricao: 'Sexo à distância por meio de texto, áudio e vídeo online. Sem contato físico.' },
    { nome: 'Acompanhante', descricao: 'Companhia para encontros, festas e eventos.' },
    { nome: 'Viagem', descricao: 'Aceita viajar com seus clientes.' },
    { nome: 'Sexo oral sem preservativo', descricao: 'Atividade em que o sexo oral é realizado sem o uso de preservativo.' },
    { nome: 'Dupla penetração', descricao: 'Prática que envolve a penetração simultânea em duas áreas do corpo.' },
    { nome: 'Tripla penetração', descricao: 'Prática que envolve a penetração simultânea em três áreas do corpo.' },
    { nome: 'Dominação', descricao: 'Envolve o controle e a submissão de uma pessoa sobre a outra.' },
    { nome: 'Uso de roupas de fantasia/uniformes', descricao: 'Prática onde um dos participantes veste roupas específicas ou uniformes.' },
    { nome: 'Fazer roleplay', descricao: 'Envolve atuar ou fingir ser outra pessoa em um cenário fictício.' },
    { nome: 'Penetração com acessórios sexuais', descricao: 'Uso de brinquedos ou acessórios durante a penetração.' },
    { nome: 'Utiliza acessórios eróticos', descricao: 'Inclui o uso de brinquedos eróticos diversos.' },
    { nome: 'Permite filmagem', descricao: 'Consente que a relação seja filmada com consentimento claro.' },
    { nome: 'Beijo grego', descricao: 'Prática que envolve a estimulação oral da região anal.' },
    { nome: 'Sexo com voyeurismo/ser voyeur', descricao: 'Ato de observar ou ser observado durante relações sexuais.' },
    { nome: 'Podolatria', descricao: 'Atração sexual por pés, onde os pés são o foco principal da excitação.' },
    { nome: 'Bondage', descricao: 'Prática de amarração consensual com cordas para restrição.' },
    { nome: 'Sadomasoquismo', descricao: 'Atividades que envolvem dor ou humilhação consensual.' },
    { nome: 'Fisting', descricao: 'Introdução de uma mão inteira na vagina ou no ânus durante o ato sexual.' },
    { nome: 'Facefuck', descricao: 'Ato de penetração oral intensa e profunda.' },
    { nome: 'Quirofilia', descricao: 'Excitação sexual causada pelas mãos.' },
    { nome: 'Squirt', descricao: 'Ejaculação feminina durante o clímax.' },
    { nome: 'Chuva dourada', descricao: 'Prática de urinar no parceiro durante o ato sexual.' },
    { nome: 'Chuva marrom', descricao: 'Prática de defecar no parceiro.' },
    { nome: 'Trampling', descricao: 'Ato de pisotear outra pessoa com os pés como forma de excitação sexual.' },
  ];

  // Estado para controlar os serviços com oferecimento e preço
  const [services, setServices] = useState(
    allServices.map((service) => ({ ...service, oferecido: false, preco: 20 }))
  );

  // Função para alternar a oferta de um serviço
  const toggleService = (index) => {
    setServices((prev) =>
      prev.map((service, i) =>
        i === index
          ? { 
              ...service, 
              oferecido: !service.oferecido, 
              preco: !service.oferecido ? 20 : 20 // Define preço inicial ao oferecer
            }
          : service
      )
    );
  };

  // Função para atualizar o preço de um serviço
  const updatePrice = (index, price) => {
    setServices((prev) =>
      prev.map((service, i) =>
        i === index ? { ...service, preco: price } : service
      )
    );
  };

  // Separar serviços oferecidos e não oferecidos
  const servicosOferecidos = services.filter((service) => service.oferecido);
  const servicosNaoOferecidos = services.filter((service) => !service.oferecido);

  // Gerar opções de preço de 20 a 999 com incrementos de 10
  const precoOptions = Array.from({ length: 98 }, (_, i) => 20 + i * 10);

  return (
    <div className="p-4 md:p-6 bg-gradient-to-r from-purple-100 to-blue-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Explicação Simplificada */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-gray-800">Gerenciar Serviços</h1>
          <p className="text-gray-600 mt-2">
            Aqui você pode selecionar quais serviços você oferece e definir o preço para cada um. Clique no ícone de <FaCheckCircle className="inline text-green-500" /> para oferecer um serviço ou no ícone de <FaTimesCircle className="inline text-red-500" /> para não oferecer.
          </p>
        </div>

        {/* Serviços Oferecidos */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-green-600 flex items-center mb-4">
            <FaCheckCircle className="mr-2" /> Serviços Oferecidos
          </h2>
          <AnimatePresence>
            {servicosOferecidos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {servicosOferecidos.map((service, index) => (
                  <motion.div
                    key={service.nome}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="border border-green-400 rounded-lg p-4 bg-green-50 flex flex-col shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">{service.nome}</h3>
                      <FaTimesCircle
                        className="text-red-500 text-xl cursor-pointer"
                        onClick={() => toggleService(services.findIndex(s => s.nome === service.nome))}
                        title="Não oferece mais este serviço"
                      />
                    </div>
                    <p className="text-gray-600 mt-2" dangerouslySetInnerHTML={{ __html: service.descricao }}></p>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço pelo serviço (R$):
                      </label>
                      <select
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        value={service.preco}
                        onChange={(e) => updatePrice(services.findIndex(s => s.nome === service.nome), e.target.value)}
                      >
                        {precoOptions.map((preco) => (
                          <option key={preco} value={preco}>
                            R$ {preco}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-600"
              >
                Nenhum serviço oferecido no momento.
              </motion.p>
            )}
          </AnimatePresence>
        </section>

        {/* Serviços Não Oferecidos */}
        <section>
          <h2 className="text-xl font-semibold text-red-600 flex items-center mb-4">
            <FaTimesCircle className="mr-2" /> Serviços Não Oferecidos
          </h2>
          <AnimatePresence>
            {servicosNaoOferecidos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {servicosNaoOferecidos.map((service, index) => (
                  <motion.div
                    key={service.nome}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="border border-gray-200 rounded-lg p-4 bg-white flex flex-col hover:shadow-lg transition duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">{service.nome}</h3>
                      <FaCheckCircle
                        className="text-green-500 text-xl cursor-pointer"
                        onClick={() => toggleService(services.findIndex(s => s.nome === service.nome))}
                        title="Oferecer este serviço"
                      />
                    </div>
                    <p className="text-gray-600 mt-2" dangerouslySetInnerHTML={{ __html: service.descricao }}></p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-600"
              >
                Todos os serviços estão sendo oferecidos.
              </motion.p>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
};

export default ServicesManagement;
