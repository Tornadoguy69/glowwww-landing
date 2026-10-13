# Glowwww — Company Site

Marketing site and blog for [Glowwww](https://glowwww.vercel.app).

Vite + React + TypeScript. Warm paper-and-ink design system; the brand red is an
accent, not a background.

## The design principle

**Less, but better.** Subtraction is the method: a string, a component or a token
that doesn't earn its place gets cut rather than restyled.

Concretely, that means:

- **One continuous paper field.** No alternating background bands. Structure
  comes from whitespace and type scale, not from flipping the page colour.
- **Exactly one dark moment**, at the very end, where the ask lives.
- **One motion idea.** Content rises once, quietly. No parallax, no magnetic
  buttons, no auto-playing rails, no counters, no scroll-spy, no progress bar.
  The only entrance animation is the hero's line rise.
- **Two button styles**, primary and text-link. Nothing else.
- **No decorative chrome** — no chips, pills, badges, stat tiles, cards or icons
  that aren't carrying information.

Every one of those existed at some point during the build and was removed.

## Design system

Four stylesheets, imported in `src/main.tsx`:

| File | Scope |
|------|-------|
| `src/styles/tokens.css` | Fonts, palette, type scale, spacing, reset, primitives |
| `src/styles/site.css` | Header, drawer, footer |
| `src/styles/home.css` | Homepage sections |
| `src/styles/blog.css` | Blog index, post reader, privacy note, 404 |

Type: **Fraunces** (display), **Karla** (UI), **Newsreader** (long-form) — all
self-hosted variable fonts in `public/fonts`.

Light is the default. Dark is the same palette on a charcoal ground, not a second
design. The choice persists to `localStorage.theme`.

## Structure

```
src/
  content/
    site.tsx     every string on the homepage — edit copy here, not in markup
    posts.ts     blog posts
  components/
    site/        Layout (nav + footer), Kit (primitives + icons),
                 Motion (the one animation), Rail, LazyVideo, InstallPrompt,
                 RouteMeta
    home/        one component per section
  pages/         GoalPage, BlogPage, BlogPostPage, PrivacyPage, NotFound
```

## Sections

Hero · Why · Film · The AI · The app · Privacy · Install · Build ·
Roadmap · Writing · Finale.

The vision material lives on its own page at `/goal`, not on the homepage. The
product page has one job; mixing in what isn't shipping yet made both weaker.

## Install prompt

`src/components/site/InstallPrompt.tsx` is a fixed bar that appears once the
reader is ~55% down the page. Two deliberate choices:

- **Not a modal.** The page is what is being sold, so nothing covers it. The bar
  floats and the footer reserves space so links are never hidden behind it.
- **It doesn't pretend.** iOS has no one-tap install API, so the bar names the
  two taps required instead of rendering a button that does nothing. Where
  `beforeinstallprompt` has not fired, the button routes to `#install` rather
  than vanishing.

Dismissal is stored in `localStorage` under `glowwww.install-dismissed`. The bar
never renders when the app is already running standalone.

## Motion

`src/components/site/Motion.tsx` holds two components:

| Component | What it does |
|-----------|--------------|
| `RiseLines` | Lines rise out of an overflow mask, once, on load. Lines are authored, not measured — no reflow. Reserved for the hero |
| `Fade` / `FadeList` | A single quiet fade-up on entry. No stagger, so it reads as a rule rather than a performance |

Both collapse to their final state under `prefers-reduced-motion`.

`useInView` is not gated on `IntersectionObserver` alone: it also checks the
element's rect on mount and on scroll, plus a watchdog, so a throttled or
unavailable `IntersectionObserver` (background tabs, in-app browsers,
prerenderers) can never leave content stuck at `opacity: 0`.

## Rails

`src/components/site/Rail.tsx` is the horizontal scroller behind the hero strip.
It's a real scroll container at every width, with fading edges, pointer drag and
keyboard arrows. It does not move on its own — motion you didn't ask for is just
noise.

## Blog (`/blog`)

Add a post to the top of the `blogPosts` array in `src/content/posts.ts`:

```ts
{
  slug: "my-new-post",
  title: "Your headline",
  date: "2025-05-23",
  category: "update", // update | product | company
  excerpt: "Short summary for cards and SEO.",
  body: ["First paragraph."],
}
```

Body items can also be `{ type: "image", src, alt }` or
`{ type: "video", src, poster }`.

## Media

**Every image the page loads is WebP.** The original PNG/JPGs remain on disk as
master copies but nothing references them — safe to prune for ~40 MB off the
deploy.

| Path | Used by |
|------|---------|
| `/Glowwww-Make-Room (1).mp4` | The film, with `poster-2.webp` as its poster |
| `/launch/assets/shots/*.webp` | App screenshots |
| `/launch/assets/footage/*.mp4` | Editor, voice, agent demos |
| `/vision/*.jpg` | Concept stills, used on `/goal` and the homepage |

The film is a 4K / 70-second / ~50 MB MP4, so it is fetched **only** when the
visitor presses play — `preload="none"` until the section is near, then
`preload="metadata"` so the scrub bar knows the duration. Re-encoding to 1080p
H.264 would cut that by roughly 80%.

The hero strip is the **web** app only (feed · editor · voice · agent). Phone
views live in "The app", where clips uses a device frame.

Legacy assets from the previous build — the billboard set, the 12 film stills,
the Ava voice-over MP3s, and the `campaign/` photography folder — were removed.
Nothing referenced them and they cost ~50 MB on the deploy.

## Develop

```bash
npm install
npm run dev
```

## Deploy (Vercel)

Framework: **Vite** · Output: `dist` · SPA rewrite is in `vercel.json`.