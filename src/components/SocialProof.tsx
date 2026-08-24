import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeUp, staggerContainer } from "../motion";

const testimonials = [
  {
    quote: "Finally, a platform that doesn't bury my posts. If people follow me, they see it.",
    author: "Maya Chen",
    role: "Digital Artist",
  },
  {
    quote: "The AI tools alone are worth it. I draft, edit, and ship without ever leaving the app.",
    author: "James Ori",
    role: "Writer & Creator",
  },
  {
    quote: "Moved my community here. Moderation that actually works, and posts that actually land.",
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
          <p className="section__label">Early users</p>
          <h2 className="section__title">
            WHAT PEOPLE
            <br />
            <span style={{ color: "var(--red)" }}>HAVE SAID</span>
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
