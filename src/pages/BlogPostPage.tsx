import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCallback, useEffect, type ReactNode } from "react";
import { BlogBackButton } from "../components/BlogBackButton";
import { PageShell } from "../components/layout/PageShell";
import { getPost, getAdjacentPosts, formatDate, type BodyItem } from "../content/posts";
import { easeOutExpo } from "../motion";

const categoryLabel: Record<string, string> = {
  update: "Update",
  product: "Product",
  company: "Company",
};

function ArrowLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M12 4L6 10L12 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M8 4L14 10L8 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PostPager({
  prev,
  next,
}: {
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}) {
  return (
    <nav className="blog-post__pager" aria-label="Post controls">
      <div className="blog-post__pager-slot blog-post__pager-slot--left">
        <BlogBackButton to="/blog" label="Back to blog" />
      </div>
      <div className="blog-post__pager-slot blog-post__pager-slot--center">
        {prev ? (
          <BlogBackButton
            to={`/blog/${prev.slug}`}
            label="Previous"
            direction="back"
            title={prev.title}
          />
        ) : (
          <span className="blog-back-btn blog-back-btn--disabled" aria-disabled="true">
            <ArrowLeft />
            <span>Previous</span>
          </span>
        )}
        {next ? (
          <BlogBackButton
            to={`/blog/${next.slug}`}
            label="Next"
            direction="next"
            title={next.title}
          />
        ) : (
          <span className="blog-back-btn blog-back-btn--disabled" aria-disabled="true">
            <span>Next</span>
            <ArrowRight />
          </span>
        )}
      </div>
      {/* balance column so center stays dead-center */}
      <div className="blog-post__pager-slot blog-post__pager-slot--right" aria-hidden="true">
        <span className="blog-post__pager-balance">Back to blog</span>
      </div>
    </nav>
  );
}

/** Split "Heading — body" lines into a subhead + paragraph for scanability */
function renderTextBlock(text: string, key: number): ReactNode {
  const emDash = text.match(/^(.{3,72}?)\s+[—–-]\s+(.+)$/s);
  if (emDash && !emDash[1].includes(".")) {
    return (
      <div key={key}>
        <h3>{emDash[1].trim()}</h3>
        <p>{emDash[2].trim()}</p>
      </div>
    );
  }
  return <p key={key}>{text}</p>;
}

function renderBody(body: BodyItem[]) {
  return body.map((item, i) => {
    if (typeof item === "string") return renderTextBlock(item, i);
    if (item.type === "image") {
      return (
        <figure key={i} className="blog-post__media">
          <img src={item.src} alt={item.alt ?? ""} className="blog-post__image" loading="lazy" />
        </figure>
      );
    }
    return (
      <figure key={i} className="blog-post__media">
        <video
          src={item.src}
          className="blog-post__video"
          controls
          playsInline
          preload="metadata"
          poster={item.poster}
        />
      </figure>
    );
  });
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getPost(slug) : undefined;
  const adjacent = slug ? getAdjacentPosts(slug) : { prev: null, next: null };

  const goPrev = useCallback(() => {
    if (adjacent.prev) navigate(`/blog/${adjacent.prev.slug}`);
  }, [adjacent.prev, navigate]);

  const goNext = useCallback(() => {
    if (adjacent.next) navigate(`/blog/${adjacent.next.slug}`);
  }, [adjacent.next, navigate]);

  // Keep scroll locked to top so height differences don't feel like a jump
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Arrow keys: ← previous post, → next post
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if ((e.target as HTMLElement | null)?.isContentEditable) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  if (!post) {
    return (
      <PageShell>
        <main className="blog-post">
          <div className="blog-empty">
            <h1 className="blog-page__title">Post not found</h1>
            <BlogBackButton to="/blog" label="Back to blog" />
          </div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="blog-post">
        <PostPager prev={adjacent.prev} next={adjacent.next} />

        <motion.article
          key={post.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.28, ease: easeOutExpo }}
        >
          <div className="blog-post__meta">
            <span>{categoryLabel[post.category]}</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
          <h1 className="blog-post__title">{post.title}</h1>
          <div className="blog-post__body">{renderBody(post.body)}</div>
        </motion.article>

        <nav className="blog-nav" aria-label="Post navigation">
          <div className="blog-nav__cell">
            {adjacent.prev ? (
              <Link
                to={`/blog/${adjacent.prev.slug}`}
                className="blog-nav__link blog-nav__link--prev"
              >
                <ArrowLeft />
                <div className="blog-nav__text">
                  <span className="blog-nav__label">Previous</span>
                  <span className="blog-nav__title">{adjacent.prev.title}</span>
                </div>
              </Link>
            ) : (
              <div className="blog-nav__placeholder" aria-hidden="true" />
            )}
          </div>
          <div className="blog-nav__cell">
            {adjacent.next ? (
              <Link
                to={`/blog/${adjacent.next.slug}`}
                className="blog-nav__link blog-nav__link--next"
              >
                <div className="blog-nav__text">
                  <span className="blog-nav__label">Next</span>
                  <span className="blog-nav__title">{adjacent.next.title}</span>
                </div>
                <ArrowRight />
              </Link>
            ) : (
              <div className="blog-nav__placeholder" aria-hidden="true" />
            )}
          </div>
        </nav>
      </main>
    </PageShell>
  );
}
