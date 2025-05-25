"use client";
import { useState, useCallback, memo } from "react";
import { Clock, Fire, ArrowRight, CaretLeft, CaretRight, Article } from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const Blog = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState({});

  const articles = [
    {
      id: 1,
      title: "Diversidade e Inclusão: O Faixa Rosa Como Espaço Livre de Discriminação",
      description: "No universo da plataforma Faixa Rosa, a diversidade é celebrada e a inclusão é um valor fundamental que permeia todas as nossas ações...",
      image: "/files/images/Blog01.png",
      author: "Faixa Rosa",
      date: "22 de abril de 2024",
      link: "https://faixarosa.blog/por-que-anunciar-no-faixa-rosa/",
      category: "Inclusão",
      readTime: "5 min"
    },
    {
      id: 2,
      title: "A Importância da Segurança Digital para Anunciantes: Dicas do Faixa Rosa",
      description: "No cenário digital em constante evolução, a segurança online tornou-se uma prioridade inegável para todos os profissionais...",
      image: "/files/images/Blog02.png",
      author: "Faixa Rosa",
      date: "24 de julho de 2023",
      link: "https://faixarosa.blog/diversidade-e-inclusao-o-faixa-rosa-como-espaco-livre-de-discriminacao/",
      category: "Segurança",
      readTime: "8 min"
    },
    {
      id: 3,
      title: "Por que Anunciar no Faixa Rosa?",
      description: "Se você está no mundo dos anúncios, provavelmente já percebeu que a escolha da plataforma certa pode fazer toda a diferença...",
      image: "/files/images/Blog03.png",
      author: "Faixa Rosa",
      date: "4 de abril de 2024",
      link: "https://faixarosa.blog/dicas-faixarosa/",
      category: "Marketing",
      readTime: "6 min"
    },
  ];

  const nextArticle = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
  }, [articles.length]);

  const prevArticle = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + articles.length) % articles.length);
  }, [articles.length]);

  const goToArticle = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const handleImageLoad = useCallback((articleId) => {
    setImageLoading(prev => ({ ...prev, [articleId]: false }));
  }, []);

  const handleImageLoadStart = useCallback((articleId) => {
    setImageLoading(prev => ({ ...prev, [articleId]: true }));
  }, []);

  return (
    <div className="flex flex-col items-center py-12 md:py-16 bg-white">
      {/* Header Section */}
      <motion.div
        className="text-center mb-8 md:mb-12 max-w-4xl mx-auto px-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Article size={32} className="text-pink-500 hidden sm:block" weight="duotone" />
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 font-sans">
            É acompanhante? Confira mais conteúdos para melhorar seus resultados
          </h2>
        </div>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
          Artigos exclusivos com dicas práticas para alavancar sua carreira e maximizar seus resultados
        </p>
      </motion.div>

      {/* Mobile Carousel */}
      <div className="w-full max-w-sm md:hidden px-4">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl shadow-lg overflow-hidden border border-gray-200"
              style={{ backgroundColor: '#EDF1F3' }}
            >
              {/* Image Container */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                {imageLoading[articles[currentIndex].id] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full"
                    />
                  </div>
                )}
                <Image
                  src={articles[currentIndex].image}
                  alt={articles[currentIndex].title}
                  width={400}
                  height={250}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onLoadStart={() => handleImageLoadStart(articles[currentIndex].id)}
                  onLoad={() => handleImageLoad(articles[currentIndex].id)}
                />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {articles[currentIndex].category}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                  {articles[currentIndex].title}
                </h3>
                
                {/* Meta Info */}
                <div className="flex items-center text-gray-500 text-sm mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-1">
                    <Fire size={14} className="text-pink-500" weight="duotone" />
                    <span>{articles[currentIndex].author}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-gray-400" weight="duotone" />
                    <span>{articles[currentIndex].date}</span>
                  </div>
                  <span className="bg-white/80 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {articles[currentIndex].readTime}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {articles[currentIndex].description}
                </p>

                <motion.a
                  href={articles[currentIndex].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-pink-500 font-semibold hover:text-pink-600 transition-colors group"
                  whileHover={{ x: 5 }}
                >
                  Saiba mais
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" weight="bold" />
                </motion.a>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-6">
            <motion.button
              onClick={prevArticle}
              className="flex items-center gap-2 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl shadow-md border border-gray-200 transition-colors"
              style={{ backgroundColor: '#EDF1F3' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CaretLeft size={16} weight="bold" />
              Anterior
            </motion.button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {articles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToArticle(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-pink-500 w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <motion.button
              onClick={nextArticle}
              className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-xl shadow-md transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Próximo
              <CaretRight size={16} weight="bold" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Desktop Grid */}
      <motion.div
        className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full max-w-7xl px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
            style={{ backgroundColor: '#EDF1F3' }}
          >
            {/* Image Container */}
            <div className="relative h-48 lg:h-52 bg-gray-200 overflow-hidden">
              {imageLoading[article.id] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full"
                  />
                </div>
              )}
              <Image
                src={article.image}
                alt={article.title}
                width={600}
                height={300}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onLoadStart={() => handleImageLoadStart(article.id)}
                onLoad={() => handleImageLoad(article.id)}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4 bg-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                {article.category}
              </div>

              {/* Read Time Badge */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                {article.readTime}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-pink-600 transition-colors">
                {article.title}
              </h3>
              
              {/* Meta Info */}
              <div className="flex items-center text-gray-500 text-sm mb-4 flex-wrap gap-3">
                <div className="flex items-center gap-1">
                  <Fire size={14} className="text-pink-500" weight="duotone" />
                  <span>{article.author}</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1">
                  <Clock size={14} className="text-gray-400" weight="duotone" />
                  <span>{article.date}</span>
                </div>
              </div>

              <p className="text-sm lg:text-base text-gray-600 mb-5 line-clamp-3 leading-relaxed">
                {article.description}
              </p>

              <motion.a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-pink-500 font-semibold hover:text-pink-600 transition-colors group/link"
                whileHover={{ x: 5 }}
              >
                Saiba mais
                <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" weight="bold" />
              </motion.a>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="mt-12 md:mt-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.a
          href="https://faixarosa.blog"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Article size={20} weight="duotone" />
          Ver todos os artigos
          <ArrowRight size={18} weight="bold" />
        </motion.a>
      </motion.div>
    </div>
  );
});

Blog.displayName = 'Blog';

export default Blog;