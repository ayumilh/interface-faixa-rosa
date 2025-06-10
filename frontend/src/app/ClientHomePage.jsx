'use client';
import { useEffect, useState, useCallback } from "react";
import dynamic from 'next/dynamic';
import Image from "next/image";
import ConsentModal from "@/components/ConsentModal";

// Lazy loading otimizado
const HeroSection = dynamic(() => import("@/components/Home/hero"));
const VSLSection = dynamic(() => import("@/components/Home/vsl"), { ssr: false });
const TopAnunciantes = dynamic(() => import("@/components/Home/topAnunciantes"));
const BlogSection = dynamic(() => import("@/components/Home/blog"));
const Footer = dynamic(() => import("@/components/Home/footer"));
const VerMais = dynamic(() => import("@/components/Home/vermais"));
const Navbar = dynamic(() => import("@/components/Navbar"));

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Inicializando...');
  const [mounted, setMounted] = useState(false);

  // Fix hydration issue
  useEffect(() => {
    setMounted(true);
  }, []);

  // Textos de loading mais profissionais
  const loadingSteps = [
    'Inicializando...',
    'Carregando recursos...',
    'Preparando interface...',
    'Otimizando experiência...',
    'Finalizando...'
  ];

  const handleLoadComplete = useCallback(() => {
    setTimeout(() => setLoading(false), 300);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
        
        // Atualiza texto baseado no progresso
        const stepIndex = Math.floor((newProgress / 100) * loadingSteps.length);
        if (stepIndex !== currentStep && stepIndex < loadingSteps.length) {
          currentStep = stepIndex;
          setLoadingText(loadingSteps[stepIndex]);
        }
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setLoadingText('Pronto!');
          setTimeout(handleLoadComplete, 200);
          return 100;
        }
        return newProgress;
      });
    }, 150);

    // Pré-carrega recursos críticos
    const preloadImage = new window.Image();
    preloadImage.src = '/og-image.png';
    
    // Tempo mínimo de loading
    const minLoadTime = setTimeout(() => {
      if (progress < 100) {
        setProgress(100);
      }
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(minLoadTime);
    };
  }, [mounted, handleLoadComplete, progress]);

  // Controle de scroll durante loading
  useEffect(() => {
    if (!mounted) return;
    
    const body = document.body;
    
    if (loading) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
    
    return () => {
      body.style.overflow = '';
    };
  }, [loading, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <style jsx global>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes progressFlow {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes loadingExit {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.95);
          }
        }
        
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease-out;
        }
        
        .loading-screen.exiting {
          animation: loadingExit 0.3s ease-out forwards;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 400px;
          width: 100%;
          padding: 0 1.5rem;
          animation: slideInUp 0.6s ease-out;
        }
        
        .logo-container {
          margin-bottom: 2rem;
          animation: logoFloat 3s ease-in-out infinite;
        }
        
        .progress-container {
          width: 100%;
          margin-bottom: 1.5rem;
        }
        
        .progress-bar {
          width: 100%;
          height: 4px;
          background-color: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
          border-radius: 2px;
          transition: width 0.3s ease-out;
          position: relative;
        }
        
        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: progressFlow 1.5s ease-in-out infinite;
        }
        
        .loading-text {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
          text-align: center;
          animation: pulse 2s ease-in-out infinite;
          min-height: 1.25rem;
        }
        
        .progress-percentage {
          color: #475569;
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 0.5rem;
          text-align: center;
        }
        
        .content-wrapper {
          animation: slideInUp 0.8s ease-out;
        }
        
        /* Responsividade */
        @media (max-width: 640px) {
          .loading-container {
            padding: 0 1rem;
            max-width: 320px;
          }
          
          .logo-container {
            margin-bottom: 1.5rem;
          }
          
          .loading-text {
            font-size: 0.8rem;
          }
        }
        
        @media (max-width: 480px) {
          .loading-container {
            max-width: 280px;
          }
          
          .progress-bar {
            height: 3px;
          }
        }
        
      /* Modo claro fixo */
.loading-screen {
  background: white; /* Fundo branco */
}

.progress-bar {
  background-color: #e5e7eb; /* Cinza claro */
}

.loading-text {
  color: #1e293b; /* Cinza escuro */
}

.progress-percentage {
  color: #0f172a; /* Azul bem escuro */
}

      `}</style>

      {/* Loading Screen Profissional */}
      {loading && (
        <div className="loading-screen">
          <div className="loading-container">
            {/* Logo */}
            <div className="logo-container">
              <Image
                src="/og-image.png"
                alt="Faixa Rosa"
                width={200}
                height={105}
                className="w-40 h-auto sm:w-48 md:w-52 opacity-90"
                priority
                quality={90}
                style={{ 
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))'
                }}
              />
            </div>

            {/* Barra de Progresso */}
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="progress-percentage">
                {Math.round(Math.min(progress, 100))}%
              </div>
            </div>

            {/* Texto de Loading */}
            <div className="loading-text">
              {loadingText}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Consentimento */}
      {!loading && <ConsentModal />}

      {/* Conteúdo Principal */}
      {!loading && (
        <div className="content-wrapper min-h-screen bg-white">
          <Navbar bgColor="white" />
          <HeroSection />
          <VSLSection />
          <TopAnunciantes />
          <BlogSection />
          <VerMais />
          <Footer />
        </div>
      )}
    </>
  );
}