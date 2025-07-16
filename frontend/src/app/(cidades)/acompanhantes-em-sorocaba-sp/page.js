import SEOContent from "./SEOContent";
import AcompanhantesSorocabaClient from "./AcompanhantesSorocabaClient";

export const metadata = {
  title: 'Acompanhantes em Sorocaba – SP: Perfis Verificados | Encontre sua Companhia Ideal',
  description: 'Encontre acompanhantes de alto nível em Sorocaba, SP. Perfis 100% verificados, avaliações reais e fotos autênticas para uma experiência segura e discreta.',
  keywords: 'acompanhantes Sorocaba, garotas de programa Sorocaba, acompanhantes em Sorocaba SP, meninas Sorocaba, encontro em Sorocaba, acompanhante de luxo Sorocaba, sexo em Sorocaba, prazer Sorocaba, massagem Sorocaba, acompanhantes verificadas Sorocaba',
  openGraph: {
    title: 'Acompanhantes em Sorocaba – SP: Perfis Verificados | Encontre sua Companhia Ideal',
    description: 'Encontre acompanhantes de alto nível em Sorocaba, SP. Perfis 100% verificados, avaliações reais e fotos autênticas para uma experiência segura e discreta.',
    url: 'https://faixarosa.com/acompanhantes-em-Sorocaba-sp', // Replace with your actual domain
    siteName: 'Faixa Rosa', // Replace with your site name
    images: [
      {
        url: 'https://faixarosa.com/og-image.jpg', // Path to a specific OG image for Sorocaba
        width: 1200,
        height: 630,
        alt: 'Acompanhantes em Sorocaba - SP',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acompanhantes em Sorocaba – SP: Perfis Verificados | Encontre sua Companhia Ideal',
    description: 'Encontre acompanhantes de alto nível em Sorocaba, SP. Perfis verificados e fotos autênticas em Sorocaba, SP.',
  },
  alternates: {
    canonical: 'https://faixarosa.com/acompanhantes-em-Sorocaba-sp', // Replace with your actual domain
  },
};

export default function Page() {
  return (
    <>
      <AcompanhantesSorocabaClient />
      <SEOContent />
    </>
  );
}
