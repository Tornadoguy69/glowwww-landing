import { SITE } from "../../content/site";
import { Fade, Words } from "../site/Motion";

/**
 * Why — the change of pace.
 *
 * The page has just been loud. This section is deliberately almost empty: a
 * chapter number, one line set very large, and nothing else. The drop in
 * density is what makes the next section feel like it arrived rather than
 * continued.
 */
export function Why() {
  const { why } = SITE;

  return (
    <section className="bay" id="why">
      <div className="wrap">
        <Fade>
          <div className="chapter">
            <span className="chapter__n">01 — WHY</span>
            <Words as="h2" className="chapter__t" text={why.title} delay={140} />
          </div>
        </Fade>

        <div className="asym why__body">
          <Fade className="narrow">
            <p className="why__lede">{why.lede}</p>
          </Fade>
        </div>
      </div>
    </section>
  );
}

export default Why;