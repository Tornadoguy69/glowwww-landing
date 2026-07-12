import { motion } from "framer-motion";
import { QuantumLogo } from "./QuantumLogo";
import { easeOutExpo } from "../motion";

const chips = ["Privacy-first", "Anti-algorithm", "AI native", "PWA"];

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__content">
        <motion.p
          className="hero__eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
        >
          The everything app for creators
        </motion.p>

        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.18, ease: easeOutExpo }}
        >
          CREATE
          <br />
          WITHOUT
          <br />
          <span className="accent">THE CAGE</span>
        </motion.h1>

        <motion.p
          className="hero__lead"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.4, ease: easeOutExpo }}
        >
          Social, AI, messaging, and creation tools in one privacy-first app.
          Your feed. Your signal. No algorithm jail.
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.55, ease: easeOutExpo }}
        >
          <motion.a
            href="https://glowwww.vercel.app"
            className="btn-primary"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
          >
            Open Glowwww free
          </motion.a>
          <a href="#demos" className="btn-ghost">
            Watch demos
          </a>
        </motion.div>

        <motion.ul
          className="hero__chips"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
        >
          {chips.map((chip) => (
            <li key={chip} className="hero__chip">
              {chip}
            </li>
          ))}
        </motion.ul>
      </div>

      <motion.div
        className="hero__visual"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.05, delay: 0.3, ease: easeOutExpo }}
      >
        <QuantumLogo />
      </motion.div>
    </section>
  );
}
