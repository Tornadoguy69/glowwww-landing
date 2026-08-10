/**
 * Capture beforeinstallprompt as early as possible.
 * The browser may fire it before React mounts — if we miss it, one-tap install never works.
 */

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

type Listener = (event: BeforeInstallPromptEvent | null) => void;

let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<Listener>();
let started = false;

export function initPwaInstallCapture(): void {
  if (started || typeof window === "undefined") return;
  started = true;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferred = event as BeforeInstallPromptEvent;
    listeners.forEach((fn) => fn(deferred));
  });

  window.addEventListener("appinstalled", () => {
    deferred = null;
    listeners.forEach((fn) => fn(null));
  });
}

export function getDeferredInstallPrompt(): BeforeInstallPromptEvent | null {
  return deferred;
}

export function clearDeferredInstallPrompt(): void {
  deferred = null;
  listeners.forEach((fn) => fn(null));
}

export function subscribeDeferredInstall(listener: Listener): () => void {
  listeners.add(listener);
  if (deferred) listener(deferred);
  return () => {
    listeners.delete(listener);
  };
}

export function registerServiceWorker(): void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  const register = () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Install UI still falls back to manual / iOS steps.
    });
  };

  if (document.readyState === "complete") register();
  else window.addEventListener("load", register, { once: true });
}

/** One-tap install from anywhere (floating prompt or #install section). */
export async function requestOneTapInstall(): Promise<"accepted" | "dismissed" | "unavailable"> {
  const event = deferred;
  if (!event) return "unavailable";

  try {
    await event.prompt();
    const { outcome } = await event.userChoice;
    deferred = null;
    listeners.forEach((fn) => fn(null));
    return outcome;
  } catch {
    return "unavailable";
  }
}

declare global {
  interface Window {
    glowwwwRequestInstall?: () => Promise<"accepted" | "dismissed" | "unavailable">;
  }
}

export function exposeInstallToWindow(): void {
  if (typeof window === "undefined") return;
  window.glowwwwRequestInstall = requestOneTapInstall;
}
