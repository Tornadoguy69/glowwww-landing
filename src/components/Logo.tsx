/**
 * The Glowwww wordmark.
 *
 * Vector outlines rather than an image file, for three reasons that all show up
 * on this site: it is crisp at any size, it needs no second colourway, and it
 * paints from `currentColor`, so it follows the theme automatically with no
 * swapped `<img>` and no flash of the wrong one on first paint.
 *
 * Letterforms are Poppins ExtraBold outlines (SIL Open Font License — see
 * docs/licenses/Poppins-OFL.txt). Fixed paths, not a webfont, so the mark is
 * aligned before any font loads and identical on every platform.
 */

const LETTERS = {
  G: "M506 473Q489 501 459.5 516Q430 531 390 531Q316 531 273.5 483Q231 435 231 354Q231 263 276.5 215.5Q322 168 409 168Q512 168 556 261H359V402H725V212Q702 156 657.5 107Q613 58 545 26.5Q477 -5 390 -5Q284 -5 202.5 40.5Q121 86 76.5 167.5Q32 249 32 354Q32 458 76.5 539.5Q121 621 202 666.5Q283 712 389 712Q522 712 609 648Q696 584 717 473Z",
  L: "M252 150H471V0H56V705H252Z",
  W: "M1049 705 876 0H635L538 432L439 0H198L27 705H239L321 223L432 705H647L755 227L837 705Z",
} as const;

/** GL, then the O is drawn as the orb, then four Ws. */
const RUNS: { letter: keyof typeof LETTERS; x: number; delay: number }[] = [
  { letter: "G", x: 2, delay: 0 },
  { letter: "L", x: 30, delay: 0.25 },
  ...[89, 129, 169, 209].map((x, i) => ({ letter: "W" as const, x, delay: 0.85 + i * 0.125 })),
];

export function GlowwwwLogo({
  className = "",
  animated = false,
  title,
}: {
  className?: string;
  /** Plays the write-on once on mount. Off by default — it is a flourish, not information. */
  animated?: boolean;
  /** Supply when the logo is the only label on screen. Hidden otherwise. */
  title?: string;
}) {
  return (
    <svg
      className={`glow-logo ${animated ? "glow-logo--write" : ""} ${className}`.trim()}
      viewBox="0 0 255 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {RUNS.map(({ letter, x, delay }, i) => (
        <g key={i} transform={`translate(${x} 39) scale(.04 -.04)`}>
          <g className="glow-logo__letter" style={{ animationDelay: `${delay}s` }}>
            <path d={LETTERS[letter]} fill="currentColor" />
          </g>
        </g>
      ))}

      {/* The O. A dark disc with the ring and the two strokes, so the mark keeps
          its weight instead of becoming a hollow letter. The disc is a token so
          it stays legible on the charcoal theme without swallowing the white
          highlight. */}
      <g transform="translate(51 6.9) scale(1.5)">
        <circle className="glow-logo__orb" cx="12" cy="12" r="11" fill="var(--logo-orb, #222)" stroke="#E53935" strokeWidth="2" />
        <path className="glow-logo__stroke" style={{ animationDelay: ".4s" }} pathLength="1" d="M3 11C6 7 18 7 21 11" stroke="#E53935" strokeWidth="3" strokeLinecap="round" />
        <path className="glow-logo__stroke" style={{ animationDelay: ".55s" }} pathLength="1" d="M3 13C6 17 18 17 21 13" stroke="#E53935" strokeWidth="3" strokeLinecap="round" />
        <path className="glow-logo__stroke" style={{ animationDelay: ".7s" }} pathLength="1" d="M5 12C8 9 16 9 19 12" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default GlowwwwLogo;