export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`.trim()} aria-label="Glowwww">
      <img
        src="/glowwww_logo_only_transparent.svg"
        alt="Glowwww"
        className="wordmark__img"
        draggable={false}
      />
    </span>
  );
}
