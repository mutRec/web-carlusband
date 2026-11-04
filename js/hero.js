/* ============================================================
   Carlus Band — hero.js
   Alterna el parpelleig de neó del títol amb una encesa de les
   lletres una a una en ordre aleatori
   ============================================================ */

(function () {
  "use strict";

  const title = document.querySelector(".hero-title");
  if (!title) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) return;

  const lines = Array.prototype.filter.call(title.children, function (node) {
    return node.tagName === "SPAN";
  });

  if (!lines.length) return;

  const letters = [];

  // Nom accessible complet abans de trencar el text en lletres
  title.setAttribute(
    "aria-label",
    lines
      .map(function (line) {
        return line.textContent.trim();
      })
      .join(" ")
  );

  lines.forEach(function (line) {
    const text = line.textContent;
    line.textContent = "";
    line.setAttribute("aria-hidden", "true");

    Array.from(text).forEach(function (char) {
      if (char === " ") {
        line.appendChild(document.createTextNode(" "));
        return;
      }

      const letter = document.createElement("span");
      letter.className = "hero-letter";
      letter.textContent = char;
      line.appendChild(letter);
      letters.push(letter);
    });
  });

  let stopped = false;

  function delay(ms) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, ms);
    });
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function shuffled(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const swap = copy[i];
      copy[i] = copy[j];
      copy[j] = swap;
    }
    return copy;
  }

  function allOff() {
    letters.forEach(function (letter) {
      letter.classList.remove("is-lit");
    });
  }

  function stop() {
    stopped = true;
    title.classList.remove("is-lighting");
    allOff();
  }

  async function run() {
    while (!stopped) {
      // Fase 1: el parpelleig de neó actual
      await delay(randomBetween(4000, 7000));
      if (stopped) return;

      // Fase 2: tot apagat...
      title.classList.add("is-lighting");
      allOff();
      await delay(randomBetween(450, 950));

      // ...i s'encén lletra a lletra en ordre aleatori
      const order = shuffled(letters);
      for (let i = 0; i < order.length; i += 1) {
        if (stopped) return;
        order[i].classList.add("is-lit");
        await delay(randomBetween(60, 170));
      }

      // Totes enceses: petita pausa abans de tornar al neó
      await delay(randomBetween(900, 1600));
      if (stopped) return;

      title.classList.remove("is-lighting");
      allOff();
    }
  }

  // Si l'usuari canvia la preferència de moviment, ho aturem
  function handleChange(event) {
    if (event.matches) stop();
  }

  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener("change", handleChange);
  } else if (reduceMotion.addListener) {
    reduceMotion.addListener(handleChange);
  }

  run();
})();
