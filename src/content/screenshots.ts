export type AppScreenshot = {
  id: string;
  label: string;
  src: string;
  alt: string;
};

export const coreScreens: AppScreenshot[] = [
  {
    id: "feed",
    label: "Feed",
    src: "/feed.png",
    alt: "Glowwww feed",
  },
  {
    id: "dashboard",
    label: "Dashboard",
    src: "/dashboard.png",
    alt: "Glowwww dashboard",
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
    alt: "Glowwww messages",
  },
  {
    id: "editor",
    label: "Video Editor",
    src: "/editorv.png",
    alt: "Glowwww video editor",
  },
  {
    id: "voice",
    label: "AI Voice",
    src: "/ai_voice.png",
    alt: "Glowwww AI voice",
  },
];

export const navScreens: AppScreenshot[] = [
  {
    id: "explore",
    label: "Explore",
    src: "/explore.png",
    alt: "Glowwww explore",
  },
  {
    id: "profile",
    label: "Profile",
    src: "/profile.png",
    alt: "Glowwww profile",
  },
  {
    id: "notifications",
    label: "Notifications",
    src: "/notifications.png",
    alt: "Glowwww notifications",
  },
];
