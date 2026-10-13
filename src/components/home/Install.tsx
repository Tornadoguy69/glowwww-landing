import { useEffect, useRef, useState } from "react";
import { SITE } from "../../content/site";
import { subscribeDeferredInstall, requestOneTapInstall } from "../../pwaInstallCapture";
import { usePrefersReducedMotion } from "../../lib/hooks";
import { Fade, FadeList, Words } from "../site/Motion";
import { Icon } from "../site/Kit";

type PanelId = "ios" | "android" | "desktop";

const STEP_MS = 1200;

/**
 * Install. Three platforms, five steps each, and a real one-tap button where the
 * browser allows one. The only genuinely interactive piece of chrome on the page.
 */
export function Install() {
  const { install } = SITE;
  const [tab, setTab] = useState<PanelId>("ios");
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState<"accepted" | "dismissed" | "unavailable" | null>(null);
  const [native, setNative] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const walked = useRef(false);
  const walkTimer = useRef(0);
  const reduced = usePrefersReducedMotion();

  const panel = install.panels[tab];

  useEffect(() => {
    setStep(0);
  }, [tab]);

  useEffect(() => subscribeDeferredInstall((p) => setNative(Boolean(p))), []);

  /* The walkthrough plays once. Under reduced motion it never starts — the
     final step shows immediately. The moment a visitor reaches for the guide
     (pointer or keyboard), the walk stops for good so it never fights someone
     who is reading. The timer lives in a ref so unmount actually clears it. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (reduced) {
      setStep(panel.steps.length - 1);
      return;
    }
    if (walked.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        walked.current = true;
        io.disconnect();
        window.clearInterval(walkTimer.current);
        walkTimer.current = window.setInterval(() => {
          setStep((prev) => (prev >= panel.steps.length - 1 ? prev : prev + 1));
        }, STEP_MS);
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(walkTimer.current);
    };
  }, [panel.steps.length, reduced]);

  const stopWalk = () => window.clearInterval(walkTimer.current);

  async function oneTap() {
    setBusy(null);
    const result = await requestOneTapInstall();
    setBusy(result);
    if (result === "unavailable") {
      const ua = navigator.userAgent.toLowerCase();
      const iOS = /iphone|ipad|ipod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      setTab(iOS ? "ios" : /android/.test(ua) ? "android" : "desktop");
      /* Switched platform, so replay the walkthrough from the first step. */
      setStep(0);
    }
  }

  /* One picture per distinct screenshot, in step order. Steps that share a
     shot (the Safari page is both "open it" and "the menu is here") stay on
     that picture instead of hiding every frame but the active one. */
  const frames = panel.steps.reduce<
    {
      shot: (typeof panel.shots)[number];
      steps: { index: number; title: string; home: boolean }[];
    }[]
  >((groups, s, i) => {
    const shot = panel.shots[Math.min(s.shot ?? 0, panel.shots.length - 1)];
    const home = "home" in s && Boolean(s.home);
    const last = groups[groups.length - 1];
    if (last && last.shot.src === shot.src) {
      last.steps.push({ index: i, title: s.title, home: last.steps.some((step) => step.home) || home });
      return groups;
    }
    groups.push({ shot, steps: [{ index: i, title: s.title, home }] });
    return groups;
  }, []);

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
          <div className="guide" onPointerEnter={stopWalk} onFocusCapture={stopWalk}>
            <div>
              <div className="tabs" role="tablist" aria-label="Platform">
                {install.tabs.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    type="button"
                    aria-selected={tab === t.id}
                    className={tab === t.id ? "on" : undefined}
                    onClick={() => setTab(t.id as PanelId)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <ol className="guide__steps">
                {panel.steps.map((s, i) => (
                  <li
                    key={s.title}
                    className={i === step ? "hot" : undefined}
                    aria-current={i === step ? "step" : undefined}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        stopWalk();
                        setStep(i);
                      }}
                    >
                      <span className="guide__n">{i + 1}</span>
                      <span>
                        <b>{s.title}</b>
                        <span>{s.body}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>

              <div className="guide__actions">
                {/*
                  Always an install action. Swapping this for "Open Glowwww"
                  meant the one section whose entire job is installing had no
                  install button on most browsers. If the native prompt isn't
                  available yet, the button still tries, then falls back to the
                  manual steps for the right platform — a button that quietly
                  does nothing is worse than no button.
                */}
                <button
                  className="btn btn--primary"
                  type="button"
                  onClick={oneTap}
                  disabled={busy === "accepted"}
                >
                  {busy === null && (native ? "Install in one tap" : "Install Glowwww")}
                  {busy === "accepted" && "Installed ✓"}
                  {busy === "dismissed" && "Try the steps below"}
                  {busy === "unavailable" && "Show me the steps"}
                </button>

                <a className="link-arrow" href={SITE.hero.primary.href} target="_blank" rel="noopener noreferrer">
                  Or just open it
                </a>
              </div>
            </div>

            <div className="guide__reel" data-device={panel.device}>
              {frames.map(({ shot, steps }) => {
                const on = steps.some((s) => s.index === step);
                const home = steps.some((s) => s.home);
                return (
                  <figure key={shot.src} className={`guide__frame${on ? " is-on" : ""}`}>
                    <button
                      type="button"
                      className="guide__shot"
                      style={{ aspectRatio: String(shot.ratio ?? 9 / 16) }}
                      onClick={() => {
                        stopWalk();
                        setStep(steps[0].index);
                      }}
                      aria-label={steps.map((s) => `${s.index + 1}. ${s.title}`).join(", ")}
                    >
                      <img src={shot.src} alt={shot.alt} loading="lazy" decoding="async" />
                    </button>
                    <figcaption>
                      {steps.map((s) => (
                        <span key={s.index}>
                          <b>{s.index + 1}</b> {s.title}
                        </span>
                      ))}
                    </figcaption>
                    {home ? (
                      <div className="guide__home show">
                        <img src="/launch/assets/icons/icon-192.png" alt="" width={46} height={46} />
                        <span>{panel.homeLabel}</span>
                      </div>
                    ) : null}
                  </figure>
                );
              })}
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