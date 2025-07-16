"use client";

import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SEOContent from "./generateMetadata"; // ou onde estiver seu SEOContent
import Footer     from "../../../components/search/footer";

// lazy imports
const Navbar   = dynamic(() => import("../../../components/Navbar"));
const Stories  = dynamic(() => import("../../../components/search/stories"));
const Fotos    = dynamic(() => import("../../../components/perfil/fotos"));
const Videos   = dynamic(() => import("../../../components/perfil/videos"));
const Sobre    = dynamic(() => import("../../../components/perfil/sobre"));
const Local    = dynamic(() => import("../../../components/perfil/localidade"));
const Servicos = dynamic(() => import("../../../components/perfil/serviços"));
const Valores  = dynamic(() => import("../../../components/perfil/valores"));
const ModalBusca = dynamic(() => import("./ModalBusca"), { ssr: false });
// … importe também seus outros modals e ActionButtons

// spinner de loading global
function FullscreenLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <Image
        src="/iconOficial_faixaRosa.png"
        width={64}
        height={64}
        alt="Carregando"
        className="animate-spin"
      />
    </div>
  );
}

export default function ClientPerfilWrapper() {
  const { userName } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  // … estados e lógica de fetch do perfil e mais acompanhantes …

  // Exemplo simplificado:
  useEffect(() => {
    async function load() {
      // fetch do perfil
      // setCompanionData(...)
      // fetchMoreCompanions(...)
      setIsLoading(false);
    }
    load();
  }, [userName]);

  if (isLoading) {
    return <FullscreenLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="h-16 bg-white" />}>
        <Navbar bgColor="white" />
      </Suspense>

      {/* --- seu JSX de perfil (banner, foto, tabs, etc) --- */}
      {/* ... */}

      {/* depois do conteúdo principal, renderize SEOContent e Footer */}
      <SEOContent params={{ userName }} />

      <Footer />
    </div>
  );
}
