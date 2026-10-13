import { Link, useParams } from "react-router-dom";
import { formatDate, getAdjacentPosts, getPost } from "../content/posts";
import { Layout } from "../components/site/Layout";
import { Icon } from "../components/site/Kit";
import { Fade } from "../components/site/Motion";
import { CATEGORY_LABEL, monthYear } from "./BlogPage";
import { NotFound } from "./NotFound";

export function BlogPostPage() {
  const { slug } = useParams();
  const post = slug ? getPost(slug) : undefined;

  if (!post) return <NotFound />;

  const { prev, next } = getAdjacentPosts(post.slug);

  return (
    <Layout>
      <article className="post">
        <div className="page-head">
          <div className="wrap">
            <Fade as="p">
              <Link className="link-arrow" to="/blog">
                <span style={{ display: "inline-flex", rotate: "180deg" }}>
                  <Icon.arrow size={15} />
                </span>
                All writing
              </Link>
            </Fade>

            <Fade>
              <p className="post__meta">
                {CATEGORY_LABEL[post.category]} · {formatDate(post.date)}
              </p>
              <h1>{post.title}</h1>
              <p className="lede">{post.excerpt}</p>
            </Fade>
          </div>
        </div>

        <div className="wrap" style={{ paddingBottom: "var(--bay)" }}>
          <div className="post__body">
            {post.body.map((item, i) =>
              typeof item === "string" ? (
                <p key={i}>{item}</p>
              ) : item.type === "image" ? (
                <figure key={i}>
                  <img src={item.src} alt={item.alt ?? ""} loading="lazy" decoding="async" />
                  {item.alt ? <figcaption>{item.alt}</figcaption> : null}
                </figure>
              ) : (
                <figure key={i}>
                  <video src={item.src} poster={item.poster} controls playsInline preload="metadata" />
                </figure>
              )
            )}
          </div>

          <div className="post__foot">
            <span>
              Written by Tornado · {monthYear(post.date)}
            </span>

            {prev || next ? (
              <span className="post__adjacent">
                {prev ? (
                  <Link to={`/blog/${prev.slug}`}>← {prev.title}</Link>
                ) : null}
                {next ? <Link to={`/blog/${next.slug}`}>{next.title} →</Link> : null}
              </span>
            ) : null}
          </div>
        </div>
      </article>
    </Layout>
  );
}

export default BlogPostPage;