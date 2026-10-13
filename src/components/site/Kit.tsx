import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Fade } from "../site/Motion";
import { GlowwwwLogo } from "../Logo";

/**
 * Section heading. One type size, one lede, no chrome.
 */
export function SectionHead({
  eyebrow,
  title,
  lede,
  center = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  center?: boolean;
}) {
  return (
    <header className={`sec-head${center ? " sec-head--center" : ""}`}>
      {eyebrow ? <Fade as="p">{<span className="eyebrow">{eyebrow}</span>}</Fade> : null}
      <Fade as="h2">{title}</Fade>
      {lede ? <Fade as="p">{lede}</Fade> : null}
    </header>
  );
}

/* ---------- Reveal ---------- */

export function Reveal({
  children,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  as?: "div" | "li" | "section" | "article" | "header";
  className?: string;
}) {
  return <Fade as={Tag} className={className}>{children}</Fade>;
}

/* ---------- Media frame ---------- */

export function Frame({
  url,
  contain = false,
  className = "",
  ratio,
  children,
}: {
  url?: string;
  contain?: boolean;
  className?: string;
  /** Intrinsic aspect ratio of the media, so the frame crops nothing. */
  ratio?: number;
  children: ReactNode;
}) {
  return (
    <div className={`frame${contain ? " frame--contain" : ""} ${className}`.trim()}>
      <div className="frame__bar">
        {url ? <span className="frame__url">{url}</span> : null}
      </div>
      <div className="frame__body" style={ratio ? ({ aspectRatio: String(ratio) } as CSSProperties) : undefined}>
        {children}
      </div>
    </div>
  );
}
export function PhoneFrame({
  children,
  ratio = "9 / 19.5",
}: {
  children: ReactNode;
  ratio?: string;
}) {
  return (
    <div className="phone">
      <div className="phone__screen" style={{ aspectRatio: ratio }}>
        {children}
      </div>
    </div>
  );
}

/* ---------- Brand mark ---------- */

/**
 * The real Glowwww artwork, not a text substitute. Vector, painted from
 * `currentColor`, so it follows the theme with no second file to swap.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`.trim()}>
      <GlowwwwLogo className="wordmark__svg" />
    </span>
  );
}

/* ---------- Icons ---------- */

function svg(path: ReactNode, size = 18) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {path}
    </svg>
  );
}

export const Icon = {
  feed: ({ size }: { size?: number }) =>
    svg(<path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />, size),
  edit: ({ size }: { size?: number }) =>
    svg(
      <>
        <path d="M4 20h4l10-10a2.5 2.5 0 0 0-4-4L4 16z" />
        <path d="M13.5 6.5 17 10" />
      </>,
      size
    ),
  chat: ({ size }: { size?: number }) =>
    svg(<path d="M20 12a7 7 0 0 1-7 7H8l-4 2 1-4.5A7 7 0 0 1 15 6a7 7 0 0 1 5 6z" />, size),
  mic: ({ size }: { size?: number }) =>
    svg(
      <>
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
      </>,
      size
    ),
  hand: ({ size }: { size?: number }) =>
    svg(
      <>
        <path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11" />
        <path d="M11 11V4.5a1.5 1.5 0 0 1 3 0V11" />
        <path d="M14 11.5V7a1.5 1.5 0 0 1 3 0v7a6 6 0 0 1-6 6h-1a5 5 0 0 1-4-2l-2.5-4a1.5 1.5 0 0 1 2.4-1.8L8 14" />
      </>,
      size
    ),
  eye: ({ size }: { size?: number }) =>
    svg(
      <>
        <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>,
      size
    ),
  cursor: ({ size }: { size?: number }) => svg(<path d="M5 3l6.5 16 2.2-6.6L20 10z" />, size),
  check: ({ size }: { size?: number }) => svg(<path d="m4.5 12.5 5 5 10-11" />, size),
  lock: ({ size }: { size?: number }) =>
    svg(
      <>
        <rect x="4.5" y="10" width="15" height="10" rx="2.5" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>,
      size
    ),
  spark: ({ size }: { size?: number }) =>
    svg(<path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" />, size),
  people: ({ size }: { size?: number }) =>
    svg(
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
        <path d="M16 5.2a3.5 3.5 0 0 1 0 6.6M17.5 14.4A6.5 6.5 0 0 1 21.5 20" />
      </>,
      size
    ),
  clock: ({ size }: { size?: number }) =>
    svg(
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5.2l3.2 2" />
      </>,
      size
    ),
  video: ({ size }: { size?: number }) =>
    svg(
      <>
        <rect x="2.5" y="6" width="13" height="12" rx="2.5" />
        <path d="m15.5 10.5 6-3v9l-6-3z" />
      </>,
      size
    ),
  card: ({ size }: { size?: number }) =>
    svg(
      <>
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
        <path d="M2.5 10h19" />
      </>,
      size
    ),
  grid: ({ size }: { size?: number }) =>
    svg(
      <>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
      </>,
      size
    ),
  sun: ({ size }: { size?: number }) =>
    svg(
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
      </>,
      size
    ),
  moon: ({ size }: { size?: number }) =>
    svg(<path d="M21 13.2A9 9 0 0 1 10.8 3a9 9 0 1 0 10.2 10.2z" />, size),
  close: ({ size }: { size?: number }) => svg(<path d="M6 6l12 12M18 6 6 18" />, size),
  /* The iOS share glyph — a box with an arrow leaving the top. Used to name the
     exact control the reader needs to tap, rather than describing it. */
  share: ({ size }: { size?: number }) =>
    svg(
      <>
        <path d="M12 3v11" />
        <path d="m8 6.5 4-3.5 4 3.5" />
        <path d="M6 11H4.5v9.5h15V11H18" />
      </>,
      size
    ),
  arrow: ({ size }: { size?: number }) =>
    svg(<path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5" />, size),
  external: ({ size }: { size?: number }) =>
    svg(
      <>
        <path d="M14 4h6v6" />
        <path d="M20 4 11 13" />
        <path d="M18 14v5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
      </>,
      size
    ),
  pen: ({ size }: { size?: number }) =>
    svg(<path d="M4 20h4l10-10a2.5 2.5 0 0 0-4-4L4 16z" />, size),
};

export function ArrowLink({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  const external = href.startsWith("http");
  return (
    <a
      className="link-arrow"
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children} <Icon.arrow size={15} />
    </a>
  );
}

/* ---------- Hook used by the fold ---------- */

export function useFold(names: number, enabled: boolean) {
  const [state, setState] = useState<"idle" | "live" | "merged">("idle");

  useEffect(() => {
    if (!enabled) return;
    const timers: number[] = [];
    setState("live");
    for (let i = 0; i < names; i += 1) {
      timers.push(window.setTimeout(() => undefined, 280 + i * 220));
    }
    timers.push(window.setTimeout(() => setState("merged"), 280 + names * 220 + 220));
    return () => timers.forEach(clearTimeout);
  }, [enabled, names]);

  return state;
}