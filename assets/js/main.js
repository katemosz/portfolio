/* ==========================================================================
   MAIN.JS
   Logika strony niezwiązana z animacjami: menu mobilne, rok w stopce,
   aktywny link w nawigacji, duplikacja treści dla marquee.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // --- Menu mobilne ---
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");

  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll(".nav__links a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // --- Rok w stopce ---
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // --- Oznaczenie aktywnego linku w nawigacji ---
  const currentPath = window.location.pathname.replace(/\/index\.html$/, "/");
  document.querySelectorAll(".nav__links a").forEach((link) => {
    const linkPath = new URL(link.href).pathname.replace(/\/index\.html$/, "/");
    if (linkPath === currentPath) {
      link.setAttribute("aria-current", "page");
    }
  });

  // --- Duplikacja zawartości marquee, żeby przewijanie było bez szwu ---
  document.querySelectorAll(".marquee__track").forEach((track) => {
    track.innerHTML += track.innerHTML;
  });

  // --- Suwak porównawczy przed/po (case studies) ---
  // Zero zależności od GSAP celowo — to zwykła interakcja, nie animacja
  // dekoracyjna, więc ma działać nawet gdyby CDN z GSAP nie odpowiedział.
  document.querySelectorAll("[data-compare-slider]").forEach((slider) => {
    let dragging = false;
    const beforeLabel = slider.querySelector(".compare-slider__label--before");
    const afterLabel = slider.querySelector(".compare-slider__label--after");

    function setPos(clientX) {
      const rect = slider.getBoundingClientRect();
      const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
      slider.style.setProperty("--pos", pct + "%");

      // At either extreme, only one version is actually visible — hide the
      // label for the one that's fully hidden instead of leaving it
      // floating over content it doesn't describe.
      if (beforeLabel) beforeLabel.classList.toggle("is-hidden", pct <= 1);
      if (afterLabel) afterLabel.classList.toggle("is-hidden", pct >= 99);
    }

    slider.addEventListener("pointerdown", (e) => {
      dragging = true;
      slider.setPointerCapture(e.pointerId);
      setPos(e.clientX);
    });
    slider.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      setPos(e.clientX);
    });
    ["pointerup", "pointercancel"].forEach((evt) =>
      slider.addEventListener(evt, () => {
        dragging = false;
      })
    );
  });

  // --- Karuzela testimoniali: przewijanie po/na 1 "widok" (2 karty),
  // strzałki + kropki sterują tym samym natywnym scrollem co przeciąganie
  // palcem — zero zależności od GSAP, żeby działało nawet bez CDN. ---
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector("[data-carousel-track]");
    const prevBtn = carousel.querySelector("[data-carousel-prev]");
    const nextBtn = carousel.querySelector("[data-carousel-next]");
    const dotsWrap = carousel.querySelector("[data-carousel-dots]");
    if (!track) return;

    const cards = Array.from(track.children);
    const perView = 2;
    const pageCount = Math.ceil(cards.length / perView);
    const dots = [];

    if (dotsWrap) {
      for (let i = 0; i < pageCount; i++) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", `Go to testimonials page ${i + 1}`);
        dot.addEventListener("click", () => scrollToPage(i));
        dotsWrap.appendChild(dot);
        dots.push(dot);
      }
    }

    function setActiveDot(index) {
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    }

    function scrollToPage(index) {
      const targetCard = cards[index * perView];
      if (!targetCard) return;
      track.scrollTo({ left: targetCard.offsetLeft, behavior: "smooth" });
    }

    function currentPage() {
      let closestIndex = 0;
      let closestDiff = Infinity;
      cards.forEach((card, i) => {
        const diff = Math.abs(card.offsetLeft - track.scrollLeft);
        if (diff < closestDiff) {
          closestDiff = diff;
          closestIndex = i;
        }
      });
      return Math.floor(closestIndex / perView);
    }

    let scrollTimeout;
    track.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setActiveDot(currentPage()), 100);
    });

    prevBtn?.addEventListener("click", () => scrollToPage(Math.max(0, currentPage() - 1)));
    nextBtn?.addEventListener("click", () =>
      scrollToPage(Math.min(pageCount - 1, currentPage() + 1))
    );

    setActiveDot(0);
  });

  // --- Lightbox: click a case-study image to see it larger (~75% of the
  // viewport, not full-screen). One shared overlay, reused for every
  // image — no library. ---
  const lightbox = document.querySelector("[data-lightbox-overlay]");
  if (lightbox) {
    const lightboxImage = lightbox.querySelector("[data-lightbox-image]");
    const closeBtn = lightbox.querySelector("[data-lightbox-close]");

    function openLightbox(src, alt) {
      lightboxImage.src = src;
      lightboxImage.alt = alt || "";
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.hidden = true;
      lightboxImage.src = "";
      document.body.style.overflow = "";
    }

    document.querySelectorAll(".media-card img, .case-gallery img").forEach((img) => {
      img.addEventListener("click", () => openLightbox(img.currentSrc || img.src, img.alt));
    });

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

});
