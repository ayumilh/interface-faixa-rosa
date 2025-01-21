import Image from "next/image";
import { FaMoneyBillWave, FaCreditCard, FaCcVisa, FaCcMastercard, FaMoneyCheck } from 'react-icons/fa';

export default function Valores() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Título */}
      <h2 className="text-xl font-bold flex items-center mb-4 text-black">
        <FaMoneyBillWave className="mr-2 text-pink-500" /> Valores
      </h2>

      {/* Tabela de valores */}
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div>
          <div className="flex justify-between py-2 border-b">
            <span className="italic text-black">1 hora</span>
            <span className="font-bold text-black">R$ 800</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="italic text-black">4 horas</span>
            <span className="font-bold text-black">R$ 4000</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="italic text-black">Diária</span>
            <span className="font-bold text-black">R$ 8000</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="line-through italic text-gray-500">30 minutos</span>
            <span className="text-gray-500">Não realiza</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between py-2 border-b">
            <span className="italic text-black">2 horas</span>
            <span className="font-bold text-black">R$ 2000</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="italic text-black">Pernoite</span>
            <span className="font-bold text-black">R$ 8000</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="line-through italic text-gray-500">15 minutos</span>
            <span className="text-gray-500">Não realiza</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="line-through italic text-gray-500">Diária de viagem</span>
            <span className="text-gray-500">Não realiza</span>
          </div>
        </div>
      </div>

      {/* Formas de pagamento */}
      <div>
  <h3 className="text-lg font-semibold text-black mb-2">Formas de pagamento:</h3>
  <div className="flex space-x-6">
    <div className="flex flex-col items-center">
      <FaMoneyBillWave className="text-3xl text-black" /> {/* Alterado para preto */}
      <span className="text-sm font-medium text-black">DINHEIRO</span>
    </div>
    <div className="flex flex-col items-center">
      <Image src="/assets/pix-icon.png" alt="Pix Icon" width={32} height={32} className="w-8 h-8" /> {/* Mantido como está */}
      <span className="text-sm font-medium text-black">PIX</span>
    </div>
    <div className="flex flex-col items-center">
      <FaCreditCard className="text-3xl text-black" /> {/* Alterado para preto */}
      <span className="text-sm font-medium text-black">CRÉDITO</span>
    </div>
    <div className="flex flex-col items-center">
      <FaCcMastercard className="text-3xl text-black" /> {/* Alterado para preto */}
      <span className="text-sm font-medium text-black">DÉBITO</span>
    </div>
        </div>
      </div>
    </div>
  );
}
