import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cmint: {
          cyan: "#00E5FF",
          cyanGlow: "#21AFFF",
          pink: "#FF00F5",
          magenta: "#D100FF",
          blue: "#007CFF",
          royal: "#004CFF",
          fuchsia: "#FF00A8",
          orange: "#FF6A00",
          gold: "#FFB020",
        },
        surface: {
          dark: "#050009",
          tech: "#0A0F24",
          p1:   "#0F0B1A",
          p2:   "#1A1226",
        },
      },
      backgroundImage: {
        "cmint-gradient": "linear-gradient(135deg, #00E5FF 0%, #FF00F5 100%)",
        "rackdog-gradient": "linear-gradient(135deg, #FF6A00 0%, #FFB020 100%)",
      },
      boxShadow: {
        "cmint-glow": "0 0 25px rgba(0,229,255,0.4), 0 0 45px rgba(255,0,245,0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
