import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-blue": "#18A9F2",
        "light-blue": "#91d2e4",
        "dark-green": "#4FB848",
        "light-green": "#bbe2c6",
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
