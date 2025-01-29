import Navbar from "./components/navbar";
import HeroSection from "./components/hero";
import VSLSection from "./components/vsl";
import TopAnunciantes from "./components/topAnunciantes";
import BlogSection from "./components/blog";
import Footer from "./components/footer";
import VerMais from "./components/vermais";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <VSLSection />
      <TopAnunciantes />
      <BlogSection />
      <VerMais />
      <Footer />
    </div>
  );
}
