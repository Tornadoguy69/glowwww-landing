import { Link } from "react-router-dom";
import { SITE } from "../../content/site";
import { blogPosts } from "../../content/posts";
import { useCenterProgress } from "../../lib/hooks";
import { Icon } from "../site/Kit";
import { Fade, FadeList, Words, Wipe } from "../site/Motion";

const monthYear = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", year: "numeric" });

/* ---------- Build: who made it, stated plainly ---------- */

export function Build() {
  const { build } = SITE;

  return (
    <section className="bay" id="build">
      <div className="wrap">
        <Fade>
          <div className="chapter">
            <span className="chapter__n">05 — WHO BUILT THIS</span>
            <Words as="h2" className="chapter__t chapter__t--sm" text={build.title} delay={140} />
          </div>
        </Fade>

        <div className="build">
          <div className="narrow">
            {build.body.map((para) => (
              <Fade as="p" key={para.slice(0, 20)}>
                {para}
              </Fade>
            ))}
            <Fade as="p">
              <span className="build__stats">{build.stats}</span>
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Roadmap: an honest list, not four cards ---------- */

export function Roadmap() {
  const { roadmap } = SITE;

  return (
    <section className="bay" id="roadmap">
      <div className="wrap">
        <Fade>
          <div className="chapter">
            <span className="chapter__n">07 — NOT HERE YET</span>
            <Words as="h2" className="chapter__t chapter__t--sm" text={roadmap.title} delay={140} />
            <p className="chapter__lede">{roadmap.lede}</p>
          </div>
        </Fade>

        <FadeList className="list road__list">
          {roadmap.items.map((item, i) => {
            const Glyph = Icon[item.icon as keyof typeof Icon];
            return (
              <div className="list__row road__row" key={item.title}>
                <span className="road__n">{String(i + 1).padStart(2, "0")}</span>
                <Glyph size={18} />
                <b>{item.title}</b>
                <span>{item.body}</span>
              </div>
            );
          })}
        </FadeList>
      </div>
    </section>
  );
}

/* ---------- Writing: two links, not two cards ---------- */

export function Writing() {
  const { writing } = SITE;
  const latest = blogPosts.slice(0, 2);

  return (
    <section className="bay" id="writing">
      <div className="wrap">
        <Fade>
          <div className="chapter">
            <span className="chapter__n">08 — WRITING</span>
            <Words as="h2" className="chapter__t chapter__t--sm" text={writing.title} delay={140} />
            <p className="chapter__lede">{writing.lede}</p>
          </div>
        </Fade>

        <FadeList className="list">
          {latest.map((post) => (
            <Link className="list__row list__row--link" to={`/blog/${post.slug}`} key={post.slug}>
              <time dateTime={post.date}>{monthYear(post.date)}</time>
              <b>{post.title}</b>
              <Icon.arrow size={16} />
            </Link>
          ))}
        </FadeList>

        <Fade>
          <p className="section-foot">
            <Link className="link-arrow" to={writing.cta.href}>
              {writing.cta.label} <Icon.arrow size={15} />
            </Link>
          </p>
        </Fade>
      </div>
    </section>
  );
}

/* ---------- Arrival: the frame the page is remembered by ---------- */

/**
 * One held moment before the close.
 *
 * Every section up to here argues something. This one just stops and looks —
 * a single full-bleed frame with one line over it. Without it the page has two
 * peaks (the film band, the finale) and nothing in between, so the last third
 * is all downhill and the ending arrives without being earned.
 */
export function Arrival() {
  /* Arrival Dolly — one slow step closer as the held frame centres: the shot
     pushes in a touch, a warm vignette closes around it, and the line inks
     from quiet to certain. Then the cut to the dark finale feels like
     lights-out. Transform/opacity only, never under reduced motion. */
  const arrivalRef = useCenterProgress<HTMLElement>("dolly");

  return (
    <section className="arrival" ref={arrivalRef}>
      <div className="wrap">
        <div className="arrival__grid">
          <Wipe duration={1800}>
            <div className="arrival__shot">
              <img
                src="/vision/figure-reach.jpg"
                alt="A figure in ivory ceramic armour reaching up toward the camera on a cracked salt flat"
                width={1100}
                height={1375}
                loading="lazy"
                decoding="async"
              />
              <div className="arrival__vig" aria-hidden />
            </div>
          </Wipe>

          <div className="arrival__in">
            <Fade>
              <p className="arrival__line">
                It started as four folders that were never going to finish.
                <span> This is the one that did.</span>
              </p>
            </Fade>
            <Fade>
              <Link className="link-arrow" to="/goal">
                Where it goes next <Icon.arrow size={15} />
              </Link>
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Finale: the closing dark note ---------- */

export function Finale() {
  const { open } = SITE;

  return (
    <section className="stageband finale" id="open">
      <div className="wrap finale__in">
        <Words as="h2" className="shout finale__title" text={open.title} />
        <Fade as="p">
          <span className="finale__lede">{open.lede}</span>
        </Fade>
        <Fade>
          <div className="finale__row">
            <a className="btn btn--primary btn--lg" href={open.primary.href} target="_blank" rel="noopener noreferrer">
              {open.primary.label} <span className="arr">→</span>
            </a>
          </div>
        </Fade>
        <Fade as="p">
          <span className="finale__sig">
            {open.sig.map((item, i) => (
              <span key={item}>
                {i > 0 ? <span className="dot" aria-hidden /> : null}
                {item}
              </span>
            ))}
          </span>
        </Fade>
      </div>
    </section>
  );
}