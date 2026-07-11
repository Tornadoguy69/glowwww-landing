import { Link } from 'react-router-dom'
import { blogPosts } from '../content/posts'

export default function UpdatesSection() {
  const posts = blogPosts.slice(0, 3)

  return (
    <section id="updates" className="section">
      <div className="updates-section__head">
        <h2 className="section__title">
          LATEST<br /><span style={{ color: "var(--red)" }}>UPDATES</span>
        </h2>
      </div>
      <p className="section__lead">
        Glowwww keeps getting better. Here's what changed and why.
      </p>
      <div className="updates-grid">
        {posts.map(post => (
          <article key={post.slug} className="update-card">
            <time dateTime={post.date}>{post.date}</time>
            <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
            <p>{post.excerpt}</p>
            <Link to={`/blog/${post.slug}`} className="update-card__link">Read more →</Link>
          </article>
        ))}
      </div>
    </section>
  )
}
