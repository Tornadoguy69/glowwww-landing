import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Wordmark } from "./Wordmark";
import { easeOutExpo } from "../motion";
import { useTheme } from "./ThemeProvider";

function NavLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link to={to} className="nav__link">
      {children}
    </Link>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className={`nav ${scrolled ? "nav--scrolled" : ""}`}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: easeOutExpo }}
    >
      <Link to="/" className="nav__brand">
        <Wordmark className="nav__wordmark" />
      </Link>
      <div className="nav__links">
        <NavLink to={onHome ? "#features" : "/#features"}>Features</NavLink>
        <NavLink to={onHome ? "#preview" : "/#preview"}>App</NavLink>
        <NavLink to={onHome ? "#install" : "/#install"}>Install</NavLink>
        <NavLink to="/blog">Blog</NavLink>
        <button
          className="nav__theme-btn"
          onClick={toggle}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
        <a
          href="https://glowwww.vercel.app"
          className="nav__cta"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open app
        </a>
      </div>
    </motion.nav>
  );
}
