import { useEffect, useRef, useState, useCallback } from "react";
import { SITE } from "../../content/site";
import { subscribeDeferredInstall, requestOneTapInstall } from "../../pwaInstallCapture";
import { usePrefersReducedMotion } from "../../lib/hooks";
import { Fade, FadeList, Words } from "../site/Motion";
import { Icon } from "../site/Kit";

type PanelId = "ios" | "android" | "desktop";

const PLATFORM_TIMESTAMPS: Record<PanelId, number> = {
  ios: 0,
  android: 15.0,
  desktop: 26.5,
};

const PLATFORM_DETAILS: Record<PanelId, { name: string; shortcut: string; tip: string }> = {
  ios: {
    name: "Safari on iPhone & iPad",
    shortcut: "Share → Add to Home Screen",
    tip: "Open Glowwww in Safari, tap the Share icon, then select 'Add to Home Screen'. It runs in full screen with its own app icon.",
  },
  android: {
    name: "Chrome on Android",
    shortcut: "Menu → Install app",
    tip: "Tap the three-dots menu in Chrome and choose 'Install app' or 'Add to Home Screen' — usually ready in one tap.",
  },
  desktop: {
    name: "Desktop (Chrome, Edge & Safari)",
    shortcut: "Address Bar → Install Glowwww",
    tip: "Click the install icon in the address bar to launch Glowwww in its own standalone, distraction-free desktop window.",
  },
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

/**
 * Install. Interactive video walkthrough covering iPhone, Android, and Desktop,
 * with synchronized platform chapters and one-tap install support.
 */
export function Install() {
  const { install } = SITE;
  const [tab, setTab] = useState<PanelId>("ios");
  const [busy, setBusy] = useState<"accepted" | "dismissed" | "unavailable" | null>(null);
  const [native, setNative] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(41.8);
  const [controlsVisible, setControlsVisible] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideControlsTimer = useRef<number>(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => subscribeDeferredInstall((p) => setNative(Boolean(p))), []);

  const seekToPlatform = useCallback((target: PanelId) => {
    setTab(target);
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = PLATFORM_TIMESTAMPS[target];
    void v.play().catch(() => {});
  }, []);

  /* Autoplay when entering viewport; pause when scrolled away or tab hidden */
  useEffect(() => {
    const el = sectionRef.current;
    const v = videoRef.current;
    if (!el || !v) return;

    if (reduced) {
      v.pause();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) {
          void v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);

    const onVisibility = () => {
      if (document.hidden) {
        v.pause();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  /* Synchronize active tab with video playback position */
  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    const t = v.currentTime;
    setTime(t);

    if (t < 14.8) {
      setTab("ios");
    } else if (t < 26.3) {
      setTab("android");
    } else {
      setTab("desktop");
    }
  };

  const showControlsTemporarily = () => {
    setControlsVisible(true);
    window.clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = window.setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setControlsVisible(false);
      }
    }, 2800);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
    } else {
      v.pause();
    }
    showControlsTemporarily();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    setMuted(next);
  };

  const toggleFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = deviceRef.current;
    const v = videoRef.current;
    if (!el && !v) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (el?.requestFullscreen) {
        await el.requestFullscreen();
      } else {
        const vid = v as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
        if (vid?.webkitEnterFullscreen) vid.webkitEnterFullscreen();
      }
    } catch {
      /* browser refused */
    }
  };

  const onScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v || !duration) return;
    const box = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - box.left) / box.width));
    const target = ratio * duration;
    v.currentTime = target;
    setTime(target);
  };

  async function oneTap() {
    setBusy(null);
    const result = await requestOneTapInstall();
    setBusy(result);
    if (result === "unavailable") {
      const ua = navigator.userAgent.toLowerCase();
      const iOS = /iphone|ipad|ipod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      const targetPlatform: PanelId = iOS ? "ios" : /android/.test(ua) ? "android" : "desktop";
      seekToPlatform(targetPlatform);
    }
  }

  const currentInfo = PLATFORM_DETAILS[tab];
  const progressPercent = duration > 0 ? (time / duration) * 100 : 0;

  return (
    <section className="bay" id="install">
      <div className="wrap" ref={sectionRef}>
        <Fade>
          <div className="chapter">
            <span className="chapter__n">04 — INSTALL</span>
            <Words as="h2" className="chapter__t chapter__t--sm" text={install.title} delay={140} />
            <p className="chapter__lede">{install.lede}</p>
          </div>
        </Fade>

        <Fade>
          <div className="install-showcase">
            {/* Left Column: Interactive Navigation & Info */}
            <div className="install-showcase__content">
              <div className="tabs" role="tablist" aria-label="Platform">
                {install.tabs.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    type="button"
                    aria-selected={tab === t.id}
                    className={tab === t.id ? "on" : undefined}
                    onClick={() => seekToPlatform(t.id as PanelId)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="install-showcase__card">
                <div className="install-showcase__card-title">
                  <span>{currentInfo.name}</span>
                </div>
                <div className="install-showcase__card-shortcut">{currentInfo.shortcut}</div>
                <p className="install-showcase__card-tip">{currentInfo.tip}</p>
              </div>

              <div className="install-showcase__actions">
                <button
                  className="btn btn--primary"
                  type="button"
                  onClick={oneTap}
                  disabled={busy === "accepted"}
                >
                  {busy === null && (native ? "Install in one tap" : "Install Glowwww")}
                  {busy === "accepted" && "Installed ✓"}
                  {busy === "dismissed" && "Watch the video steps"}
                  {busy === "unavailable" && "Install in one tap"}
                </button>

                <a className="link-arrow" href={SITE.hero.primary.href} target="_blank" rel="noopener noreferrer">
                  Or just open it
                </a>
              </div>
            </div>

            {/* Right Column: Video Walkthrough Showcase */}
            <div className="install-showcase__player-wrap">
              <div
                className="install-showcase__device"
                ref={deviceRef}
                onPointerEnter={showControlsTemporarily}
                onPointerMove={showControlsTemporarily}
                onPointerLeave={() => {
                  if (playing) setControlsVisible(false);
                }}
                onClick={togglePlay}
              >
                <video
                  ref={videoRef}
                  className="install-showcase__video"
                  src={install.video || "/m2_install.mp4"}
                  poster={install.poster || "/m2_install_poster.jpg"}
                  muted={muted}
                  loop
                  playsInline
                  preload="metadata"
                  onTimeUpdate={onTimeUpdate}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onPlay={() => setPlaying(true)}
                  onPause={() => {
                    setPlaying(false);
                    setControlsVisible(true);
                  }}
                />

                {/* Big Center Play Indicator when paused */}
                {!playing && (
                  <button
                    type="button"
                    className="install-showcase__center-play"
                    aria-label="Play install video"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6 4 20 12 6 20 6 4" />
                    </svg>
                  </button>
                )}

                {/* Bottom Media Controls Bar */}
                <div
                  className={`install-showcase__bar${controlsVisible || !playing ? " is-visible" : ""}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Interactive Scrub Bar */}
                  <div
                    className="install-showcase__scrub"
                    onClick={onScrub}
                    role="slider"
                    aria-label="Video scrubber"
                    aria-valuenow={Math.round(time)}
                    aria-valuemin={0}
                    aria-valuemax={Math.round(duration)}
                  >
                    <div
                      className="install-showcase__scrub-fill"
                      style={{ width: `${progressPercent}%` }}
                    />
                    {/* Chapter Markers for Android (15s) and Desktop (26.5s) */}
                    <span
                      className="install-showcase__marker"
                      style={{ left: `${(15.0 / duration) * 100}%` }}
                      title="Android"
                    />
                    <span
                      className="install-showcase__marker"
                      style={{ left: `${(26.5 / duration) * 100}%` }}
                      title="Desktop"
                    />
                  </div>

                  <div className="install-showcase__row">
                    <div className="install-showcase__controls-left">
                      <button
                        type="button"
                        className="install-showcase__btn"
                        onClick={togglePlay}
                        aria-label={playing ? "Pause" : "Play"}
                      >
                        {playing ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="6 4 20 12 6 20 6 4" />
                          </svg>
                        )}
                      </button>

                      <button
                        type="button"
                        className="install-showcase__btn"
                        onClick={toggleMute}
                        aria-label={muted ? "Unmute audio" : "Mute audio"}
                      >
                        {muted ? (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                            <line x1="23" y1="9" x2="17" y2="15" />
                            <line x1="17" y1="9" x2="23" y2="15" />
                          </svg>
                        ) : (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                          </svg>
                        )}
                      </button>

                      <span className="install-showcase__time">
                        {formatTime(time)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="install-showcase__controls-right">
                      <button
                        type="button"
                        className="install-showcase__btn"
                        onClick={toggleFullscreen}
                        aria-label="Fullscreen"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* ---------- Privacy: plain columns, no cards ---------- */

export function PrivacySection() {
  const { privacy } = SITE;

  return (
    <section className="bay" id="privacy">
      <div className="wrap">
        <Fade>
          <div className="chapter">
            <span className="chapter__n">05 — PRIVACY</span>
            <Words as="h2" className="chapter__t chapter__t--sm" text={privacy.title} delay={140} />
            <p className="chapter__lede">{privacy.lede}</p>
          </div>
        </Fade>

        <FadeList className="points privacy__points">
          {privacy.points.map((point) => {
            const Glyph = Icon[point.icon as keyof typeof Icon];
            return (
              <div className="point" key={point.title}>
                <Glyph size={18} />
                <h3>{point.title}</h3>
                <p>{point.body}</p>
              </div>
            );
          })}
        </FadeList>

        <Fade>
          <p className="section-foot">
            <a className="link-arrow" href={privacy.cta.href}>
              {privacy.cta.label} <Icon.arrow size={15} />
            </a>
          </p>
        </Fade>
      </div>
    </section>
  );
}

export default Install;