"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = dynamic(() => import('@/components/Navbar'));
const Footer = dynamic(() => import('@/components/Home/footer'));

// Ícone de volta otimizado
const ArrowLeftIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

// Ícone 404 melhorado
const NotFoundIcon = ({ className = "w-16 h-16" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function NotFound() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar bgColor="white" />
      
      <div className="h-[80px] sm:h-[90px]" />

      {/* Botão voltar no topo esquerdo */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <motion.button
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ x: -2 }}
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Voltar</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isLoaded && (
          <motion.main
            className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-full max-w-md mx-auto text-center">
              
              {/* Ícone principal */}
              <motion.div
                className="flex justify-center mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                <motion.div
                  className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center shadow-lg"
                  whileHover={{ 
                    scale: 1.05,
                    rotate: 5,
                    boxShadow: "0 20px 40px -12px rgba(236, 72, 153, 0.2)"
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <NotFoundIcon className="w-12 h-12 sm:w-16 sm:h-16 text-pink-600" />
                </motion.div>
              </motion.div>

              {/* Código 404 */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <h1 className="text-7xl sm:text-8xl lg:text-9xl font-black text-gray-900 tracking-tight mb-4">
                  404
                </h1>
              </motion.div>

              {/* Título e descrição */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Página não encontrada
                </h2>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  A página que você está procurando não existe ou foi movida.
                </p>
              </motion.div>

              {/* Informação adicional */}
              <motion.div
                className="mt-12 pt-8 border-t border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <p className="text-sm text-gray-500">
                  Erro 404 • Use o botão voltar para retornar
                </p>
              </motion.div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}