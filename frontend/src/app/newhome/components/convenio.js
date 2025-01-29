"use client";
import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Star, CheckCircle } from "phosphor-react";

export default function ConvenioSection() {
  return (
    <div className="relative flex justify-center py-10 px-4">
      {/* Card Principal */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-white text-gray-900 rounded-lg shadow-lg max-w-lg w-full px-6 py-8 border border-gray-200 hover:border-pink-500 transition-all duration-300"
      >
        {/* Ícone no topo */}
        <div className="flex justify-center mb-3">
          <Star size={40} className="text-pink-500" />
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Benefícios Exclusivos
        </h2>

        {/* Descrição */}
        <p className="text-sm text-gray-600 text-center mt-2">
          Anunciantes têm acesso a convênios especiais com hotéis, academias e mais!
        </p>

        {/* Benefícios */}
        <div className="flex justify-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <CheckCircle size={20} className="text-green-500" />
            <span className="text-sm text-gray-700">Descontos</span>
          </div>
          <div className="flex items-center space-x-2">
            <Briefcase size={20} className="text-blue-500" />
            <span className="text-sm text-gray-700">Parcerias</span>
          </div>
        </div>

        {/* Botão de Ação */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 mt-5 mx-auto"
        >
          Acessar Convênios
        </motion.button>
      </motion.div>
    </div>
  );
}
