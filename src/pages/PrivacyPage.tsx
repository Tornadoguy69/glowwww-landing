import { Link } from "react-router-dom";
import "../styles/blog.css";

export function PrivacyPage() {
  return (
    <div className="blog-page privacy-page">
      <div className="blog-page__inner" style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px 80px" }}>
        <p style={{ marginBottom: 24 }}>
          <Link to="/" style={{ color: "var(--red, #e53935)", fontWeight: 600 }}>
            ← Glowwww
          </Link>
        </p>
        <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a2a2a8", fontWeight: 600 }}>
          Legal · last updated Aug 2026
        </p>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "12px 0 20px" }}>
          Privacy &amp; data
        </h1>
        <p style={{ color: "#a2a2a8", lineHeight: 1.65, marginBottom: 28 }}>
          Glowwww is built by one person (Tornado). This page is written in plain language so you know
          what is private, what is not, and what is still early.
        </p>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10 }}>End-to-end messaging</h2>
          <p style={{ color: "#c8c8ce", lineHeight: 1.65 }}>
            Direct messages are end-to-end encrypted. Message content is not readable as cleartext on the
            server. Optional key backup is under your control when enabled. Metadata needed to deliver
            messages (who talks to whom, timestamps) may still exist for routing — that is not the same as
            reading message bodies.
          </p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10 }}>What AI can see</h2>
          <p style={{ color: "#c8c8ce", lineHeight: 1.65 }}>
            AI features run with the context you give them: chat messages, mentions in threads, and (in agent
            mode) on-screen app context so the agent can act. On-device models are used where possible.
            Cloud inference may be used for heavier tasks. Do not put secrets in prompts you would not
            type into any other AI product.
          </p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10 }}>Account &amp; product data</h2>
          <p style={{ color: "#c8c8ce", lineHeight: 1.65 }}>
            Public posts, profiles, communities, and media you publish are public by design. Account
            credentials and settings are stored to run the service. Analytics are kept restrained — enough
            to run and improve the product, not to build an ad profile.
          </p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10 }}>Early product honesty</h2>
          <p style={{ color: "#c8c8ce", lineHeight: 1.65 }}>
            Glowwww is early access (~69 users at last count). Agent mode can still hallucinate; it tries to
            verify app state before claiming success, but verification is not perfect. Report issues —
            that feedback is how this gets safer.
          </p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10 }}>Contact</h2>
          <p style={{ color: "#c8c8ce", lineHeight: 1.65 }}>
            Questions or deletion requests: open{" "}
            <a href="https://glowwww.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: "#ef4444" }}>
              Glowwww
            </a>{" "}
            and message <strong style={{ color: "#f1f1f2" }}>TESTUSER2</strong> — that&apos;s the right place for
            account deletion and privacy questions.
          </p>
        </section>

        <p style={{ color: "#666", fontSize: 13, marginTop: 40 }}>
          This is a living document for an indie product. It will get more formal as the product grows.
        </p>
      </div>
    </div>
  );
}

export default PrivacyPage;
