import { useEffect, useRef, useState } from "react";
import { SITE } from "../../content/site";
import { useNearView } from "../../lib/hooks";
import { Icon, Reveal } from "../site/Kit";
import { Words } from "../site/Motion";

const clock = (s: number) => {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

/**
 * The brand film.
 *
 * The file is a 70-second 4K MP4 — about 50 MB — so it is never fetched until
 * the visitor actually presses play. A poster frame stands in until then, and the
 * transport is hand-built so it matches the rest of the site rather than
 * inheriting browser chrome.
 */
export function Film() {
  const { film } = SITE;
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { ref: nearRef, near } = useNearView<HTMLDivElement>("400px");

  const [armed, setArmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [total, setTotal] = useState(0);
  const [chrome, setChrome] = useState(true);

  /* Only reach for the 50 MB file once the section is close to being read. */
  useEffect(() => {
    if (near) setArmed(true);
  }, [near]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const v = videoRef.current;
      if (v) setTime(v.currentTime);
    }, 250);
    return () => clearInterval(id);
  }, [playing]);

  /* Hide the chrome while the film is playing and the pointer is still. */
  useEffect(() => {
    if (!playing) {
      setChrome(true);
      return;
    }
    let timer = 0;
    const wake = () => {
      setChrome(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setChrome(false), 2600);
    };
    wake();
    const el = wrapRef.current;
    el?.addEventListener("pointermove", wake);
    el?.addEventListener("pointerleave", () => setChrome(false));
    return () => {
      window.clearTimeout(timer);
      el?.removeEventListener("pointermove", wake);
    };
  }, [playing]);

  async function play() {
    const v = videoRef.current;
    if (!v) return;
    if (!v.src) {
      setLoading(true);
      v.src = film.src;
    }
    v.muted = muted;
    try {
      await v.play();
    } catch {
      setLoading(false);
    }
  }

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || ended) void play();
    else v.pause();
  }

  function onScrub(e: React.MouseEvent<HTMLDivElement>) {
    const v = videoRef.current;
    if (!v || !total) return;
    const box = e.currentTarget.getBoundingClientRect();
    const next = Math.max(0, Math.min(1, (e.clientX - box.left) / box.width)) * total;
    v.currentTime = next;
    setTime(next);
  }

  function onScrubKeys(e: React.KeyboardEvent<HTMLDivElement>) {
    const v = videoRef.current;
    if (!v) return;
    if (e.key === "ArrowRight") v.currentTime = Math.min(total, v.currentTime + 5);
    if (e.key === "ArrowLeft") v.currentTime = Math.max(0, v.currentTime - 5);
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    }
  }

  async function fullscreen() {
    const el = wrapRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await el.requestFullscreen();
    } catch {
      /* browser said no */
    }
  }

  const progress = total ? (time / total) * 100 : 0;
  const showPoster = !playing && !ended;

  return (
    /* The one hard cut in the middle of the page. Everything above it is paper;
       this band is dark and runs full-bleed, so the film arrives as an event
       rather than as the next section. The finale keeps the closing note. */
    <section className="stageband film" id="film">
      <div className="wrap">
        <Reveal>
          <div className="film__head">
            <p className="tick">{film.eyebrow}</p>
            <Words as="h2" className="shout film__title" text={film.title} />
            <p className="film__lede">{film.lede}</p>
          </div>
        </Reveal>

        <Reveal className="film__framein">
          <div
            className="film__frame"
            ref={wrapRef}
            onMouseEnter={() => setChrome(true)}
            data-playing={playing ? "1" : "0"}
            data-chrome={chrome ? "1" : "0"}
          >
            <div ref={nearRef} className="film__slot">
              <video
                ref={videoRef}
                className="film__video"
                poster={film.poster}
                /* metadata only while approaching — never the 50 MB of media */
                preload={armed ? "metadata" : "none"}
                playsInline
                controls={false}
                muted={muted}
                onLoadedMetadata={(e) => {
                  setTotal(e.currentTarget.duration);
                  setLoading(false);
                }}
                onWaiting={() => setLoading(true)}
                onPlaying={() => {
                  setPlaying(true);
                  setEnded(false);
                  setLoading(false);
                }}
                onPause={() => setPlaying(false)}
                onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
                onEnded={() => {
                  setEnded(true);
                  setPlaying(false);
                  setChrome(true);
                }}
              />
            </div>

            <div className={`film__veil${showPoster ? " is-on" : ""}`} aria-hidden={!showPoster}>
              <button
                className="film__play"
                type="button"
                onClick={toggle}
                aria-label={`${ended ? film.replay : film.play}, ${film.durationLabel}`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8 5.2 19 12 8 18.8z" />
                </svg>
                <span>
                  {ended ? film.replay : film.play}
                  <small>
                    {loading ? film.loading : `${film.durationLabel}${muted ? " · muted" : ""}`}
                  </small>
                </span>
              </button>
            </div>

            <div className="film__ui">
              <button
                className="film__btn"
                type="button"
                onClick={toggle}
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <rect x="7" y="5" width="3.4" height="14" rx="1" />
                    <rect x="13.6" y="5" width="3.4" height="14" rx="1" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5.2 19 12 8 18.8z" />
                  </svg>
                )}
              </button>

              <div
                className="film__bar"
                role="slider"
                tabIndex={0}
                aria-label="Film position"
                aria-valuemin={0}
                aria-valuemax={Math.round(total)}
                aria-valuenow={Math.round(time)}
                aria-valuetext={`${clock(time)} of ${clock(total)}`}
                onClick={onScrub}
                onKeyDown={onScrubKeys}
              >
                <i style={{ width: `${progress}%` }} />
              </div>

              <span className="film__time">
                {total ? `${clock(time)} / ${clock(total)}` : clock(time)}
              </span>

              <button
                className="film__btn"
                type="button"
                onClick={() => {
                  const next = !muted;
                  setMuted(next);
                  if (videoRef.current) videoRef.current.muted = next;
                }}
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <Icon.mic size={16} /> : <Icon.check size={15} />}
              </button>

              <button className="film__btn" type="button" onClick={fullscreen} aria-label="Fullscreen">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden>
                  <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
                </svg>
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Film;