import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import gsap from "gsap";

const SVG_LOGO = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="11" fill="none" stroke="#E53935" stroke-width="2"/>
  <path d="M3 11C6 7 18 7 21 11" stroke="#E53935" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M3 13C6 17 18 17 21 13" stroke="#E53935" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M5 12C8 9 16 9 19 12" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`;

const PARTICLE_COUNT = 150000;

const particleVertexShader = `
attribute vec3 aTarget;
attribute vec3 aRandom;
attribute vec3 color;
attribute float aType;

varying vec3 vColor;

uniform float uTime;
uniform float uAssembly;
uniform float uAudio;

void main() {
  vColor = color;

  float delay = 0.0;
  if (aType > 1.5) delay = 0.3;

  float localProgress = clamp((uAssembly * 1.3) - delay, 0.0, 1.0);
  localProgress = 1.0 - pow(1.0 - localProgress, 4.0);

  float radius = length(aRandom.xy);
  float speed = 3.0 / (radius + 0.5);
  float angle = uTime * speed;
  mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));

  vec3 currentRandom = aRandom;
  currentRandom.xy *= rot;
  currentRandom.z += sin(uTime * 3.0 + radius) * 0.5;

  vec3 pos = mix(currentRandom, aTarget, localProgress);

  pos += normalize(aTarget + vec3(0.001)) * (uAudio * 0.5) * localProgress;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  float pSize = 3.0 + (uAudio * 2.0);
  gl_PointSize = pSize * (30.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const particleFragmentShader = `
varying vec3 vColor;
void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;
  float alpha = pow(1.0 - (dist * 2.0), 1.5);
  gl_FragColor = vec4(vColor, alpha);
}
`;

export function QuantumLogo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let w = container.clientWidth;
    let h = container.clientHeight;
    if (w === 0 || h === 0) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x010002, 0.002);

    const frustumSize = 28;
    const aspect = w / h;
    const camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2, (frustumSize * aspect) / 2,
      frustumSize / 2, frustumSize / -2, 0.1, 1000
    );
    camera.position.set(0, 0, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0.3, 0.2, 0.1);
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    const shaderUniforms = {
      uTime: { value: 0 },
      uAssembly: { value: 0 },
      uAudio: { value: 0 },
    };

    let particleSystem: THREE.Points | null = null;
    let disposed = false;

    const img = new Image();
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(SVG_LOGO);

    img.onload = () => {
      if (disposed) return;
      const canvas = document.createElement("canvas");
      canvas.width = 1024; canvas.height = 1024;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, 1024, 1024).data;
      const pixels: { x: number; y: number; r: number; g: number; b: number }[] = [];
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 50) {
          const idx = i / 4;
          pixels.push({ x: idx % 1024, y: Math.floor(idx / 1024), r: data[i] / 255, g: data[i + 1] / 255, b: data[i + 2] / 255 });
        }
      }
      if (!pixels.length || disposed) return;

      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(PARTICLE_COUNT * 3);
      const tgt = new Float32Array(PARTICLE_COUNT * 3);
      const rnd = new Float32Array(PARTICLE_COUNT * 3);
      const col = new Float32Array(PARTICLE_COUNT * 3);
      const typ = new Float32Array(PARTICLE_COUNT);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = pixels[Math.floor(Math.random() * pixels.length)];
        const tx = (p.x / 1024) * 24 - 12;
        const ty = -((p.y / 1024) * 24 - 12);
        const tz = (Math.random() - 0.5) * 0.8;
        const bias = Math.pow(Math.random(), 3);
        const rho = 4 + bias * 25;
        const theta = Math.random() * Math.PI * 2;
        const ys = (Math.random() - 0.5) * (1 - bias) * 8;
        const idx = i * 3;
        pos[idx] = rho * Math.cos(theta);
        pos[idx + 1] = rho * Math.sin(theta);
        pos[idx + 2] = ys - 2;
        tgt[idx] = tx; tgt[idx + 1] = ty; tgt[idx + 2] = tz;
        rnd[idx] = pos[idx]; rnd[idx + 1] = pos[idx + 1]; rnd[idx + 2] = pos[idx + 2];
        col[idx] = p.r; col[idx + 1] = p.g; col[idx + 2] = p.b;
        typ[i] = p.r > 0.9 && p.g > 0.9 ? 2 : 1;
      }

      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("aTarget", new THREE.BufferAttribute(tgt, 3));
      geo.setAttribute("aRandom", new THREE.BufferAttribute(rnd, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      geo.setAttribute("aType", new THREE.BufferAttribute(typ, 1));

      const mat = new THREE.ShaderMaterial({
        uniforms: shaderUniforms,
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      particleSystem = new THREE.Points(geo, mat);
      scene.add(particleSystem);

      setTimeout(() => {
        if (disposed) return;
        startAssembly();
      }, 1500);
    };

    const onResize = () => {
      const ww = container.clientWidth, hh = container.clientHeight, a = ww / hh;
      if (ww === 0 || hh === 0) return;
      camera.left = (-frustumSize * a) / 2; camera.right = (frustumSize * a) / 2;
      camera.top = frustumSize / 2; camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(ww, hh);
      composer.setSize(ww, hh);
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(container);
    window.addEventListener("resize", onResize);

    const STATE = { phase: "GALAXY", time: 0, simulatedAudio: 0 };

    const startAssembly = () => {
      if (STATE.phase !== "GALAXY") return;
      STATE.phase = "ASSEMBLING";

      const tl = gsap.timeline({
        onComplete: () => {
          STATE.phase = "LINKED";
        },
      });

      tl.to(shaderUniforms.uAssembly, { value: 1, duration: 4, ease: "power2.inOut" }, 0);
      tl.to(bloomPass, { strength: 0.8, radius: 1, duration: 0.4, ease: "power2.in" }, 3.5);
      tl.to(bloomPass, { strength: 0.3, radius: 0.5, duration: 1.5, ease: "power2.out" }, 3.9);
    };

    const timer = new THREE.Timer();
    let raf: number;

    function loop() {
      if (disposed) return;
      raf = requestAnimationFrame(loop);
      timer.update();
      const delta = timer.getDelta();
      STATE.time += delta;
      
      if (particleSystem && shaderUniforms.uTime) {
        if (STATE.phase === "LINKED") {
          const breath = Math.pow(Math.sin(STATE.time * 2), 4) * 0.2;
          STATE.simulatedAudio += (breath - STATE.simulatedAudio) * 0.1;
        }
        shaderUniforms.uTime.value = STATE.time;
        shaderUniforms.uAudio.value = STATE.simulatedAudio;
      }
      try {
        composer.render();
      } catch {
        /* swallow render errors after dispose */
      }
    }
    loop();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      gsap.killTweensOf(shaderUniforms.uAssembly);
      gsap.killTweensOf(bloomPass);
      renderer.dispose();
      composer.dispose?.();
      bloomPass.dispose?.();
      
      if (particleSystem) {
        particleSystem.geometry.dispose();
        (particleSystem.material as THREE.Material).dispose();
      }
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="quantum-wrap" style={{ position: "relative", width: "100%", height: "100%", minHeight: "300px" }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, zIndex: 1 }} />
      <div className="quantum-vignette" />
    </div>
  );
}
