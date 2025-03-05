'use client'
import { useEffect, useState } from "react";
import HeroSection from "@/components/Home/hero";
import VSLSection from "@/components/Home/vsl";
import TopAnunciantes from "@/components/Home/topAnunciantes";
import BlogSection from "@/components/Home/blog";
import Footer from "@/components/Home/footer";
import VerMais from "@/components/Home/vermais";
import Navbar from "@/components/Navbar";
import { FaFire } from "react-icons/fa";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="min-h-screen">
      {loading && (
        <div className="flex justify-center items-center min-h-screen absolute inset-0 bg-white">
          <FaFire className="animate-pulse text-pink-500" size={50} />
        </div>
      )}

      <div className={`transition-opacity duration-1000 ${loading ? "opacity-0" : "opacity-100"}`}>
        <Navbar bgColor="white" />
        <HeroSection />
        <VSLSection />
        <TopAnunciantes />
        <BlogSection />
        <VerMais />
        <Footer />
      </div>
    </div>
  );
}
