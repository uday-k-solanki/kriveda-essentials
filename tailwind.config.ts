import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm ivory / paper backgrounds
        ivory: {
          DEFAULT: "#F6F1E7",
          50: "#FBF8F1",
          100: "#F6F1E7",
          200: "#EFE7D6",
        },
        // Soft champagne tones
        champagne: {
          DEFAULT: "#E7D7BE",
          light: "#F0E6D2",
          deep: "#D8C3A0",
        },
        // Stone textures
        stone: {
          warm: "#CBBFA9",
          mid: "#A89B83",
          deep: "#6F6553",
        },
        // Deep botanical greens
        botanical: {
          DEFAULT: "#2E3B2C",
          deep: "#1C2A1E",
          mid: "#3F5138",
          soft: "#65755A",
        },
        // Brushed gold accents (matches the logo)
        gold: {
          DEFAULT: "#B8912E",
          light: "#D4AF4E",
          deep: "#977316",
          pale: "#E6CF8B",
        },
        ink: "#211C13",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.28em",
        wide2: "0.18em",
      },
      maxWidth: {
        editorial: "1320px",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.22, 1, 0.36, 1)",
        silk: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "grain-shift": {
          "0%, 100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-2%,-3%)" },
          "30%": { transform: "translate(3%,-2%)" },
          "50%": { transform: "translate(-1%,2%)" },
          "70%": { transform: "translate(2%,1%)" },
          "90%": { transform: "translate(-3%,2%)" },
        },
        "sheen": {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        kenburns: {
          "0%": { transform: "scale(1.05) translate(0, 0)" },
          "100%": { transform: "scale(1.18) translate(-1.5%, -2%)" },
        },
        bloom: {
          "0%, 100%": { opacity: "0.78", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.08)" },
        },
        "float-card": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(0.4deg)" },
        },
        rays: {
          "0%, 100%": { opacity: "0.45", transform: "rotate(21deg) translateX(0)" },
          "50%": { opacity: "0.85", transform: "rotate(23deg) translateX(2%)" },
        },
      },
      animation: {
        "grain-shift": "grain-shift 8s steps(6) infinite",
        sheen: "sheen 6s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        kenburns: "kenburns 18s ease-in-out infinite alternate",
        bloom: "bloom 7s ease-in-out infinite",
        "float-card": "float-card 6s ease-in-out infinite",
        rays: "rays 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
