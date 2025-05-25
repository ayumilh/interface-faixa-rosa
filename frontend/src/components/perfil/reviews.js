import { FaStar, FaTimes, FaUser, FaCalendar, FaMapMarkerAlt, FaThumbsUp, FaThumbsDown, FaPlus, FaQuoteLeft, FaAward, FaHeart } from 'react-icons/fa';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image";

export default function Reviews({ nomeAnunciante, showReviews, companionId }) {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      autor: 'Kemet',
      nota: 5,
      comentario: 'Negociação bem tranquila, ela especifica bem os serviços que realiza e os valores, o que facilita bastante. A Melissa é incrível! Mesmo lendo os relatos por aqui e já tendo a certeza de que seria uma experiência única, ela superou todas as expectativas.',
      data: '8/8/2024',
      cidade: 'São Paulo - SP',
      titulo: 'Experiência Impecável',
      detalhes: {
        fotosReais: 5,
        local: 5,
        profissionalismo: 5,
        higiene: 5,
      },
      avaliacoesUtil: {
        sim: 12,
        nao: 1,
      },
      verificado: true,
    },
    {
      id: 2,
      autor: 'Carlos M.',
      nota: 4,
      comentario: 'Muito profissional e atenciosa. Local limpo e organizado. Recomendo!',
      data: '15/7/2024',
      cidade: 'Santos - SP',
      titulo: 'Muito Bom',
      detalhes: {
        fotosReais: 4,
        local: 5,
        profissionalismo: 4,
        higiene: 5,
      },
      avaliacoesUtil: {
        sim: 8,
        nao: 0,
      },
      verificado: false,
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [filtroNota, setFiltroNota] = useState(0);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [cidade, setCidade] = useState('');
  const [titulo, setTitulo] = useState('');
  const [status, setStatus] = useState('');

  // Hover states para interações
  const [hoveredStar, setHoveredStar] = useState(0);
  const [modalHoveredStar, setModalHoveredStar] = useState(0);

  const handleSubmit = async () => {
    if (!nota || !comentario || !cidade || !titulo) {
      setStatus('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const newReview = {
        id: reviews.length + 1,
        companionId,
        nota,
        comentario,
        cidade,
        titulo,
        autor: 'Usuário Anônimo',
        data: new Date().toLocaleDateString('pt-BR'),
        detalhes: {
          fotosReais: nota,
          local: nota,
          profissionalismo: nota,
          higiene: nota,
        },
        avaliacoesUtil: {
          sim: 0,
          nao: 0,
        },
        verificado: false,
      };

      setReviews((prev) => [newReview, ...prev]);
      setIsModalOpen(false);
      setNota(0);
      setComentario('');
      setCidade('');
      setTitulo('');
      setStatus('');
    } catch (error) {
      console.error('Erro ao enviar o review:', error);
      setStatus('Erro ao salvar o review. Tente novamente.');
    }
  };

  // Calcular métricas
  const mediaGeral = reviews.length ? (reviews.reduce((sum, r) => sum + r.nota, 0) / reviews.length) : 0;
  const totalAvaliacoes = reviews.length;
  const distribuicaoNotas = [5, 4, 3, 2, 1].map(nota => ({
    nota,
    count: reviews.filter(r => r.nota === nota).length,
    percentage: reviews.length ? (reviews.filter(r => r.nota === nota).length / reviews.length) * 100 : 0
  }));

  // Filtrar reviews
  const reviewsFiltrados = filtroNota === 0 ? reviews : reviews.filter(r => r.nota === filtroNota);

  const renderStars = (rating, size = "text-lg", interactive = false, onHover = null, onLeave = null, onClick = null) => {
    return [...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        whileHover={interactive ? { scale: 1.2 } : {}}
        whileTap={interactive ? { scale: 0.9 } : {}}
      >
        <FaStar
          className={`${size} cursor-${interactive ? 'pointer' : 'default'} transition-colors duration-200 ${
            i < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onMouseEnter={() => interactive && onHover && onHover(i + 1)}
          onMouseLeave={() => interactive && onLeave && onLeave()}
          onClick={() => interactive && onClick && onClick(i + 1)}
        />
      </motion.div>
    ));
  };

  if (!showReviews) {
    return (
      <motion.div
        className="mt-8 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center py-12 blur-sm">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaStar className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Reviews Privados</h3>
          <p className="text-gray-600">
            Os reviews deste anunciante são privados
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center justify-center">
              <FaStar className="text-pink-500 mr-3" />
              Reviews sobre {nomeAnunciante}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Avaliações e experiências de outros usuários
            </p>
          </div>
        </motion.div>

        {/* Overview das avaliações */}
        <motion.div
          className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Score geral */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
                <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {mediaGeral.toFixed(1)}
                </div>
                <div>
                  <div className="flex space-x-1 mb-2">
                    {renderStars(Math.round(mediaGeral), "text-xl")}
                  </div>
                  <p className="text-gray-600 text-sm">
                    Baseado em {totalAvaliacoes} avaliações
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-xl p-4">
                <h3 className="font-bold text-green-800 mb-1">
                  {mediaGeral >= 4.5 ? 'Excelente!' : mediaGeral >= 4 ? 'Muito Bom!' : mediaGeral >= 3 ? 'Bom' : 'Regular'}
                </h3>
                <p className="text-green-700 text-sm">
                  {mediaGeral >= 4.5 ? 'Altamente recomendado pelos usuários' : 
                   mediaGeral >= 4 ? 'Bem avaliado pela comunidade' : 
                   'Experiências variadas'}
                </p>
              </div>
            </div>

            {/* Distribuição das notas */}
            <div className="lg:col-span-2">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <FaAward className="text-yellow-500 mr-2" />
                Distribuição das Avaliações
              </h3>
              <div className="space-y-3">
                {distribuicaoNotas.map(({ nota, count, percentage }) => (
                  <div key={nota} className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 w-8">{nota}</span>
                    <FaStar className="text-yellow-400 text-sm" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.5 + nota * 0.1, duration: 0.8 }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">{count}</span>
                    <span className="text-xs text-gray-500 w-10">{percentage.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ações e filtros */}
        <motion.div
          className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            {/* Filtros */}
            <div className="flex items-center space-x-3">
              <span className="text-gray-700 font-medium text-sm">Filtrar por:</span>
              <div className="flex space-x-2">
                {[0, 5, 4, 3, 2, 1].map(nota => (
                  <motion.button
                    key={nota}
                    onClick={() => setFiltroNota(nota)}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      filtroNota === nota
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {nota === 0 ? 'Todas' : `${nota}★`}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Botão criar review */}
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus />
              <span>Escrever Review</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Lista de reviews */}
        <motion.div
          className="space-y-4 sm:space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando reviews...</p>
            </div>
          )}

          {!loading && reviewsFiltrados.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {filtroNota === 0 ? 'Nenhum review ainda' : `Nenhum review com ${filtroNota} estrelas`}
              </h3>
              <p className="text-gray-600">
                {filtroNota === 0 ? 'Seja o primeiro a avaliar!' : 'Tente um filtro diferente'}
              </p>
            </div>
          )}

          {reviewsFiltrados.map((review, index) => (
            <motion.div
              key={review.id}
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              {/* Header do review */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                      <FaUser className="text-white text-lg" />
                    </div>
                    {review.verificado && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <FaAward className="text-white text-xs" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-gray-800">{review.autor}</h4>
                      {review.verificado && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Verificado
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 mt-1">
                      <div className="flex items-center space-x-1">
                        <FaCalendar className="text-gray-400 text-xs" />
                        <span className="text-gray-600 text-sm">{review.data}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaMapMarkerAlt className="text-gray-400 text-xs" />
                        <span className="text-gray-600 text-sm">{review.cidade}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex space-x-1 mb-1">
                    {renderStars(review.nota, "text-lg")}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{review.nota}.0</span>
                </div>
              </div>

              {/* Conteúdo do review */}
              <div className="mb-4">
                <h3 className="font-bold text-gray-800 text-lg mb-2 flex items-center">
                  <FaQuoteLeft className="text-pink-500 mr-2 text-sm" />
                  {review.titulo}
                </h3>
                <p className="text-gray-700 leading-relaxed">{review.comentario}</p>
              </div>

              {/* Avaliações detalhadas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                {Object.entries(review.detalhes).map(([categoria, nota]) => (
                  <div key={categoria} className="text-center">
                    <p className="text-xs font-medium text-gray-600 mb-1 capitalize">
                      {categoria.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <div className="flex justify-center space-x-1">
                      {renderStars(nota, "text-sm")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Ações do review */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <motion.button
                    className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaThumbsUp className="text-sm" />
                    <span className="text-sm font-medium">{review.avaliacoesUtil.sim}</span>
                  </motion.button>
                  
                  <motion.button
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaThumbsDown className="text-sm" />
                    <span className="text-sm font-medium">{review.avaliacoesUtil.nao}</span>
                  </motion.button>
                </div>

                <span className="text-xs text-gray-500">
                  Esta avaliação foi útil para {review.avaliacoesUtil.sim + review.avaliacoesUtil.nao} pessoas
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal de criação de review */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
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
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">Escrever Review</h2>
                      <p className="text-white/90 text-sm">Compartilhe sua experiência com {nomeAnunciante}</p>
                    </div>
                    <motion.button
                      onClick={() => setIsModalOpen(false)}
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
                  {/* Avaliação geral */}
                  <div>
                    <label className="block font-bold text-gray-800 mb-3">
                      Avaliação Geral *
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {renderStars(
                          modalHoveredStar || nota,
                          "text-2xl",
                          true,
                          setModalHoveredStar,
                          () => setModalHoveredStar(0),
                          setNota
                        )}
                      </div>
                      <span className="text-lg font-medium text-gray-700 ml-3">
                        {modalHoveredStar || nota ? (
                          `${modalHoveredStar || nota}.0 - ${
                            (modalHoveredStar || nota) === 5 ? 'Excelente' :
                            (modalHoveredStar || nota) === 4 ? 'Muito Bom' :
                            (modalHoveredStar || nota) === 3 ? 'Bom' :
                            (modalHoveredStar || nota) === 2 ? 'Regular' : 'Ruim'
                          }`
                        ) : 'Selecione uma nota'}
                      </span>
                    </div>
                  </div>

                  {/* Título do review */}
                  <div>
                    <label className="block font-bold text-gray-800 mb-2">
                      Título do Review *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                      placeholder="Ex: Experiência incrível!"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                    />
                  </div>

                  {/* Comentário */}
                  <div>
                    <label className="block font-bold text-gray-800 mb-2">
                      Seu Comentário *
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Conte sobre sua experiência..."
                      rows="4"
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {comentario.length}/500 caracteres
                    </p>
                  </div>

                  {/* Cidade */}
                  <div>
                    <label className="block font-bold text-gray-800 mb-2">
                      Cidade do Atendimento *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                      placeholder="Ex: São Paulo - SP"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                    />
                  </div>

                  {/* Status/erro */}
                  {status && (
                    <motion.div
                      className="bg-red-50 border border-red-200 rounded-xl p-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      <p className="text-red-700 text-sm">{status}</p>
                    </motion.div>
                  )}

                  {/* Botões */}
                  <div className="flex space-x-4 pt-4">
                    <motion.button
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      onClick={handleSubmit}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaHeart />
                      <span>Publicar Review</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}