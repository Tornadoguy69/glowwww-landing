import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useInView } from "../../lib/hooks";
import { Layout } from "../site/Layout";
import { Hero } from "./Hero";
import { Why } from "./Why";
import { Film } from "./Film";
import { Agent } from "./Agent";
import { TheApp } from "./TheApp";
import { Install } from "./Install";
import { Build, Finale } from "./Sections";

/** Deep links land on the right section without the smooth-scroll jank. */
function useHashScroll() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, [hash]);
}

/**
 * The Slit — a vermilion rule that draws itself across the page just before
 * the dark film band, so the hard cut arrives as a projected slit of charcoal
 * through paper rather than as the next section. It closes again on scroll-up.
 */
function Slit() {
  const { ref, inView } = useInView<HTMLDivElement>(0.5, { once: false });
  return (
    <div className="wrap" aria-hidden>
      <div ref={ref} className="slit" data-in={inView ? "1" : "0"} />
    </div>
  );
}

export function HomePage() {
  useHashScroll();

  return (
    <Layout>
      <Hero />
      <Why />
      <Slit />
      <Film />
      <Agent />
      <TheApp />
      <Install />
      <Build />
      <Finale />
    </Layout>
  );
}

export default HomePage;