import { Link } from "react-router-dom";
import { Layout } from "../components/site/Layout";
import { Icon } from "../components/site/Kit";
import { Fade } from "../components/site/Motion";

export function PrivacyPage() {
  return (
    <Layout>
      <article className="doc">
        <div className="page-head">
          <div className="wrap">
            <Fade as="p">
              <Link className="link-arrow" to="/">
                <span style={{ display: "inline-flex", rotate: "180deg" }}>
                  <Icon.arrow size={15} />
                </span>
                Back to the site
              </Link>
            </Fade>

            <Fade>
              <p className="eyebrow">Legal</p>
              <h1>What I can see, and what I can't.</h1>
              <p className="lede">
                Glowwww is built by one person. This page is written in plain language so you
                know exactly what is private, what is not, and what is still early.
              </p>
              <p className="doc__updated">Last updated August 2026</p>
            </Fade>
          </div>
        </div>

        <div className="wrap" style={{ paddingBottom: "var(--bay)" }}>
          <div className="doc__body">
            <p className="doc__lead">
              The short version: <strong>your message bodies are encrypted end to end</strong>,{" "}
              <strong>what you publish is public</strong>, and{" "}
              <strong>the AI sees what you give it</strong>. Everything else is detail.
            </p>

            <h2>End-to-end messaging</h2>
            <p>
              Direct messages are end-to-end encrypted. Message content is not readable as
              cleartext on the server. When you turn on optional key backup, those keys stay
              under your control — I don't hold a copy.
            </p>
            <p>
              The metadata needed to deliver a message may still exist for routing: who talks to
              whom, and when. That's not the same as being able to read what you wrote.
            </p>

            <h2>What the AI can see</h2>
            <p>
              AI features run with the context you hand them: chat messages, @ai mentions in
              threads, and — in agent mode — on-screen context, because that's how the agent
              knows which screen it's on and whether its action actually worked.
            </p>
            <p>
              On-device models are used where possible; heavier tasks may go to cloud inference.
              The practical advice is simple: don't put secrets in a prompt that you wouldn't
              type into any other AI product.
            </p>

            <h2>Public by design, private by choice</h2>
            <p>
              Anything you choose to publish — posts, media, public communities — is public.
              That is the product working, not a leak.
            </p>
            <p>
              You can also keep your account private, which limits who sees your profile,
              posts, and activity. Direct messages stay end-to-end encrypted either way.
            </p>

            <h2>Account and product data</h2>
            <p>
              Account credentials and settings are stored so the service can run. Analytics are
              kept deliberately restrained — enough to keep the product healthy and improve it,
              not enough to build an advertising profile.
            </p>

            <h2>Early-product honesty</h2>
            <p>
              Glowwww is early access — around seventy-nine people at last count. Agent mode can
              still make things up. It tries to verify app state before reporting success, but
              verification isn't perfect and I'd rather say so than imply otherwise.
            </p>
            <p>
              If something is broken or privacy-relevant, tell me. That feedback is genuinely
              the fastest way this gets safer.
            </p>

            <h2>Contact</h2>
            <p>
              Questions or deletion requests: open{" "}
              <a href="https://glowwww.vercel.app" target="_blank" rel="noopener noreferrer">
                Glowwww
              </a>{" "}
              and message <strong>TESTUSER2</strong> — that's the right place for account
              deletion and privacy questions.
            </p>

            <p className="doc__foot">
              This is a living document for an indie product. It'll get more formal as the
              product grows.
            </p>
          </div>
        </div>
      </article>
    </Layout>
  );
}

export default PrivacyPage;