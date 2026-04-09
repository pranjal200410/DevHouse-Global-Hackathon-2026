import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Problem from "./components/Problem";
import HowItWorks from "./components/HowItWorks";
import TryDemo from "./components/TryDemo";
import CtaBanner from "./components/CtaBanner";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <main className="bg-navy min-h-screen overflow-x-hidden font-sans">
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
