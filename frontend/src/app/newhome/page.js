import Navbar from "./components/navbar";
import HeroSection from "./components/hero";
import VSLSection from "./components/vsl";
import TopAnunciantes from "./components/topAnunciantes";
import BlogSection from "./components/blog";
import VerMais from "./components/vermais";
import Footer from "./components/footer";
import Cookies from "./components/Cookies"; // Removido o espaço extra

export default function HomePage() {
  return (
    <div className="bg-[#ebeff1] text-white">
      <Cookies /> {/* Exibe a mensagem de cookies */}
      
      <main className="relative">
        <Navbar />
        <HeroSection />
        <VSLSection />
        <TopAnunciantes />
        <BlogSection />
        
      <VerMais />
      </main>
      

      <Footer />
    </div>
  );
}
