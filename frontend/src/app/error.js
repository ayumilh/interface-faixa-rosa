'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = dynamic(() => import('@/components/Navbar'));
const Footer = dynamic(() => import('@/components/Home/footer'));

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar bgColor="white" />

      {/* Compensa altura do Navbar */}
      <div className="h-[80px] sm:h-[90px]" />

      <div className="flex flex-1 flex-col items-center justify-center text-center px-4">
        <Image
          src="/og-image.png"
          alt="Faixa Rosa"
          width={200}
          height={105}
          className="mb-6"
        />
        <h1 className="text-6xl font-bold text-red-600 mb-4">Erro!</h1>
        <h2 className="text-2xl font-semibold mb-2">Algo deu errado.</h2>
        <p className="text-gray-600 mb-6">
          Desculpe, ocorreu um erro inesperado. Tente novamente ou volte para a página inicial.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => reset()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-full transition"
          >
            Voltar para a Home
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
