import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { platformFeatures } from "../content/features";
import { easeOutExpo, fadeUp, staggerContainer } from "../motion";

export default function PlatformFeatures() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="section" ref={ref}>
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp}
        custom={0}
      >
        <p className="section__label">Platform</p>
        <h2 className="section__title">
          EVERYTHING YOU NEED.
          <br />
          <span className="section__title-accent">NOTHING YOU DON&apos;T.</span>
        </h2>
        <p className="section__lead">
          Six surfaces. One native stack. Social, creation, AI, messaging,
          communities, and analytics — built to work together in real time.
        </p>
      </motion.div>

      <motion.div
        className="platform-features__grid"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        {platformFeatures.map((f) => (
          <motion.article
            key={f.id}
            className="feature-card platform-feature"
            variants={{
              hidden: { opacity: 0, y: 28 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.55, ease: easeOutExpo },
              },
            }}
          >
            <div className="platform-feature__icon" aria-hidden>
              {f.icon}
            </div>
            <div className="platform-feature__tag">{f.tagline}</div>
            <h3 className="feature-card__title">{f.title}</h3>
            <p className="feature-card__desc">{f.description}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
