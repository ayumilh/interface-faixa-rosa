import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Expediente from "@/components/perfil/Expediente";

export default function Servicos({ servicesOffered, weeklySchedules }) {
  if (!servicesOffered) {
    return <p className="text-center text-gray-600">Carregando serviços...</p>;
  }

  // Filtrar serviços oferecidos e não oferecidos
  const servicosOferecidos = servicesOffered.filter(service => service.isOffered);
  const servicosNaoOferecidos = servicesOffered.filter(service => !service.isOffered);

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      {/* Renderiza o componente Expediente no topo */}
      <Expediente weeklySchedules={weeklySchedules} />


      {/* Serviços Oferecidos */}
      <h2 className="mt-8 text-xl font-semibold text-black flex items-center mb-4">
        <FaCheckCircle className="text-green-500 mr-2" /> Serviços Oferecidos
      </h2>
      {servicosOferecidos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {servicosOferecidos.map((servico, index) => (
            <div key={index} className="text-black border-b pb-2 cursor-pointer hover:bg-green-50 rounded-md p-2 transition duration-300">
              <span className="font-bold">{servico.name}</span>
              <p className="text-sm mt-1" dangerouslySetInnerHTML={{ __html: `Taxa adicional pelo serviço: <strong>R$ ${servico.price}</strong>` }}></p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Nenhum serviço oferecido.</p>
      )}

      {/* Serviços Não Oferecidos */}
      <h2 className="text-xl font-semibold text-black flex items-center mb-4">
        <FaTimesCircle className="text-red-500 mr-2" /> Serviços Não Oferecidos
      </h2>
      {servicosNaoOferecidos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {servicosNaoOferecidos.map((servico, index) => (
            <div key={index} className="text-gray-600 border-b pb-2 cursor-pointer hover:bg-red-50 rounded-md p-2 transition duration-300">
              <span className="line-through font-bold text-black">{servico.name}</span>
              <p className="text-sm mt-1">{servico.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Todos os serviços estão disponíveis.</p>
      )}
    </div>
  );
}
