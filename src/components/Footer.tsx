import { Link } from "react-router-dom";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__brand">
        <Wordmark className="footer__wordmark" />
        <p className="footer__tagline">Built by Tornado. Still building.</p>
      </div>
      <nav className="footer__nav" aria-label="Footer">
        <Link to="/#demos">Demos</Link>
        <Link to="/#features">Features</Link>
        <Link to="/#preview">App</Link>
        <Link to="/#install">Install</Link>
        <Link to="/blog">Blog</Link>
        <a href="https://glowwww.vercel.app" target="_blank" rel="noopener noreferrer">
          Open Glowwww
        </a>
      </nav>
      <p className="footer__note">
        The site · the blog
        <br />
        <a href="https://glowwww.vercel.app" target="_blank" rel="noopener noreferrer">
          glowwww.vercel.app
        </a>
      </p>
    </footer>
  );
}
