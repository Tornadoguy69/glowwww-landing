import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './launch.css';
import body from './launchBody.html?raw';
import { initLaunch } from './launchScript.js';
import { QuantumLogo } from '../components/QuantumLogo';

/**
 * The Glowwww launch page — the cinematic scroll experience ported from the
 * standalone static build. The body markup is injected verbatim (preserving the
 * hand-tuned design), the imperative scroll/orb/demo logic runs via initLaunch(),
 * and the QuantumLogo React component is mounted into its placeholder inside the
 * injected HTML with its own root. All launch CSS is scoped under `.lp` so it
 * never touches the blog routes.
 */
export function LaunchHome() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const teardown = initLaunch();

    const node = ref.current?.querySelector('#quantumMount') as HTMLElement | null;
    const qRoot = node ? createRoot(node) : null;
    if (qRoot) qRoot.render(<QuantumLogo />);

    return () => {
      if (typeof teardown === 'function') teardown();
      if (qRoot) qRoot.unmount();
    };
  }, []);

  return <div className="lp" ref={ref} dangerouslySetInnerHTML={{ __html: body }} />;
}

export default LaunchHome;
