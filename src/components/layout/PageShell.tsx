import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../ThemeProvider";
import { GlowwwwSideNavLogo } from "../GlowwwwSideNavLogo";
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("lp-drawer-open", drawerOpen);
    return () => document.documentElement.classList.remove("lp-drawer-open");
  }, [drawerOpen]);

  return (
    <div className={`lp blog-shell${light ? " lp--light" : ""}`}>
      <nav className="nav blog-shell__nav" id="blogNav">
        <Link className="brand" to="/" aria-label="Glowwww">
          <GlowwwwSideNavLogo className="brand-mark" />
        </Link>
        <div className="navright">
          <div className="links">
            <a href="/#proof">Proof</a>
            <a href="/#product">Product</a>
            <a href="/#privacy">Privacy</a>
            <a href="/#install">Install</a>
            <a href="/#story">Story</a>
            <a href="/#billboards">Brand</a>
            <Link to="/blog" className={pathname.startsWith("/blog") ? "is-active" : undefined}>
              Blog
            </Link>
            <a href="https://github.com/Tornadoguy69" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
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
          <button
            className={`nav-burger${drawerOpen ? " is-open" : ""}`}
            type="button"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            aria-controls="blogNavDrawer"
            onClick={() => setDrawerOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <div className="nav-drawer" id="blogNavDrawer" hidden={!drawerOpen}>
        <div
          className="nav-drawer__scrim"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        ></div>
        <div className="nav-drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="nav-drawer__head">
            <GlowwwwSideNavLogo className="drawer-mark" />
            <button
              className="nav-drawer__close"
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <nav className="nav-drawer__links" aria-label="Mobile">
            <a href="/#proof" onClick={() => setDrawerOpen(false)}>Proof</a>
            <a href="/#product" onClick={() => setDrawerOpen(false)}>Product</a>
            <a href="/#privacy" onClick={() => setDrawerOpen(false)}>Privacy</a>
            <a href="/#install" onClick={() => setDrawerOpen(false)}>Install</a>
            <a href="/#story" onClick={() => setDrawerOpen(false)}>Story</a>
            <a href="/#billboards" onClick={() => setDrawerOpen(false)}>Brand</a>
            <Link to="/blog" onClick={() => setDrawerOpen(false)}>Blog</Link>
            <a href="https://github.com/Tornadoguy69" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </nav>
          <a
            className="btn btn--primary nav-drawer__cta"
            href="https://glowwww.vercel.app"
            target="_blank"
            rel="noopener"
          >
            Open Glowwww →
          </a>
        </div>
      </div>

      <div className="blog-shell__main">{children}</div>

      <footer className="foot blog-shell__foot">
        <div className="foot__in">
          <Link to="/" className="foot__logo" aria-label="Glowwww home">
            <GlowwwwSideNavLogo className="foot__mark" />
          </Link>
          <span>Built by Tornado. Still building. · © 2026 Glowwww</span>
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
