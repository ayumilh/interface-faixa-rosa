import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faixa Rosa | Acompanhantes de Luxo no Brasil",
  description: "Encontre as melhores acompanhantes de elite no Brasil. São Paulo, Rio, BH e outras cidades. Cadastre-se e descubra perfis verificados no Faixa Rosa.",
  keywords: [
    "faixa rosa", "acompanhantes", "acompanhantes de luxo",
    "acompanhantes elite", "site de acompanhantes",
    "garotas de programa SP", "escort Brasil", "acompanhante SP", "acompanhante RJ"
  ],
  icons: {
    icon: "/favicon.ico", // ✅ caminho para o ícone
  },
  openGraph: {
    title: "Faixa Rosa | Acompanhantes de Luxo no Brasil",
    description: "Conheça o site número 1 em acompanhantes de luxo. Cadastre-se e descubra perfis reais e verificados nas principais cidades do país.",
    url: "https://www.faixarosa.com",
    siteName: "Faixa Rosa",
    images: [
      {
        url: "https://www.faixarosa.com/assets/banner-faixa.jpg",
        width: 1200,
        height: 630,
        alt: "Faixa Rosa - Capa",
      },
    ],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  metadataBase: new URL("https://www.faixarosa.com"),
};
