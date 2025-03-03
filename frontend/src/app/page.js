import HeroSection from "@/components/Home/hero";
import VSLSection from "@/components/Home/vsl";
import TopAnunciantes from "@/components/Home/topAnunciantes";
import BlogSection from "@/components/Home/blog";
import Footer from "@/components/Home/footer";
import VerMais from "@/components/Home/vermais";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div>
      <Navbar bgColor='white' />
      <HeroSection />
      <VSLSection />
      <TopAnunciantes />
      <BlogSection />
      <VerMais />
      <Footer />
    </div>
  );
}
