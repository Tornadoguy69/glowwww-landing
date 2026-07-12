import { useState, useEffect, useCallback } from 'react'
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
import { AgentModeOverlay } from './AgentOverlay'
import AgentTestTrigger from './AgentTestTrigger'

const AGENT_SESSION_KEY = 'agent-overlay-shown'

export default function Landing() {
  const [agentOpen, setAgentOpen] = useState(false)
  const [agentForce, setAgentForce] = useState(false)

  const closeAgent = useCallback(() => {
    setAgentOpen(false)
    setAgentForce(false)
  }, [])

  useEffect(() => {
    if (sessionStorage.getItem(AGENT_SESSION_KEY) !== '1') {
      setAgentOpen(true)
    }
  }, [])

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

      <AgentModeOverlay open={agentOpen} onClose={closeAgent} force={agentForce} />
      <AgentTestTrigger
        onClick={() => {
          setAgentForce(true)
          setAgentOpen(true)
        }}
      />
    </div>
  )
}
