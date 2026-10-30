/* ============================================================
   Carlus Band — concerts.js
   Calendari mensual de concerts amb navegació i ressaltat
   ============================================================ */

(function () {
  "use strict";

  const grid = document.getElementById("calendar-grid");
  const monthLabel = document.getElementById("calendar-month");
  const prevBtn = document.getElementById("calendar-prev");
  const nextBtn = document.getElementById("calendar-next");

  if (!grid || !monthLabel) return;

  const EVENTS = [
    { date: "2026-11-14", city: "Barcelona", venue: "Razzmatazz" },
    { date: "2026-11-28", city: "València", venue: "Sala Moon" },
    { date: "2026-12-12", city: "Madrid", venue: "La Riviera" },
    { date: "2027-01-09", city: "Girona", venue: "La Mirona" },
    { date: "2027-05-12", city: "Ulldecona", venue: "Plaça de l'Ajuntament" },
  ];

  const MONTHS = [
    "gener",
    "febrer",
    "març",
    "abril",
    "maig",
    "juny",
    "juliol",
    "agost",
    "setembre",
    "octubre",
    "novembre",
    "desembre",
  ];

  const eventsByDate = new Map(
    EVENTS.map(function (event) {
      return [event.date, event];
    })
  );

  function pad(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function toISO(date) {
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate())
    );
  }

  function parseISO(value) {
    const parts = value.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // El calendari s'obre al mes del proper concert
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const nextEvent = EVENTS.map(function (event) {
    return parseISO(event.date);
  }).find(function (date) {
    return date >= now;
  });

  const start = nextEvent || now;
  let viewYear = start.getFullYear();
  let viewMonth = start.getMonth();

  function render() {
    monthLabel.textContent =
      capitalize(MONTHS[viewMonth]) + " " + viewYear;

    const firstDay = new Date(viewYear, viewMonth, 1);
    const offset = (firstDay.getDay() + 6) % 7; // dilluns = 0
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const fragment = document.createDocumentFragment();

    // Sempre 42 cel·les (6 setmanes) perquè l'alçada no canviï
    for (let i = 0; i < 42; i++) {
      const dayNumber = i - offset + 1;
      const cellDate = new Date(viewYear, viewMonth, dayNumber);
      const isCurrentMonth = cellDate.getMonth() === viewMonth;
      const iso = toISO(cellDate);
      const event = isCurrentMonth ? eventsByDate.get(iso) : null;

      let cell;

      if (event) {
        cell = document.createElement("button");
        cell.type = "button";
        cell.className = "calendar-day has-event";
        cell.dataset.date = iso;
        cell.setAttribute(
          "aria-label",
          event.city +
            ", " +
            event.venue +
            " — " +
            cellDate.getDate() +
            " de " +
            MONTHS[viewMonth] +
            " de " +
            viewYear +
            ". Ressalta el concert."
        );
        cell.addEventListener("click", function () {
          highlightConcert(iso, cell);
        });
      } else {
        cell = document.createElement("div");
        cell.className = "calendar-day";
      }

      if (!isCurrentMonth) {
        cell.classList.add("is-muted");
      }

      cell.textContent = String(cellDate.getDate());
      fragment.appendChild(cell);
    }

    grid.replaceChildren(fragment);
  }

  function highlightConcert(iso, cell) {
    const items = document.querySelectorAll(".concert-item");
    let match = null;

    items.forEach(function (item) {
      item.classList.remove("is-highlight");
      if (item.dataset.date === iso) match = item;
    });

    document.querySelectorAll(".calendar-day.is-active").forEach(function (day) {
      day.classList.remove("is-active");
    });

    if (cell) cell.classList.add("is-active");
    if (!match) return;

    match.classList.add("is-highlight");

    window.setTimeout(function () {
      match.classList.remove("is-highlight");
      if (cell) cell.classList.remove("is-active");
    }, 2600);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      viewMonth -= 1;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear -= 1;
      }
      render();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      viewMonth += 1;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear += 1;
      }
      render();
    });
  }

  render();
})();
