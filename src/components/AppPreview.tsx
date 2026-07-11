import { motion } from "framer-motion";
import { coreScreens, navScreens } from "../content/screenshots";
import { ScreenshotCard } from "./ScreenshotCard";
import type { AppScreenshot } from "../content/screenshots";
import { fadeUp } from "../motion";

interface PreviewSectionProps {
  id: string;
  className?: string;
  label: string;
  title: string;
  coloredTitle: string;
  lead: string;
  screens: AppScreenshot[];
}

function PreviewSection({
  id,
  className = "",
  label,
  title,
  coloredTitle,
  lead,
  screens
}: PreviewSectionProps) {
  const viewportConfig = { once: true, margin: "-60px" };

  return (
    <section id={id} className={`section app-preview ${className}`}>
      <motion.div
        className="app-preview__intro"
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={fadeUp}
        custom={0}
      >
        <p className="section__label">{label}</p>
        <h2 className="section__title">
          {title}
          <br />
          <span style={{ color: "var(--red)" }}>{coloredTitle}</span>
        </h2>
        <p className="section__lead">{lead}</p>
      </motion.div>

      <motion.div
        className="app-preview__grid"
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={fadeUp}
        custom={0.12}
      >
        {screens.map((screen: AppScreenshot) => (
          <ScreenshotCard key={screen.id} screen={screen} />
        ))}
      </motion.div>
    </section>
  );
}

export function AppPreview() {
  return (
    <>
      <PreviewSection
        id="preview"
        label="App preview"
        title="CREATE &"
        coloredTitle="CONNECT"
        lead="Feed, clips, create, video editor, encrypted messages, AI Chat, and voice — built in Glowwww, captured from the live app."
        screens={coreScreens}
      />

      <PreviewSection
        id="explore"
        className="app-preview--nav"
        label="Navigation"
        title="EXPLORE."
        coloredTitle="STAY IN SYNC."
        lead="Explore, News, Profile, and Notifications — everything you need to move through Glowwww without losing your place."
        screens={navScreens}
      />
    </>
  );
}
