import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFEFB",
          100: "#FFFDF5",
          200: "#FFF8E6",
          300: "#FFF2CF",
          400: "#FFE8A8",
          500: "#F8D878",
          600: "#EFC24A",
          700: "#D3A12D",
          800: "#A67A16",
          900: "#6E500D",
        },
        ink: {
          DEFAULT: "#2D2718",
          soft: "#5F553F",
          muted: "#8B7E62",
          faint: "#B4A98F",
        },
        leaf: {
          100: "#EEF6DF",
          500: "#7C9A4A",
          700: "#4E672A",
        },
        clay: {
          100: "#FCEBDD",
          500: "#C47A45",
        },
        sky: {
          100: "#E7F1F5",
          500: "#4E8297",
        },
      },
      fontFamily: {
        sans: ["Nunito Variable", "Nunito", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Nunito Variable", "Nunito", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 16px 40px -24px rgba(102, 78, 20, 0.28)",
        lift: "0 24px 60px -28px rgba(102, 78, 20, 0.38)",
        insetline: "inset 0 0 0 1px rgba(211, 161, 45, 0.18)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "soft-pop": {
          "0%": { opacity: "0", transform: "scale(0.94)" },
          "70%": { opacity: "1", transform: "scale(1.02)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-ring": {
          "0%, 100%": { opacity: "0.35", transform: "scale(0.96)" },
          "50%": { opacity: "0.65", transform: "scale(1.04)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
        "soft-pop": "soft-pop 0.3s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-ring": "pulse-ring 5s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
      backgroundImage: {
        "grain":
          "radial-gradient(circle at 1px 1px, rgba(106, 82, 23, 0.08) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;
