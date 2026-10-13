import { SITE } from "../../content/site";
import { useCenterProgress } from "../../lib/hooks";
import { Frame } from "../site/Kit";
import { Fade, Words, Wipe } from "../site/Motion";
import { LazyVideo } from "../site/LazyVideo";

/**
 * The app — three things, three different layouts.
 *
 * Same measurements as before, but alternating which side the copy sits on and
 * letting the middle feature run full bleed. Three identical rows is the thing
 * that made this section read as a component library.
 *
 * Drafting Table: while the section crosses the viewport middle, the two side
 * frames fan up like paper models pinned to a table while the middle bleed
 * stays flat and keeps playing — the screening between two storyboards.
 * Transform-only, desktop only, never under reduced motion.
 */
export function TheApp() {
  const { app } = SITE;
  const appRef = useCenterProgress<HTMLElement>("fan");

  return (
    <section className="bay" id="app" ref={appRef}>
      <div className="wrap">
        <Fade>
          <div className="chapter">
            <span className="chapter__n">03 — THE APP</span>
            <Words as="h2" className="chapter__t chapter__t--sm" text={app.title} delay={140} />
          </div>
        </Fade>

        <Fade>
          <p className="narrow narrow--wide app__lede">{app.lede}</p>
        </Fade>
      </div>

      {/* Feature one — copy left, media right. */}
      <div className="wrap app__row">
        <Fade className="narrow">
          <h3 className="t-h3">{app.features[0].title}</h3>
          <p>{app.features[0].body}</p>
        </Fade>

        <Wipe className="app__media" duration={1200}>
          <Frame url={app.features[0].frameUrl} contain ratio={app.features[0].ratio}>
            <img src={app.features[0].shot} alt={app.features[0].alt} loading="lazy" decoding="async" />
          </Frame>
        </Wipe>
      </div>

      {/* Feature two — full bleed. The only product image that breaks the
           measure, so it lands as an event rather than a repetition. */}
      <div className="app__bleed">
          <Wipe duration={1300}>
            <div className="app__wide">
              <div className="app__widecopy">
                <span className="tick">{app.features[1].frameUrl}</span>
                <h3 className="t-h3">{app.features[1].title}</h3>
                <p>{app.features[1].body}</p>
              </div>
              <Frame url={undefined} contain ratio={app.features[1].ratio}>
                <LazyVideo src={app.features[1].video!} poster={app.features[1].poster} />
              </Frame>
            </div>
          </Wipe>
      </div>

      {/* Feature three — the clips view, in the same frame as the rest.
          The recording is a desktop window, not a phone, so a device bezel
          only hid it. */}
      <div className="wrap app__row app__row--flip">
        <Wipe className="app__media" from="right" duration={1200}>
          <Frame url={app.features[2].frameUrl} contain ratio={app.features[2].ratio}>
            <img src={app.features[2].shot} alt={app.features[2].alt} loading="lazy" decoding="async" />
          </Frame>
        </Wipe>

        <Fade className="narrow">
          <h3 className="t-h3">{app.features[2].title}</h3>
          <p>{app.features[2].body}</p>
        </Fade>
      </div>
    </section>
  );
}

export default TheApp;