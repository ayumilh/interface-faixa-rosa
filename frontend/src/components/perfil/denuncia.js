import { FaFlag, FaBook, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

export default function Denuncia({ dataCriacao }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [anexo, setAnexo] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // Limite de 5MB
      if (file.size > maxSize) {
        setStatus('O arquivo deve ter no máximo 5MB.');
        return;
      }
      if (!['image/jpeg', 'image/png', 'video/mp4'].includes(file.type)) {
        setStatus('Apenas imagens (JPEG/PNG) e vídeos (MP4) são permitidos.');
        return;
      }
      setAnexo(file);
      setStatus('');
    }
  };

  const handleSubmit = () => {
    if (!motivo) {
      setStatus('Por favor, preencha o motivo.');
      return;
    }
    setIsModalOpen(false);
    setIsConfirmationOpen(true);
  };

  const handleConfirm = () => {
    setIsConfirmationOpen(false);
    setIsThankYouOpen(true);

    // Simulação de envio ao servidor
    setTimeout(() => {
      console.log('Denúncia enviada:', { motivo, descricao, anexo });
      setMotivo('');
      setDescricao('');
      setAnexo(null);
      setStatus('');
      setIsThankYouOpen(false);
    }, 3000);
  };

  return (
    <div className="mt-8 p-4 md:p-6 bg-white rounded-lg shadow-lg">
      {/* Data de criação do perfil */}
      <div className="flex items-center space-x-3 mb-4 text-black">
        <FaBook className="text-pink-500" />
        <p className="font-medium">
          Perfil criado em <span className="font-semibold">{dataCriacao}</span>
        </p>
      </div>

      {/* Botão de denunciar perfil */}
      <div className="flex justify-center">
        <button
          className="flex items-center space-x-2 px-6 py-2 border border-pink-500 text-pink-500 rounded-full hover:bg-pink-500 hover:text-white transition duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          <FaFlag />
          <span className="font-semibold">Denunciar perfil</span>
        </button>
      </div>

      {/* Modal de denúncia */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3 shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setIsModalOpen(false)}
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold text-black mb-4">Denunciar Perfil</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-black font-medium mb-2">Motivo</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Insira o motivo"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-black font-medium mb-2">Descrição (opcional)</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Forneça mais detalhes, se necessário"
                  rows="4"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label className="block text-black font-medium mb-2">Anexar Provas (opcional)</label>
                <input
                  type="file"
                  accept="image/jpeg, image/png, video/mp4"
                  onChange={handleFileChange}
                  className="block w-full text-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-white hover:file:bg-pink-600"
                />
                {anexo && (
                  <p className="text-sm text-black mt-2">
                    Arquivo selecionado: <span className="font-semibold">{anexo.name}</span>
                  </p>
                )}
              </div>
              {status && <p className="text-sm text-red-500">{status}</p>}
              <button
                onClick={handleSubmit}
                className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition duration-300"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação */}
      {isConfirmationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3 shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setIsConfirmationOpen(false)}
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold text-black mb-4">Confirmação</h2>
            <p className="text-black mb-6">Você tem certeza que deseja continuar com esta denúncia?</p>
            <div className="flex justify-between">
              <button
                onClick={() => setIsConfirmationOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md text-black hover:bg-gray-400 transition duration-300"
              >
                Não
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition duration-300"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de agradecimento */}
      {isThankYouOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3 shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setIsThankYouOpen(false)}
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold text-black mb-4">Obrigado pela denúncia!</h2>
            <p className="text-black">
              O <span className="text-pink-500 font-semibold">Faixa Rosa</span> está investigando. Agradecemos por sua colaboração.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
