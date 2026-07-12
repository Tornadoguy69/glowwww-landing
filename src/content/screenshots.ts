export type AppScreenshot = {
  id: string;
  label: string;
  src: string;
  alt: string;
};

/** Curated set — strongest first-look surfaces only. */
export const showcaseScreens: AppScreenshot[] = [
  {
    id: "feed",
    label: "Feed",
    src: "/feed.png",
    alt: "Glowwww real-time feed",
  },
  {
    id: "create",
    label: "Create",
    src: "/create.png",
    alt: "Glowwww create post",
  },
  {
    id: "clips",
    label: "Clips",
    src: "/clips.png",
    alt: "Glowwww clips",
  },
  {
    id: "ai",
    label: "AI Chat",
    src: "/ai.png",
    alt: "Glowwww AI chat",
  },
  {
    id: "messages",
    label: "Messages",
    src: "/messages.png",
    alt: "Glowwww encrypted messages",
  },
  {
    id: "dashboard",
    label: "Dashboard",
    src: "/dashboard.png",
    alt: "Glowwww creator dashboard",
  },
];
