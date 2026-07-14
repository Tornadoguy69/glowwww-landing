import { createOrb } from './orb.js';

export function initLaunch() {
  let __alive = true;

  const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const lerp = (a, b, t) => a + (b - a) * t;

/* ============================================================
   3D ORB — persistent, travels through the page
   ============================================================ */
const canvas = $('#orbCanvas');
const orbStage = $('#orb-stage');
const orbHalo = $('#orbHalo');
const orb = createOrb(canvas);
const ORB_PX = 360;               // backing resolution
const ORB_SCALE = 0.30;           // ~110px on screen — small, UFO-sized
orb.resize(ORB_PX, ORB_PX);
orbStage.style.width = ORB_PX + 'px';
orbStage.style.height = ORB_PX + 'px';
orbStage.style.left = '0'; orbStage.style.top = '0';
orbStage.style.transformOrigin = 'center';
window.addEventListener('resize', () => orb.resize(ORB_PX, ORB_PX));

// visibility of an element around viewport center (0..1)
function centerVis(el) {
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  if (r.bottom < 0 || r.top > vh) return 0;
  const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
  return clamp01(visible / Math.min(r.height, vh));
}

const agentSection = $('#agentpanel')?.closest('.section');
// sections that use AI features → the orb wears its agent eyes over these
const aiEyeSections = ['#aiworkMount', '#voiceDemo', '#toolflow', '#artifactDemo', '#mentionSeq', '#agentpanel', '#studio']
  .map(s => $(s)?.closest('.section')).filter(Boolean);
const aiVis = () => aiEyeSections.reduce((m, el) => Math.max(m, centerVis(el)), 0);

/* ---- UFO flight: a small orb rings the frame, cloaking over content ----
   - superellipse path hugs the viewport edges & corners
   - travels the safe top/bottom padding gaps on screen; dives mostly
     OFF-screen on the left/right passes (only a glowing sliver shows)
   - opacity auto-fades to near-zero if it ever crosses the central
     content band, so it never sits on words
   - a lagging halo gives it a comet trail                                  */
const ssin = (v, p) => Math.sign(v) * Math.pow(Math.abs(v), p);
let phase = Math.PI * 0.5;   // start entering along the top
let lastT = performance.now();
let haloX = 50, haloY = 50, curOp = 0, curMorph = 0;
let lastSY = window.scrollY, orbRoll = 0, orbVel = 0;

function orbFlight() {
  if (!__alive) return;
  const now = performance.now();
  let dt = (now - lastT) / 1000; lastT = now; if (dt > 0.05) dt = 0.05;
  const t = now / 1000;
  const enabled = window.innerWidth >= 880;   // no room to fly on mobile

  // scroll velocity → the orb tumbles/leans as you scroll, and unwinds
  // upright when you stop. Fast scrolling energises it (brighter, livelier).
  const sy = window.scrollY;
  const dsy = sy - lastSY; lastSY = sy;
  orbVel = orbVel * 0.85 + dsy * 0.15;
  orbRoll = (orbRoll + dsy * 0.06) * 0.95;

  // scroll-driven orbit: the orb sweeps around the frame as you scroll the
  // page and settles into a gap when you stop (a slow idle drift keeps it
  // alive). Not a mindless constant circle — it responds to your scroll.
  phase = 0.6 + window.scrollY * 0.0042 + t * 0.12;
  // Compound, non-repeating flight — NOT a fixed circle. Two incommensurate
  // drifts phase-shift the vertical and breathe the amplitudes, so the path
  // precesses and morphs (ellipse → figure-8 → back) and never repeats. A
  // secondary lobe adds a lazy inward loop now and then. Still frame-hugging,
  // so the safe-zone cloak keeps it off the words.
  const wander = Math.sin(t * 0.37) * 0.95 + Math.sin(t * 0.19 + 1.3) * 0.55;
  const lobe = Math.sin(t * 0.11 + 2.1);              // slow shape morph
  const ampX = 58 + Math.cos(t * 0.17) * 7;
  const ampY = 41 + Math.sin(t * 0.23) * 9;
  const expo = 0.58 + Math.max(0, lobe) * 0.18;        // rounder ↔ squarer path
  let ox = 50 + ampX * ssin(Math.cos(phase), expo) + Math.sin(t * 2.4) * 1.5;
  let oy = 50 + ampY * ssin(Math.sin(phase + wander), expo) + Math.cos(t * 1.9) * 1.2;

  // cloak: only visible in genuinely safe zones — the top/bottom padding
  // gaps, or when diving mostly off the far left/right edges. Everywhere
  // else (content height, on-screen) it fades out, so it never sits on words.
  const safe = oy > 12 && (oy < 19 || oy > 82 || ox < 4 || ox > 96);
  let targetOp = !enabled ? 0 : safe ? 0.94 : 0.06;

  // agent "eyes" whenever an AI-feature section holds the viewport.
  // must reach a FULL 1.0 so the arcs collapse completely (a partial morph
  // leaves red arc stubs between the eyes).
  const av = aiVis();
  const targetMorph = av > 0.4 ? 1 : 0;

  curOp += (targetOp - curOp) * 0.09;
  curMorph += (targetMorph - curMorph) * 0.06;
  orb.state.morph = curMorph;
  orb.state.running = av > 0.4;
  orb.state.speaking = Math.min(1, (av > 0.4 ? 0.45 : 0.14) + Math.abs(orbVel) / 45);
  orb.state.level = Math.min(1, Math.abs(orbVel) / 60);

  orbStage.style.transform =
    `translate(calc(${ox}vw - 50%), calc(${oy}vh - 50%)) scale(${ORB_SCALE}) rotate(${orbRoll.toFixed(1)}deg)`;
  orbStage.style.opacity = curOp.toFixed(3);

  // comet-trail halo (lags behind the orb)
  haloX += (ox - haloX) * 0.16; haloY += (oy - haloY) * 0.16;
  const hs = ORB_PX * ORB_SCALE * 1.9;
  orbHalo.style.width = hs + 'px'; orbHalo.style.height = hs + 'px';
  orbHalo.style.left = '0'; orbHalo.style.top = '0';
  orbHalo.style.transform = `translate(calc(${haloX}vw - 50%), calc(${haloY}vh - 50%))`;
  orbHalo.style.opacity = (curOp * 0.5).toFixed(3);

  requestAnimationFrame(orbFlight);
}
requestAnimationFrame(orbFlight);

/* ============================================================
   Nav + scroll progress
   ============================================================ */
const nav = $('#nav');
const prog = $('#prog');
let lastNavY = window.scrollY;
function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 40);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  prog.style.width = (clamp01(y / h) * 100) + '%';
  // hide on scroll down (past the hero), reveal on any scroll up or near top
  if (y > 160 && y > lastNavY + 3) nav.classList.add('nav--hidden');
  else if (y < lastNavY - 3 || y < 160) nav.classList.remove('nav--hidden');
  lastNavY = y;
}
window.addEventListener('scroll', onScroll, { passive: true });
// reveal when the cursor hovers the very top of the screen
const onMove = (e) => { if (e.clientY < 72) nav.classList.remove('nav--hidden'); };
window.addEventListener('mousemove', onMove, { passive: true });
onScroll();

