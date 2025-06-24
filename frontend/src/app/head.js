// ─── src/app/head.js ───
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

// Função otimizada para gerar JSON-LD com schema mais rico
function generateEnhancedJsonLd() {
  const currentDate = new Date().toISOString();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.faixarosa.com/#website",
        url: "https://www.faixarosa.com",
        name: "Faixa Rosa",
        alternateName: ["FaixaRosa", "Faixa Rosa Brasil"],
        description: "🌹 A plataforma #1 de acompanhantes verificadas no Brasil. Fotos reais 100% verificadas, segurança total. Cadastro gratuito!",
        keywords: "acompanhantes brasil, acompanhantes verificadas, faixa rosa, garotas de programa, acompanhantes de luxo",
        inLanguage: "pt-BR",
        dateCreated: "2024-01-01",
        dateModified: currentDate,
        datePublished: "2024-01-01",
        isFamilyFriendly: false,
        isAccessibleForFree: true,
        publisher: {
          "@id": "https://www.faixarosa.com/#organization"
        },
        mainEntity: {
          "@id": "https://www.faixarosa.com/#webpage"
        },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://www.faixarosa.com/buscar?q={search_term_string}&cidade={cidade}&estado={estado}",
              description: "Busque acompanhantes por cidade, estado ou características específicas"
            },
            "query-input": [
              "required name=search_term_string",
              "name=cidade",
              "name=estado"
            ]
          },
          {
            "@type": "RegisterAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://www.faixarosa.com/registro",
              description: "Cadastro gratuito para profissionais"
            }
          }
        ]
      },
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": "https://www.faixarosa.com/#organization",
        name: "Faixa Rosa Brasil",
        legalName: "Faixa Rosa Plataforma Digital Ltda",
        url: "https://www.faixarosa.com",
        foundingDate: "2024",
        slogan: "A Plataforma Mais Confiável de Acompanhentes do Brasil",
        description: "Líder em verificação de perfis de acompanhantes no Brasil. Sistema de verificação em 3 etapas, suporte 24/7.",
        knowsAbout: [
          "Acompanhantes Verificadas",
          "Garotas de Programa Premium",
          "Serviços Adultos Seguros",
          "Plataforma Digital Confiável",
          "Verificação de Identidade",
          "Escort Services Brasil"
        ],
        areaServed: [
          {
            "@type": "Country",
            name: "Brasil",
            alternateName: "Brazil"
          },
          {
            "@type": "AdministrativeArea",
            name: "São Paulo"
          },
          {
            "@type": "AdministrativeArea", 
            name: "Rio de Janeiro"
          },
          {
            "@type": "AdministrativeArea",
            name: "Minas Gerais"
          }
        ],
        serviceArea: {
          "@type": "GeoCircle",
          geoMidpoint: {
            "@type": "GeoCoordinates",
            latitude: -14.2350,
            longitude: -51.9253
          },
          geoRadius: "5000000"
        },
        logo: {
          "@type": "ImageObject",
          "@id": "https://www.faixarosa.com/#logo",
          url: "https://www.faixarosa.com/icon-512.png",
          contentUrl: "https://www.faixarosa.com/icon-512.png",
          width: 512,
          height: 512,
          caption: "Faixa Rosa - Logo Oficial",
          encodingFormat: "image/png"
        },
        image: [
          {
            "@id": "https://www.faixarosa.com/#logo"
          },
          {
            "@type": "ImageObject",
            url: "https://www.faixarosa.com/og-image.png",
            width: 1200,
            height: 630
          }
        ],
        sameAs: [
          "https://www.instagram.com/faixarosa.brasil",
          "https://www.facebook.com/share/1FMkS9rGnF/?mibextid=wwXIfr",
          "https://twitter.com/faixarosabr",
          "https://www.youtube.com/@faixarosabrasil"
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            areaServed: "BR",
            availableLanguage: ["Portuguese", "pt-BR"],
            hoursAvailable: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday", "Tuesday", "Wednesday",
                "Thursday", "Friday", "Saturday", "Sunday"
              ],
              opens: "00:00",
              closes: "23:59"
            }
          },
          {
            "@type": "ContactPoint",
            contactType: "technical support",
            areaServed: "BR",
            availableLanguage: "Portuguese"
          }
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Catálogo de Acompanhantes Verificadas",
          itemListElement: [
            {
              "@type": "Offer",
              name: "Perfil Premium Verificado",
              description: "Cadastro completo com verificação em 3 etapas"
            }
          ]
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://www.faixarosa.com/#webpage",
        url: "https://www.faixarosa.com",
        name: "Faixa Rosa - Acompanhantes Verificadas Brasil | #1 em Confiança",
        headline: "🌹 Encontre as Melhores Acompanhantes do Brasil - Perfis 100% Verificados",
        description: "★★★★★ A plataforma mais confiável do Brasil! Fotos reais, total discrição. Cadastro GRÁTIS para profissionais. Entre agora!",
        keywords: "acompanhantes brasil 2025, melhores acompanhantes, faixa rosa, garotas programa verificadas",
        inLanguage: "pt-BR",
        datePublished: "2024-01-01T00:00:00-03:00",
        dateModified: currentDate, // Note: currentDate é injetado no Head
        author: {
          "@id": "https://www.faixarosa.com/#organization"
        },
        publisher: {
          "@id": "https://www.faixarosa.com/#organization"
        },
        isPartOf: {
          "@id": "https://www.faixarosa.com/#website"
        },
        mainContentOfPage: {
          "@type": "WebPageElement",
          cssSelector: "main"
        },
        breadcrumb: {
          "@id": "https://www.faixarosa.com/#breadcrumb"
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".description"]
        },
        potentialAction: [
          {
            "@type": "ReadAction",
            target: ["https://www.faixarosa.com"]
          },
          {
            "@type": "SearchAction",
            target: "https://www.faixarosa.com/buscar?q={search_term}"
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.faixarosa.com/#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Início",
            item: "https://www.faixarosa.com"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.faixarosa.com/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Como funciona a verificação de perfis na Faixa Rosa?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nossa verificação possui 3 etapas: documento de identidade, foto ao vivo e verificação por videochamada para garantir 100% de autenticidade."
            }
          },
          {
            "@type": "Question", 
            name: "O cadastro é realmente gratuito?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sim! O cadastro básico é totalmente gratuito. Oferecemos também planos premium com recursos avançados de visibilidade."
            }
          }
        ]
      }
    ]
  };

  return JSON.stringify(jsonLd, null, 0);
}

