import { useEffect, useRef, useState } from "react";

/**
 * Fires once when the element scrolls into view past `amount`.
 *
 * IntersectionObserver is the primary mechanism, but it silently never fires in
 * some environments (background tabs, in-app browsers, prerenderers). Content
 * gated behind it would sit at opacity 0 forever, so a rect check on mount and
 * on scroll acts as a fallback.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  amount = 0.25,
  options: { once?: boolean; rootMargin?: string } = {}
) {
  const { once = true, rootMargin = "0px 0px -8% 0px" } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const pending = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const bottomInset = rootMargin.startsWith("0px 0px -")
      ? (parseFloat(rootMargin.split("-")[1]) / 100) * window.innerHeight
      : 0;

    const rectSaysVisible = () => {
      const box = el.getBoundingClientRect();
      const visible = Math.min(box.bottom, window.innerHeight - bottomInset) - Math.max(box.top, 0);
      return box.height > 0 && visible / box.height >= amount;
    };

    const show = () => {
      if (!pending.current) return;
      pending.current = false;
      setInView(true);
    };

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          if (once) io.unobserve(entry.target);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: amount, rootMargin }
    );
    io.observe(el);

    // Fallback path: catch anything IO misses.
    if (rectSaysVisible()) show();

    let frame = 0;
    const onScroll = () => {
      if (!pending.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (rectSaysVisible()) {
          show();
          io.disconnect();
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Last resort so nothing is ever permanently invisible.
    const watchdog = window.setTimeout(() => {
      if (pending.current && rectSaysVisible()) show();
    }, 2500);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      clearTimeout(watchdog);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [amount, once, rootMargin]);

  return { ref, inView };
}

/** Tracks whether the element is currently anywhere near the viewport. */
export function useNearView<T extends HTMLElement = HTMLDivElement>(margin = "200px") {
  const ref = useRef<T | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return { ref, near };
}

/**
 * Scroll-centre progress for one section: 0 when the section is far away,
 * 1 when its middle crosses the viewport middle. Written to a CSS variable
 * (`--${name}`) on the element itself so scroll effects stay in
 * transform/opacity land. Disabled entirely under reduced motion.
 *
 * Used for the slow camera moves (app fan, arrival dolly) — one rAF-throttled
 * scroll listener per section, no re-renders.
 */
export function useCenterProgress<T extends HTMLElement = HTMLElement>(
  name: string,
  enabled = true,
  spread = 0.75
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const box = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (box.bottom < -vh || box.top > vh * 2) return;
      const center = box.top + box.height / 2;
      const dist = Math.abs(center - vh / 2);
      const p = Math.max(0, 1 - dist / (vh * spread));
      el.style.setProperty(`--${name}`, p.toFixed(3));
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [name, enabled, spread]);

  return ref;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);

  return matches;
}

/** Page scroll offset past a threshold, plus a direction flag. */
export function useScrollState(threshold = 40) {
  const [stuck, setStuck] = useState(false);
  const [tucked, setTucked] = useState(false);

  useEffect(() => {
    let last = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setStuck(y > threshold);
      const down = y > last + 4;
      const up = y < last - 4;
      if (down && y > 220) setTucked(true);
      else if (up || y < 160) setTucked(false);
      if (Math.abs(y - last) > 4) last = y;
    };

    const onMove = (e: MouseEvent) => {
      if (e.clientY < 80) setTucked(false);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, [threshold]);

  return { stuck, tucked };
}