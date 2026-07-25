/* ═══════════════════════════════════════════════════════════════
   netrunner — breach protocol background
   One fullscreen quad, one fragment shader. No geometry, no lights,
   no loaders. Cheap enough to leave running, honest enough to skip.
   ═══════════════════════════════════════════════════════════════ */

import * as THREE from "../vendor/three.module.js";

const canvas = document.querySelector("#bg");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Respect the opt-out, and bail rather than fail if WebGL is unavailable.
if (canvas && !reduced) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  } catch (err) {
    console.warn("netrunner: WebGL unavailable, running without background layer", err);
  }

  if (renderer) init(renderer);
}

function init(renderer) {
  const scene = new THREE.Scene();
  // Orthographic camera + plane geometry = a fullscreen quad.
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uScroll: { value: 0 },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uAmber: { value: new THREE.Color(0.99, 0.87, 0.15) },
    uCyan: { value: new THREE.Color(0.16, 0.85, 0.95) },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      precision mediump float;

      uniform float uTime;
      uniform vec2  uRes;
      uniform float uScroll;
      uniform vec2  uPointer;
      uniform vec3  uAmber;
      uniform vec3  uCyan;

      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      // Hex distance field — the breach grid.
      float hexGrid(vec2 p, float scale) {
        p *= scale;
        vec2 h = vec2(1.0, 1.7320508);          // hex ratio
        vec2 a = mod(p, h) - h * 0.5;
        vec2 b = mod(p + h * 0.5, h) - h * 0.5;
        vec2 g = dot(a, a) < dot(b, b) ? a : b;
        return abs(max(abs(g.x) * 0.866 + g.y * 0.5, g.y));
      }

      void main() {
        // Aspect-correct coordinates, origin centre.
        vec2 uv = vUv;
        vec2 p  = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);

        // Scroll drags the field; pointer nudges it. Both are gentle.
        p.y += uScroll * 2.2;
        p += (uPointer - 0.5) * 0.12;

        vec3 col = vec3(0.0);

        // ── 1 · hex breach grid, two depths for parallax ──
        float g1 = hexGrid(p, 7.0);
        float g2 = hexGrid(p * 0.55 + vec2(0.3, uTime * 0.012), 7.0);

        float line1 = smoothstep(0.045, 0.0, g1) * 0.16;
        float line2 = smoothstep(0.030, 0.0, g2) * 0.09;
        col += uAmber * line1 + uCyan * line2;

        // ── 2 · vertical code rain, columnar ──
        float cols = 46.0;
        float ci   = floor(uv.x * cols);
        float seed = hash(vec2(ci, 3.0));

        float speed = 0.14 + seed * 0.42;
        float trail = fract(uv.y + uTime * speed + seed * 10.0 + uScroll * 0.8);

        // Head is bright, tail decays fast.
        float head = smoothstep(0.965, 1.0, trail);
        float tail = pow(trail, 9.0) * 0.55;

        // Quantise into glyph-sized cells so it reads as characters.
        float cell = step(0.42, hash(vec2(ci, floor(uv.y * 58.0 - uTime * speed * 58.0))));
        float rain = (head * 1.5 + tail) * cell;

        col += mix(uAmber, uCyan, seed) * rain * 0.34;

        // ── 3 · scan sweep, one slow pass ──
        float sweep = smoothstep(0.03, 0.0, abs(uv.y - fract(uTime * 0.06)));
        col += uCyan * sweep * 0.05;

        // ── 4 · falloff so content stays readable ──
        float edge = 1.0 - smoothstep(0.25, 0.95, length(uv - 0.5) * 1.25);
        col *= edge;

        // Overall restraint — this sits behind text, not in front of it.
        gl_FragColor = vec4(col, 1.0) * 0.62;
      }
    `,
  });

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quad.frustumCulled = false;
  scene.add(quad);

  /* ── sizing: DPR capped so phones don't render 3x pixels ── */
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(w, h, false);
    uniforms.uRes.value.set(w, h);
  }
  resize();
  window.addEventListener("resize", resize);

  /* ── input ── */
  window.addEventListener(
    "pointermove",
    (e) => {
      uniforms.uPointer.value.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    },
    { passive: true }
  );

  window.addEventListener(
    "scroll",
    () => {
      const max = document.body.scrollHeight - window.innerHeight;
      uniforms.uScroll.value = max > 0 ? window.scrollY / max : 0;
    },
    { passive: true }
  );

  /* ── loop: pause when the tab is hidden ── */
  const clock = new THREE.Clock();
  let running = true;
  let raf = 0;

  function frame() {
    raf = requestAnimationFrame(frame);
    uniforms.uTime.value = clock.getElapsedTime();
    renderer.render(scene, camera);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && running) {
      cancelAnimationFrame(raf);
      running = false;
    } else if (!document.hidden && !running) {
      clock.getDelta();          // drop the elapsed gap so nothing jumps
      running = true;
      frame();
    }
  });

  frame();
  canvas.style.opacity = "1";
}
