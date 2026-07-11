export type PwaPlatform = "ios" | "android" | "chrome" | "desktop";

export type PwaGuide = {
  id: PwaPlatform;
  label: string;
  subtitle: string;
  steps: string[];
};

export const pwaGuides: PwaGuide[] = [
  {
    id: "ios",
    label: "iOS",
    subtitle: "Safari on iPhone & iPad",
    steps: [
      "Open glowwww.vercel.app in Safari (not an in-app browser).",
      "Tap the Share button at the bottom of the screen.",
      "Scroll the sheet and tap Add to Home Screen.",
      "Edit the name to Glowwww if needed, then tap Add.",
      "Find the icon on your home screen — launch for a full-screen app experience.",
    ],
  },
  {
    id: "android",
    label: "Android",
    subtitle: "Chrome on phones & tablets",
    steps: [
      "Open glowwww.vercel.app in Chrome.",
      "Tap the menu (⋮) in the top-right corner.",
      "Tap Install app or Add to Home screen.",
      "Confirm when prompted — Glowwww installs like a native app.",
      "Open from your app drawer or home screen for offline-ready PWA mode.",
    ],
  },
  {
    id: "chrome",
    label: "Chrome / Edge",
    subtitle: "Desktop & laptop browsers",
    steps: [
      "Visit glowwww.vercel.app in Chrome or Microsoft Edge.",
      "Look for the install icon in the address bar (monitor + arrow).",
      "Click Install Glowwww in the browser prompt.",
      "Confirm Install in the dialog — the app opens in its own window.",
      "Pin to taskbar or dock; launch anytime without a browser tab.",
    ],
  },
  {
    id: "desktop",
    label: "Desktop",
    subtitle: "Windows, macOS & Linux",
    steps: [
      "Use Chrome, Edge, or another Chromium browser for best PWA support.",
      "Install from the address-bar icon or browser menu → Install Glowwww.",
      "On Windows, find Glowwww in Start; on Mac, check Applications or Launchpad.",
      "Optional: enable Open at login from app settings for a always-ready workspace.",
      "Updates ship automatically when you launch — no manual store downloads.",
    ],
  },
];
