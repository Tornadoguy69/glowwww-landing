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
    const teardown = initLaunch();
    const teardownSenior = initSeniorMotion();
    const roots: Root[] = [];

    const qNode = ref.current?.querySelector('#quantumMount') as HTMLElement | null;
    if (qNode) {
      const r = createRoot(qNode);
      r.render(<QuantumLogo />);
      roots.push(r);
    }

    const bNode = ref.current?.querySelector('#blogMount') as HTMLElement | null;
    if (bNode) {
      const r = createRoot(bNode);
      r.render(<BlogPreviewMount />);
      roots.push(r);
      // Ensure visible even if parent was empty when scroll-reveal observed it
      bNode.classList.add('blog-mount--ready');
    }

    return () => {
      if (typeof teardown === 'function') teardown();
      if (typeof teardownSenior === 'function') teardownSenior();
      roots.forEach((r) => r.unmount());
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
