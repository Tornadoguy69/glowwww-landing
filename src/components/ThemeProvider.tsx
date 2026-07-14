import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  // Prefer launch-page key so landing ↔ blog stay in sync
  try {
    const lp = localStorage.getItem("lp-theme");
    if (lp === "light" || lp === "dark") return lp;
    const legacy = localStorage.getItem("theme") as Theme | null;
    if (legacy === "light" || legacy === "dark") return legacy;
  } catch {
    /* ignore */
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
      localStorage.setItem("lp-theme", theme);
    } catch {
      /* ignore */
    }
    document.documentElement.classList.add("theme-transitioning");
    const timer = setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 400);
    return () => clearTimeout(timer);
  }, [theme]);

  // Stay in sync when the launch page toggles theme (same tab)
  useEffect(() => {
    const sync = () => {
      const next = readStoredTheme();
      setTheme((cur) => (cur === next ? cur : next));
    };
    window.addEventListener("lp-theme-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("lp-theme-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
