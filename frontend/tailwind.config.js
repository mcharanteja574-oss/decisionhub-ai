/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07111f",
        panel: "#0b1728",
        cloud: "#dbe7ff",
        googleBlue: "#4285f4",
        googleGreen: "#34a853",
        googleYellow: "#fbbc04",
        googleRed: "#ea4335",
      },
      boxShadow: {
        glow: "0 24px 80px rgba(66, 133, 244, 0.28)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

