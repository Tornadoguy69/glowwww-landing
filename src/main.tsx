import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./components/ThemeProvider";
import {
  exposeInstallToWindow,
  initPwaInstallCapture,
  registerServiceWorker,
} from "./pwaInstallCapture";
import "./index.css";

// Capture beforeinstallprompt before React mounts — required for one-tap install.
initPwaInstallCapture();
registerServiceWorker();
exposeInstallToWindow();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
