import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { SITE } from "../../content/site";
import { Fade, RiseLines } from "../site/Motion";
import { Rail } from "../site/Rail";
import { LazyVideo } from "../site/LazyVideo";
import { LogoMark } from "../LogoMark";

const QuantumLogo = lazy(() =>
  import("../QuantumLogo").then((mod) => ({ default: mod.QuantumLogo })),
);

function ShiningMark() {
  const [reduce] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  if (reduce) return <LogoMark className="hero__mark-still" size="70%" />;
  return (
    <Suspense fallback={<LogoMark className="hero__mark-still" size="70%" />}>
      <QuantumLogo />
    </Suspense>
  );
}

/**
 * Hero.
 *
 * The claim, the shining mark, then the product strip. The strip is the proof
 * that the app is open — not a campaign still. The mark is the same particle
 * O the first hero carried: it gathers out of a field and then breathes.
 *
 * Paper Sun: a faint warm wash trails the pointer across the hero (lagged, so
 * it feels like light, not a cursor ring), and the claim leans a few pixels
 * away from it, the way paper shadows fall opposite the sun. The mark leans
 * the other way. Fine pointers only, never under reduced motion.
 *
 * On the way out of the hero the mark shrinks into the red O in the header
 * and hands off to the flat wordmark. Scrolling back grows it out again.
 * The flight finishes before the header tucks itself away.
 */
const DOCK_START = 20;
const DOCK_END = 188;
/** Outer ring diameter / canvas height. World span 24, frustum height 40. */
const RING = 0.6;

function clamp01(t: number) {
  return Math.min(1, Math.max(0, t));
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
export function Hero() {
  const { hero } = SITE;
  const rootRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const flightRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0.3, y: 0.22 });
  const dock = useRef<(() => void) | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    let tx = 0.3;
    let ty = 0.22;
    let x = tx;
    let y = ty;

    const tick = () => {
      raf = 0;
      x += (tx - x) * 0.1;
      y += (ty - y) * 0.1;
      pointer.current.x = x;
      pointer.current.y = y;
      root.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
      root.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
      root.style.setProperty("--px", x.toFixed(3));
      root.style.setProperty("--py", y.toFixed(3));
      dock.current?.();
      if (Math.abs(tx - x) > 0.0004 || Math.abs(ty - y) > 0.0004) {
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: PointerEvent) => {
      const box = root.getBoundingClientRect();
      if (box.height <= 0) return;
      tx = Math.max(0, Math.min(1, (e.clientX - box.left) / box.width));
      ty = Math.max(0, Math.min(1, (e.clientY - box.top) / box.height));
      if (!raf) raf = requestAnimationFrame(tick);
    };

    root.addEventListener("pointermove", onMove);
    return () => {
      root.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useLayoutEffect(() => {
    const mark = markRef.current;
    const flight = flightRef.current;
    if (!mark || !flight) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const head = document.querySelector(".head");

    let frame = 0;
    let follow = 0;

    const apply = () => {
      const raw = clamp01((window.scrollY - DOCK_START) / (DOCK_END - DOCK_START));
      const travel = easeInOut(raw);
      /* Shrink ahead of the slide, so the mark is small before it crosses
         the header instead of covering the name on the way in. */
      const shrink = easeInOut(clamp01(raw / 0.7));
      const slot = mark.getBoundingClientRect();
      const orb = document.querySelector<SVGGraphicsElement>(".head .glow-logo__orb");
      const tucked = head?.classList.contains("is-tucked") ?? false;
      let dx = 0;
      let dy = 0;
      let scale = 1;
      let rot = 0;

      const parked = tucked && raw > 0.85;
      if (!parked && orb && slot.width > 0 && slot.height > 0) {
        const target = orb.getBoundingClientRect();
        const slotCx = slot.left + slot.width / 2;
        const slotCy = slot.top + slot.height / 2;
        const orbCx = target.left + target.width / 2;
        const orbCy = target.top + target.height / 2;
        const visual = slot.height * RING;
        const dest = visual > 0 ? target.width / visual : 1;
        const lean = fine ? 1 - raw : 0;
        const p = pointer.current;
        dx = (orbCx - slotCx) * travel + (p.x - 0.3) * 16 * lean;
        dy = (orbCy - slotCy) * travel + (p.y - 0.22) * 10 * lean;
        rot = (p.x - 0.3) * -3.5 * lean;
        scale = 1 + (dest - 1) * shrink;
        flight.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      }
      const fade = raw < 0.82 ? 1 : raw >= 1 ? 0 : 1 - (raw - 0.82) / 0.18;
      flight.style.opacity = fade.toFixed(3);
      if (raw >= 0.995) flight.dataset.docked = "1";
      else delete flight.dataset.docked;
    };

    dock.current = apply;

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        apply();
      });
    };

    const followFor = (ms: number) => {
      const stop = performance.now() + ms;
      const step = () => {
        apply();
        if (performance.now() < stop) follow = requestAnimationFrame(step);
      };
      cancelAnimationFrame(follow);
      follow = requestAnimationFrame(step);
    };

    const onBarMove = () => followFor(480);

    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    head?.addEventListener("transitionrun", onBarMove);

    return () => {
      dock.current = null;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(follow);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      head?.removeEventListener("transitionrun", onBarMove);
      flight.style.transform = "";
      flight.style.opacity = "";
      delete flight.dataset.docked;
    };
  }, []);

  return (
    <header className="hero" id="top" ref={rootRef}>
      <div className="hero__sun" aria-hidden />
      <div className="wrap hero__stage">
        <div className="hero__copy">
          <Fade>
            <p className="eyebrow">{hero.eyebrow}</p>
          </Fade>

          <RiseLines
            as="h1"
            className="hero__title"
            label={`${hero.title[0]} ${hero.titleAccent}`}
            lines={[hero.title[0], <em key="accent">{hero.titleAccent}</em>]}
          />

          <Fade as="p" className="hero__lede">
            {hero.lede}
          </Fade>

          <Fade>
            <div className="hero__row">
              <a className="btn btn--primary" href={hero.primary.href} target="_blank" rel="noopener noreferrer">
                {hero.primary.label} <span className="arr">→</span>
              </a>
              <a className="link-arrow" href={hero.secondary.href}>
                {hero.secondary.label}
              </a>
            </div>
          </Fade>
        </div>

        <div className="hero__mark" ref={markRef} aria-hidden>
          <div className="hero__mark-flight" ref={flightRef}>
            <ShiningMark />
          </div>
        </div>
      </div>

      <div className="wrap">
        <Fade>
          <Rail label="The Glowwww web app: feed, editor, voice and agent">
            {hero.strip.map((cell) => (
              <figure className="strip__cell" key={cell.label}>
                {cell.kind === "video" ? (
                  <LazyVideo src={cell.src} poster={cell.poster} fit="contain" />
                ) : (
                  <img src={cell.src} alt={cell.alt} loading="lazy" decoding="async" />
                )}
                <figcaption className="strip__label">{cell.label}</figcaption>
              </figure>
            ))}
          </Rail>
        </Fade>
      </div>
    </header>
  );
}

export default Hero;