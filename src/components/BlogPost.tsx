import { useParams, Link } from 'react-router-dom'
import { blogPosts } from '../content/posts'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find(p => p.slug === slug)
  const index = blogPosts.findIndex(p => p.slug === slug)
  const prev = index > 0 ? blogPosts[index - 1] : null
  const next = index < blogPosts.length - 1 ? blogPosts[index + 1] : null

  if (!post) {
    return (
      <div className="blog-post">
        <Link to="/blog" className="blog-back">← Back to blog</Link>
        <h1 className="blog-post__title">Post not found</h1>
      </div>
    )
  }

  return (
    <article className="blog-post">
      <Link to="/blog" className="blog-back">← Back to blog</Link>
      <div className="blog-post__meta">
        <span className="blog-card__category">{post.category}</span>
        <time dateTime={post.date} style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--smoke)" }}>{post.date}</time>
      </div>
      <h1 className="blog-post__title">{post.title}</h1>
      <div className="blog-post__body">
        {post.body.map((part, i) => {
          if (typeof part === 'string') {
            return <p key={i}>{part}</p>
          }
          if (part.type === 'video') {
            return (
              <video
                key={i}
                className="blog-post__video"
                src={part.src}
                controls
                muted
                loop
                playsInline
              />
            )
          }
          return null
        })}
      </div>

      <nav className="blog-nav">
        {prev ? (
          <Link to={`/blog/${prev.slug}`} className="blog-nav__link">
            <div className="blog-nav__text">
              <span className="blog-nav__label">Previous</span>
              <span className="blog-nav__title">{prev.title}</span>
            </div>
          </Link>
        ) : <div />}
        {next ? (
          <Link to={`/blog/${next.slug}`} className="blog-nav__link blog-nav__link--next">
            <div className="blog-nav__text">
              <span className="blog-nav__label">Next</span>
              <span className="blog-nav__title">{next.title}</span>
            </div>
          </Link>
        ) : <div />}
      </nav>
    </article>
  )
}
