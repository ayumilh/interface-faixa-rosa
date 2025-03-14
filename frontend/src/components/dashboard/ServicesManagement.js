import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';

const ServicesManagement = () => {
  // Estado para controlar os serviços com oferecimento e preço
  const [services, setServices] = useState();
  const [loading, setLoading] = useState(true);
  const [pendingUpdates, setPendingUpdates] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      const token = Cookies.get("userToken");

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/services`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.services) {
          setLoading(false);
          setServices(
            response.data.services.map((service) => ({
              id: service.id,
              nome: service.name,
              descricao: service.description,
              oferecido: service.isOffered, // Garantindo que pega o estado correto do banco
              preco: service.price ?? 20,
            }))
          );
        }
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
      }
    };

    fetchServices();
  }, []);

  // Alternar um serviço entre oferecido e não oferecido
  const toggleService = (id) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? {
            ...service,
            oferecido: !service.oferecido,
            preco: !service.oferecido ? 20 : service.preco, // Define um preço padrão se for ativado
          }
          : service
      )
    );
    setPendingUpdates(true);
  };

  // Atualizar o preço de um serviço específico
  const updatePrice = (id, price) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, preco: price } : service
      )
    );
    setPendingUpdates(true);
  };


  // Separar serviços oferecidos e não oferecidos
  const servicosOferecidos = services ? services.filter(service => service.oferecido) : [];
  const servicosNaoOferecidos = services ? services.filter(service => !service.oferecido) : [];

  // Opções de preço de 20 a 999 em incrementos de 10
  const precoOptions = Array.from({ length: 98 }, (_, i) => 20 + i * 10);

  // Enviar as alterações para o backend via PUT
  const applyUpdates = async () => {
    const token = Cookies.get("userToken");
    if (!token) {
      console.error("Token não encontrado");
      return;
    }

    try {
      const payload = {
        services: services.map((s) => ({
          id: s.id,
          isOffered: s.oferecido, // Atualizando corretamente
          price: s.preco,
        })),
      };

      console.log("Enviando atualização para o backend:", JSON.stringify(payload, null, 2));

      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/services/update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Atualizações aplicadas com sucesso!");
      setPendingUpdates(false);
    } catch (error) {
      console.error("Erro ao atualizar serviços:", error);
    }
  };
  return (
    <div className="p-4 md:p-6 bg-gradient-to-r from-purple-100 to-blue-100 min-h-screen">
      {/* Carregamento com ícone de fogo */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center z-50">
          <Image
            src="/iconOficial_faixaRosa.png"
            alt="Ícone oficial Faixa Rosa"
            width={50}
            height={50}
            className="animate-pulse w-auto h-auto"
          />
        </div>
      )}
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
                    key={service.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="border border-green-400 rounded-lg p-4 bg-green-50 flex flex-col shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">{service.nome}</h3>
                      <FaTimesCircle
                        className="text-red-500 text-xl cursor-pointer"
                        onClick={() => toggleService(service.id)}
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
                        onChange={(e) => updatePrice(service.id, Number(e.target.value))} // ⬅️ Agora pega o ID correto
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
                    key={service.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="border border-gray-200 rounded-lg p-4 bg-white flex flex-col hover:shadow-lg transition duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">{service.nome}</h3>
                      <FaCheckCircle
                        className="text-green-500 text-xl cursor-pointer"
                        onClick={() => toggleService(service.id)}
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
        {pendingUpdates && (
          <button
            onClick={applyUpdates}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
          >
            Aplicar Alterações
          </button>
        )}
      </div>
    </div>
  );
};

export default ServicesManagement;
