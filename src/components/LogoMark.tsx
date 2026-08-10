/**
 * Canonical Glowwww mark — paths must match public/favicon.svg exactly.
 * viewBox 0 0 24 24
 *
 *   circle  r=11 fill #222 stroke #E53935 sw=2
 *   top arc     M3 11C6 7 18 7 21 11   #E53935 sw=3
 *   bottom arc  M3 13C6 17 18 17 21 13 #E53935 sw=3
 *   white arc   M5 12C8 9 16 9 19 12   white   sw=3
 */
type LogoMarkProps = {
  size?: number | string;
  className?: string;
  /** Accessible name; omit or pass empty for decorative (aria-hidden) */
  title?: string;
};

export function LogoMark({ size = 24, className = "", title }: LogoMarkProps) {
  const dim = typeof size === "number" ? `${size}` : size;
  const decorative = title === undefined || title === "";

  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={dim}
      height={dim}
      className={className}
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title}
    >
      {!decorative && title ? <title>{title}</title> : null}
      <circle cx="12" cy="12" r="11" fill="#222" stroke="#E53935" strokeWidth="2" />
      <path
        d="M3 11C6 7 18 7 21 11"
        stroke="#E53935"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M3 13C6 17 18 17 21 13"
        stroke="#E53935"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M5 12C8 9 16 9 19 12"
        stroke="white"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default LogoMark;
