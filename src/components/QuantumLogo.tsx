import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import gsap from "gsap";

const SVG_LOGO = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="11" fill="none" stroke="#E53935" stroke-width="2"/>
  <path d="M3 11C6 7 18 7 21 11" stroke="#E53935" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M3 13C6 17 18 17 21 13" stroke="#E53935" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M5 12C8 9 16 9 19 12" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`;

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

    /* Phones don't get the full field. The mark still assembles; it just costs less. */
    const particleCount = window.matchMedia("(max-width: 800px)").matches ? 48000 : 140000;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x010002, 0.002);

    /* Wider than the mark, so the glow dies out inside the canvas instead of
       being cut into a rectangle at the buffer edge. */
    const frustumSize = 40;
    const aspect = w / h;
    const camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2, (frustumSize * aspect) / 2,
      frustumSize / 2, frustumSize / -2, 0.1, 1000
    );
    camera.position.set(0, 0, 100);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const renderScene = new RenderPass(scene, camera, null, new THREE.Color(0, 0, 0), 0);
    /* A short canvas turns the same pixel bloom into a halo around the ring. */
    const bloomLevels = (height: number, peak: boolean) => {
      const compact = height < 420;
      if (peak) return compact ? { strength: 0.42, radius: 0.38 } : { strength: 0.8, radius: 1 };
      return compact ? { strength: 0.2, radius: 0.22 } : { strength: 0.3, radius: 0.5 };
    };
    const settle0 = bloomLevels(h, false);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), settle0.strength, settle0.radius, 0.1);
    /* Outside the circle the canvas is transparent, so there is no square.
       Inside it, empty space stays black — on a light page those cutouts
       would otherwise show the paper and the mark would look washed out. */
    const alphaPass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        uAspect: { value: aspect },
        /* 0 while the field is gathering, 1 once the ring has locked. */
        uContain: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uAspect;
        uniform float uContain;
        varying vec2 vUv;
        void main() {
          vec4 c = texture2D(tDiffuse, vUv);
          vec2 p = vUv - 0.5;
          p.x *= uAspect;
          float dist = length(p);
          /* Black fill stops at the outer ring. Bright particles carry the rim,
             so the disc does not leave a dark halo on a light page. Once the
             ring has locked, that shine may not keep going: on a short mobile
             canvas the bloom otherwise becomes a glare around the mark. */
          float inside = 1.0 - smoothstep(0.255, 0.285, dist);
          float luma = max(c.r, max(c.g, c.b));
          float glow = smoothstep(0.16, 0.42, luma);
          float edge = mix(2.4, 0.308, uContain);
          float edgeOut = mix(2.8, 0.342, uContain);
          float rim = 1.0 - smoothstep(edge, edgeOut, dist);
          float alpha = max(inside, glow * rim);
          float hole = inside * (1.0 - smoothstep(0.05, 0.16, luma));
          vec3 rgb = mix(c.rgb, vec3(0.0), hole);
          gl_FragColor = vec4(rgb, alpha);
        }
      `,
    });
    alphaPass.material.blending = THREE.NoBlending;
    alphaPass.material.transparent = false;
    alphaPass.material.depthTest = false;
    alphaPass.material.depthWrite = false;
    const drawAlpha = alphaPass.render.bind(alphaPass);
    alphaPass.render = (gl, writeBuffer, readBuffer, deltaTime, maskActive) => {
      if (alphaPass.renderToScreen) {
        gl.setRenderTarget(null);
        gl.setClearColor(0x000000, 0);
        gl.clear(true, true, true);
      }
      drawAlpha(gl, writeBuffer, readBuffer, deltaTime, maskActive);
    };

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composer.addPass(alphaPass);

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
      const pos = new Float32Array(particleCount * 3);
      const tgt = new Float32Array(particleCount * 3);
      const rnd = new Float32Array(particleCount * 3);
      const col = new Float32Array(particleCount * 3);
      const typ = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
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

    const STATE = { phase: "GALAXY", time: 0, simulatedAudio: 0 };

    const onResize = () => {
      const ww = container.clientWidth, hh = container.clientHeight, a = ww / hh;
      if (ww === 0 || hh === 0) return;
      camera.left = (-frustumSize * a) / 2; camera.right = (frustumSize * a) / 2;
      camera.top = frustumSize / 2; camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(ww, hh);
      composer.setSize(ww, hh);
      if (alphaPass.uniforms.uAspect) alphaPass.uniforms.uAspect.value = a;
      if (STATE.phase === "LINKED") {
        const next = bloomLevels(hh, false);
        bloomPass.strength = next.strength;
        bloomPass.radius = next.radius;
      }
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(container);
    window.addEventListener("resize", onResize);

    const startAssembly = () => {
      if (STATE.phase !== "GALAXY") return;
      STATE.phase = "ASSEMBLING";

      const tl = gsap.timeline({
        onComplete: () => {
          STATE.phase = "LINKED";
        },
      });

      tl.to(shaderUniforms.uAssembly, { value: 1, duration: 4, ease: "power2.inOut" }, 0);
      tl.to(bloomPass, { ...bloomLevels(container.clientHeight, true), duration: 0.4, ease: "power2.in" }, 3.5);
      tl.to(bloomPass, { ...bloomLevels(container.clientHeight, false), duration: 1.5, ease: "power2.out" }, 3.9);
    };

    const timer = new THREE.Timer();
    let raf = 0;
    let onScreen = true;
    const io = new IntersectionObserver((entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting);
    });
    io.observe(container);

    const loop = () => {
      if (disposed) return;
      raf = requestAnimationFrame(loop);
      const assembled = shaderUniforms.uAssembly.value;
      const containT = Math.min(1, Math.max(0, (assembled - 0.75) / 0.2));
      if (alphaPass.uniforms.uContain) {
        alphaPass.uniforms.uContain.value = containT * containT * (3 - 2 * containT);
      }
      /* Parked in the wordmark: keep the scene, stop paying for frames. */
      if (!onScreen || document.hidden || container.closest("[data-docked='1']")) return;
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
    };
    loop();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      gsap.killTweensOf(shaderUniforms.uAssembly);
      gsap.killTweensOf(bloomPass);
      renderer.dispose();
      composer.dispose?.();
      bloomPass.dispose?.();
      alphaPass.dispose();
      
      if (particleSystem) {
        particleSystem.geometry.dispose();
        (particleSystem.material as THREE.Material).dispose();
      }
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="quantum-wrap" style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, zIndex: 1 }} />
    </div>
  );
}
