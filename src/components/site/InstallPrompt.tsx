import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  subscribeDeferredInstall,
  requestOneTapInstall,
  type BeforeInstallPromptEvent,
} from "../../pwaInstallCapture";
import { Icon } from "./Kit";

/**
 * A quiet invitation to install.
 *
 * Two things this deliberately is not:
 *
 *  - It isn't a modal. Nothing blocks the page, because the page is the point.
 *  - It doesn't pretend. On iOS there is no one-tap API, so instead of a button
 *    that silently does nothing, it says which two taps to make. A prompt that
 *    lies about what will happen teaches people to dismiss prompts.
 *
 * It appears once the reader has finished the hero — asking someone to install
 * before they've seen what they're installing is a waste of both moments.
 */

const DISMISS_KEY = "glowwww.install-dismissed";
/** Scroll depth at which the ask appears. */
const REVEAL_AT = 0.55;

type Platform = "native" | "ios" | "android" | "desktop";

function detectPlatform(): Platform {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent;
  const uaLower = ua.toLowerCase();
  const iOS =
    /iphone|ipad|ipod/.test(uaLower) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (iOS) return "ios";
  if (/android/.test(uaLower)) return "android";
  return "desktop";
}

/** True once the app is running from the home screen rather than a browser tab. */
function isInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari reports this instead of display-mode.
    (navigator as { standalone?: boolean }).standalone === true
  );
}

export function InstallPrompt() {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(true);
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [platform] = useState<Platform>(detectPlatform);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    setInstalled(isInstalled());
    return subscribeDeferredInstall(setEvent);
  }, []);

  /* Wait until the reader is actually into the page before asking for anything. */
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      if (window.scrollY / max >= REVEAL_AT) {
        setArmed(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed || installed || !armed) return null;
  /* Android and desktop get a real one-tap button. iOS never fires the event. */
  const canPrompt = Boolean(event);

  async function install() {
    setBusy(true);
    await requestOneTapInstall();
    setBusy(false);
  }

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* private mode — it'll simply reappear */
    }
    setDismissed(true);
  }

  return (
    <aside className="installbar" role="complementary" aria-label="Install Glowwww">
      <img className="installbar__icon" src="/launch/assets/icons/icon-192.png" alt="" width={40} height={40} />

      <div className="installbar__text">
        {canPrompt ? (
          <>
            <b>Put Glowwww on your home screen.</b>
            <span>Full screen, no browser bar, and it opens like an app.</span>
          </>
        ) : platform === "ios" ? (
          <>
            <b>Add Glowwww to your home screen.</b>
            <span>
              Tap <Icon.share size={13} /> Share, then <strong>Add to Home Screen</strong>.
            </span>
          </>
        ) : (
          <>
            <b>Install Glowwww.</b>
            <span>It&rsquo;s a PWA — no app store, and it updates on its own.</span>
          </>
        )}
      </div>

      <div className="installbar__actions">
        {/*
          The bar always offers a way in. Where there's no native prompt the
          button routes to the section for this platform rather than vanishing,
          so the offer is never a dead end.
        */}
        {canPrompt ? (
          <button className="btn btn--primary installbar__btn" type="button" onClick={install} disabled={busy}>
            {busy ? "Installing…" : "Install"}
          </button>
        ) : (
          <Link className="btn btn--primary installbar__btn" to="/#install">
            {platform === "ios" ? "How to install" : "Install"}
          </Link>
        )}

        <button
          className="installbar__close"
          type="button"
          onClick={dismiss}
          aria-label="Dismiss the install prompt"
        >
          <Icon.close size={15} />
        </button>
      </div>
    </aside>
  );
}

export default InstallPrompt;
