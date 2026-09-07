/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/renderer/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "#F5F2ED",
        panel: "#FBFAF7",
        input: "#EDEAE4",
        primary: "#273038",
        secondary: "#646A6B",
        tertiary: "#747A7D",
        muted: "#8D908F",
        faint: "#999A96",
        inverse: "#FBFAF7",
        border: "#D8D4CE",
        strong: "#BEBBB5",
        harmony: "#B8C8D4",
        bass: "#D4C8B8",
        drums: "#D4B8C3",
        committed: "#B8D4C3",
        reaper: "#C3B8D4",
      },
      fontFamily: {
        sans: ['"DM Sans"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
