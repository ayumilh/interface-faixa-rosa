import { FaFlag, FaBook, FaTimes, FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaUpload, FaFileImage, FaFileVideo } from 'react-icons/fa';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Denuncia({ dataCriacao }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [motivoSelecionado, setMotivoSelecionado] = useState('');
  const [descricao, setDescricao] = useState('');
  const [anexo, setAnexo] = useState(null);
  const [status, setStatus] = useState('');

  const motivosDisponiveis = [
    { id: 'perfil_falso', label: 'Perfil falso ou enganoso', icon: FaExclamationTriangle },
    { id: 'fotos_falsas', label: 'Fotos que não correspondem à realidade', icon: FaFileImage },
    { id: 'comportamento_inadequado', label: 'Comportamento inadequado', icon: FaFlag },
    { id: 'conteudo_inapropriado', label: 'Conteúdo inapropriado', icon: FaShieldAlt },
    { id: 'golpe', label: 'Tentativa de golpe ou fraude', icon: FaExclamationTriangle },
    { id: 'outros', label: 'Outros motivos', icon: FaFlag }
  ];

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
    if (!motivoSelecionado) {
      setStatus('Por favor, selecione um motivo.');
      return;
    }
    if (motivoSelecionado === 'outros' && !motivo.trim()) {
      setStatus('Por favor, descreva o motivo.');
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
      console.log('Denúncia enviada:', { motivoSelecionado, motivo, descricao, anexo });
      setMotivo('');
      setMotivoSelecionado('');
      setDescricao('');
      setAnexo(null);
      setStatus('');
      setIsThankYouOpen(false);
    }, 3000);
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setMotivo('');
    setMotivoSelecionado('');
    setDescricao('');
    setAnexo(null);
    setStatus('');
  };

  return (
    <motion.div
      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Informações do perfil */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 sm:p-3 rounded-lg">
            <FaBook className="text-white text-lg sm:text-xl" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm sm:text-base">Informações do Perfil</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Criado em <span className="font-semibold text-blue-600">{dataCriacao}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Seção de denúncia */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="text-center">
          <motion.div
            className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-500 rounded-full mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <FaShieldAlt className="text-white text-xl sm:text-2xl" />
          </motion.div>
          
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
            Ajude-nos a manter a comunidade segura
          </h3>
          <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
            Se você encontrou algum problema com este perfil, por favor nos informe. 
            Sua denúncia será analisada com total confidencialidade.
          </p>

          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-300 flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaFlag />
            <span>Denunciar Perfil</span>
          </motion.button>
        </div>
      </div>

      {/* Modal de denúncia */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetModal}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header do modal */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-1 flex items-center">
                      <FaShieldAlt className="mr-3" />
                      Denunciar Perfil
                    </h2>
                    <p className="text-white/90 text-sm">Suas informações serão mantidas em sigilo</p>
                  </div>
                  <motion.button
                    onClick={resetModal}
                    className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTimes className="text-white text-lg" />
                  </motion.button>
                </div>
              </div>

              {/* Conteúdo do modal */}
              <div className="p-6 space-y-6">
                {/* Seleção de motivo */}
                <div>
                  <label className="block font-bold text-gray-800 mb-4">
                    Qual o motivo da denúncia? *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {motivosDisponiveis.map((motivoItem) => (
                      <motion.div
                        key={motivoItem.id}
                        className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                          motivoSelecionado === motivoItem.id
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                        }`}
                        onClick={() => setMotivoSelecionado(motivoItem.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            motivoSelecionado === motivoItem.id
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <motivoItem.icon className="text-sm" />
                          </div>
                          <span className={`font-medium text-sm ${
                            motivoSelecionado === motivoItem.id
                              ? 'text-red-700'
                              : 'text-gray-700'
                          }`}>
                            {motivoItem.label}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Campo de motivo personalizado */}
                {motivoSelecionado === 'outros' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block font-bold text-gray-800 mb-2">
                      Descreva o motivo *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Explique o motivo da denúncia"
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                    />
                  </motion.div>
                )}

                {/* Descrição adicional */}
                <div>
                  <label className="block font-bold text-gray-800 mb-2">
                    Descrição Adicional (opcional)
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Forneça mais detalhes que possam ajudar na investigação..."
                    rows="4"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {descricao.length}/500 caracteres
                  </p>
                </div>

                {/* Upload de arquivo */}
                <div>
                  <label className="block font-bold text-gray-800 mb-3">
                    Anexar Evidências (opcional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-red-400 hover:bg-red-50 transition-all duration-200">
                    <input
                      type="file"
                      accept="image/jpeg, image/png, video/mp4"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer"
                    >
                      <div className="space-y-3">
                        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaUpload className="text-gray-500 text-xl" />
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Clique para fazer upload</p>
                          <p className="text-gray-500 text-sm">PNG, JPEG ou MP4 até 5MB</p>
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  {anexo && (
                    <motion.div
                      className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center space-x-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      <div className="bg-green-500 p-2 rounded-lg">
                        {anexo.type.startsWith('image/') ? (
                          <FaFileImage className="text-white text-sm" />
                        ) : (
                          <FaFileVideo className="text-white text-sm" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-green-800 font-medium text-sm">{anexo.name}</p>
                        <p className="text-green-600 text-xs">
                          {(anexo.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <motion.button
                        onClick={() => setAnexo(null)}
                        className="text-green-600 hover:text-green-800"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaTimes />
                      </motion.button>
                    </motion.div>
                  )}
                </div>

                {/* Status/erro */}
                {status && (
                  <motion.div
                    className="bg-red-50 border border-red-200 rounded-xl p-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <div className="flex items-center space-x-2">
                      <FaExclamationTriangle className="text-red-500" />
                      <p className="text-red-700 text-sm">{status}</p>
                    </div>
                  </motion.div>
                )}

                {/* Botões */}
                <div className="flex space-x-4 pt-4">
                  <motion.button
                    onClick={resetModal}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaFlag />
                    <span>Enviar Denúncia</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de confirmação */}
      <AnimatePresence>
        {isConfirmationOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaExclamationTriangle className="text-yellow-600 text-2xl" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Confirmar Denúncia</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Você tem certeza que deseja prosseguir com esta denúncia? 
                    Ela será enviada para nossa equipe de moderação.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    onClick={() => setIsConfirmationOpen(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    onClick={handleConfirm}
                    className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Confirmar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de agradecimento */}
      <AnimatePresence>
        {isThankYouOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6 text-center">
                <motion.div
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <FaCheckCircle className="text-green-600 text-2xl" />
                </motion.div>
                
                <h2 className="text-xl font-bold text-gray-800 mb-3">Denúncia Recebida!</h2>
                
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <p className="text-green-800 text-sm leading-relaxed">
                    Obrigado por nos ajudar a manter a comunidade segura. 
                    O <span className="font-semibold text-pink-600">Faixa Rosa</span> está 
                    investigando sua denúncia e tomará as medidas necessárias.
                  </p>
                </div>

                <motion.button
                  onClick={() => setIsThankYouOpen(false)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Entendi
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}