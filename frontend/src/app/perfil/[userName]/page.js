// ✅ page.js (metadata dinâmico para perfis)

import ClientPerfil from "./ClientPerfil";

export async function generateMetadata({ params }) {
  const userName = params?.userName;

  if (!userName) {
    return {
      title: "Perfil – Faixa Rosa",
      description: "Confira perfis de acompanhantes verificados no Faixa Rosa.",
      metadataBase: new URL("https://www.faixarosa.com"),
      alternates: {
        canonical: "https://www.faixarosa.com/perfil",
      },
    };
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/profile?userName=${userName}`;

  try {
    const res = await fetch(apiUrl, { next: { revalidate: 60 } });
    const data = await res.json();

    if (!data || data.error) {
      return {
        title: `Perfil de ${userName} – Faixa Rosa`,
        description: `Veja o perfil de ${userName} no Faixa Rosa. Plataforma com verificação, fotos reais e descrição profissional.`,
        metadataBase: new URL("https://www.faixarosa.com"),
        alternates: {
          canonical: `https://www.faixarosa.com/perfil/${userName}`,
        },
      };
    }

    const displayName = data.firstName || data.userName;
    const city = data.city || "";
    const state = data.state || "";
    const description = data.description ? data.description.slice(0, 160) : `Perfil de ${displayName} no Faixa Rosa.`;
    const profileImage = data.profileImage || "https://www.faixarosa.com/Faixa%20Rosa-%20Fundo%20branco.png";

    return {
      title: `${displayName} – Acompanhante em ${city} - ${state} | Faixa Rosa`,
      description,
      keywords: [
        displayName,
        `Acompanhante ${city}`,
        `Garota de programa ${city}`,
        `Faixa Rosa ${displayName}`,
        "acompanhantes verificados",
        "site de acompanhantes",
        "mulheres para sair",
        "fotos reais acompanhantes",
      ],
      openGraph: {
        title: `${displayName} – Acompanhante em ${city} - ${state} | Faixa Rosa`,
        description,
        url: `https://www.faixarosa.com/perfil/${userName}`,
        siteName: "Faixa Rosa",
        images: [
          {
            url: profileImage,
            width: 1200,
            height: 630,
            alt: `Perfil de ${displayName}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${displayName} – Perfil no Faixa Rosa`,
        description,
        images: [profileImage],
      },
      alternates: {
        canonical: `https://www.faixarosa.com/perfil/${userName}`,
      },
      metadataBase: new URL("https://www.faixarosa.com"),
      category: "adult",
      themeColor: "#ff1493",
    };
  } catch (error) {
    return {
      title: `Perfil – Faixa Rosa`,
      description: "Confira perfis de acompanhantes verificados no Faixa Rosa.",
      metadataBase: new URL("https://www.faixarosa.com"),
    };
  }
}

export default function Page() {
  return <ClientPerfil />;
}
