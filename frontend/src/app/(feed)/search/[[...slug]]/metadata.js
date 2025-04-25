const defaultImage = "https://www.faixarosa.com/Faixa Rosa- Fundo branco.png";

export async function generateMetadata({ params }) {
  const slug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug || "";
  const match = slug.match(/^acompanhantes-em-(.+)-([a-z]{2})$/i);

  if (!match) {
    return {
      title: "Faixa Rosa - A melhor plataforma de acompanhantes do Brasil",
      description: "Descubra acompanhantes verificadas na sua cidade com segurança, descrição e perfis completos. Cadastre-se gratuitamente.",
      openGraph: {
        title: "Faixa Rosa - A melhor plataforma de acompanhantes do Brasil",
        description: "Veja perfis verificados de acompanhantes em todo o Brasil com total descrição e segurança.",
        url: "https://www.faixarosa.com",
        type: "website",
        siteName: "Faixa Rosa",
        images: [
          {
            url: defaultImage,
            width: 1200,
            height: 630,
            alt: "Faixa Rosa - Plataforma de acompanhantes",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Faixa Rosa - A melhor plataforma de acompanhantes do Brasil",
        description: "Encontre acompanhantes verificadas com fotos reais em todo o Brasil.",
        images: [defaultImage],
        site: "@faixarosa",
      },
      alternates: {
        canonical: "https://www.faixarosa.com",
      },
    };
  }

  const cidadeSlug = match[1];
  const uf = match[2].toUpperCase();

  const cidadeFormatada = decodeURIComponent(cidadeSlug)
  .split("-")
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");


  const url = `https://www.faixarosa.com/search/acompanhantes-em-${cidadeSlug}-${uf.toLowerCase()}`;

  const title = `Acompanhantes em ${cidadeFormatada} - ${uf} | Faixa Rosa`;
  const description = `Encontre as melhores acompanhantes em ${cidadeFormatada} - ${uf}. Perfis verificados, fotos reais, descrição e segurança. Acesse agora e veja os anúncios disponíveis.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "Faixa Rosa",
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: `Acompanhantes em ${cidadeFormatada}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultImage],
      site: "@faixarosa",
    },
    alternates: {
      canonical: url,
    },
    metadataBase: new URL("https://www.faixarosa.com"),
    category: "adult",
    referrer: "origin-when-cross-origin",
    themeColor: "#ff1493",
    keywords: [
      `Acompanhantes em ${cidadeFormatada}`,
      `Garotas de programa em ${cidadeFormatada}`,
      `Acompanhantes ${uf}`,
      "Faixa Rosa",
      "Acompanhantes verificadas",
      "Garotas de luxo",
      "Acompanhantes elite",
      "Acompanhantes de alto padrão",
    ],
  };
}
