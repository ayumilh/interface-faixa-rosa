"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/search/footer";
import Parte01 from "@/components/home/parte01";
import Top5 from "@/components/search/top5";
import VideoSection from "@/components/search/VideoSection";
import Blog from "@/components/search/blog";
import Final from "@/components/search/final"; // Importado apenas uma vez

export default function Home() {
  const [showWarning, setShowWarning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const lastShown = localStorage.getItem("lastWarningShown");

    if (!lastShown || lastShown !== today) {
      setShowWarning(true);
    }
  }, []);

  const handleAgree = async () => {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("lastWarningShown", today);
    try {
      await fetch("/api/saveConsent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: today, consentGiven: true }),
      });
    } catch (error) {
      console.error("Erro ao salvar consentimento:", error);
    }
    setShowWarning(false);
  };

  const handleLearnMore = () => {
    router.push("/termos");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Head>
        <title>Faixa Rosa | Conteúdo Adulto com Responsabilidade</title>
        <meta
          name="description"
          content="Faixa Rosa oferece conteúdo adulto explícito destinado a adultos, com respeito e responsabilidade. Explore nossos vídeos, blogs e interaja conosco nas redes sociais."
        />
        <meta
          name="keywords"
          content="Faixa Rosa, conteúdo adulto, vídeos adultos, blogs adultos, entretenimento adulto, redes sociais adultas"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Faixa Rosa | Conteúdo Adulto com Responsabilidade" />
        <meta
          property="og:description"
          content="Descubra conteúdo adulto explícito e de alta qualidade no Faixa Rosa. Visite-nos para vídeos, blogs e interaja através de nossas redes sociais."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://faixarosa.com.br/" />
        <meta property="og:image" content="https://faixarosa.com.br/og-image.jpg" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Faixa Rosa | Conteúdo Adulto com Responsabilidade" />
        <meta
          name="twitter:description"
          content="Explore conteúdo adulto explícito e de qualidade no Faixa Rosa. Assista a vídeos, leia blogs e conecte-se conosco nas redes sociais."
        />
        <meta name="twitter:image" content="https://faixarosa.com.br/twitter-image.jpg" />
        {/* Dados Estruturados */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Faixa Rosa",
              "url": "https://faixarosa.com.br/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://faixarosa.com.br/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
              "sameAs": [
                "https://www.instagram.com/faixa.rosa.br?igsh=cmdhcTVkM3FyZjNp",
                "https://www.tiktok.com/@faixa.rosa.br?_t=8lAQyHcuUKs&_r=1",
                "https://youtube.com/@faixa.rosa.br.?si=QU2dXkgl1e3rkYn6",
                "https://x.com/faixarosabr10?s=21",
                "https://t.me/+NPqKr1BHnoYyZWNh",
                "https://chat.whatsapp.com/JhN54ArwFFy73rjnXWwxUv"
              ],
            }),
          }}
        />
      </Head>

      <Navbar />

      {showWarning && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="warning-title"
          aria-describedby="warning-description"
        >
          <div
            className="bg-black p-6 rounded-lg shadow-lg text-center relative w-full max-w-md mx-auto border-4 border-transparent"
            style={{
              borderImage: "linear-gradient(90deg, #ff007f, #ff33aa, #cc00ff) 1",
            }}
          >
            <div className="relative mb-4">
              <img src="/favicon.ico" alt="Logo do Faixa Rosa" className="w-12 h-12 mx-auto" />
              <span
                className="absolute text-white font-bold text-lg"
                style={{ top: "70%", left: "50%", transform: "translate(-50%, -50%)" }}
              >
                18+
              </span>
            </div>
            <h2 id="warning-title" className="text-2xl text-white font-bold mt-4">
              CONTEÚDO ADULTO
            </h2>
            <hr className="border-gray-700 my-4" />
            <p id="warning-description" className="text-gray-300 mt-4">
              Entenda que o{" "}
              <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff007f] via-[#ff33aa] to-[#cc00ff]">
                Faixa Rosa
              </span>{" "}
              apresenta <strong>Conteúdo Explícito</strong> destinado a <strong>adultos</strong>.
            </p>
            <p className="text-gray-300 mt-2">
              <strong>AVISO DE COOKIES</strong>
              <br />
              Nós usamos cookies e outras tecnologias para melhorar sua experiência no site.
            </p>
            <p className="text-gray-400 mt-4 text-xs">
              A profissão de acompanhante é legalizada no Brasil e deve ser respeitada.
            </p>
            <div className="flex justify-center mt-6 space-x-4">
              <button
                onClick={handleLearnMore}
                className="bg-transparent bg-clip-text text-transparent bg-gradient-to-r from-[#ff007f] via-[#ff33aa] to-[#cc00ff] underline font-bold"
              >
                Saiba mais
              </button>
              <button
                onClick={handleAgree}
                className="mt-6 py-2 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-[#ff007f] via-[#ff33aa] to-[#cc00ff] hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                CONCORDO
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow pb-16">
        <div className="flex flex-col items-center text-gray-800">
          <Parte01 />
          <section className="text-center mt-8 mb-8">
            {/* Adicione conteúdo relevante aqui */}
          </section>
          <VideoSection />
          <Top5 />
          <Blog />
        </div>
      </main>

      <Footer />
      <Final /> {/* Utilizado separadamente conforme estrutura original */}
    </div>
  );
}
