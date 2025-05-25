export async function generateMetadata({ params }) {
  const slug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug || "";
  const match = slug.match(/^acompanhantes-em-(.+)-([a-z]{2})$/i);

  const defaultImage = "https://www.faixarosa.com/Faixa%20Rosa-%20Fundo%20branco.png";

  if (!match) {
    return {
      title: "Faixa Rosa - A melhor plataforma de acompanhantes do Brasil",
      description: "Descubra acompanhantes verificadas na sua cidade com segurança, descrição e perfis completos. Cadastre-se gratuitamente.",
      metadataBase: new URL("https://www.faixarosa.com"),
      themeColor: "#ff1493",
    };
  }

  const cidadeSlug = match[1];
  const uf = match[2].toUpperCase();
  const cidadeFormatada = decodeURIComponent(cidadeSlug)
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const url = `https://www.faixarosa.com/search/acompanhantes-em-${cidadeSlug}-${uf.toLowerCase()}`;
  const title = `Acompanhantes em ${cidadeFormatada} - ${uf} | Faixa Rosa`;
  const description = `Encontre acompanhantes verificadas em ${cidadeFormatada} - ${uf}. Perfis com fotos reais, descrição, avaliações e sigilo garantido.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
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
    },
    alternates: {
      canonical: url,
    },
    metadataBase: new URL("https://www.faixarosa.com"),
    themeColor: "#ff1493",
  };
}

export default function Layout({ children }) {
  return <>{children}</>;
}
