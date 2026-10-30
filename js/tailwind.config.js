/* Configuració de Tailwind (Play CDN) — Carlus Band */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0b",
        coal: "#121215",
        panel: "#17171b",
        line: "rgba(255,255,255,0.08)",
        accent: {
          DEFAULT: "#cfcfd6",
          soft: "#ececf0",
          deep: "#8d8d97",
        },
        muted: "#a3a3ad",
      },
      fontFamily: {
        display: ['"Bebas Neue"', "Impact", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
};
