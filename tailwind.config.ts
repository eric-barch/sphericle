import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        "dark-blue": "#18a9f2",
        "light-blue": "#91d2e4",
        "dark-green": "#50b848",
        "light-green": "#bbe2c6",
        red: {
          1: "#b91c1c",
        },
        gray: {
          1: "#15202b",
          2: "#192734",
          3: "#22303c",
          4: "#8899ac",
          5: "#c3cbd5",
          6: "#e7ebef",
        },
      },
      borderRadius: {
        1.25: "1.25rem",
      },
      keyframes: {
        rotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "spin-slow": "rotate 1s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
