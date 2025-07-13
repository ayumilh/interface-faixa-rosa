import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContextProvider } from "../context/AuthContext";
import { PlanProvider } from "../context/PlanContext";
import SocketWrapper from "../providers/SocketWrapper";
import SWUpdater from "../components/SWUpdater";

export const metadata = {
  title: "Faixa Rosa – Acompanhantes em todo Brasil!",
  description:
    "Descubra acompanhantes verificadas em todo o Brasil. Plataforma segura, discreta e confiável para adultos.",
  keywords: [
    "acompanhantes",
    "faixa rosa",
    "garotas de programa",
    "fatalmodel",
    "skokka",
    "photo acompanhantes",
    "site de acompanhantes",
    "anúncios adultos",
    "mulheres para sair",
  ],
  openGraph: {
    title: "Faixa Rosa – Acompanhantes em todo Brasil!",
    description:
      "Perfis verificados, fotos reais e sigilo garantido. A melhor plataforma para acompanhantes no Brasil.",
    url: "https://www.faixarosa.com",
    siteName: "Faixa Rosa",
    images: [
      {
        url: "https://www.faixarosa.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Faixa Rosa Capa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Faixa Rosa – Acompanhantes em todo Brasil!",
    description:
      "Encontre acompanhantes verificadas com segurança e descrição.",
    images: ["https://www.faixarosa.com/og-image.png"],
  },
  metadataBase: new URL("https://www.faixarosa.com"),
  alternates: {
    canonical: "https://www.faixarosa.com",
  },
  referrer: "origin-when-cross-origin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec4899" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body className="antialiased">
        <SWUpdater />
        <AuthContextProvider>
          <PlanProvider>
            <SocketWrapper />
            {children}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </PlanProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
