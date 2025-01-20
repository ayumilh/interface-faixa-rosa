// pages/api/notificacoes.js

import axios from 'axios';

export default async function handler(req, res) {
  // Certifique-se de que o método é POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Pega o ID do pagamento enviado pelo Mercado Pago na notificação
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID do pagamento não fornecido.' });
    }

    // Chame a API do Mercado Pago para obter detalhes completos do pagamento
    const paymentResponse = await axios.get(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    });

    const paymentData = paymentResponse.data;

    // Aqui você processa o status do pagamento
    const status = paymentData.status; // Exemplo: "approved", "pending", "rejected"
    const statusDetail = paymentData.status_detail; // Detalhe adicional do status

    // Armazene ou processe o status conforme necessário
    // Por exemplo, salve em um banco de dados o novo status do pagamento
    console.log(`Pagamento ID: ${id} - Status: ${status} - Detalhe: ${statusDetail}`);

    // Retorne uma resposta de sucesso para o Mercado Pago
    res.status(200).json({ message: 'Notificação processada com sucesso' });
  } catch (error) {
    console.error('Erro ao processar notificação:', error.message);
    res.status(500).json({ error: 'Erro ao processar notificação' });
  }
}
