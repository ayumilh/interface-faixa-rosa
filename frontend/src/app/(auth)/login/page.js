import LoginClient from "./LoginClient";

export const metadata = {
  title: "Entrar na Conta – Faixa Rosa",
  description:
    "Faça login, acesse sua conta ou inicie sessão no Faixa Rosa. Área segura para acompanhantes e contratantes acessarem seus perfis.",
  keywords: [
    "login Faixa Rosa",
    "entrar na conta Faixa Rosa",
    "acessar Faixa Rosa",
    "iniciar sessão Faixa Rosa",
    "painel do usuário Faixa Rosa",
    "painel do anunciante Faixa Rosa",
    "login acompanhantes",
    "login contratantes",
  ],
  openGraph: {
    title: "Entrar – Faixa Rosa",
    description: "Área de login do Faixa Rosa. Acesse sua conta com segurança.",
    url: "https://www.faixarosa.com/login",
    siteName: "Faixa Rosa",
    images: [
      {
        url: "https://www.faixarosa.com/Faixa%20Rosa-%20Fundo%20branco.png",
        width: 1200,
        height: 630,
        alt: "Login Faixa Rosa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Login – Faixa Rosa",
    description: "Faça login ou inicie sessão na sua conta do Faixa Rosa.",
    images: ["https://www.faixarosa.com/Faixa%20Rosa-%20Fundo%20branco.png"],
  },
  alternates: {
    canonical: "https://www.faixarosa.com/login",
  },
  metadataBase: new URL("https://www.faixarosa.com"),
};

export default function Page() {
  return <LoginClient />;
}

