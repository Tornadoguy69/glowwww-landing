import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  clearDeferredInstallPrompt,
  getDeferredInstallPrompt,
  subscribeDeferredInstall,
  type BeforeInstallPromptEvent,
} from "../pwaInstallCapture";

type InstallMode = "native" | "ios" | "manual";

interface InstallInstructions {
  title: string;
  description: string;
  steps: Array<{
    icon?: "share" | "home";
    text: ReactNode;
  }>;
}

const DISMISSED_KEY = "glowww_dismissed_install";
const DISMISS_DAYS = 3;
const DEFAULT_BOTTOM_OFFSET = 20;
const NAV_GAP = 12;
const ICON_SRC = "/launch/assets/icons/icon-192.png";

const safeGetStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private browsing can disable storage.
  }
};

const isAppInstalled = () => {
  const standaloneDisplay = window.matchMedia("(display-mode: standalone)").matches;
  const fullscreenDisplay = window.matchMedia("(display-mode: fullscreen)").matches;
  const minimalUiDisplay = window.matchMedia("(display-mode: minimal-ui)").matches;
  const iosStandalone =
    "standalone" in window.navigator &&
    Boolean((window.navigator as { standalone?: boolean }).standalone);

  return standaloneDisplay || fullscreenDisplay || minimalUiDisplay || iosStandalone;
};

const hasInstalledRelatedApp = async () => {
  const nav = window.navigator as Navigator & {
    getInstalledRelatedApps?: () => Promise<Array<Record<string, unknown>>>;
  };

  if (typeof nav.getInstalledRelatedApps !== "function") return false;

  try {
    const relatedApps = await nav.getInstalledRelatedApps();
    return Array.isArray(relatedApps) && relatedApps.length > 0;
  } catch {
    return false;
  }
};

const getInstallMode = (): InstallMode => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOSMobile = /iphone|ipad|ipod/.test(userAgent);
  const isModernIPad = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;

  if (isIOSMobile || isModernIPad) return "ios";
  return "manual";
};

const getInstructions = (mode: InstallMode): InstallInstructions => {
  if (mode === "native") {
    return {
      title: "Install Glowwww",
      description: "One tap puts Glowwww on your home screen — full screen, own icon.",
      steps: [],
    };
  }

  if (mode === "ios") {
    return {
      title: "Add Glowwww to Home Screen",
      description:
        "Apple doesn’t allow one-tap install. Use Share → Add to Home Screen (Safari only).",
      steps: [
        {
          icon: "share",
          text: (
            <>
              Stay in <strong>Safari</strong> on this page (not Instagram / X in-app browser).
            </>
          ),
        },
        {
          icon: "share",
          text: (
            <>
              Tap the <strong>Share</strong> button
              <span aria-hidden> ⎋</span> in the toolbar.
            </>
          ),
        },
        {
          icon: "home",
          text: (
            <>
              Choose <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>.
            </>
          ),
        },
      ],
    };
  }

  return {
    title: "Install Glowwww",
    description: "Add Glowwww to your home screen. Own icon, full screen.",
    steps: [
      {
        text: (
          <>
            Open the browser menu <strong>⋮</strong> (or the install icon in the address bar).
          </>
        ),
      },
      {
        icon: "home",
        text: (
          <>
            Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.
          </>
        ),
      },
      {
        text: (
          <>
            Confirm — open Glowwww from your home screen, full screen.
          </>
        ),
      },
    ],
  };
};

const getDismissedRecently = () => {
  const dismissedAt = safeGetStorage(DISMISSED_KEY);
  if (!dismissedAt) return false;

  const dismissedTime = new Date(dismissedAt).getTime();
  if (Number.isNaN(dismissedTime)) return false;

  const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 3600 * 24);
  return daysSinceDismissed < DISMISS_DAYS;
};

function IconClose() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5z" />
    </svg>
  );
}

function IconShare() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
      <path d="M12 16V3" />
      <path d="m7 8 5-5 5 5" />
    </svg>
  );
}

