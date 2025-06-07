// ─── src/app/(feed)/search/[[...slug]]/head.js ───

export default function Head({ params }) {
    // 1) Monta slugString e extrai cidade/UF
    const slugString = Array.isArray(params.slug) ? params.slug.join("/") : params.slug;
    const regex = /(.*?)\-em\-(.*?)-(\w{2})$/;
    const match = slugString?.match(regex);
  
    // Caso nenhum slug válido, título/descritivo genérico:
    if (!match) {
      return (
        <>
          <title>Faixa Rosa – Acompanhantes em todo o Brasil</title>
          <meta
            name="description"
            content="Encontre acompanhantes verificadas em todo Brasil. Perfis reais, fotos autênticas."
          />
        </>
      );
    }
  
    // Se bateu o regex, monta título e descrição por cidade
    const citySlug = match[2];
    const uf = match[3].toUpperCase();
    const cityName = decodeURIComponent(citySlug).replace(/-/g, " ");
  
    return (
      <>
        <title>{`Acompanhantes em ${cityName} – ${uf} | Faixa Rosa`}</title>
        <meta
          name="description"
          content={`Encontre acompanhantes verificadas em ${cityName}, ${uf}. Perfis reais, fotos autênticas, total discrição.`}
        />
      </>
    );
  }
  