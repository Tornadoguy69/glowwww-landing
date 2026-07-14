// The Glowwww orb — vanilla three.js port of GlowwwVoiceAssistant / the film's
// Orb.tsx: torus ring + two red bezier arcs + white arc, MeshPhysicalMaterial
// with a white/red env-map, and an orb->agent morph that collapses the arcs
// and scales in two blinking sphere eyes. Driven by a scroll-controlled state.
import * as THREE from 'three';

const clamp01 = (x) => Math.max(0, Math.min(1, x));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);

export function createOrb(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
  camera.position.set(0, 0, 68);

  // lights (match Orb.tsx)
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const d1 = new THREE.DirectionalLight(0xffffff, 2.5); d1.position.set(5, 10, 15); scene.add(d1);
  const d2 = new THREE.DirectionalLight(0xe53935, 1.5); d2.position.set(-10, -5, 10); scene.add(d2);
  const pl = new THREE.PointLight(0xffffff, 3, 50); pl.position.set(0, 15, -10); scene.add(pl);

  // env map from a white + red panel scene
  const envScene = new THREE.Scene();
  const panelGeo = new THREE.PlaneGeometry(20, 20);
  const wp = new THREE.Mesh(panelGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
  wp.position.set(10, 20, 10); wp.lookAt(0, 0, 0); envScene.add(wp);
  const rp = new THREE.Mesh(panelGeo, new THREE.MeshBasicMaterial({ color: 0xe53935 }));
  rp.position.set(-15, -10, 15); rp.lookAt(0, 0, 0); envScene.add(rp);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromScene(envScene).texture;

  const base = { metalness: 1.0, roughness: 0.1, clearcoat: 1.0, clearcoatRoughness: 0.05, envMap, envMapIntensity: 2.0 };
  const redMat = new THREE.MeshPhysicalMaterial({ ...base, color: 0xe53935, emissive: 0x5f0508, emissiveIntensity: 0 });
  const whiteMat = new THREE.MeshPhysicalMaterial({ ...base, color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.4 });

  const logo = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(11, 1.0, 48, 96), redMat);
  logo.add(ring);

  const makeArc = (pts, radius, mat) => {
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(...pts[0]), new THREE.Vector3(...pts[1]),
      new THREE.Vector3(...pts[2]), new THREE.Vector3(...pts[3])
    );
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 48, radius, 20, false), mat));
    const cap = new THREE.SphereGeometry(radius, 24, 24);
    const s = new THREE.Mesh(cap, mat); s.position.copy(curve.getPoint(0)); g.add(s);
    const e = new THREE.Mesh(cap, mat); e.position.copy(curve.getPoint(1)); g.add(e);
    return g;
  };
  const topArc = makeArc([[-9, 1, 0.1], [-6, 5, 0.1], [6, 5, 0.1], [9, 1, 0.1]], 1.5, redMat);
  const bottomArc = makeArc([[-9, -1, 0.1], [-6, -5, 0.1], [6, -5, 0.1], [9, -1, 0.1]], 1.5, redMat);
  const whiteArc = makeArc([[-7, 0, 0.2], [-4, 3, 0.2], [4, 3, 0.2], [7, 0, 0.2]], 1.5, whiteMat);
  logo.add(topArc, bottomArc, whiteArc);

  const eyeGeo = new THREE.SphereGeometry(1.3, 24, 24);
  const leftEye = new THREE.Mesh(eyeGeo, whiteMat);
  const rightEye = new THREE.Mesh(eyeGeo, whiteMat);
  logo.add(leftEye, rightEye);
  scene.add(logo);

  // ---- deterministic-ish blink on wall clock (page is live, not rendered) ----
  let nextBlink = 1.4, blink = 1;
  function updateBlink(t, running) {
    // simple retriggering blink; quick close + elastic reopen
    const period = running ? 1.5 : 2.4;
    const dt = t - nextBlink;
    if (dt >= 0 && dt < 0.24) {
      if (dt < 0.07) blink = 1 - (dt / 0.07) * 0.92;
      else if (dt < 0.12) blink = 0.08;
      else blink = 0.08 + smooth((dt - 0.12) / 0.12) * 0.92;
    } else {
      blink = 1;
      if (dt >= 0.24) nextBlink = t + period + Math.random() * 1.1;
    }
  }

  // ---- state driven by page ----
  const state = {
    morph: 0,        // 0 orb, 1 agent eyes
    speaking: 0,     // 0..1 activity
    level: 0,        // voice level
    running: false,
    gazeX: 0, gazeY: 0,
    opacity: 1,
  };

  let W = 1, H = 1;
  function resize(w, h) {
    W = w; H = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }

  const start = performance.now();
  function frame() {
    const t = (performance.now() - start) / 1000;
    const morph = state.morph;
    const robotEase = smooth(clamp01(morph));
    const speaking = state.speaking;
    const running = state.running;

    updateBlink(t, running);

    const idleBase = 0.08 + (Math.sin(t * (robotEase ? 1.15 : 1.6)) + 1) * 0.025;
    const raw = Math.min(1, idleBase + speaking * (0.25 + state.level * 0.5));
    const bass = Math.min(raw * 0.9 + Math.sin(t * 3) * 0.05, 1);
    const mid = Math.min(raw * 0.8 + Math.cos(t * 4) * 0.1, 1);
    const treble = Math.min(raw * 1.1, 1);

    const ringBreath = 1 + bass * 0.03 + robotEase * (0.04 + Math.sin(t * 2.1) * 0.025);
    const logoScale = Math.max(0.001, 1 - robotEase);

    // Agent mode: keep ONLY the ring (the face) + the two eyes. Every arc —
    // top, bottom and white — collapses to nothing, so there is nothing at all
    // between the eyes.
    ring.scale.setScalar(ringBreath);
    topArc.position.y = robotEase * 3.0 + robotEase * bass * 2.0 + logoScale * mid * 0.6;
    topArc.rotation.z = Math.sin(t * 1.25) * 0.018 * Math.max(robotEase, speaking ? 0.8 : 0);
    topArc.scale.setScalar(logoScale);
    bottomArc.position.y = -(mid * 0.6);
    bottomArc.scale.setScalar(logoScale);
    whiteArc.scale.set(logoScale, logoScale * (1 + treble * 0.2), logoScale * (1 + treble * 0.12));

    // eyes
    let lookX = state.gazeX, lookY = state.gazeY;
    if (running) {
      const k = Math.floor(t / 0.8);
      lookX += (Math.sin(k * 12.9898) * 43758.5 % 1 - 0.5) * 0.9;
      lookY += (Math.sin(k * 78.233) * 43758.5 % 1 - 0.5) * 0.4;
    } else {
      lookX += Math.sin(t * 0.9) * 0.18;
      lookY += Math.sin(t * 1.4) * 0.06;
    }
    const eyeScale = robotEase * (1 + treble * 0.22 + (running || speaking ? Math.sin(t * 4.8) * 0.025 : 0));
    const squint = speaking ? 0.94 + Math.sin(t * 6.5) * 0.035 : 1;
    leftEye.position.set(-3.8 + lookX * robotEase, 1.15 + lookY * robotEase, 0.55);
    rightEye.position.set(3.8 + lookX * robotEase, 1.15 + lookY * robotEase, 0.55);
    leftEye.scale.set(Math.max(0.001, eyeScale), Math.max(0.001, eyeScale * blink * squint), Math.max(0.001, eyeScale));
    rightEye.scale.set(Math.max(0.001, eyeScale), Math.max(0.001, eyeScale * blink * squint), Math.max(0.001, eyeScale));

    whiteMat.emissiveIntensity = 0.6 + Math.sin(t * 1.7) * 0.15 + robotEase * 0.55 + speaking * 1.2;
    redMat.emissiveIntensity = robotEase * (0.25 + (running || speaking ? bass * 0.8 : 0));

    logo.scale.setScalar(1.4 + robotEase * 0.18 + ((running || speaking) ? bass * 0.06 : 0));
    logo.position.y = Math.sin(t * (robotEase ? 0.92 : 1.2)) * 0.16 + robotEase * Math.sin(t * 1.75) * 0.14;
    logo.rotation.y = Math.sin(t * 0.4) * 0.05 + robotEase * Math.sin(t * 0.9) * 0.045;
    logo.rotation.x = Math.cos(t * 0.6) * 0.03 + robotEase * Math.cos(t * 1.1) * 0.025;

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(frame);
  }
  let rafId = requestAnimationFrame(frame);

  function dispose() {
    cancelAnimationFrame(rafId);
    try { renderer.dispose(); } catch (e) { /* ignore */ }
  }

  return { state, resize, dispose };
}
