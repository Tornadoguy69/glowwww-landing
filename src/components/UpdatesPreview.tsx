import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { blogPosts, formatDate } from "../content/posts";
import { fadeUp } from "../motion";

export function UpdatesPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const latest = blogPosts.slice(0, 3);

  return (
    <section id="updates" className="section updates-section" ref={ref}>
      <motion.div
        className="updates-section__head"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp}
        custom={0}
      >
        <div>
          <p className="section__label">Updates</p>
          <h2 className="section__title">
            LATEST FROM
            <br />
            <span style={{ color: "var(--red)" }}>THE BLOG</span>
          </h2>
        </div>
        <Link to="/blog" className="btn-ghost updates-section__all">
          View all posts
        </Link>
      </motion.div>

      <motion.div
        className="updates-grid"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp}
        custom={0.1}
      >
        {latest.map((post) => (
          <article key={post.slug} className="update-card">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <h3>
              <Link to={`/blog/${post.slug}`}>{post.title}</Link>
            </h3>
            <p>{post.excerpt}</p>
            <Link to={`/blog/${post.slug}`} className="update-card__link">
              Read →
            </Link>
          </article>
        ))}
      </motion.div>
    </section>
  );
}
