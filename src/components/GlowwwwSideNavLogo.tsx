import React from 'react';

interface GlowwwwSideNavLogoProps {
  className?: string;
}

export const GlowwwwSideNavLogo: React.FC<GlowwwwSideNavLogoProps> = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 224 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <text
      x="1"
      y="39"
      fill="currentColor"
      fontFamily="'Poppins', 'DM Sans', Arial, sans-serif"
      fontSize="37"
      fontWeight="800"
      letterSpacing="-1.6"
    >
      GL
    </text>
    <g transform="translate(47 8) scale(1.5)">
      <circle cx="12" cy="12" r="11" fill="#222" stroke="#E53935" strokeWidth="2" />
      <path d="M3 11C6 7 18 7 21 11" stroke="#E53935" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M3 13C6 17 18 17 21 13" stroke="#E53935" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M5 12C8 9 16 9 19 12" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
    <text
      x="82"
      y="39"
      fill="currentColor"
      fontFamily="'Poppins', 'DM Sans', Arial, sans-serif"
      fontSize="36"
      fontWeight="800"
      letterSpacing="-3.4"
    >
      WWWW
    </text>
  </svg>
);
