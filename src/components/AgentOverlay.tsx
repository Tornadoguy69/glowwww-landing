export default function AgentOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="agent-overlay" onClick={onClose}>
      <div className="agent-overlay__top">
        <div className="agent-overlay__caption">
          <span className="agent-overlay__pill">Agent mode active</span>
        </div>
      </div>
      <div className="agent-overlay__bottom">
        <button className="agent-overlay__skip" onClick={onClose}>
          Skip →
        </button>
      </div>
    </div>
  )
}
