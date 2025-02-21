import { useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function Localidade({ lugares, city, state }) {
  const [mostrarMais, setMostrarMais] = useState(false);

  const toggleMostrarMais = () => {
    setMostrarMais(!mostrarMais);
  };

  // Função para formatar nomes corretamente: primeira letra maiúscula, restante minúsculo
  const formatarNome = (nome) => {
    return nome
      .toLowerCase()
      .replace('_', ' ') // Substitui underscore por espaço
      .replace(/(^|\s)\S/g, (letra) => letra.toUpperCase()); // Capitaliza cada palavra
  };

  // Extrair e formatar os nomes das localidades
  const locaisAtendidos = lugares?.map(loc => formatarNome(loc.location?.name)).join(', ') || "Localização não informada";
  
  // Extrair e formatar comodidades sem duplicatas
  const todasComodidades = [...new Set(lugares?.flatMap(loc => loc.amenities) || [])]; 
  const comodidadesFormatadas = todasComodidades
    .map(amenity => formatarNome(amenity))
    .join(', ') || "Nenhuma comodidade informada";

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
              {locaisAtendidos}
            </p>
          </div>
          <div className="mb-6">
            <p className="font-semibold text-gray-900">Comodidades do local</p>
            <p className="text-gray-700 hover:text-gray-900 transition-colors duration-300">
              {comodidadesFormatadas}
            </p>
          </div>
        </div>

        {/* Coluna 2 */}
        <div>
          <div className="mb-6">
            <p className="font-semibold text-gray-900">Minha localização</p>
            <p className="text-pink-500 underline cursor-pointer hover:text-pink-600 transition-colors duration-300">
              {city} - {state}
            </p>
          </div>
          <div className="mb-6">
            <p className="font-semibold text-gray-900">Bairros que também atendo</p>
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
