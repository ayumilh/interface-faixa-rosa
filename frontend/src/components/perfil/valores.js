import Image from "next/image";
import { FaMoneyBillWave, FaCreditCard, FaCcVisa, FaCcMastercard, FaMoneyCheck } from 'react-icons/fa';

export default function Valores({ timedService, paymentMethods }) {
  const paymentIcons = {
    PIX: <Image src="/assets/pix-icon.png" alt="Pix Icon" width={32} height={32} className="w-8 h-8" />,
    DEBITO: <FaCcMastercard className="text-3xl text-black" />,
    CARTAO_CREDITO: <FaCreditCard className="text-3xl text-black" />,
    DINHEIRO: <FaMoneyBillWave className="text-3xl text-black" />,
  };

  // Definição dos nomes formatados
  const paymentNames = {
    PIX: "PIX",
    DEBITO: "DÉBITO",
    CARTAO_CREDITO: "CRÉDITO",
    DINHEIRO: "DINHEIRO",
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Título */}
      <h2 className="text-xl font-bold flex items-center mb-4 text-black">
        <FaMoneyBillWave className="mr-2 text-pink-500" /> Valores
      </h2>

      {/* Tabela de valores dinâmica */}
      <div className="grid grid-cols-2 gap-6 mb-4">
        {timedService && timedService.length > 0 ? (
          timedService.map((service, index) => (
            <div key={index} className="flex justify-between py-2 border-b">
              <span className={`italic text-black ${!service.isOffered ? 'line-through text-gray-500' : ''}`}>
                {service.name}
              </span>
              <span className={`font-bold ${!service.isOffered ? 'text-gray-500' : 'text-black'}`}>
                {service.isOffered ? `R$ ${service.price}` : "Não realiza"}
              </span>
            </div>
          ))
        ) : (
          <p className="text-black">Nenhum serviço disponível</p>
        )}
      </div>

      {/* Formas de pagamento */}
      <div>
        <h3 className="text-lg font-semibold text-black mb-2">Formas de pagamento:</h3>
        <div className="flex space-x-6">
          {paymentMethods && paymentMethods.length > 0 ? (
            paymentMethods.map((method, index) => (
              <div key={index} className="flex flex-col items-center">
                {paymentIcons[method] || <FaMoneyCheck className="text-3xl text-black" />}
                <span className="text-sm font-medium text-black">{paymentNames[method] || method}</span>
              </div>
            ))
          ) : (
            <p className="text-black">Nenhuma forma de pagamento disponível</p>
          )}
        </div>
      </div>
    </div>
  );
}
