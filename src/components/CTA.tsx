import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeUp } from "../motion";

export function CTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.section
      ref={ref}
      className="cta"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp}
      custom={0}
    >
      <div className="cta__glow" />
      <p className="cta__eyebrow">Ready when you are</p>
      <h2 className="cta__title">
        STOP SCROLLING.
        <br />
        <span className="accent">START GLOWWWW.</span>
      </h2>
      <p className="cta__sub">
        One app for creators who want signal over noise — social, AI, messaging,
        and tools that actually ship with you.
      </p>
      <div className="cta__actions">
        <motion.a
          href="https://glowwww.vercel.app"
          className="btn-primary"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          Launch Glowwww
        </motion.a>
        <a href="#install" className="btn-ghost">
          Install as app
        </a>
      </div>
    </motion.section>
  );
}
