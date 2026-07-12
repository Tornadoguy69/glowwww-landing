import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeUp } from "../motion";

interface Guide {
  id: string;
  short: string;
  title: string;
  steps: string[];
}

const guides: Guide[] = [
  {
    id: "ios",
    short: "iOS",
    title: "Safari on iPhone & iPad",
    steps: [
      "Open glowwww.vercel.app in Safari (not an in-app browser).",
      "Tap Share, then Add to Home Screen.",
      "Confirm Add — launch full-screen from your home screen.",
    ],
  },
  {
    id: "android",
    short: "Android",
    title: "Chrome on phones & tablets",
    steps: [
      "Open glowwww.vercel.app in Chrome.",
      "Tap menu (⋮) → Install app or Add to Home screen.",
      "Open from your drawer — offline-ready PWA mode.",
    ],
  },
  {
    id: "desktop",
    short: "Desktop",
    title: "Chrome & Edge",
    steps: [
      "Visit glowwww.vercel.app in Chrome or Edge.",
      "Click the install icon in the address bar.",
      "Pin to taskbar or dock — no browser tab needed.",
    ],
  },
];

export default function PWAInstall() {
  const [active, setActive] = useState(guides[0].id);
  const guide = guides.find((g) => g.id === active)!;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="install" className="section" ref={ref}>
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp}
        custom={0}
      >
        <p className="section__label">Install</p>
        <h2 className="section__title">
          ONE TAP.
          <br />
          <span className="section__title-accent">FEELS NATIVE.</span>
        </h2>
        <p className="section__lead">
          Install Glowwww as a PWA. Updates ship when you launch — no store
          downloads, no version lag.
        </p>
      </motion.div>

      <motion.div
        className="pwa-layout"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp}
        custom={0.1}
      >
        <div>
          <div className="pwa-tabs">
            {guides.map((g) => (
              <button
                key={g.id}
                type="button"
                className={`pwa-tab${g.id === active ? " pwa-tab--active" : ""}`}
                onClick={() => setActive(g.id)}
              >
                {g.short}
              </button>
            ))}
          </div>
          <p className="pwa-guide__subtitle">{guide.title}</p>
          <ol className="pwa-steps">
            {guide.steps.map((step, i) => (
              <li key={i}>
                <span className="pwa-steps__num">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <a
            href="https://glowwww.vercel.app"
            className="btn-primary pwa-open"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open app to install
          </a>
        </div>
        <div className="pwa-mock">
          <div className="pwa-mock__badge">PWA ready</div>
          <div className="pwa-phone">
            <div className="pwa-phone__status">
              <span>9:41</span>
              <span className="pwa-phone__signal">●●●●</span>
            </div>
            <div className="pwa-phone__homescreen">
              <div className="pwa-phone__wallpaper" />
              <div className="pwa-phone__hero-icon">
                <div className="pwa-phone__logo">G</div>
                <span>Glowwww</span>
              </div>
              <div className="pwa-phone__dock">
                <div className="pwa-phone__dock-bar" />
              </div>
            </div>
          </div>
          <p className="pwa-mock__caption">
            Standalone window. Home-screen icon. Feels like a native install.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
