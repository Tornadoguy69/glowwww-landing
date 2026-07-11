import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Nav } from "../components/Nav";
import { Hero } from "../components/Hero";
import { VideoHero } from "../components/VideoHero";
import { Marquee } from "../components/Marquee";
import PlatformFeatures from "../components/PlatformFeatures";
import { AppPreview } from "../components/AppPreview";
import { BillboardGallery } from "../components/BillboardGallery";
import PWAInstall from "../components/PWAInstall";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";
import AgentOverlay from "../components/AgentOverlay";
import AgentTestTrigger from "../components/AgentTestTrigger";

export function HomePage() {
  const { hash } = useLocation();
  const [agentOpen, setAgentOpen] = useState(false);

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
        <VideoHero />
        <Marquee />
        <PlatformFeatures />
        <AppPreview />
        <BillboardGallery />
        <PWAInstall />
        <CTA />
      </main>
      <Footer />

      {agentOpen && <AgentOverlay onClose={() => setAgentOpen(false)} />}
      <AgentTestTrigger onClick={() => setAgentOpen(true)} />
    </div>
  );
}
