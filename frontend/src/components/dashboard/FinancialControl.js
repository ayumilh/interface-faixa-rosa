import React, { useState, useEffect, useCallback } from 'react';
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaCcMastercard,
  FaCheckCircle,
  FaTimesCircle,
  FaFire
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'rc-slider';
import Image from 'next/image';
import axios from 'axios';
import Cookies from 'js-cookie';
import 'rc-slider/assets/index.css';

const FinancialControl = () => {
   const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [pendingUpdates, setPendingUpdates] = useState(false);

  // Executa ao carregar o componente**
  const fetchFinancialData = useCallback(async () => {
    const token = Cookies.get("userToken");

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/finance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Dados financeiros recebidos:", response.data);

      // Atualizando os métodos de pagamento
      if (response.data.paymentMethods) {
        setPaymentMethods(
          response.data.paymentMethods.map(method => ({
            nome: method.nome,
            aceito: method.aceito,
            icon: getPaymentIcon(method.nome),
          }))
        );
      }

      // Atualizando os serviços corretamente
      if (response.data.timedServices) {
        setServices(
          response.data.timedServices.map(service => ({
            id: service.id,
            nome: service.name,
            descricao: service.description,
            preco: service.price ?? service.defaultPrice,
            customPreco: service.price !== null,
            realizado: service.isOffered ?? false,
            isOffered: service.isOffered ?? false,
          }))
        );
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar dados financeiros:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFinancialData();
  }, [fetchFinancialData]);

  const getPaymentIcon = (nome) => {
    switch (nome) {
      case "PIX":
        return <Image src="/assets/pix-icon.png" alt="Pix Icon" width={32} height={32} className="w-8 h-8" />;
      case "DINHEIRO":
        return <FaMoneyBillWave className="text-3xl text-black" />;
      case "CARTAO_CREDITO":
        return <FaCreditCard className="text-3xl text-black" />;
      case "DEBITO":
        return <FaCcMastercard className="text-3xl text-black" />;
      default:
        return null;
    }
  };

  // Alternar um serviço entre oferecido e não oferecido
  const toggleService = (index) => {
    setServices((prev) =>
      prev.map((service, i) =>
        i === index
          ? {
            ...service,
            realizado: !service.realizado,
            isOffered: !service.realizado,
          }
          : service
      )
    );
    setPendingUpdates(true);
  };

  // Atualiza o preço de um serviço
  const updatePrice = (index, value) => {
    setServices((prev) =>
      prev.map((service, i) =>
        i === index ? { ...service, preco: value } : service
      )
    );
    setPendingUpdates(true);
  };

  // Alternar aceitação de forma de pagamento
  const togglePaymentMethod = (index) => {
    setPaymentMethods((prev) =>
      prev.map((method, i) =>
        i === index ? { ...method, aceito: !method.aceito } : method
      )
    );
    setPendingUpdates(true);
  };

  // Aplicar todas as alterações no backend
  const applyUpdates = async () => {
    const token = Cookies.get("userToken");
    if (!token) {
      console.error("Token não encontrado");
      return;
    }

    try {
      // Gerando a estrutura correta dos serviços oferecidos
      const updatedServices = services.map(s => ({
        id: s.id,
        price: s.realizado ? s.preco || s.defaultPrice : null,
        isOffered: s.realizado,
      }));

      // Gerando a estrutura correta dos métodos de pagamento
      const updatedPaymentMethods = paymentMethods.map(m => ({
        nome: m.nome,
        aceito: m.aceito,
      }));

      // Criando o payload final
      const payload = {
        paymentMethods: updatedPaymentMethods,
        timedServices: updatedServices,
      };

      console.log("Payload enviado ao backend:", JSON.stringify(payload, null, 2));

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companions/finance/update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Atualizações aplicadas com sucesso!", response.data);

      // Recarregar os dados do backend para confirmar a atualização
      fetchFinancialData();
      setPendingUpdates(false);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  // Separar serviços oferecidos e não oferecidos**
  const servicosOferecidos = services.filter((service) => service.realizado);
  const servicosNaoOferecidos = services.filter((service) => !service.realizado);

  // Valores predefinidos para seleção de preço
  const precoOptions = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500];

  // Função para determinar se deve mostrar o slider
  const shouldShowSlider = (service) => service.customPreco;

  return (
    <motion.div
      className="p-4 md:p-6 bg-gradient-to-r from-purple-100 to-blue-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Carregamento com ícone de fogo */}
        {loading && (
          <div className="fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center z-50">
            <FaFire className="animate-pulse text-pink-500" size={50} />
          </div>
        )}
        {/* Explicação Simplificada */}
        <motion.div
          className="mb-8 p-6 bg-white rounded-lg shadow-md"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaMoneyBillWave className="mr-2 text-pink-500" /> Valores
          </h1>
          <p className="text-gray-600 mt-2">
            Aqui você pode gerenciar os valores dos seus serviços e selecionar as formas de pagamento que aceita. Para oferecer um serviço, clique no ícone de <FaCheckCircle className="inline text-green-500" /> e defina o preço. Para não oferecer, clique no ícone de <FaTimesCircle className="inline text-red-500" />.
          </p>
        </motion.div>

        {/* Serviços Oferecidos */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-green-600 flex items-center mb-4">
            <FaCheckCircle className="mr-2" /> Serviços Oferecidos
          </h2>
          <AnimatePresence>
            {servicosOferecidos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {servicosOferecidos.map((service) => (
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
                        onClick={() => toggleService(services.findIndex((s) => s.id === service.id))}
                        title="Não oferece mais este serviço"
                      />
                    </div>
                    <p className="text-gray-600 mt-2">{service.descricao}</p>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço pelo serviço (R$):
                      </label>
                      <select
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        value={service.customPreco ? "Outro" : service.preco}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "Outro") {
                            setServices((prev) =>
                              prev.map((s, i) =>
                                i === services.findIndex((s) => s.id === service.id)
                                  ? { ...s, preco: 50, customPreco: true }
                                  : s
                              )
                            );
                          } else {
                            setServices((prev) =>
                              prev.map((s, i) =>
                                i === services.findIndex((s) => s.id === service.id)
                                  ? { ...s, preco: Number(value), customPreco: false }
                                  : s
                              )
                            );
                          }
                        }}
                      >
                        {precoOptions.map((preco) => (
                          <option key={preco} value={preco}>
                            R$ {preco}
                          </option>
                        ))}
                        <option value="Outro">Outro</option>
                      </select>
                      {/* Slider visível apenas quando "Outro" for selecionado */}
                      {service.customPreco && (
                        <div className="mt-4">
                          <Slider
                            min={50}
                            max={20000}
                            step={50}
                            value={service.preco}
                            onChange={(value) => {
                              setServices((prev) =>
                                prev.map((s, i) =>
                                  i === services.findIndex((s) => s.id === service.id)
                                    ? { ...s, preco: value }
                                    : s
                                )
                              );
                            }}
                            railStyle={{ backgroundColor: "#d1d5db", height: 8 }}
                            handleStyle={{
                              borderColor: "#10b981",
                              height: 24,
                              width: 24,
                              marginLeft: -12,
                              marginTop: -8,
                              backgroundColor: "#10b981",
                            }}
                            trackStyle={{ backgroundColor: "#10b981", height: 8 }}
                          />
                          <div className="mt-2 text-sm text-gray-600">
                            R$ {service.preco.toLocaleString("pt-BR")}
                          </div>
                        </div>
                      )}
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
        <section className="mb-8">
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
                        onClick={() => toggleService(services.findIndex((s) => s.id === service.id))}
                        title="Oferecer este serviço"
                      />
                    </div>
                    <p className="text-gray-600 mt-2">{service.descricao}</p>
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

        {/* Formas de Pagamento */}
        <section>
          <h2 className="text-xl font-semibold text-black mb-4">Formas de Pagamento</h2>
          <div className="flex flex-wrap justify-start space-x-6">
            {paymentMethods.length > 0 ? (
              paymentMethods.map((method, index) => (
                <motion.div
                  key={method.nome}
                  className="flex flex-col items-center mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div
                    className={`cursor-pointer flex flex-col items-center transition-opacity duration-300 ${method.aceito ? 'opacity-100' : 'opacity-50'
                      }`}
                    onClick={() => togglePaymentMethod(index)}
                    title={method.aceito ? 'Desmarcar' : 'Marcar'}
                  >
                    {method.icon}
                    <span className="mt-2 text-sm font-medium text-black">
                      {method.nome === "CARTAO_CREDITO" ? "CRÉDITO" : method.nome === "DEBITO" ? "DÉBITO" : method.nome}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-600">Nenhuma forma de pagamento disponível.</p>
            )}
          </div>
          {/* Instrução sobre a Opacidade */}
          <p className="mt-4 text-gray-600 text-sm">
            As formas de pagamento aceitas estão com opacidade total. Clique em um ícone para alternar sua aceitação, reduzindo a opacidade se não forem aceitas.
          </p>
        </section>

        {/* Botão Aplicar Alterações */}
        {pendingUpdates && (
          <button
            onClick={applyUpdates}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
          >
            Aplicar Alterações
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default FinancialControl;
