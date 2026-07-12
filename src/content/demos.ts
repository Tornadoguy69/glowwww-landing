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
    title: "Glowwww in motion",
    description: "The full surface — feed, create, and navigate without friction.",
    src: "/hero.mp4",
  },
  {
    id: "editor",
    label: "Editor",
    title: "Polish before you post",
    description: "Crop, grade, and cut video in the same app you publish from.",
    src: "/editor.mp4",
  },
  {
    id: "ai-voice",
    label: "AI Voice",
    title: "Talk it through",
    description: "Voice mode for ideas, drafts, and answers when typing slows you down.",
    src: "/ai-voice-demo.mp4",
  },
  {
    id: "messages",
    label: "Messages",
    title: "Private by default",
    description: "Encrypted conversations that feel native — not bolted on.",
    src: "/messages-video.mp4",
  },
  {
    id: "tools",
    label: "AI Tools",
    title: "AI that acts",
    description: "Tool calls and artifacts so the model builds with you, not just chat.",
    src: "/ai-native-tools.mp4",
  },
];
