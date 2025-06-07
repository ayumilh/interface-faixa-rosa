// ─── src/app/head.js ───
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

// Se você prefere manter a lógica de JSON-LD gerada dinamicamente, deixa a função aqui:
function generateJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.faixarosa.com/#website",
        url: "https://www.faixarosa.com",
        name: "Faixa Rosa",
        description: "Plataforma de acompanhantes verificadas no Brasil",
        publisher: {
          "@id": "https://www.faixarosa.com/#organization",
        },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate:
                "https://www.faixarosa.com/buscar?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        ],
        inLanguage: "pt-BR",
      },
      {
        "@type": "Organization",
        "@id": "https://www.faixarosa.com/#organization",
        name: "Faixa Rosa",
        url: "https://www.faixarosa.com",
        logo: {
          "@type": "ImageObject",
          inLanguage: "pt-BR",
          "@id": "https://www.faixarosa.com/#/schema/logo/image/",
          url: "https://www.faixarosa.com/icon-512.png",
          contentUrl: "https://www.faixarosa.com/icon-512.png",
          width: 512,
          height: 512,
          caption: "Faixa Rosa",
        },
        image: {
          "@id": "https://www.faixarosa.com/#/schema/logo/image/",
        },
        sameAs: [
          "https://www.instagram.com/faixarosa.brasil",
          "https://www.facebook.com/share/1FMkS9rGnF/?mibextid=wwXIfr",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          areaServed: "BR",
          availableLanguage: "Portuguese",
        },
        areaServed: {
          "@type": "Country",
          name: "Brasil",
        },
        knowsAbout: [
          "Acompanhantes",
          "Garotas de Programa",
          "Serviços para Adultos",
          "Plataforma Digital",
        ],
      },
      {
        "@type": "WebPage",
        "@id": "https://www.faixarosa.com/#webpage",
        url: "https://www.faixarosa.com",
        name: "Faixa Rosa - Acompanhantes Verificadas Brasil",
        isPartOf: {
          "@id": "https://www.faixarosa.com/#website",
        },
        about: {
          "@id": "https://www.faixarosa.com/#organization",
        },
        description:
          "Encontre acompanhantes verificadas em todo Brasil. Perfis reais, fotos autênticas, total discrição.",
        breadcrumb: {
          "@id": "https://www.faixarosa.com/#breadcrumb",
        },
        inLanguage: "pt-BR",
        potentialAction: [
          {
            "@type": "ReadAction",
            target: ["https://www.faixarosa.com"],
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.faixarosa.com/#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.faixarosa.com",
          },
        ],
      },
    ],
  };

  return JSON.stringify(jsonLd);
}

export default function Head() {
  return (
    <>
      {/* Meta tags básicas */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />

      {/* Title e description */}
      <title>Faixa Rosa - Acompanhantes em todo Brasil!</title>
      <meta
        name="description"
        content="🌹 Encontre acompanhantes verificadas em todo Brasil. Perfis reais, fotos autênticas, total discrição. Cadastro gratuito para profissionais. Acesse já!"
      />

      {/* Keywords */}
      <meta
        name="keywords"
        content="
          faixa rosa,
          faixarosa,
          faixa rosa brasil,
          acompanhantes brasil,
          acompanhantes verificadas,
          acompanhantes 2025,
          garotas de programa brasil,
          acompanhantes com fotos reais,
          acompanhantes discretas,
          acompanhantes de luxo,
          acompanhantes elite,
          alternativa fatal model,
          melhor que fatalmodel,
          concorrente skokka,
          alternativa photo acompanhantes,
          melhor que mclass,
          novo garotasvip,
          site acompanhantes confiável,
          plataforma acompanhantes segura,
          acompanhantes são paulo,
          acompanhantes rio janeiro,
          acompanhantes brasília,
          acompanhantes belo horizonte,
          acompanhantes salvador,
          acompanhantes fortaleza,
          acompanhantes recife,
          acompanhantes porto alegre,
          acompanhantes curitiba,
          buscar acompanhantes por cidade,
          anúncios acompanhantes verificados,
          site acompanhantes com descrição,
          cadastro acompanhantes gratis,
          acompanhantes com whatsapp,
          acompanhantes online agora
        "
      />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:url" content="https://www.faixarosa.com" />
      <meta property="og:site_name" content="Faixa Rosa" />
      <meta property="og:title" content="Faixa Rosa - Acompanhantes em todo Brasil" />
      <meta
        property="og:description"
        content="Encontre as melhores acompanhantes do Brasil. Perfis verificadas, fotos reais, total discrição. A plataforma mais confiável para adultos. Entre já!"
      />
      <meta property="og:image" content="/og-image.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Faixa Rosa - Acompanhantes Verificadas Brasil" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Faixa Rosa - Acompanhantes em todo Brasil!" />
      <meta
        name="twitter:description"
        content="🌹 Encontre acompanhantes verificadas em todo Brasil. Perfis reais, fotos autênticas, total discrição. Cadastro gratuito para profissionais. Acesse já!"
      />
      <meta name="twitter:image" content="/twitter-image.png" />

      {/* Outros metadados (robots, alternates, geo, DC, etc.) */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />

      <link rel="canonical" href="https://www.faixarosa.com" />
      <meta httpEquiv="Cache-Control" content="public, max-age=31536000" />
      <meta httpEquiv="Expires" content={new Date(Date.now() + 31536000000).toUTCString()} />

      <meta name="geo.region" content="BR" />
      <meta name="geo.country" content="Brazil" />
      <meta name="geo.placename" content="Brasil" />
      <meta name="ICBM" content="-14.2350, -51.9253" />

      {/* Dublin Core */}
      <meta name="DC.title" content="Faixa Rosa - Acompanhantes Verificadas Brasil" />
      <meta name="DC.creator" content="Faixa Rosa" />
      <meta name="DC.subject" content="Acompanhantes, Garotas de Programa, Brasil" />
      <meta
        name="DC.description"
        content="Plataforma de acompanhantes verificadas no Brasil"
      />
      <meta name="DC.publisher" content="Faixa Rosa Brasil" />
      <meta name="DC.contributor" content="Faixa Rosa Team" />
      <meta name="DC.date" content={new Date().toISOString()} />
      <meta name="DC.type" content="website" />
      <meta name="DC.format" content="text/html" />
      <meta name="DC.identifier" content="https://www.faixarosa.com" />
      <meta name="DC.source" content="https://www.faixarosa.com" />
      <meta name="DC.language" content="pt-BR" />
      <meta name="DC.relation" content="https://www.faixarosa.com" />
      <meta name="DC.coverage" content="Brasil" />
      <meta name="DC.rights" content="Copyright 2025 Faixa Rosa" />

      {/* Validações e verificações */}
      <meta name="msvalidate.01" content="25D25C0199BF93F6D8618BB8BE055A09" />
      <meta name="yandex-verification" content="186f30a47ed07d1e" />

      {/* PWA / Mobile */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Faixa Rosa" />

      {/* Favicons e icons diversos */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link
        rel="mask-icon"
        href="/safari-pinned-tab.svg"
        color="#ec4899"
      />
      <link rel="icon" href="/favicon.ico" />

      {/* Segurança e políticas */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta name="rating" content="RTA-5042-1996-1400-1577-RTA" />
      <meta
        name="PICS-Label"
        content='(PICS-1.1 "http://www.classify.org/safesurf/" l r (SS~~000 1))'
      />

      {/* JSON-LD Estruturado dentro do head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateJsonLd() }}
      />
    </>
  );
}
