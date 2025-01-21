"use client";

import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaRegCheckCircle, FaCopy } from 'react-icons/fa';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Validações
const validateCPF = (cpf) => cpf.replace(/[^\d]/g, '').length === 11;
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const formatCPF = (cpf) => cpf.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2').substring(0, 14);
const formatPhoneNumber = (phone) => phone.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2').substring(0, 15);

export default function CheckoutPage() {
  const [selectedMethod, setSelectedMethod] = useState('pix');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode] = useState('+55');
  const [cpfError, setCpfError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [confirmEmailError, setConfirmEmailError] = useState('');
  const [product] = useState("Plano Rubi");
  const [preco] = useState(299.00);
  const [qrCodeData, setQrCodeData] = useState(null); // Para exibir os dados do QR Code Pix
  const [copied, setCopied] = useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const router = useRouter();

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    console.log("Método de pagamento selecionado:", method);
  };

  const handleCopyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeData.qr_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar o código:", err);
    }
  };

  const handlePaymentConfirmation = () => {
    setIsPaymentConfirmed(true);
  };

  useEffect(() => {
    if (isPaymentConfirmed && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isPaymentConfirmed, timeLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Início do envio do formulário");
    let valid = true;

    if (!validateCPF(cpf)) {
      setCpfError('CPF inválido');
      console.log("Erro de validação: CPF inválido");
      valid = false;
    } else {
      setCpfError('');
    }

    if (!validateEmail(email)) {
      setEmailError('Email inválido');
      console.log("Erro de validação: Email inválido");
      valid = false;
    } else {
      setEmailError('');
    }

    if (email !== confirmEmail) {
      setConfirmEmailError('Emails não coincidem');
      console.log("Erro de validação: Emails não coincidem");
      valid = false;
    } else {
      setConfirmEmailError('');
    }

    console.log("Status de validação:", valid ? "Válido" : "Inválido");

    if (valid) {
      if (selectedMethod === 'pix') {
        console.log("Iniciando pagamento via Pix com os dados:");
        console.log({
          product,
          preco,
          email,
          cpf,
          phoneNumber,
          countryCode,
          paymentMethod: 'pix',
        });

        try {
          const response = await axios.post('/api/checkout', {
            product,
            preco,
            email,
            cpf,
            phoneNumber,
            countryCode,
            paymentMethod: 'pix',
          });
          console.log("Resposta do servidor para Pix:", response.data);
          setQrCodeData(response.data); // Exibe os dados do QR Code e código Pix
        } catch (error) {
          console.error("Erro ao gerar o pagamento Pix:", error);
        }
      } else if (selectedMethod === 'card') {
        console.log("Simulando pagamento via cartão com status aprovado");
        const status = "approved"; // simula resposta para cartão
        if (status === "approved") {
          router.push('/cartao/aprovado');
        } else if (status === "declined") {
          router.push('/cartao/recusado');
        } else {
          router.push('/cartao/analise');
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4 py-8">
      <div className="w-full max-w-2xl p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">{product}</h2>
        {!qrCodeData ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input type="text" placeholder="Nome completo" className="w-full p-4 border border-gray-300 rounded-md" required />

            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 border border-gray-300 rounded-md" required />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

            <input type="email" placeholder="Confirmar email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} className="w-full p-4 border border-gray-300 rounded-md" required />
            {confirmEmailError && <p className="text-red-500 text-sm">{confirmEmailError}</p>}

            <input type="text" placeholder="CPF" value={cpf} onChange={(e) => setCpf(formatCPF(e.target.value))} className="w-full p-4 border border-gray-300 rounded-md" required />
            {cpfError && <p className="text-red-500 text-sm">{cpfError}</p>}

            <input type="text" placeholder="Celular com DDD" value={phoneNumber} onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))} className="w-full p-4 border border-gray-300 rounded-md" required />

            <div className="flex space-x-4 justify-center my-4">
              <button type="button" onClick={() => handleSelectMethod('card')} className={`flex-1 py-3 border-2 rounded-md text-center ${selectedMethod === 'card' ? 'border-pink-500 text-pink-500 bg-pink-100' : 'border-gray-300'}`}>
                <FaCreditCard className="inline-block mr-2" /> Cartão
                {selectedMethod === 'card' && <FaRegCheckCircle className="inline-block ml-2 text-green-500" />}
              </button>

              <button type="button" onClick={() => handleSelectMethod('pix')} className={`flex-1 py-3 border-2 rounded-md text-center ${selectedMethod === 'pix' ? 'border-pink-500 text-pink-500 bg-pink-100' : 'border-gray-300'}`}>
                <Image src="/pix-icon.png" alt="Pix" width={24} height={24} className="inline-block mr-2 w-6 h-6" /> Pix
                {selectedMethod === 'pix' && <FaRegCheckCircle className="inline-block ml-2 text-green-500" />}
              </button>
            </div>

            <button type="submit" className="w-full py-3 bg-pink-500 text-white text-lg font-semibold rounded-md hover:bg-pink-600 transition">PAGAR AGORA</button>
            <p className="text-center text-gray-400 text-sm mt-6">Ao clicar em &apos;Pagar Agora&apos;, eu declaro que li e concordo com os Termos de Compra.</p>          </form>
        ) : (
          <div className="text-center">
            <Image src="/pix-icon.png" alt="Pix Logo" width={80} height={56} className="w-20 mx-auto my-4" />
            <h1 className="text-2xl font-bold text-pink-600 mb-4">Conclua o pagamento no PIX</h1>

            <p className="text-gray-700 mb-4">Escaneie o QR Code abaixo ou copie o código Pix:</p>
            <Image src={`data:image/png;base64,${qrCodeData.qr_code_base64}`} alt="QR Code Pix" width={160} height={160} className="w-40 h-40 mx-auto my-4" />
            <button onClick={handleCopyPixCode} className={`flex items-center justify-center w-full p-2 border-2 rounded-md ${copied ? 'bg-green-500 text-white' : 'bg-pink-500 text-white'}`}>
              <FaCopy className="mr-2" /> {copied ? "Código copiado!" : "Copiar Código Pix"}
            </button>
            <p className="text-gray-600 mt-4">Valor: R$ {preco.toFixed(2)}</p>

            <button onClick={handlePaymentConfirmation} className="text-blue-600 mt-4 font-semibold underline">Já realizei o pagamento</button>
            {isPaymentConfirmed && (
              <div className="mt-6">
                <h2 className="text-lg font-bold text-orange-500">Aguardando confirmação do pagamento...</h2>
                <p className="text-gray-600 mt-2">Tempo estimado: {`${Math.floor(timeLeft / 60).toString().padStart(2, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
