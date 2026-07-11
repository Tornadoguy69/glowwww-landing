import { motion } from "framer-motion";
import { QuantumLogo } from "./QuantumLogo";
import { easeOutExpo } from "../motion";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__content">
        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: 56 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: easeOutExpo }}
        >
          WHERE YOU
          <br />
          <span className="accent">GLOWWWW</span>
          <br />
          DIFFERENTLY
        </motion.h1>

        <motion.p
          className="hero__lead"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: easeOutExpo }}
        >
          A privacy-first, anti-algorithm everything app for creators —
          combining social, AI, messaging, and creation tools.
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease: easeOutExpo }}
        >
          <a
            href="https://glowwww.vercel.app"
            className="btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join Glowwww
          </a>
          <a href="#install" className="btn-ghost">
            Install the app
          </a>
        </motion.div>

        <motion.p
          className="hero__url"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          live at <strong>glowwww.vercel.app</strong>
        </motion.p>
      </div>

      <motion.div
        className="hero__visual"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.35, ease: easeOutExpo }}
      >
        <QuantumLogo />
      </motion.div>
    </section>
  );
}
