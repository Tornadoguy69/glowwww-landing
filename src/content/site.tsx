/**
 * Every string on the homepage lives here so the narrative can be edited
 * without touching markup.
 *
 * Voice: first person, specific, unhurried. The person who built it is talking,
 * not a brand team.
 *
 * Editorial rule for this file: if a string doesn't earn its place, it goes.
 * Ten strong sections beat sixteen that each need explaining.
 */

export const APP_URL = "https://glowwww.vercel.app";
export const GITHUB_URL = "https://github.com/Tornadoguy69";
export const AFTERGLOW_URL = "https://afterglow-ecru.vercel.app/site/";

/* Hero strip — the web app only. Phone views live in "The app".
   `ratio` is each asset's real aspect ratio, so the frame never crops it. */
type StripCell = {
  label: string;
  kind: "video" | "image";
  src: string;
  poster?: string;
  alt?: string;
  ratio: number;
};

const HERO_STRIP: StripCell[] = [
  {
    label: "Feed",
    kind: "image",
    src: "/launch/assets/shots/feed2.webp",
    alt: "The Glowwww feed on the web, with the side navigation open",
    ratio: 1.079,
  },
  {
    label: "Editor",
    kind: "video",
    src: "/launch/assets/footage/editor-a.mp4",
    poster: "/launch/assets/shots/editor.webp",
    ratio: 2.038,
  },
  {
    label: "Voice",
    kind: "video",
    src: "/launch/assets/footage/voice_expanded.mp4",
    poster: "/launch/assets/shots/voice-expanded.webp",
    ratio: 2.164,
  },
  {
    label: "Agent",
    kind: "video",
    src: "/launch/assets/footage/agent-youtube.mp4",
    poster: "/launch/assets/shots/agent-mode.webp",
    ratio: 2.043,
  },
];

export type AppFeature = {
  title: string;
  body: string;
  frameUrl?: string;
  shot?: string;
  alt?: string;
  video?: string;
  poster?: string;
  phone?: string;
  /** Intrinsic ratio of `shot`/`video`. Keeps the frame from cropping. */
  ratio?: number;
};

