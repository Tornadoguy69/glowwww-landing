import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import gsap from "gsap";

const SESSION_KEY = "agent-overlay-shown";

type Props = {
  open: boolean;
  onClose: () => void;
  /** When true, play even if already shown this session (e.g. test button). */
  force?: boolean;
};

export function AgentModeOverlay({ open, onClose, force = false }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<"loading" | "playing" | "robot" | "fading">("loading");
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) {
      setPhase("loading");
      return;
    }

    if (sessionStorage.getItem(SESSION_KEY) === "1" && !force) {
      onCloseRef.current();
      return;
    }

    // Wait one frame so AnimatePresence has mounted the canvas container.
    let cancelled = false;
    let cleanupScene: (() => void) | undefined;

    const frame = requestAnimationFrame(() => {
      if (cancelled) return;
      const container = containerRef.current;
      if (!container) {
        onCloseRef.current();
        return;
      }

      cleanupScene = setupScene(container, {
        setPhase,
        onFinished: () => {
          sessionStorage.setItem(SESSION_KEY, "1");
          setPhase("fading");
          setTimeout(() => onCloseRef.current(), 1200);
        },
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      cleanupScene?.();
    };
  }, [open, force]);

  const handleClose = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setPhase("fading");
    setTimeout(() => onCloseRef.current(), 600);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="agent-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "fading" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: phase === "fading" ? 0.6 : 0.8 }}
          onClick={handleClose}
        >
          <div
            ref={containerRef}
            className="agent-overlay__canvas"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="agent-overlay__top">
            <motion.div
              className="agent-overlay__caption"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: phase === "fading" ? 0 : 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="agent-overlay__pill">
                {phase === "loading" && "INITIALIZING"}
                {phase === "playing" && "AGENT MODE"}
                {phase === "robot" && "AGENT READY"}
                {phase === "fading" && "READY"}
              </span>
            </motion.div>
          </div>

          <div className="agent-overlay__bottom">
            <motion.button
              type="button"
              className="agent-overlay__skip"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "fading" ? 0 : 1 }}
              transition={{ duration: 0.4 }}
            >
              Skip
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** @deprecated Prefer AgentModeOverlay with open/onClose props */
export default function AgentOverlay({ onClose }: { onClose: () => void }) {
  return <AgentModeOverlay open onClose={onClose} force />;
}

type SceneCallbacks = {
  setPhase: (p: "loading" | "playing" | "robot" | "fading") => void;
  onFinished: () => void;
};

