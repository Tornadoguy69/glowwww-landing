import { motion } from "framer-motion";
import { showcaseScreens } from "../content/screenshots";
import { ScreenshotCard } from "./ScreenshotCard";
import { fadeUp } from "../motion";

export function AppPreview() {
  const viewportConfig = { once: true, margin: "-60px" as const };

  return (
    <section id="preview" className="section app-preview">
      <motion.div
        className="app-preview__intro"
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={fadeUp}
        custom={0}
      >
        <p className="section__label">Inside the app</p>
        <h2 className="section__title">
          BUILT TO FEEL
          <br />
          <span className="section__title-accent">NATIVE.</span>
        </h2>
        <p className="section__lead">
          Feed, create, clips, AI, messages, and analytics — captured from the
          live product.
        </p>
      </motion.div>

      <motion.div
        className="app-preview__rail"
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={fadeUp}
        custom={0.12}
      >
        <div className="app-preview__track">
          {showcaseScreens.map((screen) => (
            <ScreenshotCard key={screen.id} screen={screen} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
