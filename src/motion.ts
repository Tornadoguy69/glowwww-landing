/** Brand motion tokens — matches glowwww-brand-system */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeOutBack = [0.34, 1.56, 0.64, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay,
      ease: easeOutExpo,
    },
  }),
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.7, delay, ease: easeOutExpo },
  }),
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.85,
      delay,
      ease: easeOutBack,
    },
  }),
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};
