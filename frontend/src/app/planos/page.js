import PlanosClient from "./PlanosClient"; // Certifique-se de que o componente tem "use client" lá dentro

export const metadata = {
  title: "Planos Faixa Rosa – Escolha sua visibilidade ideal",
  description: "Conheça os planos do Faixa Rosa e destaque seu perfil! Opções como Rubi, Safira, Pink e Vip com benefícios exclusivos. Aumente sua visibilidade com segurança.",
  keywords: [
    "Planos Faixa Rosa",
    "Assinatura Faixa Rosa",
    "Faixa Rosa Vip",
    "Divulgação acompanhante",
    "Plano Rubi Faixa Rosa",
    "Plano Pink Faixa Rosa",
    "Plano Safira Faixa Rosa",
    "Plano Vip Faixa Rosa",
    "Dark Mode Faixa Rosa",
  ],
  openGraph: {
    title: "Planos Faixa Rosa – Destaque-se com visibilidade máxima",
    description: "Veja os planos Rubi, Safira, Pink, Vip e extras do Faixa Rosa. Ganhe destaque, aumente seus acessos e conquiste mais clientes com segurança.",
    url: "https://www.faixarosa.com/planos",
    siteName: "Faixa Rosa",
    type: "website",
    images: [
      {
        url: "https://www.faixarosa.com/Faixa%20Rosa-%20Fundo%20branco.png",
        width: 1200,
        height: 630,
        alt: "Planos Faixa Rosa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Planos Faixa Rosa – Visibilidade e Destaque Profissional",
    description: "Escolha o plano ideal no Faixa Rosa e aumente seu alcance com segurança e descrição.",
    images: ["https://www.faixarosa.com/Faixa%20Rosa-%20Fundo%20branco.png"],
  },
  alternates: {
    canonical: "https://www.faixarosa.com/planos",
  },
  metadataBase: new URL("https://www.faixarosa.com"),
};

export default function Page() {
  return <PlanosClient />;
}
