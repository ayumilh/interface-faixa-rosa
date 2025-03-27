'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Final from '@/components/search/final';
import { IoIosArrowBack } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";


import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from "react-toastify";

const PagamentoRetorno = () => {
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [paymentDescription, setPaymentDescription] = useState('');
    const [qrCodeData, setQrCodeData] = useState(null);
    const [storedQRCode, setStoredQRCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    const router = useRouter();
    const [redirect, setRedirect] = useState(false);

    let storedQRCode64 = '';
    let transactionId = '';

    useEffect(() => {
        const userToken = Cookies.get('userToken');
        transactionId = localStorage.getItem('transactionId');

        if (!userToken || !transactionId) {
            router.push('/planos');
            return;
        }

        // Simular uma requisição para verificar o status do pagamento
        if (transactionId) {
            axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/checkout/status/${transactionId}`,
                // `http://localhost:4000/api/payments/checkout/status/${transactionId}`,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                })
                .then(response => {
                    const paymentData = response.data;

                    if (paymentData.paymentStatus === 'approved') {
                        setPaymentStatus('Pagamento aprovado!');
                        setPaymentDescription('Seu pagamento foi processado com sucesso! Você pode acessar sua conta agora.');

                        // Remover o localStorage quando o pagamento for aprovado
                        localStorage.removeItem('paymentQRCode');
                        localStorage.removeItem('paymentQRCode64');
                        localStorage.removeItem('transactionId');
                    } else if (paymentData.paymentStatus === 'pending') {
                        setPaymentStatus('Pagamento pendente!');
                        setPaymentDescription('Pagamento está em analise. Você receberá uma notificação quando for confirmado.');

                        const localStoredQRCode = localStorage.getItem('paymentQRCode');
                        storedQRCode64 = localStorage.getItem('paymentQRCode64');

                        if (localStoredQRCode) {
                            setStoredQRCode(localStoredQRCode);
                        }
                        if (storedQRCode64) {
                            setQrCodeData(storedQRCode64);
                        }
                    } else if (paymentData.paymentStatus === 'refused') {
                        setPaymentStatus('Pagamento recusado!');
                        setPaymentDescription('Pagamento recusado. Verifique suas informações de pagamento e tente novamente.');

                        // Remover o localStorage quando o pagamento for aprovado
                        localStorage.removeItem('paymentQRCode');
                        localStorage.removeItem('paymentQRCode64');
                        localStorage.removeItem('transactionId');
                    }
                })
                .catch((err) => {
                    setError('Erro ao verificar o pagamento.');
                })
                .finally(() => setLoading(false));
        } else {
            setError('Transaction ID não encontrado.');
            setLoading(false);
        }
    }, []);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(storedQRCode) // Copia o conteúdo do QR Code
            .then(() => {
                setIsCopied(true); // Marca como copiado
                setTimeout(() => setIsCopied(false), 2000); // Reseta o estado após 2 segundos
                toast.success('QR Code copiado com sucesso!'); // Exibe mensagem de sucesso
            })
            .catch((err) => console.error('Erro ao copiar o texto: ', err));
    };

    const handleLinkClick = () => {
        // Limpar o localStorage ao clicar no Link
        localStorage.removeItem('paymentQRCode');
        localStorage.removeItem('paymentQRCode64');
        localStorage.removeItem('transactionId');
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#ebeff2]">
            <Navbar />

            <main className="flex-grow flex flex-col items-center w-full mt-16 sm:mt-24 px-4 sm:px-6 lg:px-8">

                {/* Breadcrumbs */}
                <div className="w-full mx-auto p-4 bg-cover flex justify-start items-center">
                    <Link href="/planos" onClick={handleLinkClick} className="flex items-center text-pink-500 hover:text-pink-700">
                        <IoIosArrowBack className="text-2xl" />
                    </Link>

                    <nav className="text-sm text-gray-700 ml-6">
                        <Link href="/" onClick={handleLinkClick} className="text-pink-500 hover:text-pink-700">Início</Link>
                        <span className="mx-2">/</span>
                        <Link href="/planos" onClick={handleLinkClick} className="text-pink-500 hover:text-pink-700">Planos</Link>   {/* incluir o redirecionamento */}
                        <span className="mx-2">/</span>
                        <span className="text-gray-500">Pagamento</span>
                    </nav>
                </div>

                {/* Hero Section de Confirmação */}
                <section className="relative bg-center bg-cover w-full h-56 sm:h-80 md:h-96 lg:h-[500px] mb-12 rounded-lg overflow-hidden shadow-2xl" style={{ backgroundImage: 'url("/Banner-elite-faixa.png")' }}>
                    {/* Overlay Escuro */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>

                    {/* Conteúdo */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 py-6 sm:py-12">
                        {/* Título */}
                        <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-5xl font-extrabold text-white leading-snug mb-4 sm:mb-6">
                            Processo de Pagamento
                        </h1>

                        {/* Descrição */}
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 max-w-md sm:max-w-xl leading-normal sm:leading-relaxed mb-4 sm:mb-6">
                            {paymentDescription}
                        </p>
                    </div>
                </section>

                {paymentStatus === 'Pagamento aprovado!' ? (
                    <div className="w-full flex flex-col items-center max-w-4xl mx-auto">
                        <h3 className="text-2xl font-semibold mb-6">Pagamento Aprovado!</h3>
                        <FaCheckCircle className='text-green-500 w-32 h-32'/>
                    </div>
                ) : (
                    qrCodeData && (
                        <div className="w-full flex flex-col items-start max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                            <h3 className="text-2xl font-semibold mb-6">QR Code do Pagamento</h3>

                            <div className="flex flex-col md:flex-row items-center md:items-start md:justify-center w-full gap-4">
                                {storedQRCode && (
                                    <div className="flex flex-col items-center w-full relative max-w-md md:max-w-xs lg:max-w-sm">
                                        <div className="bg-pink-50 p-4 rounded-lg shadow-md flex items-center justify-between w-full">
                                            <div className="w-full overflow-y-auto max-h-32">
                                                <p className="text-black break-words">{storedQRCode}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleCopyClick}
                                            className="w-full mt-4 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none"
                                        >
                                            {isCopied ? 'Copiado!' : 'Copiar'}
                                        </button>
                                    </div>
                                )}

                                <img src={`data:image/png;base64,${qrCodeData}`} alt="QR Code do Pagamento" className="w-full max-w-72 max-h-72" />
                            </div>
                        </div>
                    )
                )}
            </main>

            <Final />
        </div>
    );
};

export default PagamentoRetorno;
