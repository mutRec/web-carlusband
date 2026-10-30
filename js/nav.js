/* ============================================================
   Carlus Band — nav.js
   Capçalera, menú mòbil i secció activa (scroll-spy)
   ============================================================ */

(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const toggle = document.getElementById("nav-toggle");
  const toggleIcon = document.getElementById("nav-toggle-icon");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = mobileMenu
    ? mobileMenu.querySelectorAll("a")
    : [];
  const desktopLinks = document.querySelectorAll(
    ".nav-links .nav-link[data-section]"
  );

  let menuOpen = false;
  const desktopQuery = window.matchMedia("(min-width: 1024px)");

  /* ---------- Menú mòbil ---------- */

  function setMenu(open) {
    if (!toggle || !mobileMenu) return;

    menuOpen = open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Tancar menú de navegació" : "Obrir menú de navegació"
    );

    if (toggleIcon) {
      toggleIcon.className = open
        ? "fa-solid fa-xmark text-lg"
        : "fa-solid fa-bars text-lg";
    }

    mobileMenu.classList.toggle("is-open", open);
    header.classList.toggle("is-menu-open", open);

    document.documentElement.classList.toggle("no-scroll", open);
    document.body.classList.toggle("no-scroll", open);
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenu(!menuOpen);
    });
  }

  mobileLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menuOpen) {
      setMenu(false);
      if (toggle) toggle.focus();
    }
  });

  function handleDesktopChange(event) {
    if (event.matches) setMenu(false);
  }

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener("change", handleDesktopChange);
  } else if (desktopQuery.addListener) {
    desktopQuery.addListener(handleDesktopChange);
  }

  /* ---------- Fons de la capçalera en fer scroll ---------- */

  let scrollTicking = false;

  function updateHeader() {
    if (!header) return;
    const scrolled = window.scrollY > 12;
    header.classList.toggle("is-scrolled", scrolled);
    scrollTicking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!scrollTicking) {
        window.requestAnimationFrame(updateHeader);
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  updateHeader();

  /* ---------- Seccions tipus pestanyes (SPA) ---------- */

  const sections = Array.prototype.slice.call(
    document.querySelectorAll("main section[id]")
  );

  if (sections.length) {
    // Marca l'enllaç de la navbar corresponent a la secció activa
    function setActive(id) {
      desktopLinks.forEach(function (link) {
        const isActive = link.dataset.section === id;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    // Mostra només la secció amb aquest id i n'amaga la resta
    function showSection(id) {
      let found = false;

      sections.forEach(function (section) {
        const isActive = section.id === id;
        section.classList.toggle("is-active", isActive);
        if (isActive) found = true;
      });

      if (!found) return;

      setActive(id);

      // Canvi de "pestanya": tornem a dalt de tot sense desplaçament suau
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      if (menuOpen) setMenu(false);
    }

    // Canvi d'estat en clicar qualsevol enllaç d'ancoratge (#seccio)
    document.addEventListener("click", function (event) {
      const link = event.target.closest("a[href^='#']");
      if (!link) return;

      const id = link.getAttribute("href").slice(1);
      if (!sections.some(function (section) { return section.id === id; }))
        return;

      event.preventDefault();

      // Actualitza l'URL via history per no recarregar la pàgina
      if (window.location.hash !== "#" + id) {
        window.history.pushState({ section: id }, "", "#" + id);
      }

      showSection(id);
    });

    // Suport als botons Endavant/Endarreri del navegador
    window.addEventListener("popstate", function () {
      const id = window.location.hash.slice(1);
      if (sections.some(function (section) { return section.id === id; })) {
        showSection(id);
      }
    });

    // Estat inicial (per si es carrega directament amb un hash)
    const initialId = window.location.hash.slice(1);
    if (sections.some(function (section) { return section.id === initialId; })) {
      showSection(initialId);
    } else {
      setActive(sections[0].id);
    }
  }
})();
