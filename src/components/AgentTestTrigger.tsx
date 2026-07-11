export default function AgentTestTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button className="agent-test-trigger" onClick={onClick}>
      Test agent mode overlay
    </button>
  )
}