function setupScene(container: HTMLDivElement, { setPhase, onFinished }: SceneCallbacks) {
  setPhase("loading");

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020202);

  const camera = new THREE.PerspectiveCamera(12, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 8);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.04;
  controls.enabled = false;
  controls.minDistance = 50;
  controls.maxDistance = 150;
  controls.enablePan = false;

  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
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

  function createEnvironmentMap() {
    const envScene = new THREE.Scene();
    const lightGeo = new THREE.PlaneGeometry(20, 20);
    const lightMat1 = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lightMat2 = new THREE.MeshBasicMaterial({ color: 0xe3242b });
    const panel1 = new THREE.Mesh(lightGeo, lightMat1);
    panel1.position.set(10, 20, 10);
    panel1.lookAt(0, 0, 0);
    envScene.add(panel1);
    const panel2 = new THREE.Mesh(lightGeo, lightMat2);
    panel2.position.set(-15, -10, 15);
    panel2.lookAt(0, 0, 0);
    envScene.add(panel2);
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const tex = pmremGenerator.fromScene(envScene).texture;
    pmremGenerator.dispose();
    return tex;
  }
  const studioEnvMap = createEnvironmentMap();

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
  keyLight.position.set(5, 10, 15);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xe3242b, 1.5);
  fillLight.position.set(-10, -5, 10);
  scene.add(fillLight);
  const rimLight = new THREE.PointLight(0xffffff, 3, 50);
  rimLight.position.set(0, 15, -10);
  scene.add(rimLight);
  const flareLight = new THREE.PointLight(0xffffff, 0, 30);
  flareLight.position.set(0, 0, 5);
  scene.add(flareLight);

  const baseLiquidOpts = {
    metalness: 1.0,
    roughness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    envMap: studioEnvMap,
    envMapIntensity: 2.0,
  } as const;

  const redMat = new THREE.MeshPhysicalMaterial({ ...baseLiquidOpts, color: 0xe53935 });
  const blackMat = new THREE.MeshPhysicalMaterial({
    ...baseLiquidOpts,
    color: 0x222222,
    roughness: 0.4,
    envMapIntensity: 0.2,
  });
  const whiteMat = new THREE.MeshPhysicalMaterial({
    ...baseLiquidOpts,
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.4,
  });

  const logoGroup = new THREE.Group();
  scene.add(logoGroup);
  const SVG_SCALE = 0.63;
  logoGroup.scale.set(SVG_SCALE, SVG_SCALE, SVG_SCALE);

  const coreGeo = new THREE.CylinderGeometry(10.5, 10.5, 0.5, 64);
  const coreMesh = new THREE.Mesh(coreGeo, blackMat);
  coreMesh.rotation.x = Math.PI / 2;
  coreMesh.position.z = -1.0;
  logoGroup.add(coreMesh);

  const ringGeo = new THREE.TorusGeometry(11, 1.0, 64, 128);
  const ringMesh = new THREE.Mesh(ringGeo, redMat);
  logoGroup.add(ringMesh);

  function createRoundedPath(curve: THREE.Curve<THREE.Vector3>, radius: number, material: THREE.Material) {
    const group = new THREE.Group();
    const tubeGeo = new THREE.TubeGeometry(curve, 64, radius, 32, false);
    const tubeMesh = new THREE.Mesh(tubeGeo, material);
    group.add(tubeMesh);
    const capGeo = new THREE.SphereGeometry(radius, 32, 32);
    const capStart = new THREE.Mesh(capGeo, material);
    capStart.position.copy(curve.getPoint(0));
    group.add(capStart);
    const capEnd = new THREE.Mesh(capGeo, material);
    capEnd.position.copy(curve.getPoint(1));
    group.add(capEnd);
    return group;
  }

  const PATH_TUBE_RADIUS = 1.5;

  const curveTopRed = new THREE.CubicBezierCurve3(
    new THREE.Vector3(3 - 12, 12 - 11, 0.1),
    new THREE.Vector3(6 - 12, 12 - 7, 0.1),
    new THREE.Vector3(18 - 12, 12 - 7, 0.1),
    new THREE.Vector3(21 - 12, 12 - 11, 0.1)
  );
  const topRedGroup = createRoundedPath(curveTopRed, PATH_TUBE_RADIUS, redMat);
  logoGroup.add(topRedGroup);

  const curveBottomRed = new THREE.CubicBezierCurve3(
    new THREE.Vector3(3 - 12, 12 - 13, 0.1),
    new THREE.Vector3(6 - 12, 12 - 17, 0.1),
    new THREE.Vector3(18 - 12, 12 - 17, 0.1),
    new THREE.Vector3(21 - 12, 12 - 13, 0.1)
  );
  const bottomRedGroup = createRoundedPath(curveBottomRed, PATH_TUBE_RADIUS, redMat);
  logoGroup.add(bottomRedGroup);

  const curveWhite = new THREE.CubicBezierCurve3(
    new THREE.Vector3(5 - 12, 12 - 12, 0.2),
    new THREE.Vector3(8 - 12, 12 - 9, 0.2),
    new THREE.Vector3(16 - 12, 12 - 9, 0.2),
    new THREE.Vector3(19 - 12, 12 - 12, 0.2)
  );
  const whiteEyeGroup = createRoundedPath(curveWhite, PATH_TUBE_RADIUS, whiteMat);
  logoGroup.add(whiteEyeGroup);

  const eyeGeo = new THREE.SphereGeometry(1.3, 32, 32);
  const eyeLeftBase = new THREE.Vector3(-3.8, 2.0, 0.4);
  const eyeRightBase = new THREE.Vector3(3.8, 2.0, 0.4);
  const leftEye = new THREE.Mesh(eyeGeo, whiteMat);
  leftEye.position.copy(eyeLeftBase);
  leftEye.scale.set(0, 0, 0);
  logoGroup.add(leftEye);
  const rightEye = new THREE.Mesh(eyeGeo, whiteMat);
  rightEye.position.copy(eyeRightBase);
  rightEye.scale.set(0, 0, 0);
  logoGroup.add(rightEye);

  logoGroup.children.forEach((child) => {
    child.userData.originalScale = child.scale.clone();
    child.scale.set(0, 0, 0);
  });

  const particleGroup = new THREE.Group();
  scene.add(particleGroup);
  const particles: { mesh: THREE.Mesh; initialScale: number }[] = [];
  const numParticles = 150;
  const dropletGeo = new THREE.SphereGeometry(1, 32, 32);
  for (let i = 0; i < numParticles; i++) {
    let mat: THREE.Material = blackMat;
    if (i % 3 === 0) mat = redMat;
    if (i % 8 === 0) mat = whiteMat;
    const mesh = new THREE.Mesh(dropletGeo, mat);
    const radius = 20 + Math.random() * 20;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    mesh.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );
    const scale = Math.random() * 0.4 + 0.05;
    mesh.scale.set(scale, scale, scale);
    particleGroup.add(mesh);
    particles.push({ mesh, initialScale: scale });
  }

  const morphState = { progress: 0 };
  const eyeAnimState = { blinkMultiplier: 1 };
  const eyeTarget = new THREE.Vector2(0, 0);

  const tl = gsap.timeline();
  gsap.to(particleGroup.rotation, { y: Math.PI * 3, z: Math.PI * 1, duration: 4, ease: "power2.inOut" });
  particles.forEach((p) => {
    tl.to(p.mesh.position, { x: 0, y: 0, z: 0, duration: 3 + Math.random() * 0.5, ease: "power3.in" }, 0);
    tl.to(p.mesh.scale, { x: 0, y: 0, z: 0, duration: 0.4, ease: "power1.in" }, 2.6 + Math.random() * 0.4);
  });
  tl.to(flareLight, { intensity: 15, distance: 80, duration: 0.4, ease: "power2.in" }, 3.0);
  tl.to(bloomPass, { strength: 4.0, duration: 0.4, ease: "power2.in" }, 3.0);
  logoGroup.children.forEach((child) => {
    if (child !== leftEye && child !== rightEye) {
      tl.to(
        child.scale,
        {
          x: child.userData.originalScale.x,
          y: child.userData.originalScale.y,
          z: child.userData.originalScale.z,
          duration: 2.5,
          ease: "elastic.out(1, 0.3)",
        },
        3.1
      );
    }
  });
  tl.to(flareLight, { intensity: 0, duration: 2.0, ease: "power2.out" }, 3.5);
  tl.to(bloomPass, { strength: 0.8, duration: 2.0, ease: "power2.out" }, 3.5);
  tl.to(camera.position, { z: 115, duration: 4.5, ease: "power3.inOut" }, 1.5);

  tl.call(() => setPhase("playing"), [], 6.0);
  tl.to(morphState, { progress: 1, duration: 1.4, ease: "power2.inOut" }, 7.0);
  tl.call(() => setPhase("robot"), [], 8.6);
  tl.call(() => onFinished(), [], 11.0);

  const clock = new THREE.Clock();
  let simTime = 0;
  let rafId = 0;

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", onResize);

  function animate() {
    rafId = requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();
    simTime += delta * 2.5;
    const burst = Math.max(0, Math.sin(simTime) * Math.sin(simTime * 0.3) * Math.sin(simTime * 2.2));
    const bass = burst * 0.9 + Math.sin(elapsedTime * 3) * 0.05;
    const mid = burst * 0.8 + Math.cos(elapsedTime * 4) * 0.1;
    const treble = burst * 1.1;
    const overall = burst;

    const currentHaloBaseY = morphState.progress * 3.0;
    const currentLogoScale = 1 - morphState.progress;
    const currentEyeScale = morphState.progress;

    whiteEyeGroup.scale.setScalar(currentLogoScale);
    bottomRedGroup.scale.setScalar(currentLogoScale);
    ringMesh.scale.setScalar(1 + bass * 0.04);
    coreMesh.scale.x = 1 + bass * 0.03;
    coreMesh.scale.y = 1 + bass * 0.03;

    topRedGroup.position.y =
      currentHaloBaseY + morphState.progress * bass * 2.0 + (1 - morphState.progress) * mid * 1.5;
    bottomRedGroup.position.y = -(mid * 1.5);

    if (morphState.progress > 0) {
      if (Math.random() < 0.015) {
        eyeTarget.x = (Math.random() - 0.5) * 5;
        eyeTarget.y = (Math.random() - 0.5) * 3;
      }
      if (Math.random() < 0.005) {
        eyeTarget.x = 0;
        eyeTarget.y = 0;
      }
      leftEye.position.x += (eyeLeftBase.x + eyeTarget.x - leftEye.position.x) * delta * 5;
      leftEye.position.y += (eyeLeftBase.y + eyeTarget.y - leftEye.position.y) * delta * 5;
      rightEye.position.x += (eyeRightBase.x + eyeTarget.x - rightEye.position.x) * delta * 5;
      rightEye.position.y += (eyeRightBase.y + eyeTarget.y - rightEye.position.y) * delta * 5;
      if (Math.random() < 0.008 && eyeAnimState.blinkMultiplier === 1) {
        gsap.to(eyeAnimState, { blinkMultiplier: 0.05, duration: 0.1, yoyo: true, repeat: 1 });
      }
    }

    if (currentLogoScale > 0) {
      whiteEyeGroup.scale.y = currentLogoScale + treble * 0.4;
      whiteEyeGroup.scale.z = currentLogoScale + treble * 0.2;
    }
    if (currentEyeScale > 0) {
      const dynamicEyeScale = currentEyeScale + treble * 0.25;
      leftEye.scale.set(dynamicEyeScale, dynamicEyeScale * eyeAnimState.blinkMultiplier, dynamicEyeScale);
      rightEye.scale.set(dynamicEyeScale, dynamicEyeScale * eyeAnimState.blinkMultiplier, dynamicEyeScale);
    }

    const floatRotX = Math.cos(elapsedTime * 0.6) * 0.04;
    const floatRotY = Math.sin(elapsedTime * 0.4) * 0.08;
    const tiltX = morphState.progress * (eyeTarget.y * -0.04);
    const tiltY = morphState.progress * (eyeTarget.x * 0.04);
    logoGroup.rotation.x += (floatRotX + tiltX - logoGroup.rotation.x) * delta * 5;
    logoGroup.rotation.y += (floatRotY + tiltY - logoGroup.rotation.y) * delta * 5;
    logoGroup.position.y += (Math.sin(elapsedTime * 1.2) * 0.3 - logoGroup.position.y) * delta * 5;

    whiteMat.emissiveIntensity = 0.4 + morphState.progress * 0.5 + treble * 2.5 + overall * 1.5;
    keyLight.intensity = 2.5 + overall * 2;
    fillLight.intensity = 1.5 + bass * 1.5;
    bloomPass.strength = 0.8 + overall * 1.0;

    composer.render();
  }
  animate();

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", onResize);
    tl.kill();
    gsap.killTweensOf(particleGroup.rotation);
    gsap.killTweensOf(eyeAnimState);
    controls.dispose();
    composer.dispose();
    bloomPass.dispose();
    renderer.dispose();
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        const mat = mesh.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      }
    });
    studioEnvMap.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  };
}
