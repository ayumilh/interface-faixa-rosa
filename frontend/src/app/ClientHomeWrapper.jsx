"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from 'next/dynamic';
import Image from "next/image";
import ConsentModal from "../components/ConsentModal";

// Interativos + ssr false ou client hooks
const VSLSection = dynamic(() => import("../components/Home/vsl"), { ssr: false });
const Navbar = dynamic(() => import("../components/Navbar"));

export default function ClientHomeWrapper() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Inicializando...');
  const [mounted, setMounted] = useState(false);

  const loadingSteps = [
    'Inicializando...',
    'Carregando recursos...',
    'Preparando interface...',
    'Otimizando experiência...',
    'Finalizando...'
  ];

  useEffect(() => setMounted(true), []);

  const handleLoadComplete = useCallback(() => setTimeout(() => setLoading(false), 300), []);

  useEffect(() => {
    if (!mounted) return;

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
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

    const preloadImage = new window.Image();
    preloadImage.src = '/og-image.png';

    const minLoadTime = setTimeout(() => {
      if (progress < 100) setProgress(100);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(minLoadTime);
    };
  }, [mounted, handleLoadComplete, progress]);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = loading ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading, mounted]);

  if (!mounted) return null;

  return (
    <>
      {loading && (
        <div className="loading-screen">
          <div className="loading-container">
            <div className="logo-container">
              <Image
                src="/og-image.png"
                alt="Faixa Rosa"
                width={200}
                height={105}
                className="w-40 h-auto sm:w-48 md:w-52 opacity-90"
                priority
                quality={90}
                style={{ objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}
              />
            </div>
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
              </div>
              <div className="progress-percentage">{Math.round(Math.min(progress, 100))}%</div>
            </div>
            <div className="loading-text">{loadingText}</div>
          </div>
        </div>
      )}

      {!loading && (
        <>
          <Navbar bgColor="white" />
          <ConsentModal />
          <VSLSection />
        </>
      )}
    </>
  );
}
