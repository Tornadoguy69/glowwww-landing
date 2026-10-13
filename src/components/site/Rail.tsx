import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "../../lib/hooks";

/**
 * Horizontal media rail.
 *
 * A real scroll container at every width, because on narrow screens it genuinely
 * overflows and pretending otherwise just crops content.
 *
 * It never sits still. The row sweeps back and forth on its own and turns
 * around the instant it reaches an end — no resting, no hovering pause. It
 * only yields while you are actively doing something with it: a drag in
 * progress, a finger on the glass, keyboard focus inside it. A cursor merely
 * resting on top does not stop it. It never moves under an active gesture,
 * and it never moves at all under `prefers-reduced-motion`.
 *
 * Content fades at both edges so the row looks continuous rather than cut off.
 * Native scrolling, pointer drag and keyboard arrows all work as you'd expect.
 */

/** px per second */
const SPEED = 56;
/** How long the turnaround ease lasts. The rail never rests; it rounds the corner. */
const TURN_MS = 320;
/** How long after you stop touching it before it starts again. */
const RESUME_MS = 900;

export function Rail({
  children,
  label,
  className = "",
  speed = SPEED,
}: {
  children: ReactNode;
  label: string;
  className?: string;
  /** px per second */
  speed?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const resumeTimer = useRef(0);
  const glideRaf = useRef(0);
  const [interacting, setInteracting] = useState(false);
  const [near, setNear] = useState(false);
  const [drifting, setDrifting] = useState(false);

  const reduced = usePrefersReducedMotion();

  /**
   * Hold and release are deliberately separate.
   *
   * `hold` is "something is engaged right now" — a drag in progress, a finger
   * on the glass, keyboard focus inside it. It holds indefinitely and cancels
   * any pending resume, so the row cannot fight an active gesture. A hovering
   * cursor deliberately does NOT hold: the rail is meant to keep moving under
   * a resting pointer and only yield to real interaction.
   *
   * `release` is "that engagement just ended" — it waits a beat and then lets
   * the row go again.
   */
  const hold = () => {
    window.clearTimeout(resumeTimer.current);
    cancelAnimationFrame(glideRaf.current);
    glideRaf.current = 0;
    setInteracting(true);
  };

  const release = () => {
    window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setInteracting(false), RESUME_MS);
  };

  const resume = () => {
    window.clearTimeout(resumeTimer.current);
    setInteracting(false);
  };

  useEffect(
    () => () => {
      window.clearTimeout(resumeTimer.current);
      cancelAnimationFrame(glideRaf.current);
    },
    []
  );

  /* Don't animate what's off screen, and stop entirely when the tab is hidden. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const io = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: "120px" }
    );
    io.observe(track);

    const onVisibility = () => setNear(!document.hidden && track.getBoundingClientRect().top < window.innerHeight && track.getBoundingClientRect().bottom > 0);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const shouldDrift = near && !interacting && !reduced;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (!shouldDrift) {
      setDrifting(false);
      return;
    }

    let raf = 0;
    let last = performance.now();
    let dir: 1 | -1 = 1;
    /** Last turn timestamp — speed ramps back up over TURN_MS so the turnaround reads as a curve, not a bounce. */
    let turnedAt = -1000;
    /**
     * Scroll offsets are whole pixels. A browser silently truncates a
     * sub-pixel `scrollLeft` write, so at a calm drift speed the per-frame
     * step is well under a pixel and every frame is rounded away — the row
     * sits perfectly still while the loop happily runs. The remainder is
     * carried here and spent as soon as it adds up to a whole pixel.
     */
    let carry = 0;

    const fits = () => track.scrollWidth - track.clientWidth <= 2;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (fits()) {
        carry = 0;
        return;
      }

      /* Drift owns the scroll offset while it runs — a dying drag-glide
         writing to the same property is what caused the post-flick stutter. */
      cancelAnimationFrame(glideRaf.current);
      glideRaf.current = 0;

      const max = track.scrollWidth - track.clientWidth;

      /* Ease out of each turnaround over TURN_MS instead of slapping the
         edge at full speed. The rail never rests; it just rounds the corner. */
      const sinceTurn = now - turnedAt;
      const ramp = sinceTurn >= TURN_MS ? 1 : sinceTurn / TURN_MS;
      const eased = ramp * ramp * (3 - 2 * ramp);

      carry += dir * speed * eased * dt;
      const step = dir > 0 ? Math.floor(carry) : Math.ceil(carry);
      if (step === 0) return;
      carry -= step;
      track.scrollLeft += step;

      if (track.scrollLeft >= max - 0.5) {
        track.scrollLeft = max;
        dir = -1;
        carry = 0;
        turnedAt = now;
      } else if (track.scrollLeft <= 0.5) {
        track.scrollLeft = 0;
        dir = 1;
        carry = 0;
        turnedAt = now;
      }
    };

    raf = requestAnimationFrame(tick);
    setDrifting(true);
    return () => {
      cancelAnimationFrame(raf);
      setDrifting(false);
    };
  }, [shouldDrift, speed]);

  const nudge = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    hold();
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
    release();
  };

  /* Pointer drag, with a little momentum on release. Mouse only — a finger
     already scrolls the row natively and fighting it would be worse. */
  const drag = useRef({ active: false, startX: 0, startLeft: 0, lastX: 0, velocity: 0, id: -1 });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const track = trackRef.current;
    if (!track) return;
    hold();
    drag.current = {
      active: true,
      startX: e.clientX,
      startLeft: track.scrollLeft,
      lastX: e.clientX,
      velocity: 0,
      id: e.pointerId,
    };
    track.setPointerCapture(e.pointerId);
    track.classList.add("is-drag");
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const d = drag.current;
    if (!track || !d.active) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) < 3) return;
    d.velocity = e.clientX - d.lastX;
    d.lastX = e.clientX;
    track.scrollLeft = d.startLeft - dx;
    hold();
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const d = drag.current;
    if (!track || !d.active) return;
    d.active = false;
    track.classList.remove("is-drag");
    track.releasePointerCapture?.(d.id);

    let v = d.velocity;
    const glide = () => {
      glideRaf.current = 0;
      v *= 0.93;
      track.scrollLeft -= v;
      if (Math.abs(v) > 0.4) glideRaf.current = requestAnimationFrame(glide);
      else release();
    };
    cancelAnimationFrame(glideRaf.current);
    glideRaf.current = requestAnimationFrame(glide);
    void e;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    nudge(e.key === "ArrowRight" ? 1 : -1);
  };

  return (
    <div className={`rail ${className}`.trim()}>
      <div
        className="rail__track"
        ref={trackRef}
        role="group"
        aria-label={label}
        tabIndex={0}
        data-drifting={drifting ? "1" : "0"}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onTouchStart={hold}
        onTouchEnd={release}
        onTouchCancel={release}
        onFocusCapture={hold}
        onBlurCapture={resume}
      >
        {children}
      </div>
    </div>
  );
}

export default Rail;