import { useEffect, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../ThemeProvider";
import "../../launch/launch.css";
import "../../styles/blog.css";

/**
 * Shared chrome for blog routes — same visual system as the launch page:
 * Poppins, .lp tokens, light/dark toggle, nav + footer.
 */
export function PageShell({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const light = theme === "light";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={`lp blog-shell${light ? " lp--light" : ""}`}>
      <nav className="nav blog-shell__nav" id="blogNav">
        <Link className="brand" to="/">
          <img
            className="logo logo--for-dark"
            src="/launch/assets/brand/logo-dark.png"
            alt="Glowwww"
          />
          <img
            className="logo logo--for-light"
            src="/launch/assets/brand/logo-light.png"
            alt=""
            aria-hidden="true"
          />
        </Link>
        <div className="navright">
          <div className="links">
            <a href="/#ai">AI</a>
            <a href="/#create">Create</a>
            <a href="/#social">Social</a>
            <a href="/#install">Install</a>
            <Link to="/blog" className={pathname.startsWith("/blog") ? "is-active" : undefined}>
              Blog
            </Link>
          </div>
          <button
            className="theme-toggle"
            type="button"
            onClick={toggle}
            aria-label="Toggle light or dark mode"
            title="Toggle light / dark"
          >
            <svg
              className="ic-sun"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
            <svg
              className="ic-moon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
            </svg>
          </button>
          <a
            className="cta"
            href="https://glowwww.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Glowwww
          </a>
        </div>
      </nav>

      <div className="blog-shell__main">{children}</div>

      <footer className="foot blog-shell__foot">
        <div className="foot__in">
          <Link to="/" className="foot__logo">
            <img
              className="logo logo--for-dark"
              src="/launch/assets/brand/logo-dark.png"
              alt="Glowwww"
            />
            <img
              className="logo logo--for-light"
              src="/launch/assets/brand/logo-light.png"
              alt=""
              aria-hidden="true"
            />
          </Link>
          <span>Social media, rebuilt around AI. · © 2026 Glowwww</span>
          <nav className="blog-shell__foot-links" aria-label="Footer">
            <Link to="/">Home</Link>
            <Link to="/blog">Blog</Link>
            <a href="https://glowwww.vercel.app" target="_blank" rel="noopener noreferrer">
              Open app
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
