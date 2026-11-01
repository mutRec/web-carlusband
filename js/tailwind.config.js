/* Configuració de Tailwind (Play CDN) — Carlus Band */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: "#131314",
        coal: "#1a1a1b",
        panel: "#1e1e20",
        line: "rgba(255,255,255,0.09)",
        accent: {
          DEFAULT: "#f2f1ee",
          soft: "#c9c8c3",
          deep: "#8d8c87",
        },
        muted: "#a6a5a0",
      },
      fontFamily: {
        display: ['"Bebas Neue"', "Impact", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
};
