import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContextProvider } from "@/context/AuthContext";
import { PlanProvider } from "@/context/PlanContext";
import { generateMetadata } from "./metadata";
import SocketWrapper from "@/providers/SocketWrapper";

export const metadata = await generateMetadata()


export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <title>{metadata.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>

      <body className="antialiased">
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
