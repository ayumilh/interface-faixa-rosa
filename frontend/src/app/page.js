import ClientHomePage from './ClientHomePage';

export const metadata = {
  // Title otimizado com palavras-chave estratégicas
  title: "Faixa Rosa - Acompanhantes em todo Brasil!",
  
  // Description mais persuasiva e específica (155-160 caracteres)
  description: "🌹 Encontre acompanhantes verificadas em todo Brasil. Perfis reais, fotos autênticas, total discrição. Cadastro gratuito para profissionais. Acesse já!",
  
  // Keywords organizadas por relevância (embora não indexadas, ajudam na organização)
  keywords: [
    // Marca principal
    "faixa rosa", "faixarosa", "faixa rosa brasil",
    
    // Termos principais de busca
    "acompanhantes brasil", "acompanhantes verificadas", "acompanhantes 2025",
    "garotas de programa brasil", "acompanhantes com fotos reais",
    "acompanhantes discretas", "acompanhantes de luxo", "acompanhantes elite",
    
    // Concorrentes e alternativas
    "alternativa fatal model", "melhor que fatalmodel", "concorrente skokka",
    "alternativa photo acompanhantes", "melhor que mclass", "novo garotasvip",
    "site acompanhantes confiável", "plataforma acompanhantes segura",
    
    // Termos locais
    "acompanhantes são paulo", "acompanhantes rio janeiro", "acompanhantes brasília",
    "acompanhantes belo horizonte", "acompanhantes salvador", "acompanhantes fortaleza",
    "acompanhantes recife", "acompanhantes porto alegre", "acompanhantes curitiba",
    
    // Termos específicos
    "buscar acompanhantes por cidade", "anúncios acompanhantes verificados",
    "site acompanhantes com descrição", "cadastro acompanhantes gratis",
    "acompanhantes com whatsapp", "acompanhantes online agora"
  ],
  
  // Informações do autor e publisher
  authors: [{ name: "Faixa Rosa" }],
  publisher: "Faixa Rosa Brasil",
  creator: "Faixa Rosa",
  
  // Configurações de robôs otimizadas
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Viewport otimizado para mobile
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  
  // Informações de idioma e localização
  alternates: {
    canonical: "https://www.faixarosa.com",
    languages: {
      'pt-BR': 'https://www.faixarosa.com',
    },
  },
  
  // Geographic targeting
  other: {
    'geo.region': 'BR',
    'geo.country': 'Brazil',
    'geo.placename': 'Brasil',
    'ICBM': '-14.2350, -51.9253', // Coordenadas do centro do Brasil
    'DC.title': 'Faixa Rosa - Acompanhantes Verificadas Brasil',
    'DC.creator': 'Faixa Rosa',
    'DC.subject': 'Acompanhantes, Garotas de Programa, Brasil',
    'DC.description': 'Plataforma de acompanhantes verificadas no Brasil',
    'DC.publisher': 'Faixa Rosa Brasil',
    'DC.contributor': 'Faixa Rosa Team',
    'DC.date': new Date().toISOString(),
    'DC.type': 'website',
    'DC.format': 'text/html',
    'DC.identifier': 'https://www.faixarosa.com',
    'DC.source': 'https://www.faixarosa.com',
    'DC.language': 'pt-BR',
    'DC.relation': 'https://www.faixarosa.com',
    'DC.coverage': 'Brasil',
    'DC.rights': 'Copyright 2025 Faixa Rosa',
    
    // Verificação de proprietário
    'msvalidate.01': '25D25C0199BF93F6D8618BB8BE055A09',
    'yandex-verification': '186f30a47ed07d1e',
    
    // Configurações de cache
    'Cache-Control': 'public, max-age=31536000',
    'Expires': new Date(Date.now() + 31536000000).toUTCString(),
    
    // Rating de conteúdo
    'rating': 'RTA-5042-1996-1400-1577-RTA',
    'PICS-Label': '(PICS-1.1 "http://www.classify.org/safesurf/" l r (SS~~000 1))',
    
    // Mobile optimization
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Faixa Rosa',
    
    // Security
    'referrer': 'origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
  },
  
  // Open Graph otimizado
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://www.faixarosa.com',
    siteName: 'Faixa Rosa',
    title: 'Faixa Rosa Acompanhantes em todo Brasil',
    description: 'Encontre as melhores acompanhantes do Brasil. Perfis verificados, fotos reais, total discrição. A plataforma mais confiável para adultos. Entre já!',
    images: [
      {
        url: 'https://www.faixarosa.com/Faixa%20Rosa-%20Fundo%20branco.png',
        width: 1200,
        height: 630,
        alt: 'Faixa Rosa - Acompanhantes Verificadas Brasil',
        type: 'image/jpeg',
      },
      {
        url: 'https://www.faixarosa.com/Faixa%20Rosa-%20Fundo%20branco.png',
        width: 1080,
        height: 1080,
        alt: 'Faixa Rosa Logo',
        type: 'image/jpeg',
      },
    ],
    videos: [
      {
        url: 'https://www.faixarosa.com/vd-faixarosa-01.mp4',
        width: 1280,
        height: 720,
        type: 'video/mp4',
      },
    ],
  },
 
  // Base URL
  metadataBase: new URL('https://www.faixarosa.com'),
  
  // Configurações de tema
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ff1493' },
    { media: '(prefers-color-scheme: dark)', color: '#ff1493' },
  ],
  colorScheme: 'light dark',
  
  // Manifest para PWA
  manifest: '/manifest.json',
  
 
  
  // Configurações de referrer
  referrer: 'origin-when-cross-origin',
  
  // Configurações de formatDetection
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Configurações de categoria
  category: 'adult entertainment',
  
  // Configurações de classificação
  classification: 'Adult Content',
  
  // Configurações de aplicação
  applicationName: 'Faixa Rosa',
  
  // Configurações de geração
  generator: 'Next.js',
  
  // Configurações de abstract
  abstract: 'Plataforma líder de acompanhantes verificadas no Brasil. Conectando pessoas adultas de forma segura, discreta e confiável desde 2024.',
  
  // Configurações de archives
  archives: ['https://www.faixarosa.com/arquivo'],
  
  // Configurações de assets
  assets: ['https://www.faixarosa.com/assets'],
  
  // Configurações de bookmarks
  bookmarks: ['https://www.faixarosa.com/favoritos'],
};

