const siteUrl = "https://www.faixarosa.com";
const defaultImage = `${siteUrl}/public/Faixa Rosa- Fundo branco.png`;

export async function generateMetadata() {
  const title = "Faixa Rosa Acompanhantes";
  const description = "Descubra as melhores acompanhantes do Brasil com segurança, descrição e fotos reais. Cadastre-se gratuitamente na plataforma líder do país.";
  const keywords = [
    "acompanhantes",
    "acompanhantes verificadas",
    "garotas de programa",
    "acompanhantes de luxo",
    "acompanhantes Brasil",
    "site de acompanhantes",
    "agência de acompanhantes",
    "anúncios de acompanhantes",
    "acompanhantes elite",
    "faixa rosa",
    "plataforma de acompanhantes",
    "acompanhantes em São Paulo",
    "acompanhantes no Rio de Janeiro",
    "acompanhantes seguras",
    "mulheres para companhia",
  ];

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    applicationName: "Faixa Rosa",
    generator: "Next.js 15",
    keywords,
    authors: [{ name: "Equipe Faixa Rosa", url: siteUrl }],
    creator: "Faixa Rosa",
    publisher: "Faixa Rosa",
    referrer: "origin-when-cross-origin",
    category: "adult",

    alternates: {
      canonical: siteUrl,
    },

    openGraph: {
      title,
      description,
      url: siteUrl,
      type: "website",
      siteName: "Faixa Rosa",
      locale: "pt_BR",
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: "Faixa Rosa Acompanhantes",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultImage],
      site: "@faixarosa",
      creator: "@faixarosa",
    },

    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-32x32.png",
      apple: "/apple-touch-icon.png",
    },

    other: {
      "google-site-verification": "COLE_AQUI_SEU_CODIGO_DO_SEARCH_CONSOLE",
      "facebook-domain-verification": "SE_TIVER_USE_TAMBÉM",
      "robots": "index, follow",
      "rating": "adult",
    },
  };
}
