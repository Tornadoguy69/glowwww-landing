import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeUp, staggerContainer } from "../motion";

const testimonials = [
  {
    quote: "Finally, a platform that doesn't punish me for posting too much. My signal, my rules.",
    author: "Maya Chen",
    role: "Digital Artist",
  },
  {
    quote: "The AI tools alone are worth it. I draft, edit, and ship without ever leaving the app.",
    author: "James Ori",
    role: "Writer & Creator",
  },
  {
    quote: "Moved my entire community here. Moderation that actually works, no algorithm drama.",
    author: "Samir Patel",
    role: "Community Builder",
  },
];

export function SocialProof() {
  const testRef = useRef(null);
  const testInView = useInView(testRef, { once: true, margin: "-60px" });

  return (
    <>
      <section className="section testimonials-section" ref={testRef}>
        <motion.div
          initial="hidden"
          animate={testInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={0}
        >
          <p className="section__label">Trusted by creators</p>
          <h2 className="section__title">
            WHAT USERS
            <br />
            <span style={{ color: "var(--red)" }}>ARE SAYING</span>
          </h2>
        </motion.div>
        <motion.div
          className="testimonials-grid"
          initial="hidden"
          animate={testInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {testimonials.map((t) => (
            <motion.blockquote key={t.author} className="testimonial-card" variants={fadeUp} custom={0.1}>
              <p className="testimonial-card__quote">&ldquo;{t.quote}&rdquo;</p>
              <footer className="testimonial-card__author">
                <strong>{t.author}</strong>
                <span>{t.role}</span>
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </section>
    </>
  );
}