export function InstallPwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [mode, setMode] = useState<InstallMode>("manual");
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(DEFAULT_BOTTOM_OFFSET);

  const activeMode: InstallMode = deferredPrompt ? "native" : mode;
  const instructions = useMemo(() => getInstructions(activeMode), [activeMode]);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof window.setTimeout> | undefined;

    const markInstalled = () => {
      if (cancelled) return;
      window.clearTimeout(timeoutId);
      setDeferredPrompt(null);
      clearDeferredInstallPrompt();
      setIsVisible(false);
      setIsInstalled(true);
      setShowSteps(false);
      setInstalling(false);
    };

    const revealPrompt = (delay = 1200) => {
      if (cancelled || isAppInstalled() || getDismissedRecently()) return;
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        if (cancelled) return;
        setIsVisible(true);
        // iOS always needs the Share sheet steps
        if (getInstallMode() === "ios") setShowSteps(true);
      }, delay);
    };

    const handleAppInstalled = () => {
      markInstalled();
    };

    const handleStandaloneDisplayChange = (event: MediaQueryListEvent) => {
      if (event.matches) markInstalled();
    };

    const unsub = subscribeDeferredInstall((event) => {
      if (cancelled) return;
      if (event) {
        setDeferredPrompt(event);
        setMode("native");
        setShowSteps(false);
        revealPrompt(400);
      } else {
        setDeferredPrompt(null);
      }
    });

    // Pick up an event that fired before this component mounted
    const existing = getDeferredInstallPrompt();
    if (existing) {
      setDeferredPrompt(existing);
      setMode("native");
    }

    const initialize = async () => {
      const installed = isAppInstalled() || (await hasInstalledRelatedApp());
      if (installed) {
        markInstalled();
        return;
      }

      if (cancelled) return;
      setIsInstalled(false);
      const detected = getInstallMode();
      setMode(existing ? "native" : detected);
      if (!getDismissedRecently()) revealPrompt(existing ? 500 : 1600);
    };

    window.addEventListener("appinstalled", handleAppInstalled);
    const standaloneMedia = window.matchMedia("(display-mode: standalone)");
    standaloneMedia.addEventListener?.("change", handleStandaloneDisplayChange);

    void initialize();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      unsub();
      window.removeEventListener("appinstalled", handleAppInstalled);
      standaloneMedia.removeEventListener?.("change", handleStandaloneDisplayChange);
    };
  }, []);

  useEffect(() => {
    if (!isVisible || typeof document === "undefined") return;

    const updateBottomOffset = () => {
      const bottomNav = document.querySelector<HTMLElement>('[data-bottom-nav="true"]');
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

      if (!bottomNav) {
        setBottomOffset(DEFAULT_BOTTOM_OFFSET);
        return;
      }

      const navRect = bottomNav.getBoundingClientRect();
      const navStyles = window.getComputedStyle(bottomNav);
      const isNavVisible =
        navRect.height > 0 &&
        navRect.top < viewportHeight &&
        navStyles.opacity !== "0" &&
        navStyles.pointerEvents !== "none";

      setBottomOffset(
        isNavVisible ? Math.ceil(viewportHeight - navRect.top + NAV_GAP) : DEFAULT_BOTTOM_OFFSET,
      );
    };

    updateBottomOffset();

    window.addEventListener("resize", updateBottomOffset);
    window.addEventListener("orientationchange", updateBottomOffset);
    window.addEventListener("glowww:bottom-nav-visibility", updateBottomOffset);
    window.visualViewport?.addEventListener("resize", updateBottomOffset);
    window.visualViewport?.addEventListener("scroll", updateBottomOffset);

    return () => {
      window.removeEventListener("resize", updateBottomOffset);
      window.removeEventListener("orientationchange", updateBottomOffset);
      window.removeEventListener("glowww:bottom-nav-visibility", updateBottomOffset);
      window.visualViewport?.removeEventListener("resize", updateBottomOffset);
      window.visualViewport?.removeEventListener("scroll", updateBottomOffset);
    };
  }, [isVisible]);

  const handleInstallClick = async () => {
    // True one-tap: Chromium fires beforeinstallprompt → adds to home screen
    const promptEvent = deferredPrompt ?? getDeferredInstallPrompt();

    if (promptEvent) {
      setInstalling(true);
      try {
        await promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;

        if (outcome === "accepted") {
          setIsVisible(false);
          setIsInstalled(true);
          setShowSteps(false);
        } else {
          setShowSteps(true);
        }
      } catch {
        setShowSteps(true);
      } finally {
        setDeferredPrompt(null);
        clearDeferredInstallPrompt();
        setInstalling(false);
      }
      return;
    }

    // iOS / browsers without native install API — show Add to Home Screen steps
    setShowSteps(true);
  };

  const handleDismiss = () => {
    safeSetStorage(DISMISSED_KEY, new Date().toISOString());
    setShowSteps(false);
    setIsVisible(false);
  };

  if (!isVisible || isInstalled) return null;

  const canUseNativePrompt = Boolean(deferredPrompt);
  const isIos = activeMode === "ios";
  const ctaLabel = installing
    ? "Installing…"
    : canUseNativePrompt
      ? "Install in one tap"
      : isIos
        ? "Add to Home Screen"
        : "Install in one tap";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
          data-no-bottom-nav-autohide="true"
          className="lp-install"
          style={{ bottom: `calc(${bottomOffset}px + env(safe-area-inset-bottom, 0px))` }}
          role="dialog"
          aria-label="Install Glowwww"
        >
          <div className="lp-install__card">
            <div className="lp-install__row">
              <div className="lp-install__icon">
                <img src={ICON_SRC} alt="" width={40} height={40} draggable={false} />
              </div>

              <div className="lp-install__copy">
                <h3>{instructions.title}</h3>
                <p>{instructions.description}</p>
              </div>

              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss install prompt"
                className="lp-install__close"
              >
                <IconClose />
              </button>
            </div>

            <button
              type="button"
              onClick={handleInstallClick}
              className="lp-install__cta"
              disabled={installing}
            >
              <IconHome />
              {ctaLabel}
            </button>

            {!canUseNativePrompt && !isIos && (
              <p className="lp-install__hint">
                If the system dialog doesn’t open, use the steps below — same home-screen install.
              </p>
            )}

            <AnimatePresence initial={false}>
              {(showSteps || isIos || (!canUseNativePrompt && showSteps)) &&
                instructions.steps.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="lp-install__steps-wrap"
                  >
                    <ol className="lp-install__steps">
                      {instructions.steps.map((step, index) => (
                        <li key={index}>
                          <span className="lp-install__step-n" aria-hidden>
                            {step.icon === "share" ? (
                              <IconShare />
                            ) : step.icon === "home" ? (
                              <IconHome />
                            ) : (
                              index + 1
                            )}
                          </span>
                          <span>{step.text}</span>
                        </li>
                      ))}
                    </ol>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default InstallPwaPrompt;
