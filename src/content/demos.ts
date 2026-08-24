export type DemoClip = {
  id: string;
  label: string;
  title: string;
  description: string;
  src: string;
};

export const demoClips: DemoClip[] = [
  {
    id: "overview",
    label: "Overview",
    title: "A look around the app",
    description: "The feed, create, and how you move around — from the live product.",
    src: "/hero.mp4",
  },
  {
    id: "editor",
    label: "Editor",
    title: "Edit before you post",
    description: "Crop, grade, and cut video in the same app you publish from.",
    src: "/editor.mp4",
  },
  {
    id: "ai-voice",
    label: "AI Voice",
    title: "Just talk to it",
    description: "Voice mode for ideas, drafts, and answers when you don't want to type.",
    src: "/ai-voice-demo.mp4",
  },
  {
    id: "messages",
    label: "Messages",
    title: "Messages stay between you",
    description: "Encrypted conversations that feel like a normal chat.",
    src: "/messages-video.mp4",
  },
  {
    id: "tools",
    label: "AI Tools",
    title: "AI that does the thing",
    description: "Tool calls and artifacts — the model builds with you, not just talks.",
    src: "/ai-native-tools.mp4",
  },
];
