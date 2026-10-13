import { useEffect, useRef, useState } from "react";
import { SITE } from "../../content/site";
import { usePrefersReducedMotion } from "../../lib/hooks";
import { Frame, Icon } from "../site/Kit";
import { Fade, Words } from "../site/Motion";
import { LazyVideo } from "../site/LazyVideo";

const STEP_MS = 640;
const GAP_MS = 520;

/**
 * The agent demo. One panel, one video, one idea: ask, act, verify.
 */
export function Agent() {
  const { ai } = SITE;
  const sectionRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const [run, setRun] = useState(0);
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRun((n) => n + 1);
          io.disconnect();
        }
      },
      { threshold: 0.28 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (run === 0) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    /* Under reduced motion the sequence never plays — the finished panel
       shows immediately as plain content. */
    if (reduced) {
      setStep(ai.demo.log.length - 1);
      setDone(true);
      return;
    }
    setStep(-1);
    setDone(false);

    ai.demo.log.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setStep(i), i * (STEP_MS + GAP_MS)));
    });
    timers.current.push(
      window.setTimeout(() => setDone(true), ai.demo.log.length * (STEP_MS + GAP_MS))
    );

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [run, reduced]); // eslint-disable-line react-hooks/exhaustive-deps

  const goal = done
    ? ai.demo.goals[ai.demo.goals.length - 1]
    : step < 0
      ? `0/${ai.demo.log.length}`
      : ai.demo.goals[Math.min(step, ai.demo.goals.length - 1)];
  const actions = step < 0 ? "0" : String(Math.min(step + 1, ai.demo.log.length));
  const progress = done ? 100 : (Math.max(step, 0) / ai.demo.log.length) * 100;

  return (
    <section className="bay" id="ai">
      <div className="wrap" ref={sectionRef}>
        <Fade>
          <div className="chapter">
            <span className="chapter__n">02 — THE AI</span>
            <Words as="h2" className="chapter__t chapter__t--sm" text={ai.title} delay={140} />
          </div>
        </Fade>

        <Fade>
          <p className="narrow narrow--wide ai__lede">{ai.lede}</p>
        </Fade>

        <Fade>
          <div className="agent">
            <div className="panel">
              <div className="panel__head">
                <p>{ai.demo.head}</p>
                <span className="badge">
                  <i />
                  {ai.demo.badge}
                </span>
              </div>

              <dl className="metrics">
                <div>
                  <dt>Goal</dt>
                  <dd className={done ? "is-ok" : undefined}>{goal}</dd>
                </div>
                <div>
                  <dt>Actions</dt>
                  <dd>{actions}</dd>
                </div>
                <div>
                  <dt>Check</dt>
                  <dd className={done ? "is-ok" : undefined}>{done ? "Complete" : "—"}</dd>
                </div>
              </dl>

              <div className="agent-bar">
                <i style={{ width: `${progress}%` }} />
              </div>

              <ul className="log">
                {ai.demo.log.map((entry, i) => {
                  const Glyph = Icon[entry.icon as keyof typeof Icon];
                  const [verb, ...rest] = entry.text.split(":");
                  return (
                    <li key={i} className={i < step ? "ok" : i === step ? "on" : ""}>
                      <Glyph size={15} />
                      <span>
                        <strong>{verb}:</strong> {rest.join(":")}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <p className={`verify${done ? " on" : ""}`}>
                <Icon.check size={16} />
                {ai.demo.verify}
              </p>
            </div>

            <Frame url={ai.demo.frameUrl} contain ratio={ai.demo.ratio}>
              <LazyVideo src={ai.demo.video} poster={ai.demo.poster} />
            </Frame>
          </div>
        </Fade>

        {/* Asymmetric: the frame runs wider than the copy, so the two masses
            don't mirror each other. */}
        <Fade>
          <div className="asym agent__aside">
            <div className="narrow">
              <h3 className="t-h3">{ai.aside.title}</h3>
              <p>{ai.aside.body}</p>
            </div>

            <Frame url={ai.aside.frameUrl} contain ratio={ai.aside.ratio}>
              <LazyVideo src={ai.aside.video} poster={ai.aside.poster} />
            </Frame>
          </div>
        </Fade>

        {done ? (
          <button
            className="replay"
            type="button"
            onClick={() => {
              setStep(-1);
              setRun((n) => n + 1);
            }}
          >
            {ai.demo.replay} →
          </button>
        ) : null}
      </div>
    </section>
  );
}

export default Agent;