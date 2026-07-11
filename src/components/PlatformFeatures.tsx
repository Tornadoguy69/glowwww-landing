const features = [
  { id: "posts", title: "Real-time Posts", tagline: "No lag, no algorithm jail", description: "Posts land instantly across feeds and profiles. No refresh lag — your network sees it the moment you share." },
  { id: "clips", title: "Clips", tagline: "Momentum, not loops", description: "Vertical clips built for momentum. Capture, trim, and publish without leaving the app." },
  { id: "editor", title: "Image / Video Editor", tagline: "One takeoff, one workflow", description: "Crop, grade, and polish photos and video before they go live. One workflow from capture to post." },
  { id: "messaging", title: "E2E Encrypted Messaging", tagline: "Your eyes only", description: "Direct messages protected end-to-end. Your conversations stay between you and who you're talking to." },
  { id: "ai-chat", title: "AI Chat", tagline: "Talks. Codes. Builds.", description: "AI chat with voice when you want ideas, drafts, or answers — plus tool calls and artifacts when you need more than text." },
  { id: "tools", title: "Tool Call Support", tagline: "AI that ships", description: "AI that can invoke tools — search, create, and act on your behalf inside guarded workflows." },
  { id: "canvas", title: "Artifact Canvas", tagline: "Render, iterate, ship", description: "Generate and refine documents, boards, and visual artifacts in a shared canvas you can revisit." },
  { id: "communities", title: "Communities", tagline: "Crew over crowd", description: "Spaces for crews, niches, and movements — moderated feeds built around shared signal, not noise." },
  { id: "moderation", title: "Real-time Moderation", tagline: "Peace, not patrol", description: "Live moderation signals and actions so communities stay healthy without slowing the conversation." },
  { id: "drafts", title: "Drafts & Scheduler", tagline: "Write when it hits", description: "Save drafts mid-thought and pick them up later. Schedule posts to drop when your audience is actually awake." },
  { id: "ui-ux", title: "Polished UI/UX", tagline: "Feels like an app", description: "Smooth gestures, haptic-like feedback, native-feeling navigation, and thoughtful micro-interactions across every surface." },
  { id: "dislike", title: "Dislike Button", tagline: "Vote signal, not ego", description: "A proper dislike that actually shapes your feed. Downvote low-effort posts and train the algorithm to show you better content." },
  { id: "ai-studio", title: "Glowwww AI Studio", tagline: "Analyse your signal", description: "Click the Glowwww icon on any post to get instant AI analysis — engagement breakdowns, content insights, tone feedback, and tips to improve your reach." },
  { id: "creator-dashboard", title: "Creator Dashboard", tagline: "Know your reach", description: "Real-time analytics on views, engagement, follower growth, and post performance. See what hits and why — all in one clean dashboard." },
]

export default function PlatformFeatures() {
  return (
    <section id="features" className="section">
      <p className="section__label">Platform</p>
      <h2 className="section__title">
        EVERYTHING<br /><span style={{ color: "var(--red)" }}>ON GLOWWWW</span>
      </h2>
      <p className="section__lead">
        Social, AI voice, artifacts, code, clips, messaging, and moderation — all native, all real time, all yours.
      </p>
      <div className="platform-features__grid">
        {features.map((f, i) => (
          <article key={f.id} className="feature-card platform-feature" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="platform-feature__tag">{f.tagline}</div>
            <h3 className="feature-card__title">{f.title}</h3>
            <p className="feature-card__desc">{f.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