/* ---- light / dark theme toggle (scoped to the launch page root) ---- */
const lpRoot = document.querySelector('.lp');
const themeBtn = $('#themeToggle');
const applyTheme = (light) => {
  if (lpRoot) lpRoot.classList.toggle('lp--light', light);
  try {
    localStorage.setItem('lp-theme', light ? 'light' : 'dark');
    localStorage.setItem('theme', light ? 'light' : 'dark');
  } catch (e) { /* ignore */ }
  try { window.dispatchEvent(new Event('lp-theme-change')); } catch (e) { /* ignore */ }
};
try { applyTheme(localStorage.getItem('lp-theme') === 'light'); } catch (e) { /* ignore */ }
// bind exactly once (survives StrictMode's double effect on the same DOM node);
// reads the live class each click so it can never net-cancel itself.
if (themeBtn && !themeBtn.dataset.bound) {
  themeBtn.dataset.bound = '1';
  themeBtn.addEventListener('click', () => {
    const light = !lpRoot.classList.contains('lp--light');
    applyTheme(light);
  });
}

/* ============================================================
   Hero intro — flash + mark
   ============================================================ */
const heroIntro = () => {
  const flash = $('#heroFlash');
  if (!flash) return;
  flash.animate(
    [{ opacity: 0 }, { opacity: .85, offset: .12 }, { opacity: 0 }],
    { duration: 620, easing: 'ease-out' }
  );
  const mark = $('#heroMark');
  setTimeout(() => mark.animate(
    [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'none' }],
    { duration: 900, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' }
  ), 180);
  // reveal hero copy
  $$('.hero .reveal').forEach(e => e.classList.add('in'));
};
if (document.readyState === 'complete') heroIntro();
else window.addEventListener('load', heroIntro);

/* ============================================================
   Reveal-on-scroll
   ============================================================ */
