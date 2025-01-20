// components/perfil/Localidade.js

import { useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function Localidade() {
  const [mostrarMais, setMostrarMais] = useState(false);

  const toggleMostrarMais = () => {
    setMostrarMais(!mostrarMais);
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-r from-white to-gray-100 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-4">
        <FaMapMarkerAlt className="mr-2 text-pink-500" /> Dados de localidade
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Coluna 1 */}
        <div>
          <div className="mb-6">
            <p className="font-semibold text-gray-900">Locais que atendo</p>
            <p className="text-gray-700 hover:text-gray-900 transition-colors duration-300">
              A domicílio, festas e eventos, hotéis, local próprio e motéis
            </p>
          </div>
          <div className="mb-6">
            <p className="font-semibold text-gray-900">Comodidades do local</p>
            <p className="text-gray-700 hover:text-gray-900 transition-colors duration-300">
              Ar-condicionado, Chuveiro, Frigobar, Estacionamento, Preservativos e Wi-Fi
            </p>
          </div>
        </div>

        {/* Coluna 2 */}
        <div>
          <div className="mb-6">
            <p className="font-semibold text-gray-900">Minha localização</p>
            <p className="text-gray-700 hover:text-gray-900 transition-colors duration-300">Moema, Zona Sul</p>
            <p className="text-pink-500 underline cursor-pointer hover:text-pink-600 transition-colors duration-300">
              São Paulo - SP
            </p>
            <p className="text-gray-500 italic">Localização não informada</p>
          </div>
          <div className="mb-6">
            <p className="font-semibold text-gray-900">Bairros que também atendo</p>
            <p className="text-gray-700 hover:text-gray-900 transition-colors duration-300">
              <a href="#" className="text-pink-500 hover:text-pink-600 underline">Itaim</a>,{' '}
              <a href="#" className="text-pink-500 hover:text-pink-600 underline">Vila Mariana</a>,{' '}
              <a href="#" className="text-pink-500 hover:text-pink-600 underline">Vila Madalena</a>,{' '}
              <a href="#" className="text-pink-500 hover:text-pink-600 underline">Perdizes</a>,{' '}
              <a href="#" className="text-pink-500 hover:text-pink-600 underline">Brooklin Novo</a>,{' '}
              <a href="#" className="text-pink-500 hover:text-pink-600 underline">Jardins</a>,{' '}
              <a href="#" className="text-pink-500 hover:text-pink-600 underline">Barra Funda</a>,{' '}
              <a href="#" className="text-pink-500 hover:text-pink-600 underline">Pinheiros</a>
            </p>
          </div>

          {mostrarMais && (
            <div className="mb-6">
              <p className="font-semibold text-gray-900">Cidades vizinhas que atendo</p>
              <p className="text-gray-700 hover:text-gray-900 transition-colors duration-300">
                Não atende em cidades vizinhas
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Botão Ver mais/menos para mobile */}
      <div className="mt-4 md:hidden">
        <button
          onClick={toggleMostrarMais}
          className="w-full py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-lg shadow hover:from-pink-600 hover:to-pink-700 transition-all duration-300"
        >
          {mostrarMais ? 'Ver menos ▲' : 'Ver mais ▼'}
        </button>
      </div>
    </div>
  );
}
