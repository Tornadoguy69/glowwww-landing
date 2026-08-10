import sharp from "sharp";
import { writeFileSync } from "fs";
import path from "path";

const OUT = "public/launch/assets/icons";

/** Canonical mark — identical paths to public/favicon.svg */
function logoSvg(px) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 24 24">` +
      `<circle cx="12" cy="12" r="11" fill="#222" stroke="#E53935" stroke-width="2"/>` +
      `<path d="M3 11C6 7 18 7 21 11" stroke="#E53935" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      `<path d="M3 13C6 17 18 17 21 13" stroke="#E53935" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      `<path d="M5 12C8 9 16 9 19 12" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      `</svg>`
  );
}

async function renderIcon(size, filename, { maskable = false } = {}) {
  const pad = maskable ? Math.round(size * 0.12) : 0;
  const inner = size - pad * 2;
  const mark = await sharp(logoSvg(inner)).png().toBuffer();
  const out = path.join(OUT, filename);
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 6, g: 6, b: 7, alpha: 1 },
    },
  })
    .composite([{ input: mark, left: pad, top: pad }])
    .png()
    .toFile(out);
  console.log("wrote", out);
}

await renderIcon(192, "icon-192.png");
await renderIcon(512, "icon-512.png");
await renderIcon(192, "icon-maskable-192.png", { maskable: true });
await renderIcon(512, "icon-maskable-512.png", { maskable: true });
await renderIcon(180, "apple-touch.png");

// Also write a pure transparent-bg PNG mark for embeds
const pure = await sharp(logoSvg(512)).png().toFile(path.join(OUT, "logo-mark-512.png"));
console.log("wrote", path.join(OUT, "logo-mark-512.png"), pure);