export const SITE = {
  hero: {
    eyebrow: "No download. No invite.",
    title: ["Stay here."],
    titleAccent: "Finish it.",
    lede: (
      <>
        A feed, a real editor, and an AI that clicks for you.
      </>
    ),
    primary: { label: "Open Glowwww", href: APP_URL },
    secondary: { label: "Watch the film", href: "#film" },
    strip: HERO_STRIP,
  },

  /**
   * One statement. This used to explain the product three times over — once in
   * the headline, once in an animation that crossed the features out, and again
   * in four labelled columns. The hero rail and "The app" already show the
   * product, so an explanation of it earns nothing.
   */
  why: {
    eyebrow: "Why",
    title: "I kept starting over.",
    lede: (
      <>
        Every idea went into a new folder, and none of them ever finished. So I stopped
        opening new ones and put them all in here instead.
      </>
    ),
  },

  film: {
    eyebrow: "The film",
    title: "I made you a 70-second tour.",
    lede: (
      <>
        What the app is and where it&rsquo;s going. Cut to music, so leave the
        sound on.
      </>
    ),
    src: "/Glowwww-Make-Room%20(1).mp4",
    poster: "/poster-2.webp",
    durationLabel: "1:10",
    play: "Play the film",
    replay: "Watch again",
    loading: "Loading the film…",
  },

  ai: {
    eyebrow: "The AI",
    title: "Tell it. Watch it do it.",
    lede: (
      <>
        Not a chatbot in another tab. Agent mode opens a real browser inside the
        app, clicks real buttons, screenshots what it sees, and asks before a
        risky click — then checks the screen before it claims success.
        It&rsquo;s early and it still guesses; the check catches most of that.
      </>
    ),
    demo: {
      head: "Agent mode — “can you go to youtube and play some english songs”",
      badge: "Agent mode · live browser",
      log: [
        { step: "understand", icon: "chat", text: "Understand: “can you go to youtube and play some english songs”" },
        { step: "act", icon: "cursor", text: "Act: navigate to YouTube, search “english official music video”" },
        { step: "act", icon: "hand", text: "Act: screenshot results, ask to allow the click, hit play" },
        { step: "check", icon: "check", text: "Check: is it actually playing? 0:49 / 4:30 — yes" },
      ],
      goals: ["1/4", "2/4", "3/4", "4/4"],
      verify: "Playing — YouTube is open and the video is running. Reporting back.",
      replay: "Replay",
      frameUrl: "agent · in-app browser",
      video: "/launch/assets/footage/agent-youtube.mp4",
      poster: "/launch/assets/shots/agent-browser-song.webp",
      ratio: 2.043,
    },
    /* A second, different recording rather than a still of the one above. A
       screenshot of the YouTube demo sitting next to the demo you'd just been
       shown is the same point made twice, and it isn't moving. */
    aside: {
      title: "It works inside the editor where the work is.",
      body: "Draw over the thing you want gone. It detects while you play, so you can hear and see the result before you commit to an export.",
      video: "/launch/assets/footage/editor-b.mp4",
      poster: "/launch/assets/shots/editor-fx.webp",
      frameUrl: "glowwww.app/editor · magic eraser",
      ratio: 2.038,
    },
  },

  app: {
    eyebrow: "The app",
    title: "You make it here. You post it here.",
    lede: (
      <>
        A social app with a real editor inside it. You don&rsquo;t make the video somewhere
        else and upload it here.
      </>
    ),
    features: [
      {
        title: "Your post just shows up.",
        body: "If someone follows you, the post shows up for them. For You is its own tab.",
        frameUrl: "glowwww.app/home",
        shot: "/launch/assets/shots/feed.webp",
        alt: "The Glowwww feed",
        ratio: 1.079,
      },
      {
        title: "Edit the video where you post it.",
        body: "Timeline, captions, effects, vertical clips — then publish. No round trip through a different editor.",
        frameUrl: "glowwww.app/editor",
        video: "/launch/assets/footage/editor-a.mp4",
        poster: "/launch/assets/shots/editor.webp",
        ratio: 2.038,
      },
      {
        title: "Short clips, without the endless scroll.",
        body: "Vertical clips from people you follow, made in the same editor. No separate app, no export round-trip.",
        frameUrl: "glowwww.app/clips",
        shot: "/launch/assets/shots/clips1.webp",
        alt: "Vertical clips open in Glowwww, next to the rest of the app",
        ratio: 1.481,
      },
    ] satisfies AppFeature[],
  },

  privacy: {
    eyebrow: "Privacy",
    title: "I can't read your messages.",
    lede: (
      <>
        End to end. I didn&rsquo;t add a padlock for the screenshot. Here&rsquo;s what&rsquo;s
        private, what isn&rsquo;t, and what&rsquo;s still early.
      </>
    ),
    points: [
      {
        icon: "lock",
        title: "Messages are end-to-end encrypted",
        body: "The server can't read message bodies as plain text. Optional key backup stays under your control, not mine.",
      },
      {
        icon: "spark",
        title: "What the AI can see",
        body: "Whatever you type, the thread you're in, and — in agent mode — what's on your screen. Don't put secrets in AI chat that you wouldn't give any other model.",
      },
      {
        icon: "people",
        title: "Public posts stay public",
        body: "If you publish it, people can see it. That's the product. You can also make your account private so only the people you allow see your profile and posts.",
      },
      {
        icon: "clock",
        title: "It's still early",
        body: "About 79 users. One builder. The agent still makes things up; the verify step cuts that down a lot, it doesn't erase it.",
      },
    ],
    cta: { label: "Read the privacy note", href: "/privacy" },
  },

  install: {
    eyebrow: "Install",
    title: "It lives in your browser till you want the icon.",
    lede: (
      <>
        No app store. It&rsquo;s a PWA — on Android it&rsquo;s usually one tap, on iPhone
        it&rsquo;s Share → Add to Home Screen.
      </>
    ),
    tabs: [
      { id: "ios", label: "iPhone" },
      { id: "android", label: "Android" },
      { id: "desktop", label: "Desktop" },
    ],
    panels: {
      ios: {
        device: "phone",
        steps: [
          { title: "Open Glowwww in Safari", body: "On your iPhone, at glowwww.vercel.app.", shot: 0 },
          { title: "Tap the ··· menu", body: "Bottom-right of the Safari bar.", shot: 0 },
          { title: "Tap Share", body: "In the menu that opens.", shot: 1 },
          { title: "Tap View More", body: "If you don't see “Add to Home Screen” yet.", shot: 2 },
          { title: "Choose “Add to Home Screen”", body: "Keep the name Glowwww, then confirm.", shot: 3, home: true },
        ],
        shots: [
          { src: "/launch/assets/footage/ios-install/iphone-1-open.webp", alt: "Opening Glowwww in Safari on iPhone", ratio: 0.46 },
          { src: "/launch/assets/footage/ios-install/iphone-2-share.webp", alt: "Tapping Share in the Safari menu", ratio: 0.495 },
          { src: "/launch/assets/footage/ios-install/iphone-3-view-more.webp", alt: "Tapping View More in the share sheet", ratio: 1.367 },
          { src: "/launch/assets/footage/ios-install/iphone-4-add-home.webp", alt: "Choosing Add to Home Screen", ratio: 0.495 },
        ],
        homeLabel: "Glowwww",
      },
      android: {
        device: "phone",
        steps: [
          { title: "Open Glowwww in Chrome", body: "At glowwww.vercel.app, on your phone.", shot: 0 },
          { title: "Tap the browser menu", body: "The three dots, top-right.", shot: 0 },
          { title: "Choose “Install app”", body: "Or “Add to Home Screen”.", shot: 0 },
          { title: "Confirm", body: "Tap Install.", shot: 0, home: true },
          { title: "Open it from your app drawer", body: "It runs full screen, with its own icon.", shot: 0 },
        ],
        shots: [{ src: "/launch/assets/shots/mobile-home.webp", alt: "The Glowwww home screen on mobile", ratio: 1.483 }],
        homeLabel: "Glowwww",
      },
      desktop: {
        device: "browser",
        steps: [
          { title: "Open Glowwww in Chrome or Edge", body: "Any browser that supports PWAs.", shot: 0 },
          { title: "Click the install icon", body: "It appears in the address bar.", shot: 0 },
          { title: "Choose “Install”", body: "Confirm the prompt.", shot: 1, home: true },
          { title: "Launch it from your desktop", body: "Its own window, no tabs, no URL bar.", shot: 1 },
        ],
        shots: [
          { src: "/launch/assets/footage/installpwachrome.webp", alt: "The install icon in Chrome's address bar", ratio: 1.142 },
          { src: "/launch/assets/footage/installpwachrome2.webp", alt: "Installing Glowwww from Chrome", ratio: 1.838 },
        ],
        homeLabel: "Glowwww",
      },
    },
  },

  build: {
    eyebrow: "Who built this",
    title: "I built this alone.",
    body: [
      "I'm a college student. I started Glowwww because I had four side projects open at once and none of them were finished, and I was tired of restarting. No funding, no team, no office. Five or six months of evenings.",
      "One person is the whole constraint. It's also the reason the AI isn't a chat tab stuck on the side — with nobody else to hand the work to, the app has to be able to do it.",
    ],
    stats: "One builder · 79 people inside as of this week · no funding · reply to me in the app",
  },

  /**
   * The long game. This is the part that isn't shipping this month — the part
   * that explains why the app is shaped the way it is.
   */
  vision: {
    eyebrow: "Where this is going",
    title: "Eventually, the app gets a body.",
    lede: (
      <>
        Glowwww is the part you can open today. The direction I'm actually building
        toward is bigger than a website, and I want to be straight about that instead
        of hinting at it.
      </>
    ),

    /* The through-line, stated once. */
    thesis: {
      title: "Software stops being something you look at.",
      body: "Everything we call an app right now is a window. You look in, you tap, you type. The window is the whole relationship. I don't think that holds. I think the next version of this is something that shares the room with you.",
    },

    /* Why humanoids specifically, and why this one. */
    humanoid: {
      title: "Why a humanoid and not a chatbot",
      body: (
        <>
          <p>
            A body is the difference between a tool you summon and a presence that's
            just there. You don't ask a person in the room for help — you turn to them,
            and they look up. That glance is the whole product. It's the thing no
            chat window has ever had.
          </p>
          <p>
            Humanoids are the first interface that works in three dimensions, at
            walking speed, with hands that can hold the thing you need. A phone is a
            slot in your hand that takes your attention away from the world. A figure
            standing in the room with you doesn't. It gives your attention back.
          </p>
          <p>
            The face matters more than people expect. It gives intent somewhere to
            land before language arrives. A voice with no face is disembodied; a face
            with no voice is unsettling. You need both, and you need them consistent,
            or the whole thing reads as a mannequin.
          </p>
        </>
      ),
      points: [
        { icon: "hand", title: "It acts on the physical world", body: "Hands open doors, pass tools, hold what you're both looking at." },
        { icon: "eye", title: "It shares attention", body: "Two eyes pointed at one thing is the oldest coordination signal there is." },
        { icon: "people", title: "It has presence, not a session", body: "It doesn't log off. It isn't a screen that goes dark." },
      ],
    },

    /* Detroit: Become Human — named honestly, as the thing that started this. */
    inspiration: {
      label: "Where the idea came from",
      title: "Detroit: Become Human did this to me first.",
      body: (
        <>
          <p>
            I played it and came out of it convinced that the near future isn't a
            smarter phone. It's a person-shaped machine that has to decide what to do
            in a room full of people who need things from it. The game put that
            decision in the player's hands and asked what you do when you can't win
            cleanly. That question is the reason Glowwww exists.
          </p>
          <p>
            The film's android is built from a blueprint that treats servitude as a
            given — and asks whether it should be. That framing stuck with me, because
            it's the same fork we're actually at right now, and nobody's holding the
            question open for long.
          </p>
          <p>
            So I'm building toward a version that isn't servant-shaped. The figure
            in the images below is a working sketch of where I'm going — same ivory
            ceramic and exposed chrome as my own film, but standing next to you
            instead of across from you.
          </p>
        </>
      ),
      credit: "Inspiration, not affiliation. Detroit: Become Human is Quantic Dream's.",
    },

    /* The part that sounds like science fiction and isn't yet. */
    horizon: {
      title: "And then it leaves the planet.",
      body: (
        <>
          <p>
            A figure that can hold itself steady, repair itself, and work without a
            suit of pressurised air around it is not a phone app with legs. It's a
            crew member. Which means the long-term version of Glowwww stops being
            software that talks to people and becomes infrastructure that people are
            taken somewhere by.
          </p>
          <p>
            The honest part: I'm not building a spacecraft. I'm building the layer
            underneath — an assistant with a body, memory that survives the session,
            and judgement good enough to be trusted when there's nobody to double
            check with. Everything else is a vehicle for it.
          </p>
          <p>
            The things I'd want one of these to actually do: stay awake on a
            hundred-hour transit so the crew doesn't have to. Hold a sample steady
            while a person works. Go out ahead and look, then come back and say what
            it saw in plain language. Be the reason a mission isn't one missed detail
            away from a bad day.
          </p>
          <p>
            And the version I'd want most: sit with someone on a long quiet night
            somewhere with no signal, and not need any of this to be true for that to
            be worth having.
          </p>
        </>
      ),
      unknown: {
        title: "What I can't promise",
        body: "None of the long-horizon part is built. Not the hardware, not the flight model, not any of it. What's real today is the app, the agent inside it, and this set of drawings. I'd rather show you the drawings than imply the rest is further along than it is.",
      },
    },

    /* The reel. Images that already have a dedicated slot elsewhere on the page
       (the stage, the hand detail, the build photo) are deliberately not repeated
       here — one image, one place. */
    gallery: [
      { src: "/vision/figure-cafe.jpg", alt: "The figure sitting at a pavement cafe with a mechanical forearm resting on the table" },
      { src: "/vision/figure-lava.jpg", alt: "The figure climbing a rope across a wall of glowing lava" },
      { src: "/vision/figure-steps.jpg", alt: "The figure walking through a crowded open-air market" },
      { src: "/vision/figure-laundromat.jpg", alt: "The figure sitting on a laundromat washing machine in a lit laundromat at night" },
      { src: "/vision/figure-station.jpg", alt: "The figure at a petrol station at night, looking back over its shoulder" },
      { src: "/vision/figure-horizon.jpg", alt: "The figure shading its eyes and looking toward mountains on a salt flat" },
      { src: "/vision/figure-window.jpg", alt: "The figure sitting by a window with its head turned to the light" },
      { src: "/vision/figure-quiet.jpg", alt: "The figure sitting quietly, hands folded" },
      { src: "/vision/figure-street.jpg", alt: "The figure standing on a city street" },
      { src: "/vision/figure-saltflat.jpg", alt: "The figure from behind, walking away across a cracked salt flat" },
      { src: "/vision/figure-walk.jpg", alt: "The figure walking toward the camera across a salt flat, one hand raised to shade its eyes" },
    ],

    wide: { src: "/vision/wide-school.jpg", alt: "One red fish moving through a school of silver fish" },
    shadow: { src: "/vision/wide-shadow.jpg", alt: "A long shadow on pavement with the Glowwww mark at its centre" },
    picnic: { src: "/vision/wide-picnic.jpg", alt: "A group of people sitting in a field at dusk around a transparent figure, one holding a camera" },
    meadow: { src: "/vision/wide-meadow.jpg", alt: "A figure in a flowing translucent cape walking through a sunlit meadow" },
    hillside: { src: "/vision/wide-hillside.jpg", alt: "A figure sitting in long grass above a lake and distant hills" },
    sunset: { src: "/vision/wide-sunset.jpg", alt: "Four people walking home at sunset, long shadows down the road" },
    greenhouse: { src: "/vision/wide-greenhouse.jpg", alt: "A figure standing inside a glasshouse in a forest, sunlight through the panes" },
    running: { src: "/vision/wide-running.jpg", alt: "A figure running through a meadow alongside three people" },
    crossing: { src: "/vision/figure-crossing.jpg", alt: "A figure walking a city crosswalk in low sun, backpack on" },
  },

  roadmap: {
    eyebrow: "Not here yet",
    title: "Calls, rooms, payments — not yet.",
    lede: (
      <>
        One app means they land <em>here</em>, not as four new apps. Video calls,
        audio calls, live rooms, payments.
      </>
    ),
    items: [
      { icon: "video", title: "Video calling", body: "Face to face, in the same app as the encrypted messages." },
      { icon: "mic", title: "Audio calling", body: "Start a call from a thread. No new app, no new number." },
      { icon: "grid", title: "Live rooms", body: "Spaces you can actually drop into. Still being built." },
      { icon: "card", title: "Payments", body: "Tip a creator or split a bill without leaving the app." },
    ],
  },

  writing: {
    eyebrow: "Writing",
    title: "I write about what I ship.",
    lede: "What landed, what broke, what surprised me. Same person who built the thing.",
    cta: { label: "All writing", href: "/blog" },
  },

  open: {
    title: "I left it open for you.",
    lede: (
      <>
        No invite. It works in the browser. Install it later if you want an icon on your
        home screen — or don&rsquo;t, that&rsquo;s fine too.
      </>
    ),
    primary: { label: "Open Glowwww", href: APP_URL },
    sig: ["Built alone by Tornado", "free in your browser", "I read everything you send"],
  },
} as const;