/* ═══════════════════════════════════════════════════════════════
   netrunner — scroll choreography
   Transform + opacity only. Scrubbed to native scroll, never hijacked.
   Every effect is gated behind gsap.matchMedia's reduced-motion branch.
   ═══════════════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

/* ── shared: reveal + parallax + scramble + rail, full motion ─── */

mm.add(
  {
    motion: "(prefers-reduced-motion: no-preference)",
    reduced: "(prefers-reduced-motion: reduce)",
    desktop: "(min-width: 900px)",
  },
  (ctx) => {
    const { motion, desktop } = ctx.conditions;
    if (!motion) return;

    /* ── 1 · boot entrance ─────────────────────────────────────
       One orchestrated load beats scattered micro-interactions. */
    gsap
      .timeline({ defaults: { ease: "expo.out" } })
      .from(".hud", { yPercent: -100, duration: 0.9 })
      .from(".boot__name", { yPercent: 18, opacity: 0, duration: 1.1 }, 0.1)
      .from(
        [".boot .kicker", ".boot__handle", ".boot__spec"],
        { y: 16, opacity: 0, duration: 0.8, stagger: 0.07 },
        0.35
      )
      .from(
        ".boot__tags li",
        { y: 12, opacity: 0, duration: 0.6, stagger: 0.05 },
        0.55
      )
      .from(".boot__feed", { opacity: 0, scale: 1.04, duration: 1.3 }, 0.2)
      .from(".boot__cue", { opacity: 0, duration: 0.6 }, 0.9);

    /* ── 2 · multi-layer parallax ──────────────────────────────
       data-depth drives how far each layer drifts. Higher = faster.
       Foreground/midground/background separation is what sells depth. */
    gsap.utils.toArray("[data-depth]").forEach((el) => {
      const depth = parseFloat(el.dataset.depth) || 0.1;
      gsap.fromTo(
        el,
        { yPercent: depth * 40 },
        {
          yPercent: depth * -40,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );
    });

    /* ── 3 · quickhack panel: pin + staggered upload ───────────
       Pinned only on desktop — pinning a tall panel on a phone
       eats the whole viewport and feels like scroll-jacking. */
    if (desktop) {
      const qhTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".qh",
          start: "top top",
          end: "+=1100",
          pin: ".qh__stage",
          scrub: 0.8,
        },
      });

      qhTl
        .from(".qh__head", { yPercent: 12, opacity: 0, ease: "none" })
        .from(
          ".qh__item",
          { xPercent: -4, opacity: 0, stagger: 0.35, ease: "none" },
          0.15
        )
        .to(".qh__item .qh__bar i", { scaleX: 1, stagger: 0.35, ease: "none" }, 0.15);
    } else {
      gsap.set(".qh__item", { opacity: 0, x: -14 });
      ScrollTrigger.batch(".qh__item", {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, x: 0, duration: 0.7, stagger: 0.09, ease: "expo.out" }),
      });
    }

    /* ── 4 · section heads + card batches ──────────────────────── */
    gsap.utils.toArray(".sec__head").forEach((head) => {
      gsap.from(head.children, {
        y: 26,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: head, start: "top 82%" },
      });
    });

    gsap.set(".fact, .rank, .node, .skill li, .detail li", { opacity: 0, y: 22 });
    ScrollTrigger.batch(".fact, .rank, .node, .skill li, .detail li", {
      start: "top 88%",
      batchMax: 6,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.07,
          ease: "expo.out",
          overwrite: true,
        }),
    });

    /* ── 5 · project log: horizontal via containerAnimation ────
       ease:"none" is mandatory or scroll and x position desync. */
    const inner = document.querySelector("#trackInner");
    const track = document.querySelector("#track");

    const overflow = () => (inner && track ? Math.max(0, inner.scrollWidth - track.clientWidth) : 0);

    // Desktop only, and only when something is genuinely off-screen. On a phone the
    // cards always overflow, so pinning here would strip the native swipe and fight
    // address-bar resize — the CSS overflow-x baseline handles that case better.
    if (desktop && inner && track && overflow() > 40) {
      track.style.overflowX = "hidden";
      track.style.scrollSnapType = "none";
      // Scrub replaces the swipe, so the affordance would be lying.
      const hint = document.querySelector(".track__hint");
      if (hint) hint.style.display = "none";

      gsap.to(inner, {
        x: () => -overflow(),
        ease: "none",
        scrollTrigger: {
          trigger: ".projects",
          start: "top top",
          end: () => "+=" + (overflow() + window.innerHeight * 0.6),
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });
    }

    /* ── 6 · trace counter, driven by real scroll progress ───── */
    const traceVal = document.querySelector("#traceVal");
    if (traceVal) {
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          traceVal.textContent = String(Math.round(self.progress * 100)).padStart(3, "0");
        },
      });
    }

    /* ── 7 · heading scramble on first entry ──────────────────── */
    const GLYPHS = "▚▞█▓▒░01<>/\\{}[]#$%&@";

    gsap.utils.toArray(".scramble").forEach((el) => {
      const finalText = el.textContent;
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => scramble(el, finalText),
      });
    });

    function scramble(el, text) {
      const total = 16;
      let frame = 0;
      const tick = () => {
        const progress = frame / total;
        el.textContent = text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            return i / text.length < progress
              ? ch
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("");
        frame++;
        if (frame <= total) requestAnimationFrame(tick);
        else el.textContent = text;
      };
      tick();
    }

    /* ── 8 · name glitch, sparse and irregular ────────────────── */
    const glitch = document.querySelector(".glitch");
    if (glitch) {
      const hit = () => {
        glitch.style.setProperty("--gy", Math.random() * 70 + "%");
        glitch.style.setProperty("--gy2", Math.random() * 20 + 10 + "%");
        glitch.classList.add("is-hit");
        setTimeout(() => glitch.classList.remove("is-hit"), 60 + Math.random() * 70);
        setTimeout(hit, 1800 + Math.random() * 4200);
      };
      setTimeout(hit, 2200);
    }

    return () => {
      // matchMedia reverts tweens automatically; clear the counter text
      if (traceVal) traceVal.textContent = "000";
    };
  }
);

/* ── rail active state — works in both motion branches ────────── */

const railLinks = gsap.utils.toArray(".rail a");
railLinks.forEach((link) => {
  const id = link.getAttribute("href");
  const target = document.querySelector(id);
  if (!target) return;

  ScrollTrigger.create({
    trigger: target,
    start: "top 45%",
    end: "bottom 45%",
    onToggle: (self) => link.classList.toggle("is-on", self.isActive),
  });
});

/* Fonts shift layout after load; recalc trigger positions once settled. */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
window.addEventListener("load", () => ScrollTrigger.refresh());
