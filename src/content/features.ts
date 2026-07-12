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
    title: "Real-time Social",
    tagline: "No algorithm cage",
    description:
      "Posts land instantly. A real dislike that trains your feed. Vertical clips built for momentum — not endless loops.",
    icon: "⚡",
  },
  {
    id: "create",
    title: "Create Suite",
    tagline: "Capture → polish → publish",
    description:
      "Image and video editor, drafts, and scheduler in one flow. Ship when the idea hits — not after five app switches.",
    icon: "✦",
  },
  {
    id: "ai",
    title: "AI That Ships",
    tagline: "Chat. Voice. Tools. Canvas.",
    description:
      "Talk, draft, call tools, and render artifacts without leaving Glowwww. Plus AI Studio insights on any post.",
    icon: "◎",
  },
  {
    id: "messages",
    title: "Private Messaging",
    tagline: "End-to-end encrypted",
    description:
      "DMs that stay between you and who you're talking to. No silent scanning. No data theatre.",
    icon: "◈",
  },
  {
    id: "community",
    title: "Communities",
    tagline: "Crew over crowd",
    description:
      "Spaces for niches and movements with live moderation — healthy signal without killing the conversation.",
    icon: "⬡",
  },
  {
    id: "dashboard",
    title: "Creator Dashboard",
    tagline: "Know what hits",
    description:
      "Views, engagement, growth, and post performance in one clean view — so you double down on what works.",
    icon: "▣",
  },
];
