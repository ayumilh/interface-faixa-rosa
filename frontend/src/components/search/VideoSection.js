import { useEffect } from "react";
import Image from "next/image";

export default function VideoSection() {
  useEffect(() => {
    // Carrega o script do Atena Video ao montar o componente
    const script = document.createElement("script");
    script.src = "https://app.atenavideo.com.br/atenavideo.min.js";
    script.async = true;
    document.body.appendChild(script);

    // Inicializa o vídeo após o script ser carregado
    script.onload = () => {
      if (window.atenavideo) {
        window.atenavideo("#video-container");
      }
    };

    // Limpa o script ao desmontar o componente para evitar duplicação
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex flex-col items-center py-12 bg-gray-50 -mt-10 md:-mt-16 lg:-mt-72">
    <h2 className="text-2xl md:text-4xl font-bold text-center mb-6 text-gray-800">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#000000] via-[#000000] to-[#000000]">
        A
      </span>{" "}
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff007f] via-[#ff33aa] to-[#8000ff]">
        Nova Era
      </span>{" "}
      em{" "}
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#000000] via-[#000000] to-[#000000]">
        anúncios
      </span>{" "}
      no{" "}
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00ff00] to-[#ffcd2c] font-extrabold">
        Brasil!
      </span>
    </h2>
    <div
      id="video-container"
      data-video-id="0192dfaf-9292-700a-80bc-75be98388ad0"
      data-url="https://app.atenavideo.com.br"
      className="w-full max-w-lg aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-lg"
    ></div>
  

      {/* Crédito abaixo do vídeo */}
      <a
        href="https://atenavideo.com.br"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center"
      >
        <Image
          src="/assets/logoAtenaVideo.png"
          alt="Made in Atena Video"
          width={100} // Ajuste para tornar a logo responsiva
          height={28} // Ajuste para manter a proporção
          className="object-contain"
        />
      </a>
    </div>
  );
}
