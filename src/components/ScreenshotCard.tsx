import { useState } from "react";
import type { AppScreenshot } from "../content/screenshots";

export function ScreenshotCard({ screen }: { screen: AppScreenshot }) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="screenshot-slot">
      <div className="screenshot-slot__frame">
        {!failed ? (
          <img
            src={screen.src}
            alt={screen.alt}
            className="screenshot-slot__img"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <>
            <div className="screenshot-slot__shimmer" />
            <span className="screenshot-slot__label">{screen.label}</span>
            <span className="screenshot-slot__hint">Add {screen.src.replace("/", "")} to public</span>
          </>
        )}
      </div>
      <figcaption className="screenshot-slot__caption">{screen.label}</figcaption>
    </figure>
  );
}
