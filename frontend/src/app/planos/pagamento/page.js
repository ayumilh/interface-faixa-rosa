'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Final from '@/components/search/final';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';

const PagamentoRetorno = () => {
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [qrCodeData, setQrCodeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Verificar se o userToken está no localStorage
        const userToken = Cookies.get('userToken');
        const storedQRCode64 = localStorage.getItem('paymentQRCode64');
        const transactionId = localStorage.getItem('transactionId');

        // Se não tiver userToken ou paymentQRCode, redireciona para a página inicial
        if (!userToken || !storedQRCode64) {
            console.log('Token de usuário ou QR Code não encontrado. Redirecionando para a página inicial...');
        }

        if (storedQRCode64) {
            setQrCodeData(storedQRCode64);
        }

        // Simular uma requisição para verificar o status do pagamento
        if (transactionId) {
            axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/checkout/status/${transactionId}`,
                // `http://localhost:4000/api/payments/checkout/status/${transactionId}`, 
                {
                headers: {
                    Authorization: `Bearer ${userToken}`, // Adicionando o token no cabeçalho
                },
            })
                .then(response => {
                    console.log('Resposta da API:', response.data); // Log da resposta da API
                    const paymentData = response.data;

                    if (paymentData.status === 'approved') {
                        setPaymentStatus('Pagamento aprovado!');
                    } else if (paymentData.status === 'pending') {
                        setPaymentStatus('Pagamento pendente!');
                    } else {
                        setPaymentStatus('Pagamento recusado!');
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

    console.log('QR Code:', qrCodeData); // Log do QR Code

    return (
        <div className="flex flex-col min-h-screen bg-[#ebeff2]">
            <Navbar />

            <main className="flex-grow mt-16 sm:mt-24 px-4 sm:px-6 lg:px-8">
                {/* Hero Section de Confirmação */}
                <section className="relative bg-center bg-cover h-56 sm:h-80 md:h-96 lg:h-[500px] mb-12 rounded-lg overflow-hidden shadow-2xl" style={{ backgroundImage: 'url("/Banner-elite-faixa.png")' }}>
                    {/* Overlay Escuro */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>

                    {/* Conteúdo */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 py-6 sm:py-12">
                        {/* Título */}
                        <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-5xl font-extrabold text-white leading-snug mb-4 sm:mb-6">
                            Confirmação de Assinatura
                        </h1>

                        {/* Descrição */}
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 max-w-md sm:max-w-xl leading-normal sm:leading-relaxed mb-4 sm:mb-6">
                            Seu pagamento foi processado com sucesso! Confira os detalhes abaixo.
                        </p>
                    </div>
                </section>

                {/* Exibindo o Status do Pagamento */}
                {/* <section className="py-12">
                    <div className="max-w-3xl mx-auto text-center">
                        {loading ? (
                            <p className="text-lg font-semibold text-gray-600">Verificando seu pagamento...</p>
                        ) : (
                            <>
                                {paymentStatus ? (
                                    <div className="flex justify-center items-center">
                                        {paymentStatus === "Pagamento aprovado!" ? (
                                            <FaCheckCircle className="text-green-500 text-5xl mr-4" />
                                        ) : paymentStatus === "Pagamento pendente!" ? (
                                            <FaClock className="text-yellow-500 text-5xl mr-4" />
                                        ) : (
                                            <FaTimesCircle className="text-red-500 text-5xl mr-4" />
                                        )}
                                        <h2 className={`text-3xl font-semibold ${paymentStatus === "Pagamento aprovado!" ? 'text-green-500' : paymentStatus === "Pagamento pendente!" ? 'text-yellow-500' : 'text-red-500'}`}>
                                            {paymentStatus}
                                        </h2>
                                    </div>
                                ) : (
                                    <p className="text-red-500">{error}</p>
                                )}
                            </>
                        )}
                    </div>
                </section> */}

                {/* Exibindo o QR Code */}
                <div className="container">
                    <h3 className="text-2xl font-semibold mb-6">QR Code do Pagamento</h3>
                    {qrCodeData ? (
                        <img src={`data:image/png;base64,${qrCodeData}`} alt="QR Code do Pagamento" className="mx-auto" />
                    ) : (
                        <p>Carregando QR Code...</p>
                    )}
                </div>
            </main>

            <Final />
        </div>
    );
};

export default PagamentoRetorno;
