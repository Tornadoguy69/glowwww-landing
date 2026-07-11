# Glowwww — Company Site

Official marketing site and blog for [Glowwww](https://glowwww.vercel.app).

## Sections (homepage)

Editorial brutalist landing, cut to essentials:

1. **Hero** — Delete four. Keep one.
2. **Thesis** — Trade metaphor + four pillars (Social · Create · AI · Private)
3. **Product** — Room switcher + app screenshots / video
4. **Manifesto** — Belief lines + six key features
5. **Install** — PWA steps by platform
6. **CTA** — Enter the app

Also: nav, scroll signal bar, sticky CTA, footer. Light/dark theme.

## Blog (`/blog`)

Product updates, company news, launch notes.

### Add a blog post

Edit `src/content/posts.ts` and add an entry at the **top** of the `blogPosts` array:

```ts
{
  slug: "my-new-post",
  title: "Your headline",
  date: "2025-05-23",
  category: "update", // update | product | company
  excerpt: "Short summary for cards and SEO.",
  body: [
    "First paragraph.",
    "Second paragraph.",
  ],
},
```

Rebuild or refresh dev — the post appears on `/blog`.

## App screenshots (`public/`)

| File | Section |
|------|---------|
| `feed.png` | Social |
| `clips.png` | Social |
| `explore.png` | Social |
| `create.png` | Create |
| `editorv.png` | Create |
| `dashboard.png` | Create |
| `ai.png` | AI |
| `ai_voice.png` | AI |
| `aimention.png` | AI |
| `messages.png` | Private |
| `profile.png` | Private |
| `notifications.png` | Private |

Paths are configured in `src/content/pillars.ts` and `src/content/signalLab.ts`.

## Develop

```bash
npm install
npm run dev
```

## Deploy (Vercel)

Framework: **Vite** · Output: `dist`
