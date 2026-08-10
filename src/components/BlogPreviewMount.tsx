import { Link } from "react-router-dom";
import { BrandCover } from "./BrandCover";
import { blogPosts } from "../content/posts";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

const catLabel: Record<string, string> = {
  update: "Update",
  product: "Product",
  company: "Company",
};

/** Latest posts for the launch homepage blog strip */
export function BlogPreviewMount() {
  const posts = blogPosts.slice(0, 2);

  if (!posts.length) {
    return (
      <div className="center">
        <Link to="/blog" className="btn btn--ghost">
          Read the blog →
        </Link>
      </div>
    );
  }

  return (
    <div className="blog-preview">
      <div className="blog-preview-grid">
        {posts.map((post) => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="frame blog-preview-card">
            <BrandCover
              category={post.category}
              title={post.title}
              size="compact"
              className="blog-preview-card__cover"
            />
            <div className="blog-preview-card__body">
              <div className="blog-preview-card__meta">
                {catLabel[post.category] ?? post.category} · {formatDate(post.date)}
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <span className="blog-preview-card__go">Read post →</span>
            </div>
          </Link>
        ))}
      </div>
      <div className="center mt">
        <Link to="/blog" className="btn btn--ghost">
          Read the blog →
        </Link>
      </div>
    </div>
  );
}

export default BlogPreviewMount;
