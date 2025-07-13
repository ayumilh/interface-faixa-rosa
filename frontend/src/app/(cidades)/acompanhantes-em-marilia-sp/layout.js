// This layout file is a Server Component by default and handles metadata for the route segment.

export const metadata = {
    title: 'Acompanhantes em Marilia – SP: Perfis Verificados | Encontre sua Companhia Ideal',
    description: 'Encontre acompanhantes de alto nível em Marilia, SP. Perfis 100% verificados, avaliações reais e fotos autênticas para uma experiência segura e discreta.',
    keywords: 'acompanhantes Marilia, garotas de programa Marilia, acompanhantes em Marilia SP, meninas Marilia, encontro em Marilia, acompanhante de luxo Marilia, sexo em Marilia, prazer Marilia, massagem Marilia, acompanhantes verificadas Marilia',
    openGraph: {
      title: 'Acompanhantes em Marilia – SP: Perfis Verificados | Encontre sua Companhia Ideal',
      description: 'Encontre acompanhantes de alto nível em Marilia, SP. Perfis 100% verificados, avaliações reais e fotos autênticas para uma experiência segura e discreta.',
      url: 'https://faixarosa.com/acompanhantes-em-Marilia-sp', // Replace with your actual domain
      siteName: 'Faixa Rosa', // Replace with your site name
      images: [
        {
          url: 'https://faixarosa.com/og-image.jpg', // Path to a specific OG image for Marilia
          width: 1200,
          height: 630,
          alt: 'Acompanhantes em Marilia - SP',
        },
      ],
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Acompanhantes em Marilia – SP: Perfis Verificados | Encontre sua Companhia Ideal',
      description: 'Encontre acompanhantes de alto nível em Marilia, SP. Perfis verificados e fotos autênticas em Marilia, SP.',
    },
    alternates: {
      canonical: 'https://faixarosa.com/acompanhantes-em-Marilia-sp', // Replace with your actual domain
    },
  };
  
  export default function MariliaLayout({ children }) {
    return (
      <>
        {children}
      </>
    );
  }