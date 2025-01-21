import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import Image from "next/image";

export default function EstablishmentCard({ estabelecimento }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between">
      {/* Imagem do Estabelecimento */}
      <Image
        src={estabelecimento.imagem}
        alt={estabelecimento.nome}
        width={400}
        height={192}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />

      <div>
        <h3 className="text-xl font-bold mb-2">{estabelecimento.nome}</h3>
        <p className="text-pink-500 font-semibold mb-2">
          {estabelecimento.desconto}
        </p>
        <p className="text-gray-700 mb-4">{estabelecimento.descricao}</p>
        <p className="text-sm text-gray-500">{estabelecimento.contato}</p>
      </div>

      {/* Ícones de Contato */}
      <div className="mt-4 flex space-x-4">
        {estabelecimento.whatsapp && (
          <a
            href={estabelecimento.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-700 transition-colors"
            aria-label={`Contato via WhatsApp de ${estabelecimento.nome}`}
          >
            <FaWhatsapp size={24} />
          </a>
        )}
        {estabelecimento.instagram && (
          <a
            href={estabelecimento.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-800 transition-colors"
            aria-label={`Perfil do Instagram de ${estabelecimento.nome}`}
          >
            <FaInstagram size={24} />
          </a>
        )}
      </div>
    </div>
  );
}
