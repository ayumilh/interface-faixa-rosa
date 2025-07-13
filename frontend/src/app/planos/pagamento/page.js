'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Home/footer';
import { IoIosArrowBack } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from "react-toastify";

const PagamentoRetorno = () => {
    const [paymentData, setPaymentData] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [paymentDescription, setPaymentDescription] = useState('');
    const [qrCodeData, setQrCodeData] = useState(null);
    const [storedQRCode, setStoredQRCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Limpar localStorage imediatamente
        const storedQRCode64 = localStorage.getItem('paymentQRCode64');
        const storedQRCodeText = localStorage.getItem('paymentQRCode');
        const transactionId = localStorage.getItem('transactionId');
        localStorage.removeItem('paymentQRCode');
        localStorage.removeItem('paymentQRCode64');
        localStorage.removeItem('transactionId');

        const userToken = Cookies.get('userToken');
        if (!userToken || !transactionId) {
            router.push('/planos');
            return;
        }

        axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/checkout/status/${transactionId}`,
            {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            }
        )
        .then(response => {
            const paymentData = response.data;
            setPaymentData(paymentData);

            if (paymentData.paymentStatus === 'approved') {
                setPaymentStatus('Pagamento aprovado!');
                setPaymentDescription('Seu pagamento foi processado com sucesso! Você pode acessar sua conta agora.');
            } else if (paymentData.paymentStatus === 'pending') {
                setPaymentStatus('Pagamento pendente!');
                setPaymentDescription('Pagamento está em análise. Você receberá uma notificação quando for confirmado.');
                if (storedQRCodeText) setStoredQRCode(storedQRCodeText);
                if (storedQRCode64) setQrCodeData(storedQRCode64);
            } else if (paymentData.paymentStatus === 'refused') {
                setPaymentStatus('Pagamento recusado!');
                setPaymentDescription('Pagamento recusado. Verifique suas informações de pagamento e tente novamente.');
            }
        })
        .catch(() => setError('Erro ao verificar o pagamento.'))
        .finally(() => setLoading(false));
    }, [router]);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(storedQRCode)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
                toast.success('QR Code copiado com sucesso!');
            })
            .catch(err => console.error('Erro ao copiar o texto: ', err));
    };

    const handleLinkClick = () => {
        localStorage.removeItem('paymentQRCode');
        localStorage.removeItem('paymentQRCode64');
        localStorage.removeItem('transactionId');
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#ebeff2]">
            <Navbar />
            <main className="flex-grow flex flex-col items-center w-full mt-16 sm:mt-24 px-4 sm:px-6 lg:px-8">
                <div className="w-full mx-auto p-4 bg-cover flex justify-start items-center">
                    <Link href="/planos" onClick={handleLinkClick} className="flex items-center text-pink-500 hover:text-pink-700">
                        <IoIosArrowBack className="text-2xl" />
                    </Link>
                    <nav className="text-sm text-gray-700 ml-6">
                        <Link href="/" onClick={handleLinkClick} className="text-pink-500 hover:text-pink-700">Início</Link>
                        <span className="mx-2">/</span>
                        <Link href="/planos" onClick={handleLinkClick} className="text-pink-500 hover:text-pink-700">Planos</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-500">Pagamento</span>
                    </nav>
                </div>

                <section className="relative bg-center bg-cover w-full h-56 sm:h-80 md:h-60 mb-12 rounded-lg overflow-hidden shadow-2xl" style={{ backgroundImage: 'url("/Banner-elite-faixa.png")' }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 py-6 sm:py-12">
                        <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-5xl font-extrabold text-white leading-snug mb-4 sm:mb-6">
                            Processo de Pagamento
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 max-w-md sm:max-w-xl leading-normal sm:leading-relaxed mb-4 sm:mb-6">
                            {paymentDescription}
                        </p>
                    </div>
                </section>

                {paymentStatus === 'Pagamento aprovado!' ? (
                    <div className="w-full flex flex-col items-center max-w-4xl mx-auto">
                        <h3 className="text-2xl font-semibold mb-6">Pagamento Aprovado!</h3>
                        <FaCheckCircle className='text-green-500 w-32 h-32' />
                    </div>
                ) : (
                    <div className="w-full flex flex-col justify-center items-center max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                        {!paymentData ? (
                            <div className="w-full flex justify-start items-start mt-6">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500"></div>
                                <span className="ml-4 text-gray-700">Carregando...</span>
                            </div>
                        ) : <div className="w-full flex flex-col items-center mt-6">
                            <h4 className="w-full flex text-xl justify-center font-bold text-gray-600 items-center text-center">Resumo de pagamento</h4>
                            <div className="w-full flex flex-col gap-2 mb-4 mt-6 px-2">
                                {paymentData?.basicPlan && (<>
                                    <div className="flex justify-between mt-4">
                                        <h5 className="text-gray-800 font-semibold text-xl">Plano Principal:</h5>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-800">{paymentData?.basicPlan}</span>
                                        <span className="text-gray-500">R$ {paymentData?.basicPlanPrice.toFixed(2)}</span>
                                    </div>

                                    <hr className="w-full my-3 border-gray-200" />
                                </>)}

                                {paymentData?.extraPlans && paymentData.extraPlans.length > 0 && (
                                    <div className="mt-4">
                                        <h5 className="text-gray-700 font-semibold text-xl">Planos Extras:</h5>
                                        {paymentData.extraPlans.map((plan, index) => (
                                            <div key={index} className="flex justify-between">
                                                <span className="text-gray-700">{plan.name}:</span>
                                                <span className="text-gray-500">R$ {plan.price.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <hr className="w-full my-3 border-gray-200" />

                                <div className="flex justify-between items-end">
                                    <span className="text-gray-800 font-bold text-3xl">Total:</span>
                                    <span className="text-gray-800 font-semibold text-3xl">R$ {paymentData?.paymentAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>}

                        {qrCodeData && (
                            <div className="flex flex-col justify-center items-center w-full relative max-w-md md:max-w-xs lg:max-w-md mt-6">
                                <div className="bg-pink-50 p-4 rounded-lg shadow-md flex items-center justify-between w-full">
                                    <div className="w-full overflow-y-auto max-h-32">
                                        <p className="text-black break-words">{storedQRCode}</p>
                                    </div>
                                </div>
                                <img src={`data:image/png;base64,${qrCodeData}`} alt="QR Code do Pagamento" className="w-full max-w-72 max-h-72 mt-4" />
                                <button
                                    onClick={handleCopyClick}
                                    className="w-full mt-4 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none"
                                >
                                    {isCopied ? 'Copiado!' : 'Copiar'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default PagamentoRetorno;
