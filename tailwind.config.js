/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        main: "#8750f7",
        secondary: "#0B0D1D",
        backgroundDark: {
          default: "#13181F",
          paper: "#171E27",
        },
      },
    },
  },
  plugins: [],
};
