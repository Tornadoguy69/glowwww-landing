import { Link } from "react-router-dom";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__brand">
        <Wordmark className="footer__wordmark" />
      </div>
      <nav className="footer__nav" aria-label="Footer">
        <Link to="/#features">Features</Link>
        <Link to="/#preview">App</Link>
        <Link to="/#explore">Explore</Link>
        <Link to="/#install">Install</Link>
        <Link to="/blog">Blog</Link>
        <a href="https://glowwww.vercel.app" target="_blank" rel="noopener noreferrer">
          App
        </a>
      </nav>
      <p className="footer__note">
        Project site · Product updates & news
        <br />
        <a href="https://glowwww.vercel.app" target="_blank" rel="noopener noreferrer">
          glowwww.vercel.app
        </a>
      </p>
    </footer>
  );
}
