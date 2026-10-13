import { Component, StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./components/ThemeProvider";
import {
  exposeInstallToWindow,
  initPwaInstallCapture,
  registerServiceWorker,
} from "./pwaInstallCapture";

import "./styles/tokens.css";
import "./styles/site.css";
import "./styles/home.css";
import "./styles/blog.css";

/** A blank page is the worst possible failure mode — say what broke instead. */
class Boundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  render() {
    if (this.state.error) {
      return (
        <main style={{ padding: "48px 24px", fontFamily: "system-ui, sans-serif" }}>
          <h1 style={{ fontSize: 22, marginBottom: 12 }}>Something broke on this page.</h1>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f4ede1",
              padding: 16,
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            {this.state.error.message}
          </pre>
        </main>
      );
    }
    return this.props.children;
  }
}

// Capture beforeinstallprompt before React mounts — required for one-tap install.
initPwaInstallCapture();
registerServiceWorker();
exposeInstallToWindow();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Boundary>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Boundary>
  </StrictMode>
);