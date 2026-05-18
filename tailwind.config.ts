import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#B71C1C",
          accent:  "#D32F2F",
          deep:    "#7F0000",
          subtle:  "#F8EEEE",
          surface: "#F5F5F5",
          text:    "#212121",
          muted:   "#757575",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body:    ["var(--font-body)", "serif"],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        floatBlob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%":       { transform: "translate(20px, -20px) scale(1.05)" },
        },
        gradientShift: {
          "0%":   { backgroundPosition: "0% 50%" },
          "50%":  { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        fadeUp:        "fadeUp 0.7s ease forwards",
        floatBlob:     "floatBlob 8s ease-in-out infinite",
        gradientShift: "gradientShift 6s ease infinite",
      },
    },
  },
  plugins: [],
};

export default config;
