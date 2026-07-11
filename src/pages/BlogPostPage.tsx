import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { useCallback } from "react";
import { PageShell } from "../components/layout/PageShell";
import { getPost, getAdjacentPosts, formatDate } from "../content/posts";
import { fadeUp } from "../motion";

const categoryLabel: Record<string, string> = {
  update: "Update",
  product: "Product",
  company: "Company",
};

function ArrowLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getPost(slug) : undefined;
  const adjacent = slug ? getAdjacentPosts(slug) : { prev: null, next: null };

  const x = useMotionValue(0);
  const swipeOpacity = useTransform(x, [-100, 0, 100], [0.4, 1, 0.4]);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (!adjacent) return;
      const horizontal = Math.abs(info.offset.x) > Math.abs(info.offset.y);
      if (!horizontal) return;
      if (info.offset.x < -140 && adjacent.next) {
        navigate(`/blog/${adjacent.next.slug}`);
      } else if (info.offset.x > 140 && adjacent.prev) {
        navigate(`/blog/${adjacent.prev.slug}`);
      }
    },
    [adjacent, navigate]
  );

  if (!post) {
    return (
      <PageShell>
        <main className="blog-post section">
          <h1 className="section__title">Post not found</h1>
          <Link to="/blog" className="blog-back">
            ← Back to blog
          </Link>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="blog-post">
        <motion.article
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          style={{ x, opacity: swipeOpacity }}
          drag="x"
          dragDirectionLock
          dragSnapToOrigin
          dragElastic={0.08}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          whileTap={{ cursor: "grabbing" }}
        >
          <Link to="/blog" className="blog-back">
            ← All posts
          </Link>
          <div className="blog-post__meta">
            <span className="blog-card__category">{categoryLabel[post.category]}</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
          <h1 className="blog-post__title">{post.title}</h1>
          <div className="blog-post__body">
            {post.body.map((item, i) =>
              typeof item === "string" ? (
                <p key={i}>{item}</p>
              ) : item.type === "image" ? (
                <img key={i} src={item.src} alt={item.alt ?? ""} className="blog-post__image" />
              ) : (
                <video key={i} src={item.src} controls playsInline className="blog-post__video" />
              )
            )}
          </div>
        </motion.article>

        <nav className="blog-nav">
          {adjacent.prev ? (
            <Link to={`/blog/${adjacent.prev.slug}`} className="blog-nav__link blog-nav__link--prev">
              <ArrowLeft />
              <div className="blog-nav__text">
                <span className="blog-nav__label">Previous</span>
                <span className="blog-nav__title">{adjacent.prev.title}</span>
              </div>
            </Link>
          ) : <div />}
          {adjacent.next ? (
            <Link to={`/blog/${adjacent.next.slug}`} className="blog-nav__link blog-nav__link--next">
              <div className="blog-nav__text">
                <span className="blog-nav__label">Next</span>
                <span className="blog-nav__title">{adjacent.next.title}</span>
              </div>
              <ArrowRight />
            </Link>
          ) : <div />}
        </nav>
      </main>
    </PageShell>
  );
}
