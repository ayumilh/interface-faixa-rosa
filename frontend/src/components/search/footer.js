import { FaVideo } from "react-icons/fa";
import { MdPerson } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white shadow-md z-50">
      <div className="flex justify-around items-center py-2 bg-white border-t mt-2">
        <Link href="/cadastro" className="flex flex-col items-center text-center text-gray-700 hover:text-pink-500">
          <MdPerson className="text-2xl mb-1" />
          <span className="text-xs font-medium">Cadastre Grátis</span>
        </Link>

        <Link href="/search" className="flex flex-col items-center text-center text-gray-700 hover:text-pink-500">
          <Image src="/favicon.ico" alt="Acompanhantes" width={24} height={24} className="h-6 mb-1" /> {/* Usando favicon.ico como ícone */}
          <span className="text-xs font-medium text-pink-500">Anunciantes</span>
        </Link>

        <Link href="/videos" className="relative flex flex-col items-center text-center text-gray-700 hover:text-pink-500">
          <FaVideo className="text-2xl mb-1" />
          <span className="absolute top-0 right-0 bg-pink-500 text-white rounded-full text-xs px-1">61</span>
          <span className="text-xs font-medium">Vídeos</span>
        </Link>
      </div>
    </footer>
  );
}
