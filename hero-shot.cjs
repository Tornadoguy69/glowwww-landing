const { chromium } = require("playwright-core");
const fs = require("node:fs");
const out = "C:/Users/PC/AppData/Local/Temp/glow-hero";
const chrome = "C:/Users/PC/AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe";

(async () => {
  const browser = await chromium.launch({
    executablePath: chrome,
    headless: true,
    args: ["--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await page.addInitScript(() => {
    localStorage.setItem("theme", "light");
    localStorage.setItem("glowwww.install-dismissed", "1");
  });
  await page.goto("http://localhost:5174/", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForSelector(".hero__mark");
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; });
  await page.waitForTimeout(400);
  for (const y of [0, 70, 120, 186]) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(60);
    const box = await page.evaluate(() => {
      const f = document.querySelector(".hero__mark-flight").getBoundingClientRect();
      const t = document.querySelector(".hero__title").getBoundingClientRect();
      const o = document.querySelector(".head .glow-logo__orb").getBoundingClientRect();
      const overlap = !(f.right < t.left || f.left > t.right || f.bottom < t.top || f.top > t.bottom);
      return {
        y: Math.round(window.scrollY),
        flight: [Math.round(f.x), Math.round(f.y), Math.round(f.width), Math.round(f.height)],
        title: [Math.round(t.x), Math.round(t.y), Math.round(t.width), Math.round(t.height)],
        orb: [Math.round(o.x), Math.round(o.y), Math.round(o.width)],
        opacity: getComputedStyle(document.querySelector(".hero__mark-flight")).opacity,
        overlap,
      };
    });
    console.log(JSON.stringify(box));
    await page.screenshot({ path: `${out}/desk-${y}.png` });
  }
  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
