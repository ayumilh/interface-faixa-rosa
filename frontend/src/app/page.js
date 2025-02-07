import Navbar from "@/components/Home/navbar";
import HeroSection from "@/components/Home/hero";
import VSLSection from "@/components/Home/vsl";
import TopAnunciantes from "@/components/Home/topAnunciantes";
import BlogSection from "@/components/Home/blog";
import Footer from "@/components/Home/footer";
import VerMais from "@/components/Home/vermais";

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
