import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug?: string[] } }): Promise<Metadata> {
  const slug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug || "";
  const match = slug.match(/^acompanhantes-em-(.+)-([a-z]{2})$/i);

  if (!match) {
    return {
      title: "Faixa Rosa | Acompanhantes de Elite no Brasil",
      description: "Encontre acompanhantes de luxo nas principais cidades do Brasil com o Faixa Rosa.",
    };
  }

  const cidadeSlug = match[1];
  const uf = match[2].toUpperCase();

  const cidadeFormatada = cidadeSlug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `Acompanhantes em ${cidadeFormatada} - Faixa Rosa`,
    description: `Descubra as melhores acompanhantes em ${cidadeFormatada}-${uf}. Cadastre-se e veja perfis verificados.`,
  };
}
