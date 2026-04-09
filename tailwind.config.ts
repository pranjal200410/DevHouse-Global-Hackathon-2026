import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1629",
          mid: "#132040",
          card: "#131F35",
          mock: "#0D1A2C",
        },
        emerald: {
          DEFAULT: "#1D9E75",
          light: "#5DCAA5",
          pale: "#E1F5EE",
        },
        amber: {
          DEFAULT: "#EF9F27",
          light: "#FAC775",
        },
        slate: {
          DEFAULT: "#888780",
          light: "#D3D1C7",
        },
        cream: "#F8F9FB",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["Syne", "sans-serif"],
      },
      borderColor: {
        "emerald-card": "rgba(93,202,165,0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
