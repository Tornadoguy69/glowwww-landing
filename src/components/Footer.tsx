import { Link } from "react-router-dom";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__brand">
        <Wordmark className="footer__wordmark" />
        <p className="footer__tagline">Where creators glowwww without the cage.</p>
      </div>
      <nav className="footer__nav" aria-label="Footer">
        <Link to="/#demos">Demos</Link>
        <Link to="/#features">Features</Link>
        <Link to="/#preview">App</Link>
        <Link to="/#install">Install</Link>
        <Link to="/blog">Blog</Link>
        <a href="https://glowwww.vercel.app" target="_blank" rel="noopener noreferrer">
          Launch
        </a>
      </nav>
      <p className="footer__note">
        Product site · Updates & news
        <br />
        <a href="https://glowwww.vercel.app" target="_blank" rel="noopener noreferrer">
          glowwww.vercel.app
        </a>
      </p>
    </footer>
  );
}
