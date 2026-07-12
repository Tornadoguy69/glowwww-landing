import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { demoClips } from "../content/demos";
import { easeOutExpo, fadeUp } from "../motion";

export function DemoShowcase() {
  const sectionRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activeId, setActiveId] = useState(demoClips[0].id);
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const active = demoClips.find((d) => d.id === activeId) ?? demoClips[0];

  useEffect(() => {
    setLoaded(false);
    const el = videoRef.current;
    if (!el) return;
    el.load();
    const play = el.play();
    if (play) play.catch(() => {});
  }, [activeId]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [expanded]);

  const videoEl = (
    <>
      {!loaded && <div className="demo-showcase__placeholder" />}
      <video
        key={active.src}
        ref={videoRef}
        className={`demo-showcase__video${loaded ? " demo-showcase__video--loaded" : ""}`}
        src={active.src}
        muted
        loop
        autoPlay
        playsInline
        controls
        onLoadedData={() => setLoaded(true)}
      />
    </>
  );

  return (
    <section id="demos" className="section demo-showcase" ref={sectionRef}>
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp}
        custom={0}
      >
        <p className="section__label">Product demos</p>
        <h2 className="section__title">
          SEE THE APP.
          <br />
          <span className="section__title-accent">FEEL THE FLOW.</span>
        </h2>
        <p className="section__lead">
          Real product clips — editor, AI voice, messages, and tool calls —
          not mockups. Expand any clip for a larger view.
        </p>
      </motion.div>

      <motion.div
        className="demo-showcase__layout"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp}
        custom={0.1}
      >
        <div className="demo-showcase__tabs" role="tablist" aria-label="Demo clips">
          {demoClips.map((clip) => {
            const isActive = clip.id === activeId;
            return (
              <button
                key={clip.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`demo-tab${isActive ? " demo-tab--active" : ""}`}
                onClick={() => setActiveId(clip.id)}
              >
                <span className="demo-tab__label">{clip.label}</span>
                <span className="demo-tab__title">{clip.title}</span>
              </button>
            );
          })}
        </div>

        <div className="demo-showcase__stage">
          <div className="demo-showcase__frame">
            {videoEl}
            <button
              type="button"
              className="demo-showcase__expand"
              onClick={() => setExpanded(true)}
              aria-label="Expand video"
            >
              Expand
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              className="demo-showcase__caption"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: easeOutExpo }}
            >
              <p className="demo-showcase__caption-label">{active.label}</p>
              <h3 className="demo-showcase__caption-title">{active.title}</h3>
              <p className="demo-showcase__caption-desc">{active.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="demo-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setExpanded(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`${active.title} — expanded demo`}
          >
            <motion.div
              className="demo-lightbox__panel"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: easeOutExpo }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="demo-lightbox__bar">
                <div>
                  <p className="demo-lightbox__label">{active.label}</p>
                  <h3 className="demo-lightbox__title">{active.title}</h3>
                </div>
                <button
                  type="button"
                  className="demo-lightbox__close"
                  onClick={() => setExpanded(false)}
                  aria-label="Close expanded video"
                >
                  Close
                </button>
              </div>
              <div className="demo-lightbox__frame">
                <video
                  key={`lightbox-${active.src}`}
                  className="demo-lightbox__video"
                  src={active.src}
                  muted
                  loop
                  autoPlay
                  playsInline
                  controls
                />
              </div>
              <p className="demo-lightbox__desc">{active.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
