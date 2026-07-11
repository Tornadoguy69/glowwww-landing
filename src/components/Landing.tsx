import { useState } from 'react'
import { Nav } from './Nav'
import { Hero } from './Hero'
import { Marquee } from './Marquee'
import PlatformFeatures from './PlatformFeatures'
import { AppPreview } from './AppPreview'
import PWAInstall from './PWAInstall'
import UpdatesSection from './UpdatesSection'
import BillboardSection from './BillboardSection'
import { CTA } from './CTA'
import { Footer } from './Footer'
import AgentOverlay from './AgentOverlay'
import AgentTestTrigger from './AgentTestTrigger'

export default function Landing() {
  const [agentOpen, setAgentOpen] = useState(false)

  return (
    <div className="landing">
      <div className="ambient" aria-hidden>
        <div className="ambient__orb ambient__orb--red" />
        <div className="ambient__orb ambient__orb--prism" />
        <div className="ambient__orb ambient__orb--rose" />
        <div className="ambient__grid" />
        <div className="ambient__vignette" />
      </div>

      <Nav />

      <Hero />
      <Marquee />
      <PlatformFeatures />
      <AppPreview />
      <PWAInstall />
      <UpdatesSection />
      <BillboardSection />
      <CTA />
      <Footer />

      {agentOpen && <AgentOverlay onClose={() => setAgentOpen(false)} />}
      <AgentTestTrigger onClick={() => setAgentOpen(true)} />
    </div>
  )
}