export default function Head() {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date();
  const expireDate = new Date(currentDate.getTime() + 31536000000); // 1 ano

  return (
    <>
      {/* Meta tags essenciais */}
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

      {/* Meta tags de “site name” para Google, Bing, Yahoo, redes sociais e navegadores */}
      <meta name="google-site-name" content="Faixa Rosa" />
      <meta property="og:site_name" content="Faixa Rosa" />
      <meta name="application-name" content="Faixa Rosa" />
      <meta name="apple-mobile-web-app-title" content="Faixa Rosa" />

      {/* Title e description otimizados para SEO */}
      <title>Faixa Rosa - Acompanhantes Verificadas Brasil #{currentYear} | #1 em Confiança</title>
      <meta
        name="description"
        content="★★★★★ A plataforma mais confiável do Brasil! Fotos 100% reais, total discrição e segurança. Cadastro GRÁTIS para profissionais. A melhor alternativa ao Fatal Model, Skokka e Photo Acompanhantes. Entre agora!"
      />

      {/* Keywords estratégicas para ranqueamento */}
      <meta
        name="keywords"
        content="
          acompanhantes brasil 2025,
          faixa rosa,
          faixarosa.com,
          acompanhantes verificadas brasil,
          melhores acompanhantes brasil,
          garotas de programa verificadas,
          acompanhantes fotos reais,
          acompanhantes confiáveis,
          acompanhantes de luxo brasil,
          escort brasil verificado,
          alternativa fatal model,
          melhor que fatalmodel 2025,
          substituto skokka,
          novo photo acompanhantes,
          concorrente mclass,
          melhor garotasvip,
          site acompanhantes seguro,
          plataforma acompanhantes número 1,
          acompanhantes sp verificadas,
          acompanhantes rj premium,
          acompanhantes mg elite,
          acompanhantes brasília vip,
          acompanhantes salvador luxo,
          acompanhantes fortaleza verificadas,
          acompanhantes recife premium,
          acompanhantes porto alegre vip,
          acompanhantes curitiba elite,
          acompanhantes goiânia verificadas,
          buscar acompanhantes por cidade,
          cadastro acompanhantes grátis,
          anúncios acompanhantes reais,
          verificação 3 etapas,
          acompanhantes whatsapp verificado,
          escort services brasil premium
        "
      />

      {/* Meta tags para melhor indexação */}
      <meta name="author" content="Faixa Rosa" />
      <meta name="copyright" content={`© ${currentYear} Faixa Rosa. Todos os direitos reservados.`} />
      <meta name="language" content="Portuguese" />
      <meta name="revisit-after" content="1 day" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="adult" />
      <meta name="target" content="adults" />

      {/* Open Graph otimizado */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:url" content="https://www.faixarosa.com" />
      <meta property="og:site_name" content="Faixa Rosa" />
      <meta property="og:title" content="Faixa Rosa - As Melhores Acompanhantes do Brasil | Perfis 100% Verificados" />
      <meta
        property="og:description"
        content="★★★★★ A plataforma mais confiável! +10.000 acompanhantes verificadas, fotos reais, segurança total. Cadastro GRÁTIS! A melhor alternativa premium do mercado brasileiro."
      />
      <meta property="og:image" content="https://www.faixarosa.com/og-image.png" />
      <meta property="og:image:secure_url" content="https://www.faixarosa.com/og-image.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Faixa Rosa - Acompanhantes Verificadas Brasil #1" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:updated_time" content={currentDate.toISOString()} />

      {/* Twitter Card otimizado */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@faixarosabr" />
      <meta name="twitter:creator" content="@faixarosabr" />
      <meta name="twitter:title" content="🌹 Faixa Rosa - Acompanhantes Verificadas Brasil | A #1 em Confiança" />
      <meta
        name="twitter:description"
        content="★★★★★ Plataforma mais confiável! +10.000 perfis verificados, fotos reais, total segurança. Cadastro GRÁTIS para profissionais. Entre na #1 do Brasil!"
      />
      <meta name="twitter:image" content="https://www.faixarosa.com/twitter-image-2025.png" />
      <meta name="twitter:image:alt" content="Faixa Rosa - A Plataforma #1 de Acompanhantes do Brasil" />

      {/* Robots e indexação */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
      <meta name="bingbot" content="index, follow" />
      <meta name="yandexbot" content="index, follow" />

      {/* Canonical e alternates */}
      <link rel="canonical" href="https://www.faixarosa.com" />
      <link rel="alternate" href="https://www.faixarosa.com" hrefLang="pt-br" />
      <link rel="alternate" href="https://www.faixarosa.com" hrefLang="pt" />
      <link rel="alternate" href="https://www.faixarosa.com" hrefLang="x-default" />

      {/* Link para JSON-LD externo */}
      <link rel="alternate" type="application/ld+json" href="/schema.json" />

      {/* Preconnect para performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

      {/* Cache otimizado */}
      <meta httpEquiv="Cache-Control" content="public, max-age=86400, stale-while-revalidate=604800" />
      <meta httpEquiv="Expires" content={expireDate.toUTCString()} />
      <meta httpEquiv="Pragma" content="cache" />

      {/* Geo localização */}
      <meta name="geo.region" content="BR" />
      <meta name="geo.country" content="Brazil" />
      <meta name="geo.placename" content="Brasil" />
      <meta name="ICBM" content="-14.2350, -51.9253" />
      <meta name="geo.position" content="-14.2350;-51.9253" />

      {/* Dublin Core otimizado */}
      <meta name="DC.title" content="Faixa Rosa - Acompanhantes Verificadas Brasil | Plataforma #1" />
      <meta name="DC.creator" content="Faixa Rosa Brasil Ltda" />
      <meta name="DC.subject" content="Acompanhantes Verificadas, Garotas de Programa Premium, Escort Services Brasil" />
      <meta
        name="DC.description"
        content="Perfis verificados, fotos reais e sigilo garantido. A melhor plataforma para acompanhantes no Brasil"
      />
      <meta name="DC.publisher" content="Faixa Rosa Brasil" />
      <meta name="DC.contributor" content="Equipe Faixa Rosa" />
      <meta name="DC.date" content={currentDate.toISOString()} />
      <meta name="DC.type" content="InteractiveResource" />
      <meta name="DC.format" content="text/html; charset=utf-8" />
      <meta name="DC.identifier" content="https://www.faixarosa.com" />
      <meta name="DC.source" content="https://www.faixarosa.com" />
      <meta name="DC.language" content="pt-BR" />
      <meta name="DC.coverage" content="Brasil, América do Sul" />
      <meta name="DC.rights" content={`Copyright ${currentYear} Faixa Rosa Brasil. Todos os direitos reservados.`} />

      {/* PWA otimizado */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#ec4899" />
      <meta name="background-color" content="#ffffff" />
      <meta name="display" content="standalone" />
      <meta name="orientation" content="portrait-primary" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Faixa Rosa" />
      <meta name="application-name" content="Faixa Rosa" />
      <meta name="msapplication-TileColor" content="#ec4899" />
      <meta name="msapplication-config" content="/browserconfig.xml" />

      {/* Favicons e ícones otimizados */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link
        rel="mask-icon"
        href="/safari-pinned-tab.svg"
        color="#ec4899"
      />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />

      {/* Segurança e políticas */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      <meta name="rating" content="RTA-5042-1996-1400-1577-RTA" />
      <meta
        name="PICS-Label"
        content='(PICS-1.1 "http://www.classify.org/safesurf/" l r (SS~~000 1))'
      />

      {/* Verificações de mecanismos de busca */}
      <meta name="msvalidate.01" content="25D25C0199BF93F6D8618BB8BE055A09" />
      <meta name="yandex-verification" content="186f30a47ed07d1e" />

      {/* Schema.org JSON-LD inline */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateEnhancedJsonLd() }}
      />

      {/* Preload de recursos críticos */}
      <link rel="preload" href="/fonts/primary-font.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/css/critical.css" as="style" />
    </>
  );
}
