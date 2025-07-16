import HeroSection from "../components/Home/hero";
import TopAnunciantes from "../components/Home/topAnunciantes";
import BlogSection from "../components/Home/blog";
import VerMais from "../components/Home/vermais";
import Footer from "../components/Home/footer";
import Banners from "../components/Home/banners";
import Cidades from "../components/Home/cidades";

import ClientHomeWrapper from "./ClientHomeWrapper"; // Novo arquivo client

export default function Page() {
  return (
    <>
      {/* Componentes SSR */}
      <Banners />
      <Cidades />
      <TopAnunciantes />
      <HeroSection />
      <BlogSection />
      <VerMais />
      <Footer />

      {/* Wrapper Client com Loader, Navbar, ConsentModal, VSL */}
      <ClientHomeWrapper />
    </>
  );
}
