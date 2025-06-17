import RegisterClient from "./RegisterClient";

export const metadata = {
  title: "Cadastro Faixa Rosa – Crie sua Conta com Segurança",
  description:
    "Crie sua conta gratuitamente no Faixa Rosa. Cadastre-se como contratante ou anunciante com verificação de identidade, perfil personalizado e segurança completa.",
  keywords: [
    "cadastro Faixa Rosa",
    "criar conta Faixa Rosa",
    "registrar Faixa Rosa",
    "abrir conta Faixa Rosa",
    "cadastro acompanhantes",
    "cadastro contratantes",
    "registro de usuário Faixa Rosa",
    "como se cadastrar no Faixa Rosa",
    "fazer conta Faixa Rosa",
    "entrar para o Faixa Rosa",
    "plataforma acompanhantes cadastro"
  ],
  openGraph: {
    title: "Cadastro – Crie sua Conta no Faixa Rosa",
    description:
      "Cadastre-se com segurança no Faixa Rosa e aproveite todos os recursos da plataforma como anunciante ou contratante.",
    url: "https://www.faixarosa.com/registro",
    siteName: "Faixa Rosa",
    type: "website",
    images: [
      {
        url: "https://www.faixarosa.com/Faixa%20Rosa-%20Fundo%20branco.png",
        width: 1200,
        height: 630,
        alt: "Cadastro Faixa Rosa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cadastro Faixa Rosa – Anuncie ou Contrate com Segurança",
    description:
      "Entre na plataforma Faixa Rosa com uma conta verificada. Cadastro simples e seguro para acompanhantes e contratantes.",
    images: ["https://www.faixarosa.com/Faixa%20Rosa-%20Fundo%20branco.png"],
  },
  alternates: {
    canonical: "https://www.faixarosa.com/registro",
  },
  metadataBase: new URL("https://www.faixarosa.com"),
};

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      {/* Conteúdo visível para SEO */}
      <div className="sr-only">
        <h1>Cadastro Faixa Rosa – Crie sua Conta</h1>
        <p>
          Crie sua conta gratuitamente no Faixa Rosa. Seja anunciante ou contratante, tenha acesso à plataforma com segurança, verificação de identidade e perfil personalizado.
        </p>
      </div>

      {/* Componente de Registro */}
      <RegisterClient />
    </main>
  );
}
