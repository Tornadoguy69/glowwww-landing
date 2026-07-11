const items = [
  "GLOWWWW DIFFERENT",
  "REAL ONES SHINE",
  "FULL SIGNAL",
  "NO FILTER",
  "MAIN CHARACTER",
  "AI THAT BUILDS",
  "YOUR GLOWWWW YOUR WORLD",
  "VOICE MODE ACTIVE",
  "CODE. CHAT. CREATE.",
];

function MarqueeItem({ text }: { text: string }) {
  const parts = text.split(/(GLOWWWW)/);
  return (
    <>
      {parts.map((part, i) =>
        part === "GLOWWWW" ? <span key={i}>{part}</span> : part
      )}
    </>
  );
}

export function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div className="marquee" aria-hidden>
      <div className="marquee__track">
        {doubled.map((text, i) => (
          <span key={`${text}-${i}`} className="marquee__item">
            <MarqueeItem text={text} />
            <span> · </span>
          </span>
        ))}
      </div>
    </div>
  );
}
