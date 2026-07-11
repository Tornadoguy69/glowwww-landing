import { useState } from 'react'

interface Guide {
  id: string
  title: string
  steps: string[]
}

const guides: Guide[] = [
  {
    id: "ios",
    title: "Safari on iPhone & iPad",
    steps: [
      "Open glowwww.vercel.app in Safari (not an in-app browser).",
      "Tap the Share button at the bottom of the screen.",
      "Scroll the sheet and tap Add to Home Screen.",
      "Edit the name to Glowwww if needed, then tap Add.",
      "Find the icon on your home screen — launch for a full-screen app experience.",
    ],
  },
  {
    id: "android",
    title: "Chrome on phones & tablets",
    steps: [
      "Open glowwww.vercel.app in Chrome.",
      "Tap the menu (⋮) in the top-right corner.",
      "Tap Install app or Add to Home screen.",
      "Confirm when prompted — Glowwww installs like a native app.",
      "Open from your app drawer or home screen for offline-ready PWA mode.",
    ],
  },
  {
    id: "desktop",
    title: "Desktop & laptop browsers",
    steps: [
      "Visit glowwww.vercel.app in Chrome or Microsoft Edge.",
      "Look for the install icon in the address bar (monitor + arrow).",
      "Click Install Glowwww in the browser prompt.",
      "Confirm Install in the dialog — the app opens in its own window.",
      "Pin to taskbar or dock; launch anytime without a browser tab.",
    ],
  },
]

export default function PWAInstall() {
  const [active, setActive] = useState(guides[0].id)
  const guide = guides.find(g => g.id === active)!

  return (
    <section id="install" className="section">
      <p className="section__label">Install</p>
      <h2 className="section__title">
        INSTALL<br /><span style={{ color: "var(--red)" }}>THE APP</span>
      </h2>
      <p className="section__lead">
        Updates ship automatically when you launch — no manual store downloads.
      </p>
      <div className="pwa-layout">
        <div>
          <div className="pwa-tabs">
            {guides.map(g => (
              <button
                key={g.id}
                className={`pwa-tab${g.id === active ? ' pwa-tab--active' : ''}`}
                onClick={() => setActive(g.id)}
              >
                {g.title}
              </button>
            ))}
          </div>
          <p className="pwa-guide__subtitle">{guide.title}</p>
          <ol className="pwa-steps">
            {guide.steps.map((step, i) => (
              <li key={i}>
                <span className="pwa-steps__num">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
        <div className="pwa-mock">
          <div className="pwa-mock__badge">PWA ready</div>
          <div className="pwa-phone">
            <div className="pwa-phone__status">
              <span>9:41</span>
              <span className="pwa-phone__signal">●●●●●●</span>
            </div>
            <div className="pwa-phone__homescreen">
              <div className="pwa-phone__wallpaper" />
              <div className="pwa-phone__icons">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="pwa-phone__icon">
                    <div className="pwa-phone__icon--ghost" />
                    <span>&nbsp;</span>
                  </div>
                ))}
              </div>
              <div className="pwa-phone__hero-icon">
                <div className="pwa-phone__icon--ghost" style={{ width: 52, height: 52, borderRadius: 12, background: "var(--red)" }} />
                <span>Glowwww</span>
              </div>
              <div className="pwa-phone__dock">
                <div className="pwa-phone__dock-bar" />
              </div>
            </div>
          </div>
          <p className="pwa-mock__caption">
            Glowwww runs as a standalone PWA — install it once, launch it like any native app.
          </p>
        </div>
      </div>
    </section>
  )
}
