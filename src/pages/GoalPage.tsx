import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { SITE } from "../content/site";
import { Layout } from "../components/site/Layout";
import { Icon } from "../components/site/Kit";
import { Fade, FadeList, Words, Wipe } from "../components/site/Motion";

/**
 * My goal — kept off the product page on purpose.
 *
 * The homepage has one job: explain what Glowwww is and get someone into it.
 * This is the other thing, the part that isn't shipping this month, and it says
 * nothing about feeds or editors. Mixing the two made both weaker, so it lives
 * on its own page.
 *
 * It's allowed to be more theatrical than the product page, because a statement
 * and a pitch are different jobs — but it uses the same layout system, so the
 * two pages still read as one site.
 *
 * Motion is cut like a sequence rather than animated like a web page: figures
 * drift at two depths, images arrive through a clip rather than a fade, and the
 * wide frames come one after another. Transform and clip only, off entirely
 * under reduced-motion, nothing moves unless it's on screen.
 */

function useDrift<T extends HTMLElement>(strength: number) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let visible = false;

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !frame) frame = requestAnimationFrame(tick);
        if (!visible && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "20% 0px" }
    );
    io.observe(el);

    function tick() {
      frame = 0;
      if (!visible) return;
      const box = el!.getBoundingClientRect();
      const progress = (window.innerHeight - box.top) / (window.innerHeight + box.height) - 0.5;
      el!.style.setProperty("--drift", `${(progress * strength).toFixed(2)}px`);
      frame = requestAnimationFrame(tick);
    }

    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [strength]);

  return ref;
}

function Figure({ src, alt, strength = 1 }: { src: string; alt: string; strength?: number }) {
  const ref = useDrift<HTMLDivElement>(strength);
  return (
    <Wipe className="vis__figure" from="bottom" duration={1300}>
      <div ref={ref} className="vis__figureinner">
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
    </Wipe>
  );
}

