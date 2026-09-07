import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('scene');
const loader = document.getElementById('loader');
const speedInput = document.getElementById('speed');
const speedVal = document.getElementById('speedVal');
const cadVal = document.getElementById('cadVal');
const pauseBtn = document.getElementById('pause');

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87c5eb);
scene.fog = new THREE.Fog(0x87c5eb, 30, 110);

const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 400);
camera.position.set(6.2, 2.6, 7.5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.3, 0);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.52;
controls.minDistance = 3;
controls.maxDistance = 22;

const hemi = new THREE.HemisphereLight(0xbfe3ff, 0xe8d8b0, 0.9);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xfff2dd, 2.2);
sun.position.set(8, 12, 6);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -12;
sun.shadow.camera.right = 12;
sun.shadow.camera.top = 12;
sun.shadow.camera.bottom = -12;
scene.add(sun);

const rim = new THREE.DirectionalLight(0x88bbff, 1.1);
rim.position.set(-8, 4, -7);
scene.add(rim);

const skyGeo = new THREE.SphereGeometry(180, 24, 16);
const skyMat = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  uniforms: {
    top: { value: new THREE.Color(0x3d8fd1) },
    mid: { value: new THREE.Color(0x87c5eb) },
    bot: { value: new THREE.Color(0xf6e3c2) }
  },
  vertexShader: `varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader: `varying vec3 vP; uniform vec3 top; uniform vec3 mid; uniform vec3 bot;
    void main(){ float h = normalize(vP).y; vec3 c = h>0.0 ? mix(mid, top, pow(h,0.6)) : mix(mid, bot, pow(-h,0.5)); gl_FragColor=vec4(c,1.0); }`
});
scene.add(new THREE.Mesh(skyGeo, skyMat));

const sunBall = new THREE.Mesh(
  new THREE.SphereGeometry(6, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xfff4c8, fog: false })
);
sunBall.position.set(60, 42, -100);
scene.add(sunBall);

function mat(color, rough = 0.7, metal = 0.0) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
}

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(300, 120),
  mat(0x7fbf6a, 1)
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.02;
ground.receiveShadow = true;
scene.add(ground);

const road = new THREE.Mesh(
  new THREE.PlaneGeometry(300, 4.2),
  mat(0x3a3f47, 0.95)
);
road.rotation.x = -Math.PI / 2;
road.position.y = 0.01;
road.receiveShadow = true;
scene.add(road);

const dashGeo = new THREE.PlaneGeometry(1.6, 0.18);
const dashMat = new THREE.MeshBasicMaterial({ color: 0xfff6d8 });
const dashes = [];
for (let i = 0; i < 40; i++) {
  const d = new THREE.Mesh(dashGeo, dashMat);
  d.rotation.x = -Math.PI / 2;
  d.position.set(-140 + i * 7, 0.02, 0);
  scene.add(d);
  dashes.push(d);
}

const sideGeo = new THREE.BoxGeometry(1.2, 0.12, 0.12);
const sideMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
const sides = [];
for (let i = 0; i < 60; i++) {
  const s = new THREE.Mesh(sideGeo, sideMat);
  s.position.set(-150 + i * 5, 0.06, 2.1);
  const s2 = s.clone();
  s2.position.z = -2.1;
  scene.add(s, s2);
  sides.push(s, s2);
}

const treeTrunkM = mat(0x7a5230, 1);
const treeLeafM = mat(0x3e8e4f, 1);
const trees = [];
for (let i = 0; i < 22; i++) {
  const g = new THREE.Group();
  const h = 1.5 + Math.random() * 2.2;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, h, 8), treeTrunkM);
  trunk.position.y = h / 2;
  trunk.castShadow = true;
  const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.9 + Math.random() * 0.7, 12, 10), treeLeafM);
  leaf.position.y = h + 0.7;
  leaf.castShadow = true;
  g.add(trunk, leaf);
  g.position.set(-140 + Math.random() * 280, 0, (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 18));
  const sc = 0.7 + Math.random() * 0.8;
  g.scale.setScalar(sc);
  scene.add(g);
  trees.push({ m: g, z: g.position.z });
}

const clouds = [];
const cloudM = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: 0.92 });
for (let i = 0; i < 8; i++) {
  const g = new THREE.Group();
  for (let j = 0; j < 4; j++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(1 + Math.random() * 1.4, 14, 12), cloudM);
    s.position.set(j * 1.6 - 2, Math.random() * 0.8, Math.random() * 1.2);
    s.scale.y = 0.62;
    g.add(s);
  }
  g.position.set(-60 + Math.random() * 140, 12 + Math.random() * 10, -30 - Math.random() * 40);
  g.scale.setScalar(1 + Math.random() * 1.6);
  scene.add(g);
  clouds.push(g);
}

function tube(a, b, r, material) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 12), material);
  m.position.copy(a).addScaledVector(dir, 0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  m.castShadow = true;
  return m;
}

const bike = new THREE.Group();
scene.add(bike);

const frameM = mat(0xff4b2e, 0.35, 0.25);
const darkM = mat(0x1c2733, 0.6, 0.3);
const chromeM = mat(0xd7e3ee, 0.25, 0.8);

const wheelR = 0.68;
function makeWheel() {
  const w = new THREE.Group();
  const tire = new THREE.Mesh(new THREE.TorusGeometry(wheelR, 0.09, 14, 40), darkM);
  tire.castShadow = true;
  w.add(tire);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 12), chromeM);
  hub.rotation.x = Math.PI / 2;
  w.add(hub);
  for (let i = 0; i < 6; i++) {
    const sp = new THREE.Mesh(new THREE.BoxGeometry(0.03, wheelR * 2 - 0.08, 0.03), chromeM);
    sp.rotation.z = (i / 6) * Math.PI;
    w.add(sp);
  }
  return w;
}

const wheelF = makeWheel();
wheelF.position.set(1.15, wheelR, 0);
const wheelB = makeWheel();
wheelB.position.set(-1.05, wheelR, 0);
bike.add(wheelF, wheelB);

const bb = new THREE.Vector3(-0.05, 0.55, 0);
const seatTop = new THREE.Vector3(-0.62, 1.32, 0);
const headTop = new THREE.Vector3(1.02, 1.28, 0);
const rearAxle = new THREE.Vector3(-1.05, wheelR, 0);
const frontAxle = new THREE.Vector3(1.15, wheelR, 0);

bike.add(tube(bb, seatTop, 0.045, frameM));
bike.add(tube(bb, headTop, 0.05, frameM));
bike.add(tube(seatTop, headTop, 0.045, frameM));
bike.add(tube(bb, rearAxle, 0.035, frameM));
bike.add(tube(seatTop, rearAxle, 0.03, frameM));
bike.add(tube(headTop, frontAxle, 0.035, chromeM));
bike.add(tube(new THREE.Vector3(1.02, 1.28, 0), new THREE.Vector3(1.08, 1.62, 0), 0.035, chromeM));

const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.6, 10), darkM);
handle.rotation.x = Math.PI / 2;
handle.position.set(1.08, 1.62, 0);
handle.castShadow = true;
bike.add(handle);

const seat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.1, 0.26), darkM);
seat.position.set(-0.66, 1.38, 0);
seat.castShadow = true;
bike.add(seat);

const crank = new THREE.Group();
crank.position.copy(bb);
bike.add(crank);
const chainring = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.05, 24), chromeM);
chainring.rotation.x = Math.PI / 2;
crank.add(chainring);
const pedalL = new THREE.Group();
const pedalR = new THREE.Group();
const armGeo = new THREE.BoxGeometry(0.06, 0.34, 0.05);
const armL = new THREE.Mesh(armGeo, darkM);
armL.position.y = 0.17;
const armR = new THREE.Mesh(armGeo, darkM);
armR.position.y = -0.17;
pedalL.add(armL);
pedalR.add(armR);
const platGeo = new THREE.BoxGeometry(0.22, 0.05, 0.16);
const platL = new THREE.Mesh(platGeo, darkM);
platL.position.y = 0.34;
const platR = new THREE.Mesh(platGeo, darkM);
platR.position.y = -0.34;
pedalL.add(platL);
pedalR.add(platR);
pedalL.position.z = 0.14;
pedalR.position.z = -0.14;
crank.add(pedalL, pedalR);

const pelican = new THREE.Group();
scene.add(pelican);

const bodyG = new THREE.Group();
pelican.add(bodyG);

const white = mat(0xf7f4ec, 0.85);
const grey = mat(0xd9d5c9, 0.9);
const orange = mat(0xff8b2a, 0.6);
const blackM = mat(0x101418, 0.5);

const body = new THREE.Mesh(new THREE.SphereGeometry(0.52, 28, 22), white);
body.scale.set(1.25, 1.0, 0.85);
body.position.set(-0.15, 1.85, 0);
body.castShadow = true;
bodyG.add(body);

const belly = new THREE.Mesh(new THREE.SphereGeometry(0.4, 20, 16), grey);
belly.scale.set(1.1, 0.8, 0.75);
belly.position.set(-0.12, 1.68, 0);
bodyG.add(belly);

const neck = tube(new THREE.Vector3(0.32, 2.05, 0), new THREE.Vector3(0.62, 2.55, 0), 0.16, white);
bodyG.add(neck);

const headG = new THREE.Group();
headG.position.set(0.68, 2.68, 0);
bodyG.add(headG);

const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 24, 18), white);
head.castShadow = true;
headG.add(head);

const crest = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), grey);
crest.position.set(-0.18, 0.18, 0);
crest.scale.set(1.4, 0.7, 0.6);
headG.add(crest);

const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), blackM);
eyeL.position.set(0.14, 0.07, 0.18);
const eyeR = eyeL.clone();
eyeR.position.z = -0.18;
const glintGeo = new THREE.SphereGeometry(0.014, 8, 8);
const glintM = new THREE.MeshBasicMaterial({ color: 0xffffff });
const gl1 = new THREE.Mesh(glintGeo, glintM);
gl1.position.set(0.17, 0.09, 0.20);
const gl2 = gl1.clone();
gl2.position.z = -0.20;
headG.add(eyeL, eyeR, gl1, gl2);

const beakTop = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.95, 14), orange);
beakTop.rotation.z = -Math.PI / 2 - 0.08;
beakTop.position.set(0.68, -0.02, 0);
beakTop.castShadow = true;
headG.add(beakTop);

const pouch = new THREE.Mesh(new THREE.SphereGeometry(0.22, 18, 14), mat(0xffb36b, 0.75));
pouch.scale.set(1.9, 0.75, 0.55);
pouch.position.set(0.55, -0.2, 0);
headG.add(pouch);

const tail = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.55, 10), grey);
tail.rotation.z = Math.PI / 2 + 0.5;
tail.position.set(-0.78, 1.95, 0);
bodyG.add(tail);

function makeWing(side) {
  const g = new THREE.Group();
  g.position.set(0.05, 2.05, side * 0.38);
  const upper = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 12), white);
  upper.scale.set(1.3, 0.45, 0.35);
  upper.position.set(0.25, -0.15, side * 0.08);
  upper.castShadow = true;
  g.add(upper);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), grey);
  tip.scale.set(1.6, 0.35, 0.3);
  tip.position.set(0.62, -0.32, side * 0.12);
  g.add(tip);
  return g;
}
const wingL = makeWing(1);
const wingR = makeWing(-1);
bodyG.add(wingL, wingR);

function makeLeg(side) {
  const hip = new THREE.Group();
  hip.position.set(-0.18, 1.55, side * 0.22);
  const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.45, 10), orange);
  thigh.position.y = -0.22;
  thigh.castShadow = true;
  hip.add(thigh);
  const knee = new THREE.Group();
  knee.position.y = -0.45;
  hip.add(knee);
  const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.45, 10), orange);
  shin.position.y = -0.22;
  shin.castShadow = true;
  knee.add(shin);
  const foot = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.14), orange);
  foot.position.set(0.08, -0.46, 0);
  knee.add(foot);
  bodyG.add(hip);
  return { hip, knee };
}
const legL = makeLeg(0.55);
const legR = makeLeg(-0.55);
legL.hip.position.z = 0.18;
legR.hip.position.z = -0.18;

const scarfM = mat(0xff2e63, 0.7);
const scarfKnot = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), scarfM);
scarfKnot.position.set(0.42, 2.35, 0);
bodyG.add(scarfKnot);
const scarfSegs = [];
for (let i = 0; i < 6; i++) {
  const s = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.07, 0.16), scarfM);
  s.castShadow = true;
  s.position.set(0.15 - i * 0.26, 2.35, 0);
  bodyG.add(s);
  scarfSegs.push(s);
}

const dustGeo = new THREE.SphereGeometry(0.06, 8, 8);
const dustMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
const dust = [];
for (let i = 0; i < 60; i++) {
  const p = new THREE.Mesh(dustGeo, dustMat);
  p.position.set((Math.random() - 0.5) * 24, Math.random() * 1.2, (Math.random() - 0.5) * 8);
  p.userData.s = 0.5 + Math.random();
  scene.add(p);
  dust.push(p);
}

let speed = 14;
let paused = false;
let camMode = 'side';
let crankA = 0;

const camTargets = {
  side: [new THREE.Vector3(6.2, 2.6, 7.5), new THREE.Vector3(0, 1.4, 0)],
  chase: [new THREE.Vector3(-5.2, 2.8, 3.2), new THREE.Vector3(0.8, 1.5, 0)],
  front: [new THREE.Vector3(5.8, 1.9, -3.4), new THREE.Vector3(0.4, 1.7, 0)],
  low: [new THREE.Vector3(3.2, 0.7, 4.2), new THREE.Vector3(0, 1.2, 0)]
};

document.querySelectorAll('[data-cam]').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('[data-cam]').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    camMode = b.dataset.cam;
  };
});
speedInput.oninput = () => {
  speed = parseFloat(speedInput.value);
  speedVal.textContent = speed.toFixed(0);
};
pauseBtn.onclick = () => {
  paused = !paused;
  pauseBtn.textContent = paused ? 'play' : 'pause';
};

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

const clock = new THREE.Clock();
let intro = 0;

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  if (intro < 1) intro = Math.min(1, intro + dt * 0.7);
  const introE = 1 - Math.pow(1 - intro, 3);

  const run = paused ? 0 : 1;
  const v = speed * run;
  const wheelW = v * 0.55;
  const crankW = v * 0.5;

  crankA += crankW * dt;
  wheelF.rotation.z -= wheelW * dt;
  wheelB.rotation.z -= wheelW * dt;
  crank.rotation.z = -crankA;

  const cad = Math.abs(crankW) * 60 / (Math.PI * 2);
  cadVal.textContent = cad.toFixed(0);

  const bobF = 2.2 + v * 0.12;
  const bobA = 0.02 + v * 0.0022;
  const bob = Math.sin(t * bobF * 2) * bobA;
  const lean = 0.03 + v * 0.004;

  pelican.position.y = bob * introE;
  pelican.rotation.z = -lean * 0.4 * introE + Math.sin(t * bobF) * 0.012;
  pelican.rotation.x = Math.sin(t * 1.7) * 0.02;
  body.scale.set(1.25 + Math.sin(t * bobF * 2) * 0.02, 1.0 - Math.sin(t * bobF * 2) * 0.025, 0.85);

  headG.position.y = 2.68 + Math.sin(t * bobF * 2 + 1.2) * (0.03 + v * 0.002);
  headG.rotation.z = Math.sin(t * bobF + 0.5) * 0.08 - lean * 0.5;
  pouch.scale.set(1.9, 0.75 + Math.sin(t * 9) * 0.06 + v * 0.004, 0.55);
  pouch.position.y = -0.2 + Math.sin(t * 9 + 1) * 0.015;

  const reach = 0.55 + Math.sin(t * bobF) * 0.03;
  wingL.rotation.x = 0.25;
  wingR.rotation.x = -0.25;
  wingL.rotation.z = -reach + Math.sin(t * bobF * 2) * 0.05;
  wingR.rotation.z = -reach + Math.sin(t * bobF * 2) * 0.05;
  wingL.position.y = 2.05 + bob * 0.5;
  wingR.position.y = 2.05 + bob * 0.5;

  tail.rotation.z = Math.PI / 2 + 0.5 + Math.sin(t * 5) * 0.12;

  const pL = Math.sin(crankA) * 0.34;
  const pR = Math.sin(crankA + Math.PI) * 0.34;
  const qL = Math.cos(crankA) * 0.34;
  const qR = Math.cos(crankA + Math.PI) * 0.34;

  legL.hip.rotation.x = 0.1;
  legR.hip.rotation.x = -0.1;
  legL.hip.rotation.z = -0.5 + pL * 0.9;
  legR.hip.rotation.z = -0.5 + pR * 0.9;
  legL.knee.rotation.z = 0.7 + Math.max(0, -qL) * 1.2;
  legR.knee.rotation.z = 0.7 + Math.max(0, -qR) * 1.2;

  bike.rotation.z = Math.sin(t * bobF * 2 + 0.4) * 0.008;
  bike.position.y = Math.sin(t * bobF * 2 + 0.4) * 0.015;

  scarfSegs.forEach((s, i) => {
    const ph = t * (6 + v * 0.35) - i * 0.7;
    s.position.y = 2.35 + Math.sin(ph) * (0.06 + i * 0.035 + v * 0.004);
    s.position.x = 0.15 - i * (0.26 + v * 0.006);
    s.rotation.z = Math.sin(ph) * (0.25 + i * 0.08);
    s.rotation.y = Math.sin(ph * 0.7) * 0.3;
  });

  const move = v * dt * 1.6;
  dashes.forEach(d => {
    d.position.x -= move;
    if (d.position.x < -140) d.position.x += 280;
  });
  sides.forEach(s => {
    s.position.x -= move;
    if (s.position.x < -150) s.position.x += 300;
  });
  trees.forEach(tr => {
    tr.m.position.x -= move * 0.9;
    if (tr.m.position.x < -145) tr.m.position.x += 290;
  });
  clouds.forEach((c, i) => {
    c.position.x -= dt * (0.3 + i * 0.08 + v * 0.02);
    if (c.position.x < -80) c.position.x = 90;
  });
  dust.forEach(p => {
    p.position.x -= dt * (2 + v * 0.6) * p.userData.s;
    p.position.y += Math.sin(t * 3 + p.position.z * 5) * dt * 0.5;
    if (p.position.x < -12) {
      p.position.x = 12;
      p.position.y = Math.random() * 1.4;
    }
  });

  const cd = camTargets[camMode];
  const k = 1 - Math.pow(0.001, dt);
  const desPos = cd[0].clone();
  desPos.x += Math.sin(t * 0.8) * 0.15;
  desPos.y += Math.sin(t * 1.3) * 0.1 + v * 0.008;
  camera.position.lerp(desPos, paused ? k * 0.4 : k * 0.9);
  controls.target.lerp(cd[1], k);
  controls.update();

  renderer.render(scene, camera);
}
animate();

setTimeout(() => loader.classList.add('hide'), 600);
