import ConvenioClient from './ConvenioClient';

export const metadata = {
  title: "Convênios Faixa Rosa – Benefícios para Acompanhantes ",
  description: "Acesse os convênios exclusivos do Faixa Rosa. Descontos em academias, psicólogos, hotéis e serviços premium para acompanhantes cadastradas.",
  keywords: [
    "Convênios Faixa Rosa",
    "Benefícios acompanhantes",
    "Descontos acompanhantes",
    "Parcerias Faixa Rosa",
    "Acompanhantes elite",
    "Serviços para acompanhantes",
    "Apoio para acompanhantes",
    "Programa de parcerias Faixa Rosa"
  ],
  openGraph: {
    title: "Convênios Faixa Rosa – Descontos exclusivos para cadastradas",
    description: "Confira estabelecimentos parceiros do Faixa Rosa. Parcerias pensadas para bem-estar, segurança e crescimento profissional.",
    url: "https://www.faixarosa.com/convenio",
    siteName: "Faixa Rosa",
    type: "website",
    images: [
      {
        url: "https://www.faixarosa.com/Banner-elite-faixa.png",
        width: 1200,
        height: 630,
        alt: "Convênios Faixa Rosa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convênios Faixa Rosa – Vantagens para Anunciantes Elite",
    description: "Descontos exclusivos em serviços para acompanhantes do Faixa Rosa. Confira a rede de parceiros e aproveite os benefícios.",
    images: ["https://www.faixarosa.com/Banner-elite-faixa.png"],
  },
  alternates: {
    canonical: "https://www.faixarosa.com/convenio",
  },
  metadataBase: new URL("https://www.faixarosa.com"),
};

export default function Page() {
  return <ConvenioClient />;
}
