export type BodyItem = string | { type: "image"; src: string; alt?: string } | { type: "video"; src: string; poster?: string };

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  category: "update" | "product" | "company";
  excerpt: string;
  body: BodyItem[];
};


/** Add new posts at the top — newest first */
export const blogPosts: BlogPost[] = [
  {
    slug: "i-built-glowwww-as-a-hobby",
    title: "I built Glowwww as a hobby. I never thought it would become this.",
    date: "2026-06-07",
    category: "product",
    excerpt:
      "No team. No funding. Just code and curiosity — and features that started working in ways that surprised even the person who built them.",
    body: [
      "I built Glowwww as a hobby. I never thought it would become this.",
      "Honestly, when I started building Glowwww I had no idea what it would become. It was just me, my GPU, and a vision of what a social platform should actually feel like.",
      "No team. No funding. Just code and curiosity.",
      "But something happened along the way that I genuinely didn't expect — the features started working. Not just working. Working in ways that surprised even me.",
      "The AI agent mode is what gets me most.",
      "You can literally say to Glowwww — show me the newest post from someone I follow. Like the current post. Go to notifications and mark everything read. Open messages with Sarah and draft a reply — and it does it.",
      "No extra apps. No plugins. No API keys. Just you, your voice, and an AI that actually acts on your behalf inside the platform.",
      "I built this thing and I still open it sometimes and think — how is this working right now.",
      "What's wild is nobody else is doing this.",
      "Not Twitter. Not Instagram. Not any of them.",
      "Every other platform is either adding a chatbot button or integrating someone else's AI as an afterthought.",
      "Glowwww was built AI-native from day one.",
      "The AI isn't a feature. It's the foundation.",
      "Local GPU inference. Voice mode. Tool calls. Artifact canvas. Agent mode that navigates the app for you.",
      "All of it native. All of it real time. All of it yours.",
      "And this is just the beginning.",
      "The direction this is going honestly surprises me every week.",
      "Features I thought would take months to build are working. Things I thought were impossible are shipping.",
      "I think about where this was six months ago and where it is now and the gap is genuinely hard to believe.",
      "Glowwww is not trying to be another social media company.",
      "It's trying to be what social media should have always been. Plus AI as a feature is a huge differentiator in this era.",
      "Privacy first. No algorithm jail. AI that works for you not against you. Real time. Native. Yours.",
      "If you want to see what's possible when one person builds without asking permission — glowwww.vercel.app",
      "No algorithm. Pure signal.",
    ],
  },
  {
    slug: "ai-chat-native-app-tools",
    title: "Glowwww AI Chat now uses native app tools — it acts, not just talks",
    date: "2026-06-04",
    category: "update",
    excerpt:
      "Glowwww AI Chat can now see your screen, open notifications, messages and profiles, mark notifications as read, and verify the app actually updated before saying it's done. It feels like an agent, not a chatbot.",
    body: [
      "Chatbots like ChatGPT, Claude, Gemini, and Grok are amazing — but they live outside the products you actually use. You ask them something, copy the answer, switch apps, and do the work yourself. The AI talks. You act.",
      "Glowwww AI is different because it lives inside the app. And with the latest update, it now uses a set of native app tools that let it actually do things — not just describe them.",
      { type: "video", src: "/ai-native-tools.mp4" },
      "It Can See Your Screen — Glowwww AI can understand what is currently on your screen. If you ask about a post you are looking at, a notification you just received, or a profile you opened, it already has context. No copy-paste. No screenshots. No explaining what you mean.",
      "It Can Open Things For You — Ask it to open your notifications, jump to a message thread, or pull up a profile, and it does it. The AI navigates the app on your behalf, so a conversation can directly result in an action.",
      "It Can Mark Notifications As Read — Tired of a notification badge sitting there? Tell the AI to clear it. It marks notifications as read for you, so triage becomes a single sentence instead of a series of taps.",
      "It Double-Checks Its Own Work — This is the part that makes it feel like a real agent. After the AI performs an action, it verifies that the app state actually changed before reporting success. If something did not update, it tells you instead of pretending it worked. That feedback loop is what separates an agent from a chatbot guessing at outcomes.",
      "Why This Matters — Most AI products are bolted on. You leave the app to talk to the AI, then come back to do the actual work. Glowwww AI is inside the app and has hands. It can read context, take actions, and confirm results — which is the whole point of calling something an agent.",
      "Still Fixing Hallucinations — This is honest work in progress. The AI sometimes hallucinates — claims it did something it did not, misreads what is on screen, or invents details. The double-check step helps catch a lot of it, but not all. Reducing hallucinations is the next thing I am actively working on, because an agent is only useful when you can trust what it tells you.",
      "This is the foundation for a lot more. The same tool system will power deeper actions across posts, clips, messages, the editor, and creator tools. The goal is simple: when you talk to Glowwww AI, it should be able to actually do the thing, not just tell you how to do it.",
    ],
  },
  {
    slug: "glowwww-ai-mention-real-time",
    title: "I beat 𝕏 at its own game — @ai replies in real time on Glowwww",
    date: "2026-05-24",
    category: "update",
    excerpt:
      "Glowwww now supports @ai mentions in comments — just like @grok on 𝕏. But unlike Grok, it works in real time with a mention button so you never have to type @ai manually.",
    body: [
      "Glowwww now has its own @ai mention system — just like @grok on 𝕏/Twitter. You can tag @ai in any comment on any post, and the AI responds instantly in real time. But I didn't just copy the feature — I made it better.",
      { type: "video", src: "/demo.mp4" },
      "The Problem with Grok on 𝕏 — Grok's replies are not real time. You tag @grok, wait, refresh, scroll, and eventually see a response. The flow feels disconnected. The UI doesn't stream the reply live, and there is no inline mention button — you have to manually type @grok every single time.",
      "How Glowwww Does It Differently — When you tag @ai in a comment, the reply streams into the comment thread in real time, character by character, right beneath your comment. You do not need to leave the post, refresh the page, or wait for a delayed response. It feels like the AI is actually part of the conversation, not a separate tool.",
      "The Mention Button — I also added a dedicated mention button inside the comment input itself. Instead of manually typing @ai every time, you just tap the button and @ai is inserted instantly. This removes friction and makes it feel native to the experience.",
      "How It Works Under the Hood — Each post has a comment thread. When a comment containing @ai is submitted, the backend detects the mention, streams the request to the AI model, and pushes the response back into the thread via real-time updates. The frontend receives the streamed tokens and renders them incrementally, creating the live typing effect.",
      "The AI runs on a Gemma-based model fine-tuned for conversational responses. It understands context from the post and the parent comment, so its replies are relevant and not generic. The streaming architecture ensures low latency — replies begin appearing in under a second.",
      "This is just the beginning for AI-powered interactions on Glowwww. The same real-time infrastructure can power AI moderation suggestions, auto-tagging, smart replies, and more. But for now, being able to just @ai in any comment and get an instant, real-time reply puts Glowwww ahead of 𝕏 in the one place that matters most — the UI/UX of actually using the feature.",
    ],
  },
  {
    slug: "inline-video-messages",
    title: "Inline video playback in messages — YouTube links play without leaving Glowwww",
    date: "2026-05-24",
    category: "update",
    excerpt:
      "Glowwww messages now support inline video playback. Send a YouTube link and it plays right inside the chat — no app switching, no opening a browser.",
    body: [
      "Most messaging apps make you leave the conversation to watch a video. You get a link, tap it, it opens YouTube in a browser or another app, and you lose context. Glowwww messages fix this with inline video playback.",
      "When someone sends a YouTube link in a Glowwww message, the video embeds and plays directly inside the chat. You watch it, react, and keep talking — all without leaving the app or breaking the flow of the conversation.",
      { type: "video", src: "/messages-video.mp4" },
      "It works with standard YouTube links and handles the embed seamlessly. The player is lightweight, loads fast, and stays inside the message thread so you never lose your place. Tap to play, watch inline, and continue chatting.",
      "This is part of making Glowwww feel like a complete communication platform — where messages, media, links, and interactions all happen in one place without forcing you to jump between apps.",
    ],
  },
  {
    slug: "built-in-video-editor",
    title: "Most social platforms don't have a built-in video editor. Glowwww does.",
    date: "2026-05-24",
    category: "update",
    excerpt:
      "Glowwww ships with a full video editor — trim, merge, add music, text overlays, speed control, filters, and more. All inside the app, no external tools needed.",
    body: [
      "Most social media sites do not have a proper built-in video editor. You have to record somewhere else, edit in a separate app, export, then upload. It is a fragmented workflow that kills creativity before it starts.",
      "Glowwww fixes that. The platform ships with a full-featured video editor built directly into the app. You can trim, merge clips, adjust speed, add background music, overlay text, apply filters, crop, resize, and export — all without ever leaving Glowwww.",
      "The editor supports multiple tracks, precise timeline controls, frame-by-frame trimming, volume mixing, and real-time preview. Whether you are cutting a short clip, making a montage, or producing longer content, the tools are there and they work.",
      { type: "video", src: "/editor.mp4" },
      "Most social platforms treat video as an afterthought — you upload what you already made elsewhere. Glowwww treats video creation as a first-class experience. The editor is designed to be powerful enough for real content but intuitive enough that anyone can use it without a learning curve.",
      "You can also edit video directly while creating a post — either edit a single selected video, or edit all attached videos at once. No back-and-forth between screens. The editor opens inline, you make your changes, and you are back to posting in seconds. This makes the workflow feel seamless rather than fragmented.",
      { type: "video", src: "/editor-create.mp4" },
      "Carousel handling also got better. When you attach multiple videos or images, the carousel view gives you clear thumbnails, drag-to-reorder, and batch editing controls. You can manage everything from one place without losing context of what you are building.",
      "Video editing is still getting better. I am actively working on more transitions, keyframe animations, layered effects, better export quality, and faster rendering. The goal is to make Glowwww the best place to create and share video — not just scroll through it.",
    ],
  },
  {
    slug: "ai-chat-voice-code-artifacts",
    title: "AI Chat — voice conversations, code, artifacts & live previews",
    date: "2026-05-24",
    category: "update",
    excerpt:
      "Glowwww AI Chat now supports voice conversations, code execution, artifact panels with live previews, a live agent mode with Playwright browser automation, rich markdown, and multiple TTS voices. Video/audio calling and payments are still in progress.",
    body: [
      "Glowwww AI Chat has evolved into a full-featured AI workspace. It is no longer just a text chatbot — it can talk to you, write and run code, render previews inside the chat, and generate artifacts that feel like mini apps.",
      "Voice Mode — The AI can now hold voice conversations with better TTS quality and multiple voice options to choose from. Whether you want a natural conversation, a hands-free coding session, or just to hear responses out loud, the voice system is designed to feel fluid and less robotic.",
      { type: "video", src: "/ai-voice-demo.mp4" },
      "Code & Artifacts — AI Chat can write code, create interactive artifact panels, and render live previews directly inside the conversation. You can ask it to build a UI component, generate a data visualization, write a utility function, or prototype an idea — and see the result update in real time without leaving the chat.",
      "Live Preview & Execution — The AI can run code and display the output, making it useful for debugging, testing logic, or exploring how something works. Combined with artifact panels, this turns the chat into a development sandbox as much as a conversation.",
      { type: "video", src: "/ai_canvas.mp4" },
      "Live Agent Mode — The AI can now act as an autonomous agent that uses Playwright to drive a real browser. You can ask it to navigate websites, fill forms, scrape data, take screenshots, or perform multi-step web tasks — all streamed live into the chat so you watch every action as it happens. The agent thinks, plans, and executes in real time, showing you exactly what the browser is doing at each step.",
      { type: "video", src: "/ai_agent.mp4" },
      "Better Markdown Rendering — Chat responses now render rich markdown with proper syntax highlighting, tables, formatted lists, math expressions, and clean code blocks. Reading technical responses is clearer and more structured.",
      "Retry & Regenerate — You can retry the same prompt multiple times and explore different responses from the AI. This is useful when you want a different approach, a better explanation, or a revised version of generated code or content.",
      "Multiple TTS Voices — The voice system supports multiple voices with improved TTS quality. You can switch between voices to find what feels most natural for the conversation.",
      "I am still working on video calling, audio calling, and payments — these features are in development and will arrive in a future update. The goal is to make Glowwww a complete everything app where communication, creation, and AI all work together seamlessly.",
    ],
  },
  {
    slug: "introduction-tornado-founder",
    title: "I am Tornado — the guy building Glowwww",
    date: "2026-05-22",
    category: "company",
    excerpt:
      "A personal introduction from Tornado, the college student building Glowwww from scratch as an AI-native everything app.",
    body: [
      "I am Tornado — also known as the guy building Glowwww from scratch. Glowwww is not something I copied, bought, or generated overnight. It is something I built piece by piece through months of non-stop work, learning, testing, breaking, rebuilding, and improving.",
      "I started Glowwww as a college student with a simple frustration: social media does not feel alive anymore. You post, but nobody sees it. You create, but the algorithm decides if you matter. You scroll endlessly, but most of what you see feels unnecessary, repetitive, artificial, or designed only to keep you trapped.",
      "I wanted to build something different. A social platform where people can post, chat, create, edit, use AI, share clips, build communities, and actually feel present. Not just another app with a feed — an AI-native everything app.",
      "For 5–6 months, I focused on developing Glowwww almost every day using free AI models, open tools, and whatever resources I had. It started simple, but over time it became better: real-time posts, clips, messaging, media tools, AI Chat, voice mode, communities, moderation, and a full PWA experience.",
      "Glowwww AI Chat was first powered by models like Qwen, and now it continues evolving with Gemma-based intelligence powering more of the experience, including voice mode and creative assistance.",
      "Glowwww is still growing. Every update makes it smoother, smarter, and more powerful. This blog is where I will share the journey — what I built, why I built it, what changed, what failed, and how Glowwww keeps becoming better.",
      "This is not just a product update page. This is the story of building something ambitious from zero."
    ],
  },
  {
    slug: "glowwww-v1-launch",
    title: "Glowwww v1.0 — built from scratch, not from hype",
    date: "2026-05-20",
    category: "update",
    excerpt:
      "After 5–6 months of non-stop development as a college student, Glowwww v1.0 is live — a social platform, AI-native workspace, editor, messaging app, and everything app built from scratch.",
    body: [
      "Glowwww started as an idea and slowly became something real through months of non-stop building. As a college student, I spent almost 5–6 months focused on developing it from scratch, learning, breaking things, fixing them, and improving the platform every single day.",
      "I did not start with a big team, huge funding, or expensive infrastructure. I built Glowwww with persistence, free AI models, open tools, late nights, and a belief that social media could feel different. Every feature came from testing, failing, redesigning, and making the product better over time.",
      "v1.0 brings together real-time posts, clips, messaging, media tools, an image and video editor, communities, moderation, and an AI-native chat experience. Glowwww is not just another feed. It is designed to become an everything app where people can create, communicate, edit, share, and use AI in one place.",
      "Glowwww AI Chat started with free AI models like Qwen and later evolved with Gemma powering more of the experience, including voice mode and intelligent tools. The goal is simple: AI should not feel like a separate feature. It should feel naturally built into the platform.",
      "This launch is only the beginning. Glowwww will continue to get better with stronger AI tools, better editing, smoother design, more creative features, and a social experience that actually feels alive.",
    ],
  },
  {
    slug: "how-glowwww-keeps-getting-better",
    title: "How Glowwww keeps getting better",
    date: "2026-05-18",
    category: "product",
    excerpt:
      "Glowwww was not built in one perfect version. It improved through months of iteration, testing, rebuilding, and pushing every feature forward.",
    body: [
      "Glowwww keeps getting better because it was built through continuous iteration. Every version exposed something new — a design problem, a performance issue, a missing feature, or a better way to make the experience smoother.",
      "Over time, the platform evolved from a basic idea into a working product with real-time posts, clips, encrypted messaging, AI Chat, media editing, communities, moderation, and PWA support for mobile and desktop.",
      "The AI system also improved over time. Glowwww AI Chat was first powered by free models like Qwen, and later moved toward Gemma-based experiences for stronger responses, better reasoning, and voice mode support.",
      "The goal is to make Glowwww feel more advanced with every update: better video tools, better image editing, better AI assistance, better discovery, better design, and better ways for people to actually be seen.",
      "Glowwww is still growing, but that is the point. It is not a finished idea frozen in time. It is a platform that keeps learning, improving, and becoming more powerful with every build.",
    ],
  },
  {
    slug: "why-we-built-glowwww",
    title: "Why I built Glowwww",
    date: "2026-05-10",
    category: "company",
    excerpt:
      "X, Instagram, Snapchat, and Facebook started feeling broken — endless doomscrolling, invisible posts, unnecessary content, and no real creative freedom. Glowwww was built as an answer.",
    body: [
      "I built Glowwww because the current social media experience feels broken. On 𝕏, Instagram, Snapchat, Facebook, and many other platforms, it often feels like your posts disappear unless the algorithm decides you deserve attention.",
      "People create real things, share real thoughts, and still barely get seen. Feeds are overloaded with unnecessary content, recycled trends, engagement farming, and doomscrolling loops that make users consume more but feel less connected.",
      "The dead internet theory also started feeling more real every day. So much of the internet feels automated, repetitive, artificial, or optimized only for attention. I wanted Glowwww to feel more human, more creative, and more personal.",
      "Another problem was that most social platforms still do not give creators enough powerful tools inside the app. You have to create somewhere else, edit somewhere else, post somewhere else, and then hope someone sees it. Glowwww is built to reduce that gap.",
      "Glowwww is my attempt to build an AI-native everything app — a place where posting, clips, messaging, editing, voice AI, creative tools, and communities can live together. Not just a social feed, but a full creative platform.",
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAdjacentPosts(slug: string) {
  const idx = blogPosts.findIndex((p) => p.slug === slug);
  return {
    prev: idx > 0 ? blogPosts[idx - 1] : null,
    next: idx < blogPosts.length - 1 ? blogPosts[idx + 1] : null,
  };
}

export function formatDate(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
