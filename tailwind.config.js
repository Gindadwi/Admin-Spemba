/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },

      colors: {
        BiruPekat: "#004B79",
        BiruLow: "#1D87CA",
        BiruMedium: "#2371A3",
      },
    },
  },
  plugins: [],
});
