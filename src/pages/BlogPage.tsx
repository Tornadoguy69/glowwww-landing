import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BlogBackButton } from "../components/BlogBackButton";
import { PageShell } from "../components/layout/PageShell";
import { blogPosts, formatDate } from "../content/posts";
import { easeOutExpo, fadeUp } from "../motion";

const categoryLabel: Record<string, string> = {
  update: "Update",
  product: "Product",
  company: "Company",
};

function shortDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <PageShell>
      <main className="blog-page">
        <motion.div
          className="blog-page__back"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: easeOutExpo }}
        >
          <BlogBackButton to="/" label="Back to home" />
        </motion.div>

        <motion.header
          className="blog-page__header"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <div className="blog-page__eyebrow">
            <span className="ic" aria-hidden>
              <svg className="ic-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13.5 5.5 18.5 10.5" />
                <path d="M5 19.5 6.2 15.2 16.8 4.6a1.8 1.8 0 0 1 2.6 2.6L8.8 17.8 5 19.5z" />
              </svg>
            </span>
            Blog &amp; updates
          </div>
          <h1 className="blog-page__title">
            News from <span className="em">Glowwww</span>.
          </h1>
          <p className="blog-page__lead">
            Notes from a solo build — what shipped, what surprised me, and what&apos;s coming next.
          </p>
        </motion.header>

        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: easeOutExpo }}
          >
            <Link to={`/blog/${featured.slug}`} className="blog-featured">
              <div className="blog-featured__inner">
                <div className="blog-featured__badge">Latest</div>
                <div className="blog-featured__meta">
                  <span>{categoryLabel[featured.category]}</span>
                  <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                </div>
                <h2 className="blog-featured__title">{featured.title}</h2>
                <p className="blog-featured__excerpt">{featured.excerpt}</p>
                <span className="blog-featured__read">Read post →</span>
              </div>
            </Link>
          </motion.div>
        )}

        <div className="blog-list">
          {rest.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.14 + i * 0.05,
                ease: easeOutExpo,
              }}
            >
              <Link to={`/blog/${post.slug}`} className="blog-card">
                <div className="blog-card__meta">
                  <span>{categoryLabel[post.category]}</span>
                  <time dateTime={post.date}>{shortDate(post.date)}</time>
                </div>
                <h2 className="blog-card__title">{post.title}</h2>
                <p className="blog-card__excerpt">{post.excerpt}</p>
                <span className="blog-card__read">Read post →</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
