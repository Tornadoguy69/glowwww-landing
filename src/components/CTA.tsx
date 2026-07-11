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
      <h2 className="cta__title">
        <span className="accent">GLOWWWW</span>
        <br />
        AWAITS
      </h2>
      <p className="cta__sub">
        Stop scrolling. Start building, creating, and connecting. Your Glowwww. Your signal.
      </p>
      <div className="cta__actions">
        <motion.a
          href="https://glowwww.vercel.app"
          className="btn-primary"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          Open Glowwww
        </motion.a>
        <a href="#features" className="btn-ghost">
          Learn more
        </a>
      </div>
    </motion.section>
  );
}
