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
        blue: {
          1: "#18a9f2",
          2: "#91d2e4",
        },
        green: {
          1: "#50b848",
          2: "#bbe2c6",
        },
        red: {
          1: "#e1bbbb",
        },
        gray: {
          1: "#1b2436",
          2: "#2f3c4e",
          3: "#9da4af",
          4: "#c1c6cf",
          5: "#d6d8dd",
          6: "#eaeaea",
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
