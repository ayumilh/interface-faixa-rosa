'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default function ConsentModal() {
    const [showWarning, setShowWarning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 100);
        const consentGiven = localStorage.getItem('adultConsent');
        if (!consentGiven) {
            setShowWarning(true);
        }
        return () => clearTimeout(timer);
    }, []);

    const handleAgree = useCallback(async () => {
        setIsLoading(true);
        
        try {
            localStorage.setItem('adultConsent', 'true');
            
            // Gera o browser_fingerprint
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            const fingerprint = result.visitorId;

            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consent/save`, {
                accepted: true,
                browser_fingerprint: fingerprint,
            });
            
            // Smooth exit animation
            setTimeout(() => {
                setShowWarning(false);
            }, 300);
        } catch (error) {
            console.error('Erro ao registrar consentimento:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleLearnMore = useCallback(() => {
        router.push("/termos");
    }, [router]);

    if (!showWarning) return null;

    return (
        <>
            {/* Backdrop with blur effect */}
            <div 
                className={`fixed inset-0 z-50 transition-all duration-700 ${
                    mounted ? 'backdrop-blur-md bg-black/80' : 'bg-black/0'
                }`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="warning-title"
                aria-describedby="warning-description"
            >
                {/* Animated background particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-4 -right-4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-400/10 to-purple-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Modal container with enhanced animations */}
                <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
                    <div 
                        className={`relative w-full max-w-md mx-auto transform transition-all duration-700 ${
                            mounted ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
                        }`}
                    >
                        {/* Glowing border effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
                        
                        {/* Main modal */}
                        <div className="relative bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                            {/* Animated gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-purple-500/5 animate-pulse"></div>
                            
                            {/* Content */}
                            <div className="relative p-6 sm:p-8 text-center">
                                {/* Logo section with enhanced effects */}
                                <div className="relative mb-6">
                                    <div className="relative inline-block">
                                        {/* Glow effect behind logo */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                                        
                                        {/* Logo */}
                                        <div className="relative bg-gradient-to-r from-pink-500 to-purple-500 p-1 rounded-full">
                                            <div className="bg-black rounded-full p-3">
                                                <img 
                                                    src="/favicon.ico" 
                                                    alt="Logo do Faixa Rosa" 
                                                    className="w-8 h-8 sm:w-10 sm:h-10" 
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* 18+ Badge */}
                                        <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-black px-2 py-1 rounded-full shadow-lg animate-bounce">
                                            18+
                                        </div>
                                    </div>
                                </div>

                                {/* Title with gradient text */}
                                <h2 
                                    id="warning-title" 
                                    className="text-2xl sm:text-3xl font-black mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse"
                                >
                                    CONTEÚDO ADULTO
                                </h2>

                                {/* Decorative line */}
                                <div className="w-full h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent mb-6 opacity-50"></div>

                                {/* Description */}
                                <div className="space-y-4 text-gray-300">
                                    <p id="warning-description" className="text-sm sm:text-base leading-relaxed">
                                        Entenda que o{' '}
                                        <span className="font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                            Faixa Rosa
                                        </span>{' '}
                                        apresenta <strong className="text-white">Conteúdo Explícito</strong> destinado a{' '}
                                        <strong className="text-white">adultos</strong>.
                                    </p>

                                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                                        <p className="text-xs sm:text-sm">
                                            <strong className="text-pink-400">AVISO DE COOKIES</strong>
                                            <br />
                                            <span className="text-gray-400">
                                                Usamos cookies e tecnologias similares para melhorar sua experiência.
                                            </span>
                                        </p>
                                    </div>

                                    <p className="text-xs text-gray-500 italic">
                                        A profissão de acompanhante é legalizada no Brasil e deve ser respeitada.
                                    </p>
                                </div>

                                {/* Action buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
                                    <button
                                        onClick={handleLearnMore}
                                        className="group relative px-6 py-3 text-sm font-semibold text-gray-300 hover:text-white transition-all duration-300 rounded-lg border border-white/20 hover:border-pink-500/50 hover:bg-white/5 backdrop-blur-sm"
                                        disabled={isLoading}
                                    >
                                        <span className="relative z-10">Saiba mais</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/10 group-hover:to-purple-500/10 rounded-lg transition-all duration-300"></div>
                                    </button>

                                    <button
                                        onClick={handleAgree}
                                        disabled={isLoading}
                                        className="group relative px-8 py-3 font-bold text-white overflow-hidden rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {/* Animated background */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-size-200 animate-gradient-x"></div>
                                        
                                        {/* Button content */}
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {isLoading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Processando...</span>
                                                </>
                                            ) : (
                                                'CONCORDO'
                                            )}
                                        </span>
                                        
                                        {/* Hover effect */}
                                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes gradient-x {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }
                
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease infinite;
                }
                
                .bg-size-200 {
                    background-size: 200% 200%;
                }
            `}</style>
        </>
    );
}