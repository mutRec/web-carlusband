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

  /* ---------- Secció activa al navbar ---------- */

  const sections = Array.prototype.slice.call(
    document.querySelectorAll("main section[id]")
  );

  if (sections.length && desktopLinks.length) {
    const visibleSections = new Map();

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

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visibleSections.set(entry.target.id, entry.isIntersecting);
        });

        const active = sections.find(function (section) {
          return visibleSections.get(section.id);
        });

        if (active) setActive(active.id);
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });

    // Estat inicial (per si es carrega directament amb un hash)
    const initial = sections.find(function (section) {
      return "#" + section.id === window.location.hash;
    });

    if (initial) setActive(initial.id);
  }
})();
