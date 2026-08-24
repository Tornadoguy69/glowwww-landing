const items = [
  "ENCRYPTED MESSAGES",
  "REAL-TIME POSTS",
  "AI THAT ACTS",
  "BUILT-IN EDITOR",
  "CLIPS",
  "SOLO BUILT",
  "STILL EARLY",
  "ONE APP",
  "GLOWWWW",
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
            <span className="marquee__dot"> · </span>
          </span>
        ))}
      </div>
    </div>
  );
}
