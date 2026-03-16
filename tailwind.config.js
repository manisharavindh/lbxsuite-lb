/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F0EEE6",
        foreground: "#141413"
      },
      fontFamily: {
        serif: ['"GT Super"', 'Recoleta', 'serif'],
        sans: ['Inter', 'Roobert', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
