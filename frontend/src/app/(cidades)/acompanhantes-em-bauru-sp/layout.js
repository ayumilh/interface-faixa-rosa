// This layout file is a Server Component by default and handles metadata for the route segment.

export const metadata = {
    title: 'Acompanhantes em Bauru – SP: Perfis Verificados | Encontre sua Companhia Ideal',
    description: 'Encontre acompanhantes de alto nível em Bauru, SP. Perfis 100% verificados, avaliações reais e fotos autênticas para uma experiência segura e discreta.',
    keywords: 'acompanhantes Bauru, garotas de programa Bauru, acompanhantes em Bauru SP, meninas Bauru, encontro em Bauru, acompanhante de luxo Bauru, sexo em Bauru, prazer Bauru, massagem Bauru, acompanhantes verificadas Bauru',
    openGraph: {
      title: 'Acompanhantes em Bauru – SP: Perfis Verificados | Encontre sua Companhia Ideal',
      description: 'Encontre acompanhantes de alto nível em Bauru, SP. Perfis 100% verificados, avaliações reais e fotos autênticas para uma experiência segura e discreta.',
      url: 'https://faixarosa.com/acompanhantes-em-Bauru-sp', // Replace with your actual domain
      siteName: 'Faixa Rosa', // Replace with your site name
      images: [
        {
          url: 'https://faixarosa.com/og-image.jpg', // Path to a specific OG image for Bauru
          width: 1200,
          height: 630,
          alt: 'Acompanhantes em Bauru - SP',
        },
      ],
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Acompanhantes em Bauru – SP: Perfis Verificados | Encontre sua Companhia Ideal',
      description: 'Encontre acompanhantes de alto nível em Bauru, SP. Perfis verificados e fotos autênticas em Bauru, SP.',
    },
    alternates: {
      canonical: 'https://faixarosa.com/acompanhantes-em-Bauru-sp', // Replace with your actual domain
    },
  };
  
  export default function BauruLayout({ children }) {
    return (
      <>
        {children}
      </>
    );
  }