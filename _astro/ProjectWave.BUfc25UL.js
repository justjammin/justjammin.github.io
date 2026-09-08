import{j as t}from"./jsx-runtime.D_zvdyIk.js";import{r}from"./index.qNTDzdXh.js";const S=`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#121212">
  <title>Character Wave</title>
  <style>
    :root {
      color-scheme: dark;
      font-family: "SFMono-Regular", "Cascadia Code", "Roboto Mono", Consolas, monospace;
      background: #121212;
    }

    * {
      box-sizing: border-box;
    }

    html,
    body {
      width: 100%;
      height: 100%;
      margin: 0;
      overflow: hidden;
      background: #121212;
    }

    body {
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    button {
      font: inherit;
    }

    .stage {
      --pointer-x: 50%;
      --pointer-y: 50%;
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 440px;
      overflow: hidden;
      isolation: isolate;
      background:
        radial-gradient(
          circle at var(--pointer-x) var(--pointer-y),
          rgba(255, 255, 255, 0.028),
          transparent 24rem
        ),
        #141414;
      perspective: 1100px;
      touch-action: none;
      cursor: crosshair;
    }

    .stage::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 4;
      pointer-events: none;
      background: radial-gradient(
        ellipse at center,
        transparent 34%,
        rgba(0, 0, 0, 0.13) 70%,
        rgba(0, 0, 0, 0.36) 120%
      );
    }

    .stage::after {
      content: "";
      position: absolute;
      inset: -20%;
      z-index: 0;
      pointer-events: none;
      opacity: 0.16;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.32'/%3E%3C/svg%3E");
      transform: rotate(7deg);
      mix-blend-mode: soft-light;
    }

    .deck {
      position: absolute;
      inset: 0;
      z-index: 2;
      transform-style: preserve-3d;
    }

    .card {
      --focus: 0;
      position: absolute;
      top: 50%;
      left: 50%;
      width: clamp(122px, 10.45vw, 164px);
      aspect-ratio: 0.69;
      padding: clamp(8px, 0.78vw, 12px);
      border: 0;
      border-radius: clamp(10px, 1.05vw, 16px);
      color: #f3f0e9;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.045), transparent 34%),
        var(--card-color);
      box-shadow:
        0 calc(7px + var(--focus) * 20px) calc(13px + var(--focus) * 40px)
          rgba(0, 0, 0, calc(0.25 + var(--focus) * 0.34)),
        inset 0 1px rgba(255, 255, 255, 0.06),
        inset 0 0 0 1px rgba(0, 0, 0, 0.24);
      appearance: none;
      outline: none;
      transform-style: preserve-3d;
      will-change: transform, opacity, filter;
      cursor: pointer;
    }

    .card::after {
      content: "";
      position: absolute;
      inset: 0;
      border: 1px solid rgba(255, 255, 255, calc(0.035 + var(--focus) * 0.12));
      border-radius: inherit;
      pointer-events: none;
    }

    .card:focus-visible::after {
      border-color: rgba(255, 255, 255, 0.72);
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.12);
    }

    .portrait {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      overflow: hidden;
      border-radius: clamp(7px, 0.75vw, 11px);
      background: rgba(8, 9, 9, 0.24);
      box-shadow:
        inset 0 1px rgba(255, 255, 255, 0.04),
        inset 0 -16px 28px rgba(0, 0, 0, 0.13);
      transform: translateZ(7px);
    }

    .portrait img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: saturate(0.88) contrast(1.02);
    }

    .identity {
      display: grid;
      place-items: center;
      gap: clamp(2px, 0.25vw, 4px);
      margin-top: clamp(7px, 0.72vw, 11px);
      text-align: center;
      transform: translateZ(8px);
    }

    .name {
      max-width: 100%;
      overflow: hidden;
      color: rgba(255, 255, 255, 0.93);
      font-size: clamp(8px, 0.72vw, 11px);
      font-weight: 500;
      line-height: 1.15;
      letter-spacing: -0.035em;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .role {
      max-width: 100%;
      overflow: hidden;
      color: rgba(255, 255, 255, 0.48);
      font-size: clamp(4px, 0.37vw, 6px);
      line-height: 1.15;
      letter-spacing: -0.01em;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .follow {
      margin-top: clamp(3px, 0.35vw, 6px);
      padding: clamp(3px, 0.28vw, 4px) clamp(9px, 0.85vw, 13px);
      border: 1px solid rgba(255, 255, 255, 0.055);
      border-radius: 999px;
      color: rgba(255, 255, 255, 0.82);
      background: rgba(0, 0, 0, 0.86);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.42);
      font-size: clamp(3px, 0.29vw, 5px);
      font-weight: 700;
      line-height: 1;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .card[aria-current="true"] .follow {
      color: #fff;
      background: #050505;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    @media (max-width: 680px) {
      .stage {
        min-height: 520px;
      }

      .card {
        width: clamp(112px, 31vw, 138px);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .card {
        will-change: auto;
      }
    }
  </style>
</head>
<body>
  <main class="stage" id="stage" aria-label="Interactive character card wave">
    <h1 class="sr-only">Character Wave</h1>
    <p class="sr-only">
      Move the pointer or use the arrow keys to explore the cards.
      Press space to change the wave orientation.
    </p>
    <div class="deck" id="deck" data-testid="deck"></div>
  </main>

  <script>
    (() => {
      const portraits = {};
      const stage = document.querySelector("#stage");
      const deck = document.querySelector("#deck");
      const cards = profiles.map((profile, index) => {
        const card = document.createElement("button");
        card.className = "card";
        card.type = "button";
        card.dataset.index = String(index);
        card.setAttribute("aria-label", \`Focus \${profile.name}, \${profile.role}\`);
        card.style.setProperty("--card-color", profile.color);
        card.innerHTML = \`
          <span class="portrait">
            <img src="\${portraits[profile.portrait]}" alt="Generated portrait of \${profile.name}">
          </span>
          <span class="identity">
            <span class="name">\${profile.name}</span>
            <span class="role">\${profile.role}</span>
            <span class="follow" aria-hidden="true">Follow me</span>
          </span>\`;
        deck.append(card);
        return card;
      });

      const state = {
        phase: 2,
        targetPhase: 2,
        basePhase: 2,
        orientation: window.innerWidth < 680 ? 1 : 0,
        targetOrientation: window.innerWidth < 680 ? 1 : 0,
        pointerX: 0,
        pointerY: 0,
        tiltX: 0,
        tiltY: 0,
        active: false,
        manualOrientation: false,
        lastInput: performance.now()
      };

      const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const count = cards.length;

      function wrappedDelta(index, phase) {
        let delta = index - phase;
        while (delta > count / 2) delta -= count;
        while (delta < -count / 2) delta += count;
        return delta;
      }

      function nearestIndex() {
        return (Math.round(state.phase) % count + count) % count;
      }

      function select(index) {
        const current = nearestIndex();
        let delta = index - current;
        if (delta > count / 2) delta -= count;
        if (delta < -count / 2) delta += count;
        state.basePhase += delta;
        state.targetPhase = state.basePhase;
        state.lastInput = performance.now();
      }

      function setPointer(event) {
        const rect = stage.getBoundingClientRect();
        const nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
        const ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));

        state.pointerX = nx;
        state.pointerY = ny;
        state.tiltX = nx;
        state.tiltY = ny;
        state.active = true;
        state.lastInput = performance.now();

        const axis = state.targetOrientation > 0.5 ? ny : nx;
        state.targetPhase = state.basePhase + axis * (window.innerWidth < 680 ? 1.55 : 2.45);
        stage.style.setProperty("--pointer-x", \`\${((nx + 1) / 2) * 100}%\`);
        stage.style.setProperty("--pointer-y", \`\${((ny + 1) / 2) * 100}%\`);
      }

      function toggleOrientation() {
        state.manualOrientation = true;
        state.targetOrientation = state.targetOrientation > 0.5 ? 0 : 1;
        state.targetPhase = state.basePhase;
        state.lastInput = performance.now();
      }

      cards.forEach((card, index) => {
        card.addEventListener("click", () => select(index));
        card.addEventListener("focus", () => select(index));
      });

      stage.addEventListener("pointermove", setPointer);
      stage.addEventListener("pointerdown", setPointer);
      stage.addEventListener("pointerleave", () => {
        state.active = false;
        state.targetPhase = state.basePhase;
        state.pointerX = 0;
        state.pointerY = 0;
        stage.style.setProperty("--pointer-x", "50%");
        stage.style.setProperty("--pointer-y", "50%");
      });

      stage.addEventListener("dblclick", toggleOrientation);

      stage.addEventListener("wheel", (event) => {
        event.preventDefault();
        const direction = Math.sign(Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX);
        if (!direction) return;
        state.basePhase += direction;
        state.targetPhase = state.basePhase;
        state.active = false;
        state.lastInput = performance.now();
      }, { passive: false });

      window.addEventListener("keydown", (event) => {
        if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", " "].includes(event.key)) {
          event.preventDefault();
        }
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          state.basePhase += 1;
          state.targetPhase = state.basePhase;
          state.lastInput = performance.now();
        }
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          state.basePhase -= 1;
          state.targetPhase = state.basePhase;
          state.lastInput = performance.now();
        }
        if (event.key === " ") toggleOrientation();
      });

      window.addEventListener("resize", () => {
        if (!state.manualOrientation) {
          state.targetOrientation = window.innerWidth < 680 ? 1 : 0;
        }
      });

      let previousTime = performance.now();

      function render(time) {
        const deltaTime = Math.min(32, time - previousTime);
        previousTime = time;
        const ease = reducedMotion ? 1 : 1 - Math.pow(0.0007, deltaTime / 1000);

        if (!state.active && !state.manualOrientation && time - state.lastInput > 4200) {
          const idle = time - state.lastInput - 4200;
          state.targetPhase = state.basePhase + Math.sin(idle * 0.00034) * 1.9;
          state.targetOrientation = (Math.sin(idle * 0.00019 - Math.PI / 2) + 1) / 2;
        }

        state.phase += (state.targetPhase - state.phase) * ease;
        state.orientation += (state.targetOrientation - state.orientation) * ease * 0.72;
        state.tiltX += ((state.active ? state.pointerX : 0) - state.tiltX) * ease * 0.72;
        state.tiltY += ((state.active ? state.pointerY : 0) - state.tiltY) * ease * 0.72;

        const horizontalSpacing = Math.min(150, Math.max(102, window.innerWidth * 0.096));
        const verticalSpacing = Math.min(136, Math.max(99, window.innerHeight * 0.148));
        const activeIndex = nearestIndex();

        cards.forEach((card, index) => {
          const delta = wrappedDelta(index, state.phase);
          const distance = Math.abs(delta);
          const focus = Math.exp(-Math.pow(distance, 2) * 1.05);
          const side = Math.max(0, 1 - distance / 5);
          const direction = Math.sign(delta);

          const horizontalX = delta * horizontalSpacing;
          const horizontalY = -Math.pow(distance, 1.45) * 6 + Math.sin(delta * 0.8) * 5;
          const verticalX = Math.sin(delta * 0.82) * Math.min(78, window.innerWidth * 0.06)
            + direction * Math.pow(distance, 1.25) * 8;
          const verticalY = delta * verticalSpacing;

          const x = horizontalX * (1 - state.orientation) + verticalX * state.orientation;
          const y = horizontalY * (1 - state.orientation) + verticalY * state.orientation;
          const z = focus * 95 - distance * 78;
          const scale = 0.57 + side * 0.16 + focus * 0.38;
          const rotateX = (
            -state.tiltY * focus * 5
            + delta * 2.2 * state.orientation
          );
          const rotateY = (
            state.tiltX * focus * 7
            - delta * 8.5 * (1 - state.orientation)
          );
          const rotateZ = (
            delta * 2.25 * (1 - state.orientation)
            - delta * 1.4 * state.orientation
          );

          card.style.setProperty("--focus", focus.toFixed(4));
          card.style.zIndex = String(Math.round(1000 - distance * 100));
          card.style.opacity = String(Math.max(0.14, side * 0.82 + focus * 0.18));
          card.style.filter = \`blur(\${Math.max(0, distance - 1.35) * 0.45}px) saturate(\${0.72 + focus * 0.28})\`;
          card.style.transform = [
            "translate(-50%, -50%)",
            \`translate3d(\${x.toFixed(2)}px, \${y.toFixed(2)}px, \${z.toFixed(2)}px)\`,
            \`rotateX(\${rotateX.toFixed(2)}deg)\`,
            \`rotateY(\${rotateY.toFixed(2)}deg)\`,
            \`rotateZ(\${rotateZ.toFixed(2)}deg)\`,
            \`scale(\${scale.toFixed(4)})\`
          ].join(" ");
          card.setAttribute("aria-current", index === activeIndex ? "true" : "false");
        });

        requestAnimationFrame(render);
      }

      requestAnimationFrame(render);
    })();
  <\/script>
</body>
</html>
`;function _(e,s){const n=["#414552","#1e2b2d","#624936","#5b5d37"],d=s.map((o,f)=>({name:o.name,role:o.primaryLanguage,summary:o.summary,color:n[f%n.length]}));return e=e.replace(/      const portraits = \{[\s\S]*?      const stage =/,"      const profiles = "+JSON.stringify(d).replaceAll("<","\\u003c")+`;
      const stage =`),e=e.replace("`Focus ${profile.name}, ${profile.role}`","`Open details for ${profile.name}, ${profile.role}`"),e=e.replace(/        card.innerHTML = `[\s\S]*?<\/span>`;/,`
        const portrait = document.createElement('span');
        portrait.className = 'portrait';
        portrait.textContent = profile.summary;
        const identity = document.createElement('span');
        identity.className = 'identity';
        const name = document.createElement('span');
        name.className = 'name'; name.textContent = profile.name;
        const role = document.createElement('span');
        role.className = 'role'; role.textContent = profile.role;
        const follow = document.createElement('span');
        follow.className = 'follow'; follow.textContent = 'Open details ↗';
        identity.append(name, role, follow); card.append(portrait, identity);`),e=e.replace("() => select(index)",'() => { select(index); window.parent.postMessage({type:"portfolio:project",index},"*"); }'),e=e.replace('card.addEventListener("focus", () => select(index));','card.addEventListener("focus", () => { if(card.matches(":focus-visible")) select(index); });'),e=e.replace("      function setPointer(event) {",`      function setPointer(event) {
        if (event.target.closest(".card")) { state.active = true; state.targetPhase = state.phase; state.targetOrientation = state.orientation; state.lastInput = performance.now(); return; }`),e=e.replace('      window.addEventListener("keydown", (event) => {',`      window.addEventListener("keydown", (event) => {
        if(event.key === "Enter") { event.preventDefault(); (event.target.closest(".card") || cards[nearestIndex()]).click(); return; }`),e=e.replace("        if (!state.active && !state.manualOrientation","        if (!reducedMotion && !state.active && !state.manualOrientation"),e=e.replace(`      stage.addEventListener("wheel", (event) => {
        event.preventDefault();`,`      stage.addEventListener("wheel", (event) => {
        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) return;
        event.preventDefault();`),e=e.replace("</head>",`<style>
    .stage { touch-action: pan-y; }
    .card { width: clamp(205px, 22vw, 300px); aspect-ratio: .78; }
    .portrait { display:flex; align-items:center; padding:16px; text-align:left; font-size:clamp(12px,1.2vw,15px); line-height:1.5; aspect-ratio:1.12; }
    .name { font-size:18px; line-height:1.2; }
    .role { font-size:11px; color:#ddd; }
    .follow { font-size:10px; padding:7px 12px; }
    @media(max-width:680px) { .card { width:220px; } }
  </style></head>`),e}const L="",h={variant:"filmstrip",speed:1,scale:1,opacity:1,hue:0,saturation:1,brightness:1},A={filmstrip:L,wave:S};function m(e,s,n){return Math.min(n,Math.max(s,e))}function $(e,s){return _(A[e],s).replaceAll("performance.now()","window.__CHARACTER_CAROUSEL_NOW()").replace(/<script[^>]+cloudflareinsights\.com[^>]*><\/script>/gi,"").replace("</head>",`<style data-character-carousel-focus>
:root { --character-carousel-scale: 1; }
html, body, .stage { width: 100%; height: 100%; margin: 0; overflow: hidden; }
.stage { min-height: 0 !important; }
.deck { transform: scale(var(--character-carousel-scale)); transform-origin: 50% 50%; }
</style><script data-character-carousel-controls>
(function () {
  var nativeFrame = window.requestAnimationFrame.bind(window);
  var clock = { real: null, virtual: null };
  var controls = window.__CHARACTER_CAROUSEL_CONTROLS = { speed: 1, scale: 1, paused: false };
  window.__CHARACTER_CAROUSEL_NOW = function () {
    return clock.virtual === null ? performance.now() : clock.virtual;
  };
  window.requestAnimationFrame = function (callback) {
    function tick(realTime) {
      if (clock.real === null) {
        clock.real = realTime;
        clock.virtual = realTime;
      } else {
        if (!controls.paused) clock.virtual += (realTime - clock.real) * controls.speed;
        clock.real = realTime;
      }
      if (controls.paused) {
        return nativeFrame(tick);
      }
      callback(clock.virtual);
    }
    return nativeFrame(tick);
  };
  window.addEventListener('message', function (event) {
    if (!event.data || event.data.type !== 'character-carousel-controls') return;
    var next = event.data.controls || {};
    if (Number.isFinite(next.speed)) controls.speed = Math.max(0, Math.min(2.5, next.speed));
    if (Number.isFinite(next.scale)) controls.scale = Math.max(0.7, Math.min(1.3, next.scale));
    controls.paused = Boolean(next.paused);
    document.documentElement.style.setProperty('--character-carousel-scale', String(controls.scale));
  });
})();
<\/script></head>`)}function R({variant:e=h.variant,speed:s=h.speed,scale:n=h.scale,opacity:d=h.opacity,hue:o=h.hue,saturation:f=h.saturation,brightness:x=h.brightness,className:p="",style:w=void 0,projects:u,onSelect:g}){const i=r.useRef(null),[a,v]=r.useState(!0),[j,P]=r.useState(()=>typeof document>"u"||!document.hidden),b=m(s,0,2.5),E=m(n,.7,1.3),M=!a||!j||b===0,C=r.useMemo(()=>$(e,u),[e,u]),y=r.useCallback(()=>{i.current?.contentWindow?.postMessage({type:"character-carousel-controls",controls:{speed:b,scale:E,paused:M}},"*")},[M,E,b]);r.useEffect(()=>{const c=i.current;if(!c||typeof IntersectionObserver>"u")return;const l=new IntersectionObserver(([O])=>v(O?.isIntersecting??!0));return l.observe(c),()=>l.disconnect()},[]),r.useEffect(()=>{if(typeof document>"u")return;const c=()=>P(!document.hidden);return document.addEventListener("visibilitychange",c),()=>document.removeEventListener("visibilitychange",c)},[]),r.useEffect(()=>{y()},[y,C]),r.useEffect(()=>{const c=l=>{l.source===i.current?.contentWindow&&l.data?.type==="portfolio:project"&&Number.isInteger(l.data.index)&&u[l.data.index]&&g(l.data.index)};return window.addEventListener("message",c),()=>window.removeEventListener("message",c)},[u,g]);const k=e==="filmstrip";return t.jsx("div",{className:`threeui-background character-carousel character-carousel--${e}${p?` ${p}`:""}`,style:{background:k?"#d8c9ad":"#121212",pointerEvents:"auto",...w},children:t.jsx("iframe",{ref:i,title:k?"Interactive character filmstrip":"Interactive project wave: arrow keys explore, Space changes orientation, Enter opens details",srcDoc:C,sandbox:"allow-scripts",onLoad:y,style:{position:"absolute",inset:0,display:"block",width:"100%",height:"100%",border:0,background:k?"#d8c9ad":"#121212",opacity:m(d,.05,1),filter:`hue-rotate(${m(o,-180,180)}deg) saturate(${m(f,0,2)}) brightness(${m(x,.35,1.65)})`}})})}function I({projects:e,label:s}){const[n,d]=r.useState(null),[o,f]=r.useState(!1),x=a=>new URL(a).hostname==="github.com",p=r.useRef(null),w=r.useRef(null),u=r.useRef(null),g=r.useCallback(a=>{u.current=document.activeElement,d(e[a]??null)},[e]);r.useEffect(()=>{f(!0)},[]),r.useEffect(()=>{if(!n||!p.current)return;p.current.showModal();const a=document.body.style.overflow;return document.body.style.overflow="hidden",()=>{document.body.style.overflow=a}},[n]);const i=()=>{p.current?.close(),d(null),(u.current??w.current?.querySelector("iframe"))?.focus()};return t.jsxs("div",{ref:w,className:"project-wave",children:[t.jsx("p",{className:"project-wave__help",children:e.some(a=>a.websiteUrl||a.repositoryUrl)?"Explore the cards. Open a highlight to visit its website or GitHub repository.":"Explore the cards and open a project for its plan. GitHub links appear when published."}),t.jsx("div",{className:"project-wave__stage",children:o&&t.jsx(R,{variant:"wave",speed:1,scale:1,opacity:1,hue:0,saturation:1,brightness:1,projects:e,onSelect:g})}),t.jsx("p",{className:"project-wave__controls",children:"← → Explore · Space to rotate · Enter for details"}),t.jsxs("details",{className:"project-wave__index",children:[t.jsxs("summary",{children:["Browse all ",s.toLowerCase()," (",e.length,")"]}),t.jsx("ul",{children:e.map((a,v)=>t.jsxs("li",{children:[t.jsx("button",{type:"button",onClick:()=>g(v),children:a.name}),!o&&t.jsxs("p",{children:[a.summary," ",a.websiteUrl&&t.jsx("a",{href:a.websiteUrl,children:"Visit website ↗"})," ",a.repositoryUrl&&t.jsxs("a",{href:a.repositoryUrl,children:[x(a.repositoryUrl)?"Open the GitHub link":"Open project site"," ↗"]})]})]},a.slug))})]}),n&&t.jsx("dialog",{ref:p,className:"project-modal","aria-labelledby":`modal-${n.slug}`,onCancel:a=>{a.preventDefault(),i()},onClick:a=>{a.target===a.currentTarget&&i()},children:t.jsxs("article",{onClick:a=>a.stopPropagation(),children:[t.jsxs("div",{className:"project-modal__top",children:[t.jsxs("p",{children:[n.status," / ",n.primaryLanguage]}),t.jsx("button",{type:"button",onClick:i,"aria-label":"Close project details",autoFocus:!0,children:"Close ×"})]}),t.jsx("h2",{id:`modal-${n.slug}`,children:n.name}),n.websiteUrl||n.repositoryUrl?t.jsxs("a",{className:"project-modal__blurb",href:n.websiteUrl||n.repositoryUrl,target:"_blank",rel:"noopener noreferrer",children:[t.jsx("p",{children:n.summary}),t.jsxs("span",{children:[n.websiteUrl?"Visit website":x(n.repositoryUrl)?"Open the GitHub link":"Open project site"," ↗"]})]}):t.jsxs("div",{className:"project-modal__blurb",children:[t.jsx("p",{children:n.summary}),t.jsx("span",{children:"Repository queued for build — GitHub link coming when published."})]}),(n.websiteUrl||n.repositoryUrl)&&t.jsxs("nav",{className:"project-modal__links","aria-label":"Project links",children:[n.websiteUrl&&t.jsx("a",{href:n.websiteUrl,target:"_blank",rel:"noopener noreferrer",children:"Visit website ↗"}),n.repositoryUrl&&t.jsxs("a",{href:n.repositoryUrl,target:"_blank",rel:"noopener noreferrer",children:[x(n.repositoryUrl)?"Open the GitHub link":"Open project site"," ↗"]})]}),t.jsx("p",{className:"project-modal__stack",children:n.frameworks.join(" / ")}),t.jsx("h3",{children:"Roadmap"}),t.jsx("ol",{children:n.phases.map(a=>t.jsx("li",{children:a},a))})]})})]})}export{I as default};
