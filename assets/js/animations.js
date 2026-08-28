/* ==========================================================================
   ANIMATIONS.JS
   Mikro-animacje oparte o GSAP + ScrollTrigger (wczytywane z CDN w <head>/
   przed tym plikiem — patrz komentarz w plikach .html).
   Jeśli GSAP z jakiegoś powodu się nie wczyta, ta funkcja po prostu nic
   nie robi — treść strony jest widoczna normalnie (progressive enhancement).
   ========================================================================== */

(() => {
  if (typeof gsap === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) return;

  document.addEventListener("DOMContentLoaded", () => {
    /* ---------------------------------------------------------------------
       1) INTRO NA HERO
       Nagłówek, opis i przyciski wchodzą kolejno przy wejściu na stronę.
    --------------------------------------------------------------------- */
    // Hand-drawn "scribble" accents (e.g. around the About-page photo) start
    // fully undrawn — a dash covering the whole path length — so the hero
    // timeline below can animate them being "drawn" in.
    document.querySelectorAll("[data-scribble-draw]").forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });

    const heroTimeline = gsap.timeline({
      defaults: { ease: "power3.out", duration: 0.9 },
    });

    heroTimeline
      .from("[data-anim='hero-eyebrow']", { y: 16, opacity: 0 })
      .from(
        "[data-anim='hero-title']",
        { y: 28, opacity: 0, duration: 1.1 },
        "-=0.6"
      )
      .from("[data-anim='hero-lede']", { y: 20, opacity: 0 }, "-=0.7")
      .to(
        "[data-scribble-draw]",
        { strokeDashoffset: 0, duration: 1.2, ease: "power1.inOut" },
        "-=0.9"
      )
      .from(
        "[data-anim='hero-actions'] > *",
        { y: 16, opacity: 0, stagger: 0.1 },
        "-=0.6"
      );

    /* Failsafe. gsap.from() immediately sets the hero to opacity:0; if the
       timeline then stalls before finishing — a throttled rAF in a
       backgrounded tab, a slow GSAP load, a JS error later on the page —
       the hero would stay invisible for good. A beat after load, force it
       visible no matter what. On a normal load the timeline finished long
       ago and this is a harmless no-op. */
    window.addEventListener("load", () => {
      window.setTimeout(() => {
        gsap.set("[data-anim]", { opacity: 1, clearProps: "transform" });
      }, 2500);
    });

    /* ---------------------------------------------------------------------
       2) SCROLL REVEAL
       Każdy element z atrybutem data-reveal pojawia się i "wjeżdża"
       lekko z dołu, gdy wchodzi w widok. Grupy (np. karty projektów)
       animują się z lekkim opóźnieniem (stagger).
    --------------------------------------------------------------------- */
    const revealGroups = document.querySelectorAll("[data-reveal-group]");

    revealGroups.forEach((group) => {
      const items = group.querySelectorAll("[data-reveal]");
      gsap.from(items, {
        y: 32,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: group,
          start: "top 82%",
        },
      });
    });

    // Elementy poza grupami — animowane pojedynczo.
    document.querySelectorAll("[data-reveal]:not([data-reveal-group] [data-reveal])").forEach((el) => {
      gsap.from(el, {
        y: 32,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
      });
    });

    /* ---------------------------------------------------------------------
       3) MAGNETYCZNE PRZYCISKI
       Przyciski z klasą .btn lekko "podążają" za kursorem.
    --------------------------------------------------------------------- */
    document.querySelectorAll(".btn").forEach((btn) => {
      const strength = 18;

      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
          x: (x / rect.width) * strength,
          y: (y / rect.height) * strength,
          duration: 0.4,
          ease: "power2.out",
        });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
      });
    });

    /* ---------------------------------------------------------------------
       4) NIESTANDARDOWY KURSOR (tylko desktop, urządzenia z myszką)
    --------------------------------------------------------------------- */
    const cursor = document.querySelector(".cursor-dot");
    if (cursor && window.matchMedia("(hover: hover)").matches) {
      window.addEventListener("mousemove", (e) => {
        gsap.to(cursor, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.15,
          ease: "power2.out",
        });
      });

      document.querySelectorAll("a, button").forEach((el) => {
        el.addEventListener("mouseenter", () =>
          gsap.to(cursor, { scale: 2.5, duration: 0.25 })
        );
        el.addEventListener("mouseleave", () =>
          gsap.to(cursor, { scale: 1, duration: 0.25 })
        );
      });
    }

    /* ---------------------------------------------------------------------
       5) "HI!" — click the About-page photo to say hello
       Photo fades out, a greeting fades in behind it, holds for a beat,
       then both reverse. Guarded against re-triggering mid-animation.
    --------------------------------------------------------------------- */
    document.querySelectorAll("[data-photo-toggle]").forEach((btn) => {
      const wrapper = btn.closest(".photo-blob") || btn;
      const img = wrapper.querySelector(".photo-blob__img");
      const greeting = wrapper.querySelector(".photo-blob__greeting");
      if (!img || !greeting) return;

      let animating = false;

      btn.addEventListener("click", () => {
        if (animating) return;
        animating = true;

        gsap
          .timeline({ onComplete: () => (animating = false) })
          .to(img, { opacity: 0, duration: 0.4, ease: "power1.inOut" })
          .to(greeting, { opacity: 1, duration: 0.4, ease: "power1.inOut" }, "<")
          .to({}, { duration: 1.4 }) // hold the greeting for a beat
          .to(greeting, { opacity: 0, duration: 0.4, ease: "power1.inOut" })
          .to(img, { opacity: 1, duration: 0.4, ease: "power1.inOut" }, "<");
      });
    });
  });
})();
