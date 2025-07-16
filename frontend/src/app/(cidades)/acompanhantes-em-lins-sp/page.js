import SEOContent from "./SEOContent";
import AcompanhantesLinsClient from "./AcompanhantesLinsClient";

export const metadata = {
  title: 'Acompanhantes em Lins – SP: Perfis Verificados | Encontre sua Companhia Ideal',
  description: 'Encontre acompanhantes de alto nível em Lins, SP. Perfis 100% verificados, avaliações reais e fotos autênticas para uma experiência segura e discreta.',
  keywords: 'acompanhantes Lins, garotas de programa Lins, acompanhantes em Lins SP, meninas Lins, encontro em Lins, acompanhante de luxo Lins, sexo em Lins, prazer Lins, massagem Lins, acompanhantes verificadas Lins',
  openGraph: {
    title: 'Acompanhantes em Lins – SP: Perfis Verificados | Encontre sua Companhia Ideal',
    description: 'Encontre acompanhantes de alto nível em Lins, SP. Perfis 100% verificados, avaliações reais e fotos autênticas para uma experiência segura e discreta.',
    url: 'https://faixarosa.com/acompanhantes-em-Lins-sp', // Replace with your actual domain
    siteName: 'Faixa Rosa', // Replace with your site name
    images: [
      {
        url: 'https://faixarosa.com/og-image.jpg', // Path to a specific OG image for Lins
        width: 1200,
        height: 630,
        alt: 'Acompanhantes em Lins - SP',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acompanhantes em Lins – SP: Perfis Verificados | Encontre sua Companhia Ideal',
    description: 'Encontre acompanhantes de alto nível em Lins, SP. Perfis verificados e fotos autênticas em Lins, SP.',
  },
  alternates: {
    canonical: 'https://faixarosa.com/acompanhantes-em-Lins-sp', // Replace with your actual domain
  },
};

export default function Page() {
  return (
    <>
      <AcompanhantesLinsClient />
      <SEOContent />
    </>
  );
}
