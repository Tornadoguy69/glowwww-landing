import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import gsap from "gsap";

export function LiquidLogo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerEl = container;

    const w = containerEl.clientWidth;
    const h = containerEl.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(12, w / h, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    containerEl.appendChild(renderer.domElement);

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(w, h),
      1.5,
      0.4,
      0.85
    );
    bloomPass.threshold = 0.3;
    bloomPass.strength = 0.8;
    bloomPass.radius = 0.6;

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    function createEnvironmentMap(): THREE.Texture {
      const s = new THREE.Scene();
      const g = new THREE.PlaneGeometry(20, 20);
      const p1 = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0xffffff }));
      p1.position.set(10, 20, 10);
      p1.lookAt(0, 0, 0);
      s.add(p1);
      const p2 = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0xe3242b }));
      p2.position.set(-15, -10, 15);
      p2.lookAt(0, 0, 0);
      s.add(p2);
      const gen = new THREE.PMREMGenerator(renderer);
      gen.compileEquirectangularShader();
      const t = gen.fromScene(s).texture;
      gen.dispose();
      return t;
    }
    const envMap = createEnvironmentMap();

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 2.5);
    key.position.set(5, 10, 15);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xe3242b, 1.5);
    fill.position.set(-10, -5, 10);
    scene.add(fill);

    const rim = new THREE.PointLight(0xffffff, 3, 50);
    rim.position.set(0, 15, -10);
    scene.add(rim);

    const flare = new THREE.PointLight(0xffffff, 0, 30);
    flare.position.set(0, 0, 5);
    scene.add(flare);

    const opts = {
      metalness: 1.0,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMap,
      envMapIntensity: 2.0,
    };

    const redMat = new THREE.MeshPhysicalMaterial({
      ...opts,
      color: 0xe53935,
    });
    const blackMat = new THREE.MeshPhysicalMaterial({
      ...opts,
      color: 0x222222,
      roughness: 0.4,
      envMapIntensity: 0.2,
    });
    const whiteMat = new THREE.MeshPhysicalMaterial({
      ...opts,
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.4,
    });

    const logoGroup = new THREE.Group();
    scene.add(logoGroup);
    const SCALE = 0.63;
    logoGroup.scale.set(SCALE, SCALE, SCALE);

    const coreGeo = new THREE.CylinderGeometry(10.5, 10.5, 0.5, 64);
    const core = new THREE.Mesh(coreGeo, blackMat);
    core.rotation.x = Math.PI / 2;
    core.position.z = -1.0;
    logoGroup.add(core);

    const ringGeo = new THREE.TorusGeometry(11, 1.0, 64, 128);
    const ring = new THREE.Mesh(ringGeo, redMat);
    logoGroup.add(ring);

    function roundedPath(
      curve: THREE.Curve<THREE.Vector3>,
      radius: number,
      mat: THREE.Material
    ): THREE.Group {
      const g = new THREE.Group();
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 64, radius, 32, false),
        mat
      );
      g.add(tube);
      const cap = new THREE.SphereGeometry(radius, 32, 32);
      const s = new THREE.Mesh(cap, mat);
      s.position.copy(curve.getPoint(0));
      g.add(s);
      const e = new THREE.Mesh(cap, mat);
      e.position.copy(curve.getPoint(1));
      g.add(e);
      return g;
    }

    const TR = 1.5;

    const topRed = roundedPath(
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(3 - 12, 12 - 11, 0.1),
        new THREE.Vector3(6 - 12, 12 - 7, 0.1),
        new THREE.Vector3(18 - 12, 12 - 7, 0.1),
        new THREE.Vector3(21 - 12, 12 - 11, 0.1)
      ),
      TR,
      redMat
    );
    logoGroup.add(topRed);

    const bottomRed = roundedPath(
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(3 - 12, 12 - 13, 0.1),
        new THREE.Vector3(6 - 12, 12 - 17, 0.1),
        new THREE.Vector3(18 - 12, 12 - 17, 0.1),
        new THREE.Vector3(21 - 12, 12 - 13, 0.1)
      ),
      TR,
      redMat
    );
    logoGroup.add(bottomRed);

    const whiteEye = roundedPath(
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(5 - 12, 12 - 12, 0.2),
        new THREE.Vector3(8 - 12, 12 - 9, 0.2),
        new THREE.Vector3(16 - 12, 12 - 9, 0.2),
        new THREE.Vector3(19 - 12, 12 - 12, 0.2)
      ),
      TR,
      whiteMat
    );
    logoGroup.add(whiteEye);

    logoGroup.children.forEach((child) => {
      const c = child as THREE.Object3D & { userData: { originalScale?: THREE.Vector3 } };
      c.userData.originalScale = c.scale.clone();
      c.scale.set(0, 0, 0);
    });

    const particleGroup = new THREE.Group();
    scene.add(particleGroup);

    const dropGeo = new THREE.SphereGeometry(1, 32, 32);
    const particles: { mesh: THREE.Mesh; scale: number }[] = [];

    for (let i = 0; i < 150; i++) {
      let m = blackMat;
      if (i % 3 === 0) m = redMat;
      if (i % 8 === 0) m = whiteMat;

      const mesh = new THREE.Mesh(dropGeo, m);
      const r = 20 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      mesh.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      const s = Math.random() * 0.4 + 0.05;
      mesh.scale.set(s, s, s);
      particleGroup.add(mesh);
      particles.push({ mesh, scale: s });
    }

    const tl = gsap.timeline();

    gsap.to(particleGroup.rotation, {
      y: Math.PI * 3,
      z: Math.PI * 1,
      duration: 4,
      ease: "power2.inOut",
    });

    particles.forEach((p) => {
      tl.to(p.mesh.position, {
        x: 0,
        y: 0,
        z: 0,
        duration: 3 + Math.random() * 0.5,
        ease: "power3.in",
      }, 0);
      tl.to(p.mesh.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.4,
        ease: "power1.in",
      }, 2.6 + Math.random() * 0.4);
    });

    tl.to(flare, { intensity: 15, distance: 80, duration: 0.4, ease: "power2.in" }, 3.0);
    tl.to(bloomPass, { strength: 4.0, duration: 0.4, ease: "power2.in" }, 3.0);

    logoGroup.children.forEach((child, idx) => {
      const c = child as THREE.Object3D & { userData: { originalScale: THREE.Vector3 } };
      tl.to(c.scale, {
        x: c.userData.originalScale.x,
        y: c.userData.originalScale.y,
        z: c.userData.originalScale.z,
        duration: 2.5,
        ease: "elastic.out(1, 0.3)",
        delay: idx * 0.15,
      }, 3.1);
    });

    tl.to(flare, { intensity: 0, duration: 2.0, ease: "power2.out" }, 3.5);
    tl.to(bloomPass, { strength: 0.8, duration: 2.0, ease: "power2.out" }, 3.5);
    tl.to(camera.position, { z: 115, duration: 4.5, ease: "power3.inOut" }, 1.5);

    const clock = new THREE.Clock();
    let simTime = 0;
    let active = false;
    let raf: number;

    tl.eventCallback("onComplete", () => { active = true; });

    function loop() {
      raf = requestAnimationFrame(loop);
      const dt = clock.getDelta();
      const t = clock.getElapsedTime();

      logoGroup.position.y = Math.sin(t * 1.2) * 0.3;
      logoGroup.rotation.y = Math.sin(t * 0.4) * 0.08;
      logoGroup.rotation.x = Math.cos(t * 0.6) * 0.04;

      simTime += dt * 2.5;
      const burst = Math.max(
        0,
        Math.sin(simTime) * Math.sin(simTime * 0.3) * Math.sin(simTime * 2.2)
      );
      const bass = burst * 0.9 + Math.sin(t * 3) * 0.05;
      const mid = burst * 0.8 + Math.cos(t * 4) * 0.1;
      const treble = burst * 1.1;
      const overall = burst;

      if (active) {
        core.scale.x = 1 + bass * 0.03;
        core.scale.y = 1 + bass * 0.03;
        ring.scale.setScalar(1 + bass * 0.04);
        topRed.position.y = mid * 1.5;
        bottomRed.position.y = -(mid * 1.5);
        whiteEye.scale.y = 1 + treble * 0.4;
        whiteEye.scale.z = 1 + treble * 0.2;
        whiteMat.emissiveIntensity = 0.4 + treble * 2.5 + overall * 1.5;
        key.intensity = 2.5 + overall * 2;
        fill.intensity = 1.5 + bass * 1.5;
        bloomPass.strength = 0.8 + overall * 1.0;
      }

      composer.render();
    }

    loop();

    function onResize() {
      const ww = containerEl.clientWidth;
      const hh = containerEl.clientHeight;
      camera.aspect = ww / hh;
      camera.updateProjectionMatrix();
      renderer.setSize(ww, hh);
      composer.setSize(ww, hh);
    }
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      tl.kill();
      renderer.dispose();
      if (containerEl.contains(renderer.domElement)) {
        containerEl.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="hero__logo-liquid">
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "72%",
          aspectRatio: "1 / 1",
          transform: "translate(-50%, -50%)",
          borderRadius: "999px",
          background: "#030303",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
        }}
      />
    </div>
  );
}