const revObs = new IntersectionObserver((ents) => {
  ents.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
$$('.reveal').forEach(e => revObs.observe(e));

$$('.interstitial').forEach(el => {
  new IntersectionObserver((ents) => {
    ents.forEach(e => e.target.classList.toggle('in', e.isIntersecting));
  }, { threshold: 0.2 }).observe(el);
});

/* ============================================================
   One-shot section triggers
   ============================================================ */
function once(el, fn, threshold = 0.3) {
  if (!el) return;
  let done = false;
  new IntersectionObserver((ents, obs) => {
    ents.forEach(e => {
      if (e.isIntersecting && !done) { done = true; fn(); obs.disconnect(); }
    });
  }, { threshold }).observe(el);
}

/* ---- real-time live post drops in ---- */
once($('#livepost'), () => setTimeout(() => $('#livepost').classList.add('show'), 500));

/* ---- AI Chat: stream code, then run → live render ---- */
const CODE = [
  ['c', '<!-- weekly engagement · dark -->'],
  ['t', '<html><body style="margin:0;background:#0b0b0e;\n'],
  ['t', '  font-family:Poppins,sans-serif;color:#f1f1f2">'],
  ['t', '<div style="padding:22px">'],
  ['a', '  <h2 style="margin:0 0 4px">This week</h2>'],
  ['a', '  <div style="color:#a2a2a8;font-size:13px">engagement · live</div>'],
  ['k', '  <div id="bars" style="display:flex;gap:10px;'],
  ['k', '       align-items:flex-end;height:180px;margin-top:20px"></div>'],
  ['a', '  <div id="count" style="font-size:40px;font-weight:700;'],
  ['a', '       margin-top:14px">0</div>'],
  ['s', '  <script>const d=[42,60,55,78,70,92,100];'],
  ['s', '  d.forEach((v,i)=>{const b=document.createElement("i");'],
  ['s', '  b.style.cssText=`flex:1;background:linear-gradient(#ef4444,'],
  ['s', '  rgba(239,68,68,.25));border-radius:6px 6px 0 0;height:0;'],
  ['s', '  transition:height .8s cubic-bezier(.16,1,.3,1) ${i*.09}s`;'],
  ['s', '  bars.appendChild(b);requestAnimationFrame(()=>b.style.height=v+"%")});'],
  ['s', '  let n=0;const t=setInterval(()=>{n+=310;count.textContent='],
  ['s', '  n.toLocaleString();if(n>=12400){count.textContent="12,400";'],
  ['s', '  clearInterval(t)}},24);<\/script>'],
  ['t', '</div></body></html>'],
];
const RENDER_HTML = `<html><body style="margin:0;background:#0b0b0e;font-family:Poppins,system-ui,sans-serif;color:#f1f1f2">
<div style="padding:22px">
<h2 style="margin:0 0 4px">This week</h2>
<div style="color:#a2a2a8;font-size:13px">engagement · live</div>
<div id="bars" style="display:flex;gap:10px;align-items:flex-end;height:180px;margin-top:20px"></div>
<div id="count" style="font-size:40px;font-weight:700;margin-top:14px">0</div>
</div>
<script>const d=[42,60,55,78,70,92,100];d.forEach((v,i)=>{const b=document.createElement('i');b.style.cssText='flex:1;background:linear-gradient(#ef4444,rgba(239,68,68,.25));border-radius:6px 6px 0 0;height:0;transition:height .8s cubic-bezier(.16,1,.3,1) '+(i*0.09)+'s';bars.appendChild(b);requestAnimationFrame(()=>b.style.height=v+'%')});let n=0;const t=setInterval(()=>{n+=310;count.textContent=n.toLocaleString();if(n>=12400){count.textContent='12,400';clearInterval(t)}},24);<\/script>
</body></html>`;

function runAIWork() {
  const promptText = 'Build a live dashboard of my weekly engagement — bar chart, dark theme.';
  const echo = $('#promptEcho'), pane = $('#codePane'), runBtn = $('#runBtn'), frame = $('#previewFrame'), prevLive = $('#prevLive');
  // type prompt
  let pi = 0;
  const typeP = setInterval(() => {
    echo.textContent = promptText.slice(0, ++pi);
    if (pi >= promptText.length) { clearInterval(typeP); streamCode(); }
  }, 22);

  function streamCode() {
    let li = 0;
    const cursor = '<span class="cursor"></span>';
    (function nextLine() {
      if (li >= CODE.length) {
        pane.innerHTML = pane.innerHTML.replace(cursor, '');
        setTimeout(run, 500);
        return;
      }
      const [cls, text] = CODE[li];
      let ci = 0;
      const html = pane.innerHTML.replace(cursor, '');
      const step = setInterval(() => {
        ci += 2;
        const shown = text.slice(0, ci)
          .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        pane.innerHTML = html + `<span class="${cls}">${shown}</span>` + cursor;
        pane.scrollTop = pane.scrollHeight;
        if (ci >= text.length) {
          clearInterval(step);
          pane.innerHTML = html + `<span class="${cls}">${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>\n` + cursor;
          li++; setTimeout(nextLine, 60);
        }
      }, 9);
    })();
  }
  function run() {
    runBtn.textContent = '▶ Running…';
    prevLive.classList.add('on');
    setTimeout(() => {
      frame.srcdoc = RENDER_HTML;
      runBtn.textContent = '✓ Ran'; runBtn.classList.add('done');
      setTimeout(() => prevLive.classList.remove('on'), 2600);
    }, 320);
  }
  runBtn.addEventListener('click', () => { frame.srcdoc = RENDER_HTML; });
}
once($('#aiworkMount'), runAIWork, 0.35);

/* ---- tool-call timeline ---- */
once($('#toolflow'), () => {
  const steps = $$('#toolflow .toolstep');
  let i = 0;
  const tick = () => {
    if (i > 0) { steps[i - 1].classList.remove('on'); steps[i - 1].classList.add('done'); }
    if (i < steps.length) { steps[i].classList.add('on'); i++; setTimeout(tick, 820); }
  };
  tick();
});

/* ---- frame-sequence player: real app recordings (JPG frames + manifest) ---- */
async function playRecording(imgEl, names, { speed = 1, gap = 600 } = {}) {
  if (!imgEl) return;
  const base = '/recordings/';
  const segs = []; let offset = 0;
  for (const n of names) {
    try {
      const m = await fetch(base + n + '/manifest.json').then(r => r.json());
      const frames = m.frames.map(f => ({ src: base + n + '/' + f.file, t: f.t }));
      if (!frames.length) continue;
      const dur = m.durationMs || (frames[frames.length - 1].t + 300);
      segs.push({ frames, start: offset, dur });
      offset += dur + gap;
      frames.forEach(f => { const im = new Image(); im.src = f.src; }); // preload
    } catch (e) { /* ignore */ }
  }
  if (!segs.length) return;
  const total = offset, t0 = performance.now();
  (function tick() {
    if (!__alive) return;
    const elapsed = ((performance.now() - t0) * speed) % total;
    let seg = segs[0];
    for (const s of segs) if (elapsed >= s.start && elapsed < s.start + s.dur) { seg = s; break; }
    const local = Math.max(0, elapsed - seg.start);
    let fr = seg.frames[0];
    for (const f of seg.frames) { if (f.t <= local) fr = f; else break; }
    if (imgEl.getAttribute('src') !== fr.src) imgEl.setAttribute('src', fr.src);
    requestAnimationFrame(tick);
  })();
}
// @ai mention → asks, streams a reply, then a follow-up (two real recordings)
once($('#mentionSeq'), () => playRecording($('#mentionSeq'), ['02-comment-ai-mention', '03-comment-reply-followup']), 0.2);

/* ---- Agent Mode verification sequence ---- */
once(agentSection, () => {
  const lis = $$('#agentlog .li');
  const bar = $('#agentBar'), gGoal = $('#gGoal'), gAct = $('#gAct'), gVer = $('#gVer'), verify = $('#agentVerify');
  const goals = ['1/3', '2/3', '3/3', '3/3'];
  let i = 0;
  const step = () => {
    if (i < lis.length) {
      lis[i].classList.add('on');
      setTimeout(() => {
        lis[i].classList.add('ok');
        lis[i].querySelector('.ck').textContent = '✓';
        gGoal.textContent = goals[i];
        gAct.textContent = String(i + 1);
        bar.style.width = ((i + 1) / lis.length * 100) + '%';
        i++;
        setTimeout(step, 520);
      }, 620);
    } else {
      gVer.textContent = 'Complete';
      verify.classList.add('on');
    }
  };
  setTimeout(step, 400);
}, 0.28);

/* ---- studio + moderation bars ---- */
$$('.studio').forEach(s => once(s, () => {
  $$('.metric .bar i', s).forEach(i => i.style.width = i.dataset.w);
}, 0.3));

/* ---- dashboard bars ---- */
once($('#dashbars'), () => {
  $$('#dashbars i').forEach(i => i.style.height = i.dataset.h);
});

/* ---- encrypted messaging → real recording (tornadog typing) ---- */
once($('#msgSeq'), () => playRecording($('#msgSeq'), ['06-message-tornadog-typing']), 0.2);

/* ---- PWA desktop: alternate the real Chrome install screenshots ---- */
once($('#pwaChrome'), () => {
  const img = $('#pwaChrome');
  const imgs = ['/launch/assets/footage/installpwachrome.png', '/launch/assets/footage/installpwachrome2.png'];
  img.style.transition = 'opacity .35s ease';
  let k = 0;
  setInterval(() => { k = 1 - k; img.style.opacity = 0; setTimeout(() => { img.src = imgs[k]; img.style.opacity = 1; }, 300); }, 2600);
}, 0.2);

/* ---- iOS Safari install: stacked preloaded screenshots (toggle .is-on only) ---- */
const setIosShot = (index, root) => {
  const scope = root && root.querySelector ? root : document;
  const stage = scope.querySelector('#pwaIosStage') || document.querySelector('#pwaIosStage');
  if (!stage) return;
  const shots = [...stage.querySelectorAll('img.ios-shot')];
  if (!shots.length) return;
  const parsed = parseInt(index, 10);
  const i = Math.max(0, Math.min(Number.isFinite(parsed) ? parsed : 0, shots.length - 1));

  // Remove active from all, then enable exactly one (avoids blank frames)
  shots.forEach((img) => {
    img.classList.remove('is-on');
    img.style.cssText = '';
  });
  const target =
    shots.find((img) => String(img.getAttribute('data-shot')) === String(i)) || shots[i];
  if (target) target.classList.add('is-on');
  stage.setAttribute('data-active-shot', String(i));
};

/* ---- Polished UI/PWA: cycle the native clip UI (the swipe feel) ---- */
once($('#pwaClip'), () => {
  const img = $('#pwaClip');
  const imgs = ['/launch/assets/shots/clips1.png', '/launch/assets/shots/clips2.png', '/launch/assets/shots/clips3.png'];
  img.style.transition = 'opacity .3s ease';
  let k = 0;
  setInterval(() => { k = (k + 1) % 3; img.style.opacity = 0; setTimeout(() => { img.src = imgs[k]; img.style.opacity = 1; }, 260); }, 2200);
}, 0.2);

/* ============================================================
   Before / after magic-eraser slider (drag)
   ============================================================ */
(function () {
  const ba = $('#ba'); if (!ba) return;
  const after = $('.after', ba), handle = $('#baHandle');
  let auto = true;
  function setPos(px) {
    const rect = ba.getBoundingClientRect();
    let p = clamp01((px - rect.left) / rect.width);
    after.style.clipPath = `inset(0 0 0 ${p * 100}%)`;
    handle.style.left = (p * 100) + '%';
  }
  function fromEvent(e) {
    auto = false;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    setPos(x);
  }
  let dragging = false;
  const down = (e) => { dragging = true; fromEvent(e); };
  const move = (e) => { if (dragging) { e.preventDefault(); fromEvent(e); } };
  const up = () => dragging = false;
  handle.addEventListener('mousedown', down); ba.addEventListener('mousedown', down);
  window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
  handle.addEventListener('touchstart', down, { passive: true });
  window.addEventListener('touchmove', move, { passive: false });
  window.addEventListener('touchend', up);
  // gentle auto-sweep until user interacts
  let t = 0;
  (function sweep() {
    if (!__alive) return;
    if (auto) {
      t += 0.016;
      const rect = ba.getBoundingClientRect();
      const p = 0.5 + Math.sin(t) * 0.32;
      after.style.clipPath = `inset(0 0 0 ${p * 100}%)`;
      handle.style.left = (p * 100) + '%';
    }
    requestAnimationFrame(sweep);
  })();
})();

/* ============================================================
   PWA install tabs + step highlight (click any step to select)
   ============================================================ */
(function () {
  const tabs = $$('#pwaTabs .tab');
  const panels = $$('.pwapanel');
  let stepTimer = null;
  let userPicked = false;

  function stopAuto() {
    if (stepTimer) { clearInterval(stepTimer); stepTimer = null; }
  }

  function applyStep(panel, index) {
    if (!panel) return;
    const lis = $$('.steps li', panel);
    if (!lis.length) return;
    const i = Math.max(0, Math.min(index, lis.length - 1));
    const hs = $('.homescreen', panel);
    const isIos = panel.dataset.panel === 'ios';
    const last = i === lis.length - 1;

    lis.forEach((l, n) => {
      l.classList.toggle('hot', n === i);
      l.setAttribute('aria-current', n === i ? 'step' : 'false');
    });

    // Always map the selected step → screenshot (step 5 → shot 3, step 3 → shot 2, etc.)
    if (isIos) {
      const li = lis[i];
      const raw = li.getAttribute('data-shot');
      const shot = raw != null ? parseInt(raw, 10) : i;
      setIosShot(Number.isFinite(shot) ? shot : i, panel);
    }

    // Home-screen badge only on the final step; hide when going back earlier
    if (last) hs?.classList.add('show');
    else hs?.classList.remove('show');
  }

  function bindStepClicks(panel) {
    if (!panel || panel.dataset.stepsBound === '1') return;
    panel.dataset.stepsBound = '1';
    const lis = $$('.steps li', panel);
    lis.forEach((li, idx) => {
      li.setAttribute('role', 'button');
      li.setAttribute('tabindex', '0');
      li.setAttribute('aria-label', `Step ${idx + 1}`);
      const pick = (e) => {
        e?.preventDefault?.();
        userPicked = true;
        stopAuto();
        applyStep(panel, idx);
      };
      li.addEventListener('click', pick);
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pick(e);
        }
      });
    });
  }

  panels.forEach(bindStepClicks);

  function animateSteps(panel) {
    if (!panel) return;
    stopAuto();
    userPicked = false;
    const lis = $$('.steps li', panel);
    if (!lis.length) return;
    // start on step 1; user can click any step anytime
    applyStep(panel, 0);
    let i = 1;
    stepTimer = setInterval(() => {
      if (!__alive || userPicked) { stopAuto(); return; }
      if (i < lis.length) {
        applyStep(panel, i);
        i++;
      } else {
        stopAuto();
        applyStep(panel, lis.length - 1);
      }
    }, 900);
  }

  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('on'));
    tab.classList.add('on');
    panels.forEach(p => p.classList.toggle('on', p.dataset.panel === tab.dataset.tab));
    animateSteps($(`.pwapanel[data-panel="${tab.dataset.tab}"]`));
  }));

  once($('#install'), () => animateSteps($('.pwapanel.on')), 0.25);
})();

