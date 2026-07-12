import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Nav } from "../components/Nav";
import { Hero } from "../components/Hero";
import { Marquee } from "../components/Marquee";
import { DemoShowcase } from "../components/DemoShowcase";
import PlatformFeatures from "../components/PlatformFeatures";
import { AppPreview } from "../components/AppPreview";
import PWAInstall from "../components/PWAInstall";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";

export function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  return (
    <div className="landing">
      <div className="ambient" aria-hidden>
        <div className="ambient__orb ambient__orb--red" />
        <div className="ambient__orb ambient__orb--prism" />
        <div className="ambient__orb ambient__orb--rose" />
        <div className="ambient__grid" />
        <div className="ambient__vignette" />
      </div>

      <Nav />
      <main>
        <Hero />
        <Marquee />
        <DemoShowcase />
        <PlatformFeatures />
        <AppPreview />
        <PWAInstall />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
