'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default function ConsentModal() {
    const [showWarning, setShowWarning] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const consentGiven = localStorage.getItem('adultConsent');
        if (!consentGiven) {
            setShowWarning(true);
        }
    }, []);

    const handleAgree = async () => {
        localStorage.setItem('adultConsent', 'true');
        setShowWarning(false);

        try {
            // Gera o browser_fingerprint
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            const fingerprint = result.visitorId;

            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consent/save`, {
                accepted: true,
                browser_fingerprint: fingerprint,
            });
        } catch (error) {
            console.error('Erro ao registrar consentimento:', error);
        }
    };

    const handleLearnMore = () => {
        router.push("/termos");
    };

    if (!showWarning) return null;

    return (
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
                    borderImage: 'linear-gradient(90deg, #ff007f, #ff33aa, #cc00ff) 1',
                }}
            >
                <div className="relative mb-4">
                    <img src="/favicon.ico" alt="Logo do Faixa Rosa" className="w-12 h-12 mx-auto" />
                    <span
                        className="absolute text-white font-bold text-lg"
                        style={{ top: '70%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    >
                        18+
                    </span>
                </div>
                <h2 id="warning-title" className="text-2xl text-white font-bold mt-4">
                    CONTEÚDO ADULTO
                </h2>
                <hr className="border-gray-700 my-4" />
                <p id="warning-description" className="text-gray-300 mt-4">
                    Entenda que o{' '}
                    <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff007f] via-[#ff33aa] to-[#cc00ff]">
                        Faixa Rosa
                    </span>{' '}
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
    );
}
