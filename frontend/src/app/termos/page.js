// src/app/termos/page.js

// ✅ MANTÉM NO SERVIDOR
export const metadata = {
  title: "Termos de Uso e Serviços – Faixa Rosa",
  description:
    "Leia os termos de uso e políticas de privacidade do Faixa Rosa. Entenda os direitos, deveres e condições de uso para usuários e anunciantes na plataforma.",
  keywords: [
    "Termos de uso Faixa Rosa",
    "Contrato Faixa Rosa",
    "Política de privacidade",
    "Regras para acompanhantes",
    "Termos para anunciantes",
    "Segurança Faixa Rosa",
    "LGPD acompanhantes",
    "Termos e condições Faixa Rosa"
  ],
  alternates: {
    canonical: "https://www.faixarosa.com/termos",
  },
  openGraph: {
    title: "Termos de Uso – Faixa Rosa",
    description:
      "Veja os termos que regem o uso da plataforma Faixa Rosa por usuários e anunciantes. Acesse as regras completas e políticas de segurança e privacidade.",
    url: "https://www.faixarosa.com/termos",
    siteName: "Faixa Rosa",
    type: "article",
    images: [
      {
        url: "https://www.faixarosa.com/Faixa%20Rosa-%20Fundo%20branco.png",
        width: 1200,
        height: 630,
        alt: "Termos de Uso Faixa Rosa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Termos de Uso – Faixa Rosa",
    description:
      "Conheça as condições de uso da plataforma Faixa Rosa. Segurança, dados, responsabilidades e direitos de usuários e anunciantes.",
    images: ["https://www.faixarosa.com/Faixa%20Rosa-%20Fundo%20branco.png"],
  },
};

// ✅ COMPONENTE CLIENTE
export { default } from "./TermosClient";
