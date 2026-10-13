import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * One title tag for the whole site.
 *
 * The page is a single-page app, so the document title never changes on its own
 * and every route shares the homepage's name. Search results, the browser tab and
 * the share sheet all read from here, so each route sets its own.
 *
 * Kept deliberately small: title plus description, no per-route og: tags.
 */

type Meta = { title: string; description: string };

const SITE_URL = "https://glowwww-page.vercel.app";

const ROUTES: Record<string, Meta> = {
  "/": {
    title: "Glowwww — one app for all of it",
    description:
      "A feed, a real video editor, encrypted messages, and an AI that uses the app for you. Built and run by one person. Free in the browser.",
  },
  "/goal": {
    title: "My goal — Glowwww",
    description:
      "Where this is actually going: software that stops being something you look at. Why humanoids, why Detroit: Become Human started it, and where it ends up.",
  },
  "/blog": {
    title: "Writing — Glowwww",
    description:
      "Notes from building one app alone. What shipped, what broke, and the parts I still don't understand.",
  },
  "/privacy": {
    title: "Privacy — Glowwww",
    description:
      "What is encrypted, what the AI can see, what stays public, and an honest note about how early this still is.",
  },
};

const POST_META: Meta = {
  title: "Writing — Glowwww",
  description:
    "Notes from building one app alone. What shipped, what broke, and the parts I still don't understand.",
};

export function useRouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = ROUTES[pathname] ?? (pathname.startsWith("/blog/") ? POST_META : null);
    if (!meta) return;

    document.title = meta.title;

    const set = (selector: string, attr: string, value: string) => {
      const el = document.head.querySelector<HTMLMetaElement>(selector);
      if (el) el.setAttribute(attr, value);
    };

    set('meta[name="description"]', "content", meta.description);
    set('meta[property="og:title"]', "content", meta.title);
    set('meta[property="og:description"]', "content", meta.description);
    set('meta[property="og:url"]', "content", `${SITE_URL}${pathname}`);
    set('meta[name="twitter:title"]', "content", meta.title);
    set('meta[name="twitter:description"]', "content", meta.description);

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = `${SITE_URL}${pathname}`;
  }, [pathname]);
}