export function GoalPage() {
  const { vision } = SITE;

  return (
    <Layout>
      <div className="page-head">
        <div className="wrap">
          <Fade as="p">
            <Link className="link-arrow" to="/">
              <span style={{ display: "inline-flex", rotate: "180deg" }}>
                <Icon.arrow size={15} />
              </span>
              Back to Glowwww
            </Link>
          </Fade>
        </div>
      </div>

      {/* Opener. The biggest type on the site and nothing beside it. */}
      <section className="goal-open">
        <div className="wrap">
          <Fade>
            <p className="chapter__n">MY GOAL</p>
          </Fade>
          <Words as="h1" className="chapter__t" text={vision.title} />
          <Fade>
            <p className="goal-open__lede">{vision.lede}</p>
          </Fade>
        </div>

        <Wipe className="bleed" duration={1500}>
          <div className="goal-open__shot">
            <img
              src={vision.hillside.src}
              alt={vision.hillside.alt}
              width={1733}
              height={840}
              fetchPriority="high"
            />
          </div>
        </Wipe>
      </section>

      <div className="wrap vision">
        {/* 01 — the thesis, quiet and narrow after the loud opener. */}
        <Fade>
          <div className="chapter">
            <span className="chapter__n">01 — THE ARGUMENT</span>
            <Words as="h2" className="shout" text={vision.thesis.title} />
          </div>
        </Fade>

        <div className="vis__stage">
          <Figure src="/vision/figure-standing.jpg" alt="" strength={0.9} />
          <Figure
            src="/vision/figure-reach.jpg"
            alt="A figure in ivory ceramic armour reaching up toward the camera on a cracked salt flat"
            strength={1.5}
          />
        </div>

        {/* 02 — humanoids, asymmetric with the copy deliberately narrow. */}
        <Fade>
          <div className="chapter">
            <span className="chapter__n">02 — WHY A BODY</span>
          </div>
        </Fade>

        <div className="asym vis__split">
          <div className="narrow">
            <Words as="h2" className="shout shout--sm" text={vision.humanoid.title} />
            {vision.humanoid.body}
          </div>

          <div className="vis__hand">
            <img
              src="/vision/figure-hand.jpg"
              alt="Close-up of a hand with mechanical finger segments and a Glowwww ring"
              loading="lazy"
              decoding="async"
              width={1200}
              height={1200}
            />
          </div>
        </div>

        <FadeList className="list vis__points">
          {vision.humanoid.points.map((point) => {
            const Glyph = Icon[point.icon as keyof typeof Icon];
            return (
              <div className="list__row" key={point.title}>
                <Glyph size={18} />
                <b>{point.title}</b>
                <span>{point.body}</span>
              </div>
            );
          })}
        </FadeList>

        {/* Presence — a wide frame and one line, nothing else. */}
        <Wipe duration={1400}>
          <div className="vis__wide">
            <img
              src={vision.picnic.src}
              alt={vision.picnic.alt}
              loading="lazy"
              decoding="async"
              width={1731}
              height={818}
            />
          </div>
        </Wipe>

        <Fade>
          <p className="vis__beat">
            It should show up to things that are already happening — a field at dusk, a
            market, a long walk home — and be part of them rather than the reason they stop.
          </p>
        </Fade>

        <Wipe duration={1400}>
          <div className="vis__strip">
            {[vision.greenhouse, vision.running, vision.meadow].map((frame) => (
              <figure className="vis__stripcell" key={frame.src}>
                <img src={frame.src} alt={frame.alt} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        </Wipe>

        {/* 03 — Detroit, given the width it deserves. */}
        <Fade>
          <div className="chapter">
            <span className="chapter__n">03 — WHERE IT STARTED</span>
            <Words as="h2" className="shout shout--sm" text={vision.inspiration.title} />
          </div>
        </Fade>

        <div className="asym asym--flip vis__split">
          <div className="narrow">
            {vision.inspiration.body}
            <p className="vis__credit">{vision.inspiration.credit}</p>
          </div>

          <div className="vis__hand">
            {/* Deliberately not one of the reel frames — this chapter already
                reads through the gallery below it, so repeating a figure here
                just makes the page look shorter than it is. */}
            <img
              src="/vision/figure-mirror.jpg"
              alt="A figure photographing itself in a mirrored lift"
              loading="lazy"
              decoding="async"
              width={1100}
              height={1375}
            />
          </div>
        </div>

        <Wipe duration={1400}>
          <div className="vis__wide">
            <img
              src={vision.wide.src}
              alt={vision.wide.alt}
              loading="lazy"
              decoding="async"
              width={1734}
              height={794}
            />
          </div>
        </Wipe>

        <Fade>
          <p className="vis__beat">
            One that moves differently. Not better, not worse — just not the same.
          </p>
        </Fade>

        {/* The reel — every frame, at its own ratio. */}
        <Fade>
          <div className="chapter">
            <span className="chapter__n">04 — THE FIGURES</span>
          </div>
        </Fade>

        <div className="vis__reel">
          {vision.gallery.map((item, i) => (
            <Wipe key={item.src} duration={1200} from={i % 2 ? "bottom" : "left"}>
              <figure className="vis__frame">
                <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
              </figure>
            </Wipe>
          ))}
        </div>

        {/* 05 — the horizon, then the honest close. */}
        <Fade>
          <div className="chapter">
            <span className="chapter__n">05 — WHERE IT ENDS UP</span>
          </div>
        </Fade>

        <div className="asym vis__split">
          <div className="narrow">
            <Words as="h2" className="shout shout--sm" text={vision.horizon.title} />
            {vision.horizon.body}
          </div>

          <div className="vis__hand">
            <img src="/vision/figure-crossing.jpg" alt={vision.crossing.alt} loading="lazy" decoding="async" />
          </div>
        </div>

        {/* The close. Held rather than stacked. */}
        <Fade>
          <div className="vis__unknown">
            <Words as="h2" className="shout shout--sm" text={vision.horizon.unknown.title} />
            <p>{vision.horizon.unknown.body}</p>
          </div>
        </Fade>
      </div>
    </Layout>
  );
}

export default GoalPage;