/* Minimal service worker — required for installability (Add to Home Screen / one-tap install).
   Network-first pass-through; does not offline-cache large media. */
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
