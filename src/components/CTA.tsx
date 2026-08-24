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
      <p className="cta__eyebrow">It&apos;s live</p>
      <h2 className="cta__title">
        YOU CAN JUST
        <br />
        <span className="accent">OPEN IT.</span>
      </h2>
      <p className="cta__sub">
        No invite. Works in the browser. Install it later if you want an icon
        on your home screen.
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
          Open Glowwww
        </motion.a>
        <a href="#install" className="btn-ghost">
          Add to home screen
        </a>
      </div>
    </motion.section>
  );
}
