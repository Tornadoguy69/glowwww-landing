import { motion } from "framer-motion";

type LogoProps = {
  size?: number;
  pulse?: boolean;
  className?: string;
};

export function Logo({ size = 40, pulse = false, className }: LogoProps) {
  const svg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
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

  if (!pulse) {
    return <span className={className}>{svg}</span>;
  }

  return (
    <motion.span
      className={className}
      animate={{
        scale: [1, 0.94, 1],
        opacity: [1, 0.75, 1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {svg}
    </motion.span>
  );
}
