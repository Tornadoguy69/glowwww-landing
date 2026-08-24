export type PlatformFeature = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
};

/** Six pillars — one story each. Everything else is detail. */
export const platformFeatures: PlatformFeature[] = [
  {
    id: "social",
    title: "The feed",
    tagline: "Posts just show up",
    description:
      "If someone follows you, they see it. Real-time posts, a dislike that actually trains the feed, and clips that aren't an endless loop.",
    icon: "⚡",
  },
  {
    id: "create",
    title: "The editor",
    tagline: "Edit where you post",
    description:
      "Image and video editor, drafts, and a scheduler in the same app. You don't export from somewhere else and upload.",
    icon: "✦",
  },
  {
    id: "ai",
    title: "The AI",
    tagline: "It can actually do things",
    description:
      "Chat, voice, tools, and a canvas — inside Glowwww. It can open screens and act, not just talk.",
    icon: "◎",
  },
  {
    id: "messages",
    title: "Messages",
    tagline: "End-to-end encrypted",
    description:
      "DMs stay between you and who you're talking to. The server can't read the bodies as plain text.",
    icon: "◈",
  },
  {
    id: "community",
    title: "Communities",
    tagline: "Small groups",
    description:
      "Spaces for niches and people who actually know each other — roles, rules, live activity.",
    icon: "⬡",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    tagline: "See what landed",
    description:
      "Views, engagement, growth, and how each post did — in one place, without a separate analytics app.",
    icon: "▣",
  },
];
