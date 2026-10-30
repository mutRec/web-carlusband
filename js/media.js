/* ============================================================
   Carlus Band — media.js
   Filtres de la matriu, modal de vídeo i visor de fotografies
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Filtres de la matriu ---------- */

  const filterButtons = Array.prototype.slice.call(
    document.querySelectorAll(".filter-btn")
  );
  const rows = Array.prototype.slice.call(
    document.querySelectorAll(".media-row[data-kind]")
  );

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const filter = button.dataset.filter;

      filterButtons.forEach(function (other) {
        const isActive = other === button;
        other.classList.toggle("is-active", isActive);
        other.setAttribute("aria-pressed", String(isActive));
      });

      rows.forEach(function (row) {
        const show = filter === "all" || row.dataset.kind === filter;
        row.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ---------- Bloqueig de scroll ---------- */

  function lockScroll(locked) {
    document.documentElement.classList.toggle("no-scroll", locked);
    document.body.classList.toggle("no-scroll", locked);
  }

  let lastFocused = null;

  function rememberFocus() {
    lastFocused = document.activeElement;
  }

  function restoreFocus() {
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
    lastFocused = null;
  }

  /* ---------- Modal de vídeo ---------- */

  const videoModal = document.getElementById("video-modal");
  const videoFrame = document.getElementById("video-frame");
  const videoTitle = document.getElementById("video-title");
  const videoCards = Array.prototype.slice.call(
    document.querySelectorAll(".video-card")
  );

  function openVideo(card) {
  if (!videoModal || !videoFrame) return;

  rememberFocus();

  videoTitle.textContent = card.dataset.title || "Vídeo";
  videoFrame.title = card.dataset.title || "Vídeo de Carlus Band";

  const id = encodeURIComponent(card.dataset.video);
  const provider = card.dataset.provider || "youtube";

  if (provider === "vimeo") {
    videoFrame.src =
      "https://player.vimeo.com/video/" + id + "?autoplay=1";
  } else {
    videoFrame.src =
      "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
  }

  videoModal.hidden = false;
  lockScroll(true);

  const closeButton = videoModal.querySelector(".modal__close");
  if (closeButton) closeButton.focus();
}


  function closeVideo() {
    if (!videoModal || videoModal.hidden) return;

    videoModal.hidden = true;
    videoFrame.removeAttribute("src");
    lockScroll(false);
    restoreFocus();
  }

  videoCards.forEach(function (card) {
    card.addEventListener("click", function () {
      openVideo(card);
    });
  });

  if (videoModal) {
    videoModal.querySelectorAll("[data-close]").forEach(function (button) {
      button.addEventListener("click", closeVideo);
    });
  }

  /* ---------- Visor de fotografies ---------- */

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxCount = document.getElementById("lightbox-count");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const photoCards = Array.prototype.slice.call(
    document.querySelectorAll(".photo-card")
  );

  let photoIndex = 0;

  function updateLightbox() {
    const card = photoCards[photoIndex];
    if (!card) return;

    const thumbnail = card.querySelector("img");

    lightboxImage.src = card.dataset.full || (thumbnail ? thumbnail.src : "");
    lightboxImage.alt = thumbnail ? thumbnail.alt : "";
    lightboxCaption.textContent = card.dataset.caption || "";
    lightboxCount.textContent =
      photoIndex + 1 + " / " + photoCards.length;
  }

  function openLightbox(index) {
    if (!lightbox) return;

    rememberFocus();
    photoIndex = index;
    updateLightbox();

    lightbox.hidden = false;
    lockScroll(true);

    const closeButton = lightbox.querySelector(".modal__close");
    if (closeButton) closeButton.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;

    lightbox.hidden = true;
    lightboxImage.removeAttribute("src");
    lockScroll(false);
    restoreFocus();
  }

  function stepLightbox(direction) {
    if (!photoCards.length) return;
    photoIndex =
      (photoIndex + direction + photoCards.length) % photoCards.length;
    updateLightbox();
  }

  photoCards.forEach(function (card, index) {
    card.addEventListener("click", function () {
      openLightbox(index);
    });
  });

  if (lightbox) {
    lightbox.querySelectorAll("[data-close]").forEach(function (button) {
      button.addEventListener("click", closeLightbox);
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", function () {
      stepLightbox(-1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", function () {
      stepLightbox(1);
    });
  }

  /* ---------- Teclat ---------- */

  document.addEventListener("keydown", function (event) {
    const lightboxOpen = lightbox && !lightbox.hidden;
    const videoOpen = videoModal && !videoModal.hidden;

    if (event.key === "Escape") {
      if (lightboxOpen) {
        event.preventDefault();
        closeLightbox();
      } else if (videoOpen) {
        event.preventDefault();
        closeVideo();
      }
      return;
    }

    if (!lightboxOpen) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepLightbox(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepLightbox(1);
    }
  });
})();
