import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Navbar from "@/components/Navbar";
import Problem from "@/components/Problem";
import TryDemo from "@/components/TryDemo";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden font-sans">
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <TryDemo />
      <CtaBanner />
      <Footer />
    </main>
  );
}
