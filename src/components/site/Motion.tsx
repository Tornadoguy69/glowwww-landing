import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useInView } from "../../lib/hooks";

/**
 * Motion.
 *
 * Four gestures, used consistently:
 *
 *  `Words`  — type arrives a word at a time out of a mask. The workhorse.
 *  `Wipe`   — an image reveals through a clip. Used for full-bleed frames.
 *  `Fade`   — one quiet rise. For everything that isn't making a point.
 *  `RiseLines` — full-width lines, hero only.
 *
 * Everything is transform, opacity or clip-path. Nothing reflows, nothing waits
 * for a network, and all of it collapses to the final state under
 * `prefers-reduced-motion`.
 */

/* ---------- Word-by-word masked reveal ---------- */

/**
 * Splits on spaces and lifts each word out of its own overflow mask.
 *
 * Authored rather than measured: the text wraps naturally at any width and each
 * word carries its own mask, so there is no line-height guessing and no reflow
 * when the font loads. Words that need different treatment (an italic accent)
 * can be passed as a `string[]` with markup per word.
 */
export function Words({
  text,
  className = "",
  delay = 0,
  step = 34,
  duration = 760,
  as: Tag = "h2",
}: {
  text: string | string[];
  className?: string;
  delay?: number;
  /** ms between words. Lower is tighter. */
  step?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "p" | "div";
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const words = Array.isArray(text) ? text : text.split(" ");

  return (
    <Tag
      ref={ref as never}
      className={`words ${className}`.trim()}
      data-in={inView ? "1" : "0"}
      aria-label={words.map((w) => w.replace(/<[^>]*>/g, "")).join(" ")}
    >
      {words.map((word, i) => (
        /* The space must sit BETWEEN the inline-blocks, not inside one.
           Trailing whitespace at an inline-block's edge is trimmed by the
           browser, which is what turned "Give it a home screen." into
           "Giveitahomescreen." */
        <Fragment key={i}>
          <span className="words__w" aria-hidden>
            <span
              className="words__i"
              style={
                {
                  "--wd": `${delay + i * step}ms`,
                  "--wdur": `${duration}ms`,
                } as CSSProperties
              }
              dangerouslySetInnerHTML={{ __html: word }}
            />
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/* ---------- Clip-path image wipe ---------- */

/**
 * The image reveals left-to-right as it enters. A cut rather than a fade, which
 * is what gives a still the feel of having been placed rather than loaded.
 */
export function Wipe({
  children,
  className = "",
  delay = 0,
  duration = 1100,
  from = "left",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  from?: "left" | "right" | "bottom";
  as?: "div" | "figure";
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.12);

  const start =
    from === "right" ? "inset(0 0 0 100%)" : from === "bottom" ? "inset(100% 0 0 0)" : "inset(0 100% 0 0)";

  return (
    <Tag
      ref={ref as never}
      className={`wipe ${className}`.trim()}
      data-in={inView ? "1" : "0"}
      data-from={from}
      style={{ "--wipe-from": start, "--wipe-delay": `${delay}ms`, "--wipe-dur": `${duration}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/* ---------- Hero lines ---------- */

/**
 * Full-width lines rising out of a mask on load. Reserved for the hero, which is
 * the only moment on the page that earns an entrance before you've scrolled.
 */
export function RiseLines({
  lines,
  className = "",
  delay = 0,
  step = 90,
  duration = 900,
  as: Tag = "h1",
  label,
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  step?: number;
  duration?: number;
  as?: "h1" | "h2" | "p" | "div";
  /** Spoken form of the headline. Needed when a line is an element, or join() announces "[object Object]". */
  label?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const accessible =
    label ??
    (lines.every((line) => typeof line === "string") ? (lines as string[]).join(" ") : undefined);

  return (
    <Tag
      ref={ref as never}
      className={`rise ${className}`.trim()}
      data-in={shown ? "1" : "0"}
      aria-label={accessible}
    >
      {lines.map((line, i) => (
        <span className="rise__line" key={i} aria-hidden={accessible ? true : undefined}>
          <span
            className="rise__inner"
            style={{ "--rise-delay": `${delay + i * step}ms`, "--rise-dur": `${duration}ms` } as CSSProperties}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/* ---------- Quiet rise ---------- */

/** One fade-up. For content that isn't making an argument. */
export function Fade({
  children,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  as?: "div" | "li" | "section" | "article" | "header" | "p" | "h1" | "h2" | "h3";
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.1);
  return (
    <Tag ref={ref as never} className={`fade ${className}`.trim()} data-in={inView ? "1" : "0"}>
      {children}
    </Tag>
  );
}

/** A group that arrives as one block rather than item by item. */
export function FadeList({
  children,
  className = "",
  itemClass = "",
}: {
  children: ReactNode[];
  className?: string;
  itemClass?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.08);
  return (
    <div ref={ref} className={`fade ${className}`.trim()} data-in={inView ? "1" : "0"}>
      {children.map((child, i) => (
        <div className={itemClass} key={i}>
          {child}
        </div>
      ))}
    </div>
  );
}

/* ---------- Deferred work ---------- */

/** Tracks whether the element has ever been near the viewport. */
export function useNear(ref: React.RefObject<HTMLElement | null>, margin = "400px") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return near;
}

export function useBox<T extends HTMLElement = HTMLDivElement>() {
  return useRef<T>(null);
}