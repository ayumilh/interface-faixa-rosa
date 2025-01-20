import axios from 'axios';
import Cors from 'cors';

// Inicializa o middleware CORS para permitir todas as origens
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
  origin: '*', // Permite todas as origens
});

// Helper para executar o middleware CORS
function runMiddleware(req, fn) {
  return new Promise((resolve, reject) => {
    fn(req, { setHeader: () => {} }, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Função principal para o método POST
export async function POST(req) {
  const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substring(2)}`; // Gera um X-Idempotency-Key único
  console.log("Iniciando handler para /api/checkout com X-Idempotency-Key:", idempotencyKey);

  // Executa o middleware CORS
  await runMiddleware(req, cors);
  console.log("Middleware CORS executado com sucesso");

  const body = await req.json();
  const { email, cpf, phoneNumber, countryCode, product, preco, paymentMethod, cardDetails } = body;

  if (!email || !cpf || !phoneNumber || !countryCode || !product || !preco || !paymentMethod) {
    console.log("Campos obrigatórios ausentes:", {
      email, cpf, phoneNumber, countryCode, product, preco, paymentMethod
    });
    return new Response(JSON.stringify({ error: 'Campos obrigatórios ausentes' }), { status: 400 });
  }

  // Configuração dos dados do pagador
  const payer = {
    email: email,
    identification: {
      type: 'CPF',
      number: cpf,
    },
    phone: {
      area_code: phoneNumber.slice(0, 2),
      number: phoneNumber.slice(2),
    },
  };

  console.log("Dados do pagador configurados:", payer);

  // Dados do pagamento
  let paymentData;

  if (paymentMethod === 'pix') {
    paymentData = {
      transaction_amount: preco,
      description: product,
      payment_method_id: 'pix',
      payer,
      notification_url: 'https://seusite.com/api/notificacoes', // URL do webhook
    };
    console.log("Dados de pagamento configurados para Pix:", paymentData);
  } else if (paymentMethod === 'card') {
    if (!cardDetails) {
      console.log("Detalhes do cartão ausentes");
      return new Response(JSON.stringify({ error: 'Detalhes do cartão ausentes' }), { status: 400 });
    }

    paymentData = {
      transaction_amount: preco,
      token: cardDetails.token,
      description: product,
      installments: cardDetails.installments,
      payment_method_id: cardDetails.paymentMethodId,
      payer,
      notification_url: 'https://seusite.com/api/notificacoes',
    };
    console.log("Dados de pagamento configurados para Cartão:", paymentData);
  } else {
    console.log("Método de pagamento inválido:", paymentMethod);
    return new Response(JSON.stringify({ error: 'Método de pagamento inválido' }), { status: 400 });
  }

  try {
    console.log("Enviando requisição para Mercado Pago com dados:", paymentData);
    const response = await axios.post('https://api.mercadopago.com/v1/payments', paymentData, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'X-Idempotency-Key': idempotencyKey, // Cabeçalho de idempotência adicionado
      },
    });

    console.log("Resposta do Mercado Pago:", response.data);

    if (paymentMethod === 'pix') {
      return new Response(JSON.stringify(response.data.point_of_interaction.transaction_data), { status: 200 });
    } else {
      return new Response(JSON.stringify({ status: response.data.status, status_detail: response.data.status_detail }), { status: 200 });
    }
  } catch (error) {
    console.error("Erro ao criar pagamento:", error.response ? error.response.data : error.message);
    return new Response(JSON.stringify({ error: 'Erro ao processar pagamento' }), { status: 500 });
  }
}
