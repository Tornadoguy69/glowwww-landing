import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageShell } from "../components/layout/PageShell";
import { blogPosts, formatDate } from "../content/posts";
import { fadeUp } from "../motion";

const categoryLabel: Record<string, string> = {
  update: "Update",
  product: "Product",
  company: "Company",
};

export function BlogPage() {
  return (
    <PageShell>
      <main className="blog-page">
        <motion.header
          className="blog-page__header section"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <p className="section__label">Blog & updates</p>
          <h1 className="section__title">
            NEWS FROM
            <br />
            <span style={{ color: "var(--red)" }}>GLOWWWW</span>
          </h1>
        </motion.header>

        <div className="blog-list section">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.slug}
              className="blog-card"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="blog-card__meta">
                <span className="blog-card__category">{categoryLabel[post.category]}</span>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
              <h2 className="blog-card__title">
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="blog-card__excerpt">{post.excerpt}</p>
              <Link to={`/blog/${post.slug}`} className="blog-card__read">
                Read post →
              </Link>
            </motion.article>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
