/* Senior motion JS — kinetic hero, magnetic CTAs, parallax, tilt, marquee rail */
export function initSeniorMotion() {
  const cleanups = [];
  const on = (el, ev, fn, opt) => { if (el) { el.addEventListener(ev, fn, opt); cleanups.push(() => el.removeEventListener(ev, fn, opt)); } };
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const desktop = () => window.innerWidth >= 900 && finePointer && !reduce;

  /* ---- 1. kinetic hero split ---- */
  const hero = document.querySelector('.lp .hero');
  const h1 = hero && hero.querySelector('h1');
  if (h1 && !h1.dataset.split) {
    h1.dataset.split = '1';
    const walk = (node, em) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const wi = document.createElement('span'); wi.className = 'wi';
            [...part].forEach((c) => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; wi.appendChild(s); });
            w.appendChild(wi); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeName === 'BR') { node.replaceChild(document.createTextNode('\n'), n); }
        else if (n.nodeType === 1) walk(n, em || n.classList.contains('em'));
      });
    };
    // split per top-level segment to keep <br> line breaks
    const parts = [];
    [...h1.childNodes].forEach((n) => parts.push(n));
    h1.innerHTML = '';
    parts.forEach((n) => {
      if (n.nodeName === 'BR') { h1.appendChild(document.createElement('br')); return; }
      const tmp = document.createElement('span'); tmp.appendChild(n.cloneNode(true)); walk(tmp, false);
      while (tmp.firstChild) h1.appendChild(tmp.firstChild);
      h1.appendChild(document.createTextNode(' '));
    });
    const chars = [...h1.querySelectorAll('.ch')];
    chars.forEach((c, i) => { c.style.transitionDelay = `${Math.min(i * 22, 700)}ms`; });
    requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('is-ready')));
  } else if (hero) { hero.classList.add('is-ready'); }

  // hero scroll state (fade cue + bg handled in plx loop)
  const heroScroll = () => hero && hero.classList.toggle('is-past', window.scrollY > window.innerHeight * 0.55);
  on(window, 'scroll', heroScroll, { passive: true }); heroScroll();

  // arrow nudge on CTAs containing →
  document.querySelectorAll('.lp .btn').forEach((b) => {
    if (b.dataset.arr || !b.textContent.includes('→')) return; b.dataset.arr = '1';
    b.innerHTML = b.innerHTML.replace('→', '<span class="arr">→</span>');
  });

  /* ---- 2. magnetic CTAs (desktop only) ---- */
  if (desktop()) {
    const magnets = [...document.querySelectorAll('.lp .btn--primary, .lp .nav .cta')];
    magnets.forEach((el) => {
      let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
      const loop = () => { x += (tx - x) * 0.18; y += (ty - y) * 0.18;
        el.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px)`;
        if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) raf = requestAnimationFrame(loop); else raf = 0; };
      const move = (e) => { const r = el.getBoundingClientRect();
        tx = (e.clientX - (r.left + r.width / 2)) * 0.18; ty = (e.clientY - (r.top + r.height / 2)) * 0.28;
        tx = Math.max(-8, Math.min(8, tx)); ty = Math.max(-6, Math.min(6, ty));
        if (!raf) raf = requestAnimationFrame(loop); };
      const leave = () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); };
      on(el, 'pointermove', move); on(el, 'pointerleave', leave);
    });
  }

  /* ---- 3. scroll parallax rAF ---- */
  const plxItems = [];
  const tag = (sel, speed, inner) => document.querySelectorAll(sel).forEach((el) => plxItems.push({ el, speed, inner }));
  tag('.lp .hero__bg img', 0.14); tag('.lp .finale img.bg', 0.1);
  tag('.lp .interstitial img', 0.08); tag('.lp .story__img img', -0.05);
  if (!reduce && plxItems.length) {
    let ticking = false;
    const update = () => { ticking = false;
      const vh = window.innerHeight;
      plxItems.forEach(({ el, speed }) => {
        const r = el.getBoundingClientRect(); if (r.bottom < -200 || r.top > vh + 200) return;
        const off = (r.top + r.height / 2 - vh / 2) * speed;
        el.style.transform = `translate3d(0,${off.toFixed(1)}px,0) scale(1.12)`;
      });
    };
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    on(window, 'scroll', req, { passive: true }); on(window, 'resize', req); update();
  }

  /* ---- 4. tilt + glare (desktop) ---- */
  if (desktop()) {
    document.querySelectorAll('.lp .frame, .lp .tcard, .lp .trust-card').forEach((el) => {
      if (el.closest('.phone')) return;
      el.classList.add('tilt-inner');
      const p = el.parentElement; if (p && !p.classList.contains('tilt') && (el.classList.contains('frame') || el.classList.contains('tcard'))) p.classList.add('tilt');
      let glare = el.querySelector(':scope > .tilt-glare');
      if (!glare) { glare = document.createElement('div'); glare.className = 'tilt-glare'; el.appendChild(glare); }
      const move = (e) => { const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.transform = `rotateX(${((0.5 - py) * 7).toFixed(2)}deg) rotateY(${((px - 0.5) * 9).toFixed(2)}deg) translateY(-3px)`;
        el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`); el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`); };
      const leave = () => { el.style.transform = ''; };
      on(el, 'pointermove', move); on(el, 'pointerleave', leave);
    });
  }

  /* ---- 5. hero strip velocity marquee ---- */
  const track = document.querySelector('.lp .hero__strip-track');
  if (track && !reduce && !track.dataset.mq) {
    track.dataset.mq = '1'; track.classList.add('is-marquee');
    track.innerHTML += track.innerHTML; // loop seam
    const strip = track.parentElement; let x = 0, vel = 0, lastY = window.scrollY, hover = false;
    on(window, 'scroll', () => { vel = window.scrollY - lastY; lastY = window.scrollY; }, { passive: true });
    on(strip, 'pointerenter', () => { hover = true; }); on(strip, 'pointerleave', () => { hover = false; });
    let raf = 0; const half = () => track.scrollWidth / 2;
    const step = () => { raf = requestAnimationFrame(step);
      const boost = Math.max(-3, Math.min(3, vel * 0.06)); vel *= 0.92;
      if (!hover) x += 0.5 + Math.abs(boost) * 0.8;
      if (x >= half()) x -= half();
      track.style.transform = `translate3d(${-x}px,0,0)`;
      track.style.setProperty('--vel-skew', `${Math.max(-6, Math.min(6, boost * 2)).toFixed(2)}deg`);
    };
    step(); cleanups.push(() => cancelAnimationFrame(raf));
  }

  /* ---- 6. boards rail: drag + progress ---- */
  const rail = document.querySelector('.lp #boardsRail');
  if (rail && !rail.dataset.drag) {
    rail.dataset.drag = '1';
    let prog = document.querySelector('.lp .boards-progress i');
    if (!prog) { const bar = document.createElement('div'); bar.className = 'boards-progress'; bar.innerHTML = '<i></i>';
      rail.after(bar); prog = bar.firstChild; }
    const sync = () => { const max = rail.scrollWidth - rail.clientWidth;
      prog.style.transform = `scaleX(${max > 0 ? Math.max(0.08, rail.scrollLeft / max) : 1})`; };
    on(rail, 'scroll', sync, { passive: true }); sync();
    // arrow buttons: a guaranteed way to move sideways on any input
    if (!document.querySelector('.lp .boards-nav')) {
      const nav = document.createElement('div');
      nav.className = 'boards-nav';
      nav.innerHTML = '<button type="button" class="boards-arrow" data-dir="-1" aria-label="Scroll billboards left">←</button>' +
        '<button type="button" class="boards-arrow" data-dir="1" aria-label="Scroll billboards right">→</button>';
      rail.before(nav);
      nav.querySelectorAll('.boards-arrow').forEach((btn) => {
        btn.addEventListener('click', () => {
          const step = Math.min(rail.clientWidth * 0.8, 620);
          rail.scrollBy({ left: (btn.dataset.dir === '1' ? 1 : -1) * step, behavior: 'smooth' });
        });
      });
    }
    if (finePointer) {
      let down = false, sx = 0, sl = 0, v = 0, last = 0, raf = 0;
      const mom = () => { if (down) return; rail.scrollLeft += v; v *= 0.94; sync();
        if (Math.abs(v) > 0.3) raf = requestAnimationFrame(mom); else raf = 0; };
      on(rail, 'pointerdown', (e) => { down = true; sx = e.clientX; sl = rail.scrollLeft; last = e.clientX; v = 0;
        rail.classList.add('is-drag'); try { rail.setPointerCapture(e.pointerId); } catch (_) {} cancelAnimationFrame(raf); });
      on(rail, 'pointermove', (e) => { if (!down) return; rail.scrollLeft = sl - (e.clientX - sx);
        v = (last - e.clientX) * 0.6; last = e.clientX; sync(); });
      const up = () => { if (!down) return; down = false; rail.classList.remove('is-drag'); raf = requestAnimationFrame(mom); };
      on(rail, 'pointerup', up); on(rail, 'pointercancel', up);
    }
  }

  /* ---- 7. lightbox luxe class ---- */
  const lb = document.querySelector('.lp #boardLb');
  if (lb && !lb.dataset.luxe) { lb.dataset.luxe = '1';
    new MutationObserver(() => { if (!lb.hidden) requestAnimationFrame(() => lb.classList.add('is-open'));
      else lb.classList.remove('is-open'); }).observe(lb, { attributes: true, attributeFilter: ['hidden'] });
  }

  return () => { cleanups.forEach((fn) => { try { fn(); } catch (_) {} }); };
}
