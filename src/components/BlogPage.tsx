import { Link } from 'react-router-dom'
import { blogPosts } from '../content/posts'

export default function BlogPage() {
  return (
    <div className="blog-page">
      <header className="section blog-page__header">
        <p className="section__label">Blog</p>
        <h1 className="section__title">
          BUILDING<br /><span style={{ color: "var(--red)" }}>GLOWWWW</span>
        </h1>
        <p className="blog-page__lead">
          This is not just a product update page. This is the story of building something ambitious from zero.
        </p>
      </header>
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="blog-list">
          {blogPosts.map(post => (
            <article key={post.slug} className="blog-card">
              <div className="blog-card__meta">
                <span className="blog-card__category">{post.category}</span>
                <time dateTime={post.date}>{post.date}</time>
              </div>
              <h2 className="blog-card__title">
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="blog-card__excerpt">{post.excerpt}</p>
              <Link to={`/blog/${post.slug}`} className="blog-card__read">Read more →</Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