// Função para gerar JSON-LD estruturado
export function generateJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://www.faixarosa.com/#website',
        url: 'https://www.faixarosa.com',
        name: 'Faixa Rosa',
        description: 'Plataforma de acompanhantes verificadas no Brasil',
        publisher: {
          '@id': 'https://www.faixarosa.com/#organization',
        },
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://www.faixarosa.com/buscar?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        ],
        inLanguage: 'pt-BR',
      },
      {
        '@type': 'Organization',
        '@id': 'https://www.faixarosa.com/#organization',
        name: 'Faixa Rosa',
        url: 'https://www.faixarosa.com',
        logo: {
          '@type': 'ImageObject',
          inLanguage: 'pt-BR',
          '@id': 'https://www.faixarosa.com/#/schema/logo/image/',
          url: 'https://www.faixarosa.com/logo-faixa-rosa.png',
          contentUrl: 'https://www.faixarosa.com/logo-faixa-rosa.png',
          width: 512,
          height: 512,
          caption: 'Faixa Rosa',
        },
        image: {
          '@id': 'https://www.faixarosa.com/#/schema/logo/image/',
        },
        sameAs: [
          'https://www.instagram.com/faixarosa.brasil',
          'https://www.facebook.com/share/1FMkS9rGnF/?mibextid=wwXIfr',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          areaServed: 'BR',
          availableLanguage: 'Portuguese',
        },
        areaServed: {
          '@type': 'Country',
          name: 'Brasil',
        },
        knowsAbout: [
          'Acompanhantes',
          'Garotas de Programa',
          'Serviços para Adultos',
          'Plataforma Digital',
        ],
      },
      {
        '@type': 'WebPage',
        '@id': 'https://www.faixarosa.com/#webpage',
        url: 'https://www.faixarosa.com',
        name: 'Faixa Rosa - Acompanhantes Verificadas Brasil',
        isPartOf: {
          '@id': 'https://www.faixarosa.com/#website',
        },
        about: {
          '@id': 'https://www.faixarosa.com/#organization',
        },
        description: 'Encontre acompanhantes verificadas em todo Brasil. Perfis reais, fotos autênticas, total discrição.',
        breadcrumb: {
          '@id': 'https://www.faixarosa.com/#breadcrumb',
        },
        inLanguage: 'pt-BR',
        potentialAction: [
          {
            '@type': 'ReadAction',
            target: ['https://www.faixarosa.com'],
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.faixarosa.com/#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.faixarosa.com',
          },
        ],
      },
    ],
  };

  return JSON.stringify(jsonLd);
}

export default function Page() {
  return (
    <>
      {/* JSON-LD estruturado */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateJsonLd(),
        }}
      />
      <ClientHomePage />
    </>
  );
}