/* ============================================================
   BRAND FILM / REEL — cinematic auto-play story, narrated by Ava
   ============================================================ */
let reelStop = null;
(() => {
  const stage = $('#reelStage');
  if (!stage) return;

  const A = '/launch/assets/campaign/';
  // Narrated by Ava (local Kokoro voice), pre-rendered to /voice/ava-NN.mp3.
  // `text` is the on-screen caption (exact campaign wording); `say` documents
  // the matching Ava audio line. Each `dur` is sized to hold its clip + breath.
  // To re-render the voice, POST each `say` to the Ava TTS endpoint
  // (kokoro, voice "ava") and overwrite voice/ava-NN.mp3 — keep this order.
  const BEATS = [
    { img: 'c38e4f51-cabb-4d51-82b0-ff79e36604cf.png', pos: '42% 42%', say: 'Everything shuts right when you need it. This one doesn’t.', dur: 4000 },
    { img: '5ad151ec-fb3c-4c8d-8625-7923a241e3c5.png', pos: '50% 28%', say: 'Some things you don’t rush. You just sit with them a while.', dur: 4000 },
    { img: '71016c5b-8cb8-4e9a-9066-cc14dc5b0e69.png', pos: '52% 30%', say: 'You can come apart a little, and still be whole.', dur: 3200 },
    { img: '8e934188-97a6-4462-a0f7-ab59d09767b8.png', pos: '48% 34%', say: 'And the heavy stuff, you were never meant to carry alone.', dur: 4000 },
    { img: 'b9fceaae-5419-4b7d-86f8-45d5cb5bf5b2.png', pos: '52% 46%', say: 'It’s so loud out there. All the time.', dur: 3400, flash: true },
    { img: '04d0d5fc-ce36-4911-9d76-d60295c238e3.png', pos: '62% 42%', say: 'This one actually gets you. However you need it to.', dur: 4100 },
    { img: '788862b8-96bf-458e-ac1f-640d94a19cc5.png', pos: '50% 46%', say: 'Look close. It’s all just people. It always was.', dur: 4800, flash: true },
    { img: '3eb97d31-19a0-46f6-ab4b-4c4e8f8b59fa.png', pos: '50% 40%', say: 'The kind of thing that stays with you.', dur: 2500 },
    { img: '54d5a130-5bdc-4f76-849a-72fa2a3d4fdf.png', pos: '50% 28%', say: 'Tell it when you’re ready. No rush.', dur: 3100 },
    { img: 'something-real.png', pos: '50% 26%', say: 'Nothing fake here. I mean it.', dur: 3100 },
    { img: 'where-you-belong.png', pos: '40% 40%', say: 'Somewhere that actually feels like yours.', dur: 3300, red: true },
    { img: 'glowwww-monolith.png', pos: '50% 50%', say: 'So, come find us. Glow.', url: 'glowwww.vercel.app', noCap: true, dur: 4400, red: true },
  ];
  const TOTAL = BEATS.reduce((s, b) => s + b.dur, 0);

  const track = $('#reelTrack');
  const captionEl = $('#reelCaption');
  const urlEl = $('#reelUrl');
  const flashEl = $('#reelFlash');
  const reel = $('#reel');
  const poster = $('#reelPoster');
  const soundBtn = $('#reelSound');
  const ui = $('#reelUi');
  const toggleBtn = $('#reelToggle');
  const muteBtn = $('#reelMute');
  const bar = $('#reelBar');
  const fill = $('#reelFill');
  const timeEl = $('#reelTime');

  // fresh build (StrictMode/HMR may re-run initLaunch) + one AbortController
  // so every listener/observer below is torn down together in reelStop.
  const ac = new AbortController();
  const sig = ac.signal;
  track.innerHTML = '';

  // build slides
  const slides = BEATS.map((b, i) => {
    const s = document.createElement('div');
    s.className = 'reel__slide' + (b.img === '__finale__' ? ' reel__slide--finale' : '');
    if (b.img === '__finale__') {
      s.innerHTML = '<div class="reel__finale"><img src="/launch/assets/brand/logo-dark.png" alt="Glowwww"><span>Glowwww</span></div>';
    } else {
      // blurred fill (cover) behind the whole image (contain) — no cropping
      const bg = document.createElement('img');
      bg.className = 'reel__bg'; bg.alt = ''; bg.loading = 'lazy'; bg.dataset.src = A + b.img;
      const fg = document.createElement('img');
      fg.className = 'reel__fg'; fg.alt = ''; fg.loading = 'lazy'; fg.dataset.src = A + b.img;
      s.appendChild(bg); s.appendChild(fg);
    }
    track.appendChild(s);
    return s;
  });
  const loadImg = (i) => {
    if (!slides[i]) return;
    slides[i].querySelectorAll('img[data-src]').forEach(el => {
      el.src = el.dataset.src; el.removeAttribute('data-src');
    });
  };

  // voice — Ava, pre-rendered per beat to voice/ava-NN.mp3
  const clips = BEATS.map((_, i) => {
    const a = new Audio(A + 'voice/ava-' + String(i + 1).padStart(2, '0') + '.mp3');
    a.preload = 'auto';
    return a;
  });
  function stopVoice() {
    clips.forEach(a => { try { a.pause(); a.currentTime = 0; } catch (e) {} });
  }
  function playClip(i) {
    if (muted) return;
    stopVoice();
    const a = clips[i];
    if (!a) return;
    try { a.currentTime = 0; const p = a.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {}
  }

  /* ---- cinematic score (Hans Zimmer-style), synthesized with Web Audio ----
     A sustained sub drone + string pad on a minor progression (Am–F–C–Dm–G…),
     a propulsive ostinato, taiko booms, and brass "braaam" swells at the peaks,
     all through a convolution reverb and building in intensity across the film.
     Self-contained (no licensing). Drop a real score at voice/music.mp3 and it
     is used instead of the synth automatically. */
  const MUSIC_SRC = A + 'voice/music.mp3';
  const musicEl = new Audio(MUSIC_SRC);
  musicEl.loop = true; musicEl.volume = 0.5; musicEl.preload = 'auto';
  let musicFileOk = false;
  musicEl.addEventListener('canplaythrough', () => { musicFileOk = true; }, { once: true });
  musicEl.addEventListener('error', () => { musicFileOk = false; });

  let actx = null, master = null, bus = null, reverb = null, musicTimer = 0, scoreOn = false;
  let padVoices = [], droneOscs = [], droneGain = null;
  let curArp = [], intensity = 0, osTick = 0, nextOs = 0;
  const BPM = 72, OSTEP = (60 / BPM) / 2;   // slow, epic; ostinato on 8th notes
  const N = { A1: 55, F1: 43.65, C2: 65.41, D1: 36.71, G1: 49,
    D3: 146.83, F3: 174.61, G3: 196, A3: 220, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392, A4: 440, C5: 523.25 };
  const CH = {
    Am: { sub: N.A1, pad: [N.A3, N.C4, N.E4], arp: [N.A3, N.C4, N.E4, N.A4] },
    F:  { sub: N.F1, pad: [N.F3, N.A3, N.C4], arp: [N.F3, N.A3, N.C4, N.F4] },
    C:  { sub: N.C2, pad: [N.C4, N.E4, N.G4], arp: [N.C4, N.E4, N.G4, N.C5] },
    Dm: { sub: N.D1, pad: [N.D3, N.F3, N.A3], arp: [N.D3, N.F3, N.A3, N.D4] },
    G:  { sub: N.G1, pad: [N.G3, N.B3, N.D4], arp: [N.G3, N.B3, N.D4, N.G4] },
  };
  const BEAT_CH  = ['Am', 'F', 'C', 'Dm', 'G', 'C', 'F', 'Am', 'F', 'C', 'G', 'Am'];
  const BEAT_INT = [0.14, 0.28, 0.40, 0.55, 0.78, 0.50, 0.95, 0.62, 0.50, 0.68, 0.82, 1.0];

  function makeIR(sec) {
    const len = Math.floor(actx.sampleRate * sec);
    const ir = actx.createBuffer(2, len, actx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    return ir;
  }
  function actxInit() {
    if (!actx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      actx = new C();
      const comp = actx.createDynamicsCompressor();
      comp.threshold.value = -8; comp.knee.value = 20; comp.ratio.value = 6;
      comp.attack.value = 0.003; comp.release.value = 0.25; comp.connect(actx.destination);
      master = actx.createGain(); master.gain.value = 0.0001; master.connect(comp);
      reverb = actx.createConvolver(); reverb.buffer = makeIR(2.8);
      const wet = actx.createGain(); wet.gain.value = 0.42; reverb.connect(wet).connect(master);
      bus = actx.createGain(); bus.gain.value = 1; bus.connect(master); bus.connect(reverb);
    }
    return actx;
  }
  function noise(t, dur, decay) {
    const b = actx.createBuffer(1, Math.max(1, Math.ceil(actx.sampleRate * dur)), actx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (decay ? Math.pow(1 - i / d.length, 2) : 1);
    const s = actx.createBufferSource(); s.buffer = b; return s;
  }
  function saw2(freq, t) {
    const o1 = actx.createOscillator(), o2 = actx.createOscillator();
    o1.type = o2.type = 'sawtooth'; o1.frequency.value = freq; o2.frequency.value = freq;
    o1.detune.value = -7; o2.detune.value = 7; o1.start(t); o2.start(t);
    return [o1, o2];
  }
  function shaperCurve(k) { const n = 1024, c = new Float32Array(n); for (let i = 0; i < n; i++) { const x = i / n * 2 - 1; c[i] = Math.tanh(x * k); } return c; }
  function setChord(name, inten) {
    const ch = CH[name]; if (!ch || !actx) return;
    curArp = ch.arp; intensity = inten;
    const t = actx.currentTime;
    padVoices.forEach(v => {
      try { v.gain.gain.cancelScheduledValues(t); v.gain.gain.setTargetAtTime(0.0001, t, 0.4); v.oscs.forEach(o => o.stop(t + 1.5)); } catch (e) {}
    });
    padVoices = [];
    const cut = 480 + inten * 2400, lvl = 0.045 + inten * 0.05;
    ch.pad.forEach(f => {
      const oscs = saw2(f, t);
      const lp = actx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = cut; lp.Q.value = 0.6;
      const g = actx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(lvl, t + 1.4);
      oscs.forEach(o => o.connect(lp)); lp.connect(g).connect(bus);
      padVoices.push({ oscs, gain: g });
    });
    droneOscs.forEach(o => { try { o.frequency.setTargetAtTime(ch.sub * (o.__mul || 1), t, 0.3); } catch (e) {} });
    if (droneGain) droneGain.gain.setTargetAtTime(0.1 + inten * 0.06, t, 0.5);
  }
  function buildDrone() {
    const t = actx.currentTime;
    const sub = actx.createOscillator(); sub.type = 'sine'; sub.frequency.value = 55; sub.__mul = 1;
    const oct = actx.createOscillator(); oct.type = 'triangle'; oct.frequency.value = 110; oct.__mul = 2;
    droneGain = actx.createGain(); droneGain.gain.value = 0.0001;
    const lp = actx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 220;
    sub.connect(lp); oct.connect(lp); lp.connect(droneGain).connect(bus);
    sub.start(t); oct.start(t); droneOscs = [sub, oct];
  }
  function note(freq, t, vel) {
    const o = actx.createOscillator(), o2 = actx.createOscillator(), g = actx.createGain(), lp = actx.createBiquadFilter();
    o.type = 'triangle'; o2.type = 'sine'; o.frequency.value = freq; o2.frequency.value = freq;
    lp.type = 'lowpass'; lp.frequency.value = 2600;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vel * 0.09, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    o.connect(lp); o2.connect(lp); lp.connect(g).connect(bus);
    o.start(t); o2.start(t); o.stop(t + 0.55); o2.stop(t + 0.55);
  }
  function boom(t, vel) {
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.26);
    g.gain.setValueAtTime(vel * 0.85, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    o.connect(g).connect(bus); o.start(t); o.stop(t + 0.62);
    const s = noise(t, 0.12, true), lp = actx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
    const ng = actx.createGain(); ng.gain.value = vel * 0.3; s.connect(lp).connect(ng).connect(bus); s.start(t); s.stop(t + 0.12);
  }
  function braaam(t) {
    const shaper = actx.createWaveShaper(); shaper.curve = shaperCurve(2.2);
    const lp = actx.createBiquadFilter(); lp.type = 'lowpass';
    lp.frequency.setValueAtTime(360, t); lp.frequency.exponentialRampToValueAtTime(1300, t + 0.5);
    const g = actx.createGain(); g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.42, t + 0.14); g.gain.setValueAtTime(0.42, t + 0.9); g.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
    [55, 82.41, 110].forEach(f => { saw2(f, t).forEach(o => { o.connect(shaper); o.stop(t + 1.9); }); });
    shaper.connect(lp).connect(g).connect(bus);
    const sub = actx.createOscillator(), sg = actx.createGain(); sub.type = 'sine'; sub.frequency.value = 27.5;
    sg.gain.setValueAtTime(0.0001, t); sg.gain.exponentialRampToValueAtTime(0.5, t + 0.12); sg.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
    sub.connect(sg).connect(bus); sub.start(t); sub.stop(t + 1.7);
  }
  function riser(t, dur) {
    const s = noise(t, dur + 0.1, false), bp = actx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(300, t); bp.frequency.exponentialRampToValueAtTime(5000, t + dur);
    const g = actx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.2, t + dur * 0.9); g.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.1);
    s.connect(bp).connect(g).connect(bus); s.start(t); s.stop(t + dur + 0.1);
  }
  function scoreScheduler() {
    if (!actx) return;
    const la = actx.currentTime + 0.15;
    while (nextOs < la) {
      const q = osTick, onBeat = (q % 2 === 0);
      if (onBeat && intensity > 0.12) boom(nextOs, 0.55 + intensity * 0.45);
      if (onBeat && intensity > 0.75 && (q / 2) % 2 === 1) boom(nextOs + OSTEP * 0.5, 0.4);
      if (intensity > 0.24 && curArp.length) note(curArp[q % curArp.length], nextOs, 0.35 + intensity * 0.6);
      nextOs += OSTEP; osTick = (osTick + 1) % 64;
    }
  }
  function scoreCut(i) {
    if (muted || musicFileOk || !actx || !scoreOn) return;
    setChord(BEAT_CH[i] || 'Am', BEAT_INT[i] != null ? BEAT_INT[i] : 0.5);
    const b = BEATS[i], t = actx.currentTime;
    if (b && b.flash) { riser(t, 0.7); braaam(t + 0.55); }
    else if (i === BEATS.length - 1) { riser(t, 0.9); braaam(t + 0.7); }
    else if (i > 0) boom(t + 0.02, 0.5 + (BEAT_INT[i] || 0.5) * 0.5);
  }
  function startMusic() {
    if (muted) return;
    if (musicFileOk) { try { musicEl.currentTime = 0; const p = musicEl.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {} return; }
    const a = actxInit(); if (!a || scoreOn) return;
    try { a.resume(); } catch (e) {}
    scoreOn = true; osTick = 0; nextOs = a.currentTime + 0.1;
    buildDrone();
    master.gain.cancelScheduledValues(a.currentTime);
    master.gain.setValueAtTime(0.0001, a.currentTime);
    master.gain.exponentialRampToValueAtTime(0.5, a.currentTime + 1.3);
    if (curIdx >= 0) setChord(BEAT_CH[curIdx] || 'Am', BEAT_INT[curIdx] != null ? BEAT_INT[curIdx] : 0.5);
    musicTimer = setInterval(scoreScheduler, 25);
  }
  function stopMusic() {
    try { musicEl.pause(); } catch (e) {}
    scoreOn = false; clearInterval(musicTimer);
    if (actx) {
      const t = actx.currentTime;
      try { master.gain.setTargetAtTime(0.0001, t, 0.1); } catch (e) {}
      padVoices.forEach(v => { try { v.gain.gain.setTargetAtTime(0.0001, t, 0.2); v.oscs.forEach(o => o.stop(t + 0.8)); } catch (e) {} });
      padVoices = [];
      droneOscs.forEach(o => { try { o.stop(t + 0.8); } catch (e) {} }); droneOscs = [];
      if (droneGain) { try { droneGain.gain.setTargetAtTime(0.0001, t, 0.2); } catch (e) {} }
    }
  }

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  // state
  let started = false, playing = false, muted = true, ended = false;
  let tAcc = 0, tLast = 0, curIdx = -1, raf = 0;

  function renderCaption(b) {
    captionEl.innerHTML = '';
    if (b.noCap) return;
    const inner = document.createElement('div');
    inner.className = 'reel__cap-inner';
    // subtitle the narration Ava speaks (brand spelled out in `cap`)
    const words = (b.cap || b.say || b.text || '').split(' ');
    // spread the word reveal across ~65% of the beat so captions track the voice
    const step = Math.min(0.34, (b.dur * 0.00065) / Math.max(1, words.length));
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'cw';
      span.textContent = w;
      span.style.animationDelay = (0.04 + i * step) + 's';
      inner.appendChild(span);
      inner.appendChild(document.createTextNode(' '));
    });
    captionEl.appendChild(inner);
  }
  function showBeat(i) {
    const b = BEATS[i];
    slides.forEach((s, k) => s.classList.toggle('on', k === i));
    loadImg(i); loadImg(i + 1);
    renderCaption(b);
    if (urlEl) { if (b.url) { urlEl.textContent = b.url; urlEl.classList.add('show'); } else urlEl.classList.remove('show'); }
    if (!reduce && flashEl && i > 0) {
      flashEl.classList.remove('hit', 'hard'); void flashEl.offsetWidth;
      flashEl.classList.add('hit'); if (b.flash) flashEl.classList.add('hard');
    }
    scoreCut(i);
    playClip(i);
  }
  const fmt = (ms) => { const s = Math.max(0, Math.min(Math.round(ms / 1000), Math.round(TOTAL / 1000))); return '0:' + String(s).padStart(2, '0'); };

  function frame(now) {
    if (!__alive || !playing) return;
    // clamp dt so returning from a background tab doesn't skip beats
    let dt = now - tLast; tLast = now; if (dt > 100) dt = 100; tAcc += dt;
    if (tAcc >= TOTAL) { finish(); return; }
    let acc = 0, i = 0;
    for (; i < BEATS.length; i++) { if (tAcc < acc + BEATS[i].dur) break; acc += BEATS[i].dur; }
    if (i !== curIdx) { curIdx = i; showBeat(i); }
    fill.style.width = (tAcc / TOTAL * 100) + '%';
    timeEl.textContent = fmt(tAcc);
    raf = requestAnimationFrame(frame);
  }
  function play() {
    if (playing) return;
    playing = true; ended = false;
    if (!muted) startMusic();
    tLast = performance.now();
    if (curIdx < 0) { curIdx = 0; showBeat(0); }
    else if (!muted && clips[curIdx]) { const p = clips[curIdx].play(); if (p && p.catch) p.catch(() => {}); }
    toggleBtn.setAttribute('aria-label', 'Pause');
    toggleBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
    raf = requestAnimationFrame(frame);
  }
  function pause() {
    playing = false; cancelAnimationFrame(raf);
    stopMusic();
    if (curIdx >= 0 && clips[curIdx]) { try { clips[curIdx].pause(); } catch (e) {} }
    toggleBtn.setAttribute('aria-label', 'Play');
    toggleBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  }
  function finish() {
    playing = false; cancelAnimationFrame(raf); ended = true;
    fill.style.width = '100%'; timeEl.textContent = fmt(TOTAL);
    stopVoice(); stopMusic();
    // linger on finale, then re-arm the poster for replay
    poster.classList.remove('gone');
    const hook = poster.querySelector('.reel__hook');
    const playSpan = poster.querySelector('.reel__play span');
    if (hook) hook.innerHTML = 'It’s still <span>people</span>.';
    if (playSpan) playSpan.innerHTML = 'Watch again<small>0:44 &middot; sound on</small>';
    curIdx = -1; tAcc = 0;
  }
  function restart(withSound) {
    stopVoice();
    started = true; ended = false; tAcc = 0; curIdx = -1;
    muted = !withSound;
    reel.classList.toggle('muted', muted);
    soundBtn.classList.toggle('show', muted);
    muteBtn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
    poster.classList.add('gone');
    ui.classList.add('show');
    playing = false; play();
  }

  // interactions — tap anywhere on the poster or the sound pill to play with Ava
  $('#reelPlay').addEventListener('click', (e) => { e.stopPropagation(); restart(true); }, { signal: sig });
  poster.addEventListener('click', (e) => { e.stopPropagation(); restart(true); }, { signal: sig });
  soundBtn.addEventListener('click', (e) => { e.stopPropagation(); restart(true); }, { signal: sig });
  stage.addEventListener('click', () => {
    if (!started || ended) { restart(true); return; }
    if (muted) { restart(true); return; }   // tap silent auto-play → replay with Ava
    playing ? pause() : play();
  }, { signal: sig });
  toggleBtn.addEventListener('click', (e) => { e.stopPropagation(); playing ? pause() : play(); }, { signal: sig });
  muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    muted = !muted;
    reel.classList.toggle('muted', muted);
    soundBtn.classList.toggle('show', muted);
    muteBtn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
    if (muted) { stopVoice(); stopMusic(); }
    else if (playing) { startMusic(); if (curIdx >= 0) playClip(curIdx); }
  }, { signal: sig });
  bar.addEventListener('click', (e) => {
    e.stopPropagation();
    const r = bar.getBoundingClientRect();
    const p = clamp01((e.clientX - r.left) / r.width);
    tAcc = p * TOTAL; curIdx = -1; tLast = performance.now();
    stopVoice();
    if (!playing) { fill.style.width = (p * 100) + '%'; timeEl.textContent = fmt(tAcc); }
  }, { signal: sig });

  // silent auto-play when the film scrolls into view (once), like a real reel
  loadImg(0);
  let autoArmed = false;
  const io = new IntersectionObserver((ents) => {
    ents.forEach(e => {
      if (e.isIntersecting && !autoArmed && !started) {
        autoArmed = true;
        ui.classList.add('show');
        soundBtn.classList.add('show');
        if (!reduce) { started = true; muted = true; reel.classList.add('muted'); poster.classList.add('gone'); play(); }
      }
      // pause when scrolled fully away to save cycles / stop voice
      if (!e.isIntersecting && playing) pause();
    });
  }, { threshold: 0.45 });
  io.observe(stage);

  reelStop = () => {
    cancelAnimationFrame(raf);
    stopVoice(); stopMusic();
    if (actx) { try { actx.close(); } catch (e) {} actx = null; }
    io.disconnect();
    ac.abort();
  };
})();

/* smooth-scroll for in-page nav */
$$('a[href^="#"]').forEach(a => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href');
  if (id.length > 1) { const t = $(id); if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); } }
}));

  return () => {
    __alive = false;
    if (reelStop) reelStop();
    if (orb && orb.dispose) orb.dispose();
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('mousemove', onMove);
  };
}
