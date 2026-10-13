import { Link } from "react-router-dom";
import { blogPosts, formatDate, POST_COVERS, type BlogPost } from "../content/posts";
import { Layout } from "../components/site/Layout";
import { Icon } from "../components/site/Kit";
import { Fade, FadeList } from "../components/site/Motion";
import { LogoMark } from "../components/LogoMark";

export const CATEGORY_LABEL: Record<string, string> = {
  update: "Update",
  product: "Product",
  company: "Company",
};

export const monthYear = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", year: "numeric" });

/**
 * Cover art. Uses the post's image when it has one and falls back to the
 * category mark, so a new post is never published with an empty box.
 */
function Cover({ post, className = "" }: { post: BlogPost; className?: string }) {
  const cover = POST_COVERS[post.slug];

  return (
    <div className={`cover ${className}`.trim()} aria-hidden={cover ? undefined : true}>
      {cover ? (
        <img src={cover.src} alt={cover.alt} loading="lazy" decoding="async" />
      ) : (
        <>
          <LogoMark size={44} />
          <span className="cover__cat">{CATEGORY_LABEL[post.category] ?? post.category}</span>
        </>
      )}
    </div>
  );
}

export function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <Layout>
      <div className="page-head">
        <div className="wrap">
          <Fade as="p">
            <Link className="link-arrow" to="/">
              <span style={{ display: "inline-flex", rotate: "180deg" }}>
                <Icon.arrow size={15} />
              </span>
              Back to the site
            </Link>
          </Fade>

          <Fade>
            <p className="eyebrow">Writing</p>
            <h1>What I shipped, and what broke.</h1>
            <p className="lede">
              Notes from building one app alone. The wins, the failures, and the parts I still
              don&rsquo;t understand. Same person who wrote the code.
            </p>
          </Fade>
        </div>
      </div>

      <div className="wrap" style={{ paddingBottom: "var(--bay)" }}>
        {featured ? (
          <Fade>
            <Link className="post-featured" to={`/blog/${featured.slug}`}>
              <Cover post={featured} />
              <div>
                <p className="post__meta">
                  {CATEGORY_LABEL[featured.category]} · {formatDate(featured.date)}
                </p>
                <h2>{featured.title}</h2>
                <p className="post__excerpt">{featured.excerpt}</p>
              </div>
            </Link>
          </Fade>
        ) : null}

        <FadeList className="list" itemClass="list__wrap">
          {rest.map((post) => (
            <Link className="post-row" to={`/blog/${post.slug}`} key={post.slug}>
              <Cover post={post} className="post-row__cover" />
              <span className="post-row__text">
                <time dateTime={post.date}>{monthYear(post.date)}</time>
                <b>{post.title}</b>
                <span>{post.excerpt}</span>
              </span>
              <Icon.arrow size={16} />
            </Link>
          ))}
        </FadeList>
      </div>
    </Layout>
  );
}

export default BlogPage;