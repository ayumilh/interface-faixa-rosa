import { FaStar, FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import Image from "next/image";

export default function Reviews({ nomeAnunciante, showReviews, companionId }) {

  const [reviews, setReviews] = useState([
    {
      id: 1,
      autor: 'Kemet',
      nota: 5,
      comentario: 'Negociação bem tranquila, ela especifica bem os serviços que realiza e os valores, o que facilita bastante. A Melissa é incrível! Mesmo lendo os relatos por aqui e já tendo a certeza de ...',
      data: '8/8/2024',
      cidade: 'São Paulo - SP',
      detalhes: {
        fotosReais: 5,
        local: 5,
        profissionalismo: 5,
        higiene: 5,
      },
      avaliacoesUtil: {
        sim: 4,
        nao: 0,
      },
    },
  ]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [cidade, setCidade] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async () => {
    if (!nota || !comentario || !cidade) {
      setStatus('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const newReview = {
        companionId,
        nota,
        comentario,
        cidade,
      };
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        const savedReview = await response.json();
        setReviews((prev) => [savedReview, ...prev]);
        setIsModalOpen(false);
        setNota(0);
        setComentario('');
        setCidade('');
        setStatus('');
      } else {
        setStatus('Erro ao salvar o review. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao enviar o review:', error);
      setStatus('Erro ao salvar o review. Tente novamente.');
    }
  };


  return (
    <div className={`mt-8 p-4 md:p-6 bg-white rounded-lg shadow-lg w-full sm:w-[95%] mx-auto ${!showReviews ? 'blur-sm' : ''}`}>
      <h2 className="text-2xl font-bold mb-4 text-black">Reviews sobre {nomeAnunciante}</h2>

      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-5xl font-bold text-black">
            {reviews.length ? (reviews.reduce((sum, r) => sum + r.nota, 0) / reviews.length).toFixed(1) : '0.0'}
          </h3>
          <div className="flex space-x-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < Math.round(reviews.reduce((sum, r) => sum + r.nota, 0) / reviews.length) ? 'text-yellow-500' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="font-semibold text-black">
            {reviews.length > 0 ? 'Muito satisfeito!' : 'Sem avaliações ainda'}
          </span>
        </div>
        <p className="text-black">{reviews.length} review(s)</p>
      </div>

      {/* Botão para fazer review */}
      <button
        className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
        onClick={() => setIsModalOpen(true)}
      >
        Faça seu review
      </button>

      {/* Lista de reviews */}
      <div className="mt-4 space-y-2">
        {loading && <div>Carregando reviews...</div>}
        {reviews.map((review) => (
          <div key={review.id} className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image
                  src="/assets/kemet.jpg"
                  alt={review.autor}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-black">{review.autor}</p>
                  <p className="text-sm text-black opacity-75">{review.data}</p>
                </div>
              </div>
              <span className="text-xs bg-gray-200 text-black px-4 py-1 rounded">VIP</span>
            </div>
            <div className="mt-2">
              <h4 className="font-semibold text-black">Impecável</h4>
              <p className="text-sm text-black">{review.comentario}</p>
              <div className="mt-2">
                <p><strong>Cidade:</strong> {review.cidade}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de criação de review */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3 shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setIsModalOpen(false)}
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold text-black mb-4">Criar Review</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-black font-medium mb-2">Nota</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <FaStar
                      key={value}
                      className={`cursor-pointer ${
                        value <= nota ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                      onClick={() => setNota(value)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-black font-medium mb-2">Comentário</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Escreva seu comentário"
                  rows="4"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label className="block text-black font-medium mb-2">Cidade</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Insira a cidade do atendimento"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </div>
              {status && <p className="text-sm text-red-500">{status}</p>}
              <button
                onClick={handleSubmit}
                className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition duration-300"
              >
                Enviar Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
