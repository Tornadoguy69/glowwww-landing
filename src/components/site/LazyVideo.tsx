import { useEffect, useRef, useState } from "react";
import { useNearView, usePrefersReducedMotion } from "../../lib/hooks";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  /** Click to go fullscreen — the whole surface is the button. */
  fullscreen?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  /** `cover` fills the box and crops; `contain` shows the whole frame. */
  fit?: "cover" | "contain";
};

/**
 * Video that only plays while on screen, and pauses when the tab is hidden.
 * Optionally turns the whole surface into a tap-for-fullscreen target.
 */
export function LazyVideo({
  src,
  poster,
  className = "",
  fullscreen = true,
  loop = true,
  muted = true,
  playsInline = true,
  fit = "contain",
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const { ref: wrapRef, near } = useNearView<HTMLDivElement>("150px");
  const reduced = usePrefersReducedMotion();
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    const vid = ref.current;
    if (!vid) return;
    if (reduced) {
      vid.pause();
      return;
    }
    if (near && !document.hidden) {
      void vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [near, reduced]);

  useEffect(() => {
    const onChange = () => setIsFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const goFull = async () => {
    const vid = ref.current;
    if (!vid) return;
    const el = vid as HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
      webkitDisplayingFullscreen?: boolean;
    };
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitEnterFullscreen) el.webkitEnterFullscreen();
    } catch {
      /* browser refused — leave it inline */
    }
  };

  return (
    <div ref={wrapRef} className={className} style={{ position: "relative", width: "100%", height: "100%" }}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        preload="metadata"
        onClick={fullscreen ? goFull : undefined}
        className={fullscreen ? "tap-fs" : undefined}
        style={{ width: "100%", height: "100%", objectFit: fit }}
        aria-label={fullscreen && !isFull ? "Tap for fullscreen" : undefined}
      />
    </div>
  );
}

export default LazyVideo;