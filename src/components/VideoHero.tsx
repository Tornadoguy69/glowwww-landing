import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { fadeUp } from "../motion";

export function VideoHero() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="section video-demo" ref={ref}>
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp}
        custom={0}
      >
        <p className="section__label">Demo</p>
        <h2 className="section__title">
          SEE IT
          <br />
          <span style={{ color: "var(--red)" }}>IN ACTION</span>
        </h2>
      </motion.div>

      <motion.div
        className="video-demo__container"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp}
        custom={0.1}
      >
        <div className="video-demo__frame">
          {!loaded && <div className="video-demo__placeholder" />}
          <video
            ref={videoRef}
            className={`video-demo__video ${loaded ? "video-demo__video--loaded" : ""}`}
            src="/hero.mp4"
            muted
            loop
            autoPlay
            playsInline
            controls
            onLoadedData={() => setLoaded(true)}
          />
        </div>
      </motion.div>
    </section>
  );
}
