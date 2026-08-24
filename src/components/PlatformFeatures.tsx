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
        <p className="section__label">What&apos;s in it</p>
        <h2 className="section__title">
          THE PARTS I
          <br />
          <span className="section__title-accent">ACTUALLY BUILT.</span>
        </h2>
        <p className="section__lead">
          A feed, an editor, an AI, private messages, communities, and a
          dashboard. One app I keep adding to — not another side project.
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
