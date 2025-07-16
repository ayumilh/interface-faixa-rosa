import SEOContent from "./SEOContent";
import AcompanhantesBiriguiClient from "./AcompanhantesBiriguiClient";

export const metadata = {
    title: 'Acompanhantes em Birigui – SP: Perfis Verificados | Encontre sua Companhia Ideal',
    description: 'Encontre acompanhantes de alto nível em Birigui, SP. Perfis 100% verificados, avaliações reais e fotos autênticas para uma experiência segura e discreta.',
    keywords: 'acompanhantes Birigui, garotas de programa Birigui, acompanhantes em Birigui SP, meninas Birigui, encontro em Birigui, acompanhante de luxo Birigui, sexo em Birigui, prazer Birigui, massagem Birigui, acompanhantes verificadas Birigui',
    openGraph: {
      title: 'Acompanhantes em Birigui – SP: Perfis Verificados | Encontre sua Companhia Ideal',
      description: 'Encontre acompanhantes de alto nível em Birigui, SP. Perfis 100% verificados, avaliações reais e fotos autênticas para uma experiência segura e discreta.',
      url: 'https://faixarosa.com/acompanhantes-em-Birigui-sp', // Replace with your actual domain
      siteName: 'Faixa Rosa', // Replace with your site name
      images: [
        {
          url: 'https://faixarosa.com/og-image.jpg', // Path to a specific OG image for Birigui
          width: 1200,
          height: 630,
          alt: 'Acompanhantes em Birigui - SP',
        },
      ],
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Acompanhantes em Birigui – SP: Perfis Verificados | Encontre sua Companhia Ideal',
      description: 'Encontre acompanhantes de alto nível em Birigui, SP. Perfis verificados e fotos autênticas em Birigui, SP.',
    },
    alternates: {
      canonical: 'https://faixarosa.com/acompanhantes-em-Birigui-sp', // Replace with your actual domain
    },
  };
  
export default function Page() {
  return (
    <>
      <AcompanhantesBiriguiClient />
      <SEOContent />
    </>
  );
}
