import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../ThemeProvider";
import { useScrollState } from "../../lib/hooks";
import { Icon, Wordmark } from "./Kit";
import { InstallPrompt } from "./InstallPrompt";
import { useRouteMeta } from "./RouteMeta";

export const NAV_LINKS = [
  { label: "Why it exists", href: "/#why", hash: "why" },
  { label: "The app", href: "/#app", hash: "app" },
  { label: "My goal", href: "/goal", hash: "goal" },
  { label: "Writing", href: "/blog", hash: "blog" },
] as const;

export const APP_URL = "https://glowwww.vercel.app";
export const GITHUB_URL = "https://github.com/Tornadoguy69";

function ThemeButton() {
  const { toggle } = useTheme();
  return (
    <button
      className="theme-btn"
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark"
      title="Light / dark"
    >
      <Icon.sun />
      <Icon.moon />
    </button>
  );
}

function Header() {
  const { stuck, tucked } = useScrollState(40);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const { pathname, hash } = useLocation();

  useEffect(() => setOpen(false), [pathname, hash]);

  /* Reading position — the homepage is long enough to need a bearing. */
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const onHome = pathname === "/";

  return (
    <>
      <header
        className={`head${stuck ? " is-stuck" : ""}${tucked ? " is-tucked" : ""}`}
      >
        <div className="wrap head__in">
          <Link className="head__mark" to="/" aria-label="Glowwww, home">
            <Wordmark />
          </Link>

          <nav className="head__nav" aria-label="Sections">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={
                  link.href === "/blog"
                    ? pathname.startsWith("/blog")
                      ? "page"
                      : undefined
                    : onHome && hash === `#${link.hash}`
                      ? "page"
                      : undefined
                }
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="head__actions">
            <ThemeButton />
            <a className="btn btn--primary btn--sm" href={APP_URL} target="_blank" rel="noopener noreferrer">
              Open Glowwww
            </a>
            <button
              className="head__burger"
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
        <div
          className="head__prog"
          style={{ transform: `scaleX(${progress})` }}
          aria-hidden
        />
      </header>

      {open ? (
        <div className="drawer" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="drawer__scrim" onClick={() => setOpen(false)} />
          <div className="drawer__panel">
            <div className="drawer__head">
              <Wordmark />
              <button
                className="drawer__close"
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <Icon.close size={18} />
              </button>
            </div>
            <nav className="drawer__links">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={
                    link.href === "/blog" && pathname.startsWith("/blog")
                      ? "is-active"
                      : link.href === "/goal" && pathname === "/goal"
                        ? "is-active"
                        : ""
                  }
                >
                  {link.label}
                </Link>
              ))}
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                GitHub <span>↗</span>
              </a>
            </nav>
            <div className="drawer__foot">
              <a className="btn btn--primary" href={APP_URL} target="_blank" rel="noopener noreferrer">
                Open Glowwww <span className="arr">→</span>
              </a>
              <p>Free. No waitlist. No app store.</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot__in">
        <p className="foot__pitch">
          Glowwww is the one app I stopped scattering myself across. Built alone, still
          going, about seventy-nine people in.
        </p>

        <nav className="foot__links" aria-label="Footer">
          <a href="/#why">Why</a>
          <a href="/#app">The app</a>
          <a href="/#ai">The AI</a>
          <Link to="/goal">My goal</Link>
          <a href="/#install">Install</a>
          <Link to="/privacy">Privacy</Link>
          <Link to="/blog">Writing</Link>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://afterglow-ecru.vercel.app/site/" target="_blank" rel="noopener noreferrer">
            Afterglow
          </a>
        </nav>

        {/* The real mark, not a text substitute. Same two-file theme swap as the
            header — see Kit.Wordmark. */}
        <div className="foot__base">
          <Wordmark />
          <span className="foot__copy">&copy; 2026 · Built by Tornado</span>
        </div>
      </div>
    </footer>
  );
}
export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  useRouteMeta();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="site">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <InstallPrompt />
    </div>
  );
}