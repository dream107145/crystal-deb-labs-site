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
        crystal: {
          blue: "#00D4FF",
          purple: "#6B46C1",
          cyan: "#00F5FF",
          dark: "#0A0A0F",
          darker: "#1A1A2E",
        },
        muted: "#E0E0E0",
      },
      fontFamily: {
        heading: ["var(--font-sora)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-dark": "linear-gradient(180deg, #0A0A0F 0%, #1A1A2E 100%)",
        "gradient-crystal":
          "linear-gradient(135deg, #00D4FF 0%, #6B46C1 50%, #00F5FF 100%)",
        "gradient-glow":
          "radial-gradient(ellipse at center, rgba(0, 212, 255, 0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 245, 255, 0.2)",
        "glow-lg":
          "0 0 30px rgba(0, 212, 255, 0.5), 0 0 60px rgba(107, 70, 193, 0.3)",
        "glow-purple": "0 0 25px rgba(107, 70, 193, 0.5)",
      },
      animation: {
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "bounce-slow": "bounce 2s infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
