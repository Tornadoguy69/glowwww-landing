import { useEffect, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import './launch.css';
import './motion-senior.css';
import body from './launchBody.html?raw';
import { initLaunch } from './launchScript.js';
import { initSeniorMotion } from './motion-senior.js';
import { QuantumLogo } from '../components/QuantumLogo';
import { InstallPwaPrompt } from '../components/InstallPwaPrompt';
import { BlogPreviewMount } from '../components/BlogPreviewMount';

/**
 * The Glowwww launch page — the cinematic scroll experience ported from the
 * standalone static build. Markup is injected, imperative demos run via
 * initLaunch(), and React islands mount into placeholders (logo, blog strip).
 */
export function LaunchHome() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const roots: Root[] = [];
    const teardowns: Array<() => void> = [];

    // Mount React islands FIRST so content shows even if 3D/imperative code fails.
    try {
      const qNode = ref.current?.querySelector('#quantumMount') as HTMLElement | null;
      if (qNode) {
        const r = createRoot(qNode);
        r.render(<QuantumLogo />);
        roots.push(r);
      }
    } catch {
      /* 3D logo is decorative — never block the page */
    }

    try {
      const bNode = ref.current?.querySelector('#blogMount') as HTMLElement | null;
      if (bNode) {
        const r = createRoot(bNode);
        r.render(<BlogPreviewMount />);
        roots.push(r);
        // Ensure visible even if parent was empty when scroll-reveal observed it
        bNode.classList.add('blog-mount--ready');
      }
    } catch {
      /* blog fallback link in HTML stays visible */
    }

    try {
      const teardown = initLaunch();
      if (typeof teardown === 'function') teardowns.push(teardown);
    } catch {
      /* imperative demos are progressive enhancement */
    }
    try {
      const teardownSenior = initSeniorMotion();
      if (typeof teardownSenior === 'function') teardowns.push(teardownSenior);
    } catch {
      /* ignore */
    }

    return () => {
      teardowns.forEach((fn) => {
        try {
          fn();
        } catch {
          /* ignore */
        }
      });
      roots.forEach((r) => {
        try {
          r.unmount();
        } catch {
          /* ignore */
        }
      });
    };
  }, []);

  return (
    <>
      <div className="lp" ref={ref} dangerouslySetInnerHTML={{ __html: body }} />
      <InstallPwaPrompt />
    </>
  );
}

export default LaunchHome;
